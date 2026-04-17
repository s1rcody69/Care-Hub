import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Stethoscope } from 'lucide-react';
import { getHealthResponse } from '../../services/aiService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm the CareHub Assistant. How can I help you with your health today?" }
  ]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    // OpenAI uses 'user' and 'assistant' for roles, and 'content' for the text
    const newMessages = [...messages, { role: 'user', content: userText }];
    
    setInput('');
    setLoading(true);
    setMessages(newMessages);

    try {
      const aiResponse = await getHealthResponse(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the network right now. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* The Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-brand-500 text-blue rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* The Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[380px] h-[450px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-surface-border flex flex-col overflow-hidden z-[9999] animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-brand-500 px-4 py-3 text-blue flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Stethoscope size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">CareHub AI</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Health Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-red/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-500 text-white shadow-md rounded-br-none' 
                    : 'bg-white text-ink border border-surface-border shadow-sm rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-surface-border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-surface-border">
            <div className="flex gap-2 items-center bg-surface-muted rounded-full px-4 py-2 border border-surface-border focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 outline-none text-slate-900 placeholder:text-slate-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a medical question..."
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={16} className="ml-0.5" /> {/* ml-0.5 to center the paper airplane visually */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;