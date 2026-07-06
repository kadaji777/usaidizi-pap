<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('incident_logs', function (Blueprint $table) {
            $table->id();
            $table->string('local_uuid')->unique();
            $table->foreignId('patient_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('topic_id')->nullable()->constrained('first_aid_topics')->onDelete('set null');
            $table->foreignId('facility_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('incident_timestamp');
            $table->text('description');
            $table->text('actions_taken')->nullable();
            $table->string('location_description')->nullable();
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('sync_status', ['pending', 'synced'])->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('incident_logs');
    }
};