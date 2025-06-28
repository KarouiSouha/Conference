<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReply;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    // Afficher tous les contacts triés par date de création (du plus récent au plus ancien)
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json($contacts);
    }

    // Enregistrer un nouveau contact
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            // 'status' est automatiquement à 'nouveau' par défaut
        ]);

        return response()->json(['message' => 'Contact enregistré', 'data' => $contact], 201);
    }

    // Modifier un contact existant
    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'status' => 'nullable|in:nouveau,en attente,traité',
        ]);

        $contact->update($request->only(['name', 'email', 'subject', 'message', 'status']));

        return response()->json(['message' => 'Contact mis à jour', 'data' => $contact]);
    }

    // Mettre à jour le statut à "en attente" lorsqu'un message est vu
    public function view($id)
    {
        $contact = Contact::findOrFail($id);

        if ($contact->status === 'nouveau') {
            $contact->update(['status' => 'en attente']);
        }

        return response()->json(['message' => 'Message visualisé', 'data' => $contact]);
    }

    // Envoyer une réponse par email et mettre à jour le statut
    public function sendReply(Request $request, $id)
    {
        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'originalMessage' => 'required|array',
            'originalMessage.name' => 'nullable|string',
            'originalMessage.email' => 'nullable|email',
            'originalMessage.subject' => 'nullable|string',
            'originalMessage.message' => 'nullable|string',
            'originalMessage.date' => 'nullable|string',
        ]);

        $contact = Contact::findOrFail($id);

        try {
            // Envoyer l'email
            Mail::to($request->to)->send(new ContactReply([
                'subject' => $request->subject,
                'message' => $request->message,
                'originalMessage' => $request->originalMessage,
            ]));

            // Mettre à jour le statut à "traité"
            $contact->update(['status' => 'traité']);

            return response()->json([
                'message' => 'Réponse envoyée avec succès et statut mis à jour',
                'data' => $contact
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de l\'email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'envoi de l\'email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Supprimer un contact
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json(['message' => 'Contact supprimé']);
    }
}