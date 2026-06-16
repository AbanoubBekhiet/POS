<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard/Index');
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

Route::get('/settings', function () {
    return Inertia::render('settings/Index');
});
