
import { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import { Task } from '@/types/Tasks';
import ToggleTabs from '@/components/toggle-tabs';

const columns = (filter: string) => [
    { data: 'reference', title: 'Reference' },
    { data: 'title', title: 'Title' },
    { data: 'project', title: 'Project' },
    { data: 'date_end', title: 'Due Date' },
    {
        data: 'done',
        title: 'Done',
        render: (data: null, _type: string, row: unknown) => {
            const task = row as Task;
            return task.done
                ? '<span class="text-green-600">Yes</span>'
                : '<span class="text-red-600">No</span>';
        }
    },
    {
        data: null,
        title: 'Actions',
        orderable: false,
        searchable: false,
        render: (_: null, __: string, row: unknown) => {
            const task = row as Task;
            let html = '';
            if (filter === 'trashed' || (filter === 'all' && task.trashed)) {
                html += `<button class="btn-restore ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" data-id="${task.id}">Restore</button>`;
                html += `<button class="btn-force-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${task.id}">Force Delete</button>`;
            } else {
                html += `<span class="inertia-link-cell" data-id="${task.id}"></span>`;
                html += `<button class="btn-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${task.id}">Delete</button>`;
            }
            return html;
        },
    },
];

export default function TaskIndex({ filter: initialFilter, success }: { filter: string; success?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks', href: '/tasks' }];
    const dtRef = useRef<DataTableWrapperRef>(null);
    const [filter, setFilter] = useState(initialFilter || 'active');

    const handleDelete = (id: string) => {
        router.delete(route('tasks.destroy', id), {
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    const handleRestore = (id: string) => {
        router.post(route('tasks.restore', id), {}, {
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    const handleForceDelete = (id: string) => {
        router.delete(route('tasks.force-delete', id), {
            onSuccess: () => dtRef.current?.reload(),
        });
    };

    const drawCallback = () => {
        document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
            const id = cell.getAttribute('data-id');
            if (id) {
                const root = ReactDOM.createRoot(cell);
                root.render(
                    <Link
                        href={`/tasks/${id}/edit`}
                        className="inline-block ml-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-center"
                    >
                        Edit
                    </Link>
                );
            }
        });

        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) handleDelete(String(id));
            });
        });
        document.querySelectorAll('.btn-restore').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) handleRestore(String(id));
            });
        });
        document.querySelectorAll('.btn-force-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) handleForceDelete(String(id));
            });
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="px-4 py-6">
                <HeadingSmall title="Tasks" description="Manage tasks" />
                <div className="flex items-center justify-between mb-4">
                    <ToggleTabs tabs={['active', 'trashed', 'all']} active={filter} onChange={setFilter} />
                    <Link href={route('tasks.create')}>
                        <Button>Create Task</Button>
                    </Link>
                </div>

                {success && (
                    <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{success}</div>
                )}

                <DataTableWrapper
                    key={filter}
                    ref={dtRef}
                    ajax={{
                        url: route('tasks.json') + '?filter=' + filter,
                        type: 'POST',
                    }}
                    columns={columns(filter)}
                    options={{ drawCallback }}
                />
            </div>
        </AppLayout>
    );
}
