<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;

class NewsController extends Controller
{
    public function displayAll()
    {
        $news = News::orderBy('date', 'desc')->take(4)->get();
        return response()->json($news);
    }
}
