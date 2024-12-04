import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
    const { message, context, conversationHistory } = await request.json();

    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
    };

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const writeChunk = async (chunk: string) => {
        await writer.write(new TextEncoder().encode(`data: ${chunk}\n\n`));
    };

    try {
        const messages = [
            { role: 'user', content: context },
            ...conversationHistory.map((msg: { text: string; isUser: boolean }) => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: message }
        ];

        const anthropicStream = await anthropic.messages.stream({
            messages,
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 4096,
            stream: true,
        });

        (async () => {
            try {
                for await (const chunk of anthropicStream) {
                    if (chunk.type === 'content_block_delta') {
                        await writeChunk(JSON.stringify(chunk));
                    }
                }
                await writeChunk('串流結束');
                await writer.close();
            } catch (error) {
                console.error('Streaming error:', error);
                await writeChunk(JSON.stringify({ error: '發生錯誤' }));
                await writer.close();
            }
        })();

        return new Response(stream.readable, { headers });
    } catch (error) {
        console.error('Error in chat stream:', error);
        return NextResponse.json({ error: '發生錯誤' }, { status: 500 });
    }
}
