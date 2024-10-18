<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize()
    {
        return true; // You can adjust authorization logic if needed
    }

    public function rules()
    {
        return [
            'message' => 'required|string|max:1000', // Adjust max length as necessary
        ];
    }
}
