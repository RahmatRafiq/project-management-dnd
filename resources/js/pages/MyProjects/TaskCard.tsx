import { Button } from "@/components/ui/button"
import { TaskWithComments } from "@/types/Extended"
import { ChangeEvent, FormEvent, useState } from "react"
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa"

type TaskCardProps = {
    task: TaskWithComments
    commentInput: string
    onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    onSubmit: (e: FormEvent) => void
    error: string | null
    onToggleDone: (taskId: number) => void
}

export default function TaskCard({ task, commentInput, onInputChange, onSubmit, error, onToggleDone }: TaskCardProps) {
    const [isToggling, setIsToggling] = useState(false)

    const toggleDone: () => void = () => {
        setIsToggling(true)
        onToggleDone(task.id)
        setTimeout(() => setIsToggling(false), 500)
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-800 border rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>

                <div className="mt-2 flex items-center gap-2">
                    <span className={`text-sm ${task.done ? 'text-green-600' : 'text-gray-500'} flex items-center gap-1`}>
                        {task.done ? <FaCheckCircle className="text-green-600" /> : <FaHourglassHalf className="text-gray-500" />}
                        Status: {task.done ? 'Done' : 'In Progress'}
                    </span>

                    <Button
                        size="sm"
                        variant={task.done ? 'secondary' : 'outline'}
                        onClick={toggleDone}
                        disabled={isToggling}
                    >
                        {isToggling ? 'Updating...' : `Mark as ${task.done ? 'Not Done' : 'Done'}`}
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="font-semibold text-sm">Comments</h4>
                <ul className="space-y-2 mt-2">
                    {task.comments.map(comment => (
                        <li key={comment.id} className="text-sm">
                            <strong>{comment.user.name}:</strong> {comment.body}
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={onSubmit} className="mt-4">
                <textarea
                    value={commentInput}
                    onChange={onInputChange}
                    className="w-full border rounded p-2"
                    placeholder="Add a comment..."
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <Button type="submit" className="mt-2">
                    Post Comment
                </Button>
            </form>
        </div>
    )
}