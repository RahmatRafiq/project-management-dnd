<?php
namespace App\Http\Controllers;

use App\Helpers\DataTable;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'active');
        $tasks  = match ($filter) {
            'trashed' => Task::onlyTrashed()->with('project')->get(),
            'all' => Task::withTrashed()->with('project')->get(),
            default => Task::with('project')->get(),
        };

        return Inertia::render('Tasks/Index', [
            'tasks'  => $tasks,
            'filter' => $filter,
        ]);
    }

    public function json(Request $request)
    {
        $search = $request->input('search.value', '');
        $filter = $request->input('filter', 'active');

        $query = match ($filter) {
            'trashed' => Task::onlyTrashed()->with('project'),
            'all' => Task::withTrashed()->with('project'),
            default => Task::with('project'),
        };

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        $columns = ['reference', 'title', 'project_id', 'date_start', 'date_end', 'done'];
        if ($request->filled('order')) {
            $col = $columns[$request->order[0]['column']] ?? 'reference';
            $query->orderBy($col, $request->order[0]['dir']);
        }

        $data         = DataTable::paginate($query, $request);
        $data['data'] = collect($data['data'])->map(function ($task) {
            $now = now();
            $endDate = $task->end_date ? \Carbon\Carbon::parse($task->end_date) : null;
            $countdown = $endDate ? $endDate->diff($now)->format('%d days %h hours') : null;

            return [
                'id'         => $task->id,
                'reference'  => $task->reference,
                'title'      => $task->title,
                'project'    => $task->project->name,
                'date_start' => $task->start_date,
                'date_end'   => $countdown,
                'done'       => $task->done,
                'trashed'    => $task->trashed(),
                'actions'    => '',
            ];
        });

        return response()->json($data);
    }

    public function create()
    {
        return Inertia::render('Tasks/Form', [
            'projects' => Project::all(),
            'users'    => User::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'title'      => 'required|string|max:255',
            'details'    => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
            'done'       => 'boolean',
            'tags'       => 'nullable|array',
            'user_ids'   => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
            'pdf'        => 'nullable|file|mimes:pdf|max:500',
        ]);

        $task = Task::create($request->only([
            'project_id', 'title', 'details', 'start_date', 'end_date', 'done', 'tags',
        ]));

        if ($request->filled('user_ids')) {
            foreach ($request->input('user_ids') as $userId) {
                $task->users()->attach($userId);
            }
        }

        if ($request->hasFile('pdf')) {
            $task->addMediaFromRequest('pdf')->usingName($task->reference)->toMediaCollection('pdfs');
        }

        return redirect()->route('tasks.index')->with('success', 'Task berhasil dibuat.');
    }

    public function edit(Task $task)
    {
        $task->load('assignedUsers');

        return Inertia::render('Tasks/Form', [
            'task'     => $task,
            'projects' => Project::all(),
            'users'    => User::all(),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'project_id' => 'required|uuid|exists:projects,id',
            'title'      => 'required|string|max:255',
            'details'    => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
            'done'       => 'boolean',
            'tags'       => 'nullable|array',
            'user_ids'   => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
            'pdf'        => 'nullable|file|mimes:pdf|max:500',
        ]);

        $task->update($request->only([
            'project_id', 'title', 'details', 'start_date', 'end_date', 'done', 'tags',
        ]));

        if ($request->filled('user_ids')) {
            $task->users()->sync($request->input('user_ids'));
        } else {
            $task->users()->detach();
        }

        if ($request->hasFile('pdf')) {
            $task->clearMediaCollection('pdfs')
                ->addMediaFromRequest('pdf')
                ->usingName($task->reference)
                ->toMediaCollection('pdfs');
        }

        return redirect()->route('tasks.index')->with('success', 'Task berhasil diupdate.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task berhasil dihapus.');
    }

    public function restore($id)
    {
        Task::onlyTrashed()->where('id', $id)->restore();
        return redirect()->route('tasks.index')->with('success', 'Task dipulihkan.');
    }

    public function forceDelete($id)
    {
        Task::onlyTrashed()->where('id', $id)->forceDelete();
        return redirect()->route('tasks.index')->with('success', 'Task dihapus permanen.');
    }
}
