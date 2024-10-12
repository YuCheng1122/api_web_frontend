import axios from 'axios';

export const sendMessage = async (message: string, context: string) => {
    try {
        const response = await axios.post('/api/chat', {
            message,
            context
        });
        return response.data.response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const sendStreamingMessage = async (
    message: string,
    context: string,
    conversationHistory: Array<{ text: string; isUser: boolean }>,
    onChunk: (chunk: string) => void
) => {
    try {
        const response = await fetch('/api/chat-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, context, conversationHistory }),
        });

        if (!response.body) {
            throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonData = JSON.parse(line.slice(6));
                        if (jsonData.type === 'content_block_delta' && jsonData.delta.type === 'text_delta') {
                            onChunk(jsonData.delta.text);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error sending streaming message:', error);
        throw error;
    }
};