<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTermsAcceptance extends Model
{
    protected $fillable = [
        'legal_page_id',
        'session_id',
        'name',
        'email',
        'accepted_at',
        'ip_address',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];
}
