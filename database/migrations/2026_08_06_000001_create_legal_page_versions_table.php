<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legal_page_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('legal_page_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->longText('description');
            $table->unsignedInteger('version_number');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_page_versions');
    }
};
