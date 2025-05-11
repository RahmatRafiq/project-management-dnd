<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'task_id',
        'user_id',
        'body',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($comment) {
            if (empty($comment->id)) {
                $comment->id = (string) Str::uuid();
                /**
                 * Get the user that owns the comment.
                 */
            }
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
