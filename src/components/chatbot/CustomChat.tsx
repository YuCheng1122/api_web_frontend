import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { sendStreamingMessage } from "@/services/chatService";
import {CustomChatProps, promptTemplate} from "@/components/chatbot/prompts/ChatPrompt";

interface Message {
    text: string;
    isUser: boolean;
}

interface CustomChatComponentProps {
    dashboardInfo: CustomChatProps["dashboardInfo"];
    selectedQuestion: string | null;
    setSelectedQuestion: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomChat: React.FC<CustomChatComponentProps> = ({
                                                            dashboardInfo,
                                                            selectedQuestion,
                                                            setSelectedQuestion,
                                                        }) => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "您好！👋 我是您的 SenseX 資安助手。隨時為您提供專業的資安情報與協助。\n" +
                "\n" +
                "我可以為您:\n" +
                "- 分析近期資安趨勢\n" +
                "- 提供最新威脅情報\n" +
                "- 解答資安相關疑問\n" +
                "- 協助制定資安策略\n" +
                "\n" +
                "有任何資安相關問題，請隨時詢問。讓我們一同守護您的數位安全！", isUser: false },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedQuestion) {
            handleSendMessage(selectedQuestion);
            setSelectedQuestion(null);
        }
    }, [selectedQuestion]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatMessage = (text: string) => {
        const parts = text.split(
            /(\[標題\].*?\[\/標題\]|\[重點\].*?\[\/重點\]|\[列表\][\s\S]*?\[\/列表\]|\[代碼\][\s\S]*?\[\/代碼\])/
        );
        return parts.map((part, index) => {
            if (part.startsWith("[標題]")) {
                return (
                    <h3 key={index} className="text-xl font-bold my-3">
                        {part.replace(/\[標題\](.*?)\[\/標題\]/, "$1")}
                    </h3>
                );
            } else if (part.startsWith("[重點]")) {
                return (
                    <span key={index} className="font-semibold text-blue-600">
            {part.replace(/\[重點\](.*?)\[\/重點\]/, "$1")}
          </span>
                );
            } else if (part.startsWith("[列表]")) {
                const items = part
                    .replace(/\[列表\]([\s\S]*?)\[\/列表\]/, "$1")
                    .split("\n")
                    .filter((item) => item.trim() !== "");
                return (
                    <ul key={index} className="list-disc pl-5 my-3">
                        {items.map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                );
            } else if (part.startsWith("[代碼]")) {
                return (
                    <pre
                        key={index}
                        className="bg-gray-100 p-3 rounded my-3 overflow-x-auto"
                    >
            <code>{part.replace(/\[代碼\]([\s\S]*?)\[\/代碼\]/, "$1")}</code>
          </pre>
                );
            } else {
                return part.split("\n").map((line, i) => (
                    <p key={`${index}-${i}`} className="my-2">
                        {line}
                    </p>
                ));
            }
        });
    };

    const handleSendMessage = async (message: string) => {
        if (message.trim() === "" || isLoading) return;

        const newUserMessage = { text: message, isUser: true };
        setMessages((prev) => [...prev, newUserMessage]);
        setInputMessage("");
        setIsLoading(true);
        setStreamingMessage("");

        const context = promptTemplate(dashboardInfo);

        try {
            let fullResponse = "";
            await sendStreamingMessage(message, context, messages, (chunk) => {
                fullResponse += chunk;
                setStreamingMessage((prev) => prev + chunk);
            });

            const newAssistantMessage = { text: fullResponse, isUser: false };
            setMessages((prev) => [...prev, newAssistantMessage]);
        } catch (error) {
            console.error("獲取回應時發生錯誤:", error);
            setMessages((prev) => [
                ...prev,
                { text: "抱歉，我在處理您的請求時遇到了問題。請稍後再試。", isUser: false },
            ]);
        } finally {
            setIsLoading(false);
            setStreamingMessage("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`${message.isUser ? "text-right" : "text-left"}`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${
                                message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                            }`}
                        >
                            {message.isUser ? <p>{message.text}</p> : formatMessage(message.text)}
                        </div>
                    </div>
                ))}
                {streamingMessage && (
                    <div className="text-left">
                        <div className="inline-block p-3 rounded-lg bg-gray-200 text-black">
                            {formatMessage(streamingMessage)}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                        placeholder="在此輸入您的訊息..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSendMessage(inputMessage)}
                        className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
                {isLoading && <p className="text-sm text-gray-500 mt-2">AI 正在思考中...</p>}
            </div>
        </div>
    );
};

export default CustomChat;