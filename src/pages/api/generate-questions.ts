import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import {createQuestionGenerationPrompt} from "@/features/chatbot/services/prompts";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log('Received POST request to generate questions');
            const { dashboardInfo, messages } = req.body;
            console.log('Dashboard Info:', JSON.stringify(dashboardInfo, null, 2));
            console.log('Conversation History:', JSON.stringify(messages, null, 2));

            const prompt = createQuestionGenerationPrompt(dashboardInfo, messages);

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

            // 解析XML格式的問題
            const questions = generatedText.match(/<question>[\s\S]*?<\/question>/g) || [];
            const formattedQuestions = questions.map(questionBlock => {
                const content = questionBlock.match(/<content>([\s\S]*?)<\/content>/)?.[1]?.trim() || '';
                const background = questionBlock.match(/<background>([\s\S]*?)<\/background>/)?.[1]?.trim() || '';
                const investigation = questionBlock.match(/<investigation>([\s\S]*?)<\/investigation>/)?.[1]?.trim() || '';

                return {
                    question: content,
                    background,
                    investigation
                };
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
