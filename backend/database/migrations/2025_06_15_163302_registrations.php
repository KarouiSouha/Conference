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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('establishment');
            // $table->string('title'); // Fonction/Titre
            $table->enum('title', ['student', 'academic', 'professional'])->default('student')->after('establishment');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone');
            $table->enum('participation_type', ['without-article', 'with-article']);
            $table->enum('has_accompanying', ['yes', 'no']);
            $table->text('accompanying_details')->nullable();
            $table->enum('accommodation_type', ['without-accommodation', 'with-accommodation']);
            $table->enum('payment_method', ['bank-transfer', 'administrative-order', 'check']);
            $table->string('payment_proof')->nullable(); // Chemin vers le fichier
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->decimal('amount', 8, 2)->nullable(); // Montant à payer
            $table->boolean('is_paid')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};

