<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AiController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\MyTemplateController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // Template route
    Route::resource('/templates', MyTemplateController::class);

    // Knowledge base route

    Route::resource('/knowledgebase', KnowledgeBaseController::class);
    // User routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // AI routes
    Route::get('/ai', [AiController::class, 'index'])->name('ai');
    Route::post('/ai', [AiController::class, 'store'])->name('ai.store');
    Route::post('/ai/clear', [AIController::class, 'clear'])->name('ai.clear');
});






require __DIR__.'/auth.php';
