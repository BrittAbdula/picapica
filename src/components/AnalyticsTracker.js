import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 跟踪路由变化并向分析工具发送页面浏览事件
 */
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // 当路由变化时发送页面浏览事件
    const trackPageView = () => {
      const { pathname, search } = location;
      const pageTitle = document.title;
      
      // 发送到 Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: pageTitle,
          page_location: window.location.href,
          page_path: pathname + search
        });
      }
      
      // 发送到 Clarity (如果需要)
      // Clarity 通常会自动跟踪页面浏览，但如果需要手动跟踪，可以在这里添加代码
    };
    
    // 执行跟踪
    trackPageView();
    
  }, [location]);
  
  return null; // 这个组件不渲染任何内容
};

export default AnalyticsTracker; 