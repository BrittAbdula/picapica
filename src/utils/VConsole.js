import { useEffect } from 'react';

const VConsoleComponent = () => {
  useEffect(() => {
    const initVConsole = async () => {
      try {
        // 检查 URL 参数
        const urlParams = new URLSearchParams(window.location.search);
        const debugMode = urlParams.get('debug') === 'true';
        
        // 判断是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 在开发环境、移动设备上或通过 URL 参数启用时加载 vConsole
        if (process.env.NODE_ENV !== 'production') {
          const { default: VConsole } = await import('vconsole');
          const vConsole = new VConsole({ 
            theme: 'dark',
            maxLogNumber: 1000,
            // 默认显示 Log 面板
            defaultPlugins: ['system', 'network', 'element', 'storage'],
            onReady: () => {
              console.log('vConsole 已准备就绪');
              
              // 添加设备信息日志
              console.info('设备信息:', {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                devicePixelRatio: window.devicePixelRatio,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
              });
            }
          });
          
          console.log('vConsole 已启用', vConsole);
          window.vConsole = vConsole;
        }
      } catch (error) {
        console.error('vConsole 初始化失败:', error);
      }
    };
    
    initVConsole();
    
    // 清理函数
    return () => {
      if (window.vConsole) {
        window.vConsole.destroy();
        window.vConsole = undefined;
      }
    };
  }, []);
  
  return null; // 此组件不渲染任何内容
};

export default VConsoleComponent; 
