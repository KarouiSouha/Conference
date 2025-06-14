<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'jour',
        'heure',
        'evenement_fr',
        'evenement_en',
        'description_fr',
        'description_en',
        'intervenant_fr',
        'intervenant_en',
        'lieu_fr',
        'lieu_en',
        'type_evenement'
    ];

    protected $casts = [
        'jour' => 'date:Y-m-d',
    ];

    protected $appends = ['evenement', 'description', 'intervenant', 'lieu'];

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('jour', $date);
    }

    public function scopeUpcoming($query)
    {
        return $query->whereDate('jour', '>=', now());
    }

    public function scopeForMonth($query, $month = null)
    {
        $month = $month ?? now()->month;
        return $query->whereMonth('jour', $month);
    }

    // Accesseurs pour récupérer le contenu selon la langue
    public function getEvenementAttribute()
    {
        $lang = request()->get('lang', 'fr');
        return $lang === 'en' ? $this->evenement_en : $this->evenement_fr;
    }

    public function getDescriptionAttribute()
    {
        $lang = request()->get('lang', 'fr');
        return $lang === 'en' ? $this->description_en : $this->description_fr;
    }

    public function getIntervenantAttribute()
    {
        $lang = request()->get('lang', 'fr');
        return $lang === 'en' ? $this->intervenant_en : $this->intervenant_fr;
    }

    public function getLieuAttribute()
    {
        $lang = request()->get('lang', 'fr');
        return $lang === 'en' ? $this->lieu_en : $this->lieu_fr;
    }

    // Méthodes pour obtenir explicitement le contenu dans une langue
    public function getContentInLanguage($lang = 'fr')
    {
        return [
            'id' => $this->id,
            'jour' => $this->jour,
            'heure' => $this->heure,
            'evenement' => $lang === 'en' ? $this->evenement_en : $this->evenement_fr,
            'description' => $lang === 'en' ? $this->description_en : $this->description_fr,
            'intervenant' => $lang === 'en' ? $this->intervenant_en : $this->intervenant_fr,
            'lieu' => $lang === 'en' ? $this->lieu_en : $this->lieu_fr,
            'type_evenement' => $this->type_evenement,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
