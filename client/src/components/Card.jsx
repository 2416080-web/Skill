import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${
        hover ? 'hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
