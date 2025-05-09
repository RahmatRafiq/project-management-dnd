<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskUser extends Model
{
    protected $table   = 'task_user'; // Specify the table name
    public $timestamps = false;       // Disable timestamps if not needed
}
