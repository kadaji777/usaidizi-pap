<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('local_uuid')->unique();
            $table->foreignId('patient_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('phone');
            $table->string('relationship');
            $table->boolean('is_primary')->default(false);
            $table->enum('sync_status', ['pending', 'synced'])->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('emergency_contacts');
    }
};