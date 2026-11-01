import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  disabledReason = '',
  className = '',
  icon: Icon = null,
  ...rest
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm',
    lg: 'px-6 py-2.5 sm:py-3 text-sm'
  };

  const variantStyles = {
    primary: 'bg-[#114B3E] hover:bg-[#0c382e] text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white',
    accent: 'bg-[#E67E22] hover:bg-amber-600 text-white shadow-sm',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60',
    ghost: 'hover:bg-slate-100 text-slate-600'
  };

  if (disabled) {
    return (
      <div className="relative group inline-block w-full">
        <button
          type={type}
          disabled
          className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} w-full bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed ${className}`}
          {...rest}
        >
          {Icon && <Icon className="w-4 h-4 mr-1.5 shrink-0" />}
          <span>{children}</span>
        </button>
        {disabledReason && (
          <span className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-20 hidden group-hover:block whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-white shadow-md">
            {disabledReason}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4 mr-1.5 shrink-0" />}
      {children}
    </button>
  );
}

