<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpeakerRealisation extends Model
{
    protected $table = 'speaker_realisations';
    
    protected $fillable = [
        'speaker_id',
        'realisation_id',
    ];

    // Relation vers Speaker
    public function speaker()
    {
        return $this->belongsTo(Speaker::class, 'speaker_id');
    }
    
    // Relation vers Realisation
    public function realisation()
    {
        return $this->belongsTo(Realisation::class, 'realisation_id');
    }
}
