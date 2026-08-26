<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Cart;

class CartController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | SHOW CART
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        return Cart::where(
            'session_id',
            $request->session()->getId()
        )
        ->latest()
        ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | ADD TO CART
    |--------------------------------------------------------------------------
    */
    public function add(Request $request)
    {
        $request->validate([
            'id'  => 'required|integer|exists:products,id',
            'qty' => 'required|integer|min:1|max:5',
        ]);

        $product = Product::findOrFail($request->id);

        $sessionId = $request->session()->getId();

        $qty = (int) $request->qty;

        $cartItem = Cart::where('session_id', $sessionId)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {

            /*
            |--------------------------------------------------------------------------
            | Do not allow total quantity above 5
            |--------------------------------------------------------------------------
            */
            $newQty = min(5, $cartItem->qty + $qty);

            $cartItem->qty = $newQty;

            $cartItem->total_price =
                $cartItem->price * $newQty;

            $cartItem->save();

        } else {

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

        /*
        |--------------------------------------------------------------------------
        | Session Cart
        |--------------------------------------------------------------------------
        */
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
            'message' => 'Product added to cart successfully',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE CART QUANTITY
    |--------------------------------------------------------------------------
    | PUT /api/cart/{id}
    |--------------------------------------------------------------------------
    */
    public function updateQuantity(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1|max:5',
        ]);

        $sessionId = $request->session()->getId();

        $cartItem = Cart::where('session_id', $sessionId)
            ->where('product_id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        $qty = (int) $request->qty;

        /*
        |--------------------------------------------------------------------------
        | Update quantity
        |--------------------------------------------------------------------------
        */
        $cartItem->qty = $qty;

        /*
        |--------------------------------------------------------------------------
        | Recalculate total price
        |--------------------------------------------------------------------------
        */
        $cartItem->total_price =
            $cartItem->price * $qty;

        $cartItem->save();

        /*
        |--------------------------------------------------------------------------
        | Update session cart
        |--------------------------------------------------------------------------
        */
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['qty'] = $qty;
        }

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Cart quantity updated successfully.',
            'item' => $cartItem,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE CART ITEM
    |--------------------------------------------------------------------------
    */
    public function remove(Request $request, $id)
    {
        Cart::where('session_id', $request->session()->getId())
            ->where('product_id', $id)
            ->delete();

        $cart = session()->get('cart', []);

        unset($cart[$id]);

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Product removed from cart',
        ]);
    }
}