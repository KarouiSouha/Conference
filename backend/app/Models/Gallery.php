<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        'title_fr',
        'title_en',
        'description_fr',
        'description_en',
        'type',
        'file_path',
        'thumbnail_path',
        'year',
        'duration',
        'views'
    ];

    // Accesseur pour obtenir l'URL complète du fichier
    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    // Accesseur pour obtenir l'URL complète de la miniature
    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail_path ? asset('storage/' . $this->thumbnail_path) : null;
    }

    // Scope pour filtrer par type
    public function scopePhotos($query)
    {
        return $query->where('type', 'photo');
    }

    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }
}
