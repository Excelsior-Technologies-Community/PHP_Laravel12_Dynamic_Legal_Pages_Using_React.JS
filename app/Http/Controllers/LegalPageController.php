<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use App\Models\LegalPageVersion;
use App\Models\UserTermsAcceptance;
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

        $legalPage = LegalPage::create([
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        LegalPageVersion::create([
            'legal_page_id' => $legalPage->id,
            'title'         => $legalPage->title,
            'description'   => $legalPage->description,
            'version_number'=> 1,
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

        $lastVersion = LegalPageVersion::where('legal_page_id', $legal->id)->max('version_number') ?? 0;

        LegalPageVersion::create([
            'legal_page_id' => $legal->id,
            'title'         => $legal->title,
            'description'   => $legal->description,
            'version_number'=> $lastVersion + 1,
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

    // 🔹 Get version history
    public function versions($id)
    {
        $legal = LegalPage::findOrFail($id);

        return LegalPageVersion::where('legal_page_id', $legal->id)
            ->orderByDesc('version_number')
            ->get();
    }

    // 🔹 Rollback to specific version
    public function rollback(Request $request, $id)
    {
        $request->validate([
            'version_number' => 'required|integer|min:1',
        ]);

        $legal = LegalPage::findOrFail($id);

        $version = LegalPageVersion::where('legal_page_id', $legal->id)
            ->where('version_number', $request->version_number)
            ->firstOrFail();

        $lastVersion = LegalPageVersion::where('legal_page_id', $legal->id)->max('version_number') ?? 0;

        LegalPageVersion::create([
            'legal_page_id' => $legal->id,
            'title'         => $legal->title,
            'description'   => $legal->description,
            'version_number'=> $lastVersion + 1,
        ]);

        $legal->update([
            'title'       => $version->title,
            'description' => $version->description,
        ]);

        return response()->json(['message' => 'Rolled back to version ' . $request->version_number]);
    }

    // 🔹 Accept terms
    public function acceptTerms(Request $request)
    {
        $data = $request->only(['legal_page_id', 'name', 'email']);

        if ($data['name'] === '') {
            $data['name'] = null;
        }
        if ($data['email'] === '') {
            $data['email'] = null;
        }

        $validator = \Validator::make($data, [
            'legal_page_id' => 'required|exists:legal_pages,id',
            'name'          => 'nullable|string|max:255',
            'email'         => 'nullable|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        UserTermsAcceptance::create([
            'legal_page_id' => $data['legal_page_id'],
            'session_id'    => $request->session()->getId(),
            'name'          => $data['name'],
            'email'         => $data['email'],
            'accepted_at'   => now(),
            'ip_address'    => $request->ip(),
        ]);

        return response()->json(['message' => 'Terms accepted successfully'], 201);
    }

    // 🔹 Check if terms accepted
    public function checkAcceptance(Request $request, $id)
    {
        $legal = LegalPage::findOrFail($id);

        $accepted = UserTermsAcceptance::where('legal_page_id', $legal->id)
            ->where('session_id', $request->session()->getId())
            ->exists();

        return response()->json([
            'accepted' => $accepted,
            'legal_page_id' => $legal->id,
        ]);
    }
}

