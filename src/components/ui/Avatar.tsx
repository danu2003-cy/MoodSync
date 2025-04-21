import React from 'react';
import { motion } from 'framer-motion';
import { Mood } from '../../types';

type AvatarProps = {
  mood?: Mood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({ 
  mood = 'neutral', 
  size = 'md',
  className = ''
}) => {
  const getEyeType = () => {
    switch (mood) {
      case 'happy': 
        return (
          <>
            <path d="M9,11 C9,12.1 8.1,13 7,13 C5.9,13 5,12.1 5,11 C5,9.9 5.9,9 7,9 C8.1,9 9,9.9 9,11 Z" fill="#000" />
            <path d="M19,11 C19,12.1 18.1,13 17,13 C15.9,13 15,12.1 15,11 C15,9.9 15.9,9 17,9 C18.1,9 19,9.9 19,11 Z" fill="#000" />
            <path d="M7,10 C7.6,10 8,10.4 8,11" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
            <path d="M17,10 C17.6,10 18,10.4 18,11" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
          </>
        );
      case 'content':
        return (
          <>
            <circle cx="7" cy="11" r="2" fill="#000" />
            <circle cx="17" cy="11" r="2" fill="#000" />
            <path d="M7,10 C7.6,10 8,10.4 8,11" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
            <path d="M17,10 C17.6,10 18,10.4 18,11" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
          </>
        );
      case 'neutral':
        return (
          <>
            <circle cx="7" cy="11" r="2" fill="#000" />
            <circle cx="17" cy="11" r="2" fill="#000" />
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="7" cy="11" r="2" fill="#000" />
            <circle cx="17" cy="11" r="2" fill="#000" />
            <path d="M7,12 C6.4,12 6,11.6 6,11" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
            <path d="M17,12 C16.4,12 16,11.6 16,11" stroke="#000" strokeWidth="0.5" strokeLinecap="round" />
          </>
        );
      case 'angry':
        return (
          <>
            <path d="M9,11 L5,11" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <path d="M19,11 L15,11" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <circle cx="7" cy="11" r="2" fill="#000" />
            <circle cx="17" cy="11" r="2" fill="#000" />
          </>
        );
      default:
        return (
          <>
            <circle cx="7" cy="11" r="2" fill="#000" />
            <circle cx="17" cy="11" r="2" fill="#000" />
          </>
        );
    }
  };
  
  const getMouthType = () => {
    switch (mood) {
      case 'happy':
        return (
          <path d="M7,15 C7,15 12,19 17,15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        );
      case 'content':
        return (
          <path d="M7,15 C7,15 12,17 17,15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        );
      case 'neutral':
        return (
          <path d="M7,15 L17,15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        );
      case 'sad':
        return (
          <path d="M7,17 C7,17 12,14 17,17" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        );
      case 'angry':
        return (
          <path d="M7,17 C7,17 12,15 17,17" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        );
      default:
        return (
          <path d="M7,15 L17,15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        );
    }
  };

  const getBlush = () => {
    if (mood === 'happy' || mood === 'content') {
      return (
        <>
          <circle cx="4" cy="13" r="2" fill="#ffb3b3" fillOpacity="0.5" />
          <circle cx="20" cy="13" r="2" fill="#ffb3b3" fillOpacity="0.5" />
        </>
      );
    }
    return null;
  };

  // Animation variants
  const variants = {
    happy: {
      y: [0, -10, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    content: {
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    neutral: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    sad: {
      y: [0, 2, 0],
      rotate: [0, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    },
    angry: {
      rotate: [0, 2, 0, -2, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: 3,
        repeatType: 'loop' as const,
      }
    }
  };
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };
  
  return (
    <motion.div 
      className={`${sizeClasses[size]} ${className}`}
      animate={mood}
      variants={variants}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.circle 
          cx="12" 
          cy="12" 
          r="10" 
          className={`
            ${mood === 'happy' ? 'fill-[#FFB5E8]' : ''}
            ${mood === 'content' ? 'fill-[#B5E8FF]' : ''}
            ${mood === 'neutral' ? 'fill-[#DCD3FF]' : ''}
            ${mood === 'sad' ? 'fill-[#B5FFE8]' : ''}
            ${mood === 'angry' ? 'fill-[#FFD3D3]' : ''}
            ${!mood ? 'fill-[#DCD3FF]' : ''}
          `}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        {getBlush()}
        {getEyeType()}
        {getMouthType()}
        {mood === 'angry' && (
          <>
            <motion.path 
              d="M4,8 L7,10" 
              stroke="#000" 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.path 
              d="M20,8 L17,10" 
              stroke="#000" 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
};

export default Avatar;