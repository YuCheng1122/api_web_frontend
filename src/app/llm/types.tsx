export interface LLMResponse {
    content: string;
    error?: string;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface LLMService {
    generateResponse(messages: Message[]): Promise<LLMResponse>;
}

export enum LLMType {
    ChatGPT,
    LocalModel,
}

export interface LLMConfig {
    type: LLMType;
    apiKey?: string;
}