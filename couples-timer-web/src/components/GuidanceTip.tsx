import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidanceTipProps {
  tip: string | null;
  isVisible: boolean;
  duration?: number; // How long to show the tip before auto-dismissing (in ms)
  onDismiss?: () => void;
}

const GuidanceTip: React.FC<GuidanceTipProps> = ({ 
  tip, 
  isVisible, 
  duration = 8000, 
  onDismiss 
}) => {
  const [showTip, setShowTip] = useState(isVisible);

  // Handle auto-dismissal
  useEffect(() => {
    if (isVisible && tip && duration > 0) {
      const timer = setTimeout(() => {
        setShowTip(false);
        if (onDismiss) onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, tip, duration, onDismiss]);

  // Update visibility when prop changes
  useEffect(() => {
    setShowTip(isVisible);
  }, [isVisible]);

  if (!tip || !showTip) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 max-w-md z-50 border border-gray-200"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg 
              className="h-5 w-5 text-blue-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <p className="ml-3 text-gray-700">{tip}</p>
          <button
            onClick={() => {
              setShowTip(false);
              if (onDismiss) onDismiss();
            }}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuidanceTip;