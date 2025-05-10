<?php
namespace App\Http\Controllers;

use App\Helpers\DataTable;
use App\Helpers\MediaLibrary;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Storage;

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
            'documents'   => 'array',
            'documents.*' => 'string',
        ]);

        $project = Project::create($request->only(['reference', 'name', 'description', 'metadata', 'is_active']));

        $project->clearMediaCollection('documents');

        if ($request->filled('documents')) {
            MediaLibrary::put($project, 'documents', $request, 'documents');
        }

        return redirect()->route('projects.index')->with('success', 'Project berhasil dibuat.');
    }

    public function uploadDocument(Request $request)
    {
        $request->validate([
            'project_id'  => 'required|integer|exists:projects,id',
            'documents.*' => 'required|file|max:5120|mimes:pdf,doc,docx,xlsx',
        ]);

        $project = Project::findOrFail($request->project_id);

        $file  = $request->file('documents')[0];
        $path  = Storage::disk('temp')->putFile('', $file);
        $media = $project
            ->addMediaFromDisk($path, 'temp')
            ->toMediaCollection('documents');
        Storage::disk('temp')->delete($path);

        return response()->json([
            'name' => $media->file_name,
            'url'  => $media->getFullUrl(),
        ], 200);
    }

    public function edit(Project $project)
    {
        $mediaCollection = $project->getMedia('documents');

        $documents = $mediaCollection->map(fn($m) => [
            'file_name'    => $m->file_name,
            'size'         => $m->size,
            'original_url' => $m->getFullUrl(),
        ]);
        return Inertia::render('Projects/Form', [
            'project'   => $project,
            'documents' => $documents,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'metadata'    => 'nullable|array',
            'is_active'   => 'boolean',
            'documents'   => 'array',
            'documents.*' => 'string',
        ]);

        $project->update($request->only(['name', 'description', 'metadata', 'is_active']));

        $newDocuments = $request->input('documents', []);

        $existingMedia = $project->getMedia('documents');

        foreach ($existingMedia as $media) {
            if (! in_array($media->file_name, $newDocuments)) {
                $media->delete();
            }
        }

        if ($request->filled('documents')) {
            MediaLibrary::put($project, 'documents', $request, 'documents');
        }

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

    public function deleteFile(Request $request)
    {
        $data = $request->validate(['filename' => 'required|string']);

        if (Storage::disk('documents')->exists($data['filename'])) {
            Storage::disk('documents')->delete($data['filename']);
        }

        $media = Media::where('file_name', $data['filename'])->first();
        if ($media) {
            $media->delete();
        }

        return response()->json(['message' => 'File berhasil dihapus'], 200);
    }

}
