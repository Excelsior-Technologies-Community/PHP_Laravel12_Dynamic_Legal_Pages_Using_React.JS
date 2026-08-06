<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Bluetooth Headphones',
                'details' => 'Premium noise-cancelling wireless headphones with 30-hour battery life, deep bass, and comfortable over-ear design. Perfect for music lovers and professionals.',
                'price' => 2999,
                'size' => 'One Size',
                'color' => 'Black',
                'category' => 'Electronics',
                'image' => 'headphones.jpg',
            ],
            [
                'name' => 'Smart Watch Series 6',
                'details' => 'Advanced smartwatch with heart rate monitor, GPS, sleep tracking, and 5ATM water resistance. Compatible with iOS and Android.',
                'price' => 4999,
                'size' => '40mm',
                'color' => 'Silver',
                'category' => 'Electronics',
                'image' => 'smartwatch.jpg',
            ],
            [
                'name' => 'Running Shoes Pro',
                'details' => 'Lightweight mesh running shoes with responsive cushioning, breathable fabric, and durable rubber outsole for everyday running.',
                'price' => 3499,
                'size' => 'UK 8',
                'color' => 'Blue',
                'category' => 'Footwear',
                'image' => 'shoes.jpg',
            ],
            [
                'name' => 'Cotton Casual T-Shirt',
                'details' => '100% premium cotton crew neck t-shirt. Soft, breathable, and pre-shrunk fabric with a modern regular fit.',
                'price' => 799,
                'size' => 'L',
                'color' => 'White',
                'category' => 'Clothing',
                'image' => 'tshirt.jpg',
            ],
            [
                'name' => 'Leather Wallet',
                'details' => 'Genuine leather bifold wallet with RFID blocking, 6 card slots, and a slim profile. Handcrafted with premium stitching.',
                'price' => 1299,
                'size' => 'Standard',
                'color' => 'Brown',
                'category' => 'Accessories',
                'image' => 'wallet.jpg',
            ],
            [
                'name' => 'Stainless Steel Water Bottle',
                'details' => 'Double-wall vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.',
                'price' => 599,
                'size' => '750ml',
                'color' => 'Green',
                'category' => 'Lifestyle',
                'image' => 'bottle.jpg',
            ],
            [
                'name' => 'Wireless Mouse',
                'details' => 'Ergonomic wireless mouse with 2.4GHz connectivity, adjustable DPI, and silent clicks. Works on any surface.',
                'price' => 899,
                'size' => 'Standard',
                'color' => 'Gray',
                'category' => 'Electronics',
                'image' => 'mouse.jpg',
            ],
            [
                'name' => 'Yoga Mat Premium',
                'details' => 'Extra thick 6mm eco-friendly TPE yoga mat with non-slip texture. Includes carrying strap for easy transport.',
                'price' => 1199,
                'size' => '72x24 inch',
                'color' => 'Purple',
                'category' => 'Fitness',
                'image' => 'yogamat.jpg',
            ],
            [
                'name' => 'Backpack 25L',
                'details' => 'Water-resistant travel backpack with padded laptop compartment, USB charging port, and multiple organizer pockets.',
                'price' => 2499,
                'size' => '25L',
                'color' => 'Navy Blue',
                'category' => 'Accessories',
                'image' => 'backpack.jpg',
            ],
            [
                'name' => 'LED Desk Lamp',
                'details' => 'Modern LED desk lamp with 5 brightness levels, 3 color temperatures, USB charging port, and flexible gooseneck.',
                'price' => 1499,
                'size' => 'Standard',
                'color' => 'White',
                'category' => 'Home',
                'image' => 'lamp.jpg',
            ],
            [
                'name' => 'Sunglasses UV Protection',
                'details' => 'Polarized sunglasses with 100% UV protection. Lightweight metal frame with scratch-resistant lenses.',
                'price' => 999,
                'size' => 'Medium',
                'color' => 'Black',
                'category' => 'Accessories',
                'image' => 'sunglasses.jpg',
            ],
            [
                'name' => 'Coffee Maker Machine',
                'details' => 'Programmable 12-cup coffee maker with auto-shutoff, keep-warm function, and reusable filter. Brews perfect coffee every time.',
                'price' => 3999,
                'size' => 'Standard',
                'color' => 'Stainless Steel',
                'category' => 'Home',
                'image' => 'coffeemaker.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
