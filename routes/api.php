<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded with the /api prefix from bootstrap/app.php.
|
*/


/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

Route::get('/products', [ProductController::class, 'apiIndex']);

Route::post('/products', [ProductController::class, 'apiStore']);

Route::get('/products/{id}', [ProductController::class, 'show']);

Route::put('/products/{id}', [ProductController::class, 'update']);

Route::delete('/products/{id}', [ProductController::class, 'destroy']);


/*
|--------------------------------------------------------------------------
| Cart
|--------------------------------------------------------------------------
|
| Cart uses Laravel session, so these routes use the web middleware.
|
*/

Route::middleware('web')->group(function () {

    Route::get('/cart', [CartController::class, 'index']);

    Route::post('/add-to-cart', [CartController::class, 'add']);

    Route::put('/cart/{id}', [CartController::class, 'updateQuantity']);

    Route::delete('/cart/{id}', [CartController::class, 'remove']);


    /*
    |--------------------------------------------------------------------------
    | Wishlist
    |--------------------------------------------------------------------------
    */

    Route::get('/wishlist', [WishlistController::class, 'index']);

    Route::post('/wishlist/{id}/toggle', [WishlistController::class, 'toggle']);

    Route::delete('/wishlist/{id}', [WishlistController::class, 'remove']);

    Route::delete('/wishlist', [WishlistController::class, 'clear']);

});