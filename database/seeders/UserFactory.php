<?php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'              => $this->faker->name(),
            'email'             => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => 'password',
            'provider_id'       => $this->faker->randomNumber(),
            'provider'          => $this->faker->randomElement(['google', 'facebook', 'twitter', null]),
            'remember_token'    => Str::random(10),
        ];
    }
}
