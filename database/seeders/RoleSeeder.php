<?php
namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        Role::firstOrCreate([
            'name' => 'admin',
        ]);

        for ($i = 0; $i < 20; $i++) {
            Role::firstOrCreate([
                'name' => $faker->unique()->jobTitle(),
            ]);
        }
    }
}
