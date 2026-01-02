<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_id',
        'order_id',
        'invoice_date',
        'ordered_date',
        'customer_id',
        'subtotal',
        'discount',
        'delivery_charge',
        'tax',
        'grand_total',
        'payment_method',
        'payment_status',
        'advance_payment',
        'balance_amount',
        'delivery_type',
        'delivery_date',
        'delivery_time',
        'delivery_address',
        'status',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'ordered_date' => 'date',
        'delivery_date' => 'date',
        'delivery_time' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'tax' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'advance_payment' => 'decimal:2',
        'balance_amount' => 'decimal:2',
    ];

    /**
     * Get the customer that owns the invoice.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the items for the invoice.
     */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
