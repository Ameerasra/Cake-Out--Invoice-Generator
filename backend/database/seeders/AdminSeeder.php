<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin exists
        if (!User::where('email', 'admin@cakeout.com')->exists()) {
            User::create([
                'name' => 'Cake Out Admin',
                'email' => 'admin@cakeout.com',
                'password' => Hash::make('password'),
            ]);
        }
    }
}
