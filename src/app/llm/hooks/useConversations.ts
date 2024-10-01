
import { useState, useEffect } from 'react';
import { Message } from '../types';

interface ChatMessage extends Message {
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
}

export const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    useEffect(() => {
        if (conversations.length === 0) {
            createNewConversation();
        }
    }, [conversations]);

    const createNewConversation = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: `New Conversation ${conversations.length + 1}`,
            messages: []
        };
        setConversations([...conversations, newConversation]);
        setCurrentConversationId(newConversation.id);
    };

    const getCurrentConversation = () => {
        return conversations.find(conv => conv.id === currentConversationId) || conversations[0];
    };

    const addMessageToCurrentConversation = (message: ChatMessage) => {
        setConversations(prevConversations =>
            prevConversations.map(conv =>
                conv.id === currentConversationId
                    ? { ...conv, messages: [...conv.messages, message] }
                    : conv
            )
        );
    };

    return {
        conversations,
        currentConversationId,
        createNewConversation,
        setCurrentConversationId,
        addMessageToCurrentConversation,
        getCurrentConversation,
    };
};
