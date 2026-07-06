<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmergencyContact;
use App\Models\Patient;
use Illuminate\Http\Request;

class EmergencyContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'local_uuid' => 'required|string',
            'patient_local_uuid' => 'nullable|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            'relationship' => 'required|string',
            'is_primary' => 'boolean',
        ]);

        // Resolve the local Dexie patient reference to the real server-side patient id
        $patientId = null;
        if (!empty($validated['patient_local_uuid'])) {
            $patientId = Patient::where('local_uuid', $validated['patient_local_uuid'])->value('id');
        }

        $contact = EmergencyContact::updateOrCreate(
            ['local_uuid' => $validated['local_uuid']],
            [
                'patient_id' => $patientId,
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'relationship' => $validated['relationship'],
                'is_primary' => $validated['is_primary'] ?? false,
                'sync_status' => 'synced',
            ]
        );

        return response()->json($contact, 201);
    }
}