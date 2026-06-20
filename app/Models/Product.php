<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'stock',
        'unit',
        'number_of_items_in_unit',
        'category_id',
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function order(){
        return $this->hasMany(Order::class);
    }


        
}
