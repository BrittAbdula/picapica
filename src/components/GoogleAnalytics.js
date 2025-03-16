import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = () => {
  useEffect(() => {
    // 创建脚本元素
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-KP5VEHQ08E';
    script.async = true;
    
    // 添加到文档
    document.head.appendChild(script);
    
    // 初始化 Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-KP5VEHQ08E', {
      'send_page_view': false, // 禁用自动页面浏览跟踪，我们将手动跟踪
      'transport_type': 'beacon' // 使用 Beacon API 发送数据，减少对页面卸载的影响
    });
    
    // 将 gtag 函数暴露给全局
    window.gtag = gtag;
    
    // 手动发送初始页面浏览
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
    
    // 清理函数
    return () => {
      // 如果需要，可以在这里清理
    };
  }, []);
  
  return null; // 不需要渲染任何内容，因为我们在 useEffect 中添加了脚本
};

export default GoogleAnalytics; 