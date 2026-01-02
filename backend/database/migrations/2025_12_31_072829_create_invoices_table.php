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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_id')->unique();
            $table->string('order_id')->unique();
            $table->date('invoice_date');
            $table->date('ordered_date');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->nullable()->default(0);
            $table->decimal('delivery_charge', 10, 2)->nullable()->default(0);
            $table->decimal('tax', 10, 2)->nullable()->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('Due');
            $table->decimal('advance_payment', 10, 2)->nullable()->default(0);
            $table->decimal('balance_amount', 10, 2)->default(0);
            $table->string('delivery_type')->nullable(); // 'delivery' or 'pickup'
            $table->date('delivery_date')->nullable();
            $table->time('delivery_time')->nullable();
            $table->text('delivery_address')->nullable();
            $table->string('status')->default('draft'); // 'draft' or 'final'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
