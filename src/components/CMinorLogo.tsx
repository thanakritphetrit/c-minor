import React from 'react';

interface CMinorLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'badge';
  showSubtitle?: boolean;
  className?: string;
}

export const CMinorLogo: React.FC<CMinorLogoProps> = ({
  size = 'md',
  variant = 'badge',
  showSubtitle = true,
  className = '',
}) => {
  // Dimensions and scaling based on size
  const sizeClasses = {
    sm: {
      text: 'text-lg',
      subText: 'text-[8px]',
      bolt: 'w-3.5 h-3.5',
      padding: 'px-2.5 py-1',
    },
    md: {
      text: 'text-2xl',
      subText: 'text-[10px]',
      bolt: 'w-4 h-5',
      padding: 'px-3.5 py-1.5',
    },
    lg: {
      text: 'text-4xl',
      subText: 'text-[12px]',
      bolt: 'w-6 h-8',
      padding: 'px-6 py-3',
    },
  };

  const currentSize = sizeClasses[size];

  // Render C-MINOR text with red lightning bolt
  const logoText = (
    <div className="flex flex-col items-center">
      <div className={`flex items-center font-black tracking-wider leading-none ${currentSize.text}`}>
        <span className="text-[#FF7A00]">C</span>
        {/* Red Lightning Bolt Icon */}
        <svg
          className={`${currentSize.bolt} mx-0.5 text-[#E11D48] fill-current shrink-0 filter drop-shadow-sm`}
          viewBox="0 0 24 24"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span className="text-[#FF7A00]">MINOR</span>
      </div>

      {showSubtitle && (
        <span
          className={`font-semibold tracking-tight italic text-slate-700 mt-0.5 whitespace-nowrap ${currentSize.subText}`}
        >
          Power Distribution Systems and Electrical Installation
        </span>
      )}
    </div>
  );

  if (variant === 'badge') {
    return (
      <div
        className={`bg-white rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center transition-transform hover:scale-105 ${currentSize.padding} ${className}`}
      >
        {logoText}
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex flex-col items-start">
          <div className={`flex items-center font-black tracking-wider leading-none ${currentSize.text}`}>
            <span className="text-[#FF7A00]">C</span>
            <svg
              className={`${currentSize.bolt} mx-0.5 text-[#E11D48] fill-current shrink-0`}
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-[#FF7A00]">MINOR</span>
          </div>
          {showSubtitle && (
            <span
              className={`font-medium tracking-tight italic text-slate-300 mt-0.5 whitespace-nowrap ${currentSize.subText}`}
            >
              Power Distribution Systems and Electrical Installation
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {logoText}
    </div>
  );
};
