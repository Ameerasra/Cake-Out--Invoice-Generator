<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    /**
     * Generate unique Invoice ID
     */
    private function generateInvoiceId(): string
    {
        $year = Carbon::now()->format('Y');
        $lastInvoice = Invoice::where('invoice_id', 'like', "INV-{$year}-%")
            ->orderBy('invoice_id', 'desc')
            ->first();

        if ($lastInvoice) {
            $lastNumber = (int) substr($lastInvoice->invoice_id, -3);
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        return "INV-{$year}-{$newNumber}";
    }

    /**
     * Generate unique Order ID
     */
    private function generateOrderId(): string
    {
        $year = Carbon::now()->format('Y');
        $lastOrder = Invoice::where('order_id', 'like', "ORD-{$year}-%")
            ->orderBy('order_id', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_id, -3);
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        return "ORD-{$year}-{$newNumber}";
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['customer', 'items']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $invoices = $query->orderBy('created_at', 'desc')->get();

        return response()->json($invoices);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_entry','timestamp'=>time()*1000,'location'=>'InvoiceController.php:73','message'=>'store() method entry','data'=>['request_keys'=>array_keys($request->all()),'has_customer_id'=>$request->has('customer_id'),'has_customer'=>$request->has('customer'),'items_count'=>count($request->input('items',[]))],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A,B,C,D,E,F'])."\n", FILE_APPEND);
        // #endregion
        
        try {
        $validated = $request->validate([
            'invoice_date' => 'required|date',
            'ordered_date' => 'required|date|before_or_equal:invoice_date',
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
        ]);
        
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_validated','timestamp'=>time()*1000,'location'=>'InvoiceController.php:100','message'=>'Validation passed','data'=>['validated_keys'=>array_keys($validated),'has_customer_id'=>isset($validated['customer_id']),'has_customer'=>isset($validated['customer']),'items_count'=>count($validated['items']??[])],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'B'])."\n", FILE_APPEND);
        // #endregion

        // Generate IDs
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_before_id_gen','timestamp'=>time()*1000,'location'=>'InvoiceController.php:103','message'=>'Before ID generation','data'=>[],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'C'])."\n", FILE_APPEND);
        // #endregion
        try {
        $invoiceId = $this->generateInvoiceId();
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_invoice_id','timestamp'=>time()*1000,'location'=>'InvoiceController.php:104','message'=>'Invoice ID generated','data'=>['invoice_id'=>$invoiceId],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'C'])."\n", FILE_APPEND);
        // #endregion
        $orderId = $this->generateOrderId();
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_order_id','timestamp'=>time()*1000,'location'=>'InvoiceController.php:105','message'=>'Order ID generated','data'=>['order_id'=>$orderId],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'C'])."\n", FILE_APPEND);
        // #endregion
        } catch (\Exception $e) {
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_id_gen_error','timestamp'=>time()*1000,'location'=>'InvoiceController.php:105','message'=>'ID generation failed','data'=>['error'=>$e->getMessage(),'trace'=>$e->getTraceAsString()],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'C'])."\n", FILE_APPEND);
        // #endregion
        throw $e;
        }

        // Handle customer creation if new customer provided
        $customerId = $validated['customer_id'] ?? null;
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_before_customer','timestamp'=>time()*1000,'location'=>'InvoiceController.php:107','message'=>'Before customer handling','data'=>['customer_id'=>$customerId,'has_customer_data'=>isset($validated['customer'])],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'D'])."\n", FILE_APPEND);
        // #endregion
        if (!$customerId && isset($validated['customer'])) {
            // #region agent log
            file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_creating_customer','timestamp'=>time()*1000,'location'=>'InvoiceController.php:109','message'=>'Creating new customer','data'=>['customer_data'=>$validated['customer']],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'D'])."\n", FILE_APPEND);
            // #endregion
            try {
            $customer = \App\Models\Customer::create($validated['customer']);
            $customerId = $customer->id;
            // #region agent log
            file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_customer_created','timestamp'=>time()*1000,'location'=>'InvoiceController.php:110','message'=>'Customer created successfully','data'=>['customer_id'=>$customerId],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'D'])."\n", FILE_APPEND);
            // #endregion
            } catch (\Exception $e) {
            // #region agent log
            file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_customer_error','timestamp'=>time()*1000,'location'=>'InvoiceController.php:110','message'=>'Customer creation failed','data'=>['error'=>$e->getMessage(),'trace'=>$e->getTraceAsString()],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'D'])."\n", FILE_APPEND);
            // #endregion
            throw $e;
            }
        }

        // Calculate balance
        $balanceAmount = $validated['grand_total'] - ($validated['advance_payment'] ?? 0);

        // Create invoice
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_before_invoice','timestamp'=>time()*1000,'location'=>'InvoiceController.php:117','message'=>'Before invoice creation','data'=>['customer_id'=>$customerId,'invoice_id'=>$invoiceId,'order_id'=>$orderId,'items_count'=>count($validated['items'])],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'E'])."\n", FILE_APPEND);
        // #endregion
        try {
        $invoice = Invoice::create([
            'invoice_id' => $invoiceId,
            'order_id' => $orderId,
            'invoice_date' => $validated['invoice_date'],
            'ordered_date' => $validated['ordered_date'],
            'customer_id' => $customerId,
            'subtotal' => $validated['subtotal'],
            'discount' => $validated['discount'] ?? 0,
            'delivery_charge' => $validated['delivery_charge'] ?? 0,
            'tax' => $validated['tax'] ?? 0,
            'grand_total' => $validated['grand_total'],
            'payment_method' => $validated['payment_method'] ?? null,
            'payment_status' => $validated['payment_status'] ?? 'Due',
            'advance_payment' => $validated['advance_payment'] ?? 0,
            'balance_amount' => $balanceAmount,
            'delivery_type' => $validated['delivery_type'] ?? null,
            'delivery_date' => $validated['delivery_date'] ?? null,
            'delivery_time' => $validated['delivery_time'] ?? null,
            'delivery_address' => $validated['delivery_address'] ?? null,
            'status' => $validated['status'] ?? 'draft',
        ]);
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_invoice_created','timestamp'=>time()*1000,'location'=>'InvoiceController.php:137','message'=>'Invoice created successfully','data'=>['invoice_id'=>$invoice->id,'db_invoice_id'=>$invoice->invoice_id],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'E'])."\n", FILE_APPEND);
        // #endregion
        } catch (\Exception $e) {
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_invoice_error','timestamp'=>time()*1000,'location'=>'InvoiceController.php:137','message'=>'Invoice creation failed','data'=>['error'=>$e->getMessage(),'trace'=>$e->getTraceAsString()],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'E'])."\n", FILE_APPEND);
        // #endregion
        throw $e;
        }

        // Create invoice items
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_before_items','timestamp'=>time()*1000,'location'=>'InvoiceController.php:140','message'=>'Before creating items','data'=>['items_count'=>count($validated['items'])],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'F'])."\n", FILE_APPEND);
        // #endregion
        foreach ($validated['items'] as $index => $item) {
            // #region agent log
            file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_item_'.$index,'timestamp'=>time()*1000,'location'=>'InvoiceController.php:141','message'=>'Creating item','data'=>['index'=>$index,'item_data'=>$item],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'F'])."\n", FILE_APPEND);
            // #endregion
            try {
            $invoice->items()->create([
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
            ]);
            // #region agent log
            file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_item_success_'.$index,'timestamp'=>time()*1000,'location'=>'InvoiceController.php:146','message'=>'Item created successfully','data'=>['index'=>$index],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'F'])."\n", FILE_APPEND);
            // #endregion
            } catch (\Exception $e) {
            // #region agent log
            file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_item_error_'.$index,'timestamp'=>time()*1000,'location'=>'InvoiceController.php:146','message'=>'Item creation failed','data'=>['index'=>$index,'error'=>$e->getMessage(),'trace'=>$e->getTraceAsString()],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'F'])."\n", FILE_APPEND);
            // #endregion
            throw $e;
            }
        }

        $invoice->load(['customer', 'items']);
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_success','timestamp'=>time()*1000,'location'=>'InvoiceController.php:149','message'=>'Invoice creation completed successfully','data'=>['invoice_id'=>$invoice->id],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A'])."\n", FILE_APPEND);
        // #endregion

        return response()->json($invoice, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_validation_error','timestamp'=>time()*1000,'location'=>'InvoiceController.php:152','message'=>'Validation failed','data'=>['errors'=>$e->errors()],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'B'])."\n", FILE_APPEND);
        // #endregion
        throw $e;
        } catch (\Exception $e) {
        // #region agent log
        file_put_contents('d:\Asra Ameer Khan\BSE\Git Projects\Cake-Out--Invoice-Generator\.cursor\debug.log', json_encode(['id'=>'log_'.time().'_general_error','timestamp'=>time()*1000,'location'=>'InvoiceController.php:156','message'=>'General error in store()','data'=>['error'=>$e->getMessage(),'file'=>$e->getFile(),'line'=>$e->getLine(),'trace'=>$e->getTraceAsString()],'sessionId'=>'debug-session','runId'=>'run1','hypothesisId'=>'A'])."\n", FILE_APPEND);
        // #endregion
        throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $invoice = Invoice::with(['customer', 'items'])->findOrFail($id);
        return response()->json($invoice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);

        $validated = $request->validate([
            'invoice_date' => 'sometimes|required|date',
            'ordered_date' => 'sometimes|required|date|before_or_equal:invoice_date',
            'customer_id' => 'sometimes|nullable|exists:customers,id',
            'items' => 'sometimes|required|array|min:1',
            'items.*.item_name' => 'required_with:items|string|max:255',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
            'subtotal' => 'sometimes|required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'delivery_charge' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'grand_total' => 'sometimes|required|numeric|min:0',
            'payment_method' => 'nullable|string|in:Cash,Card,Bank Transfer,Online',
            'payment_status' => 'nullable|string|in:Paid,Partially Paid,Due',
            'advance_payment' => 'nullable|numeric|min:0',
            'delivery_type' => 'nullable|string|in:delivery,pickup',
            'delivery_date' => 'nullable|date',
            'delivery_time' => 'nullable|date_format:H:i',
            'delivery_address' => 'nullable|string',
            'status' => 'nullable|string|in:draft,final',
        ]);

        // Calculate balance if grand_total or advance_payment changed
        if (isset($validated['grand_total']) || isset($validated['advance_payment'])) {
            $grandTotal = $validated['grand_total'] ?? $invoice->grand_total;
            $advancePayment = $validated['advance_payment'] ?? $invoice->advance_payment;
            $validated['balance_amount'] = $grandTotal - $advancePayment;
        }

        $invoice->update($validated);

        // Update items if provided
        if (isset($validated['items'])) {
            $invoice->items()->delete();
            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        }

        $invoice->load(['customer', 'items']);

        return response()->json($invoice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
