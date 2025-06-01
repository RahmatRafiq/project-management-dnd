<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Task;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Arr;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        if (User::count() < 5) {
            User::factory()->count(5)->create();
        }
        $users = User::all();

        foreach (range(1, 10) as $i) {
            $project = Project::create([
                'name'        => $faker->words(3, true),
                'description' => $faker->sentence(),
                'metadata'    => ['key' => $faker->word],
                'is_active'   => $faker->boolean(),
            ]);

            foreach (range(1, rand(2, 5)) as $j) {
                $task = Task::create([
                    'project_id' => $project->id,
                    'title'      => $faker->sentence(3),
                    'details'    => $faker->paragraph(),
                    'start_date' => $faker->dateTimeBetween('-1 month', 'now'),
                    'end_date'   => $faker->dateTimeBetween('now', '+1 month'),
                    'done'       => $faker->boolean(),
                    'tags'       => $faker->words(2),
                ]);

                $assignedUsers = $users->random(rand(1, 3));
                $task->users()->attach($assignedUsers->pluck('id'));

                foreach (range(1, rand(1, 3)) as $k) {
                    Comment::create([
                        'task_id' => $task->id,
                        'user_id' => $assignedUsers->random()->id,
                        'body'    => $faker->sentence(),
                    ]);
                }
            }
        }
    }
}
