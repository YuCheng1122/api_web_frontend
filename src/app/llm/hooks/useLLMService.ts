import { useState, useEffect } from 'react';
import { LLMFactory } from '../llmFactory';
import { LLMService, LLMType, LLMConfig } from '../types';

export const useLLMService = () => {
    const [llmConfig, setLlmConfig] = useState<LLMConfig>({ type: LLMType.ChatGPT });
    const [llmService, setLlmService] = useState<LLMService | null>(null);

    useEffect(() => {
        try {
            const service = LLMFactory.createLLMService(llmConfig);
            setLlmService(service);
        } catch (error) {
            console.error('Failed to create LLM service:', error);
            setLlmService(null);
        }
    }, [llmConfig]);

    return { llmConfig, setLlmConfig, llmService };
};