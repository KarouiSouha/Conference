<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('programmes', function (Blueprint $table) {
            $table->id();
            $table->date('jour');
            $table->time('heure');

            // Champs bilingues pour l'événement
            $table->string('evenement_fr');
            $table->string('evenement_en');

            // Champs bilingues pour la description
            $table->text('description_fr')->nullable();
            $table->text('description_en')->nullable();

            // Champs bilingues pour l'intervenant
            $table->string('intervenant_fr')->nullable();
            $table->string('intervenant_en')->nullable();

            // Champs bilingues pour le lieu
            $table->string('lieu_fr')->nullable();
            $table->string('lieu_en')->nullable();

            $table->enum('type_evenement', [
                'keynote',
                'session',
                'workshop',
                'panel',
                'break',
                'meal',
                'networking',
                'ceremony'
            ])->default('session');

            $table->timestamps();

            // Index
            $table->index('jour');
            $table->index('type_evenement');
        });
    }

    public function down()
    {
        Schema::dropIfExists('programmes');
    }
};
