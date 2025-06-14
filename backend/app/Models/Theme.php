<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\MotsCles;

class Theme extends Model
{
    protected $fillable = [
        'title_fr',
        'title_en',
        'description_fr',
        'description_en',
        'icon',
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

    /**
     * Accesseur pour obtenir le titre selon la langue
     */
    public function getTitle($locale = 'fr')
    {
        return $this->{"title_{$locale}"} ?? $this->title_fr;
    }

    /**
     * Accesseur pour obtenir la description selon la langue
     */
    public function getDescription($locale = 'fr')
    {
        return $this->{"description_{$locale}"} ?? $this->description_fr;
    }

    /**
     * Accesseur pour l'URL complète de l'icône (si c'est un fichier)
     */
    public function getIconUrlAttribute()
    {
        if ($this->icon && !str_starts_with($this->icon, 'http') && !str_contains($this->icon, 'fa-')) {
            return asset('storage/icons/' . $this->icon);
        }
        return $this->icon;
    }

    /**
     * Vérifie si l'icône est une classe CSS
     */
    public function isIconClass()
    {
        return $this->icon && (str_contains($this->icon, 'fa-') || str_contains($this->icon, 'bi-') || str_contains($this->icon, 'icon-'));
    }
}
