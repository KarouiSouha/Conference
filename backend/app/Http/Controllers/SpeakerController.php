<?php

namespace App\Http\Controllers;

use App\Models\Speaker;
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:speakers,email',
            'job_fr' => 'required|string|max:255',
            'job_en' => 'required|string|max:255',
            'country_fr' => 'required|string|max:255',
            'country_en' => 'required|string|max:255',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'theme_id' => 'nullable|exists:themes,id',
        ]);

        // Créer le speaker
        $speaker = Speaker::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'job_fr' => $request->input('job_fr'),
            'job_en' => $request->input('job_en'),
            'country_fr' => $request->input('country_fr'),
            'country_en' => $request->input('country_en'),
            'description_fr' => $request->input('description_fr'),
            'description_en' => $request->input('description_en'),
            'theme_id' => $request->input('theme_id'),
        ]);

        return response()->json([
            'message' => 'Intervenant ajouté avec succès',
            'speaker' => $speaker,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $speaker = Speaker::find($id);

        if (!$speaker) {
            return response()->json(['message' => 'Speaker non trouvé'], 404);
        }

        // Valider les données reçues
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:speakers,email,' . $speaker->id, // exclure l'email actuel
            'job_fr' => 'required|string|max:255',
            'job_en' => 'required|string|max:255',
            'country_fr' => 'required|string|max:255',
            'country_en' => 'required|string|max:255',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'theme_id' => 'nullable|exists:themes,id',
        ]);

        // Mise à jour des champs
        $speaker->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'job_fr' => $request->input('job_fr'),
            'job_en' => $request->input('job_en'),
            'country_fr' => $request->input('country_fr'),
            'country_en' => $request->input('country_en'),
            'description_fr' => $request->input('description_fr'),
            'description_en' => $request->input('description_en'),
            'theme_id' => $request->input('theme_id'),
        ]);

        return response()->json([
            'message' => 'Intervenant mis à jour avec succès',
            'speaker' => $speaker,
        ]);
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
}
