'use client'

import React from 'react';
import { useLLMService } from './hooks/useLLMService';
import { useConversations } from './hooks/useConversations';
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';
import SettingsPanel from './components/SettingsPanel';

const LLMPage: React.FC = () => {
    const { llmConfig, setLlmConfig, llmService } = useLLMService();
    const {
        conversations,
        currentConversationId,
        createNewConversation,
        setCurrentConversationId,
        addMessageToCurrentConversation,
        getCurrentConversation,
    } = useConversations();

    const [showSettings, setShowSettings] = React.useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <ConversationList
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={setCurrentConversationId}
                onNewConversation={createNewConversation}
            />
            <div className="flex-1 flex flex-col">
                <ChatArea
                    currentConversation={getCurrentConversation()}
                    onSendMessage={addMessageToCurrentConversation}
                    llmService={llmService}
                    onOpenSettings={() => setShowSettings(true)}
                />
            </div>
            {showSettings && (
                <SettingsPanel
                    llmConfig={llmConfig}
                    onConfigChange={setLlmConfig}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default LLMPage;