<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Realisation extends Model
{
    protected $fillable = ['title_fr', 'title_en'];

    // Relation One-to-Many vers la table pivot
    public function speakerRealisations()
    {
        return $this->hasMany(SpeakerRealisation::class, 'realisation_id');
    }
    
    // Relation Many-to-Many vers Speaker via la table pivot
    public function speakers()
    {
        return $this->belongsToMany(Speaker::class, 'speaker_realisations', 'realisation_id', 'speaker_id')
                    ->withTimestamps()
                    ->withPivot('id'); // Si vous voulez accéder à l'ID de la table pivot
    }
}
 