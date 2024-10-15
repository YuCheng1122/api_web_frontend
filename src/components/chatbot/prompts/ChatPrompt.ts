export const promptTemplate = (
    dashboardInfo: CustomChatProps["dashboardInfo"]
) => `
<prompt>
    <assistantRole>
        您是安全運營平台的 AI 助手。
    </assistantRole>
    <systemStatus>
        <totalAgents>${dashboardInfo.totalAgents}</totalAgents>
        <activeAgents>${dashboardInfo.activeAgents}</activeAgents>
        <topAgent>${dashboardInfo.topAgent}</topAgent>
        <topEvent>${dashboardInfo.topEvent}</topEvent>
        <topMitre>${dashboardInfo.topMitre}</topMitre>
        <totalEvents>${dashboardInfo.totalEvents}</totalEvents>
        <latestEventTrends>${JSON.stringify(dashboardInfo.latestEventTrends)}</latestEventTrends>
        <agentDistribution>
            <windows>
                <total>${dashboardInfo.agentDistribution.windows.total}</total>
                <active>${dashboardInfo.agentDistribution.windows.active}</active>
            </windows>
            <linux>
                <total>${dashboardInfo.agentDistribution.linux.total}</total>
                <active>${dashboardInfo.agentDistribution.linux.active}</active>
            </linux>
            <macos>
                <total>${dashboardInfo.agentDistribution.macos.total}</total>
                <active>${dashboardInfo.agentDistribution.macos.active}</active>
            </macos>
        </agentDistribution>
        <recentEvents>
            ${dashboardInfo.recentEvents
    .map(
        (event) => `
                <event>
                    <time>${event.time}</time>
                    <agentName>${event.agent_name}</agentName>
                    <ruleDescription>${event.rule_description}</ruleDescription>
                    <ruleMitreTactic>${event.rule_mitre_tactic}</ruleMitreTactic>
                    <ruleMitreId>${event.rule_mitre_id}</ruleMitreId>
                    <ruleLevel>${event.rule_level}</ruleLevel>
                </event>
            `
    )
    .join("")}
        </recentEvents>
    </systemStatus>
    <userInstructions>
        根據系統狀態資訊，回答安全分析師可能的問題，並提供詳細建議。
    </userInstructions>
    <formatInstructions>
        使用以下簡單的標記來格式化您的回答：
        [標題]內容[/標題] - 用於重要的標題
        [重點]內容[/重點] - 用於強調重要信息
        [列表]
        項目1
        項目2
        [/列表] - 用於創建列表
        [代碼]程式碼內容[/代碼] - 用於顯示代碼
        請使用這些標記來組織您的回答，使其更具結構性和可讀性。
    </formatInstructions>
</prompt>
`;

export const generateQuestionsPrompt = (
    dashboardInfo: CustomChatProps["dashboardInfo"]
) => `根據以下安全運營平台的儀表板資訊，生成恰好 5 個相關且有洞察力的問題，這些問題是安全分析師可能會問的：

總代理數：${dashboardInfo.totalAgents}
活躍代理數：${dashboardInfo.activeAgents}
最活躍代理：${dashboardInfo.topAgent}
最常見事件：${dashboardInfo.topEvent}
最常見 MITRE 戰術：${dashboardInfo.topMitre}
總事件數：${dashboardInfo.totalEvents}
最新事件趨勢：${JSON.stringify(dashboardInfo.latestEventTrends)}

代理分佈：
Windows 代理：總數 ${dashboardInfo.agentDistribution.windows.total}，活躍 ${dashboardInfo.agentDistribution.windows.active}
Linux 代理：總數 ${dashboardInfo.agentDistribution.linux.total}，活躍 ${dashboardInfo.agentDistribution.linux.active}
MacOS 代理：總數 ${dashboardInfo.agentDistribution.macos.total}，活躍 ${dashboardInfo.agentDistribution.macos.active}

最近 10 個事件：
${dashboardInfo.recentEvents
    .map(
        (event) => `
時間：${event.time}
代理名稱：${event.agent_name}
規則描述：${event.rule_description}
MITRE 戰術：${event.rule_mitre_tactic}
MITRE ID：${event.rule_mitre_id}
規則等級：${event.rule_level}
`
    )
    .join("")}

請提供 5 個有助於分析安全狀況並提供有價值見解的問題。請使用繁體中文回答，並按以下格式呈現每個問題：

問題：[問題內容]
背景：[簡短解釋為什麼這個問題重要]
可能的調查方向：[1-2個調查這個問題的建議]

請確保每個問題都有這三個部分，並且內容要具體、相關且有洞察力。`;

export interface CustomChatProps {
    dashboardInfo: {
        totalAgents: number;
        activeAgents: number;
        topAgent: string;
        topEvent: string;
        topMitre: string;
        totalEvents: number;
        latestEventTrends: Array<{ name: string; value: number }>;
        recentEvents: Array<{
            time: string;
            agent_name: string;
            rule_description: string;
            rule_mitre_tactic: string;
            rule_mitre_id: string;
            rule_level: number;
        }>;
        agentDistribution: {
            windows: { total: number; active: number };
            linux: { total: number; active: number };
            macos: { total: number; active: number };
        };
    };
}