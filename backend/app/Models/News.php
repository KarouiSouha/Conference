<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'type_en',
        'type_fr',
        'title_en',
        'title_fr',
        'date_fr',
        'author',
        'description_en',
        'description_fr',
        'link'
    ];
}
