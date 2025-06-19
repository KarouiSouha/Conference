<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    // Afficher les 4 dernières news
    public function displayAll(): JsonResponse
    {
        $news = News::orderBy('date', 'desc')->take(4)->get();
        return response()->json($news);
    }
    public function getPublished(): JsonResponse
    {
        $news = News::where('status', 'Publié')->orderBy('date', 'desc')->get();
        return response()->json($news);
    }

    // ✅ Ajouter une news
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type_en' => 'required|string',
            'type_fr' => 'required|string',
            'title_en' => 'required|string',
            'title_fr' => 'required|string',
            'date' => 'required|date',
            'author' => 'required|string',
            'description_en' => 'required|string',
            'description_fr' => 'required|string',
            'link' => 'nullable|string',
            'status' => 'nullable|in:En attente,Publié', // 👈 ligne ajoutée
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (!isset($data['status'])) {
            $data['status'] = 'En Attente'; // 👈 valeur par défaut si non fournie
        }

        $news = News::create($data);

        return response()->json(['message' => 'News created successfully', 'news' => $news], 201);
    }


    // ✅ Modifier une news
    public function update(Request $request, $id): JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'type_en' => 'sometimes|required|string',
            'type_fr' => 'sometimes|required|string',
            'title_en' => 'sometimes|required|string',
            'title_fr' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'author' => 'sometimes|required|string',
            'description_en' => 'sometimes|required|string',
            'description_fr' => 'sometimes|required|string',
            'link' => 'nullable|string',
            'status' => 'sometimes|in:En attente,Publié', // 👈 ligne ajoutée
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $news->update($request->all());

        return response()->json(['message' => 'News updated successfully', 'news' => $news]);
    }


    // ✅ Supprimer une news
    public function destroy($id): JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        $news->delete();

        return response()->json(['message' => 'News deleted successfully']);
    }
}
