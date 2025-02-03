'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface LegalDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalDisclaimer({ isOpen, onClose }: LegalDisclaimerProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-white mb-6"
                >
                  Legal Disclaimer
                </Dialog.Title>
                <div className="mt-2 space-y-4 text-gray-300 prose prose-lg max-w-none">
                  <p className="leading-relaxed">
                    This valuation and valuation tool are only to be used for estimate purposes. Formal valuations will occur once the relevant details have been confirmed between yourself and Stewardship Wealth Management.
                  </p>
                  <p className="leading-relaxed">
                    This is a tool that will give you an idea of what your valuation may be, but additional information is required before an actual offer will be provided by Stewardship Wealth Management.
                  </p>
                  <p className="leading-relaxed">
                    The valuation provided by this tool is not a formal offer. A formal offer will be provided by Stewardship Wealth Management after a formal valuation and negotiations have been agreed upon between yourself and Stewardship Wealth Management.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl bg-purple-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-all duration-200"
                    onClick={onClose}
                  >
                    I Understand
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
