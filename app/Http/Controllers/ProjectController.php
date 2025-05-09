<?php
namespace App\Http\Controllers;

use App\Helpers\DataTable;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $filter   = $request->query('filter', 'active');
        $projects = match ($filter) {
            'trashed' => Project::onlyTrashed()->get(),
            'all' => Project::withTrashed()->get(),
            default => Project::all(),
        };

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filter'   => $filter,
        ]);
    }
    public function json(Request $request)
    {
        $search = $request->input('search.value', '');
        $filter = $request->input('filter', 'active');

        $query = match ($filter) {
            'trashed' => Project::onlyTrashed(),
            'all' => Project::withTrashed(),
            default => Project::query(),
        };

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $columns = ['reference', 'name', 'description', 'created_at', 'updated_at'];
        if ($request->filled('order')) {
            $orderColumn = $columns[$request->order[0]['column']] ?? 'id';
            $query->orderBy($orderColumn, $request->order[0]['dir']);
        }

        $data = DataTable::paginate($query, $request);

        $data['data'] = collect($data['data'])->map(function ($project) {
            return [
                'id'          => $project->id,
                'reference'   => $project->reference,
                'name'        => $project->name,
                'description' => $project->description,
                'is_active'   => $project->is_active,
                'trashed'     => $project->trashed(),
                'actions'     => '',
            ];
        });

        return response()->json($data);
    }

    public function create()
    {
        return Inertia::render('Projects/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'metadata'    => 'nullable|array',
            'is_active'   => 'boolean',
        ]);

        Project::create($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Projects/Form', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'metadata'    => 'nullable|array',
            'is_active'   => 'boolean',
        ]);

        $project->update($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil diupdate.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus.');
    }

    public function trashed()
    {
        $projects = Project::onlyTrashed()->get();
        return Inertia::render('Projects/Trashed', [
            'projects' => $projects,
        ]);
    }

    public function restore($id)
    {
        Project::onlyTrashed()->where('id', $id)->restore();
        return redirect()->route('projects.index')->with('success', 'Project berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        Project::onlyTrashed()->where('id', $id)->forceDelete();
        return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus secara permanen.');
    }
}
