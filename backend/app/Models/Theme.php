<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Theme extends Model
{
    protected $fillable = [
        'title_fr',
        'title_en',
        'description_fr',
        'description_en',
        'icon_fr',
        'icon_en',
        'order',
        'is_active'
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean'
    ];

    /**
     * Relation avec les mots-clés
     */
    public function motsCles(): HasMany
    {
        return $this->hasMany(MotsCles::class)->orderBy('order');
    }

    /**
     * Scope pour les thèmes actifs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour ordonner les thèmes
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }
}
