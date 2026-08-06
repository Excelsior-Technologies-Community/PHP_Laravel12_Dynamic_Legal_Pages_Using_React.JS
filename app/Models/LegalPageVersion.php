<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LegalPageVersion extends Model
{
    protected $fillable = [
        'legal_page_id',
        'title',
        'description',
        'version_number',
    ];

    public function legalPage(): BelongsTo
    {
        return $this->belongsTo(LegalPage::class);
    }
}
