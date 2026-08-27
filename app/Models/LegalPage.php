<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LegalPage extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function versions(): HasMany
    {
        return $this->hasMany(LegalPageVersion::class);
    }

    public function termsAcceptances(): HasMany
    {
        return $this->hasMany(UserTermsAcceptance::class);
    }
}
