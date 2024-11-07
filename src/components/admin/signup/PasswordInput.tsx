import React, { useState } from 'react';
// import eye icon from lacide-react
import { Eye } from 'lucide-react';

interface PasswordInputProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const { handleChange } = props;

    const [password, setPassword] = useState<string>('');
    const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
    const [passwordScore, setPasswordScore] = useState<number>(0);

    const checkStrength = () => {
        // 更精確的密碼強度檢查邏輯
        let score = 0;
        if (password.length > 8) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^A-Za-z0-9]/)) score++;
        setPasswordScore(score);
    };

    return (
        <>
            <div className="relative mb-2">
                <input
                    type={showPasswordField ? 'text' : 'password'}
                    id="password"
                    value={password}
                    name="password"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value);
                        checkStrength();
                        handleChange(e);
                    }}
                    className="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Password"
                />
                <button
                    className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-indigo-500 transition-colors"
                    onClick={() => setShowPasswordField(!showPasswordField)}
                >
                    <Eye />

                </button>
            </div>

            <div className="flex -mx-1">
                {[...Array(3)].map((_, i) => (
                    <div className="w-1/5 px-1" key={i}>
                        <div
                            className={`h-2 rounded-xl transition-colors ${i < passwordScore
                                ? passwordScore <= 1
                                    ? 'bg-red-400'
                                    : passwordScore <= 2
                                        ? 'bg-yellow-400'
                                        : passwordScore <= 3
                                            ? 'bg-blue-400'
                                            : 'bg-blue-400'
                                : 'bg-gray-200'
                                }`}
                        />
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500">Password Strength: {passwordScore <= 1 ? 'Weak' : passwordScore <= 2 ? 'Medium' : passwordScore <= 3 ? 'Strong' : 'Very Strong'}</p>
        </>
    );
};

export default PasswordInput;