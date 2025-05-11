import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';

type AdminData = {
    role: 'administrator';
    totalUsers: number;
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
};

type UserData = {
    role: 'applicant';
    totalTasks: number;
    completedTasks: number;
    incompleteTasks: number;
    projects: {
        id: number;
        name: string;
        total_tasks: number;
        completed_tasks: number;
    }[];
};

type DashboardProps = PageProps & (AdminData | UserData);

export default function Dashboard() {
    const { props } = usePage<DashboardProps>();

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
                {props.role === 'administrator' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Users" value={props.totalUsers} />
                        <StatCard label="Total Projects" value={props.totalProjects} />
                        <StatCard label="Total Tasks" value={props.totalTasks} />
                        <StatCard label="Completed Tasks" value={props.completedTasks} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard label="Total Tasks" value={props.totalTasks} />
                            <StatCard label="Completed Tasks" value={props.completedTasks} />
                            <StatCard label="In Progress" value={props.incompleteTasks} />
                        </div>

                        <h2 className="mt-6 text-xl font-semibold">Projects Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {props.projects.map((project) => {
                                const total = project.total_tasks || 0;
                                const done = project.completed_tasks || 0;
                                const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

                                return (
                                    <div
                                        key={project.id}
                                        className="p-4 border rounded-lg bg-white dark:bg-neutral-900 shadow flex flex-col gap-2"
                                    >
                                        <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {done} of {total} tasks completed
                                        </p>
                                        <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded">
                                            <div
                                                className="h-full bg-indigo-600 rounded transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                                            {percentage}% complete
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="p-4 border rounded-lg bg-white dark:bg-neutral-900 shadow">
            <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{value}</p>
        </div>
    );
}