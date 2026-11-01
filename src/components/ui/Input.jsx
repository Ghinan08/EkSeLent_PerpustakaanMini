import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
  icon: Icon = null,
  rightElement = null,
  className = '',
  ...rest
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 py-2.5 px-3.5 transition-colors focus:border-[#114B3E] focus:ring-1 focus:ring-[#114B3E] focus:outline-none ${
            Icon ? 'pl-10' : ''
          } ${rightElement ? 'pr-11' : ''} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : ''}`}
          {...rest}
        />

        {rightElement && (
          <div className="absolute right-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}

