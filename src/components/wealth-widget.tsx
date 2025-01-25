'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WealthIcon } from './wealth-icon';

interface Message {
  text: string;
  type: 'bot' | 'user';
  id: string;
}

export default function WealthWidget() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [aum, setAum] = useState('');
  const [revenue, setRevenue] = useState('');
  const [email, setEmail] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ type: 'bot' | 'user'; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const parseNumberWithWords = (input: string): number => {
    // Remove all spaces and convert to lowercase
    const cleaned = input.toLowerCase().replace(/\s+/g, '');
    
    // Define multipliers
    const multipliers: { [key: string]: number } = {
      'k': 1000,
      'thousand': 1000,
      'm': 1000000,
      'million': 1000000,
      'b': 1000000000,
      'billion': 1000000000
    };

    // Try to find any word multipliers
    for (const [suffix, multiplier] of Object.entries(multipliers)) {
      if (cleaned.includes(suffix)) {
        // Extract the number part before the suffix
        const numberPart = cleaned.split(suffix)[0];
        const baseNumber = parseFloat(numberPart);
        if (!isNaN(baseNumber)) {
          return baseNumber * multiplier;
        }
      }
    }

    // If no word multipliers found, try parsing as a regular number
    const numberOnly = input.replace(/[^0-9.]/g, '');
    return parseFloat(numberOnly);
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages(prev => [...prev, { type: 'bot', content: text }]);
    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!inputValue.trim()) return;

    // Add user's message to chat
    setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
    
    // Process based on current step
    if (currentStep === 0) {
      if (inputValue.trim().length < 2) {
        setError("Please enter your full name");
        return;
      }
      setName(inputValue);
      setInputValue('');
      setCurrentStep(1);
      simulateTyping("Great to meet you! Now, what's your company's Assets Under Management (AUM)? Please enter the amount in USD.");
    }
    else if (currentStep === 1) {
      const aumValue = parseNumberWithWords(inputValue);
      if (isNaN(aumValue) || aumValue <= 0) {
        setError("Please enter a valid positive number for AUM");
        return;
      }
      setAum(aumValue.toString());
      setInputValue('');
      setCurrentStep(2);
      simulateTyping("Thanks! What's your annual revenue in USD?");
    }
    else if (currentStep === 2) {
      const revenueValue = parseNumberWithWords(inputValue);
      if (isNaN(revenueValue) || revenueValue <= 0) {
        setError("Please enter a valid positive number for revenue");
        return;
      }
      setRevenue(revenueValue.toString());
      setInputValue('');
      setCurrentStep(3);
      simulateTyping("Thanks for sharing those details! Before I share your company's valuation, could you provide your email? I'll send the result straight to your inbox for your records.");
    }
    else if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setError("Please enter a valid email address");
        return;
      }
      setEmail(inputValue);
      
      try {
        setIsSubmitting(true);
        setError(null);
        
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            aum: parseFloat(aum),
            revenue: parseFloat(revenue),
            email: inputValue,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit');
        }

        const data = await response.json();
        
        setInputValue('');
        setCurrentStep(4);
        simulateTyping(`Perfect! I've calculated your company's valuation and sent the detailed report to your email. Based on your AUM of $${parseInt(aum).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}, your estimated valuation is $${(parseFloat(aum) * 4.5).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}. Check your inbox for the full analysis!`);
      } catch (err) {
        console.error('Submission error:', err);
        setError(err instanceof Error ? err.message : "There was an error processing your request. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        simulateTyping("Hi there! 👋 I'm here to help you estimate your company's value. It's quick and easy—just a couple of questions. Ready to get started?\n\nFirst, what's your name?");
      }, 100);
    } else {
      setIsOpen(false);
      // Reset state when closing
      setCurrentStep(0);
      setName('');
      setAum('');
      setRevenue('');
      setEmail('');
      setInputValue('');
      setMessages([]);
      setError(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={widgetRef}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="h-[500px] flex flex-col">
              <motion.div 
                className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                initial={{ background: 'linear-gradient(to right, #2563eb, #7c3aed)' }}
                whileHover={{ background: 'linear-gradient(to right, #1d4ed8, #6d28d9)' }}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <WealthIcon />
                  <span>Company Valuation Assistant</span>
                </h2>
              </motion.div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${
                        message.type === 'bot'
                          ? 'bg-gray-200 rounded-[20px] rounded-tl-[4px]'
                          : 'bg-[#0B93F6] text-white rounded-[20px] rounded-tr-[4px] ml-auto'
                      } p-4 max-w-[80%] whitespace-pre-wrap shadow-sm`}
                    >
                      {message.content}
                    </div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <div className="bg-gray-200 p-3 rounded-[20px] rounded-tl-[4px] w-16">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {currentStep < 4 && (
                <div className="p-4 border-t border-gray-100">
                  <form
                    onSubmit={handleSubmit}
                    className="flex w-full gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        currentStep === 0 ? "Type your name..." :
                        currentStep === 1 ? "Enter AUM in USD..." :
                        currentStep === 2 ? "Enter revenue in USD..." :
                        currentStep === 3 ? "Enter your email..." :
                        "Chat ended"
                      }
                      disabled={currentStep === 4 || isSubmitting}
                      className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className={cn(
                        "rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleToggle}
            className="hidden"
          >
            <WealthIcon />
          </motion.button>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={handleToggle}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
          }}
          whileHover={{ 
            scale: 1.05,
            rotate: 5,
            boxShadow: '0 6px 24px rgba(37, 99, 235, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <WealthIcon />
        </motion.button>
      )}
    </div>
  );
}
