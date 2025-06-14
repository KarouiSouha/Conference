<?php

use App\Http\Controllers\SpeakerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImportantDateController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComiteController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\GalleryController;


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
Route::prefix('Theme')->controller(ThemeController::class)->group(function () {
    Route::get('/all', 'displayAll');    // GET /api/Theme/all?lang=fr ou ?lang=en
    Route::get('/{id}', 'displayOne');   // GET /api/Theme/{id}?lang=fr ou ?lang=en
    Route::post('/', 'store');           // POST /api/Theme
    Route::put('/{id}', 'update');       // PUT /api/Theme/{id}
    Route::delete('/{id}', 'destroy');   // DELETE /api/Theme/{id}
});
Route::prefix('Partners')->controller(PartnerController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
});
Route::prefix('Gallery')->controller(GalleryController::class)->group(function () {
    Route::get('/all', 'displayAll');           // GET /api/Gallery/all
    Route::get('/photos', 'displayPhotos');     // GET /api/Gallery/photos
    Route::get('/videos', 'displayVideos');     // GET /api/Gallery/videos
    Route::get('/{id}', 'displayOne');          // GET /api/Gallery/{id}
    Route::post('/', 'store');                  // POST /api/Gallery
});
