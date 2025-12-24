<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 🔹 Get all products (List)
    public function index()
    {
        return Product::latest()->get();
    }

    // 🔹 Store product (Create)
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric',
            'image'    => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',
        ]);

        // Upload Image
        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('images'), $imageName);

        Product::create([
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'image'    => $imageName,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,
        ]);

        return response()->json(['message' => 'Product created successfully'], 201);
    }

    // 🔹 Get single product (Edit)
    public function edit($id)
    {
        return Product::findOrFail($id);
    }

    // 🔹 Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Update Image if provided
        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $product->image = $imageName;
        }

        $product->update([
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,
        ]);

        return response()->json(['message' => 'Product updated successfully'], 200);
    }

    // 🔹 Delete product
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
