import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, Product } from '../types';
import { PRODUCTS, FALLBACK_IMAGE } from '../data/products';

export const AIAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    addToCart,
    openProductDetail
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Bonjour! I am Chef Camille, your AI Pastry Concierge at SweetSpot. Ask me anything about our cakes, flavor notes, custom orders, allergen info, or let me recommend the perfect treat for your occasion!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const quickPrompts = [
    "What are your best-selling cakes?",
    "Do you have vegan or allergen-free treats?",
    "Recommend a pairing for the Macaron Box",
    "What's in the Dark Velvet Ganache?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAssistantOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();
      
      // Parse suggested products from query or reply text
      const lowerReply = (data.reply || '').toLowerCase();
      const lowerQuery = query.toLowerCase();
      const suggested = PRODUCTS.filter(p => 
        lowerReply.includes(p.name.toLowerCase()) || 
        lowerQuery.includes(p.name.toLowerCase()) ||
        (lowerQuery.includes('cake') && p.category === 'Signature Cakes') ||
        (lowerQuery.includes('macaron') && p.category === 'Macarons')
      ).slice(0, 2);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'd be delighted to recommend something delicious from our artisanal collection!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: suggested.length > 0 ? suggested : undefined,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: "I am currently decorating a fresh batch of tarts! I highly recommend checking out our Signature Macaron Box ($24.00) or Dark Velvet Ganache ($38.00).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={() => setIsAssistantOpen(false)} />

      {/* Drawer Container */}
      <div className="relative w-full sm:w-[440px] h-[85vh] sm:h-[680px] bg-[#FAF6F2] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#EAE0D5] z-10 animate-slide-up">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#5C4A47] to-[#473937] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F7E6E5] flex items-center justify-center text-[#7A3E39] shadow-inner">
              <Sparkles className="w-5 h-5 text-[#B85B55]" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-lg leading-tight">Chef Camille</h3>
              <p className="text-xs text-[#E3C4C1] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#88D3A8] animate-ping" />
                SweetSpot AI Pastry Concierge
              </p>
            </div>
          </div>

          <button
            id="assistant-close-btn"
            onClick={() => setIsAssistantOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#F3DEDC] flex items-center justify-center text-[#7A5A53] shrink-0 text-xs font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#5C4A47] text-white rounded-br-2xs'
                      : 'bg-white text-[#3D312E] border border-[#EAE0D5] rounded-bl-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#3D312E] text-white flex items-center justify-center shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-[#A89893] px-1 mt-1">
                {msg.timestamp}
              </span>

              {/* Attached Product Recommendations */}
              {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                <div className="mt-3 ml-9 space-y-2 w-[85%]">
                  <span className="text-[11px] font-bold text-[#8A7973] uppercase tracking-wider block">
                    Recommended Delights:
                  </span>
                  {msg.suggestedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#EAE0D5] shadow-2xs hover:border-[#C28B87] transition-all"
                    >
                      <div
                        onClick={() => {
                          openProductDetail(product.id);
                          setIsAssistantOpen(false);
                        }}
                        className="flex items-center gap-2.5 cursor-pointer flex-1"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-serif-display font-bold text-xs text-[#3D312E] hover:text-[#7A5A53]">
                            {product.name}
                          </h4>
                          <span className="text-xs font-bold text-[#5C4A47]">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2 rounded-xl bg-[#F8ECE9] hover:bg-[#5C4A47] hover:text-white text-[#3D312E] transition-colors cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#8A7973] italic pl-9">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#C28B87]" />
              <span>Chef Camille is pondering delicious recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-[#EAE0D5] bg-[#F8EFEA]/50 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-[#6C5C57] border border-[#E0D2C7] hover:border-[#C28B87] hover:text-[#3D312E] transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-[#EAE0D5] flex items-center gap-2"
        >
          <input
            id="assistant-chat-input"
            type="text"
            placeholder="Ask Chef Camille about pastries, pricing, custom cakes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#FAF6F2] px-4 py-2.5 rounded-full text-sm text-[#3D312E] placeholder-[#A89893] focus:outline-none focus:ring-2 focus:ring-[#C28B87]"
          />
          <button
            id="assistant-chat-send-btn"
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-[#5C4A47] hover:bg-[#3D312E] disabled:bg-[#D3C5BC] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
