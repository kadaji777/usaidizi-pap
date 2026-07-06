<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentLog extends Model
{
    protected $fillable = [
        'local_uuid',
        'patient_id',
        'topic_id',
        'facility_id',
        'incident_timestamp',
        'description',
        'actions_taken',
        'location_description',
        'severity',
        'sync_status',
    ];
}