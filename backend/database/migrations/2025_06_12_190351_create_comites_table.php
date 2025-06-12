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
        Schema::create('comites', function (Blueprint $table) {
            $table->id();
            
            // Colonnes pour le français
            $table->string('name_fr');
            $table->string('institute_fr')->nullable();
            $table->string('job_fr')->nullable()->default('Membre');
            
            // Colonnes pour l'anglais
            $table->string('name_en');
            $table->string('institute_en')->nullable();
            $table->string('job_en')->nullable()->default('Member');
            
            // Type de comité (scientific, organizing)
            $table->enum('committee_type', ['scientific', 'organizing']);
            
            // Ordre d'affichage et rôle spécial
            $table->integer('order')->default(0);
            $table->enum('special_role', ['chair', 'co-chair', 'member'])->default('member');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comites');
    }
};