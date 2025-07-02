<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationConfirmation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\PaymentConfirmationEmail;


class RegistrationController extends Controller
{
    /**
     * Display all registrations (admin only).
     */
    public function index(): JsonResponse
    {
        try {
            $registrations = Registration::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $registrations,
                'message' => 'Registrations retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving registrations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get participant count by country code.
     */
    public function participantsByCountry($countryCode): JsonResponse
    {
        try {
            $count = Registration::where('country', $countryCode)->count();
            return response()->json([
                'success' => true,
                'count' => $count,
                'message' => 'Participant count retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in participantsByCountry: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error: Unable to retrieve participant count'
            ], 500);
        }
    }

    /**
     * Get participant counts for all countries.
     */
    public function allParticipantsByCountry(): JsonResponse
    {
        try {
            $counts = Registration::select('country', DB::raw('count(*) as count'))
                ->whereNotNull('country')
                ->where('country', '!=', '')
                ->groupBy('country')
                ->get()
                ->pluck('count', 'country')
                ->toArray();
            return response()->json([
                'success' => true,
                'data' => $counts,
                'message' => 'Participant counts retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in allParticipantsByCountry: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error: Unable to retrieve participant counts'
            ], 500);
        }
    }


    /**
     * Store a new registration.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'establishment' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'email' => 'required|email|unique:registrations,email',
                'phone' => 'required|string|max:20',
                'country' => 'required|string|size:2',
                'participation_type' => 'required|in:without-article,with-article',
                'has_accompanying' => 'required|in:yes,no',
                'accompanying_details' => 'nullable|string',
                'accommodation_type' => 'required|in:without-accommodation,with-accommodation',
                'payment_method' => 'required|in:bank-transfer,administrative-order,check',
                'payment_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
                'amount' => 'required|numeric',
                'language' => 'nullable'
            ], [
                'email.unique' => 'Cette adresse email est déjà utilisée pour une inscription.',
                'first_name.required' => 'Le prénom est requis.',
                'last_name.required' => 'Le nom est requis.',
                'establishment.required' => 'L\'établissement est requis.',
                'title.required' => 'Le titre/fonction est requis.',
                'email.required' => 'L\'adresse email est requise.',
                'email.email' => 'L\'adresse email doit être valide.',
                'phone.required' => 'Le numéro de téléphone est requis.',
                'country.required' => 'Le pays est requis.',
                'country.size' => 'Le code du pays doit être un code ISO_A2 valide (2 caractères).',
                'participation_type.required' => 'Le type de participation est requis.',
                'has_accompanying.required' => 'Veuillez indiquer si vous avez des accompagnateurs.',
                'accommodation_type.required' => 'Le type d\'hébergement est requis.',
                'payment_method.required' => 'Le mode de paiement est requis.',
                'payment_proof.mimes' => 'Le justificatif doit être au format PDF, JPG, JPEG ou PNG.',
                'payment_proof.max' => 'Le justificatif ne doit pas dépasser 5MB.',
                'amount.required' => 'Le montant est requis.',
                'amount.numeric' => 'Le montant doit être un nombre.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Génération d'un mot de passe temporaire
            $temporaryPassword = Str::random(12);

            // Traitement du fichier de justificatif de paiement
            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                $file = $request->file('payment_proof');
                $filename = time() . '_' . Str::slug($request->last_name . '_' . $request->first_name) . '.' . $file->getClientOriginalExtension();
                $paymentProofPath = $file->storeAs('payment-proofs', $filename, 'public');
            }

            // Création de l'inscription
            $registration = Registration::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'establishment' => $request->establishment,
                'title' => $request->title,
                'email' => $request->email,
                'password' => $temporaryPassword,
                'phone' => $request->phone,
                'country' => strtoupper($request->country),
                'participation_type' => $request->participation_type,
                'has_accompanying' => $request->has_accompanying,
                'accompanying_details' => $request->has_accompanying === 'yes' ? $request->accompanying_details : null,
                'accommodation_type' => $request->accommodation_type,
                'payment_method' => $request->payment_method,
                'payment_proof' => $paymentProofPath,
                'status' => 'pending',
                'amount' => $request->amount,
                'language' =>$request->language
            ]);

            $mail = new RegistrationConfirmation(
                $registration->first_name . ' ' . $registration->last_name,
                route('api.registration.download-badge', ['id' => $registration->id, 'language' => $request->language]),
                $request->language,
                $registration->id
            );

            Mail::to($registration->email)->send($mail);

            return response()->json([
                'success' => true,
                'data' => [
                    'registration' => $registration->fresh(),
                    'temporary_password' => $temporaryPassword,
                ],
                'message' => 'Inscription créée avec succès'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'inscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download a badge for a registration.
     */
    public function downloadBadge($id, $language)
    {
        try {
            $registration = Registration::findOrFail($id);
            $nom = $registration->first_name . ' ' . $registration->last_name;

            // Choisir l'image en fonction de la langue
            $badgeImageFile = $language === 'fr' ? '1FR.png' : '1EN.png';
            $badgeImagePath = public_path('badges/' . $badgeImageFile);

            if (!file_exists($badgeImagePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image du badge non trouvée.'
                ], 404);
            }

            $pdf = Pdf::loadView('badge', [
                'nom' => $nom,
                'badgeImagePath' => $badgeImagePath,
                'language' => $language,
            ]);

            $fileName = 'challenger_' . str_replace(' ', '_', strtolower($nom)) . '.pdf';

            return $pdf->download($fileName);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du badge: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific registration.
     */
    public function show($id): JsonResponse
    {
        try {
            $registration = Registration::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $registration,
                'message' => 'Registration retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration not found'
            ], 404);
        }
    }

    /**
     * Update a registration.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $registration = Registration::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'establishment' => 'sometimes|required|string|max:255',
                'title' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:registrations,email,' . $id,
                'phone' => 'sometimes|required|string|max:20',
                'country' => 'sometimes|required|string|size:2',
                'participation_type' => 'sometimes|required|in:without-article,with-article',
                'has_accompanying' => 'sometimes|required|in:yes,no',
                'accompanying_details' => 'nullable|string',
                'accommodation_type' => 'sometimes|required|in:without-accommodation,with-accommodation',
                'payment_method' => 'sometimes|required|in:bank-transfer,administrative-order,check',
                'status' => 'sometimes|in:pending,confirmed,cancelled',
                'payment_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [];

            // Mapping des champs
            if ($request->has('first_name'))
                $updateData['first_name'] = $request->first_name;
            if ($request->has('last_name'))
                $updateData['last_name'] = $request->last_name;
            if ($request->has('establishment'))
                $updateData['establishment'] = $request->establishment;
            if ($request->has('title'))
                $updateData['title'] = $request->title;
            if ($request->has('email'))
                $updateData['email'] = $request->email;
            if ($request->has('phone'))
                $updateData['phone'] = $request->phone;
            if ($request->has('country'))
                $updateData['country'] = strtoupper($request->country);
            if ($request->has('participation_type'))
                $updateData['participation_type'] = $request->participation_type;
            if ($request->has('has_accompanying'))
                $updateData['has_accompanying'] = $request->has_accompanying;
            if ($request->has('accompanying_details'))
                $updateData['accompanying_details'] = $request->accompanying_details;
            if ($request->has('accommodation_type'))
                $updateData['accommodation_type'] = $request->accommodation_type;
            if ($request->has('payment_method'))
                $updateData['payment_method'] = $request->payment_method;
            if ($request->has('status'))
                $updateData['status'] = $request->status;
            if ($request->has('amount'))
                $updateData['amount'] = $request->amount;

            // Traitement du nouveau fichier de justificatif
            if ($request->hasFile('payment_proof')) {
                // Supprimer l'ancien fichier
                if ($registration->payment_proof) {
                    Storage::disk('public')->delete($registration->payment_proof);
                }

                $file = $request->file('payment_proof');
                $filename = time() . '_' . Str::slug($registration->last_name . '_' . $registration->first_name) . '.' . $file->getClientOriginalExtension();
                $updateData['payment_proof'] = $file->storeAs('payment-proofs', $filename, 'public');
            }

            $registration->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $registration->fresh(),
                'message' => 'Inscription mise à jour avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a registration.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $registration = Registration::findOrFail($id);

            // Supprimer le fichier de justificatif s'il existe
            if ($registration->payment_proof) {
                Storage::disk('public')->delete($registration->payment_proof);
            }

            $registration->delete();

            return response()->json([
                'success' => true,
                'message' => 'Inscription supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a registration as paid.
     */
    public function markAsPaid($id): JsonResponse
    {
        try {
            $registration = Registration::findOrFail($id);
            $registration->markAsPaid();

            // Send payment confirmation email
            Mail::to($registration->email)->send(new PaymentConfirmationEmail($registration));

            return response()->json([
                'success' => true,
                'data' => $registration->fresh(),
                'message' => 'Inscription marquée comme payée'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut de paiement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get registration statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Registration::count(),
                'pending' => Registration::pending()->count(),
                'confirmed' => Registration::confirmed()->count(),
                'paid' => Registration::paid()->count(),
                'with_accommodation' => Registration::where('accommodation_type', 'with-accommodation')->count(),
                'without_accommodation' => Registration::where('accommodation_type', 'without-accommodation')->count(),
                'with_article' => Registration::where('participation_type', 'with-article')->count(),
                'without_article' => Registration::where('participation_type', 'without-article')->count(),
                'total_amount' => Registration::sum('amount'),
                'paid_amount' => Registration::paid()->sum('amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiques récupérées avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get total registration count.
     */
    public function count(): JsonResponse
    {
        try {
            $count = Registration::count();
            return response()->json([
                'success' => true,
                'total_registrations' => $count,
                'message' => 'Total registrations retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in count: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error: Unable to retrieve total registrations'
            ], 500);
        }
    }
    /**
     * Get recent registrations.
     */
    public function recent(): JsonResponse
    {
        try {
            $recentRegistrations = Registration::orderBy('created_at', 'desc')->take(3)->get();

            return response()->json([
                'success' => true,
                'data' => $recentRegistrations,
                'message' => 'Recent registrations retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving recent registrations: ' . $e->getMessage()
            ], 500);
        }
    }
}