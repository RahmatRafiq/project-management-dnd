import React, { FormEvent, useState } from 'react'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'
import { TaskWithComments } from '@/types/Extended'
import TaskCard from './TaskCard'

export type StatusKey = 'in_progress' | 'done'

interface Column {
    title: string
    tasks: TaskWithComments[]
}

interface ColumnsMap {
    [key: string]: Column
}

const groupTasks = (tasks: TaskWithComments[]): ColumnsMap => {
    const cols: ColumnsMap = {
        in_progress: { title: 'In Progress', tasks: [] },
        done: { title: 'Done', tasks: [] },
    }
    tasks.forEach(t => {
        const key: StatusKey = t.done ? 'done' : 'in_progress'
        cols[key].tasks.push(t)
    })
    return cols
}
interface KanbanBoardProps {
    initialTasks: TaskWithComments[]
    onToggleDone: (taskId: number) => Promise<void>
}

export default function KanbanBoard({ initialTasks, onToggleDone }: KanbanBoardProps) {

    const [columns, setColumns] = useState<ColumnsMap>(groupTasks(initialTasks))
    const [commentInputs, setCommentInputs] = useState<{ [taskId: number]: string }>({})
    const [errors, setErrors] = useState<{ [taskId: number]: string | null }>({})

    const handleInputChange = (taskId: number, value: string) => {
        setCommentInputs(prev => ({ ...prev, [taskId]: value }))
    }

    const handleSubmit = async (e: FormEvent, taskId: number) => {
        e.preventDefault()
        const comment = commentInputs[taskId]?.trim()
        if (!comment) return

        try {
            const response = await fetch(route('tasks.comment', { task: taskId }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
                },
                body: JSON.stringify({ body: comment }),
            })

            const data = await response.json()

            setColumns(prev => {
                const newCols = { ...prev }
                for (const key in newCols) {
                    newCols[key].tasks = newCols[key].tasks.map(t =>
                        t.id === taskId
                            ? { ...t, comments: [...t.comments, data.comment] }
                            : t
                    )
                }
                return newCols
            })

            setCommentInputs(prev => ({ ...prev, [taskId]: '' }))
            setErrors(prev => ({ ...prev, [taskId]: null }))
        } catch (err) {
            console.error(err);
            setErrors('Network error');
        }
    }

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return

        const srcCol = source.droppableId as StatusKey
        const destCol = destination.droppableId as StatusKey
        if (srcCol === destCol) return

        const sourceTasks = Array.from(columns[srcCol].tasks)
        const [moved] = sourceTasks.splice(source.index, 1)
        const destTasks = Array.from(columns[destCol].tasks)

        moved.done = destCol === 'done'
        destTasks.splice(destination.index, 0, moved)

        setColumns({
            ...columns,
            [srcCol]: { ...columns[srcCol], tasks: sourceTasks },
            [destCol]: { ...columns[destCol], tasks: destTasks },
        })

        try {
            await onToggleDone(moved.id)
        } catch (error) {
            console.error('Failed to update status:', error)
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4">
                {(['in_progress', 'done'] as StatusKey[]).map(key => (
                    <Droppable key={key} droppableId={key}>
                        {provided => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 h-[80vh] overflow-auto"
                            >
                                <h3 className="font-bold mb-2">{columns[key].title}</h3>
                                {columns[key].tasks.map((task, index) => (
                                    <Draggable
                                        key={task.id.toString()}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(prov, snap) => (
                                            <div
                                                ref={prov.innerRef}
                                                {...prov.draggableProps}
                                                {...prov.dragHandleProps}
                                                className={`mb-2 ${snap.isDragging ? 'shadow-lg' : ''}`}
                                            >
                                                <TaskCard
                                                    task={task}
                                                    commentInput={commentInputs[task.id] || ''}
                                                    onInputChange={e => handleInputChange(task.id, e.target.value)}
                                                    onSubmit={e => handleSubmit(e, task.id)}
                                                    error={errors[task.id] || null}
                                                    onToggleDone={() => onToggleDone(task.id)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}
