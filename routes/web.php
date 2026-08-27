<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| React Product Data
|--------------------------------------------------------------------------
*/

Route::get('/products-data', [
    ProductController::class,
    'webProducts'
]);

/*
|--------------------------------------------------------------------------
| React SPA
|--------------------------------------------------------------------------
*/

Route::view('/', 'welcome');

Route::view('/{any}', 'welcome')
    ->where('any', '.*');