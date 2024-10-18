<?php


namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function index()
    {
        $messages = collect(session('messages', []))->reject(fn ($message) => $message['role'] === 'system');

        return Inertia::render('Ai', [
            'messages' => $messages->values()
        ]);
    }

    public function store(StoreMessageRequest $request)
{
    try {
        // Retrieve the current messages from the session or initialize
        $messages = $request->session()->get('messages', [
            ['role' => 'system', 'content' => 'You are TSR Team Assistant at National Instruments, a customer service assistant, a support agent for National Instruments. Provide concise answers, and when relevant, reference specific NI products, documentation, and knowledge base articles.']
        ]);

        // Add the user's message
        $messages[] = ['role' => 'user', 'content' => $request->input('message')];

        Log::info('Messages sent to OpenAI:', $messages);

        // Call OpenAI API
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4',
            'messages' => $messages,
        ]);

        // Convert response to array
        $responseArray = $response->toArray();

        Log::info('OpenAI Response:', $responseArray);

        if (!isset($responseArray['choices'][0]['message']['content'])) {
            throw new Exception('Invalid response format from OpenAI');
        }

        // Add the assistant's response to messages with a formatting code
        $messages[] = [
            'role' => 'assistant',
            'content' => $responseArray['choices'][0]['message']['content'],
            'formatted' => '<div class="ai-message">' . htmlentities($responseArray['choices'][0]['message']['content']) . '</div>' // Example formatting
        ];
        $request->session()->put('messages', $messages);

        return redirect()->route('ai');
    } catch (Exception $e) {
        Log::error('Error interacting with OpenAI API: ' . $e->getMessage(), [
            'request_data' => $request->all(),
            'session_data' => $request->session()->all(),
            'stack_trace' => $e->getTraceAsString(),
        ]);
        return redirect()->route('ai')->withErrors(['message' => 'Failed to get a response from the AI.']);
    }
}


    // Add this method to clear the chat
    public function clear(Request $request)
    {
        $request->session()->forget('messages');
        return redirect()->route('ai');
    }
}