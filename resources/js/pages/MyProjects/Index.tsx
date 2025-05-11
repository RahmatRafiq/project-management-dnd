import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Head } from '@inertiajs/react'

import AppLayout from '@/layouts/app-layout'
import HeadingSmall from '@/components/heading-small'

import { ProjectWithTasks, TaskWithComments } from '@/types/Extended'
import MyProjectsLayout from '@/layouts/project/myproject'
import TaskCard from './TaskCard'

type Props = {
    projects: ProjectWithTasks[]
    currentProjectId?: number
    tasks?: TaskWithComments[]
}

export default function MyProjects({ projects, currentProjectId, tasks = [] }: Props) {
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)
    const [taskList, setTaskList] = useState<TaskWithComments[]>(tasks)

    const handleInputChange =
        (taskId: string) => (e: ChangeEvent<HTMLTextAreaElement>) => {
            setCommentInputs(prev => ({ ...prev, [taskId]: e.target.value }))
        }

    const handleSubmit = (taskId: string) => async (e: FormEvent) => {
        e.preventDefault()
        const body = commentInputs[taskId]?.trim()
        if (!body) return

        setError(null)
        Inertia.post(
            route('tasks.comments.store', { task: taskId }),
            { body },
            {
                onSuccess: () => {
                    setCommentInputs(prev => ({ ...prev, [taskId]: '' }))
                },
                onError: (errors) => {
                    setError(errors.body || 'Failed to post comment.')
                },
            }
        )
    }
    const handleToggleDone = async (taskId: number) => {
        try {
            const response = await fetch(route('tasks.toggle-done', { task: taskId }), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })

            const data = await response.json()

            setTaskList(prev =>
                prev.map(task =>
                    task.id === taskId ? { ...task, done: data.done } : task
                )
            )
        } catch (error) {
            console.error('Toggle failed:', error)
        }
    }


    return (
        <AppLayout>
            <MyProjectsLayout
                projects={projects}
                currentProjectId={currentProjectId?.toString() || ''}
            >
                <Head title="My Projects" />
                <div>
                    {currentProjectId == null ? (
                        <HeadingSmall
                            title="Select a Project"
                            description="Choose one from the sidebar to view your tasks."
                        />
                    ) : (
                        <>
                            <HeadingSmall
                                title="Your Tasks"
                                description="Tasks assigned to you in this project."
                            />

                            {taskList.length === 0 ? (
                                <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
                                    You have no tasks in this project.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {taskList.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            commentInput={commentInputs[task.id] || ''}
                                            onInputChange={handleInputChange(task.id.toString())}
                                            onSubmit={handleSubmit(task.id.toString())}
                                            error={error}
                                            onToggleDone={handleToggleDone}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </MyProjectsLayout>
        </AppLayout>
    )
}

