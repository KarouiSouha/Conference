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
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\NewsController;


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
    // hthy
    Route::post('/store', [SpeakerController::class, 'store']);
    // hthy
    Route::put('/update/{id}', [SpeakerController::class, 'update']);
    // hthy
    Route::delete('/destroy/{id}', [SpeakerController::class, 'destroy']);
    Route::get('/count', 'count');

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
    Route::delete('/keyword/{id}', 'deleteKeyword');  // DELETE /api/Theme/keyword/{id}

});
Route::prefix('Partners')->controller(PartnerController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
    Route::post('/store', [PartnerController::class, 'store']);
    Route::post('/update/{id}', [PartnerController::class, 'update']);
    Route::delete('/destroy/{id}', [PartnerController::class, 'destroy']);
    Route::get('/count', 'count');

});
Route::prefix('Gallery')->controller(GalleryController::class)->group(function () {
    Route::get('/all', 'displayAll');           // GET /api/Gallery/all
    Route::get('/photos', 'displayPhotos');     // GET /api/Gallery/photos
    Route::get('/videos', 'displayVideos');     // GET /api/Gallery/videos
    Route::get('/{id}', 'displayOne');          // GET /api/Gallery/{id}
    Route::post('/', 'store');                  // POST /api/Gallery
});
Route::prefix('Programme')->controller(ProgrammeController::class)->group(function () {
    Route::get('/all', 'index');                    // GET /api/Programme/all?lang=fr ou ?lang=en
    Route::get('/daily', 'daily');                  // GET /api/Programme/daily?date=2025-06-14&lang=fr
    Route::get('/next-three-days', 'nextThreeDays'); // GET /api/Programme/next-three-days?lang=fr
    Route::get('/current-month', 'currentMonth');    // GET /api/Programme/current-month?lang=fr
    Route::post('/', 'store');                      // POST /api/Programme
    Route::put('/{id}', 'update');                  // PUT /api/Programme/{id}
    Route::delete('/{id}', 'destroy');              // DELETE /api/Programme/{id}
});
// Routes pour les inscriptions
Route::prefix('Registration')->controller(RegistrationController::class)->group(function () {
    Route::get('/all', 'index');
    Route::get('/count', 'count');               // 👈 Mettre AVANT /{id}
    Route::get('/statistics', 'statistics');     // 👈 Mettre AVANT /{id}
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
    Route::patch('/{id}/mark-as-paid', 'markAsPaid');
});


Route::prefix('Archive')->controller(ArchiveController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
    Route::post('/store', [ArchiveController::class, 'store']);
    Route::put('/update/{id}', [ArchiveController::class, 'update']);
    Route::delete('/destroy/{id}', [ArchiveController::class, 'destroy']);
});

Route::prefix('News')->controller(NewsController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
    Route::post('/store', [NewsController::class, 'store']);
    Route::put('/update/{id}', [NewsController::class, 'update']);
    Route::delete('/destroy/{id}', [NewsController::class, 'destroy']);
    Route::get('/published', [NewsController::class, 'getPublished']);
    Route::get('/count', 'count');

});
