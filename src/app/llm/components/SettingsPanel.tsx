import React from 'react';
import { IoClose } from "react-icons/io5";
import { LLMType, LLMConfig } from '../types';

interface SettingsPanelProps {
    llmConfig: LLMConfig;
    onConfigChange: (config: LLMConfig) => void;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ llmConfig, onConfigChange, onClose }) => {
    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value === 'chatgpt' ? LLMType.ChatGPT : LLMType.LocalModel;
        onConfigChange({ ...llmConfig, type: newType });
    };

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newApiKey = e.target.value;
        onConfigChange({ ...llmConfig, apiKey: newApiKey });
    };

    return (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">設定</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <IoClose size={24} />
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">模式</label>
                    <select
                        value={llmConfig.type === LLMType.ChatGPT ? 'chatgpt' : 'local'}
                        onChange={handleModeChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="chatgpt">ChatGPT</option>
                        <option value="local">Local Model</option>
                    </select>
                </div>
                {llmConfig.type === LLMType.ChatGPT && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API 金鑰</label>
                        <input
                            type="password"
                            value={llmConfig.apiKey || ''}
                            onChange={handleApiKeyChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="輸入您的 API 金鑰"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;