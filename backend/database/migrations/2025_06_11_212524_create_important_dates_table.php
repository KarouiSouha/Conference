<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('important_dates', function (Blueprint $table) {
        $table->id();
        $table->string('event_fr');
        $table->string('event_en');
        $table->date('date');
        $table->date('end_date');
        $table->text('description_fr')->nullable();
        $table->text('description_en')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('important_dates');
    }
};
