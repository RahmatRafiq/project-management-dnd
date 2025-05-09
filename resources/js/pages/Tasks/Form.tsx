import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Task } from '@/types/Tasks';
import { Project } from '@/types/Projects';
import { User } from '@/types/UserRolePermission';
import { Textarea } from '@headlessui/react';
import CustomSelect from '@/components/select';
import { MultiValue, SingleValue } from 'react-select';

type ProjectOption = { value: string; label: string };
type UserOption = { value: number; label: string };

export default function TaskForm({
    task,
    projects,
    users,
}: {
    task?: Task;
    projects: Project[];
    users: User[];
}) {
    const isEdit = Boolean(task);

    const { data, setData, post, put, processing, errors } = useForm({
        project_id: task?.project_id ?? '',
        title: task?.title ?? '',
        details: task?.details ?? '',
        start_date: task?.start_date ?? '',
        end_date: task?.end_date ?? '',
        done: task?.done ?? false,
        tags: task?.tags ?? [],
        user_ids: Array.isArray(task?.assigned_users)
            ? task.assigned_users.map(u => u.id)
            : [] as number[],
        pdf: null as File | null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tasks', href: '/tasks' },
        { title: isEdit ? 'Edit Task' : 'Create Task', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('tasks.update', task!.id));
        } else {
            post(route('tasks.store'));
        }
    };

    const projectOptions: ProjectOption[] = (projects ?? []).map(p => ({
        value: p.id,
        label: p.name,
    }));

    const userOptions: UserOption[] = (users ?? []).map(u => ({
        value: u.id,
        label: u.name,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Task' : 'Create Task'} />

            <div className="px-4 py-6">
                <h1 className="text-2xl font-semibold mb-4">Task Management</h1>

                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <div className="flex-1 md:max-w-2xl space-y-6">
                        <HeadingSmall
                            title={isEdit ? 'Edit Task' : 'Create Task'}
                            description="Fill in the details below"
                        />

                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="project_id">Project</Label>
                                <CustomSelect<ProjectOption>
                                    id="project_id"
                                    options={projectOptions}
                                    value={projectOptions.find(opt => opt.value === data.project_id) ?? null}
                                    onChange={(newValue) => {
                                        setData('project_id', (newValue as SingleValue<ProjectOption>)?.value ?? '');
                                    }}
                                />

                                <InputError message={errors.project_id} />
                            </div>

                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="details">Details</Label>
                                <Textarea
                                    id="details"
                                    value={data.details}
                                    onChange={e => setData('details', e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    rows={3}
                                    onInput={e => {
                                        const t = e.target as HTMLTextAreaElement;
                                        t.style.height = 'auto';
                                        t.style.height = `${t.scrollHeight}px`;
                                    }}
                                />
                                <InputError message={errors.details} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div>
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="user_ids">Assigned Users</Label>
                                <CustomSelect<UserOption>
                                    id="user_ids"
                                    isMulti
                                    options={userOptions}
                                    value={userOptions.filter(opt => data.user_ids.includes(opt.value))}
                                    onChange={(newValue) => {
                                        setData(
                                            'user_ids',
                                            (newValue as MultiValue<UserOption>).map(opt => opt.value)
                                        );
                                    }}
                                />

                                <InputError message={errors.user_ids} />
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="done"
                                    checked={data.done}
                                    onChange={e =>
                                        setData('done', (e.target as HTMLInputElement).checked)
                                    }
                                />
                                <Label htmlFor="done" className="ml-2">
                                    Done
                                </Label>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Button disabled={processing}>
                                    {isEdit ? 'Update Task' : 'Create Task'}
                                </Button>
                                <Link
                                    href={route('tasks.index')}
                                    className="px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/70"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
