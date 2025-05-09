export interface Project {
    id: number;
    reference: string;
    name: string;
    description?: string | null;
    metadata?: Record<string, string | number | boolean | null> | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    trashed?: boolean;
}