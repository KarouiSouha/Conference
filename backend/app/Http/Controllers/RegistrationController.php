<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
     * Store a new registration.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'establishment' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'email' => 'required|email|unique:registrations,email',
                'phone' => 'required|string|max:20',
                'participationType' => 'required|in:without-article,with-article',
                'hasAccompanying' => 'required|in:yes,no',
                'accompanyingDetails' => 'nullable|string',
                'accommodationType' => 'required|in:without-accommodation,with-accommodation',
                'paymentMethod' => 'required|in:bank-transfer,administrative-order,check',
                'paymentProof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
            ], [
                'email.unique' => 'Cette adresse email est déjà utilisée pour une inscription.',
                'firstName.required' => 'Le prénom est requis.',
                'lastName.required' => 'Le nom est requis.',
                'establishment.required' => 'L\'établissement est requis.',
                'title.required' => 'Le titre/fonction est requis.',
                'email.required' => 'L\'adresse email est requise.',
                'email.email' => 'L\'adresse email doit être valide.',
                'phone.required' => 'Le numéro de téléphone est requis.',
                'participationType.required' => 'Le type de participation est requis.',
                'hasAccompanying.required' => 'Veuillez indiquer si vous avez des accompagnateurs.',
                'accommodationType.required' => 'Le type d\'hébergement est requis.',
                'paymentMethod.required' => 'Le mode de paiement est requis.',
                'paymentProof.mimes' => 'Le justificatif doit être au format PDF, JPG, JPEG ou PNG.',
                'paymentProof.max' => 'Le justificatif ne doit pas dépasser 5MB.',
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
            if ($request->hasFile('paymentProof')) {
                $file = $request->file('paymentProof');
                $filename = time() . '_' . Str::slug($request->lastName . '_' . $request->firstName) . '.' . $file->getClientOriginalExtension();
                $paymentProofPath = $file->storeAs('payment-proofs', $filename, 'public');
            }

            // Création de l'inscription
            $registration = Registration::create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'establishment' => $request->establishment,
                'title' => $request->title,
                'email' => $request->email,
                'password' => $temporaryPassword, // Sera hashé automatiquement par le mutateur
                'phone' => $request->phone,
                'participation_type' => $request->participationType,
                'has_accompanying' => $request->hasAccompanying,
                'accompanying_details' => $request->hasAccompanying === 'yes' ? $request->accompanyingDetails : null,
                'accommodation_type' => $request->accommodationType,
                'payment_method' => $request->paymentMethod,
                'payment_proof' => $paymentProofPath,
                'status' => 'pending',
            ]);

            // Calcul et sauvegarde du montant
            $amount = $registration->calculateAmount();
            $registration->update(['amount' => $amount]);

            // TODO: Envoyer un email de confirmation avec le mot de passe temporaire
            // Mail::to($registration->email)->send(new RegistrationConfirmation($registration, $temporaryPassword));

            return response()->json([
                'success' => true,
                'data' => [
                    'registration' => $registration->fresh(),
                    'temporary_password' => $temporaryPassword, // À supprimer en production
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
                'firstName' => 'sometimes|required|string|max:255',
                'lastName' => 'sometimes|required|string|max:255',
                'establishment' => 'sometimes|required|string|max:255',
                'title' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:registrations,email,' . $id,
                'phone' => 'sometimes|required|string|max:20',
                'participationType' => 'sometimes|required|in:without-article,with-article',
                'hasAccompanying' => 'sometimes|required|in:yes,no',
                'accompanyingDetails' => 'nullable|string',
                'accommodationType' => 'sometimes|required|in:without-accommodation,with-accommodation',
                'paymentMethod' => 'sometimes|required|in:bank-transfer,administrative-order,check',
                'status' => 'sometimes|in:pending,confirmed,cancelled',
                'paymentProof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
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
            if ($request->has('firstName')) $updateData['first_name'] = $request->firstName;
            if ($request->has('lastName')) $updateData['last_name'] = $request->lastName;
            if ($request->has('establishment')) $updateData['establishment'] = $request->establishment;
            if ($request->has('title')) $updateData['title'] = $request->title;
            if ($request->has('email')) $updateData['email'] = $request->email;
            if ($request->has('phone')) $updateData['phone'] = $request->phone;
            if ($request->has('participationType')) $updateData['participation_type'] = $request->participationType;
            if ($request->has('hasAccompanying')) $updateData['has_accompanying'] = $request->hasAccompanying;
            if ($request->has('accompanyingDetails')) $updateData['accompanying_details'] = $request->accompanyingDetails;
            if ($request->has('accommodationType')) $updateData['accommodation_type'] = $request->accommodationType;
            if ($request->has('paymentMethod')) $updateData['payment_method'] = $request->paymentMethod;
            if ($request->has('status')) $updateData['status'] = $request->status;

            // Traitement du nouveau fichier de justificatif
            if ($request->hasFile('paymentProof')) {
                // Supprimer l'ancien fichier
                if ($registration->payment_proof) {
                    Storage::disk('public')->delete($registration->payment_proof);
                }

                $file = $request->file('paymentProof');
                $filename = time() . '_' . Str::slug($registration->last_name . '_' . $registration->first_name) . '.' . $file->getClientOriginalExtension();
                $updateData['payment_proof'] = $file->storeAs('payment-proofs', $filename, 'public');
            }

            $registration->update($updateData);

            // Recalculer le montant si le type d'hébergement a changé
            if (isset($updateData['accommodation_type'])) {
                $registration->update(['amount' => $registration->calculateAmount()]);
            }

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
}
