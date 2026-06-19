<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;



Route::get('/', function () {
    return Inertia::render('dashboard/Index');
})->name('dashboard');


Route::prefix('auth')->group(function () {
        Route::get('/login', [AuthController::class, 'loginPage'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.post');
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/reset-password', [AuthController::class, 'resetPasswordPage'])->name('reset-password');
        Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password.post');
    });

Route::get('/pos', function () {
    return Inertia::render('pos/Index');    
});

Route::get('/products', function () {
    return Inertia::render('products/Index');
});

Route::get('/orders', function () {
    return Inertia::render('orders/Index');
});

Route::get('/customers', function () {
    return Inertia::render('customers/Index');
});

Route::get('/categories', function () {
    return Inertia::render('categories/Index');
});

Route::get('/suppliers', function () {
    return Inertia::render('suppliers/Index');
});

Route::get('/settings', function () {
    return Inertia::render('settings/Index');
});

