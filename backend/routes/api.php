<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImportantDateController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ce fichier est utilisé pour enregistrer les routes de l’API. Toutes
| les routes de ce fichier sont automatiquement préfixées par /api.
|
*/

// Exemple de route protégée (facultatif)
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::apiResource('dates', ImportantDateController::class);
