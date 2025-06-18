import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 页面跳转时滚动到顶部
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;