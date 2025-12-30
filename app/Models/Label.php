<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Label extends Model
{
    use HasFactory;

    // Kolom yang boleh diisi
    protected $fillable = ['user_id', 'name'];

    // Relasi: Satu Label bisa dimiliki banyak Note (Many-to-Many)
    public function notes()
    {
        return $this->belongsToMany(Note::class);
    }
    
    // Relasi: Label milik User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}