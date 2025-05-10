<?php
namespace App\Http\Controllers;

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
}
