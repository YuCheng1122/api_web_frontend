'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateScripts } from '@/features/agent-deployment/Script';
import { getTotalAgentsAndLicense } from '@/features/agent-deployment/api/totalLicenseAgent';
import { fetchNextAgentName } from '@/features/agent-deployment/api/fetchCountingAgent';
import { useAuthContext } from '@/features/auth/contexts/AuthContext';

const AgentDownloadForm = ({ className }: { className?: string }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        linux: { rpm_amd64: false, rpm_aarch64: false, deb_amd64: false, deb_aarch64: false },
        windows: { msi: false },
        macos: { intel: false, apple_silicon: false },
        quantities: { rpm_amd64: 1, rpm_aarch64: 1, deb_amd64: 1, deb_aarch64: 1, msi: 1, intel: 1, apple_silicon: 1 },
    });

    const [agentNames, setAgentNames] = useState<string[]>([]);
    const [nextAgentName, setNextAgentName] = useState<string | null>(null);
    const { isLogin, username, updateLoginState } = useAuthContext();
    const [remainingAgents, setRemainingAgents] = useState<number>(0);
    const pdfUrl = '/Wazuh_agent安裝說明.pdf';

    useEffect(() => {
        const fetchTotalAgents = async () => {
            try {
                const response = await getTotalAgentsAndLicense();
                setRemainingAgents(response.total_license - response.total_agents);
            } catch (error: any) {
                console.error('Error during fetching total agents and license:', error);
                const message = error.response?.data?.message || 'Failed to fetch total agents and license';
                alert(message);
            }
        };

        fetchTotalAgents();
    }, []);

    useEffect(() => {
        const fetchAgentName = async () => {
            const { success, next_agent_name } = await fetchNextAgentName();
            if (success) {
                setAgentNames([next_agent_name]);
                setNextAgentName(next_agent_name);
            }
        };
        fetchAgentName();
    }, []);

    useEffect(() => {
        const { linux, windows, macos, quantities } = formData;

        const totalAgents = (linux.rpm_amd64 ? quantities.rpm_amd64 : 0) +
            (linux.rpm_aarch64 ? quantities.rpm_aarch64 : 0) +
            (linux.deb_amd64 ? quantities.deb_amd64 : 0) +
            (linux.deb_aarch64 ? quantities.deb_aarch64 : 0) +
            (windows.msi ? quantities.msi : 0) +
            (macos.intel ? quantities.intel : 0) +
            (macos.apple_silicon ? quantities.apple_silicon : 0);

        if (totalAgents > 0) {
            const agents = Array.from({ length: totalAgents }, (_, index) =>
                `${username}_${String(index + 1).padStart(3, '0')}`
            );
            setAgentNames((prev) => [prev[0], ...agents]);
        } else {
            setAgentNames([]);
        }
    }, [formData, username]);

    const handleCheckboxChange = (os: string, arch: string) => {
        const isChecked = !formData[os][arch];
        const newQuantities = { ...formData.quantities };

        if (!isChecked) {
            setRemainingAgents(remainingAgents + newQuantities[arch]);
            newQuantities[arch] = 0;
        }

        if (isChecked && remainingAgents === 0) {
            alert('無法勾選，剩餘代理數量為 0');
            return;
        }

        if (isChecked) {
            setRemainingAgents(remainingAgents - 1);
        } else {
            setRemainingAgents(remainingAgents + newQuantities[arch]);
            newQuantities[arch] = 1;
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [os]: { ...prevFormData[os], [arch]: isChecked },
            quantities: newQuantities,
        }));
    };

    const handleQuantityChange = (arch: string, value: string) => {
        const newQuantity = Number(value);
        if (remainingAgents === 0 && newQuantity > formData.quantities[arch]) {
            alert('無法增加代理數量，剩餘代理數量為 0');
            return;
        }

        setFormData((prevFormData) => {
            const newQuantities: { [key: string]: number } = { ...prevFormData.quantities, [arch]: newQuantity };
            const totalAgents = Object.values(newQuantities).reduce((acc: number, count) => acc + (count as number), 0);
            const previousTotalAgents = Object.values(prevFormData.quantities).reduce((acc: number, count) => acc + (count as number), 0);
            setRemainingAgents(remainingAgents - (totalAgents - previousTotalAgents));
            return {
                ...prevFormData,
                quantities: newQuantities,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { linux, windows, macos, quantities } = formData;
        const stats = {
            rpm_amd64: linux.rpm_amd64 ? quantities.rpm_amd64 : 0,
            rpm_aarch64: linux.rpm_aarch64 ? quantities.rpm_aarch64 : 0,
            deb_amd64: linux.deb_amd64 ? quantities.deb_amd64 : 0,
            deb_aarch64: linux.deb_aarch64 ? quantities.deb_aarch64 : 0,
            msi: windows.msi ? quantities.msi : 0,
            intel: macos.intel ? quantities.intel : 0,
            apple_silicon: macos.apple_silicon ? quantities.apple_silicon : 0,
        };

        const totalAgents = Object.values(stats).reduce((acc, count) => acc + count, 0);
        try {
            const response = await getTotalAgentsAndLicense();
            if (response.total_license - response.total_agents >= Number(totalAgents)) {
                generateScripts(username, stats, totalAgents, pdfUrl);
            } else {
                alert('代理數量驗證失敗');
            }
        } catch (error: any) {
            console.error('Error during fetching total agents and license:', error);
            const message = error.response?.data?.message || 'Failed to fetch total agents and license';
            alert(message);
        }
    };

    const agentNumber = nextAgentName?.split('_')[1];
    let currentIndex = agentNumber ? parseInt(agentNumber, 10) : 0;

    const agentNamesList = agentNames.map((_, index) => {
        return `${username}-${String(currentIndex + index).padStart(3, '0')}`;
    });

    return (
        <div className="bg-white rounded-lg flex flex-col items-center min-h-screen bg-gray-100 p-6 w-[54vw]">
            <div className="bg-white rounded-lg p-6 w-full max-w-7xl mb-6 border border-gray-300">
                <h2 className="text-lg font-bold mb-4">軟體下載</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                        <h3>剩下的下載代理數量: {remainingAgents}</h3>
                    </div>

                    {/* Linux 部分 */}
                    <div className="border p-4 rounded-lg">
                        <h3 className="text-md font-bold mb-2 flex items-center">
                            <Image src="/linux-logo.png" alt="Linux" width={20} height={20} className="mr-2" />
                            Linux
                        </h3>
                        <div className="flex flex-wrap">
                            <div className="flex items-center space-x-4 mb-4 w-1/2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.linux.rpm_amd64}
                                        onChange={() => handleCheckboxChange('linux', 'rpm_amd64')}
                                        className="custom-checkbox"
                                    />
                                    <span className="ml-2">RPM amd64</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.linux.rpm_amd64 ? formData.quantities.rpm_amd64 : ''}
                                    onChange={(e) => handleQuantityChange('rpm_amd64', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.linux.rpm_amd64}
                                />
                            </div>

                            <div className="flex items-center space-x-4 mb-4 w-1/2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.linux.rpm_aarch64}
                                        onChange={() => handleCheckboxChange('linux', 'rpm_aarch64')}
                                        className="custom-checkbox"
                                    />
                                    <span className="ml-2">RPM aarch64</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.linux.rpm_aarch64 ? formData.quantities.rpm_aarch64 : ''}
                                    onChange={(e) => handleQuantityChange('rpm_aarch64', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.linux.rpm_aarch64}
                                />
                            </div>

                            <div className="flex items-center space-x-4 mb-4 w-1/2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.linux.deb_amd64}
                                        onChange={() => handleCheckboxChange('linux', 'deb_amd64')}
                                        className="custom-checkbox"
                                    />
                                    <span className="ml-2">DEB amd64</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.linux.deb_amd64 ? formData.quantities.deb_amd64 : ''}
                                    onChange={(e) => handleQuantityChange('deb_amd64', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.linux.deb_amd64}
                                />
                            </div>

                            <div className="flex items-center space-x-4 mb-4 w-1/2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.linux.deb_aarch64}
                                        onChange={() => handleCheckboxChange('linux', 'deb_aarch64')}
                                        className="custom-checkbox"
                                    />
                                    <span className="ml-2">DEB aarch64</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.linux.deb_aarch64 ? formData.quantities.deb_aarch64 : ''}
                                    onChange={(e) => handleQuantityChange('deb_aarch64', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.linux.deb_aarch64}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Windows 部分 */}
                    <div className="border p-4 rounded-lg">
                        <h3 className="text-md font-bold mb-2 flex items-center">
                            <Image src="/windows-logo.png" alt="Windows" width={20} height={20} className="mr-2" />
                            Windows
                        </h3>
                        <div className="flex space-x-6 items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.windows.msi}
                                    onChange={() => handleCheckboxChange('windows', 'msi')}
                                    className="custom-checkbox"
                                />
                                <span className="ml-2">MSI 32/64 bits</span>
                            </label>
                            <input
                                type="number"
                                value={formData.windows.msi ? formData.quantities.msi : ''}
                                onChange={(e) => handleQuantityChange('msi', e.target.value)}
                                className="ml-4 w-16 border rounded p-1"
                                min="1"
                                placeholder="0"
                                disabled={!formData.windows.msi}
                            />
                        </div>
                    </div>

                    {/* macOS 部分 */}
                    <div className="border p-4 rounded-lg">
                        <h3 className="text-md font-bold mb-2 flex items-center">
                            <Image src="/mac-logo.png" alt="macOS" width={20} height={20} className="mr-2" />
                            macOS
                        </h3>
                        <div className="flex space-x-6 items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.macos.intel}
                                    onChange={() => handleCheckboxChange('macos', 'intel')}
                                    className="custom-checkbox"
                                />
                                <span className="ml-2">Intel</span>
                                <input
                                    type="number"
                                    value={formData.macos.intel ? formData.quantities.intel : ''}
                                    onChange={(e) => handleQuantityChange('intel', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.macos.intel}
                                />
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.macos.apple_silicon}
                                    onChange={() => handleCheckboxChange('macos', 'apple_silicon')}
                                    className="custom-checkbox"
                                />
                                <span className="ml-2">Apple silicon</span>
                                <input
                                    type="number"
                                    value={formData.macos.apple_silicon ? formData.quantities.apple_silicon : ''}
                                    onChange={(e) => handleQuantityChange('apple_silicon', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.macos.apple_silicon}
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        下載<br />
                        windows 11 請執行&quot;Set-ExecutionPolicy Bypass -Scope Process&quot;<br />
                        詳情請檢視安裝說明
                    </button>
                </form>
            </div>

            <div className="bg-white p-4 rounded-lg w-full w-[54vw] max-w-7xl border border-gray-300">
                <h3 className="text-lg font-bold mb-4">代理名稱：</h3>
                <ul className="text-sm grid grid-cols-4 gap-4">
                    {agentNames.map((name, index) => (
                        <li key={index} className="mb-2">
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AgentDownloadForm;
