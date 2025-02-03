'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LegalDisclaimer from './legal-disclaimer';
import { appendToSheet, ValuationData } from '@/lib/sheets';

interface WealthWidgetProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function WealthWidget({ isDarkMode, toggleDarkMode }: WealthWidgetProps) {
  const [messages, setMessages] = useState<Array<{ type: string; content: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [brokerageAum, setBrokerageAum] = useState('');
  const [advisoryAum, setAdvisoryAum] = useState('');
  const [revenue, setRevenue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const parseAmount = (input: string): number => {
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
    return parseFloat(numberOnly) || 0;
  };

  const calculateValuation = (brokerageAum: string, advisoryAum: string): number => {
    const brokerageValue = parseAmount(brokerageAum);
    const advisoryValue = parseAmount(advisoryAum);
    const totalAum = brokerageValue + advisoryValue;

    // Under 500MM:
    // - 1x on brokerage AUM
    // - 3x on Advisory AUM
    let brokerageMultiplier = 1;
    let advisoryMultiplier = 3;

    if (totalAum >= 1000000000) { // 1B or more
      // - 2x on brokerage
      // - 7x on Advisory AUM
      brokerageMultiplier = 2;
      advisoryMultiplier = 7;
    } else if (totalAum >= 500000000) { // 500MM or more
      // - 2x on Brokerage
      // - 5x on Advisory AUM
      brokerageMultiplier = 2;
      advisoryMultiplier = 5;
    }

    const brokeragePortion = brokerageValue * brokerageMultiplier;
    const advisoryPortion = advisoryValue * advisoryMultiplier;
    
    return brokeragePortion + advisoryPortion;
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(prev => [...prev, { type: 'assistant', content: text }]);
    setIsTyping(false);
    scrollToBottom();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();
    handleInput(userInput);
  };

  const handleInput = async (userInput: string) => {
    if (isTyping) return;

    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', content: userInput }]);

    if (!userName) {
      setUserName(userInput);
      await simulateTyping("Nice to meet you " + userInput + "! What's your Brokerage Assets Under Management (AUM)? Please enter the amount in USD.");
    } else if (!brokerageAum) {
      setBrokerageAum(userInput);
      await simulateTyping("Thanks! Now, what's your Advisory Assets Under Management (AUM)? Please enter the amount in USD.");
    } else if (!advisoryAum) {
      setAdvisoryAum(userInput);
      await simulateTyping("Great! What's your annual revenue? Please enter the amount in USD.");
    } else if (!revenue) {
      setRevenue(userInput);
      await simulateTyping("Almost done! Please enter your email address to receive a detailed breakdown of the valuation.");
    } else if (!userEmail) {
      if (!userInput.includes('@') || !userInput.includes('.')) {
        await simulateTyping("Please enter a valid email address.");
        return;
      }
      setUserEmail(userInput);
      const totalAum = parseAmount(brokerageAum) + parseAmount(advisoryAum);
      const revenueAmount = parseAmount(revenue);
      const valuation = calculateValuation(brokerageAum, advisoryAum);
      
      try {
        // Format data exactly like v1
        const data = {
          name: userName,
          aum: totalAum,
          revenue: revenueAmount,
          email: userInput,
          valuation: valuation, // Add the calculated valuation
        };
        
        console.log('Submitting data:', JSON.stringify(data, null, 2));
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const result = await response.json();
          console.error('Submission failed:', result);
          throw new Error(result.error || result.details || 'Failed to submit data');
        }

        const result = await response.json();
        console.log('Submission success:', result);

        await simulateTyping(`Based on the information you've provided, your estimated practice value is ${formatCurrency(valuation)}. You'll receive a detailed breakdown via email shortly.`);
      } catch (error) {
        console.error('Error submitting data:', error);
        await simulateTyping(`Based on the information you've provided, your estimated practice value is ${formatCurrency(valuation)}. You'll receive a detailed breakdown via email shortly.`);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showLegal = () => {
    setIsLegalOpen(true);
  };

  useEffect(() => {
    const initialize = async () => {
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true;
        setMounted(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await simulateTyping("Hi there! I'm Adam, Stewardship's Valuation Expert. I'll help you understand the value of your practice. What's your name?");
      }
    };

    initialize();
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-5 ${
          isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'
        } backdrop-blur-sm`}
      >
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
            Stewardship Wealth Management
          </div>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <button
              onClick={showLegal}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl text-base sm:text-lg font-medium transition-all duration-200 ${
                isDarkMode ? 'text-white hover:bg-gray-800' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              Legal
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 sm:p-2.5 md:p-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-purple-50 text-purple-900'
              }`}
            >
              {isDarkMode ? (
                <svg className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="min-h-screen pt-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'} text-center mb-4`}>
            Wealth Valuation Assistant
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-purple-800/80'} text-center mb-8`}>
            Get an instant valuation of your wealth management practice
          </p>

          {/* Chat Container */}
          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'
          } rounded-2xl shadow-xl border overflow-hidden transition-colors duration-200`}>
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start items-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex-shrink-0 mr-3">
                      <Image
                        src="/adam-avatar.svg"
                        alt="Adam"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? isDarkMode 
                          ? 'bg-purple-700 text-white'
                          : 'bg-purple-100 text-purple-900'
                        : isDarkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-purple-600 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <Image
                      src="/adam-avatar.svg"
                      alt="Adam"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-purple-100'
            }`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your response..."
                  className={`flex-1 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-purple-200 text-purple-900 placeholder-purple-400'
                  } border transition-colors duration-200`}
                />
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-xl transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Legal Disclaimer Modal */}
      <LegalDisclaimer
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />
    </div>
  );
}
