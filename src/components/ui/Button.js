// Picapica UI Components - Button System
// 统一的按钮组件，使用Tailwind CSS管理样式

import React from 'react';

/**
 * 主要按钮组件 - 使用Picapica设计系统
 * @param {Object} props 
 * @param {'primary'|'secondary'|'filter'|'lighting'|'danger'|'outline'} props.variant - 按钮变体
 * @param {'sm'|'md'|'lg'|'xl'} props.size - 按钮尺寸
 * @param {boolean} props.disabled - 是否禁用
 * @param {boolean} props.loading - 加载状态
 * @param {React.ReactNode} props.children - 按钮内容
 * @param {string} props.className - 额外的CSS类名
 * @param {Function} props.onClick - 点击事件处理器
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  // 基础样式
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
    disabled:transform-none overflow-hidden
  `.trim();

  // 尺寸样式
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  };

  // 变体样式
  const variantClasses = {
    primary: `
      bg-picapica-primary text-picapica-900 shadow-picapica-soft
      hover:shadow-picapica-medium hover:-translate-y-0.5
      focus:ring-picapica-300 active:translate-y-0
    `,
    secondary: `
      bg-picapica-400 text-white shadow-picapica-soft
      hover:bg-picapica-500 hover:-translate-y-0.5 hover:shadow-picapica-medium
      focus:ring-picapica-400 active:translate-y-0
    `,
    filter: `
      bg-picapica-50 border-2 border-picapica-200 text-picapica-700
      hover:bg-picapica-100 hover:border-picapica-300 hover:-translate-y-0.5
      focus:bg-picapica-200 focus:border-picapica-400 focus:ring-picapica-200
      active:translate-y-0
    `,
    lighting: `
      text-white font-medium shadow-md
      hover:scale-105 hover:shadow-lg
      focus:ring-white/50 active:scale-100
      transition-transform duration-200
    `,
    danger: `
      bg-red-500 text-white shadow-md
      hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg
      focus:ring-red-300 active:translate-y-0
    `,
    outline: `
      bg-transparent border-2 border-picapica-200 text-picapica-700
      hover:bg-picapica-50 hover:border-picapica-300 hover:-translate-y-0.5
      focus:bg-picapica-100 focus:ring-picapica-200 active:translate-y-0
    `
  };

  // 合并所有样式类
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* 光影效果 - 仅对primary和secondary按钮 */}
      {(variant === 'primary' || variant === 'secondary') && !disabled && (
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                   -translate-x-full group-hover:translate-x-full transition-transform duration-500"
          aria-hidden="true"
        />
      )}

      {/* 加载状态 */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {children}
    </button>
  );
};

/**
 * 特殊的灯光预设按钮 - 用于PhotoBooth背景灯光
 * @param {Object} props
 * @param {string} props.color - 按钮背景色
 * @param {boolean} props.active - 是否为当前选中状态
 * @param {React.ReactNode} props.children - 按钮内容
 */
export const LightingButton = ({
  color,
  active = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const buttonClasses = `
    relative m-1 px-3 py-2 rounded-lg cursor-pointer
    font-medium text-sm transition-all duration-300
    border-2 hover:scale-105 focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-white/50
    ${active
      ? 'border-white shadow-lg scale-105'
      : 'border-transparent hover:border-white/30'
    }
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      style={{ backgroundColor: color }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * 自定义颜色按钮 - 用于颜色选择
 * @param {Object} props
 * @param {React.ReactNode} props.children - 按钮内容
 */
export const CustomColorButton = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  const buttonClasses = `
    m-1 px-3 py-2 rounded border border-picapica-300
    bg-white text-picapica-700 font-medium text-sm
    cursor-pointer transition-all duration-300
    hover:bg-picapica-50 hover:border-picapica-400 hover:-translate-y-0.5
    focus:outline-none focus:ring-2 focus:ring-picapica-200
    shadow-sm hover:shadow-md active:translate-y-0
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * 浮动操作按钮 - 用于主要操作
 * @param {Object} props
 * @param {React.ReactNode} props.children - 按钮内容
 */
export const FloatingActionButton = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  const buttonClasses = `
    fixed bottom-6 right-6 z-50
    w-14 h-14 rounded-full shadow-picapica-strong
    bg-picapica-primary text-picapica-900
    flex items-center justify-center
    transition-all duration-300
    hover:scale-110 hover:shadow-picapica-hover hover:-translate-y-1
    focus:outline-none focus:ring-4 focus:ring-picapica-300
    active:scale-95 active:translate-y-0
    ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * 图标按钮 - 用于导航和工具栏
 * @param {Object} props
 * @param {React.ReactNode} props.icon - 图标组件
 * @param {string} props.label - 无障碍标签
 */
export const IconButton = ({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const variantClasses = {
    ghost: `
      text-picapica-700 hover:text-picapica-900 hover:bg-picapica-100
      focus:bg-picapica-100 focus:ring-picapica-200
    `,
    solid: `
      bg-picapica-200 text-picapica-800 hover:bg-picapica-300
      focus:ring-picapica-300 shadow-sm
    `
  };

  const buttonClasses = `
    inline-flex items-center justify-center rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `.trim();

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
};

// 导出所有按钮组件
export default {
  Button,
  LightingButton,
  CustomColorButton,
  FloatingActionButton,
  IconButton
};