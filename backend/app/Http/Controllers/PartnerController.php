<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partner;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
  public function displayAll()
  {
    $partners = Partner::all();
    return response()->json($partners);
  }
  public function store(Request $request)
  {
    // Valider les champs du formulaire
    $request->validate([
      'name_fr' => 'required|string|max:255',
      'name_en' => 'required|string|max:255',
      'type' => 'required|string|max:255',
      'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    // Sauvegarder l'image dans "storage/app/public/images"
    $image = null;
    if ($request->hasFile('image')) {
      $image = $request->file('image')->store('images', 'public');
    }

    // Créer le partenaire
    $partner = Partner::create([
      'name_fr' => $request->input('name_fr'),
      'name_en' => $request->input('name_en'),
      'type' => $request->input('type'),
      'image' => $image,
    ]);

    return response()->json([
      'message' => 'Partenaire ajouté avec succès',
      'partner' => $partner,
    ], 201);
  }

  public function update(Request $request, $id)
  {
    $partner = Partner::find($id);

    if (!$partner) {
      return response()->json(['message' => 'Partenaire non trouvé'], 404);
    }

    // Valider les champs
    $request->validate([
      'name_fr' => 'required|string|max:255',
      'name_en' => 'required|string|max:255',
      'type' => 'required|string|max:255',
      'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    // Sauvegarde de la nouvelle image si elle est envoyée
    if ($request->hasFile('image')) {
      $image = $request->file('image')->store('images', 'public');
      $partner->image = $image;
    }

    // Mettre à jour les autres champs
    $partner->name_fr = $request->input('name_fr');
    $partner->name_en = $request->input('name_en');
    $partner->type = $request->input('type');
    $partner->save();

    return response()->json([
      'message' => 'Partenaire mis à jour avec succès',
      'partner' => $partner,
    ]);
  }

  public function destroy($id)
  {
    $partner = Partner::find($id);

    if (!$partner) {
      return response()->json(['message' => 'Partenaire non trouvé'], 404);
    }

    // Supprimer l'image du storage si elle existe
    if ($partner->image && Storage::disk('public')->exists($partner->image)) {
      Storage::disk('public')->delete($partner->image);
    }

    // Supprimer le partenaire de la base de données
    $partner->delete();

    return response()->json(['message' => 'Partenaire supprimé avec succès']);
  }


}
