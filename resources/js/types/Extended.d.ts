import { Project } from './Projects'
import { Task } from './Tasks'

export interface Comment {
    id: string | number
    body: string
    created_at: string
    updated_at: string
    user: {
        id: number
        name: string
        avatar_url?: string
    }
}

export interface TaskWithComments extends Task {
    id: number
    description: string
    comments: Comment[]
}

export interface ProjectWithTasks extends Project {
    tasks: TaskWithComments[]
}

export interface PageProps{
    comment: Comment
}
