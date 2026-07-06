<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'local_uuid' => 'required|string',
            'full_name' => 'required|string',
            'age' => 'nullable|integer',
            'gender' => 'nullable|in:M,F,Other',
            'blood_group' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medical_notes' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $validated['sync_status'] = 'synced';

        // updateOrCreate keyed on local_uuid so a retried sync
        // doesn't create duplicate patients
        $patient = Patient::updateOrCreate(
            ['local_uuid' => $validated['local_uuid']],
            $validated
        );

        return response()->json($patient, 201);
    }
}