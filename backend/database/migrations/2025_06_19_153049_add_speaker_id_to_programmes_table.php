<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('programmes', function (Blueprint $table) {
            $table->unsignedBigInteger('speaker_id')->nullable()->after('id');

            $table->foreign('speaker_id')
                ->references('id')
                ->on('speakers')
                ->onDelete('set null');

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programmes', function (Blueprint $table) {
            $table->dropForeign(['speaker_id']);
            $table->dropColumn('speaker_id');
        });
    }

};
