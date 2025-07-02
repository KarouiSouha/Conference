<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\Speaker;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class ProgrammeController extends Controller
{
    // Récupérer tous les programmes (paginated)
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = $request->get('lang', 'fr');

            $programmes = Programme::with('speaker')
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    $data = $programme->getContentInLanguage($lang);

                    // Ajouter les informations du speaker si disponible
                    if ($programme->speaker) {
                        $data['speaker'] = [
                            'id' => $programme->speaker->id,
                            'name' => $programme->speaker->name,
                            'job' => $lang === 'en' ? $programme->speaker->job_en : $programme->speaker->job_fr,
                            'country' => $lang === 'en' ? $programme->speaker->country_en : $programme->speaker->country_fr,
                            'description' => $lang === 'en' ? $programme->speaker->description_en : $programme->speaker->description_fr,
                        ];
                    } else {
                        $data['speaker'] = null;
                    }

                    return $data;
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

    // Récupérer les événements d'un jour spécifique
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

            $programmes = Programme::with('speaker')
                ->forDate($date)
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    $data = $programme->getContentInLanguage($lang);

                    // Ajouter les informations du speaker si disponible
                    if ($programme->speaker) {
                        $data['speaker'] = [
                            'id' => $programme->speaker->id,
                            'name' => $programme->speaker->name,
                            'job' => $lang === 'en' ? $programme->speaker->job_en : $programme->speaker->job_fr,
                            'country' => $lang === 'en' ? $programme->speaker->country_en : $programme->speaker->country_fr,
                            'description' => $lang === 'en' ? $programme->speaker->description_en : $programme->speaker->description_fr,
                        ];
                    } else {
                        $data['speaker'] = null;
                    }

                    return $data;
                });

            return response()->json([
                'success' => true,
                'date' => $date,
                'programmes' => $programmes,
                'language' => $lang,
                'count' => $programmes->count()
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

            $programmes = Programme::with('speaker')
                ->whereBetween('jour', [$today, $endDate])
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    $data = $programme->getContentInLanguage($lang);

                    // Ajouter les informations du speaker si disponible
                    if ($programme->speaker) {
                        $data['speaker'] = [
                            'id' => $programme->speaker->id,
                            'name' => $programme->speaker->name,
                            'job' => $lang === 'en' ? $programme->speaker->job_en : $programme->speaker->job_fr,
                            'country' => $lang === 'en' ? $programme->speaker->country_en : $programme->speaker->country_fr,
                        ];
                    } else {
                        $data['speaker'] = null;
                    }

                    return $data;
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            return response()->json([
                'success' => true,
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

            $programmes = Programme::with('speaker')
                ->forMonth()
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    $data = $programme->getContentInLanguage($lang);

                    // Ajouter les informations du speaker si disponible
                    if ($programme->speaker) {
                        $data['speaker'] = [
                            'id' => $programme->speaker->id,
                            'name' => $programme->speaker->name,
                            'job' => $lang === 'en' ? $programme->speaker->job_en : $programme->speaker->job_fr,
                        ];
                    } else {
                        $data['speaker'] = null;
                    }

                    return $data;
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            return response()->json([
                'success' => true,
                'month' => Carbon::now()->monthName,
                'days' => $programmes,
                'language' => $lang
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la récupération des programmes du mois');
        }
    }

    // Récupérer les programmes par plage de dates
    public function getByDateRange(Request $request): JsonResponse
    {
        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $lang = $request->get('lang', 'fr');

            $validator = Validator::make([
                'start_date' => $startDate,
                'end_date' => $endDate
            ], [
                'start_date' => 'required|date_format:Y-m-d',
                'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $programmes = Programme::with('speaker')
                ->whereBetween('jour', [$startDate, $endDate])
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    $data = $programme->getContentInLanguage($lang);

                    if ($programme->speaker) {
                        $data['speaker'] = [
                            'id' => $programme->speaker->id,
                            'name' => $programme->speaker->name,
                            'job' => $lang === 'en' ? $programme->speaker->job_en : $programme->speaker->job_fr,
                            'country' => $lang === 'en' ? $programme->speaker->country_en : $programme->speaker->country_fr,
                        ];
                    } else {
                        $data['speaker'] = null;
                    }

                    return $data;
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            return response()->json([
                'success' => true,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'programmes' => $programmes,
                'language' => $lang,
                'total_days' => $programmes->count()
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la récupération des programmes par plage de dates');
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
                'type_evenement' => 'nullable|in:keynote,session,workshop,panel,break,meal,networking,ceremony',
                'speaker_id' => 'nullable|exists:speakers,id'
            ]);

            $programme = Programme::create($validated);
            $programme->load('speaker'); // Charger la relation speaker

            return response()->json([
                'success' => true,
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
                'evenement_fr' => 'sometimes|string|max:255',
                'evenement_en' => 'sometimes|string|max:255',
                'description_fr' => 'nullable|string',
                'description_en' => 'nullable|string',
                'intervenant_fr' => 'nullable|string|max:255',
                'intervenant_en' => 'nullable|string|max:255',
                'lieu_fr' => 'nullable|string|max:255',
                'lieu_en' => 'nullable|string|max:255',
                'type_evenement' => 'nullable|in:keynote,session,workshop,panel,break,meal,networking,ceremony',
                'speaker_id' => 'nullable|exists:speakers,id'
            ]);

            $programme->update($validated);
            $programme->load('speaker'); // Recharger la relation speaker

            return response()->json([
                'success' => true,
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
                'success' => true,
                'message' => 'Programme supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la suppression du programme');
        }
    }

    // Récupérer tous les speakers disponibles
    public function getSpeakers(Request $request): JsonResponse
    {
        try {
            $lang = $request->get('lang', 'fr');
            $speakers = Speaker::all()->map(function ($speaker) use ($lang) {
                return [
                    'id' => $speaker->id,
                    'name' => $speaker->name,
                    'job' => $lang === 'en' ? $speaker->job_en : $speaker->job_fr,
                    'country' => $lang === 'en' ? $speaker->country_en : $speaker->country_fr,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $speakers,
                'language' => $lang
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Erreur lors de la récupération des speakers');
        }
    }

    // Gestion centralisée des erreurs
    private function handleError(\Exception $e, string $message): JsonResponse
    {
        Log::error($message . ': ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'error' => $message,
            'message' => $e->getMessage()
        ], 500);
    }
    public function downloadPdf(Request $request)
    {
        try {
            $lang = $request->query('lang', 'fr');

            // Récupérer les données du programme
            $programmes = Programme::with('speaker')
                ->orderBy('jour')
                ->orderBy('heure')
                ->get()
                ->map(function ($programme) use ($lang) {
                    $data = $programme->getContentInLanguage($lang);

                    if ($programme->speaker) {
                        $data['speaker'] = [
                            'id' => $programme->speaker->id,
                            'name' => $programme->speaker->name,
                            'job' => $lang === 'en' ? $programme->speaker->job_en : $programme->speaker->job_fr,
                            'country' => $lang === 'en' ? $programme->speaker->country_en : $programme->speaker->country_fr,
                            'description' => $lang === 'en' ? $programme->speaker->description_en : $programme->speaker->description_fr,
                        ];
                    } else {
                        $data['speaker'] = null;
                    }

                    return $data;
                })
                ->groupBy(function ($item) {
                    return Carbon::parse($item['jour'])->format('Y-m-d');
                });

            // Charger la vue pour le PDF
            $pdf = Pdf::loadView('pdf.programme', [
                'programmes' => $programmes,
                'lang' => $lang
            ]);

            // Définir le nom du fichier
            $filename = 'programme-conference-' . $lang . '.pdf';

            // Télécharger le PDF
            return $pdf->download($filename);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la génération du PDF : ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de la génération du PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}