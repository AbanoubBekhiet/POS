<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\posController;


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

Route::get('/pos', [posController::class, 'pos'])->name('pos');
Route::post('/pos/update-cart-item', [posController::class, 'updateCartItem'])->name('pos.update-cart-item');
Route::delete('/pos/delete-cart-item/{cartId}', [posController::class, 'deleteCartItem'])->name('pos.delete-cart-item');
Route::post('/pos/clear-cart/{cartId}', [posController::class, 'clearCart'])->name('pos.clear-cart');

// Pending carts (Save as Cart / Hold)
Route::post('/pos/pending-carts', [posController::class, 'saveCart'])->name('pos.save-cart');
Route::delete('/pos/pending-carts/{id}', [posController::class, 'deletePendingCart'])->name('pos.delete-pending-cart');
Route::post('/pos/pending-carts/swap', [posController::class, 'swapCarts'])->name('pos.pending-carts.swap');
Route::post('/pos/complete-order', [posController::class, 'completeOrder'])->name('pos.complete-order');




Route::get('/products', [ProductsController::class, 'index'])->name('products');
Route::post('/products', [ProductsController::class, 'store'])->name('products.store');
Route::post('/products/import', [ProductsController::class, 'import'])->name('products.import');
Route::put('/products/{product}', [ProductsController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductsController::class, 'destroy'])->name('products.destroy');
Route::get('/products/filter', [ProductsController::class, 'filter'])->name('products.filter');


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

