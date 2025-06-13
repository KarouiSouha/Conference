<?php

use App\Http\Controllers\SpeakerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImportantDateController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComiteController;
use App\Http\Controllers\PartnerController;

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
Route::prefix('Speakers')->controller(SpeakerController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
});
Route::post('login', [AuthController::class, 'login']);

Route::prefix('Comite')->controller(ComiteController::class)->group(function () {
    Route::get('/all', 'displayAll'); // GET /api/Comite/all?lang=fr ou ?lang=en
    Route::post('/', 'store');         // POST /api/Comite
    Route::put('/{id}', 'update');     // PUT /api/Comite/{id}
    Route::delete('/{id}', 'destroy'); // DELETE /api/Comite/{id}
});

Route::prefix('Partners')->controller(PartnerController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
});