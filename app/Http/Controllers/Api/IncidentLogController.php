<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IncidentLog;
use App\Models\Patient;
use Illuminate\Http\Request;

class IncidentLogController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'local_uuid' => 'required|string',
            'patient_local_uuid' => 'nullable|string',
            'topic_id' => 'nullable|integer|exists:first_aid_topics,id',
            'facility_id' => 'nullable|integer|exists:facilities,id',
            'incident_timestamp' => 'required|date',
            'description' => 'required|string',
            'actions_taken' => 'nullable|string',
            'location_description' => 'nullable|string',
            'severity' => 'required|in:low,medium,high,critical',
        ]);

        $patientId = null;
        if (!empty($validated['patient_local_uuid'])) {
            $patientId = Patient::where('local_uuid', $validated['patient_local_uuid'])->value('id');
        }

        $incident = IncidentLog::updateOrCreate(
            ['local_uuid' => $validated['local_uuid']],
            [
                'patient_id' => $patientId,
                'topic_id' => $validated['topic_id'] ?? null,
                'facility_id' => $validated['facility_id'] ?? null,
                'incident_timestamp' => $validated['incident_timestamp'],
                'description' => $validated['description'],
                'actions_taken' => $validated['actions_taken'] ?? null,
                'location_description' => $validated['location_description'] ?? null,
                'severity' => $validated['severity'],
                'sync_status' => 'synced',
            ]
        );

        return response()->json($incident, 201);
    }
}