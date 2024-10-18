<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $table = 'templates'; // Adjust table name if necessary
    public $timestamps = true; // Set to false if no timestamps are used

    protected $fillable = ['name', 'description', 'content']; // Add your fillable fields here

    // Define relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
