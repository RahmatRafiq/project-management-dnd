<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\UserRolePermission\PermissionController;
use App\Http\Controllers\UserRolePermission\RoleController;
use App\Http\Controllers\UserRolePermission\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('auth/{provider}', [SocialAuthController::class, 'redirectToProvider'])->name('auth.redirect');
Route::get('auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])->name('auth.callback');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('dashboard');

    Route::delete('/settings/profile/delete-file', [\App\Http\Controllers\Settings\ProfileController::class, 'deleteFile'])->name('profile.deleteFile');
    Route::post('/settings/profile/upload', [\App\Http\Controllers\Settings\ProfileController::class, 'upload'])->name('profile.upload');
    Route::post('/temp/storage', [\App\Http\Controllers\StorageController::class, 'store'])->name('storage.store');
    Route::delete('/temp/storage', [\App\Http\Controllers\StorageController::class, 'destroy'])->name('storage.destroy');
    Route::get('/temp/storage/{path}', [\App\Http\Controllers\StorageController::class, 'show'])->name('storage.show');

    Route::post('roles/json', [RoleController::class, 'json'])->name('roles.json');
    Route::resource('roles', RoleController::class);
    Route::post('permissions/json', [PermissionController::class, 'json'])->name('permissions.json');
    Route::resource('permissions', PermissionController::class);

    Route::middleware('role:administrator')->group(function () {
        Route::post('users/json', [UserController::class, 'json'])->name('users.json');
        Route::resource('users', UserController::class);
        Route::get('users/trashed', [UserController::class, 'trashed'])->name('users.trashed');
        Route::post('users/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
        Route::delete('users/{user}/force-delete', [UserController::class, 'forceDelete'])->name('users.force-delete');
    });

    Route::post('projects/json', [\App\Http\Controllers\ProjectController::class, 'json'])->name('projects.json');
    Route::resource('projects', \App\Http\Controllers\ProjectController::class);
    Route::get('projects/trashed', [\App\Http\Controllers\ProjectController::class, 'trashed'])->name('projects.trashed');
    Route::post('projects/{project}/restore', [\App\Http\Controllers\ProjectController::class, 'restore'])->name('projects.restore');
    Route::delete('projects/{project}/force-delete', [\App\Http\Controllers\ProjectController::class, 'forceDelete'])->name('projects.force-delete');
    Route::post('projects/upload', [\App\Http\Controllers\ProjectController::class, 'uploadDocument'])->name('projects.upload');
    Route::post('projects/delete-file', [\App\Http\Controllers\ProjectController::class, 'deleteFile'])->name('projects.deleteFile');

    Route::post('tasks/json', [\App\Http\Controllers\TaskController::class, 'json'])->name('tasks.json');
    Route::resource('tasks', \App\Http\Controllers\TaskController::class);
    Route::get('tasks/trashed', [\App\Http\Controllers\TaskController::class, 'trashed'])->name('tasks.trashed');
    Route::post('tasks/{task}/restore', [\App\Http\Controllers\TaskController::class, 'restore'])->name('tasks.restore');
    Route::delete('tasks/{task}/force-delete', [\App\Http\Controllers\TaskController::class, 'forceDelete'])->name('tasks.force-delete');

    Route::post('activity-logs/json', [ActivityLogController::class, 'jsonBySubject'])->name('activity-logs.json');

    Route::get('/my-projects', [\App\Http\Controllers\MyProjectController::class, 'index'])->name('my-projects.index');
    Route::post('/tasks/{task}/comments', [\App\Http\Controllers\MyProjectController::class, 'storeComment'])->name('tasks.comments.store');
    Route::get('/my-projects/{project}', [\App\Http\Controllers\MyProjectController::class, 'show'])->name('my-projects.show');
    Route::patch('/tasks/{task}/toggle-done', [\App\Http\Controllers\MyProjectController::class, 'toggleDone'])->name('tasks.toggle-done');

    Route::post('logout', [SocialAuthController::class, 'logout'])->name('logout');
});

Route::get('/dashboard/activity-logs', function () {
    return Inertia::render('ActivityLogList');
})->middleware(['auth']);

Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-log.index');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
