import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <img
      src="/favicon.png"
      alt="Logo UbahPDF"
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain transition-transform duration-300 group-hover:rotate-12 ${className}`}
    />
  );
};

export const TdocLogo = AppLogo;

