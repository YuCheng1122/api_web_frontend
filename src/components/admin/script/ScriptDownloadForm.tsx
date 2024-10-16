import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateScripts } from './Script'; // 根據實際路徑調整
import { getTotalAgentsAndLicense } from '../../../utils/admin/TotalLicenseAgent';

// context
import { useAuthContext } from '@/contexts/AuthContext'

const ScriptDownloadForm = ({ className }: { className?: string }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        linux: { rpm_amd64: false, rpm_aarch64: false, deb_amd64: false, deb_aarch64: false },
        windows: { msi: false },
        macos: { intel: false, apple_silicon: false },
        quantities: { rpm_amd64: 0, rpm_aarch64: 0, deb_amd64: 0, deb_aarch64: 0, msi: 0, intel: 0, apple_silicon: 0 },
    });

    const [agentNames, setAgentNames] = useState<string[]>([]);
    const { isLogin, username, updateLoginState } = useAuthContext();
    const [remainingAgents, setRemainingAgents] = useState<number>(0); // 初始狀態設為 0
    const pdfUrl = '/Wazuh_agent安裝說明.pdf'; // 使用相對 URL

    useEffect(() => {
        const fetchTotalAgents = async () => {
            try {
                const response = await getTotalAgentsAndLicense();
                setRemainingAgents(response.total_license - response.total_agents); // 設置 remainingAgents 為 response.total_agents
            } catch (error: any) {
                console.error('Error during fetching total agents and license:', error);
                const message = error.response?.data?.message || 'Failed to fetch total agents and license';
                alert(message); // 顯示錯誤消息
            }
        };

        fetchTotalAgents(); // 
        // 每次進入頁面時顯示彈窗提示，但只需確認一次
        const hasConfirmedAlert = sessionStorage.getItem('hasConfirmedAlert');
        if (!hasConfirmedAlert) {
            alert(`1. 請依照作業系統點選所需要的版本\n2. 點選作業系統後，請在方框中填寫所需的數量\n3. 壓縮檔附有安裝說明`);
            sessionStorage.setItem('hasConfirmedAlert', 'true'); // 設置標記，表示已確認過提示
        }

        // 這裡可以根據需要的條件來重置標記
        const resetAlertCondition = true; // 這裡替換為你的條件
        if (resetAlertCondition) {
            sessionStorage.removeItem('hasConfirmedAlert'); // 移除標記以便下次顯示提示
        }
    }, []); // 只在組件掛載時執行一次

    // 計算所有選中的輸入框數量總和並生成 Agent 名稱
    useEffect(() => {
        const { linux, windows, macos, quantities } = formData;

        // 根據核取方塊是否選中來計算對應數量的總和
        const totalAgents = (linux.rpm_amd64 ? quantities.rpm_amd64 : 0) +
            (linux.rpm_aarch64 ? quantities.rpm_aarch64 : 0) +
            (linux.deb_amd64 ? quantities.deb_amd64 : 0) +
            (linux.deb_aarch64 ? quantities.deb_aarch64 : 0) +
            (windows.msi ? quantities.msi : 0) +
            (macos.intel ? quantities.intel : 0) +
            (macos.apple_silicon ? quantities.apple_silicon : 0);

        // 只有當 totalAgents 大於 0 時才生成 Agent
        if (totalAgents > 0) {
            const agents = Array.from({ length: totalAgents }, (_, index) =>
                `${username}-${String(index + 1).padStart(3, '0')}`
            );
            setAgentNames(agents);
        } else {
            setAgentNames([]);  // 預設為空陣列
        }
    }, [formData]);

    const handleCheckboxChange = (os: string, arch: string) => {
        const isChecked = !formData[os][arch];
        const newQuantities = { ...formData.quantities };

        // 如果取消勾選，將數量加回 remainingAgents
        if (!isChecked) {
            setRemainingAgents(remainingAgents + newQuantities[arch]);
            newQuantities[arch] = 0; // 將數量設為 0
        }

        // 只有在 remainingAgents 大於 0 時才允許勾選
        if (isChecked && remainingAgents === 0) {
            alert('無法勾選，剩餘代理數量為 0');
            return; // 直接返回，不更新
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [os]: { ...prevFormData[os], [arch]: isChecked },
            quantities: newQuantities,
        }));
    };

    const handleQuantityChange = (arch: string, value: string) => {
        const newQuantity = Number(value);
        // 檢查 remainingAgents 是否為 0，並且新數量大於當前數量
        if (remainingAgents === 0 && newQuantity > formData.quantities[arch]) {
            alert('無法增加代理數量，剩餘代理數量為 0');
            return; // 直接返回，不更新
        }

        setFormData((prevFormData) => {
            const newQuantities: { [key: string]: number } = { ...prevFormData.quantities, [arch]: newQuantity }; // 明確指定類型
            const totalAgents = Object.values(newQuantities).reduce((acc: number, count) => acc + (count as number), 0); // 明確指定 acc 的類型
            const previousTotalAgents = Object.values(prevFormData.quantities).reduce((acc: number, count) => acc + (count as number), 0); // 明確指定 acc 的類型
            setRemainingAgents(remainingAgents - (totalAgents - previousTotalAgents)); // 更新 remainingAgents
            return {
                ...prevFormData,
                quantities: newQuantities,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {  // 將這行改為 async
        e.preventDefault();

        // 計算各個操作系統的數量
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

        // 計算總代理數量
        const totalAgents = Object.values(stats).reduce((acc, count) => acc + count, 0);
        try {
            const response = await getTotalAgentsAndLicense();
            if (response.total_license - response.total_agents >= Number(totalAgents)) {
                generateScripts(username, stats, totalAgents, pdfUrl); // 呼叫生成腳本函數，傳遞各個操作系統的代理數量和 PDF URL
            } else {
                alert('代理數量驗證失敗');
            }
        } catch (error: any) {
            console.error('Error during fetching total agents and license:', error);
            const message = error.response?.data?.message || 'Failed to fetch total agents and license';
            alert(message); // 顯示錯誤消息
        }
    };

    return (
        <div className="bg-white rounded-lg flex flex-col items-center min-h-screen bg-gray-100 p-6 w-[54vw] ">
            {/* 主介面部分 */}
            <div className="bg-white rounded-lg p-6 w-full max-w-7xl mb-6 border border-gray-300"> {/*shadow-md 可添加陰影*/}
                <h2 className="text-lg font-bold mb-4">軟體下載</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    {/* 顯示剩下代理數量 */}
                    <div className="flex justify-between items-center"> {/* 新增 flex 以便排列 */}
                        <h3>剩下的下載代理數量: {remainingAgents}</h3> {/* 顯示剩下的 agents 數 */}
                    </div>
                    {/* Linux 部分 */}
                    <div className="border p-4 rounded-lg">
                        <h3 className="text-md font-bold mb-2 flex items-center">
                            {/* 使用 Image 替換原來的表情符號 */}
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
                                    value={formData.linux.rpm_amd64 ? formData.quantities.rpm_amd64 : ''}  // 只有核取方塊被選中時顯示數字
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
                                    value={formData.linux.rpm_aarch64 ? formData.quantities.rpm_aarch64 : ''}  // 只有核取方塊被選中時顯示數字
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
                                    value={formData.linux.deb_amd64 ? formData.quantities.deb_amd64 : ''}  // 只有核取方塊被選中時顯示數字
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
                                    value={formData.linux.deb_aarch64 ? formData.quantities.deb_aarch64 : ''}  // 只有核取方塊被選中時顯示數字
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
                            {/* 使用 Image 替換原來的表情符號 */}
                            <Image src="/windows-logo.png" alt="Linux" width={20} height={20} className="mr-2" />
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
                                value={formData.windows.msi ? formData.quantities.msi : ''}  // 只有核取方塊被選中時顯示數字
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
                            {/* 使用 Image 替換原來的表情符號 */}
                            <Image src="/mac-logo.png" alt="Linux" width={20} height={20} className="mr-2" />
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
                                    value={formData.macos.intel ? formData.quantities.intel : ''}  // 只有核取方塊被選中時顯示數字
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
                                    value={formData.macos.apple_silicon ? formData.quantities.apple_silicon : ''}  // 只有核取方塊被選中時顯示數字
                                    onChange={(e) => handleQuantityChange('apple_silicon', e.target.value)}
                                    className="ml-4 w-16 border rounded p-1"
                                    min="1"
                                    placeholder="0"
                                    disabled={!formData.macos.apple_silicon}
                                />
                            </label>
                        </div>
                    </div>

                    {/* 生成腳本按鈕 */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        下載
                    </button>
                </form>
            </div>

            {/* Agent 命名列表 */}
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

export default ScriptDownloadForm;