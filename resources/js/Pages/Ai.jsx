import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import niLogo from '../../assets/ni-logo.png';
import profileImage from '../../assets/user-profile.png';
import { FaTrash } from 'react-icons/fa';

export default function Ai(props) {
    const { errors, messages } = props;
    const { data, setData, post } = useForm({
        message: '',
    });

    const [progress, setProgress] = useState(false);
    const messagesEndRef = useRef(null); // Create a ref for the messages container
    const chatContainerRef = useRef(null); // Create a ref for the chat container

    const scrollToBottom = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            const scrollHeight = chatContainer.scrollHeight;
            const clientHeight = chatContainer.clientHeight;
            const scrollTop = chatContainer.scrollTop;

            // Check if the user is near the bottom
            const isUserNearBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px buffer

            if (isUserNearBottom) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const clearChat = async () => {
        try {
            await post('/ai/clear', {
                onSuccess: () => reset(), // Clear the session messages
            });
        } catch (error) {
            console.error('Failed to clear chat:', error);
        }
    };

    function submit(e) {
        e.preventDefault();
        console.log('Message data:', data.message);

        if (progress) {
            return;
        }
        setProgress(true);
        post('/ai', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData('message', '');
                setProgress(false);
                scrollToBottom();
            },
            onError: () => {
                setProgress(false);
                console.log('Props:', props);
            }
        });
    }

    // Function to render messages and code snippets
    const renderMessageContent = (content) => {
        // Match code snippets using regex
        const codeBlockRegex = /```(.*?)```/gs;
        const parts = content.split(codeBlockRegex);

        return parts.map((part, index) => {
            // Check if the part matches a code block
            const isCodeBlock = index % 2 !== 0;
            if (isCodeBlock) {
                return (
                    <SyntaxHighlighter key={index} language="php" style={solarizedlight}>
                        {part.trim()}
                    </SyntaxHighlighter>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">NI AI</h2>}
        >
            <Head title="AI" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 chat-height">
                    <div>
                        {/* Clear Chat Button */}
                        <button 
                            onClick={clearChat}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4 flex items-center"
                        >
                            <FaTrash className="mr-2" />
                            Clear Chat
                        </button>
                    </div>
                    <div className="overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 h-full flex flex-col">
                        <div ref={chatContainerRef} className="flex-1 p-4 text-gray-900 dark:text-gray-100 overflow-auto">
                            {/* Display AI messages */}
                            {messages.map((item, index) => (
                                <div
                                    className={`w-full p-4 whitespace-pre-line flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    key={index}
                                >
                                    <div className="">
                                        <img
                                            src={item.role === 'user' ? profileImage : niLogo}
                                            alt={item.role === 'user' ? 'User Profile' : 'AI Assistant'}
                                            className="w-10 h-10"
                                            style={{
                                                marginRight: '10px',
                                                minWidth: '41px', 
                                                minHeight: '40px'
                                            }}
                                        />
                                    </div>
                                    <div
                                        className={`p-2 rounded-lg ${item.role === 'user' ? 'primary-background text-white' : 'bg-gray-200 text-black'}`}
                                    >
                                        {renderMessageContent(item.content)} {/* Render message content */}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Input form for new messages */}
                        <div className="p-4 w-full">
                            <form className="flex items-center" onSubmit={submit}>
                                <input
                                    type="text"
                                    className="border border-gray-200 h-9 rounded w-full px-2"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Message"
                                />
                                <button
                                    className="bg-[rgb(79,70,229)] hover:bg-[rgb(61,52,196)] inline-block flex items-center h-9 px-4 rounded ml-2 text-white"
                                    type="submit"
                                >
                                    {progress ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    Submit
                                </button>
                            </form>
                            <div className="py-1">
                                {errors.message ? (
                                    <div className="text-xs text-red-500">{errors.message}</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
