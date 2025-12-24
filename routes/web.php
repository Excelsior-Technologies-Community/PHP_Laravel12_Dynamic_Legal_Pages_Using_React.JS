<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LegalPageController;


/*
|--------------------------------------------------------------------------
| Product API Routes (React ke liye)
|--------------------------------------------------------------------------
*/

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}/edit', [ProductController::class, 'edit']);
Route::post('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);


Route::prefix('api')->group(function () {
    Route::get('/legal-pages', [LegalPageController::class, 'index']);
    Route::post('/legal-pages', [LegalPageController::class, 'store']);
    Route::get('/legal-pages/{id}/edit', [LegalPageController::class, 'edit']);
    Route::post('/legal-pages/{id}', [LegalPageController::class, 'update']);
    Route::delete('/legal-pages/{id}', [LegalPageController::class, 'destroy']);
});
/*
|--------------------------------------------------------------------------
| React SPA Routes (ALWAYS LAST)
|--------------------------------------------------------------------------
*/

Route::view('/', 'welcome');
Route::view('/{any}', 'welcome')->where('any', '.*');
