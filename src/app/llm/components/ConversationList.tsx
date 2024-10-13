import React from 'react';
import { IoAdd } from "react-icons/io5";

interface ConversationListProps {
    conversations: { id: string; title: string }[];
    currentConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
                                                               conversations,
                                                               currentConversationId,
                                                               onSelectConversation,
                                                               onNewConversation
                                                           }) => {
    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4">
            <button
                onClick={onNewConversation}
                className="w-full bg-blue-500 text-white p-2 rounded-lg mb-4 flex items-center justify-center"
            >
                <IoAdd size={20} className="mr-2" />
                    新增對話
            </button>
            <div className="space-y-2">
                {conversations.map(conv => (
                    <button
                        key={conv.id}
                        onClick={() => onSelectConversation(conv.id)}
                        className={`w-full text-left p-2 rounded-lg ${
                            currentConversationId === conv.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {`新對話 ${conv.title}`}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ConversationList;