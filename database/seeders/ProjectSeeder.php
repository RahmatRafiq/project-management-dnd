<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        foreach (range(1, 50) as $index) {
            Project::create([
                'name'        => $faker->words(3, true),
                'description' => $faker->sentence(),
                'metadata'    => ['key' => $faker->word],
                'is_active'   => $faker->boolean(),
            ]);
        }
    }
}
