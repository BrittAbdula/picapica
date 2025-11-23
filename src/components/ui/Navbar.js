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
    { path: '/my-photos', label: 'My Photos' },
    { path: '/my-frames', label: 'My Frames' }
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

            {/* 桌面端导航链接 */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map(link => (
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
              ))}
            </div>

            {/* 用户区域和移动端菜单按钮 */}
            <div className="flex items-center space-x-4">
              {/* 桌面端用户信息 */}
              <div className="hidden lg:block">
                <UserSection user={user} onLogin={onLogin} onLogout={onLogout} />
              </div>

              {/* 移动端汉堡菜单按钮 */}
              <button
                className="lg:hidden z-50 relative p-2 text-picapica-900 focus:outline-none"
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
          fixed inset-0 z-40 bg-picapica-50/95 backdrop-blur-xl lg:hidden
          flex flex-col justify-center items-center
          transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <div className="flex flex-col items-center space-y-6 w-full max-w-sm px-6">
          {navLinks.map((link, index) => (
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
          ))}

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
  if (user) {
    return (
      <div className={`flex items-center gap-4 ${mobile ? 'flex-col' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-picapica-200 rounded-full flex items-center justify-center text-picapica-800 font-medium text-sm">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          {mobile && <span className="font-medium text-picapica-900">{user.name}</span>}
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-picapica-600 hover:text-picapica-900 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Button
      variant={mobile ? "primary" : "primary"}
      size={mobile ? "lg" : "sm"}
      onClick={onLogin}
      className={mobile ? "w-full min-w-[200px]" : ""}
    >
      Log in
    </Button>
  );
};

export default Navbar;