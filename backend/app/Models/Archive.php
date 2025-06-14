<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    protected $fillable = [
        'event_name',
        'subject_fr',
        'subject_en',
        'organizer',
        'participants',
        'articles',
        'countries',
        'photoGalleryLink'
    ];
}
