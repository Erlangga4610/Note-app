<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends Model
{

    use SoftDeletes;
    
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'color',
        'is_pinned',
        'is_archived',
        'image',
    ];

    //relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Labels
    public function labels()
    {
        return $this->belongsToMany(Label::class);
    }
}
