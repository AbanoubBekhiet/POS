<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;



Route::get('/', function () {
    return Inertia::render('dashboard/Index');
})->name('dashboard');


Route::prefix('auth')->group(function () {
        Route::get('/login', [AuthController::class, 'loginPage'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.post');
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/reset-password', [AuthController::class, 'resetPasswordPage'])->name('reset-password');
        Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password.post');
        Route::get('/verify-reset-code', [AuthController::class, 'verifyResetCodePage'])->name('verify-reset-code');
        Route::post('/verify-reset-code', [AuthController::class, 'verifyResetCode'])->name('verify-reset-code.post');
    });

Route::get('/pos', function () {
    return Inertia::render('pos/Index');    
});

Route::get('/products', [ProductsController::class, 'index'])->name('products');
Route::post('/products', [ProductsController::class, 'store'])->name('products.store');
Route::put('/products/{product}', [ProductsController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductsController::class, 'destroy'])->name('products.destroy');

Route::get('/orders', function () {
    return Inertia::render('orders/Index');
});

Route::get('/customers', function () {
    return Inertia::render('customers/Index');
});

Route::get('/categories', [CategoriesController::class, 'index'])->name('categories');
Route::post('/categories', [CategoriesController::class, 'store'])->name('categories.store');
Route::put('/categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');
Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->name('categories.destroy');



Route::get('/suppliers', function () {
    return Inertia::render('suppliers/Index');
});

Route::get('/settings', function () {
    return Inertia::render('settings/Index');
});

