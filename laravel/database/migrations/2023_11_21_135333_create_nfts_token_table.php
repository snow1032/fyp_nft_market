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
        Schema::create('nfts_token', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->not;
            $table->string('url')->unique();
            $table->string('description');

            $table->integer('creator'); // origin creator
            $table->Integer('owner')->nullable(); 
            $table->string('tokenID')->unique();
            
            $table->bigInteger('price');
            $table->bigInteger('royalties')->default(0);

            $table->string('cid')->unique();
            $table->string('cidV1')->unique();
            $table->foreign('creator')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('owner')->references('id')->on('users')->onDelete('cascade');
            
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nfts_token');
    }
};
