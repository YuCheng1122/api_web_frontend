import { LLMService, LLMType, LLMConfig } from './types';
import { ChatGPTService } from './chatGPTService';
import { LocalModelService } from './localModelService';

export class LLMFactory {
    static createLLMService(config: LLMConfig): LLMService {
        switch (config.type) {
            case LLMType.ChatGPT:
                if (!config.apiKey) {
                    throw new Error('API key is required for ChatGPT service');
                }
                return new ChatGPTService(config.apiKey);
            case LLMType.LocalModel:
                return new LocalModelService();
            default:
                throw new Error('Unsupported LLM type');
        }
    }
}