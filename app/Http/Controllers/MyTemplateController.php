<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyTemplateController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $templates = Template::all(); // Fetch all templates from the database
        return Inertia::render('Templates', [ // Use the name of your JSX file here
            'templates' => $templates, // Pass the templates to the view
        ]);
    }

    // Show the form for creating a new resource
    public function create()
    {
        // You may not need this if you're using a modal form in React
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
    
        // Create a new template in the database
        $template = Template::create($validatedData);

        // Return the newly created template as a JSON response
        return response()->json($template, 201);
    }

    // Display the specified resource
    public function show($id)
    {
        $template = Template::findOrFail($id);
        return response()->json($template);
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
    {
        $template = Template::findOrFail($id);
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);
        
        $template->update($validatedData);
        return response()->json($template);
    }

    // Remove the specified resource from storage
    public function destroy($id)
    {
        $template = Template::findOrFail($id);
        $template->delete();
        return response()->json(null, 204);
    }
}
