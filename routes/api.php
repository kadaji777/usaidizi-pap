<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FirstAidController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\EmergencyContactController;
use App\Http\Controllers\Api\IncidentLogController;
use App\Http\Controllers\Api\AdminController;

Route::prefix('v1')->group(function () {
    Route::get('/firstaid', [FirstAidController::class, 'index']);
    Route::get('/firstaid/{slug}', [FirstAidController::class, 'show']);
    Route::get('/facilities', [FacilityController::class, 'index']);
    Route::get('/facilities/{id}', [FacilityController::class, 'show']);

    Route::post('/patients', [PatientController::class, 'store']);
    Route::post('/contacts', [EmergencyContactController::class, 'store']);
    Route::post('/incidents', [IncidentLogController::class, 'store']);

    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/incidents', [AdminController::class, 'incidents']);
});