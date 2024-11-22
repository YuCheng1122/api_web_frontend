import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { message, systemPrompt, messageHistory } = req.body;

        // 準備發送給 Claude 的消息
        const messages = [
            ...messageHistory.map((msg: any) => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text
            })),
            { role: "user", content: message }
        ];

        // 創建流式響應
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        });

        const stream = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 4096,
            system: systemPrompt,  // system prompt 作為頂層參數
            messages: messages,
            stream: true,
        });

        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                res.write(chunk.delta.text);
            }
        }

        res.end();
    } catch (error: any) {
        console.error('Error in chat API:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: error.message || '處理聊天請求時發生錯誤'
            });
        }
    }
}
