import React, { useState, useRef, useEffect } from 'react';
import { ProficiencyLevel, ChatMessage } from '../types';
import { chatWithLuna } from '../services/geminiService';
import { PurpleCat } from '../components/PurpleCat';
import { Button } from '../components/Button';

interface ConversationProps {
  level: ProficiencyLevel;
}

export const Conversation: React.FC<ConversationProps> = ({ level }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'mascot', text: 'Ni Hao Seraphim! How are you today? 😺' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithLuna(history, userMsg.text, level);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'mascot',
      text: responseText
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const speak = (text: string) => {
    // Check if text contains Chinese characters for language selection
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = hasChinese ? 'zh-CN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-purple-100 p-4 flex items-center shadow-sm">
        <div className="w-10 h-10 mr-3">
          <PurpleCat emotion="talking" />
        </div>
        <div>
          <h2 className="font-bold text-purple-900">Chat with Luna</h2>
          <p className="text-xs text-purple-600">Online • Level: {level}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-2xl cursor-pointer transition hover:scale-[1.02] ${
                msg.sender === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-purple-50 text-gray-800 rounded-bl-none border border-purple-100'
              }`}
              onClick={() => speak(msg.text)}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-purple-50 p-4 rounded-2xl rounded-bl-none border border-purple-100">
               <span className="flex gap-1">
                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
               </span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-[80px] left-0 w-full p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            className="flex-1 bg-gray-100 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Type 'Ni Hao'..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="sm" className="rounded-full w-12 h-12 flex items-center justify-center pl-4">
            ➤
          </Button>
        </div>
      </div>
    </div>
  );
};