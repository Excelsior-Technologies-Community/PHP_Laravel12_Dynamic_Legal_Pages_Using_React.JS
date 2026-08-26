<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET PRODUCTS
    |--------------------------------------------------------------------------
    | Supports:
    | - Search
    | - Multiple category filters
    | - Multiple color filters
    | - Multiple size filters
    | - Minimum price
    | - Maximum price
    | - Sorting
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $query = Product::query();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('details', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('color', 'like', "%{$search}%")
                    ->orWhere('size', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Multiple Categories
        |--------------------------------------------------------------------------
        | Example:
        | ?categories[]=Clothing&categories[]=Accessories
        |--------------------------------------------------------------------------
        */
        if ($request->filled('categories')) {
            $categories = is_array($request->categories)
                ? $request->categories
                : explode(',', $request->categories);

            $categories = array_filter($categories);

            if (!empty($categories)) {
                $query->whereIn('category', $categories);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Multiple Colors
        |--------------------------------------------------------------------------
        */
        if ($request->filled('colors')) {
            $colors = is_array($request->colors)
                ? $request->colors
                : explode(',', $request->colors);

            $colors = array_filter($colors);

            if (!empty($colors)) {
                $query->whereIn('color', $colors);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Multiple Sizes
        |--------------------------------------------------------------------------
        */
        if ($request->filled('sizes')) {
            $sizes = is_array($request->sizes)
                ? $request->sizes
                : explode(',', $request->sizes);

            $sizes = array_filter($sizes);

            if (!empty($sizes)) {
                $query->whereIn('size', $sizes);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Minimum Price
        |--------------------------------------------------------------------------
        */
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }

        /*
        |--------------------------------------------------------------------------
        | Maximum Price
        |--------------------------------------------------------------------------
        */
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortColumns = [
            'name',
            'price',
            'id',
            'created_at',
        ];

        $allowedSortOrders = [
            'asc',
            'desc',
        ];

        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }

        if (!in_array($sortOrder, $allowedSortOrders)) {
            $sortOrder = 'desc';
        }

        $query->orderBy($sortBy, $sortOrder);

        return response()->json($query->get());
    }

    /*
    |--------------------------------------------------------------------------
    | STORE PRODUCT
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric|min:0',
            'image'    => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',
        ]);

        $imageName = time() . '.' . $request->image->extension();

        $request->image->move(
            public_path('images'),
            $imageName
        );

        Product::create([
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'image'    => $imageName,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,
        ]);

        return response()->json([
            'message' => 'Product created successfully'
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | GET SINGLE PRODUCT
    |--------------------------------------------------------------------------
    */
    public function edit($id)
    {
        return Product::findOrFail($id);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PRODUCT
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric|min:0',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();

            $request->image->move(
                public_path('images'),
                $imageName
            );

            $product->image = $imageName;
            $product->save();
        }

        $product->update([
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,
        ]);

        return response()->json([
            'message' => 'Product updated successfully'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}