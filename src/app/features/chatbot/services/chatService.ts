import { Message, ChatError, StreamResponse, DashboardInfo } from '../types/chat';

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
            const context = this.createSystemPrompt(dashboardInfo);
            const response = await this.makeStreamRequest(message, context, conversationHistory);
            await this.processStreamResponse(response, onChunk);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async generateQuestions(
        dashboardInfo: DashboardInfo
    ): Promise<string> {
        try {
            const prompt = this.createQuestionGenerationPrompt(dashboardInfo);
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

    private createSystemPrompt(dashboardInfo: DashboardInfo): string {
        return `You are a security operations assistant. Here's the current dashboard information:
- Total Agents: ${dashboardInfo.totalAgents}
- Active Agents: ${dashboardInfo.activeAgents}
- Top Agent: ${dashboardInfo.topAgent}
- Top Event: ${dashboardInfo.topEvent}
- Top MITRE Tactic: ${dashboardInfo.topMitre}
- Total Events: ${dashboardInfo.totalEvents}

Please help analyze security events and provide insights based on this information.`;
    }

    private createQuestionGenerationPrompt(dashboardInfo: DashboardInfo): string {
        return `Based on the following dashboard information:
- Total Agents: ${dashboardInfo.totalAgents}
- Active Agents: ${dashboardInfo.activeAgents}
- Top Agent: ${dashboardInfo.topAgent}
- Top Event: ${dashboardInfo.topEvent}
- Top MITRE Tactic: ${dashboardInfo.topMitre}
- Total Events: ${dashboardInfo.totalEvents}

Generate relevant questions that a security analyst might want to ask about the current system state.`;
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
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonData = JSON.parse(line.slice(6)) as StreamResponse;
                            if (jsonData.type === 'content_block_delta' && 
                                jsonData.delta.type === 'text_delta') {
                                onChunk(jsonData.delta.text);
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
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
