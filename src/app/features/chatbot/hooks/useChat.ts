import { useState, useCallback, useRef } from 'react';
import { Message, ChatError } from '../types/chat';
import { ChatService } from '../services/chatService';

interface UseChatProps {
    initialMessages?: Message[];
}

interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    error: ChatError | null;
    streamingMessage: string;
    sendMessage: (message: string) => Promise<void>;
    clearMessages: () => void;
}

export const useChat = ({ initialMessages = [] }: UseChatProps): UseChatReturn => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ChatError | null>(null);
    const [streamingMessage, setStreamingMessage] = useState('');
    
    const chatService = useRef(ChatService.getInstance());

    const sendMessage = useCallback(async (message: string) => {
        if (message.trim() === '' || isLoading) return;

        const newUserMessage: Message = {
            text: message,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setError(null);
        setStreamingMessage('');

        try {
            let fullResponse = '';
            await chatService.current.sendStreamingMessage(
                message,
                messages,
                (chunk: string) => {
                    fullResponse += chunk;
                    setStreamingMessage(prev => prev + chunk);
                }
            );

            const newAssistantMessage: Message = {
                text: fullResponse,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAssistantMessage]);
        } catch (err) {
            const chatError = err as ChatError;
            setError(chatError);
            const errorMessage: Message = {
                text: '抱歉，我在處理您的請求時遇到了問題。請稍後再試。',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setStreamingMessage('');
        }
    }, [messages, isLoading]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setStreamingMessage('');
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        streamingMessage,
        sendMessage,
        clearMessages
    };
};
