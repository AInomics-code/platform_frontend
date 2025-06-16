'use client';

import ChatMessages from "@/components/ChatMessages";
import AgentInputField from "@/components/AgentInputField";
import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ role: 'ai' | 'human'; content: string }[]>([]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [
      ...prev,
      { role: 'human', content: inputValue }
    ]);
    setInputValue("");
    // Simular respuesta AI
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: 'Esta es una respuesta automática de la AI.' }
      ]);
    }, 800);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex flex-col h-full">
        <main className={`flex flex-col items-center flex-1 relative w-full ${hasMessages ? 'justify-end' : 'justify-center'}`} style={{ height: '100%' }}>
          <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 h-full">
            {hasMessages ? (
              <div className="flex flex-col flex-1 py-6 h-full">
                <div className="flex-1 overflow-y-auto max-h-full">
                  <ChatMessages messages={messages} />
                </div>
                <AgentInputField
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center h-full">
                <AgentInputField
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
