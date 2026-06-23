\<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FirstAidController;
use App\Http\Controllers\Api\FacilityController;

Route::prefix('v1')->group(function () {
    Route::get('/firstaid', [FirstAidController::class, 'index']);
    Route::get('/firstaid/{slug}', [FirstAidController::class, 'show']);
    Route::get('/facilities', [FacilityController::class, 'index']);
    Route::get('/facilities/{id}', [FacilityController::class, 'show']);
});