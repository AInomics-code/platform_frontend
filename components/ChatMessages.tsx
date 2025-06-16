import React, { useEffect, useRef } from 'react';

interface Message {
    role: 'ai' | 'human';
    content: string;
}

interface ChatMessagesProps {
    messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col gap-4 px-4">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`flex ${msg.role === 'human' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[70%] px-4 py-3 rounded-lg shadow text-base whitespace-pre-line
              ${msg.role === 'human'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'}
            `}
                    >
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatMessages; 