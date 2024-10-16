import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import {generateQuestionsPrompt} from "@/components/chatbot/prompts/ChatPrompt";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log('Received POST request to generate questions');
            const { dashboardInfo } = req.body;
            console.log('Dashboard Info:', JSON.stringify(dashboardInfo, null, 2));

            const prompt = generateQuestionsPrompt(dashboardInfo);

            console.log('Sending request to Anthropic API');
            const response = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 4096,
                messages: [{ role: "user", content: prompt }],
            });
            console.log('Received response from Anthropic API');

            const generatedContent = response?.content;
            if (!Array.isArray(generatedContent) || generatedContent.length === 0 || generatedContent[0].type !== 'text') {
                throw new TypeError('API response content is not in the expected format');
            }
            const generatedText = generatedContent[0].text;
            console.log('Generated Text:', generatedText);

            const formattedQuestions = generatedText
                .split(/問題(?:：|\d+：)/)
                .slice(1)
                .map((block: string) => {
                    const lines = block.split('\n').filter((line: string) => line.trim() !== '');
                    const question = lines.find((line: string) => !line.startsWith('背景：') && !line.startsWith('可能的調查方向：'))?.trim() || '';
                    const background = lines.find((line: string) => line.startsWith('背景：'))?.replace('背景：', '').trim() || '';
                    const investigation = lines.find((line: string) => line.startsWith('可能的調查方向：'))?.replace('可能的調查方向：', '').trim() || '';

                    return { question, background, investigation };
                });

            console.log('Parsed questions:', JSON.stringify(formattedQuestions, null, 2));

            res.status(200).json({ questions: formattedQuestions });
        } catch (error) {
            console.error('生成問題時發生錯誤:', error);
            res.status(500).json({ error: '生成問題時發生錯誤' });
        }
    } else {
        console.log(`Received unsupported ${req.method} request`);
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}