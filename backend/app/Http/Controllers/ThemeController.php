<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Theme;
use App\Models\MotsCles;
use Illuminate\Support\Facades\DB;

class ThemeController extends Controller
{
    public function displayAll(Request $request)
    {
        $language = $request->query('lang', 'fr'); // Par défaut français

        // Récupérer tous les thèmes actifs avec leurs mots-clés
        $themes = Theme::active()
                       ->ordered()
                       ->with('motsCles')
                       ->get();

        $formatted_themes = $themes->map(function ($theme) use ($language) {
            $keywords = $theme->motsCles->map(function ($motCle) use ($language) {
                return [
                    'id' => $motCle->id,
                    'keyword' => $language === 'en' ? $motCle->keyword_en : $motCle->keyword_fr,
                    'order' => $motCle->order
                ];
            });

            return [
                'id' => $theme->id,
                'title' => $language === 'en' ? $theme->title_en : $theme->title_fr,
                'description' => $language === 'en' ? $theme->description_en : $theme->description_fr,
                'icon' => $language === 'en' ? $theme->icon_en : $theme->icon_fr,
                'order' => $theme->order,
                'keywords' => $keywords,
                'is_active' => $theme->is_active
            ];
        });

        return response()->json([
            'success' => true,
            'language' => $language,
            'data' => $formatted_themes
        ]);
    }

    public function displayOne(Request $request, $id)
    {
        $language = $request->query('lang', 'fr');

        $theme = Theme::with('motsCles')->findOrFail($id);

        $keywords = $theme->motsCles->map(function ($motCle) use ($language) {
            return [
                'id' => $motCle->id,
                'keyword' => $language === 'en' ? $motCle->keyword_en : $motCle->keyword_fr,
                'order' => $motCle->order
            ];
        });

        $formatted_theme = [
            'id' => $theme->id,
            'title' => $language === 'en' ? $theme->title_en : $theme->title_fr,
            'description' => $language === 'en' ? $theme->description_en : $theme->description_fr,
            'icon' => $language === 'en' ? $theme->icon_en : $theme->icon_fr,
            'order' => $theme->order,
            'keywords' => $keywords,
            'is_active' => $theme->is_active
        ];

        return response()->json([
            'success' => true,
            'language' => $language,
            'data' => $formatted_theme
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_fr' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description_fr' => 'required|string',
            'description_en' => 'required|string',
            'icon_fr' => 'nullable|string|max:255',
            'icon_en' => 'nullable|string|max:255',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
            'keywords' => 'array',
            'keywords.*.keyword_fr' => 'required|string|max:255',
            'keywords.*.keyword_en' => 'required|string|max:255',
            'keywords.*.order' => 'integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            // Créer le thème
            $theme = Theme::create([
                'title_fr' => $validated['title_fr'],
                'title_en' => $validated['title_en'],
                'description_fr' => $validated['description_fr'],
                'description_en' => $validated['description_en'],
                'icon_fr' => $validated['icon_fr'] ?? null,
                'icon_en' => $validated['icon_en'] ?? null,
                'order' => $validated['order'] ?? 0,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Créer les mots-clés s'ils existent
            if (isset($validated['keywords'])) {
                foreach ($validated['keywords'] as $keyword) {
                    MotsCles::create([
                        'theme_id' => $theme->id,
                        'keyword_fr' => $keyword['keyword_fr'],
                        'keyword_en' => $keyword['keyword_en'],
                        'order' => $keyword['order'] ?? 0
                    ]);
                }
            }

            DB::commit();

            // Recharger le thème avec ses mots-clés
            $theme->load('motsCles');

            return response()->json([
                'success' => true,
                'message' => 'Thème créé avec succès',
                'data' => $theme
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du thème: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $theme = Theme::findOrFail($id);

        $validated = $request->validate([
            'title_fr' => 'string|max:255',
            'title_en' => 'string|max:255',
            'description_fr' => 'string',
            'description_en' => 'string',
            'icon_fr' => 'nullable|string|max:255',
            'icon_en' => 'nullable|string|max:255',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
            'keywords' => 'array',
            'keywords.*.id' => 'nullable|integer|exists:mots_cles,id',
            'keywords.*.keyword_fr' => 'required|string|max:255',
            'keywords.*.keyword_en' => 'required|string|max:255',
            'keywords.*.order' => 'integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            // Mettre à jour le thème
            $theme->update(array_filter([
                'title_fr' => $validated['title_fr'] ?? $theme->title_fr,
                'title_en' => $validated['title_en'] ?? $theme->title_en,
                'description_fr' => $validated['description_fr'] ?? $theme->description_fr,
                'description_en' => $validated['description_en'] ?? $theme->description_en,
                'icon_fr' => $validated['icon_fr'] ?? $theme->icon_fr,
                'icon_en' => $validated['icon_en'] ?? $theme->icon_en,
                'order' => $validated['order'] ?? $theme->order,
                'is_active' => $validated['is_active'] ?? $theme->is_active,
            ]));

            // Gérer les mots-clés s'ils sont fournis
            if (isset($validated['keywords'])) {
                $existingKeywordIds = [];

                foreach ($validated['keywords'] as $keyword) {
                    if (isset($keyword['id'])) {
                        // Mettre à jour le mot-clé existant
                        $motCle = MotsCles::findOrFail($keyword['id']);
                        $motCle->update([
                            'keyword_fr' => $keyword['keyword_fr'],
                            'keyword_en' => $keyword['keyword_en'],
                            'order' => $keyword['order'] ?? 0
                        ]);
                        $existingKeywordIds[] = $keyword['id'];
                    } else {
                        // Créer un nouveau mot-clé
                        $newMotCle = MotsCles::create([
                            'theme_id' => $theme->id,
                            'keyword_fr' => $keyword['keyword_fr'],
                            'keyword_en' => $keyword['keyword_en'],
                            'order' => $keyword['order'] ?? 0
                        ]);
                        $existingKeywordIds[] = $newMotCle->id;
                    }
                }

                // Supprimer les mots-clés qui ne sont plus dans la liste
                MotsCles::where('theme_id', $theme->id)
                        ->whereNotIn('id', $existingKeywordIds)
                        ->delete();
            }

            DB::commit();

            // Recharger le thème avec ses mots-clés
            $theme->load('motsCles');

            return response()->json([
                'success' => true,
                'message' => 'Thème mis à jour avec succès',
                'data' => $theme
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du thème: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $theme = Theme::findOrFail($id);

        DB::beginTransaction();

        try {
            // Les mots-clés seront supprimés automatiquement grâce à onDelete('cascade')
            $theme->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Thème supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du thème: ' . $e->getMessage()
            ], 500);
        }
    }
}
