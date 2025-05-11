<?php
namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user    = $request->user();
        $isAdmin = $user->hasRole('administrator');

        $data = $isAdmin ? $this->getAdminDashboardData() : $this->getApplicantDashboardData($user);

        return Inertia::render('Dashboard', $data);
    }

    private function getAdminDashboardData()
    {
        return [
            'role'           => 'administrator',
            'totalUsers'     => User::count(),
            'totalProjects'  => Project::count(),
            'totalTasks'     => Task::count(),
            'completedTasks' => Task::where('done', true)->count(),
        ];
    }

    private function getApplicantDashboardData($user)
    {
        $userTasks = Task::whereHas('users', fn($q) => $q->where('id', $user->id))->get();

        $projectStats = Project::whereHas('tasks', fn($q) => $q->whereHas('users', fn($q2) => $q2->where('id', $user->id)))
            ->withCount([
                'tasks as total_tasks'     => fn($q)     => $q->whereHas('users', fn($q2) => $q2->where('id', $user->id)),
                'tasks as completed_tasks' => fn($q) => $q
                    ->where('done', true)
                    ->whereHas('users', fn($q2) => $q2->where('id', $user->id)),
            ])
            ->get()
            ->map(fn($project) => [
                'id'              => $project->id,
                'name'            => $project->name,
                'total_tasks'     => $project->total_tasks ?? 0,
                'completed_tasks' => $project->completed_tasks ?? 0,
            ]);

        return [
            'role'            => 'user',
            'totalTasks'      => $userTasks->count(),
            'completedTasks'  => $userTasks->where('done', true)->count(),
            'incompleteTasks' => $userTasks->where('done', false)->count(),
            'projects'        => $projectStats,
        ];
    }
}
