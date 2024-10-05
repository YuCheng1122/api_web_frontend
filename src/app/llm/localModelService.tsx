import { LLMService, LLMResponse, Message } from './types';

export class LocalModelService implements LLMService {
    async generateResponse(messages: Message[]): Promise<LLMResponse> {
        // TODO:Local request functionality
        const lastMessage = messages[messages.length - 1];
        return { content: `Local model response to: ${lastMessage.content}` };
    }
}