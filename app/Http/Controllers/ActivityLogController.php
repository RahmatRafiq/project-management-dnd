<?php
namespace App\Http\Controllers;

use App\Helpers\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = Activity::latest()->take(20)->get();

        return Inertia::render('ActivityLogList', [
            'initialLogs' => $logs,
        ]);
    }
    public function jsonBySubject(Request $request)
    {
        $search      = $request->input('search.value', '');
        $filterEvent = $request->input('filterEvent', 'all');
        $subject     = $request->input('subject', 'all');

        $query = Activity::with('causer')
            ->when($filterEvent !== 'all', fn($q) => $q->where('event', $filterEvent))
            ->when($subject !== 'all', fn($q) => $q->where('subject_type', "App\\Models\\{$subject}"))
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('causer', fn($q2) => $q2->where('name', 'like', "%{$search}%"));
            });
        }

        $data = DataTable::paginate($query, $request);

        $data['data'] = collect($data['data'])->map(fn(Activity $log) => [
            'id'           => $log->id,
            'description'  => $log->description,
            'event'        => $log->event,
            'causer_name'  => optional($log->causer)->name,
            'subject_type' => class_basename($log->subject_type),
            'subject_id'   => $log->subject_id,
            'created_at'   => $log->created_at->format('Y-m-d H:i:s'),
            'properties'   => $log->properties,
        ]);

        return response()->json($data);
    }
}
