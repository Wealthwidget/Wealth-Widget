import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLegalClick: () => void;
  onDarkModeToggle: () => void;
  isDarkMode: boolean;
}

export default function MobileMenu({ isOpen, onClose, onLegalClick, onDarkModeToggle, isDarkMode }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[998] sm:hidden"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 h-full w-64 z-[999] sm:hidden ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            } shadow-xl`}
          >
            <div className="p-4">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="px-4 py-2 space-y-4">
              <button
                onClick={() => {
                  onLegalClick();
                  onClose();
                }}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'text-white hover:bg-gray-800'
                    : 'text-purple-900 hover:bg-purple-50'
                }`}
              >
                Legal
              </button>
              
              <button
                onClick={() => {
                  onDarkModeToggle();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'text-white hover:bg-gray-800'
                    : 'text-purple-900 hover:bg-purple-50'
                }`}
              >
                <span>Dark Mode</span>
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
