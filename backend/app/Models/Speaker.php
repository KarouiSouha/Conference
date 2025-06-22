<?php

// Model Speaker
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Speaker extends Model
{
    protected $fillable = ['name', 'job_fr', 'job_en', 'email', 'country_fr', 'country_en', 'description_fr', 'description_en', 'theme_id','link'];

    // Relation One-to-Many vers la table pivot
    public function speakerRealisations()
    {
        return $this->hasMany(SpeakerRealisation::class, 'speaker_id');
    }

    // Relation Many-to-Many vers Realisation via la table pivot
    public function realisations()
    {
        return $this->belongsToMany(Realisation::class, 'speaker_realisations', 'speaker_id', 'realisation_id');
    }
    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }
    public function programmes()
    {
        return $this->hasMany(Programme::class);
    }

}