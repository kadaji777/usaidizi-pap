<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FirstAidTopic;
use Illuminate\Http\Request;

class FirstAidController extends Controller
{
    public function index()
    {
        $topics = FirstAidTopic::select('id', 'title', 'slug', 'category', 'description')
                               ->get();
        return response()->json($topics);
    }
    
    public function show($slug)
    {
        $topic = FirstAidTopic::where('slug', $slug)->first();
        
        if (!$topic) {
            return response()->json(['message' => 'Topic not found'], 404);
        }
        
        // Decode JSON fields
        $topic->steps = json_decode($topic->steps);
        $topic->dos = json_decode($topic->dos);
        $topic->donts = json_decode($topic->donts);
        
        return response()->json($topic);
    }
}
