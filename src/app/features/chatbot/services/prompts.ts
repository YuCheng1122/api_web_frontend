import { DashboardInfo, Message } from '../types/chat';

const getDefaultValue = (value: any, defaultValue: any) => {
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }
    return value;
};

export const createSystemPrompt = (dashboardInfo: DashboardInfo): string => `
<prompt>
    <language>
        請務必使用繁體中文回答所有問題。不要使用簡體中文或其他語言。
    </language>
    
    <assistantRole>
        您是安全運營平台的 AI 助手。您的角色是提供清晰、實用的安全建議和分析，避免提供具體的指令或腳本。
        相反地，您應該：
        - 解釋問題的本質和潛在影響
        - 提供高層次的解決方案建議
        - 說明需要注意的重要安全考量
        - 引導用戶理解整體安全概念
    </assistantRole>
    <systemStatus>
        <totalAgents>${getDefaultValue(dashboardInfo.totalAgents, 0)}</totalAgents>
        <activeAgents>${getDefaultValue(dashboardInfo.activeAgents, 0)}</activeAgents>
        <topAgent>${getDefaultValue(dashboardInfo.topAgent, 'N/A')}</topAgent>
        <topEvent>${getDefaultValue(dashboardInfo.topEvent, 'N/A')}</topEvent>
        <topMitre>${getDefaultValue(dashboardInfo.topMitre, 'N/A')}</topMitre>
        <totalEvents>${getDefaultValue(dashboardInfo.totalEvents, 0)}</totalEvents>
        <latestEventTrends>${JSON.stringify(dashboardInfo.latestEventTrends || [])}</latestEventTrends>
        <agentDistribution>
            <windows>
                <total>${getDefaultValue(dashboardInfo.agentDistribution?.windows?.total, 0)}</total>
                <active>${getDefaultValue(dashboardInfo.agentDistribution?.windows?.active, 0)}</active>
            </windows>
            <linux>
                <total>${getDefaultValue(dashboardInfo.agentDistribution?.linux?.total, 0)}</total>
                <active>${getDefaultValue(dashboardInfo.agentDistribution?.linux?.active, 0)}</active>
            </linux>
            <macos>
                <total>${getDefaultValue(dashboardInfo.agentDistribution?.macos?.total, 0)}</total>
                <active>${getDefaultValue(dashboardInfo.agentDistribution?.macos?.active, 0)}</active>
            </macos>
        </agentDistribution>
        <recentEvents>
            ${(dashboardInfo.recentEvents || [])
                .map(
                    (event) => `
                <event>
                    <time>${getDefaultValue(event.time, 'N/A')}</time>
                    <agentName>${getDefaultValue(event.agent_name, 'N/A')}</agentName>
                    <ruleDescription>${getDefaultValue(event.rule_description, 'N/A')}</ruleDescription>
                    <ruleMitreTactic>${getDefaultValue(event.rule_mitre_tactic, 'N/A')}</ruleMitreTactic>
                    <ruleMitreId>${getDefaultValue(event.rule_mitre_id, 'N/A')}</ruleMitreId>
                    <ruleLevel>${getDefaultValue(event.rule_level, 0)}</ruleLevel>
                </event>
            `
                )
                .join("")}
        </recentEvents>
    </systemStatus>
    <userInstructions>
        根據系統狀態資訊，回答安全分析師可能的問題，並提供詳細建議。
        
        回答時請注意：
        1. 不要提供具體的指令或腳本
        2. 專注於解釋問題的本質和影響
        3. 提供可行的高層次解決方案
        4. 說明重要的安全考量
        
        請使用以下格式標記來組織回答：
        
        <title>標題內容</title>
        
        <highlight>重要內容</highlight>
        
        對於列表，請使用以下其中一種格式：
        
        1. 有序列表（步驟或優先順序）：
        <numbered>
        1. 第一個步驟或建議
        2. 第二個步驟或建議
        3. 第三個步驟或建議
        </numbered>
        
        2. 無序列表（要點或注意事項）：
        <list>
        - 重要考量點
        - 注意事項
        - 建議事項
        </list>
        
        請記住：
        - 建議應該是實用且具體的，但不包含技術指令
        - 解釋為什麼這些建議重要
        - 說明預期的結果和效益
        - 提醒可能需要的額外資源或支援
    </userInstructions>
</prompt>
`;

export const createQuestionGenerationPrompt = (dashboardInfo: DashboardInfo, messages: Message[] = []): string => {
    const conversationHistory = messages
        .map(msg => `<message isUser="${msg.isUser}">${msg.text}</message>`)
        .join('\n');

    return `
<language>
    請務必使用繁體中文產生問題。不要使用簡體中文或其他語言。
</language>

根據以下安全運營平台的儀表板資訊和對話歷史，生成5個相關且有洞察力的問題，這些問題應該能夠延續當前的對話脈絡並深入探討相關的安全議題。

<systemInfo>
    <agents>
        <total>${getDefaultValue(dashboardInfo.totalAgents, 0)}</total>
        <active>${getDefaultValue(dashboardInfo.activeAgents, 0)}</active>
        <mostActive>${getDefaultValue(dashboardInfo.topAgent, 'N/A')}</mostActive>
    </agents>
    <events>
        <total>${getDefaultValue(dashboardInfo.totalEvents, 0)}</total>
        <mostCommon>${getDefaultValue(dashboardInfo.topEvent, 'N/A')}</mostCommon>
        <mitreTactic>${getDefaultValue(dashboardInfo.topMitre, 'N/A')}</mitreTactic>
        <trends>${JSON.stringify(dashboardInfo.latestEventTrends || [])}</trends>
    </events>
    <distribution>
        <windows>
            <total>${getDefaultValue(dashboardInfo.agentDistribution?.windows?.total, 0)}</total>
            <active>${getDefaultValue(dashboardInfo.agentDistribution?.windows?.active, 0)}</active>
        </windows>
        <linux>
            <total>${getDefaultValue(dashboardInfo.agentDistribution?.linux?.total, 0)}</total>
            <active>${getDefaultValue(dashboardInfo.agentDistribution?.linux?.active, 0)}</active>
        </linux>
        <macos>
            <total>${getDefaultValue(dashboardInfo.agentDistribution?.macos?.total, 0)}</total>
            <active>${getDefaultValue(dashboardInfo.agentDistribution?.macos?.active, 0)}</active>
        </macos>
    </distribution>
    <recentEvents>
        ${(dashboardInfo.recentEvents || [])
            .map(
                (event) => `
        <event>
            <time>${getDefaultValue(event.time, 'N/A')}</time>
            <agent>${getDefaultValue(event.agent_name, 'N/A')}</agent>
            <description>${getDefaultValue(event.rule_description, 'N/A')}</description>
            <mitreTactic>${getDefaultValue(event.rule_mitre_tactic, 'N/A')}</mitreTactic>
            <mitreId>${getDefaultValue(event.rule_mitre_id, 'N/A')}</mitreId>
            <level>${getDefaultValue(event.rule_level, 0)}</level>
        </event>`
            )
            .join("")}
    </recentEvents>
</systemInfo>

<conversationHistory>
${conversationHistory}
</conversationHistory>

請根據上述資訊和對話歷史，生成5個問題。這些問題應該：
1. 與當前對話內容相關
2. 能夠深入探討已討論的主題
3. 引導向更深入的安全分析
4. 關注尚未被充分討論的相關面向

請使用以下格式：

<question>
    <content>問題內容</content>
    <background>簡短解釋為什麼這個問題重要</background>
    <investigation>1-2個調查這個問題的建議方向</investigation>
</question>

每個問題都應該是獨特的，且能幫助使用者更全面地理解當前的安全狀況。
`;
};
