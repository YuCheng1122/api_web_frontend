import JSZip from 'jszip'; // 確保導入 JSZip
import { hostname } from 'os';
import { fetchNextAgentName } from '@/features/agent-deployment/api/fetchCountingAgent'; // 導入 fetchNextAgentName

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
    const windowsPackages = [
        { type: 'windows11', count: stats.windows11 },
        { type: 'windows10', count: stats.windows10 },
        { type: 'windows7', count: stats.windows7 }
    ];

    windowsPackages.forEach(pkg => {
        totalAgents += pkg.count; // 計算總代理數量
    });
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
                script = `curl -o wazuh-agent-4.9.0-1.x86_64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.9.0-1.x86_64.rpm && sudo WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' rpm -ihv wazuh-agent-4.9.0-1.x86_64.rpm\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_rpm_amd64.sh`, script);
            } else if (pkg.type === 'rpm_aarch64') {
                script = `curl -o wazuh-agent-4.9.0-1.aarch64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.9.0-1.aarch64.rpm && sudo WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' rpm -ihv wazuh-agent-4.9.0-1.aarch64.rpm\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_rpm_aarch64.sh`, script);
            } else if (pkg.type === 'deb_amd64') {
                script = `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.9.0-1_amd64.deb && sudo WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' dpkg -i ./wazuh-agent_4.9.0-1_amd64.deb\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_deb_amd64.sh`, script);
            } else if (pkg.type === 'deb_aarch64') {
                script = `wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.9.0-1_arm64.deb && sudo WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' WAZUH_AGENT_GROUP='${group}' WAZUH_AGENT_NAME='${hostName}' dpkg -i ./wazuh-agent_4.9.0-1_arm64.deb\nsudo systemctl daemon-reload\nsudo systemctl enable wazuh-agent\nsudo systemctl start wazuh-agent`;
                zip.file(`${hostName}_Linux_deb_aarch64.sh`, script);
            }
        }
    });

    // Windows
    windowsPackages.forEach(pkg => {
        for (let i = 1; i <= pkg.count; i++) {
            const index = String(currentIndex++).padStart(3, '0'); // 更新 index
            const hostName = `${group}_${index}`;
            let script = '';
            let script2 = '';

            if (pkg.type === 'windows11') {
                script = `$wazuhAgentUrl = "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi"\n$agentInstallerPath = "$env:temp\\wazuh-agent.msi"\n$wazuhManager = "${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}"\n$wazuhAgentName = "${hostName}"\n$wazuhAgentGroup = "${group}"\nWrite-Host "Downloading Wazuh Agent installer..."\nInvoke-WebRequest -Uri $wazuhAgentUrl -OutFile $agentInstallerPath\nWrite-Host "Installing Wazuh Agent..."\nStart-Process -FilePath "msiexec.exe" -ArgumentList "/i $agentInstallerPath /q WAZUH_MANAGER=$wazuhManager WAZUH_AGENT_NAME=$wazuhAgentName WAZUH_AGENT_GROUP=$wazuhAgentGroup" -Wait\nWrite-Host "Starting Wazuh Agent service..."\nStart-Service -Name "WazuhSvc" -ErrorAction SilentlyContinue\n$serviceStatus = Get-Service -Name "WazuhSvc" | Select-Object -ExpandProperty Status\nif ($serviceStatus -eq "Running") {\n    Write-Host "Wazuh Agent service is running."\n} else {\n    Write-Host "Wazuh Agent service failed to start. Attempting to start manually..."\n    Start-Service -Name "WazuhSvc"\n    $serviceStatus = Get-Service -Name "WazuhSvc" | Select-Object -ExpandProperty Status\n    if ($serviceStatus -eq "Running") {\n        Write-Host "Wazuh Agent service started successfully."\n    } else {\n        Write-Host "Failed to start Wazuh Agent service. Please check logs for more details."\n    }\n}`;
                zip.file(`${hostName}_windows11.ps1`, script);
                script2 = `@echo off \necho Running Wazuh Agent installation... \nPowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0${hostName}_windows11.ps1" \necho Installation complete. Press any key to exit. \npause`
                zip.file(`${hostName}_windows11_installer.bat`, script2);
            } else if (pkg.type === 'windows10') {
                script = `$wazuhAgentUrl = "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi"\n$agentInstallerPath = "$env:temp\\wazuh-agent.msi"\n$wazuhManager = "${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}"\n$wazuhAgentName = "${hostName}"\n$wazuhAgentGroup = "${group}"\nWrite-Host "Downloading Wazuh Agent installer..."\nInvoke-WebRequest -Uri $wazuhAgentUrl -OutFile $agentInstallerPath\nWrite-Host "Installing Wazuh Agent..."\nStart-Process -FilePath "msiexec.exe" -ArgumentList "/i $agentInstallerPath /q WAZUH_MANAGER=$wazuhManager WAZUH_AGENT_NAME=$wazuhAgentName WAZUH_AGENT_GROUP=$wazuhAgentGroup" -Wait\nWrite-Host "Starting Wazuh Agent service..."\nStart-Service -Name "WazuhSvc" -ErrorAction SilentlyContinue\n$serviceStatus = Get-Service -Name "WazuhSvc" | Select-Object -ExpandProperty Status\nif ($serviceStatus -eq "Running") {\n    Write-Host "Wazuh Agent service is running."\n} else {\n    Write-Host "Wazuh Agent service failed to start. Attempting to start manually..."\n    Start-Service -Name "WazuhSvc"\n    $serviceStatus = Get-Service -Name "WazuhSvc" | Select-Object -ExpandProperty Status\n    if ($serviceStatus -eq "Running") {\n        Write-Host "Wazuh Agent service started successfully."\n    } else {\n        Write-Host "Failed to start Wazuh Agent service. Please check logs for more details."\n    }\n}`;
                zip.file(`${hostName}_windows10.ps1`, script);
                script2 = `@echo off \necho Running Wazuh Agent installation... \nPowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0${hostName}_windows10.ps1" \necho Installation complete. Press any key to exit. \npause`
                zip.file(`${hostName}_windows10_installer.bat`, script2);
            } else if (pkg.type === 'windows7') {
                script = `$wazuhAgentUrl = "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi"\n$agentInstallerPath = "$env:temp\\wazuh-agent.msi"\n$wazuhManager = "${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}"\n$wazuhAgentName = "${hostName}"\n$wazuhAgentGroup = "${group}"\nWrite-Host "Downloading Wazuh Agent installer..."\nInvoke-WebRequest -Uri $wazuhAgentUrl -OutFile $agentInstallerPath\nWrite-Host "Installing Wazuh Agent..."\nStart-Process -FilePath "msiexec.exe" -ArgumentList "/i $agentInstallerPath /q WAZUH_MANAGER=$wazuhManager WAZUH_AGENT_NAME=$wazuhAgentName WAZUH_AGENT_GROUP=$wazuhAgentGroup" -Wait\nWrite-Host "Starting Wazuh Agent service..."\nStart-Service -Name "WazuhSvc" -ErrorAction SilentlyContinue\n$serviceStatus = Get-Service -Name "WazuhSvc" | Select-Object -ExpandProperty Status\nif ($serviceStatus -eq "Running") {\n    Write-Host "Wazuh Agent service is running."\n} else {\n    Write-Host "Wazuh Agent service failed to start. Attempting to start manually..."\n    Start-Service -Name "WazuhSvc"\n    $serviceStatus = Get-Service -Name "WazuhSvc" | Select-Object -ExpandProperty Status\n    if ($serviceStatus -eq "Running") {\n        Write-Host "Wazuh Agent service started successfully."\n    } else {\n        Write-Host "Failed to start Wazuh Agent service. Please check logs for more details."\n    }\n}`;
                zip.file(`${hostName}_windows7.ps1`, script);
                script2 = `@echo off \necho Running Wazuh Agent installation... \nPowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0${hostName}_windows7.ps1" \necho Installation complete. Press any key to exit. \npause`
                zip.file(`${hostName}_windows7_installer.bat`, script2);
            }
        }
    });

    // macOS
    macPackages.forEach(pkg => {
        for (let i = 1; i <= pkg.count; i++) {
            const index = String(currentIndex++).padStart(3, '0'); // 更新 index
            const hostName = `${group}_${index}`;
            let script = '';

            if (pkg.type === 'intel') {
                script = `#!/bin/bash\n` +
                    `osascript -e 'display notification "Starting Wazuh Agent installation..." with title "Wazuh Agent Setup"'\n` +
                    `osascript -e 'display notification "Downloading Wazuh agent package..." with title "Wazuh Agent Setup"'\n` +
                    `curl -so /tmp/wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.9.0-1.intel64.pkg\n` +
                    `osascript -e 'display notification "Setting environment variables..." with title "Wazuh Agent Setup"'\n` +
                    `echo "WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' && WAZUH_AGENT_GROUP='${group}' && WAZUH_AGENT_NAME='${hostName}'" > /tmp/wazuh_envs\n` +
                    `osascript -e 'display notification "Starting Wazuh agent installation..." with title "Wazuh Agent Setup"'\n` +
                    `sudo installer -pkg /tmp/wazuh-agent.pkg -target /\n` +
                    `osascript -e 'display notification "Starting Wazuh agent service..." with title "Wazuh Agent Setup"'\n` +
                    `sudo /Library/Ossec/bin/wazuh-control start\n` +
                    `osascript -e 'display notification "Wazuh Agent installation complete!" with title "Wazuh Agent Setup"'`;
                zip.file(`${hostName}_macOS_intel.sh`, script);
            } else if (pkg.type === 'apple_silicon') {
                script = `#!/bin/bash\n` +
                    `osascript -e 'display notification "Starting Wazuh Agent installation..." with title "Wazuh Agent Setup"'\n` +
                    `osascript -e 'display notification "Downloading Wazuh agent package..." with title "Wazuh Agent Setup"'\n` +
                    `curl -so /tmp/wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.9.0-1.arm64.pkg\n` +
                    `osascript -e 'display notification "Setting environment variables..." with title "Wazuh Agent Setup"'\n` +
                    `echo "WAZUH_MANAGER='${process.env.NEXT_PUBLIC_API_BASE_DOMAIN}' && WAZUH_AGENT_GROUP='${group}' && WAZUH_AGENT_NAME='${hostName}'" > /tmp/wazuh_envs\n` +
                    `osascript -e 'display notification "Starting Wazuh agent installation..." with title "Wazuh Agent Setup"'\n` +
                    `sudo installer -pkg /tmp/wazuh-agent.pkg -target /\n` +
                    `osascript -e 'display notification "Starting Wazuh agent service..." with title "Wazuh Agent Setup"'\n` +
                    `sudo /Library/Ossec/bin/wazuh-control start\n` +
                    `osascript -e 'display notification "Wazuh Agent installation complete!" with title "Wazuh Agent Setup"'`;
                zip.file(`${hostName}_macOS_apple_silicon.sh`, script);
            }
        }
    });


    // 將 PDF 文件添加到 ZIP
    const pdfResponse = await fetch(pdfUrl); // 獲取 PDF 文件
    const pdfBlob = await pdfResponse.blob(); // 將其轉換為 Blob
    zip.file('Wazuh_agent安裝說明.pdf', pdfBlob); // 將 PDF 文件添加到 ZIP，使用指定的文件名


    // 將 PDF 文件添加到 ZIP
    windowsPackages.forEach(pkg => {
        if (pkg.type === 'windows7' && pkg.count > 0) {
            // 添加 Windows 7 的額外工具
            const windows7ToolsPath = 'public/windows7_PowershellUpdata_tools';
            const files = [
                'NDP452-KB2901907-x86-x64-AllOS-ENU.exe',
                'Win7-KB3191566-x86.msu'
            ];

            const folder = zip.folder('windows7_PowershellUpdata_tools'); // 創建資料夾

            if (folder) { // 確保 folder 不為 null
                files.forEach(file => {
                    folder.file(file, fetch(`${windows7ToolsPath}/${file}`).then(response => response.blob())); // 將檔案添加到資料夾
                });
            }
        }
    });

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
