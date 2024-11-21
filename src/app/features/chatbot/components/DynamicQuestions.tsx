import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types/chat';
import { ChevronDown, Sparkles, Clock } from 'lucide-react';
import { ChatService } from '../services/chatService';

interface Question {
    question: string;
    background: string;
    investigation: string;
}

interface QuestionSet {
    id: number;
    questions: Question[];
    isCollapsed: boolean;
    timestamp: Date;
}

interface DynamicQuestionsProps {
    messages: Message[];
    onQuestionSelect: (question: string) => void;
    shouldGenerateNew: boolean;
    onGenerationComplete: () => void;
}

export const DynamicQuestions: React.FC<DynamicQuestionsProps> = ({
    messages,
    onQuestionSelect,
    shouldGenerateNew,
    onGenerationComplete
}) => {
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animatingSetId, setAnimatingSetId] = useState<number | null>(null);
    const generationInProgress = useRef(false);
    const chatService = useRef(ChatService.getInstance());

    const generateNewQuestions = async () => {
        if (generationInProgress.current) {
            return;
        }

        try {
            generationInProgress.current = true;
            setLoading(true);
            setError(null);

            setQuestionSets(prev => prev.map(set => ({
                ...set,
                isCollapsed: true
            })));

            const dashboardInfo = await chatService.current.getDashboardInfo();
            if (!dashboardInfo) {
                throw new Error('無法獲取系統狀態數據');
            }

            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dashboardInfo, messages }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            const newSetId = Date.now();
            const newSet: QuestionSet = {
                id: newSetId,
                questions: data.questions,
                isCollapsed: false,
                timestamp: new Date()
            };

            setQuestionSets(prev => [newSet, ...prev]);
            setAnimatingSetId(newSetId);

            setTimeout(() => {
                setAnimatingSetId(null);
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : '獲取推薦問題時發生錯誤');
        } finally {
            setLoading(false);
            onGenerationComplete();
            setTimeout(() => {
                generationInProgress.current = false;
            }, 1000);
        }
    };

    useEffect(() => {
        if (shouldGenerateNew && !loading) {
            generateNewQuestions();
        }
    }, [shouldGenerateNew]);

    const handleQuestionSelect = (setId: number, question: Question) => {
        setQuestionSets(prev => prev.map(set => ({
            ...set,
            questions: set.id === setId
                ? set.questions.filter(q => q.question !== question.question)
                : set.questions
        })));
        onQuestionSelect(question.question);
    };

    const toggleSetCollapse = (setId: number) => {
        setQuestionSets(prev => prev.map(set => ({
            ...set,
            isCollapsed: set.id === setId ? !set.isCollapsed : set.isCollapsed
        })));
    };

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('zh-TW', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="space-y-4">
            {loading && (
                <div className="flex items-center justify-center py-4 space-x-2 animate-pulse bg-blue-50 rounded-lg border border-blue-100">
                    <Sparkles className="text-blue-500" size={20} />
                    <p className="text-blue-600 font-medium">正在生成新的推薦問題...</p>
                </div>
            )}

            {error && (
                <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {questionSets.map((set, setIndex) => (
                    <div
                        key={set.id}
                        className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 
                            ${animatingSetId === set.id ? 'animate-slideIn ring-2 ring-blue-500 ring-opacity-50' : ''}
                            ${setIndex === 0 ? 'border-blue-200 bg-blue-50/30' : ''}`}
                    >
                        <div
                            className={`p-4 flex items-center justify-between cursor-pointer 
                                hover:bg-gray-50 transition-colors rounded-t-lg
                                ${set.isCollapsed ? 'rounded-b-lg' : ''}`}
                            onClick={() => toggleSetCollapse(set.id)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`transition-transform duration-200 p-1 rounded-full 
                                    ${setIndex === 0 ? 'bg-blue-100' : 'bg-gray-100'}
                                    ${!set.isCollapsed ? 'transform rotate-180' : ''}`}>
                                    <ChevronDown size={18} className={setIndex === 0 ? 'text-blue-600' : 'text-gray-600'} />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`font-medium ${setIndex === 0 ? 'text-blue-600' : 'text-gray-700'}`}>
                                            推薦問題
                                        </span>
                                        {setIndex === 0 && (
                                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                                                最新
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                                        <Clock size={14} />
                                        <span>{formatTimestamp(set.timestamp)}</span>
                                        <span>•</span>
                                        <span>{set.questions.length} 個問題</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden
                                ${set.isCollapsed ? 'max-h-0' : 'max-h-[1000px] border-t border-gray-100'}`}
                        >
                            <div className="p-4 space-y-3">
                                {set.questions.length === 0 ? (
                                    <p className="text-gray-500 text-center py-2">此組問題已全部使用</p>
                                ) : (
                                    set.questions.map((question, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleQuestionSelect(set.id, question)}
                                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 
                                                ${setIndex === 0
                                                    ? 'bg-white hover:bg-blue-50 border border-blue-100 hover:border-blue-200'
                                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}
                                                transform hover:-translate-y-0.5 hover:shadow-sm`}
                                        >
                                            <p className={`font-medium ${setIndex === 0 ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {question.question}
                                            </p>
                                            {question.background && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                    {question.background}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
