<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('speaker_realisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('speaker_id')->constrained('speakers')->onDelete('cascade');
            $table->foreignId('realisation_id')->constrained('realisations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speaker_realisations');
    }
};
