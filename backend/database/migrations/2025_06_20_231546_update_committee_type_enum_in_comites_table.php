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
        Schema::table('comites', function (Blueprint $table) {
            $table->enum('committee_type', ['scientific', 'organizing', 'honorary'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comites', function (Blueprint $table) {
            $table->enum('committee_type', ['scientific', 'organizing'])->change();
        });
    }
};
