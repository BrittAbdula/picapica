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
      setScrolled(offset > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动端菜单
  const closeMenu = () => setIsMenuOpen(false);

  // Navigation Links
  const navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/photobooth', label: 'Photobooth' },
    { path: '/preview', label: 'Photo Preview' },
    { path: '/frames', label: 'Frames' },
    { path: '/my-photos', label: 'My Photos' }
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
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
          }
        `}
      >
        <div className="container-main">
          <div className="flex items-center justify-between px-4 md:px-6">
            {/* Logo区域 */}
            <Link
              to="/"
              className="flex items-center space-x-2 group z-50 relative"
              onClick={closeMenu}
            >
              <img
                src="/images/picapica-logo.svg"
                alt="Picapica Logo"
                className="h-8 w-auto"
              />
              <span className="font-serif font-bold text-xl text-picapica-900 tracking-tight">
                Picapica.app
              </span>
            </Link>

            {/* 桌面端导航链接 - 默认显示，仅手机隐藏 */}
            <div className="flex items-center space-x-6 max-sm:hidden">
              {navLinks
                .filter(link => {
                  // 只有登录用户才能看到 My Photos 和 My Frames
                  if (link.path === '/my-photos' || link.path === '/my-frames') {
                    return !!user;
                  }
                  return true;
                })
                .map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      text-sm font-medium transition-colors duration-200
                      ${isActiveLink(link.path, link.exact)
                        ? 'text-picapica-900'
                        : 'text-picapica-600 hover:text-picapica-900'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))
              }
            </div>

            {/* 用户区域和移动端菜单按钮 */}
            <div className="flex items-center space-x-4">
              {/* 桌面端用户信息 - 默认显示，仅手机隐藏 */}
              <div className="max-sm:hidden">
                <UserSection user={user} onLogin={onLogin} onLogout={onLogout} />
              </div>

              {/* 移动端汉堡菜单按钮 - 仅小屏显示 */}
              <button
                className="sm:hidden z-50 relative p-2 text-picapica-900 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 全屏移动端菜单 */}
      <div
        className={`
          fixed inset-0 z-40 bg-picapica-50/95 backdrop-blur-xl sm:hidden
          flex flex-col justify-center items-center
          transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center space-y-6 w-full max-w-sm px-6">
          {navLinks
            .filter(link => {
              // 只有登录用户才能看到 My Photos 和 My Frames
              if (link.path === '/my-photos' || link.path === '/my-frames') {
                return !!user;
              }
              return true;
            })
            .map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-3xl font-serif font-medium text-picapica-900
                  hover:text-picapica-600 transition-colors duration-300
                  transform transition-transform duration-500
                  ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))
          }

          <div
            className={`
              pt-8 w-full flex justify-center
              transform transition-all duration-500 delay-300
              ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <UserSection user={user} onLogin={onLogin} onLogout={onLogout} mobile />
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * 用户信息区域组件
 */
const UserSection = ({ user, onLogin, onLogout, mobile = false }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAvatarClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  const handleCancel = () => {
    setShowLogoutDialog(false);
  };

  if (user) {
    return (
      <>
        {/* 用户头像 - 点击弹出确认对话框 */}
        <div
          onClick={handleAvatarClick}
          className="w-9 h-9 aspect-square bg-picapica-200 rounded-full flex items-center justify-center text-picapica-800 font-medium text-sm shadow-sm border border-picapica-300/30 flex-shrink-0 hover:scale-110 transition-transform duration-200 cursor-pointer overflow-hidden"
          title="Click to logout"
        >
          {user.avatar && !imageError ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="select-none">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        {/* 退出登录确认对话框 */}
        {showLogoutDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all">
              <h3 className="text-xl font-semibold text-picapica-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-picapica-600 mb-6">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg text-picapica-700 hover:bg-picapica-100 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-picapica-600 text-white hover:bg-picapica-700 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Button
      variant="secondary"
      size={mobile ? "lg" : "md"}
      onClick={onLogin}
      className={mobile ? "w-full min-w-[200px]" : ""}
    >
      Log in
    </Button>
  );
};

export default Navbar;