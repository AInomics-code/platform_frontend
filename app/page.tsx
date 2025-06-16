'use client';

import ChatMessages from "@/components/ChatMessages";
import AgentInputField from "@/components/AgentInputField";
import Vortex from "@/components/Vortex";
import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Message {
  role: 'ai' | 'human';
  content: string;
}

interface BackendResponse {
  response: string;
  context_id: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextId, setContextId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSpeechError(null);
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechError('El reconocimiento de voz no es soportado en este navegador. Usa Chrome o Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      const userLang = 'es-ES';//navigator.language || 'es-ES';
      recognitionRef.current.lang = userLang;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = false;
    }

    const recognition = recognitionRef.current;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputValue(finalTranscript + interimTranscript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'denied') {
        setSpeechError('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en tu navegador.');
      } else {
        setSpeechError('Error en el reconocimiento de voz: ' + event.error);
      }
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        setSpeechError('No se pudo iniciar el reconocimiento de voz.');
        setIsListening(false);
      }
    } else {
      recognition.stop();
    }

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.stop();
    };
  }, [isListening]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    setMessages(prev => [
      ...prev,
      { role: 'human', content: inputValue }
    ]);

    const userMessage = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare request payload
      const payload = {
        query: userMessage,
        ...(contextId && { context_id: contextId })
      };

      // Send message to backend
      const response = await axiosInstance.post<BackendResponse>('/api/v1/agent', payload);

      // Store the context_id
      setContextId(response.data.context_id);

      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: 'Lo siento, hubo un error al procesar tu mensaje.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="flex flex-col h-full w-full flex-1">
        <main className={`flex flex-col items-center flex-1 relative w-full h-full ${hasMessages ? 'justify-end' : 'justify-center'}`}>
          <div className="w-full h-full flex flex-col flex-1 bg-white rounded-none shadow px-2 md:px-8">
            {speechError && (
              <div className="text-red-600 text-center py-2 font-semibold">{speechError}</div>
            )}
            {hasMessages ? (
              <div className="flex flex-col flex-1 py-6 h-full">
                <div className="flex-1 overflow-y-auto max-h-full px-2">
                  <ChatMessages messages={messages} />
                </div>
                <AgentInputField
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                  isLoading={isLoading}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center h-full relative">
                <div className="flex flex-col items-center space-y-8 w-full px-2 md:px-8">
                  <Vortex />
                  <AgentInputField
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    isLoading={isLoading}
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
