<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Template::create([
            'name' => 'Template 1',
            'content' => 'This is the content of Template 1', // Provide a value for content
        ]);

        Template::create([
            'name' => 'Template 2',
            'content' => 'This is the content of Template 2', // Provide a value for content
        ]);

    }
}
