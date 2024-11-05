import JSZip from 'jszip'; // 確保導入 JSZip
import { hostname } from 'os';
import { fetchNextAgentName } from '../../../utils/admin/fetchCountingAgent'; // 導入 fetchNextAgentName

export async function generateScripts(group: string, stats: any, totalAgentsInput: number, pdfUrl: string) {
    const zip = new JSZip(); // 使用 JSZip 來創建 ZIP 文件
    const { success, next_agent_name } = await fetchNextAgentName();
    console.log("Fetched Agent Name:", { success, next_agent_name });

    let totalAgents = 0; // 將變數名稱改為 totalAgentsInput

    // Linux
    const linuxPackages = [
        { type: 'rpm_amd64', count: stats.rpm_amd64 },
        { type: 'rpm_aarch64', count: stats.rpm_aarch64 },
        { type: 'deb_amd64', count: stats.deb_amd64 },
        { type: 'deb_aarch64', count: stats.deb_aarch64 }
    ];

    linuxPackages.forEach(pkg => {
        totalAgents += pkg.count; // 計算總代理數量
    });

    // Windows
    const windowsCount = stats.msi;
    totalAgents += windowsCount;

    // macOS
    const macPackages = [
        { type: 'intel', count: stats.intel },
        { type: 'apple_silicon', count: stats.apple_silicon }
    ];

    macPackages.forEach(pkg => {
        totalAgents += pkg.count; // 計算總代理數量
    });

    // 提取編號部分
    const agentNumber = next_agent_name.split('_')[1]; // 使用 '_' 分割字串並獲取第二部分
    let currentIndex = parseInt(agentNumber, 10); // 將編號轉換為整數

    // Linux
    linuxPackages.forEach(pkg => {
        for (let i = 1; i <= pkg.count; i++) {
            const index = String(currentIndex++).padStart(3, '0'); // 更新 index
            const hostName = `${group}_${index}`;
            let script = '';

            // 根據 pkg.type 生成相應的腳本
            if (pkg.type === 'rpm_amd64') {
                script = `curl -o wazuh-agent-4.7.4-1.x86_64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.7.4-1.x86_64.rpm && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' rpm -ihv wazuh-agent-4.7.4-1.x86_64.rpm\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_rpm_amd64.sh`, script);
            } else if (pkg.type === 'rpm_aarch64') {
                script = `curl -o wazuh-agent-4.7.4-1.aarch64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.7.4-1.aarch64.rpm && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' rpm -ihv wazuh-agent-4.7.4-1.aarch64.rpm\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_rpm_aarch64.sh`, script);
            } else if (pkg.type === 'deb_amd64') {
                script = `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.4-1_amd64.deb && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' dpkg -i ./wazuh-agent_4.7.4-1_amd64.deb\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_deb_amd64.sh`, script);
            } else if (pkg.type === 'deb_aarch64') {
                script = `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.4-1_arm64.deb && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' dpkg -i ./wazuh-agent_4.7.4-1_arm64.deb\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_deb_aarch64.sh`, script);
            }
        }
    });

    // Windows
    for (let i = 1; i <= windowsCount; i++) {
        const index = String(currentIndex++).padStart(3, '0'); // 更新 index
        const hostName = `${group}_${index}`;
        const script = `$ErrorActionPreference = 'Stop'; \$identity = [Security.Principal.WindowsIdentity]::GetCurrent(); \$wp = New-Object Security.Principal.WindowsPrincipal(\$identity); if (-Not \$wp.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { \$scriptPath = \$MyInvocation.MyCommand.Path; Start-Process powershell -Verb runAs -ArgumentList "-ExecutionPolicy Bypass -File \`"\$scriptPath\`""; exit }\n\$wazuhManager = '${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}'; \$agentGroup = '${group}'; \$agentName = '${hostName}'\ntry { Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi -OutFile "\$env:TEMP\\wazuh-agent.msi"\nmsiexec.exe /i "\$env:TEMP\\wazuh-agent.msi" /q WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}'\nWrite-Host "Wazuh Agent installation completed."\nWrite-Host "Waiting 10 second."\nStart-Sleep -Seconds 10\nWrite-Host "Starting Wazuh Agent service..."\nNET START WazuhSvc\nWrite-Host "Wazuh Agent service started successfully." } catch { Write-Host "An error occurred: \$($_.Exception.Message)"; exit 1 } finally { if (Test-Path -Path "\$env:TEMP\\wazuh-agent.msi") { Remove-Item -Path "\$env:TEMP\\wazuh-agent.msi" -Force; Write-Host "Downloaded installation file deleted." } }`;
        zip.file(`${hostName}_Windows.ps1`, script);
    }

    // macOS
    macPackages.forEach(pkg => {
        for (let i = 1; i <= pkg.count; i++) {
            const index = String(currentIndex++).padStart(3, '0'); // 更新 index
            const hostName = `${group}_${index}`;
            let script = '';

            if (pkg.type === 'intel') {
                script = `curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.7.4-1.intel64.pkg && echo "WAZUH_MANAGER='wazuh.aixsoar.com' && WAZUH_AGENT_GROUP='${group}' && WAZUH_AGENT_NAME='${hostName}'" > /tmp/wazuh_envs && sudo installer -pkg ./wazuh-agent.pkg -target /\nsudo /Library/Ossec/bin/wazuh-control start`;
                zip.file(`${hostName}_macOS_intel.sh`, script);
            } else if (pkg.type === 'apple_silicon') {
                script = `curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.7.4-1.arm64.pkg && echo "WAZUH_MANAGER='wazuh.aixsoar.com' && WAZUH_AGENT_GROUP='${group}' && WAZUH_AGENT_NAME='${hostName}'" > /tmp/wazuh_envs && sudo installer -pkg ./wazuh-agent.pkg -target /\nsudo /Library/Ossec/bin/wazuh-control start`;
                zip.file(`${hostName}_macOS_apple_silicon.sh`, script);
            }
        }
    });

    // 將 PDF 文件添加到 ZIP
    const pdfResponse = await fetch(pdfUrl); // 獲取 PDF 文件
    const pdfBlob = await pdfResponse.blob(); // 將其轉換為 Blob
    zip.file('Wazuh_agent安裝說明.pdf', pdfBlob); // 將 PDF 文件添加到 ZIP，使用指定的文件名

    // 生成 ZIP 文件
    zip.generateAsync({ type: "blob" }).then(function (content) {
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${group}_scripts.zip`; // 設定 ZIP 文件名
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
}
