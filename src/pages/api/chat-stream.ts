import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { message, context, conversationHistory } = req.body;

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        });

        try {
            const messages = [
                { role: 'user', content: context },
                ...conversationHistory.map((msg: { text: string; isUser: boolean }) => ({
                    role: msg.isUser ? 'user' : 'assistant',
                    content: msg.text
                })),
                { role: 'user', content: message }
            ];

            const stream = anthropic.messages.stream({
                messages,
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 4096,
                stream: true,
            });

            for await (const chunk of stream) {
                if (chunk.type === 'content_block_delta') {
                    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
            }
        } catch (error) {
            console.error('Error in chat stream:', error);
            res.write(`data: ${JSON.stringify({ error: '發生錯誤' })}\n\n`);
        }

        res.write('event: close\ndata: 串流結束\n\n');
        res.end();
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}