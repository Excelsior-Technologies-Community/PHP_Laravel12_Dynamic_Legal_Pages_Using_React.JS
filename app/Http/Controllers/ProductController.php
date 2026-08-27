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
    | Features:
    | - Search
    | - Multiple category filters
    | - Multiple color filters
    | - Multiple size filters
    | - Minimum price
    | - Maximum price
    | - Sorting
    | - Pagination
    | - Featured filter
    | - Stock filter
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
        */

        if ($request->filled('categories')) {

            $categories = is_array($request->categories)
                ? $request->categories
                : explode(',', $request->categories);

            $categories = array_filter($categories);

            if (!empty($categories)) {

                $query->whereIn(
                    'category',
                    $categories
                );
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

                $query->whereIn(
                    'color',
                    $colors
                );
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

                $query->whereIn(
                    'size',
                    $sizes
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Minimum Price
        |--------------------------------------------------------------------------
        */

        if ($request->filled('min_price')) {

            $query->where(
                'price',
                '>=',
                (float) $request->min_price
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Maximum Price
        |--------------------------------------------------------------------------
        */

        if ($request->filled('max_price')) {

            $query->where(
                'price',
                '<=',
                (float) $request->max_price
            );
        }

        /*
        |--------------------------------------------------------------------------
        | FEATURED FILTER
        |--------------------------------------------------------------------------
        |
        | ?featured=true
        | ?featured=false
        |
        */

        if ($request->has('featured')) {

            $featured = filter_var(
                $request->featured,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            if ($featured !== null) {

                $query->where(
                    'featured',
                    $featured
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK FILTER
        |--------------------------------------------------------------------------
        |
        | ?stock_status=in_stock
        | ?stock_status=out_of_stock
        |
        */

        if ($request->filled('stock_status')) {

            if ($request->stock_status === 'in_stock') {

                $query->where(
                    'stock',
                    '>',
                    0
                );
            }

            if ($request->stock_status === 'out_of_stock') {

                $query->where(
                    'stock',
                    '=',
                    0
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | SORTING
        |--------------------------------------------------------------------------
        */

        $sortBy = $request->get(
            'sort_by',
            'created_at'
        );

        $sortOrder = $request->get(
            'sort_order',
            'desc'
        );

        $allowedSortColumns = [
            'name',
            'price',
            'id',
            'stock',
            'created_at',
        ];

        $allowedSortOrders = [
            'asc',
            'desc',
        ];

        if (!in_array(
            $sortBy,
            $allowedSortColumns,
            true
        )) {

            $sortBy = 'created_at';
        }

        if (!in_array(
            $sortOrder,
            $allowedSortOrders,
            true
        )) {

            $sortOrder = 'desc';
        }

        $query->orderBy(
            $sortBy,
            $sortOrder
        );

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

        $products = $query->paginate(
            $perPage
        );

        return response()->json(
            $products
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STORE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $request->validate([

            'name' => 'required|string|max:255',

            'details' => 'required|string',

            'price' => 'required|numeric|min:0',

            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',

            'size' => 'required|string|max:100',

            'color' => 'required|string|max:100',

            'category' => 'required|string|max:100',

            'featured' => 'nullable|boolean',

            'stock' => 'required|integer|min:0',
        ]);

        $imageName =
            time() . '.' .
            $request->image->extension();

        $request->image->move(
            public_path('images'),
            $imageName
        );

        $product = Product::create([

            'name' => $request->name,

            'details' => $request->details,

            'price' => $request->price,

            'image' => $imageName,

            'size' => $request->size,

            'color' => $request->color,

            'category' => $request->category,

            'featured' => $request->boolean(
                'featured',
                false
            ),

            'stock' => $request->stock,
        ]);

        return response()->json([

            'success' => true,

            'message' =>
            'Product created successfully',

            'product' => $product,

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

    public function update(
        Request $request,
        $id
    ) {

        $product =
            Product::findOrFail($id);

        $request->validate([

            'name' =>
            'required|string|max:255',

            'details' =>
            'required|string',

            'price' =>
            'required|numeric|min:0',

            'size' =>
            'required|string|max:100',

            'color' =>
            'required|string|max:100',

            'category' =>
            'required|string|max:100',

            'featured' =>
            'nullable|boolean',

            'stock' =>
            'required|integer|min:0',

            'image' =>
            'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        /*
        |--------------------------------------------------------------------------
        | IMAGE
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {

            $imageName =
                time() . '.' .
                $request->image->extension();

            $request->image->move(
                public_path('images'),
                $imageName
            );

            $product->image =
                $imageName;
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        $product->update([

            'name' =>
            $request->name,

            'details' =>
            $request->details,

            'price' =>
            $request->price,

            'size' =>
            $request->size,

            'color' =>
            $request->color,

            'category' =>
            $request->category,

            'featured' =>
            $request->boolean(
                'featured',
                false
            ),

            'stock' =>
            $request->stock,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Save image if changed
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {
            $product->save();
        }

        return response()->json([

            'success' => true,

            'message' =>
            'Product updated successfully',

            'product' =>
            $product->fresh(),

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        Product::findOrFail($id)
            ->delete();

        return response()->json([

            'success' => true,

            'message' =>
            'Product deleted successfully',

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | FEATURED PRODUCTS
    |--------------------------------------------------------------------------
    | GET /api/products/featured
    |--------------------------------------------------------------------------
    */

    public function featured()
    {
        return response()->json(

            Product::where(
                'featured',
                true
            )
                ->where(
                    'stock',
                    '>',
                    0
                )
                ->latest()
                ->get()

        );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE STOCK
    |--------------------------------------------------------------------------
    | PUT /api/products/{id}/stock
    |--------------------------------------------------------------------------
    */

    public function updateStock(
        Request $request,
        $id
    ) {

        $request->validate([

            'stock' =>
            'required|integer|min:0',
        ]);

        $product =
            Product::findOrFail($id);

        $product->update([

            'stock' =>
            $request->stock,

        ]);

        return response()->json([

            'success' => true,

            'message' =>
            'Product stock updated successfully',

            'stock' =>
            $product->stock,

            'in_stock' =>
            $product->stock > 0,

        ]);
    }

 public function webProducts(Request $request)
{
    $query = Product::query();

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if ($request->filled('search')) {

        $search = trim($request->search);

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
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if ($request->filled('category')) {

        $query->where(
            'category',
            $request->category
        );
    }


    /*
    |--------------------------------------------------------------------------
    | SIZE
    |--------------------------------------------------------------------------
    */

    if ($request->filled('size')) {

        $query->where(
            'size',
            $request->size
        );
    }


    /*
    |--------------------------------------------------------------------------
    | COLOR
    |--------------------------------------------------------------------------
    */

    if ($request->filled('color')) {

        $query->where(
            'color',
            $request->color
        );
    }


    /*
    |--------------------------------------------------------------------------
    | MINIMUM PRICE
    |--------------------------------------------------------------------------
    */

    if ($request->filled('min_price')) {

        $query->where(
            'price',
            '>=',
            (float) $request->min_price
        );
    }


    /*
    |--------------------------------------------------------------------------
    | MAXIMUM PRICE
    |--------------------------------------------------------------------------
    */

    if ($request->filled('max_price')) {

        $query->where(
            'price',
            '<=',
            (float) $request->max_price
        );
    }


    /*
    |--------------------------------------------------------------------------
    | FEATURED
    |--------------------------------------------------------------------------
    |
    | React sends:
    |
    | featured=1
    | featured=0
    |
    */

    if ($request->filled('featured')) {

        $featured = filter_var(
            $request->featured,
            FILTER_VALIDATE_BOOLEAN,
            FILTER_NULL_ON_FAILURE
        );

        if ($featured !== null) {

            $query->where(
                'featured',
                $featured
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | SORTING
    |--------------------------------------------------------------------------
    |
    | React sends:
    |
    | latest
    | oldest
    | price_low
    | price_high
    | name_asc
    | name_desc
    |
    */

    switch ($request->get('sort', 'latest')) {

        case 'oldest':

            $query->orderBy(
                'created_at',
                'asc'
            );

            break;


        case 'price_low':

            $query->orderBy(
                'price',
                'asc'
            );

            break;


        case 'price_high':

            $query->orderBy(
                'price',
                'desc'
            );

            break;


        case 'name_asc':

            $query->orderBy(
                'name',
                'asc'
            );

            break;


        case 'name_desc':

            $query->orderBy(
                'name',
                'desc'
            );

            break;


        case 'latest':

        default:

            $query->orderBy(
                'created_at',
                'desc'
            );

            break;
    }


    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    $perPage = (int) $request->get(
        'per_page',
        4
    );

    if ($perPage < 1) {

        $perPage = 5;
    }

    if ($perPage > 100) {

        $perPage = 100;
    }


    $products = $query->paginate(
        $perPage
    );


    /*
    |--------------------------------------------------------------------------
    | JSON RESPONSE
    |--------------------------------------------------------------------------
    */

    return response()->json(
        $products
    );
}
}
