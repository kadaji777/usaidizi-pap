<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    protected $fillable = [
        'local_uuid',
        'patient_id',
        'name',
        'phone',
        'relationship',
        'is_primary',
        'sync_status',
    ];
}