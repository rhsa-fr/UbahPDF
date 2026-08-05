import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const TdocLogo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id="cleanUbahPdf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Smooth Modern Squircle Container */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="url(#cleanUbahPdf)"
      />

      {/* Clean Minimalist Document Outline */}
      <path
        d="M 13 11 H 21 L 27 17 V 29 C 27 30.1 26.1 31 25 31 H 13 C 11.9 31 11 30.1 11 29 V 13 C 11 11.9 11.9 11 13 11 Z"
        fill="#ffffff"
        fillOpacity="0.18"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Folded Corner */}
      <path
        d="M 21 11 V 17 H 27"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bold Minimal 'U' Emblem */}
      <path
        d="M 16 20 V 24 C 16 25.7 17.3 27 19 27 C 20.7 27 22 25.7 22 24 V 20"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
