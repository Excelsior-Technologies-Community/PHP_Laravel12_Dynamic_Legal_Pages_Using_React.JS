<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use Illuminate\Http\Request;

class LegalPageController extends Controller
{
    // 🔹 List all legal pages
    public function index()
    {
        return LegalPage::latest()->get();
    }

    // 🔹 Store legal page
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        LegalPage::create([
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Legal page created successfully'], 201);
    }

    // 🔹 Edit (get single)
    public function edit($id)
    {
        return LegalPage::findOrFail($id);
    }

    // 🔹 Update
    public function update(Request $request, $id)
    {
        $legal = LegalPage::findOrFail($id);

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $legal->update([
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Legal page updated successfully']);
    }

    // 🔹 Delete
    public function destroy($id)
    {
        LegalPage::findOrFail($id)->delete();

        return response()->json(['message' => 'Legal page deleted successfully']);
    }
}
