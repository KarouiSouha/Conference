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
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title_fr');
            $table->string('title_en');
            $table->text('description_fr');
            $table->text('description_en');
            $table->enum('type', ['photo', 'video']);
            $table->string('file_path'); // Chemin du fichier (image ou vidéo)
            $table->string('thumbnail_path')->nullable(); // Miniature pour les vidéos
            $table->string('year');
            $table->string('duration')->nullable(); // Durée pour les vidéos (format "1:30")
            $table->integer('views')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
