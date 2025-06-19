<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Archive;

class ArchiveController extends Controller
{
    public function displayAll()
    {
        $archives = Archive::all();
        return response()->json($archives);
    }
    public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'event_name' => 'required|string|max:255',
            'subject_fr' => 'required|string|max:255',
            'subject_en' => 'required|string|max:255',
            'organizer' => 'required|string|max:255',
            'participants' => 'required|integer|min:0',
            'articles' => 'required|integer|min:0',
            'countries' => 'required|integer|min:0',
            'photoGalleryLink' => 'required|url|max:255',
        ]);

        // Création de l'archive
        $archive = Archive::create([
            'event_name' => $request->input('event_name'),
            'subject_fr' => $request->input('subject_fr'),
            'subject_en' => $request->input('subject_en'),
            'organizer' => $request->input('organizer'),
            'participants' => $request->input('participants'),
            'articles' => $request->input('articles'),
            'countries' => $request->input('countries'),
            'photoGalleryLink' => $request->input('photoGalleryLink'),
        ]);

        return response()->json([
            'message' => 'Archive ajoutée avec succès',
            'archive' => $archive,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $archive = Archive::find($id);

        if (!$archive) {
            return response()->json(['message' => 'Archive non trouvée'], 404);
        }

        // Validation des données
        $request->validate([
            'event_name' => 'required|string|max:255',
            'subject_fr' => 'required|string|max:255',
            'subject_en' => 'required|string|max:255',
            'organizer' => 'required|string|max:255',
            'participants' => 'required|integer|min:0',
            'articles' => 'required|integer|min:0',
            'countries' => 'required|integer|min:0',
            'photoGalleryLink' => 'required|url|max:255',
        ]);

        // Mise à jour des champs
        $archive->update([
            'event_name' => $request->input('event_name'),
            'subject_fr' => $request->input('subject_fr'),
            'subject_en' => $request->input('subject_en'),
            'organizer' => $request->input('organizer'),
            'participants' => $request->input('participants'),
            'articles' => $request->input('articles'),
            'countries' => $request->input('countries'),
            'photoGalleryLink' => $request->input('photoGalleryLink'),
        ]);

        return response()->json([
            'message' => 'Archive mise à jour avec succès',
            'archive' => $archive,
        ]);
    }

    public function destroy($id)
    {
        $archive = Archive::find($id);

        if (!$archive) {
            return response()->json(['message' => 'Archive not found'], 404);
        }

        $archive->delete();

        return response()->json(['message' => 'Archive deleted successfully']);
    }


}
