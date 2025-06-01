<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles first
        $adminRole         = Role::firstOrCreate(['name' => 'admin']);
        $administratorRole = Role::firstOrCreate(['name' => 'administrator']);

        // Create users and assign roles
        $user1 = User::create([
            'name'     => 'User 1',
            'email'    => 'user1@gmail.com',
            'password' => bcrypt('user1@gmail.com'),
        ]);
        $user1->assignRole($adminRole);

        $user2 = User::create([
            'name'     => 'User 2',
            'email'    => 'user2@gmail.com',
            'password' => bcrypt('user2@gmail.com'),
        ]);
        $user2->assignRole($administratorRole);

        $roles = Role::all();

        // Generate 20 users with Faker and assign random roles
        User::factory(20)->create()->each(function ($user) use ($roles) {
            $user->assignRole($roles->random());
        });

        // Optionally, generate 100 more users if needed
        // User::factory(100)->create()->each(function ($user) use ($roles) {
        //     $user->assignRole($roles->random());
        // });
    }
}
