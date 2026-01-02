<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invoice_date' => 'required|date',
            'ordered_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $invoiceDate = $this->input('invoice_date');
                    if ($invoiceDate && $value > $invoiceDate) {
                        $fail('The ordered date must be less than or equal to the invoice date.');
                    }
                },
            ],
            'customer_id' => 'nullable|exists:customers,id',
            'customer' => 'nullable|array',
            'customer.name' => 'required_with:customer|string|max:255',
            'customer.phone' => 'nullable|string|max:255',
            'customer.address' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'delivery_charge' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|in:Cash,Card,Bank Transfer,Online',
            'payment_status' => 'nullable|string|in:Paid,Partially Paid,Due',
            'advance_payment' => 'nullable|numeric|min:0',
            'delivery_type' => 'nullable|string|in:delivery,pickup',
            'delivery_date' => 'nullable|date',
            'delivery_time' => 'nullable|date_format:H:i',
            'delivery_address' => 'nullable|string',
            'status' => 'nullable|string|in:draft,final',
        ];
    }
}
