import axios from 'axios';
import { LLMService, LLMResponse, Message } from './types';

interface ChatGPTResponse {
    choices: { message: { content: string } }[];
}

const GPT_MODEL = "gpt-3.5-turbo";

export class ChatGPTService implements LLMService {
    private apiKey: string;
    private apiUrl: string = 'https://api.openai.com/v1/chat/completions';

    constructor(apiKey: string, apiUrl?: string) {
        this.apiKey = apiKey;
        if (apiUrl) {
            this.apiUrl = apiUrl;
        }
    }

    async generateResponse(messages: Message[]): Promise<LLMResponse> {
        try {
            const response = await axios.post<ChatGPTResponse>(
                this.apiUrl,
                {
                    model: GPT_MODEL,
                    messages: messages,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return { content: response.data.choices[0].message.content };
        } catch (error) {
            console.error('Error calling ChatGPT API:', error);
            return { content: '', error: 'Failed to generate response' };
        }
    }
}