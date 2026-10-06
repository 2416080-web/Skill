import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none rounded-xl';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-sm',
    md: 'text-sm px-4 py-2 gap-2 shadow-sm',
    lg: 'text-base px-5 py-2.5 gap-2.5 shadow',
  };

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-indigo-100',
    secondary: 'bg-violet-50 text-violet-700 hover:bg-violet-100 focus:ring-violet-400 border border-violet-200',
    outline: 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-rose-100',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-emerald-100',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300 shadow-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
