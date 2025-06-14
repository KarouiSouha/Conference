<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gallery;

class GalleryController extends Controller
{
    /**
     * Afficher tous les éléments de la galerie
     */
    public function displayAll()
    {
        $galleryItems = Gallery::orderBy('created_at', 'desc')->get();

        // Ajouter les URLs complètes
        $galleryItems->each(function ($item) {
            $item->file_url = asset($item->file_url);
            $item->thumbnail_url = asset($item->thumbnail_url);
        });

        return response()->json($galleryItems);
    }

    /**
     * Afficher les photos uniquement
     */
    public function displayPhotos()
    {
        $photos = Gallery::photos()->orderBy('created_at', 'desc')->get();

        $photos->each(function ($item) {
            $item->file_url = asset($item->file_url);
        });

        return response()->json($photos);
    }

    /**
     * Afficher les vidéos uniquement
     */
    public function displayVideos()
    {
        $videos = Gallery::videos()->orderBy('created_at', 'desc')->get();

        $videos->each(function ($item) {
            $item->file_url = asset($item->file_url);
            $item->thumbnail_url = asset($item->thumbnail_url);
        });

        return response()->json($videos);
    }

    /**
     * Afficher un élément spécifique
     */
    public function displayOne($id)
    {
        $item = Gallery::findOrFail($id);
        $item->file_url = asset($item->file_url);
        $item->thumbnail_url = asset($item->thumbnail_url);

        // Incrémenter le nombre de vues
        $item->increment('views');

        return response()->json($item);
    }

    /**
     * Créer un nouvel élément (pour Postman)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_fr' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description_fr' => 'required|string',
            'description_en' => 'required|string',
            'type' => 'required|in:photo,video',
            'file_path' => 'required|string',
            'thumbnail_path' => 'nullable|string',
            'year' => 'required|string',
            'duration' => 'nullable|string',
            'views' => 'nullable|integer|min:0'
        ]);

        $galleryItem = Gallery::create($validated);

        return response()->json([
            'message' => 'Élément de galerie créé avec succès',
            'data' => $galleryItem
        ], 201);
    }
}
