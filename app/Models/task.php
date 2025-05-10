<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Task extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia, LogsActivity;

    public $incrementing = false;
    protected $keyType   = 'uuid';
    protected $fillable  = [
        'reference',
        'project_id',
        'title',
        'details',
        'start_date',
        'end_date',
        'done',
        'tags',
    ];

    protected $casts = [
        'due_date'   => 'datetime',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'done'       => 'boolean',
        'tags'       => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function assignedUsers()
    {
        return $this->users();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($task) {
            if (empty($task->id)) {
                $task->id = (string) \Illuminate\Support\Str::uuid();
            }
            if (empty($task->reference)) {
                $task->reference = 'TASK-' . strtoupper(uniqid());
            }
        });
    }
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['reference', 'project_id', 'title', 'details', 'start_date', 'end_date', 'done', 'tags'])
            ->logOnlyDirty()
            ->useLogName('Task')
            ->setDescriptionForEvent(function (string $eventName) {
                $causerName = auth()->user()->name ?? 'Unknown User';
                $taskTitle  = $this->title;

                $dirty = collect($this->getDirty())
                    ->except('updated_at')
                    ->keys()
                    ->implode(', ');

                $changedText = $dirty ? ". Changed: {$dirty}" : '';

                return "{$causerName} has {$eventName} Task '{$taskTitle}'{$changedText}";
            });
    }
}
