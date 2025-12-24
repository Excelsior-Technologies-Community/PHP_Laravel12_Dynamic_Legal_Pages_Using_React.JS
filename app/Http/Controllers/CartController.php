<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Cart;

class CartController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | 🛒 SHOW CART (DATABASE)
    |--------------------------------------------------------------------------
    | GET /cart
    | Browser + React dono ke liye
    */
    public function index(Request $request)
    {
        return Cart::where('session_id', $request->session()->getId())
                    ->latest()
                    ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | ➕ ADD TO CART (SESSION + DATABASE)
    |--------------------------------------------------------------------------
    | POST /add-to-cart
    */
    public function add(Request $request)
    {
        $request->validate([
            'id'  => 'required|integer|exists:products,id',
            'qty' => 'required|integer|min:1|max:5',
        ]);

        $product   = Product::findOrFail($request->id);
        $sessionId = $request->session()->getId();
        $qty       = $request->qty;

        // 🔹 Check if product already in cart
        $cartItem = Cart::where('session_id', $sessionId)
                        ->where('product_id', $product->id)
                        ->first();

        if ($cartItem) {
            // Update qty
            $cartItem->qty += $qty;
            $cartItem->total_price = $cartItem->qty * $cartItem->price;
            $cartItem->save();
        } else {
            // Create new cart row
            Cart::create([
                'session_id'  => $sessionId,
                'product_id'  => $product->id,
                'name'        => $product->name,
                'image'       => $product->image,
                'size'        => $product->size,
                'color'       => $product->color,
                'category'    => $product->category,
                'price'       => $product->price,
                'qty'         => $qty,
                'total_price' => $product->price * $qty,
            ]);
        }

        // 🔹 OPTIONAL: session cart (badge / quick count)
        $sessionCart = session()->get('cart', []);
        $sessionCart[$product->id] = [
            'id'    => $product->id,
            'name'  => $product->name,
            'qty'   => $qty,
            'price' => $product->price,
        ];
        session()->put('cart', $sessionCart);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ❌ REMOVE CART ITEM (SESSION + DATABASE)
    |--------------------------------------------------------------------------
    | DELETE /cart/{id}
    */
    public function remove(Request $request, $id)
    {
        // Remove from database
        Cart::where('session_id', $request->session()->getId())
            ->where('product_id', $id)
            ->delete();

        // Remove from session
        $cart = session()->get('cart', []);
        unset($cart[$id]);
        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Product removed from cart'
        ]);
    }
}
