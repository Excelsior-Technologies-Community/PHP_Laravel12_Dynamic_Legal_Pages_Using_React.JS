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
        $sessionId =
            $request->session()->getId();

        $items =
            Cart::where(
                'session_id',
                $sessionId
            )
            ->latest()
            ->get();

        $totalQuantity =
            $items->sum('qty');

        $subtotal =
            $items->sum('total_price');

        return response()->json([

            'success' => true,

            'items' => $items,

            'summary' => [

                'total_items' =>
                $items->count(),

                'total_quantity' =>
                $totalQuantity,

                'subtotal' =>
                number_format(
                    $subtotal,
                    2,
                    '.',
                    ''
                ),

            ],

        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADD TO CART
    |--------------------------------------------------------------------------
    */

    public function add(Request $request)
    {
        $request->validate([

            'id' =>
            'required|integer|exists:products,id',

            'qty' =>
            'required|integer|min:1|max:5',

        ]);

        $product =
            Product::findOrFail(
                $request->id
            );

        /*
        |--------------------------------------------------------------------------
        | STOCK CHECK
        |--------------------------------------------------------------------------
        */

        if ($product->stock <= 0) {

            return response()->json([

                'success' => false,

                'message' =>
                'Product is out of stock.',

            ], 422);
        }

        $sessionId =
            $request->session()->getId();

        $qty =
            (int) $request->qty;

        $cartItem =
            Cart::where(
                'session_id',
                $sessionId
            )
            ->where(
                'product_id',
                $product->id
            )
            ->first();

        if ($cartItem) {

            $newQty =
                min(
                    5,
                    $cartItem->qty + $qty
                );

            /*
            |--------------------------------------------------------------------------
            | Don't exceed available stock
            |--------------------------------------------------------------------------
            */

            if ($newQty > $product->stock) {

                $newQty =
                    $product->stock;
            }

            if ($newQty <= 0) {

                return response()->json([

                    'success' => false,

                    'message' =>
                    'Product is out of stock.',

                ], 422);
            }

            $cartItem->qty =
                $newQty;

            $cartItem->total_price =
                $cartItem->price *
                $newQty;

            $cartItem->save();
        } else {

            $qty =
                min(
                    $qty,
                    $product->stock
                );

            Cart::create([

                'session_id' =>
                $sessionId,

                'product_id' =>
                $product->id,

                'name' =>
                $product->name,

                'image' =>
                $product->image,

                'size' =>
                $product->size,

                'color' =>
                $product->color,

                'category' =>
                $product->category,

                'price' =>
                $product->price,

                'qty' =>
                $qty,

                'total_price' =>
                $product->price *
                    $qty,

            ]);

            $cartItem =
                Cart::where(
                    'session_id',
                    $sessionId
                )
                ->where(
                    'product_id',
                    $product->id
                )
                ->first();
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE SESSION CART
        |--------------------------------------------------------------------------
        */

        $sessionCart =
            session()->get(
                'cart',
                []
            );

        $sessionCart[$product->id] = [

            'id' =>
            $product->id,

            'name' =>
            $product->name,

            'qty' =>
            $cartItem->qty,

            'price' =>
            $product->price,

        ];

        session()->put(
            'cart',
            $sessionCart
        );

        return response()->json([

            'success' => true,

            'message' =>
            'Product added to cart successfully',

            'item' =>
            $cartItem,

        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE QUANTITY
    |--------------------------------------------------------------------------
    */

    public function updateQuantity(
        Request $request,
        $id
    ) {

        $request->validate([

            'qty' =>
            'required|integer|min:1|max:5',

        ]);

        $sessionId =
            $request->session()->getId();

        $cartItem =
            Cart::where(
                'session_id',
                $sessionId
            )
            ->where(
                'product_id',
                $id
            )
            ->first();

        if (!$cartItem) {

            return response()->json([

                'success' => false,

                'message' =>
                'Cart item not found.',

            ], 404);
        }

        $product =
            Product::find(
                $cartItem->product_id
            );

        if (!$product) {

            return response()->json([

                'success' => false,

                'message' =>
                'Product not found.',

            ], 404);
        }

        $qty =
            (int) $request->qty;

        /*
        |--------------------------------------------------------------------------
        | Stock limit
        |--------------------------------------------------------------------------
        */

        if ($qty > $product->stock) {

            $qty =
                $product->stock;
        }

        if ($qty <= 0) {

            return response()->json([

                'success' => false,

                'message' =>
                'Product is out of stock.',

            ], 422);
        }

        $cartItem->qty =
            $qty;

        $cartItem->total_price =
            $cartItem->price *
            $qty;

        $cartItem->save();

        /*
        |--------------------------------------------------------------------------
        | Session
        |--------------------------------------------------------------------------
        */

        $cart =
            session()->get(
                'cart',
                []
            );

        if (isset($cart[$id])) {

            $cart[$id]['qty'] =
                $qty;
        }

        session()->put(
            'cart',
            $cart
        );

        return response()->json([

            'success' => true,

            'message' =>
            'Cart quantity updated successfully.',

            'item' =>
            $cartItem,

        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | REMOVE
    |--------------------------------------------------------------------------
    */

    public function remove(
        Request $request,
        $id
    ) {

        Cart::where(
            'session_id',
            $request->session()->getId()
        )
            ->where(
                'product_id',
                $id
            )
            ->delete();

        $cart =
            session()->get(
                'cart',
                []
            );

        unset(
            $cart[$id]
        );

        session()->put(
            'cart',
            $cart
        );

        return response()->json([

            'success' => true,

            'message' =>
            'Product removed from cart',

        ]);
    }
}
