<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('first_aid_topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('category', ['burns', 'fractures', 'choking', 'seizures', 'bleeding']);
            $table->text('description');
            $table->json('steps');
            $table->json('dos');
            $table->json('donts');
            $table->string('warning_signs')->nullable();
            $table->string('image_url')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('first_aid_topics');
    }
};