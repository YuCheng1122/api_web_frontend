import { LLMService, LLMType, LLMConfig } from './types';
import { ChatGPTService } from './chatGPTService';
import { LocalModelService } from './localModelService';

export class LLMFactory {
    static createLLMService(config: LLMConfig): LLMService {
        if (config.type === LLMType.ChatGPT) {
            if (!config.apiKey) {
                throw new Error('API key is required for ChatGPT service');
            }
            return new ChatGPTService(config.apiKey);
        } else if (config.type === LLMType.LocalModel) {
            return new LocalModelService();
        } else {
            throw new Error('Unsupported LLM type');
        }
    }
}