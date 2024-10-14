import React, { useEffect, useState, useCallback } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface RecommendedQuestionsProps {
    dashboardInfo: {
        totalAgents: number;
        activeAgents: number;
        topAgent: string;
        topEvent: string;
    };
    onQuestionSelect: (question: string) => void;
}

interface FormattedQuestion {
    question: string;
    background: string;
    investigation: string;
}

const RecommendedQuestions: React.FC<RecommendedQuestionsProps> = ({ dashboardInfo, onQuestionSelect }) => {
    const [recommendedQuestions, setRecommendedQuestions] = useState<FormattedQuestion[]>([]);

    const generateRecommendedQuestions = useCallback(async () => {
        try {
            const response = await axios.post('/api/generate-questions', { dashboardInfo });
            setRecommendedQuestions(response.data.questions);
        } catch (error) {
            console.error('生成推薦問題時發生錯誤:', error);
            setRecommendedQuestions([]);
        }
    }, [dashboardInfo]);

    const debouncedGenerateQuestions = useCallback(
        debounce(generateRecommendedQuestions, 1000),
        [generateRecommendedQuestions]
    );

    useEffect(() => {
        debouncedGenerateQuestions();

        return () => {
            debouncedGenerateQuestions.cancel();
        };
    }, [debouncedGenerateQuestions]);

    return (
        <div className="space-y-4">
            {recommendedQuestions.map((question, index) => (
                <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => onQuestionSelect(question.question)}
                >
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FaQuestionCircle className="text-blue-500 mr-2" />
                        {question.question}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">{question.background}</p>
                    <p className="text-sm text-gray-600 mt-1 italic">建議調查: {question.investigation}</p>
                </div>
            ))}
        </div>
    );
};

export default RecommendedQuestions;