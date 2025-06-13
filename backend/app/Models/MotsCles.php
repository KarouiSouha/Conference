<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MotsCles extends Model
{
    protected $fillable = [
        'theme_id',
        'keyword_fr',
        'keyword_en',
        'order'
    ];

    protected $casts = [
        'theme_id' => 'integer',
        'order' => 'integer'
    ];

    /**
     * Relation avec le thème
     */
    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    /**
     * Scope pour ordonner les mots-clés
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }
}
