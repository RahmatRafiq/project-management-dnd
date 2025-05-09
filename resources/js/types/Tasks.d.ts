export interface Task {
    id: string;
    reference: string;
    project_id: string;
    title: string;
    details?: string | null;
    due_date?: string | null;
    done: boolean;
    tags?: { [key: string]: string | number | boolean }[] | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    trashed?: boolean;
    assigned_users?: User[] | null;
}