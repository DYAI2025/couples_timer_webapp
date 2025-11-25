import React from 'react';
import { motion } from 'framer-motion';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  isRunning: boolean;
  size?: number; // diameter in pixels
  strokeWidth?: number; // stroke width in pixels
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  size = 300,
  strokeWidth = 10
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Format time as MM:SS
  const minutes = Math.floor(Math.abs(timeLeft) / 60);
  const seconds = Math.floor(Math.abs(timeLeft) % 60);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const timeSign = timeLeft < 0 ? '-' : '';

  // Determine color based on time remaining
  let progressColor = 'text-primary-500';
  if (timeLeft <= 30 && timeLeft > 10) {
    progressColor = 'text-yellow-500';
  } else if (timeLeft <= 10) {
    progressColor = 'text-red-500';
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90" 
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={progressColor}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: isRunning ? 1 : 0, 
            ease: "linear" 
          }}
        />
      </svg>
      
      {/* Time display in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className={`text-4xl font-mono font-bold ${timeLeft <= 0 ? 'text-red-500' : 'text-gray-800'}`}
          key={formattedTime}
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {timeSign}{formattedTime}
        </motion.div>
      </div>
    </div>
  );
};

export default TimerDisplay;