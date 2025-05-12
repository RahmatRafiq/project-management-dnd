<?php
namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyProjectController extends Controller
{
    public function index(Request $request)
    {
        $user     = $request->user();
        $projects = Project::whereHas('tasks.users', fn($q) => $q->where('id', $user->id))
            ->select('id', 'name')
            ->get();

        return Inertia::render('MyProjects/Index', [
            'projects'         => $projects,
            'currentProjectId' => null,
            'tasks'            => [],
        ]);
    }

    public function show(Request $request, Project $project)
    {
        $user = $request->user();
        if (! $project->tasks()->whereHas('users', fn($q) => $q->where('id', $user->id))->exists()) {
            abort(403);
        }

        $projects = Project::whereHas('tasks.users', fn($q) => $q->where('id', $user->id))
            ->select('id', 'name')
            ->get();

        $tasks = $project->tasks()
            ->whereHas('users', fn($q) => $q->where('id', $user->id))
            ->with(['comments.user'])
            ->get();

        return Inertia::render('MyProjects/Index', [
            'projects'         => $projects,
            'currentProjectId' => $project->id,
            'tasks'            => $tasks,
        ]);
    }
    public function storeComment(Request $request, Task $task)
    {
        $data = $request->validate([
            'body' => 'required|string|max:3000',
        ]);

        abort_unless(
            $task->users()->where('users.id', $request->user()->id)->exists(),
            403
        );

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $data['body'],
        ]);

        $comment->load('user');

        return response()->json([
            'status'  => 'ok',
            'comment' => $comment,
        ], 201);
    }

    public function toggleDone(Request $request, Task $task)
    {
        if (! $task->users()->where('users.id', $request->user()->id)->exists()) {
            abort(403);
        }

        $task->done = ! $task->done;
        $task->save();

        return response()->json([
            'status' => 'ok',
            'done'   => $task->done,
        ]);
    }

}
