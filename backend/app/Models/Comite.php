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
        'special_role',
        'committee_type',
        'order',
        'image_path'
    ];

    protected $casts = [
        'order' => 'integer'
    ];
}
