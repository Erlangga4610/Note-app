<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id(); // Pengganti note_id (BigInt AI Primary Key)
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relasi ke users
            $table->string('title', 150)->nullable(); // Judul (boleh kosong)
            $table->text('content'); // Isi (isi)
            $table->string('color', 20)->default('white'); // Warna background note
            $table->boolean('is_pinned')->default(false); // Fitur Pin
            $table->boolean('is_archived')->default(false); // Arsip
            $table->timestamps(); // created_at & updated_at
            $table->softDeletes(); // deleted_at (untuk fitur Trash bin)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
