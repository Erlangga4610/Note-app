<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NoteController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Halaman Awal (Root URL)
// LOGIKA BARU: Cek login dulu.
Route::get('/', function () {
    // Jika user sudah login -> Masuk ke Notes
    if (auth()->check()) {
        return redirect()->route('notes.index');
    }
    
    // Jika BELUM login -> Lempar ke halaman Login
    return redirect()->route('login');
});

// 2. Redirect Dashboard ke Notes
// Ini menangani redirect otomatis setelah user berhasil login
Route::get('/dashboard', function () {
    return redirect()->route('notes.index');
})->middleware(['auth', 'verified'])->name('dashboard');


// 3. Group Route untuk Fitur Notes (Harus Login)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- CRUD NOTES ---
    Route::get('/notes', [NoteController::class, 'index'])->name('notes.index');
    Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');
    Route::put('/notes/{note}', [NoteController::class, 'update'])->name('notes.update');
    Route::delete('/notes/{note}', [NoteController::class, 'destroy'])->name('notes.destroy');

    // --- FITUR SAMPAH (TRASH) ---
    Route::get('/trash', [NoteController::class, 'trash'])->name('notes.trash');
    Route::put('/notes/{id}/restore', [NoteController::class, 'restore'])->name('notes.restore');
    Route::delete('/notes/{id}/force', [NoteController::class, 'forceDelete'])->name('notes.force');

    // --- FITUR LABEL ---
    Route::post('/labels', [NoteController::class, 'storeLabel'])->name('labels.store');
    Route::delete('/labels/{id}', [NoteController::class, 'destroyLabel'])->name('labels.destroy');
});


// 4. Profile Routes (Bawaan Laravel Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';