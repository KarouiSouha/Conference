<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comite;

class ComiteController extends Controller
{
    public function displayAll(Request $request)
    {
        $language = $request->query('lang', 'fr'); // Par défaut français
        
        // Récupérer tous les comités ordonnés par type et ordre
        $comites = Comite::orderBy('committee_type')
                         ->orderBy('special_role')
                         ->orderBy('order')
                         ->get();
        
        // Organiser les données par type de comité
        $organized = [
            'scientific' => [
                'chair' => null,
                'co_chair' => null,
                'members' => []
            ],
            'organizing' => [
                'chair' => null,
                'members' => []
            ]
        ];
        
        foreach ($comites as $comite) {
            $member = [
                'id' => $comite->id,
                'name' => $language === 'en' ? $comite->name_en : $comite->name_fr,
                'institute' => $language === 'en' ? $comite->institute_en : $comite->institute_fr,
                'job' => $language === 'en' ? $comite->job_en : $comite->job_fr,
                'special_role' => $comite->special_role,
                'order' => $comite->order
            ];
            
            if ($comite->committee_type === 'scientific') {
                if ($comite->special_role === 'chair') {
                    $organized['scientific']['chair'] = $member;
                } elseif ($comite->special_role === 'co-chair') {
                    $organized['scientific']['co_chair'] = $member;
                } else {
                    $organized['scientific']['members'][] = $member;
                }
            } elseif ($comite->committee_type === 'organizing') {
                if ($comite->special_role === 'chair') {
                    $organized['organizing']['chair'] = $member;
                } else {
                    $organized['organizing']['members'][] = $member;
                }
            }
        }
        
        return response()->json([
            'success' => true,
            'language' => $language,
            'data' => $organized
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_fr' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'institute_fr' => 'nullable|string|max:255',
            'institute_en' => 'nullable|string|max:255',
            'job_fr' => 'nullable|string|max:255',
            'job_en' => 'nullable|string|max:255',
            'committee_type' => 'required|in:scientific,organizing',
            'special_role' => 'required|in:chair,co-chair,member',
            'order' => 'integer|min:0'
        ]);
        
        $comite = Comite::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Comité ajouté avec succès',
            'data' => $comite
        ], 201);
    }
    
    public function update(Request $request, $id)
    {
        $comite = Comite::findOrFail($id);
        
        $validated = $request->validate([
            'name_fr' => 'string|max:255',
            'name_en' => 'string|max:255',
            'institute_fr' => 'nullable|string|max:255',
            'institute_en' => 'nullable|string|max:255',
            'job_fr' => 'nullable|string|max:255',
            'job_en' => 'nullable|string|max:255',
            'committee_type' => 'in:scientific,organizing',
            'special_role' => 'in:chair,co-chair,member',
            'order' => 'integer|min:0'
        ]);
        
        $comite->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Comité mis à jour avec succès',
            'data' => $comite
        ]);
    }
    
    public function destroy($id)
    {
        $comite = Comite::findOrFail($id);
        $comite->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Comité supprimé avec succès'
        ]);
    }
}