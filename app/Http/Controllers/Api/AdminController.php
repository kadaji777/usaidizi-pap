<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\IncidentLog;
use App\Models\EmergencyContact;
use App\Models\Facility;

class AdminController extends Controller
{
    /**
     * Aggregate counts across ALL users' synced data — used by
     * AdminDashboard and as the summary cards on Admin analytics.
     */
    public function stats()
    {
        return response()->json([
            'incidents' => IncidentLog::count(),
            'patients' => Patient::count(),
            'contacts' => EmergencyContact::count(),
            'facilities' => Facility::count(),
        ]);
    }

    /**
     * Raw incident records (severity + timestamp) for the analytics
     * charts — severity pie chart and last-6-months bar chart.
     */
    public function incidents()
    {
        return response()->json(
            IncidentLog::select('id', 'severity', 'incident_timestamp')->get()
        );
    }
}