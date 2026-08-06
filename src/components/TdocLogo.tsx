import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const TdocLogo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <img
      src="/logo.png"
      alt="UbahPDF Logo"
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain transition-transform duration-300 group-hover:scale-105 shrink-0 ${className}`}
    />
  );
};
