<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET WISHLIST
    |--------------------------------------------------------------------------
    | GET /api/wishlist
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $sessionId = $request->session()->getId();

        $wishlist = Wishlist::with('product')
            ->where('session_id', $sessionId)
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Return products directly
        |--------------------------------------------------------------------------
        */
        return response()->json(
            $wishlist->map(function ($item) {
                return [
                    'id'         => $item->product->id,
                    'name'       => $item->product->name,
                    'details'    => $item->product->details,
                    'price'      => $item->product->price,
                    'image'      => $item->product->image,
                    'size'       => $item->product->size,
                    'color'      => $item->product->color,
                    'category'   => $item->product->category,
                    'created_at' => $item->created_at,
                ];
            })->values()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ADD TO WISHLIST
    |--------------------------------------------------------------------------
    | POST /api/wishlist/{product}
    |--------------------------------------------------------------------------
    */
    public function add(Request $request, $product)
    {
        $product = Product::find($product);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }

        $sessionId = $request->session()->getId();

        /*
        |--------------------------------------------------------------------------
        | Prevent duplicate wishlist item
        |--------------------------------------------------------------------------
        */
        $wishlist = Wishlist::firstOrCreate([
            'session_id' => $sessionId,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist.',
            'wishlisted' => true,
            'product_id' => $product->id,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE FROM WISHLIST
    |--------------------------------------------------------------------------
    | DELETE /api/wishlist/{product}
    |--------------------------------------------------------------------------
    */
    public function remove(Request $request, $product)
    {
        $sessionId = $request->session()->getId();

        $deleted = Wishlist::where('session_id', $sessionId)
            ->where('product_id', $product)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Product is not in your wishlist.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product removed from wishlist.',
            'wishlisted' => false,
            'product_id' => (int) $product,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | TOGGLE WISHLIST
    |--------------------------------------------------------------------------
    | POST /api/wishlist/{product}/toggle
    |--------------------------------------------------------------------------
    */
    public function toggle(Request $request, $product)
    {
        $productModel = Product::find($product);

        if (!$productModel) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }

        $sessionId = $request->session()->getId();

        $wishlist = Wishlist::where('session_id', $sessionId)
            ->where('product_id', $productModel->id)
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Already Wishlisted → Remove
        |--------------------------------------------------------------------------
        */
        if ($wishlist) {

            $wishlist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist.',
                'wishlisted' => false,
                'product_id' => $productModel->id,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Not Wishlisted → Add
        |--------------------------------------------------------------------------
        */
        Wishlist::create([
            'session_id' => $sessionId,
            'product_id' => $productModel->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist.',
            'wishlisted' => true,
            'product_id' => $productModel->id,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK SINGLE PRODUCT
    |--------------------------------------------------------------------------
    | GET /api/wishlist/{product}/check
    |--------------------------------------------------------------------------
    */
    public function check(Request $request, $product)
    {
        $sessionId = $request->session()->getId();

        $exists = Wishlist::where('session_id', $sessionId)
            ->where('product_id', $product)
            ->exists();

        return response()->json([
            'wishlisted' => $exists,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | WISHLIST COUNT
    |--------------------------------------------------------------------------
    | GET /api/wishlist/count
    |--------------------------------------------------------------------------
    */
    public function count(Request $request)
    {
        $sessionId = $request->session()->getId();

        $count = Wishlist::where(
            'session_id',
            $sessionId
        )->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAR WISHLIST
    |--------------------------------------------------------------------------
    | DELETE /api/wishlist
    |--------------------------------------------------------------------------
    */
    public function clear(Request $request)
    {
        $sessionId = $request->session()->getId();

        Wishlist::where(
            'session_id',
            $sessionId
        )->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wishlist cleared successfully.',
        ]);
    }
}