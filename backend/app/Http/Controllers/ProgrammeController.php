<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProgrammeController extends Controller
{
    // Récupérer tous les programmes (paginated)
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = $request->get('lang', 'fr');

            $programmes = Programme::orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    return $programme->getContentInLanguage($lang);
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            return response()->json([
                'success' => true,
                'data' => $programmes,
                'language' => $lang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Récupérer les événements d'un jour spécifique ou aujourd'hui
    public function daily(Request $request): JsonResponse
    {
        try {
            $date = $request->input('date', Carbon::today()->format('Y-m-d'));
            $lang = $request->get('lang', 'fr');

            $validator = Validator::make(['date' => $date], [
                'date' => 'required|date_format:Y-m-d'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Format de date invalide',
                    'errors' => $validator->errors()
                ], 422);
            }

            $programmes = Programme::forDate($date)
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    return $programme->getContentInLanguage($lang);
                });

            return response()->json([
                'date' => $date,
                'programmes' => $programmes,
                'language' => $lang
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la récupération des programmes du jour');
        }
    }

    // Récupérer les événements des 3 prochains jours
    public function nextThreeDays(Request $request): JsonResponse
    {
        try {
            $lang = $request->get('lang', 'fr');
            $today = Carbon::today();
            $endDate = $today->copy()->addDays(3);

            $programmes = Programme::whereBetween('jour', [$today, $endDate])
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    return $programme->getContentInLanguage($lang);
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            return response()->json([
                'start_date' => $today->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'days' => $programmes,
                'language' => $lang
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la récupération des programmes des 3 prochains jours');
        }
    }

    // Récupérer les événements du mois courant
    public function currentMonth(Request $request): JsonResponse
    {
        try {
            $lang = $request->get('lang', 'fr');

            $programmes = Programme::forMonth()
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    return $programme->getContentInLanguage($lang);
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            return response()->json([
                'month' => Carbon::now()->monthName,
                'days' => $programmes,
                'language' => $lang
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la récupération des programmes du mois');
        }
    }

    // Créer un nouveau programme
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'jour' => 'required|date',
                'heure' => 'required|date_format:H:i',
                'evenement_fr' => 'required|string|max:255',
                'evenement_en' => 'required|string|max:255',
                'description_fr' => 'nullable|string',
                'description_en' => 'nullable|string',
                'intervenant_fr' => 'nullable|string|max:255',
                'intervenant_en' => 'nullable|string|max:255',
                'lieu_fr' => 'nullable|string|max:255',
                'lieu_en' => 'nullable|string|max:255',
                'type_evenement' => 'nullable|in:keynote,session,workshop,panel,break,meal,networking,ceremony'
            ]);

            $programme = Programme::create($validated);

            return response()->json([
                'message' => 'Programme créé avec succès',
                'data' => $programme
            ], 201);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la création du programme');
        }
    }

    // Mettre à jour un programme
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $programme = Programme::findOrFail($id);

            $validated = $request->validate([
                'jour' => 'sometimes|date',
                'heure' => 'sometimes|date_format:H:i',
                'evenement_fr' => 'sometimes|string|max:255',
                'evenement_en' => 'sometimes|string|max:255',
                'description_fr' => 'nullable|string',
                'description_en' => 'nullable|string',
                'intervenant_fr' => 'nullable|string|max:255',
                'intervenant_en' => 'nullable|string|max:255',
                'lieu_fr' => 'nullable|string|max:255',
                'lieu_en' => 'nullable|string|max:255',
                'type_evenement' => 'nullable|in:keynote,session,workshop,panel,break,meal,networking,ceremony'
            ]);

            $programme->update($validated);

            return response()->json([
                'message' => 'Programme mis à jour avec succès',
                'data' => $programme
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la mise à jour du programme');
        }
    }

    // Supprimer un programme
    public function destroy($id): JsonResponse
    {
        try {
            $programme = Programme::findOrFail($id);
            $programme->delete();

            return response()->json([
                'message' => 'Programme supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la suppression du programme');
        }
    }

    // Gestion centralisée des erreurs
    private function handleError(\Exception $e, string $message): JsonResponse
    {
        Log::error($message . ': ' . $e->getMessage());

        return response()->json([
            'error' => $message,
            'message' => $e->getMessage()
        ], 500);
    }
}
