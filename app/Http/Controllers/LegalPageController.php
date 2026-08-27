<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use App\Models\LegalPageVersion;
use App\Models\UserTermsAcceptance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LegalPageController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LIST LEGAL PAGES
    |--------------------------------------------------------------------------
    | Features:
    | - Search
    | - Status filter
    | - Pagination
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $query = LegalPage::query();

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where(
                    'title',
                    'like',
                    "%{$search}%"
                )
                    ->orWhere(
                        'description',
                        'like',
                        "%{$search}%"
                    );
            });
        }

        /*
        |--------------------------------------------------------------------------
        | STATUS FILTER
        |--------------------------------------------------------------------------
        |
        | ?status=active
        | ?status=inactive
        |
        */

        if ($request->filled('status')) {

            if ($request->status === 'active') {

                $query->where(
                    'status',
                    true
                );
            }

            if ($request->status === 'inactive') {

                $query->where(
                    'status',
                    false
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

        $perPage = (int) $request->get(
            'per_page',
            10
        );

        if ($perPage < 1) {
            $perPage = 10;
        }

        if ($perPage > 100) {
            $perPage = 100;
        }

        return response()->json(

            $query
                ->latest()
                ->paginate($perPage)

        );
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $request->validate([

            'title' =>
            'required|string|max:255',

            'description' =>
            'required|string',

            'status' =>
            'nullable|boolean',
        ]);

        $legalPage =
            LegalPage::create([

                'title' =>
                $request->title,

                'description' =>
                $request->description,

                'status' =>
                $request->boolean(
                    'status',
                    true
                ),

            ]);

        LegalPageVersion::create([

            'legal_page_id' =>
            $legalPage->id,

            'title' =>
            $legalPage->title,

            'description' =>
            $legalPage->description,

            'version_number' =>
            1,

        ]);

        return response()->json([

            'success' => true,

            'message' =>
            'Legal page created successfully',

            'legal_page' =>
            $legalPage,

        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT / GET SINGLE
    |--------------------------------------------------------------------------
    */

    public function edit($id)
    {
        return LegalPage::findOrFail($id);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        $id
    ) {

        $legal =
            LegalPage::findOrFail($id);

        $request->validate([

            'title' =>
            'required|string|max:255',

            'description' =>
            'required|string',

            'status' =>
            'nullable|boolean',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Get last version
        |--------------------------------------------------------------------------
        */

        $lastVersion =
            LegalPageVersion::where(
                'legal_page_id',
                $legal->id
            )
            ->max('version_number') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | Save current version
        |--------------------------------------------------------------------------
        */

        LegalPageVersion::create([

            'legal_page_id' =>
            $legal->id,

            'title' =>
            $legal->title,

            'description' =>
            $legal->description,

            'version_number' =>
            $lastVersion + 1,

        ]);

        /*
        |--------------------------------------------------------------------------
        | Update legal page
        |--------------------------------------------------------------------------
        */

        $legal->update([

            'title' =>
            $request->title,

            'description' =>
            $request->description,

            'status' =>
            $request->boolean(
                'status',
                $legal->status
            ),

        ]);

        return response()->json([

            'success' => true,

            'message' =>
            'Legal page updated successfully',

            'legal_page' =>
            $legal->fresh(),

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        LegalPage::findOrFail($id)
            ->delete();

        return response()->json([

            'success' => true,

            'message' =>
            'Legal page deleted successfully',

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | TOGGLE STATUS
    |--------------------------------------------------------------------------
    | POST /api/legal-pages/{id}/toggle-status
    |--------------------------------------------------------------------------
    */

    public function toggleStatus($id)
    {
        $legal =
            LegalPage::findOrFail($id);

        $legal->status =
            !$legal->status;

        $legal->save();

        return response()->json([

            'success' => true,

            'message' =>
            'Legal page status updated successfully',

            'status' =>
            $legal->status,

            'legal_page' =>
            $legal,

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | VERSION HISTORY
    |--------------------------------------------------------------------------
    */

    public function versions($id)
    {
        $legal =
            LegalPage::findOrFail($id);

        return LegalPageVersion::where(
            'legal_page_id',
            $legal->id
        )
            ->orderByDesc(
                'version_number'
            )
            ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | ROLLBACK
    |--------------------------------------------------------------------------
    */

    public function rollback(
        Request $request,
        $id
    ) {

        $request->validate([

            'version_number' =>
            'required|integer|min:1',

        ]);

        $legal =
            LegalPage::findOrFail($id);

        $version =
            LegalPageVersion::where(
                'legal_page_id',
                $legal->id
            )
            ->where(
                'version_number',
                $request->version_number
            )
            ->firstOrFail();

        $lastVersion =
            LegalPageVersion::where(
                'legal_page_id',
                $legal->id
            )
            ->max('version_number') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | Save current version before rollback
        |--------------------------------------------------------------------------
        */

        LegalPageVersion::create([

            'legal_page_id' =>
            $legal->id,

            'title' =>
            $legal->title,

            'description' =>
            $legal->description,

            'version_number' =>
            $lastVersion + 1,

        ]);

        /*
        |--------------------------------------------------------------------------
        | Restore selected version
        |--------------------------------------------------------------------------
        */

        $legal->update([

            'title' =>
            $version->title,

            'description' =>
            $version->description,

        ]);

        return response()->json([

            'success' => true,

            'message' =>
            'Rolled back to version ' .
                $request->version_number,

            'legal_page' =>
            $legal->fresh(),

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ACCEPT TERMS
    |--------------------------------------------------------------------------
    */

    public function acceptTerms(
        Request $request
    ) {

        $data =
            $request->only([
                'legal_page_id',
                'name',
                'email',
            ]);

        if (($data['name'] ?? '') === '') {
            $data['name'] = null;
        }

        if (($data['email'] ?? '') === '') {
            $data['email'] = null;
        }

        $validator =
            Validator::make(
                $data,
                [
                    'legal_page_id' =>
                    'required|exists:legal_pages,id',

                    'name' =>
                    'nullable|string|max:255',

                    'email' =>
                    'nullable|email|max:255',
                ]
            );

        if ($validator->fails()) {

            return response()->json([

                'errors' =>
                $validator->errors(),

            ], 422);
        }

        $legal =
            LegalPage::findOrFail(
                $data['legal_page_id']
            );

        if (!$legal->status) {

            return response()->json([

                'success' => false,

                'message' =>
                'This legal page is inactive.',

            ], 422);
        }

        UserTermsAcceptance::create([

            'legal_page_id' =>
            $data['legal_page_id'],

            'session_id' =>
            $request->session()->getId(),

            'name' =>
            $data['name'],

            'email' =>
            $data['email'],

            'accepted_at' =>
            now(),

            'ip_address' =>
            $request->ip(),

        ]);

        return response()->json([

            'success' => true,

            'message' =>
            'Terms accepted successfully',

        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK ACCEPTANCE
    |--------------------------------------------------------------------------
    */

    public function checkAcceptance(
        Request $request,
        $id
    ) {

        $legal =
            LegalPage::findOrFail($id);

        $accepted =
            UserTermsAcceptance::where(
                'legal_page_id',
                $legal->id
            )
            ->where(
                'session_id',
                $request->session()->getId()
            )
            ->exists();

        return response()->json([

            'accepted' =>
            $accepted,

            'legal_page_id' =>
            $legal->id,

        ]);
    }
}
