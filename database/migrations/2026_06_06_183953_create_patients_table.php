<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('local_uuid')->unique();
            $table->string('full_name');
            $table->integer('age')->nullable();
            $table->enum('gender', ['M', 'F', 'Other'])->nullable();
            $table->string('blood_group')->nullable();
            $table->text('allergies')->nullable();
            $table->text('medical_notes')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->enum('sync_status', ['pending', 'synced'])->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('patients');
    }
};