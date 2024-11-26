import JSZip from 'jszip';
import { fetchNextAgentName } from '@/features/agent-deployment/api/fetchCountingAgent';

export async function generateScripts(group: string, stats: any, totalAgentsInput: number, pdfUrl: string) {
    const zip = new JSZip();
    const { success, next_agent_name } = await fetchNextAgentName();

    let totalAgents = 0;

    const linuxPackages = [
        { type: 'rpm_amd64', count: stats.rpm_amd64 },
        { type: 'rpm_aarch64', count: stats.rpm_aarch64 },
        { type: 'deb_amd64', count: stats.deb_amd64 },
        { type: 'deb_aarch64', count: stats.deb_aarch64 }
    ];

    linuxPackages.forEach(pkg => {
        totalAgents += pkg.count;
    });

    const windowsCount = stats.msi;
    totalAgents += windowsCount;

    const macPackages = [
        { type: 'intel', count: stats.intel },
        { type: 'apple_silicon', count: stats.apple_silicon }
    ];

    macPackages.forEach(pkg => {
        totalAgents += pkg.count;
    });

    const agentNumber = next_agent_name.split('_')[1];
    let currentIndex = parseInt(agentNumber, 10);

    linuxPackages.forEach(pkg => {
        for (let i = 1; i <= pkg.count; i++) {
            const index = String(currentIndex++).padStart(3, '0');
            const hostName = next_agent_name;
            let script = '';

            if (pkg.type === 'rpm_amd64') {
                script = `curl -o wazuh-agent-4.7.4-1.x86_64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.7.4-1.x86_64.rpm && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' rpm -ihv wazuh-agent-4.7.4-1.x86_64.rpm\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent\n\n# Modify config\nsudo sed -i 's/<address>undefined<\\/address>/<address>wazuh.aixsoar.com<\\/address>/' /var/ossec/etc/ossec.conf\nsudo systemctl restart wazuh-agent`;
                zip.file(`${hostName}_Linux_rpm_amd64.sh`, script);
            } else if (pkg.type === 'rpm_aarch64') {
                script = `curl -o wazuh-agent-4.7.4-1.aarch64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.7.4-1.aarch64.rpm && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' rpm -ihv wazuh-agent-4.7.4-1.aarch64.rpm\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent\n\n# Modify config\nsudo sed -i 's/<address>undefined<\\/address>/<address>wazuh.aixsoar.com<\\/address>/' /var/ossec/etc/ossec.conf\nsudo systemctl restart wazuh-agent`;
                zip.file(`${hostName}_Linux_rpm_aarch64.sh`, script);
            } else if (pkg.type === 'deb_amd64') {
                script = `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.4-1_amd64.deb && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' dpkg -i ./wazuh-agent_4.7.4-1_amd64.deb\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent\n\n# Modify config\nsudo sed -i 's/<address>undefined<\\/address>/<address>wazuh.aixsoar.com<\\/address>/' /var/ossec/etc/ossec.conf\nsudo systemctl restart wazuh-agent`;
                zip.file(`${hostName}_Linux_deb_amd64.sh`, script);
            } else if (pkg.type === 'deb_aarch64') {
                script = `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.4-1_arm64.deb && sudo WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' dpkg -i ./wazuh-agent_4.7.4-1_arm64.deb\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent\n\n# Modify config\nsudo sed -i 's/<address>undefined<\\/address>/<address>wazuh.aixsoar.com<\\/address>/' /var/ossec/etc/ossec.conf\nsudo systemctl restart wazuh-agent`;
                zip.file(`${hostName}_Linux_deb_aarch64.sh`, script);
            }
        }
    });

    for (let i = 1; i <= windowsCount; i++) {
        const index = String(currentIndex++).padStart(3, '0');
        const hostName = `${group}_${index}`;

        // Hotfix
        const script = `$ErrorActionPreference = 'Stop'; $identity = [Security.Principal.WindowsIdentity]::GetCurrent(); $wp = New-Object Security.Principal.WindowsPrincipal($identity); if (-Not $wp.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { $scriptPath = $MyInvocation.MyCommand.Path; Start-Process powershell -Verb runAs -ArgumentList "-ExecutionPolicy Bypass -File \`"$scriptPath\`""; exit }
try { 
   Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi -OutFile "$env:TEMP\\wazuh-agent.msi"
   msiexec.exe /i "$env:TEMP\\wazuh-agent.msi" /q WAZUH_MANAGER='wazuh.aixsoar.com' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}'
   Start-Sleep -Seconds 10
   NET START WazuhSvc
   
   # Modify config file
   $configPath = "C:\\Program Files (x86)\\ossec-agent\\ossec.conf"
   $content = Get-Content $configPath
   $content = $content -replace '<address>undefined</address>', '<address>wazuh.aixsoar.com</address>'
   Set-Content $configPath $content
   
   Restart-Service WazuhSvc
} catch { 
   Write-Host "An error occurred: $($_.Exception.Message)"
   exit 1 
} finally {
   if (Test-Path -Path "$env:TEMP\\wazuh-agent.msi") {
       Remove-Item -Path "$env:TEMP\\wazuh-agent.msi" -Force
   }
}`;
        zip.file(`${hostName}_Windows.ps1`, script);
    }

    macPackages.forEach(pkg => {
        for (let i = 1; i <= pkg.count; i++) {
            const index = String(currentIndex++).padStart(3, '0');
            const hostName = next_agent_name;
            let script = '';

            if (pkg.type === 'intel') {
                script = `curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.7.4-1.intel64.pkg && echo "WAZUH_MANAGER='wazuh.aixsoar.com' && WAZUH_AGENT_GROUP='${group}' && WAZUH_AGENT_NAME='${hostName}'" > /tmp/wazuh_envs && sudo installer -pkg ./wazuh-agent.pkg -target /\nsudo /Library/Ossec/bin/wazuh-control start\n\n# Modify config\nsudo sed -i '' 's/<address>undefined<\\/address>/<address>wazuh.aixsoar.com<\\/address>/' /Library/Ossec/etc/ossec.conf\nsudo /Library/Ossec/bin/wazuh-control restart`;
                zip.file(`${hostName}_macOS_intel.sh`, script);
            } else if (pkg.type === 'apple_silicon') {
                script = `curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.7.4-1.arm64.pkg && echo "WAZUH_MANAGER='wazuh.aixsoar.com' && WAZUH_AGENT_GROUP='${group}' && WAZUH_AGENT_NAME='${hostName}'" > /tmp/wazuh_envs && sudo installer -pkg ./wazuh-agent.pkg -target /\nsudo /Library/Ossec/bin/wazuh-control start\n\n# Modify config\nsudo sed -i '' 's/<address>undefined<\\/address>/<address>wazuh.aixsoar.com<\\/address>/' /Library/Ossec/etc/ossec.conf\nsudo /Library/Ossec/bin/wazuh-control restart`;
                zip.file(`${hostName}_macOS_apple_silicon.sh`, script);
            }
        }
    });

    const pdfResponse = await fetch(pdfUrl);
    const pdfBlob = await pdfResponse.blob();
    zip.file('Wazuh_agent安裝說明.pdf', pdfBlob);

    zip.generateAsync({ type: "blob" }).then(function (content) {
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${group}_scripts.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
}