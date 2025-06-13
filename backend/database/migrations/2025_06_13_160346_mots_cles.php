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
        Schema::create('mots_cles', function (Blueprint $table) {
            $table->id();

            // Référence vers le thème
            $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');

            // Colonnes pour le français
            $table->string('keyword_fr');

            // Colonnes pour l'anglais
            $table->string('keyword_en');

            // Ordre d'affichage des mots-clés dans un thème
            $table->integer('order')->default(0);

            $table->timestamps();

            // Index pour améliorer les performances
            $table->index(['theme_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mots_cles');
    }
};
