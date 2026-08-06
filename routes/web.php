<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LegalPageController;


/*
|--------------------------------------------------------------------------
| Product API Routes (React ke liye)
|--------------------------------------------------------------------------
*/

Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}/edit', [ProductController::class, 'edit']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/add-to-cart', [CartController::class, 'add']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);

    Route::get('/legal-pages', [LegalPageController::class, 'index']);
    Route::post('/legal-pages', [LegalPageController::class, 'store']);
    Route::get('/legal-pages/{id}/edit', [LegalPageController::class, 'edit']);
    Route::post('/legal-pages/{id}', [LegalPageController::class, 'update']);
    Route::delete('/legal-pages/{id}', [LegalPageController::class, 'destroy']);

    Route::get('/legal-pages/{id}/versions', [LegalPageController::class, 'versions']);
    Route::post('/legal-pages/{id}/rollback', [LegalPageController::class, 'rollback']);

    Route::post('/legal-pages/{id}/accept-terms', [LegalPageController::class, 'acceptTerms']);
    Route::get('/legal-pages/{id}/check-acceptance', [LegalPageController::class, 'checkAcceptance']);
});

/*
|--------------------------------------------------------------------------
| React SPA Routes (ALWAYS LAST)
|--------------------------------------------------------------------------
*/

Route::view('/', 'welcome');
Route::view('/{any}', 'welcome')->where('any', '.*');
