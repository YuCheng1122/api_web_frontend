import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log('Received POST request to generate questions');
            const { dashboardInfo } = req.body;
            console.log('Dashboard Info:', JSON.stringify(dashboardInfo, null, 2));

            const prompt = `根據以下安全運營平台的儀表板資訊，生成恰好 5 個相關且有洞察力的問題，這些問題是安全分析師可能會問的：

總代理數：${dashboardInfo.totalAgents}
活躍代理數：${dashboardInfo.activeAgents}
最活躍代理：${dashboardInfo.topAgent}
最常見事件：${dashboardInfo.topEvent}
最新事件趨勢：${JSON.stringify(dashboardInfo.latestEventTrends)}

請提供 5 個有助於分析安全狀況並提供有價值見解的問題。請使用繁體中文回答，並按以下格式呈現每個問題：

問題：[問題內容]
背景：[簡短解釋為什麼這個問題重要]
可能的調查方向：[1-2個調查這個問題的建議]

請確保每個問題都有這三個部分，並且內容要具體、相關且有洞察力。`;

            console.log('Sending request to Anthropic API');
            const response = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1500,
                messages: [{ role: "user", content: prompt }],
            });
            console.log('Received response from Anthropic API');

            const generatedContent = response?.content;
            if (!Array.isArray(generatedContent) || generatedContent.length === 0 || generatedContent[0].type !== 'text') {
                throw new TypeError('API response content is not in the expected format');
            }
            const generatedText = generatedContent[0].text;
            console.log('Generated Text:', generatedText);

            // 改進的問題解析邏輯
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