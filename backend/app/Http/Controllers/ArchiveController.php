<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Archive;

class ArchiveController extends Controller
{
    public function displayAll(){
        $archives = Archive::all();
        return response()->json($archives);
    }
}
