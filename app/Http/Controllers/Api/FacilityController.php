<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $query = Facility::query();
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        if ($request->has('county')) {
            $query->where('county', $request->county);
        }
        
        return response()->json($query->get());
    }
    
    public function show($id)
    {
        $facility = Facility::find($id);
        
        if (!$facility) {
            return response()->json(['message' => 'Facility not found'], 404);
        }
        
        return response()->json($facility);
    }
}