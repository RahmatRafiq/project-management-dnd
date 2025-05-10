<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use HasFactory, Notifiable, SoftDeletes, InteractsWithMedia, LogsActivity;

    /**
     * The primary key type.
     *
     * @var string
     */

    /**
     * Indicates if the IDs are UUIDs.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reference',
        'name',
        'description',
        'metadata',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'metadata'  => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            if (empty($project->id)) {
                $project->id = (string) \Illuminate\Support\Str::uuid();
            }
            if (empty($project->reference)) {
                $project->reference = 'PROJ-' . strtoupper(uniqid());
            }
        });
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
public function getActivitylogOptions(): LogOptions
{
    return LogOptions::defaults()
        ->logOnly(['name', 'description', 'metadata', 'is_active'])
        ->logOnlyDirty()
        ->useLogName('Project')
        ->setDescriptionForEvent(function (string $eventName) {
            $causerName   = auth()->user() ? auth()->user()->name : 'Unknown User';
            $projectName  = $this->name;           

            return "{$causerName} has {$eventName} Project '{$projectName}'";
        });
}

}
