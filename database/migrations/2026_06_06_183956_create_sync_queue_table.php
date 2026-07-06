<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sync_queue', function (Blueprint $table) {
            $table->id();
            $table->string('local_uuid');
            $table->string('entity_type');
            $table->enum('operation', ['create', 'update', 'delete']);
            $table->json('payload');
            $table->integer('retry_count')->default(0);
            $table->timestamp('last_attempt')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sync_queue');
    }
};