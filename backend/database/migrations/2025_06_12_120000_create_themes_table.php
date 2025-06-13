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
            $table->string('icon_fr')->nullable(); // Pour stocker l'icône ou la classe CSS

            // Colonnes pour l'anglais
            $table->string('title_en');
            $table->text('description_en');
            $table->string('icon_en')->nullable();

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
