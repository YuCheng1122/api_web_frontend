import { Message, ChatError, StreamResponse, DashboardInfo } from '../types/chat';
import { createSystemPrompt, createQuestionGenerationPrompt } from './prompts';

export class ChatService {
    private static instance: ChatService;
    private readonly apiEndpoint = '/api/chat-stream';

    private constructor() {}

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async sendStreamingMessage(
        message: string,
        dashboardInfo: DashboardInfo,
        conversationHistory: Message[],
        onChunk: (chunk: string) => void
    ): Promise<void> {
        try {
            const context = createSystemPrompt(dashboardInfo);
            const response = await this.makeStreamRequest(message, context, conversationHistory);
            await this.processStreamResponse(response, onChunk);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async generateQuestions(
        dashboardInfo: DashboardInfo,
        messages: Message[] = []
    ): Promise<string> {
        try {
            const prompt = createQuestionGenerationPrompt(dashboardInfo, messages);
            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.questions;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private async makeStreamRequest(
        message: string,
        context: string,
        conversationHistory: Message[]
    ): Promise<Response> {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, context, conversationHistory }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    }

    private async processStreamResponse(
        response: Response,
        onChunk: (chunk: string) => void
    ): Promise<void> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body available');
        }

        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    
                    const data = line.slice(6);
                    if (data.includes('串流結束')) continue;

                    try {
                        const jsonData = JSON.parse(data) as StreamResponse;
                        if (jsonData.type === 'content_block_delta' && 
                            jsonData.delta.type === 'text_delta') {
                            onChunk(jsonData.delta.text);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    private handleError(error: unknown): ChatError {
        if (error instanceof Error) {
            return {
                message: error.message,
                code: 'CHAT_SERVICE_ERROR',
                details: error
            };
        }
        return {
            message: 'An unknown error occurred',
            code: 'UNKNOWN_ERROR',
            details: error
        };
    }
}
