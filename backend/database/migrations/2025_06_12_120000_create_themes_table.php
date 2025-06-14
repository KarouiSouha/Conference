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
        Schema::create('themes', function (Blueprint $table) {
            $table->id();

            // Colonnes pour le français
            $table->string('title_fr');
            $table->text('description_fr');

            // Colonnes pour l'anglais
            $table->string('title_en');
            $table->text('description_en');

            // Icône partagée (nom de fichier, classe CSS, ou code d'icône)
            $table->string('icon')->nullable();

            // Ordre d'affichage
            $table->integer('order')->default(0);

            // Statut actif/inactif
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
