'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LegalDisclaimer from './legal-disclaimer';
import MobileMenu from './mobile-menu';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function LandingPage({ onGetStarted, isDarkMode, toggleDarkMode }: LandingPageProps) {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setIsLegalOpen(true);
  };

  const handleLegalClose = () => {
    setIsLegalOpen(false);
    onGetStarted();
  };

  const showLegal = () => {
    setIsLegalOpen(true);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
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
          <div className="w-full sm:w-auto flex items-center justify-between">
            {/* Burger Menu Button (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`sm:hidden p-2 rounded-lg ${
                isDarkMode ? 'text-white hover:bg-gray-800' : 'text-purple-900 hover:bg-purple-50'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
              Stewardship Wealth Management
            </div>

            {/* Spacer for mobile to maintain center alignment */}
            <div className="w-8 sm:hidden"></div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6">
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

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onLegalClick={showLegal}
          onDarkModeToggle={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      </motion.header>

      {/* Main Content */}
      <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28">
        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center w-full max-w-4xl mx-auto space-y-8 sm:space-y-12 md:space-y-16"
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight ${
              isDarkMode ? 'text-white' : 'text-purple-900'
            }`}
          >
            <span className="inline-block">Discover Your Practice's</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-900 inline-block">
              True Value
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${
              isDarkMode ? 'text-gray-300' : 'text-purple-800/80'
            }`}
          >
            Our AI-powered valuation tool provides instant, accurate estimates for your wealth management practice, helping you make informed decisions about your future.
          </motion.p>

          {/* Chat Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full max-w-xl mx-auto px-4"
          >
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-purple-100'
              } shadow-xl p-5 sm:p-6 md:p-8 rounded-3xl border transform transition-transform duration-300 hover:scale-[1.02]`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 relative">
                  <Image
                    src="/images/Stewardshipassistant.svg"
                    alt="Adam"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className={`font-semibold mb-2 text-base sm:text-lg md:text-xl ${
                    isDarkMode ? 'text-white' : 'text-purple-900'
                  }`}>
                    Adam: Stewardship's Valuation Expert
                  </div>
                  <div className={`text-sm sm:text-base md:text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-purple-800'
                  }`}>
                    Let's discover the true value of your practice together.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full flex justify-center px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className={`text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-2xl text-base sm:text-lg md:text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 ${
                isDarkMode ? 'bg-purple-600' : 'bg-purple-900'
              }`}
            >
              Find My Valuation
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* Legal Disclaimer Modal */}
      <LegalDisclaimer
        isOpen={isLegalOpen}
        onClose={handleLegalClose}
      />
    </div>
  );
}
