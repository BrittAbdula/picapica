// Picapica UI Components - Navigation Bar
// 使用Tailwind CSS重构的响应式导航栏组件

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, IconButton } from './Button';

/**
 * 主导航栏组件
 * @param {Object} props
 * @param {boolean} props.user - 用户信息
 * @param {Function} props.onLogin - 登录处理函数
 * @param {Function} props.onLogout - 登出处理函数
 */
export const Navbar = ({ user, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // 监听滚动状态
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动端菜单
  const closeMenu = () => setIsMenuOpen(false);

  // 导航链接数据
  const navLinks = [
    { path: '/', label: '首页', exact: true },
    { path: '/photobooth', label: '拍照亭' },
    { path: '/gallery', label: '相册' },
    { path: '/frames', label: '相框' },
    { path: '/my-frames', label: '我的相框' },
    { path: '/my-photos', label: '我的照片' }
  ];

  // 判断当前页面是否激活
  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 主导航栏 */}
      <nav 
        className={`
          sticky top-0 z-50 w-full transition-all duration-300
          ${scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-picapica-soft border-b border-picapica-200/20' 
            : 'bg-picapica-navbar backdrop-blur-md border-b border-picapica-200/20'
          }
        `}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo区域 */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={closeMenu}
            >
              <img 
                src="/images/picapica-logo.svg" 
                alt="Picapica Logo" 
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="hidden sm:block font-bold text-xl text-picapica-900 group-hover:text-picapica-300 transition-colors duration-300">
                Picapica
              </span>
            </Link>

            {/* 桌面端导航链接 */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  label={link.label}
                  active={isActiveLink(link.path, link.exact)}
                  onClick={closeMenu}
                />
              ))}
            </div>

            {/* 用户区域和移动端菜单按钮 */}
            <div className="flex items-center space-x-3">
              {/* 桌面端用户信息 */}
              <div className="hidden lg:block">
                <UserSection user={user} onLogin={onLogin} onLogout={onLogout} />
              </div>

              {/* 移动端汉堡菜单按钮 */}
              <IconButton
                variant="ghost"
                className="lg:hidden"
                icon={<HamburgerIcon isOpen={isMenuOpen} />}
                label={isMenuOpen ? '关闭菜单' : '打开菜单'}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单遮罩 */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* 移动端侧边菜单 */}
      <div 
        className={`
          fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw]
          bg-white/95 backdrop-blur-md shadow-picapica-strong
          border-l border-picapica-200/30 lg:hidden
          transform transition-transform duration-300 ease-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* 移动端菜单头部 */}
          <div className="flex items-center justify-between p-6 border-b border-picapica-200/30">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/picapica-logo.svg" 
                alt="Picapica" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg text-picapica-900">Picapica</span>
            </div>
            
            <IconButton
              variant="ghost"
              size="sm"
              icon={<CloseIcon />}
              label="关闭菜单"
              onClick={closeMenu}
            />
          </div>

          {/* 移动端导航链接 */}
          <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {navLinks.map(link => (
              <MobileNavLink
                key={link.path}
                to={link.path}
                label={link.label}
                active={isActiveLink(link.path, link.exact)}
                onClick={closeMenu}
              />
            ))}
          </div>

          {/* 移动端用户区域 */}
          <div className="p-6 border-t border-picapica-200/30">
            <UserSection 
              user={user} 
              onLogin={onLogin} 
              onLogout={onLogout} 
              mobile 
            />
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * 桌面端导航链接组件
 */
const NavLink = ({ to, label, active, onClick }) => (
  <Link
    to={to}
    className={`
      nav-link px-4 py-2 rounded-lg font-medium text-sm
      transition-all duration-200 relative group
      ${active 
        ? 'text-picapica-300 bg-picapica-100' 
        : 'text-picapica-800 hover:text-picapica-900 hover:bg-picapica-100'
      }
    `}
    onClick={onClick}
  >
    {label}
    {active && (
      <span 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 
                   w-1 h-1 bg-picapica-300 rounded-full" 
      />
    )}
  </Link>
);

/**
 * 移动端导航链接组件
 */
const MobileNavLink = ({ to, label, active, onClick }) => (
  <Link
    to={to}
    className={`
      block w-full px-4 py-3 rounded-xl font-medium
      transition-all duration-200 text-left border
      ${active 
        ? 'text-picapica-300 bg-picapica-100 border-picapica-200 shadow-sm' 
        : 'text-picapica-800 hover:text-picapica-900 hover:bg-picapica-50 border-transparent hover:border-picapica-200'
      }
    `}
    onClick={onClick}
  >
    {label}
  </Link>
);

/**
 * 用户信息区域组件
 */
const UserSection = ({ user, onLogin, onLogout, mobile = false }) => {
  if (user) {
    return (
      <div className={`flex items-center gap-3 ${mobile ? 'flex-col' : ''}`}>
        {/* 用户头像和信息 */}
        <div className={`flex items-center gap-3 ${mobile ? 'w-full justify-center' : ''}`}>
          <div className="w-10 h-10 bg-picapica-primary rounded-full flex items-center justify-center shadow-picapica-soft">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-picapica-900 font-semibold text-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          
          {mobile && (
            <div className="text-center">
              <p className="font-medium text-picapica-900">{user.name}</p>
              <p className="text-sm text-picapica-700">{user.email}</p>
            </div>
          )}
        </div>

        {/* 登出按钮 */}
        <Button
          variant="outline"
          size={mobile ? "md" : "sm"}
          onClick={onLogout}
          className={mobile ? "w-full" : ""}
        >
          退出登录
        </Button>
      </div>
    );
  }

  // 未登录状态
  return (
    <div className={mobile ? "w-full" : ""}>
      <Button
        variant="primary"
        size={mobile ? "md" : "sm"}
        onClick={onLogin}
        className={mobile ? "w-full" : ""}
      >
        登录
      </Button>
    </div>
  );
};

/**
 * 汉堡菜单图标组件
 */
const HamburgerIcon = ({ isOpen }) => (
  <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
    <span 
      className={`
        block h-0.5 w-6 bg-picapica-700 transform transition-all duration-300
        ${isOpen ? 'rotate-45 translate-y-1.5' : ''}
      `} 
    />
    <span 
      className={`
        block h-0.5 w-6 bg-picapica-700 transition-all duration-300
        ${isOpen ? 'opacity-0' : ''}
      `} 
    />
    <span 
      className={`
        block h-0.5 w-6 bg-picapica-700 transform transition-all duration-300
        ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}
      `} 
    />
  </div>
);

/**
 * 关闭图标组件
 */
const CloseIcon = () => (
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M6 18L18 6M6 6l12 12" 
    />
  </svg>
);

export default Navbar;