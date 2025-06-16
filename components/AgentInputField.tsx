'use client';

import React from 'react';
import { Paperclip, Mic, ArrowUp } from 'lucide-react';

interface AgentInputFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSend?: () => void;
    onMic?: () => void;
    className?: string;
}

const AgentInputField: React.FC<AgentInputFieldProps> = ({
    value,
    onChange,
    placeholder = 'Type something...',
    onSend,
    onMic,
    className = '',
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSend) {
            onSend();
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`w-full flex items-center bg-transparent border-2 border-gray-700 rounded-lg px-2 py-2 mx-4 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-gray-800 placeholder-gray-400 text-lg resize-none"
            />
            <div className="flex items-center gap-1 ml-2">
                <button
                    type="button"
                    onClick={handleAttachClick}
                    className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                >
                    <Paperclip size={22} />
                </button>
                <button
                    type="button"
                    onClick={onMic}
                    className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                >
                    <Mic size={22} />
                </button>
                <button
                    type="button"
                    onClick={onSend}
                    className={`p-2 rounded-md focus:outline-none ${value ? 'text-white bg-pink-500 hover:bg-pink-600 cursor-pointer' : 'text-gray-400 bg-gray-200 cursor-not-allowed'}`}
                    disabled={!value}
                >
                    <ArrowUp size={22} />
                </button>
            </div>
        </div>
    );
};

export default AgentInputField;
