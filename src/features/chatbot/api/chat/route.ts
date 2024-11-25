import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { message, systemPrompt, messageHistory } = await request.json();

        // 準備發送給 Claude 的消息
        const messages = [
            ...messageHistory.map((msg: any) => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text
            })),
            { role: "user", content: message }
        ];

        // 創建流式響應
        const headers = {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        };

        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        const anthropicStream = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 4096,
            system: systemPrompt,
            messages: messages,
            stream: true,
        });

        (async () => {
            try {
                for await (const chunk of anthropicStream) {
                    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                        await writer.write(new TextEncoder().encode(chunk.delta.text));
                    }
                }
                await writer.close();
            } catch (error) {
                console.error('Streaming error:', error);
                await writer.write(new TextEncoder().encode(JSON.stringify({ error: '發生錯誤' })));
                await writer.close();
            }
        })();

        return new Response(stream.readable, { headers });
    } catch (error: any) {
        console.error('Error in chat API:', error);
        return NextResponse.json({
            error: error.message || '處理聊天請求時發生錯誤'
        }, { status: 500 });
    }
}
