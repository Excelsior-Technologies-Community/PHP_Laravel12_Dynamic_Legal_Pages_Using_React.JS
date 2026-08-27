<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'details',
        'price',
        'image',
        'size',
        'color',
        'category',
        'featured',
        'stock',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'stock' => 'integer',
        'price' => 'decimal:2',
    ];
}
