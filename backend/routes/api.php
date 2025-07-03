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
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ce fichier est utilisé pour enregistrer les routes de l’API. Toutes
| les routes de ce fichier sont automatiquement préfixées par /api.
|
*/

Route::prefix('Contact')->controller(ContactController::class)->group(function () {
    Route::get('/', 'index');       
    Route::post('/store', 'store');      
    Route::get('/{id}', 'displayOne');  
    Route::put('/{id}', 'update');      
    Route::delete('/{id}', 'destroy'); 
    Route::get('/{id}/view',  'view');
    Route::post('/{id}/send-reply',  'sendReply');  
});

Route::apiResource('dates', ImportantDateController::class);
Route::prefix('Speakers')->controller(SpeakerController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
 

    Route::post('/store', 'store');
    Route::put('/update/{id}', 'update');
    Route::delete('/destroy/{id}', 'destroy');
    Route::get('/count', 'count');
    Route::get('/statistics', 'statistics');
    Route::delete('/realisation/{id}', 'destroyRealisation'); // Nouvelle route
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
    Route::get('/statistics', 'statistics');

});
Route::prefix('Partners')->controller(PartnerController::class)->group(function () {
    Route::get('/all', 'displayAll');
    Route::get('get/{id}', 'displayOne');
    Route::post('/store', [PartnerController::class, 'store']);
    Route::put('/update/{id}', [PartnerController::class, 'update']);
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

Route::prefix('Registration')->controller(RegistrationController::class)->group(function () {
    // Routes spécifiques AVANT les routes avec paramètres
    Route::get('/all', 'index');
    Route::get('/count', 'count');
    Route::get('/statistics', 'statistics');
    Route::get('/all-participants-by-country', 'allParticipantsByCountry'); // 👈 CORRIGÉ
    Route::get('/participants-by-country/{countryCode}', 'participantsByCountry'); // 👈 CORRIGÉ
    Route::get('/recent','recent');
    

    // Routes avec paramètres APRÈS
    Route::get('/{id}', 'show');
    Route::post('/send-receipt','sendReceipt');
    Route::post('/', 'store');
    Route::post('/update/{id}', 'update');
    Route::delete('/{id}', 'destroy');
    Route::patch('/{id}/mark-as-paid', 'markAsPaid');
    Route::get('/{id}/download-badge/{language}', 'downloadBadge')
        ->name('api.registration.download-badge');
    
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

Route::get('/download-badge/{id}', [BadgeController::class, 'downloadBadge'])->name('download.badge');

// Dans votre controller ou routes/api.php
Route::get('/download-payment-proof/{path}', function ($path) {
    // Décoder le chemin si nécessaire
    $decodedPath = urldecode($path);
    $fullPath = storage_path('app/public/' . $decodedPath);
    
    if (!file_exists($fullPath)) {
        abort(404);
    }
    
    return response()->download($fullPath);
})->where('path', '.*')->name('download.payment.proof');

