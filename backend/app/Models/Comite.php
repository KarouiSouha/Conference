<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comite extends Model
{
       protected $fillable = [
        'name_fr',
        'name_en',
        'institute_fr',
        'institute_en',
        'job_fr',
        'job_en',
        'committee_type',
        'special_role',
        'order'
    ];

    protected $casts = [
        'order' => 'integer'
    ];
}
