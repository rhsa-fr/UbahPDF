import React from 'react';

interface TdocLogoProps {
  className?: string;
  size?: number;
}

export const TdocLogo: React.FC<TdocLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 group-hover:scale-110 ${className}`}
    >
      <defs>
        <linearGradient id="tdocGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        <linearGradient id="tdocGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        <filter id="tdocGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Central Floating Document Card */}
      <path
        d="M 17 12 H 27 L 33 18 V 34 C 33 35.657 31.657 37 30 37 H 17 C 15.343 37 14 35.657 14 34 V 15 C 14 13.343 15.343 12 17 12 Z"
        fill="url(#tdocGrad1)"
        fillOpacity="0.2"
        stroke="url(#tdocGrad1)"
        strokeWidth="2.5"
      />
      <path d="M 27 12 V 18 H 33" stroke="url(#tdocGrad1)" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Outer Conversion Arrows Arc */}
      <path
        d="M 24 5 A 19 19 0 0 1 42 21"
        stroke="url(#tdocGrad1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#tdocGlow)"
      />
      <path
        d="M 42 21 L 44 14 M 42 21 L 35 19"
        stroke="url(#tdocGrad1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 24 43 A 19 19 0 0 1 6 27"
        stroke="url(#tdocGrad1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#tdocGlow)"
      />
      <path
        d="M 6 27 L 4 34 M 6 27 L 13 29"
        stroke="url(#tdocGrad1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bold Stylized 'T' Symbol */}
      <path
        d="M 19 20 H 29 M 24 20 V 31"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
