<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\OrdersController;



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
Route::post('/products/import', [ProductsController::class, 'import'])->name('products.import');
Route::put('/products/{product}', [ProductsController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductsController::class, 'destroy'])->name('products.destroy');

Route::get('/orders', [OrdersController::class, 'index'])->name('orders');
Route::post('/orders', [OrdersController::class, 'store'])->name('orders.store');
Route::put('/orders/{order}', [OrdersController::class, 'update'])->name('orders.update');
Route::delete('/orders/{order}', [OrdersController::class, 'destroy'])->name('orders.destroy');

Route::get('/customers', [CustomersController::class, 'index'])->name('customers');
Route::post('/customers', [CustomersController::class, 'store'])->name('customers.store');
Route::post('/customers/import', [CustomersController::class, 'import'])->name('customers.import');
Route::put('/customers/{customer}', [CustomersController::class, 'update'])->name('customers.update');
Route::delete('/customers/{customer}', [CustomersController::class, 'destroy'])->name('customers.destroy');

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

