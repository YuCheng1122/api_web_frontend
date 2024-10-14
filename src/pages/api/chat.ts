import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { message, context, conversationHistory } = req.body

            const messages = [
                { role: 'assistant', content: context },
                ...conversationHistory,
                { role: 'user', content: message }
            ]

            const response = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1000,
                messages: messages,
            });

            res.status(200).json({ response: response.content[0] })
        } catch (error) {
            console.error('Error communicating with Claude API:', error);
            res.status(500).json({ error: 'Error communicating with Claude API' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}