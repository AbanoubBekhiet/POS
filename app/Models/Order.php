<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'total_price',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Many-to-many via the products_orders pivot table.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'products_orders')
                    ->withPivot('quantity', 'price', 'total_price')
                    ->withTimestamps();
    }
}
