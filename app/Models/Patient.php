<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'local_uuid',
        'full_name',
        'age',
        'gender',
        'blood_group',
        'allergies',
        'medical_notes',
        'phone',
        'address',
        'sync_status',
    ];
}