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
        $language = $request->query('lang', 'fr');

        // Récupérer tous les thèmes avec leurs mots-clés (pas de filtre actif)
        $themes = Theme::ordered()
            ->with('motsCles')
            ->get();

        $formatted_themes = $themes->map(function ($theme) use ($language) {
            $keywords = $theme->motsCles->map(function ($motCle) use ($language) {
                return [
                    'id' => $motCle->id,
                    'keywordFr' => $motCle->keyword_fr,
                    'keywordEn' => $motCle->keyword_en,
                    'order' => $motCle->order
                ];
            });

            return [
                'id' => $theme->id,
                'titleFr' => $theme->title_fr,
                'titleEn' => $theme->title_en,
                'descriptionFr' => $theme->description_fr,
                'descriptionEn' => $theme->description_en,
                'icon' => $theme->icon,
                'icon_url' => $theme->icon_url,
                'is_icon_class' => $theme->isIconClass(),
                'color' => $theme->color ?? null,
                'order' => $theme->order,
                'sessions' => $theme->sessions,
                'lastUpdated' => $theme->updated_at,
                'keywords' => $keywords
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

        return response()->json([
            'success' => true,
            'language' => $language,
            'data' => [
                'id' => $theme->id,
                'titleFr' => $theme->title_fr,
                'titleEn' => $theme->title_en,
                'descriptionFr' => $theme->description_fr,
                'descriptionEn' => $theme->description_en,
                'icon' => $theme->icon,
                'icon_url' => $theme->icon_url,
                'is_icon_class' => $theme->isIconClass(),
                'color' => $theme->color ?? null,
                'order' => $theme->order,
                'sessions' => $theme->sessions,
                'lastUpdated' => $theme->updated_at,
                'keywords' => $keywords
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titleFr' => 'required|string|max:255',
            'titleEn' => 'required|string|max:255',
            'descriptionFr' => 'required|string',
            'descriptionEn' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'order' => 'integer|min:0',
            'sessions' => 'integer|min:0',
            'keywords' => 'array',
            'keywords.*.keyword_fr' => 'required|string|max:255',
            'keywords.*.keyword_en' => 'required|string|max:255',
            'keywords.*.order' => 'integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            $theme = Theme::create([
                'title_fr' => $validated['titleFr'],
                'title_en' => $validated['titleEn'],
                'description_fr' => $validated['descriptionFr'],
                'description_en' => $validated['descriptionEn'],
                'icon' => $validated['icon'] ?? null,
                'color' => $validated['color'] ?? null,
                'order' => $validated['order'] ?? 0,
                'sessions' => $validated['sessions'] ?? 0
            ]);

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
            'titleFr' => 'string|max:255',
            'titleEn' => 'string|max:255',
            'descriptionFr' => 'string',
            'descriptionEn' => 'string',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'order' => 'integer|min:0',
            'sessions' => 'integer|min:0',
            'keywords' => 'array',
            'keywords.*.id' => 'nullable|integer|exists:mots_cles,id',
            'keywords.*.keyword_fr' => 'required|string|max:255',
            'keywords.*.keyword_en' => 'required|string|max:255',
            'keywords.*.order' => 'integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            $theme->update(array_filter([
                'title_fr' => $validated['titleFr'] ?? $theme->title_fr,
                'title_en' => $validated['titleEn'] ?? $theme->title_en,
                'description_fr' => $validated['descriptionFr'] ?? $theme->description_fr,
                'description_en' => $validated['descriptionEn'] ?? $theme->description_en,
                'icon' => $validated['icon'] ?? $theme->icon,
                'color' => $validated['color'] ?? $theme->color,
                'order' => $validated['order'] ?? $theme->order,
                'sessions' => $validated['sessions'] ?? $theme->sessions
            ]));

            if (isset($validated['keywords'])) {
                $existingKeywordIds = [];

                foreach ($validated['keywords'] as $keyword) {
                    if (isset($keyword['id'])) {
                        $motCle = MotsCles::findOrFail($keyword['id']);
                        $motCle->update([
                            'keyword_fr' => $keyword['keyword_fr'],
                            'keyword_en' => $keyword['keyword_en'],
                            'order' => $keyword['order'] ?? 0
                        ]);
                        $existingKeywordIds[] = $keyword['id'];
                    } else {
                        $newMotCle = MotsCles::create([
                            'theme_id' => $theme->id,
                            'keyword_fr' => $keyword['keyword_fr'],
                            'keyword_en' => $keyword['keyword_en'],
                            'order' => $keyword['order'] ?? 0
                        ]);
                        $existingKeywordIds[] = $newMotCle->id;
                    }
                }

                MotsCles::where('theme_id', $theme->id)
                    ->whereNotIn('id', $existingKeywordIds)
                    ->delete();
            }

            DB::commit();
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

    public function deleteKeyword($id)
    {
        try {
            $keyword = MotsCles::findOrFail($id);
            $keyword->delete();

            return response()->json([
                'success' => true,
                'message' => 'Mot clé supprimé avec succès.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du mot clé : ' . $e->getMessage()
            ], 500);
        }
    }

}
