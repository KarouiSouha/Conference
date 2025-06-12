<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ImportantDate;

class ImportantDateController extends Controller
{
    public function index()
    {
        return ImportantDate::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_fr' => 'required|string',
            'event_en' => 'required|string',
            'date' => 'required|date',
            'description_fr' => 'nullable|string',
            'description_en' => 'nullable|string'
        ]);

        return ImportantDate::create($validated);
    }

    public function update(Request $request, $id)
    {
        $date = ImportantDate::findOrFail($id);
        $date->update($request->all());
        return $date;
    }

    public function destroy($id)
    {
        ImportantDate::destroy($id);
        return response()->json(['message' => 'Date deleted']);
    }

}
