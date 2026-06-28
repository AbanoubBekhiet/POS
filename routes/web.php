<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\posController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\SettingsController;


Route::get('/', [DashboardController::class, 'index'])->name('dashboard');


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
Route::get('/orders/{order}', [OrdersController::class, 'show'])->name('orders.show');
Route::put('/orders/{order}', [OrdersController::class, 'update'])->name('orders.update');
Route::delete('/orders/{order}', [OrdersController::class, 'destroy'])->name('orders.destroy');
Route::post('/orders/{order}/discount', [OrdersController::class, 'applyDiscount'])->name('orders.discount');
Route::post('/orders/{order}/return', [OrdersController::class, 'returnItems'])->name('orders.return');

Route::get('/customers', [CustomersController::class, 'index'])->name('customers');
Route::post('/customers', [CustomersController::class, 'store'])->name('customers.store');
Route::post('/customers/import', [CustomersController::class, 'import'])->name('customers.import');
Route::put('/customers/{customer}', [CustomersController::class, 'update'])->name('customers.update');
Route::delete('/customers/{customer}', [CustomersController::class, 'destroy'])->name('customers.destroy');

Route::get('/categories', [CategoriesController::class, 'index'])->name('categories');
Route::post('/categories', [CategoriesController::class, 'store'])->name('categories.store');
Route::put('/categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');
Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->name('categories.destroy');




Route::get('/suppliers', [SuppliersController::class, 'index'])->name('suppliers');
Route::post('/suppliers', [SuppliersController::class, 'store'])->name('suppliers.store');
Route::put('/suppliers/{supplier}', [SuppliersController::class, 'update'])->name('suppliers.update');
Route::delete('/suppliers/{supplier}', [SuppliersController::class, 'destroy'])->name('suppliers.destroy');
Route::get('/suppliers/{supplier}/received-orders', [SuppliersController::class, 'receivedOrders'])->name('suppliers.received-orders');
Route::post('/suppliers/{supplier}/received-orders', [SuppliersController::class, 'storeReceivedOrder'])->name('suppliers.received-orders.store');

Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics');
Route::post('/statistics/verify-admin', [StatisticsController::class, 'verifyAdmin'])->name('statistics.verify-admin');
Route::get('/statistics/range', [StatisticsController::class, 'range'])->name('statistics.range');
