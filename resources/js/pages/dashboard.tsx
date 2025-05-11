import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

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
    projects: { id: number; name: string; total_tasks: number; completed_tasks: number }[];
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
                            {props.projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 border rounded shadow-sm bg-white dark:bg-neutral-900"
                                >
                                    <h3 className="text-lg font-medium">{project.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Tasks: {project.total_tasks || 0}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Completed Tasks: {project.completed_tasks || 0}
                                    </p>
                                </div>
                            ))}
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
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}