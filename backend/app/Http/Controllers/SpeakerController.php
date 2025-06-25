<?php

namespace App\Http\Controllers;

use App\Models\Speaker;
use App\Models\Realisation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpeakerController extends Controller
{
    public function displayAll()
    {
        $speakers = Speaker::with('realisations', 'theme')->get();
        return response()->json($speakers);
    }

    public function displayOne($id)
    {
        $speaker = Speaker::with('realisations')->find($id);
        if (!$speaker) {
            return response()->json(['message' => 'Speaker not found'], 404);
        }
        return response()->json($speaker);
    }

    public function store(Request $request)
    {
        // Valider les données reçues
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:speakers,email',
            'job_fr' => 'required|string|max:255',
            'job_en' => 'required|string|max:255',
            'country_fr' => 'required|string|max:255',
            'country_en' => 'required|string|max:255',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'theme_id' => 'nullable|exists:themes,id',
            'link' => 'nullable|string|max:255',
            'image_path' => 'nullable|image:jpg,jpeg,png,gif|max:2048',
            'realisations' => 'nullable|array',
            'realisations.*.title_fr' => 'required|string|max:255',
            'realisations.*.title_en' => 'required|string|max:255',
        ]);

        // Ajouter l'image si présente
        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('images', 'public');
        }

        // Créer le speaker avec les données validées
        $speaker = Speaker::create($validated);

        // Traiter les réalisations si fournies
        if ($request->has('realisations')) {
            $realisationIds = [];
            foreach ($request->input('realisations') as $realisationData) {
                $realisation = Realisation::firstOrCreate([
                    'title_fr' => $realisationData['title_fr'],
                    'title_en' => $realisationData['title_en'],
                ]);
                $realisationIds[] = $realisation->id;
            }
            $speaker->realisations()->sync($realisationIds);
        }

        // Charger les relations pour la réponse
        $speaker->load('realisations');

        return response()->json([
            'success' => true,
            'message' => 'Intervenant ajouté avec succès',
            'speaker' => $speaker,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $speaker = Speaker::find($id);

        if (!$speaker) {
            return response()->json(['success' => false, 'message' => 'Intervenant non trouvé'], 404);
        }

        // Valider les données
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:speakers,email,' . $speaker->id,
            'job_fr' => 'required|string|max:255',
            'job_en' => 'required|string|max:255',
            'country_fr' => 'required|string|max:255',
            'country_en' => 'required|string|max:255',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'theme_id' => 'nullable|exists:themes,id',
            'link' => 'nullable|string|max:255',
            'image_path' => 'nullable|image:jpg,jpeg,png,gif|max:2048',
            'realisations' => 'nullable|array',
            'realisations.*.title_fr' => 'required|string|max:255',
            'realisations.*.title_en' => 'required|string|max:255',
        ]);

        // Ajouter ou remplacer l'image si présente
        if ($request->hasFile('image_path')) {
            if ($speaker->image_path) {
                \Storage::disk('public')->delete($speaker->image_path);
            }
            $validated['image_path'] = $request->file('image_path')->store('images', 'public');
        }

        // Mise à jour du speaker
        $speaker->update($validated);

        // Traiter les réalisations si fournies
        if ($request->has('realisations')) {
            $realisationIds = [];
            foreach ($request->input('realisations') as $realisationData) {
                $realisation = Realisation::firstOrCreate([
                    'title_fr' => $realisationData['title_fr'],
                    'title_en' => $realisationData['title_en'],
                ]);
                $realisationIds[] = $realisation->id;
            }
            $speaker->realisations()->sync($realisationIds);
        } else {
            $speaker->realisations()->detach();
        }

        // Charger les relations pour réponse complète
        $speaker->load('realisations');

        return response()->json([
            'success' => true,
            'message' => 'Intervenant mis à jour avec succès',
            'speaker' => $speaker,
        ], 200);
    }



    public function destroy($id)
    {
        $speaker = Speaker::find($id);

        if (!$speaker) {
            return response()->json(['message' => 'Speaker non trouvé'], 404);
        }

        $speaker->delete();

        return response()->json(['message' => 'Speaker supprimé avec succès']);
    }

    public function count()
    {
        $count = Speaker::count();
        return response()->json(['total_speakers' => $count]);
    }

    /**
     * Get speaker statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Speaker::count(),
                'active_this_month' => Speaker::where('created_at', '>=', now()->startOfMonth())
                    ->orWhere('updated_at', '>=', now()->startOfMonth())
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiques des intervenants récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyRealisation($id): JsonResponse
    {
        $realisation = Realisation::find($id);

        if (!$realisation) {
            return response()->json(['message' => 'Réalisation non trouvée'], 404);
        }

        // Supprimer les associations dans la table pivot
        $realisation->speakers()->detach();

        // Supprimer la réalisation
        $realisation->delete();

        return response()->json(['message' => 'Réalisation supprimée avec succès']);
    }
}
