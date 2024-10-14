import React, { useEffect, useRef } from 'react';
import { createChat } from '@n8n/chat';

interface N8NChatProps {
    dashboardInfo: string;
    selectedQuestion: string | null;
}

const N8NChat: React.FC<N8NChatProps> = ({ dashboardInfo, selectedQuestion }) => {
    const chatRef = useRef<any>(null);

    useEffect(() => {
        chatRef.current = createChat({
            webhookUrl: `${process.env.NEXT_PUBLIC_N8N_LOCALHOST}`,
            mode: 'fullscreen',
            target: '#n8n-chat',
            showWelcomeScreen: true,
            showWindowCloseButton: true,
            loadPreviousSession: true,
            defaultLanguage: 'en',
            allowFileUploads: true,
            initialMessages: [
                'Hi there! 👋',
                'My name is AIXSOAR Assistant. How can I assist you today?',
                `Here's some context from our dashboard: ${dashboardInfo}`
            ],
            i18n: {
                en: {
                    title: 'AIXSOAR Assistant',
                    subtitle: "Start a chat. We're here to help you 24/7.",
                    footer: '',
                    getStarted: 'New Conversation',
                    inputPlaceholder: 'Type your question...',
                    closeButtonTooltip: ''
                },
            },
        });
    }, [dashboardInfo]);

    useEffect(() => {
        if (selectedQuestion && chatRef.current) {
            chatRef.current.sendMessage(selectedQuestion);
        }
    }, [selectedQuestion]);

    return (
        <div id="n8n-chat" className="flex-1 h-full"></div>
    );
};

export default N8NChat;