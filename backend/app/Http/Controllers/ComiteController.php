<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comite;
use Illuminate\Support\Facades\Storage;

class ComiteController extends Controller
{
    public function displayAll(Request $request)
    {
        $comites = Comite::orderBy('committee_type')
            ->orderBy('special_role')
            ->orderBy('order')
            ->get();

        $organized = [
            'scientific' => [
                'general_chair' => [],
                'chair' => [],
                'co_chair' => [],
                'members' => []
            ],
            'organizing' => ['chair' => null, 'members' => []],
            'honorary' => ['members' => []],
            'proceeding' => ['members' => []]
        ];

        foreach ($comites as $comite) {
            $member = [
                'id' => $comite->id,
                'name_fr' => $comite->name_fr,
                'name_en' => $comite->name_en,
                'institute_fr' => $comite->institute_fr,
                'institute_en' => $comite->institute_en,
                'job_fr' => $comite->job_fr,
                'job_en' => $comite->job_en,
                'special_role' => $comite->special_role,
                'committee_type' => $comite->committee_type,
                'order' => $comite->order,
                'image_path' => $comite->image_path
            ];

            if ($comite->committee_type === 'scientific') {
                if ($comite->special_role === 'general chair') {
                    $organized['scientific']['general_chair'][] = $member;
                } elseif ($comite->special_role === 'chair') {
                    $organized['scientific']['chair'][] = $member;
                } elseif ($comite->special_role === 'co-chair') {
                    $organized['scientific']['co_chair'][] = $member;
                } else {
                    $organized['scientific']['members'][] = $member;
                }
            } elseif ($comite->committee_type === 'organizing') {
                if ($comite->special_role === 'chair') {
                    $organized['organizing']['chair'] = $member;
                } else {
                    $organized['organizing']['members'][] = $member;
                }
            } elseif ($comite->committee_type === 'honorary') {
                $organized['honorary']['members'][] = $member;
            } elseif ($comite->committee_type === 'proceeding') {
                $organized['proceeding']['members'][] = $member;
            }
        }

        return response()->json(['success' => true, 'data' => $organized]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_fr' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'institute_fr' => 'nullable|string|max:255',
            'institute_en' => 'nullable|string|max:255',
            'job_fr' => 'nullable|string|max:255',
            'job_en' => 'nullable|string|max:255',
            'committee_type' => 'required|in:scientific,organizing,honorary,proceeding',
            'special_role' => 'required|in:chair,co-chair,member,general chair',
            'order' => 'integer|min:0',
            'image_path' => 'nullable|image|max:2048'
        ]);

        $data = $validated;
        if ($request->hasFile('image_path')) {
            $data['image_path'] = $request->file('image_path')->store('images', 'public');
        }

        $comite = Comite::create($data);

        return response()->json(['success' => true, 'message' => 'Comité ajouté avec succès', 'data' => $comite], 201);
    }

    public function update(Request $request, $id)
    {
        // \Log::info('Update request received:', [
        //     'id' => $id,
        //     'all' => $request->all(),
        //     'files' => $request->hasFile('image_path') ? $request->file('image_path')->getClientOriginalName() : 'No file',
        //     'method' => $request->method(),
        //     'has_method_field' => $request->has('_method')
        // ]);

        $comite = Comite::findOrFail($id);

        $validated = $request->validate([
            'name_fr' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'institute_fr' => 'nullable|string|max:255',
            'institute_en' => 'nullable|string|max:255',
            'job_fr' => 'nullable|string|max:255',
            'job_en' => 'nullable|string|max:255',
            'committee_type' => 'required|in:scientific,organizing,honorary,proceeding',
            'special_role' => 'required|in:chair,co-chair,member,general chair',
            'order' => 'required|integer|min:0',
            'image_path' => 'nullable|image|max:2048',
            // 'removeImage' => 'nullable|boolean'
        ]);

        // \Log::info('Validated data:', $validated);

        $data = $validated;

        // Handle image removal
        if ($request->input('removeImage') && !$request->hasFile('image_path')) {
            if ($comite->image_path && Storage::disk('public')->exists($comite->image_path)) {
                Storage::disk('public')->delete($comite->image_path);
            }
            $data['image_path'] = null;
        } elseif ($request->hasFile('image_path')) {
            // Delete existing image if a new one is uploaded
            if ($comite->image_path && Storage::disk('public')->exists($comite->image_path)) {
                Storage::disk('public')->delete($comite->image_path);
            }
            $data['image_path'] = $request->file('image_path')->store('images', 'public');
        }

        $comite->update($data);

        // \Log::info('Updated comite:', $comite->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Comité mis à jour avec succès',
            'data' => $comite
        ]);
    }

    public function destroy($id)
    {
        $comite = Comite::findOrFail($id);
        if ($comite->image_path) {
            Storage::disk('public')->delete($comite->image_path);
        }
        $comite->delete();

        return response()->json(['success' => true, 'message' => 'Comité supprimé avec succès']);
    }
}