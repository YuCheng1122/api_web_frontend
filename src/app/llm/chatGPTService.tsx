import axios from 'axios';
import { LLMService, LLMResponse, Message } from './types';

export class ChatGPTService implements LLMService {
    private apiKey: string;
    private apiUrl: string;

    constructor(apiKey: string, apiUrl: string = 'https://api.openai.com/v1/chat/completions') {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    async generateResponse(messages: Message[]): Promise<LLMResponse> {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: "gpt-3.5-turbo",
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