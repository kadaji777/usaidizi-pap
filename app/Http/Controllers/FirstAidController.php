<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FirstAidController extends Controller
{
    /**
     * This controller handles first aid guide operations.
     * Contributed by Peter Onyango Atonga
     */
    public function index()
    {
        return response()->json(['message' => 'First Aid Controller']);
    }
}