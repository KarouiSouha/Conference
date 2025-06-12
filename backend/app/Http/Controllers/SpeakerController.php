<?php

namespace App\Http\Controllers;

use App\Models\Speaker;
use Illuminate\Http\Request;

class SpeakerController extends Controller
{
    public function displayAll()
    {
        $speakers = Speaker::with('realisations')->get();
        return response()->json($speakers);
    }
    public function displayOne($id)
    {
        $speaker = Speaker::with('realisations')->find($id);
        if (!$speaker) {
            return response()->json(['message' => 'Speaker not found'], 404);
        }
        return response()->json($speaker);
    }
}
