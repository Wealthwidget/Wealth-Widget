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
      <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
              isDarkMode ? 'text-white' : 'text-purple-900'
            }`}
          >
            Discover Your Practice's True Value
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-lg sm:text-xl md:text-2xl ${
              isDarkMode ? 'text-gray-300' : 'text-purple-800/80'
            }`}
          >
            Our AI-powered valuation tool provides instant, accurate estimates for your wealth management practice, helping you make informed decisions about your future.
          </motion.p>

          {/* Adam Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`mx-auto max-w-md rounded-2xl p-4 sm:p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}
          >
            <div className="flex flex-col items-center space-y-3">
              <Image
                src="/adam-avatar.svg"
                alt="Adam"
                width={80}
                height={80}
                className="rounded-full"
              />
              <h2 className={`text-xl sm:text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-purple-900'
              }`}>
                Adam: Stewardship's Valuation Expert
              </h2>
              <p className={`text-base sm:text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-purple-800/80'
              }`}>
                Let's discover the true value of your practice together.
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={handleGetStarted}
              className={`px-8 py-4 text-lg sm:text-xl rounded-xl font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Find My Valuation
            </button>
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
