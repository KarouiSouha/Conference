<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contact';

    protected $guarded = [];
    protected $dates = ['created_at', 'updated_at'];

    
}
