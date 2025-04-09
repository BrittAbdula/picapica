// src/components/PhotoBooth/styles.js

// 主题颜色
export const themeColors = {
    mainPink: "#FFC0CB", // Pink
    lightPink: "#FFF0F5", // Lavender blush
    darkPink: "#FF69B4", // Hot pink
    accentColor: "#FF1493" // Deep pink
  };
  
  // CSS for animations
  export const animationStyles = `
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes countdownEnter {
      from { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes countdownExit {
      from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      to { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    }
    
    @keyframes flash {
      0% { opacity: 0; }
      25% { opacity: 1; }
      50% { opacity: 0.8; }
      75% { opacity: 0.6; }
      100% { opacity: 0; }
    }
    
    /* 超大屏幕样式 */
    @media (min-width: 1600px) {
      .photo-booth {
        padding-top: 80px !important; /* 大屏幕顶部空间更大 */
      }
      
      .photo-container {
        max-width: 1400px !important;
      }
      
      .camera-container {
        max-width: 65% !important;
      }
      
      .preview-side {
        max-width: 250px !important;
      }
    }
  
    @media (max-width: 768px) {
      .countdown-display-overlay {
        font-size: 80px !important;
        width: 120px !important;
        height: 120px !important;
      }
  
      .controls {
        padding: 10px 5px !important;
      }
      
      .filters button, .lighting-presets button {
        padding: 6px 10px !important;
        margin: 3px !important;
        font-size: 12px !important;
      }
      
      .photo-container {
        flex-direction: column !important;
        align-items: center !important;
        padding: 0 10px !important;
      }
      
      .camera-container {
        max-width: 100% !important;
        width: 100% !important;
      }
      
      .preview-side {
        flex-direction: row !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-top: 10px !important;
        overflow-x: auto !important;
        padding-bottom: 5px !important;
        justify-content: center !important;
      }
      
      .side-preview, .preview-side > div {
        width: 120px !important;
        min-width: 120px !important;
        max-width: 120px !important;
      }
      
      .photo-booth {
        padding-top: 20px !important; /* 移动端顶部空间稍小 */
      }
    }
  
    @media (max-width: 480px) {
      .countdown-display-overlay {
        font-size: 60px !important;
        width: 100px !important;
        height: 100px !important;
      }
  
      .controls {
        flex-direction: column !important;
        padding: 10px 0 !important;
      }
  
      .countdown-setting {
        margin-right: 0 !important;
        margin-bottom: 15px !important;
      }
  
      .sound-toggle {
        margin-top: 15px !important;
      }
      
      .filters button, .lighting-presets button {
        padding: 5px 8px !important;
        margin: 2px !important;
        font-size: 11px !important;
      }
      
      .lighting-section h3 {
        font-size: 14px !important;
      }
      
      .side-preview, .preview-side > div {
        width: 100px !important;
        min-width: 100px !important;
        max-width: 100px !important;
      }
      
      .photo-booth {
        padding-top: 30px !important; /* 小屏幕顶部空间更小 */
      }
    }
  `;
  
  // 导航栏颜色处理工具
  export const navigationBarUtils = {
    // 更新导航栏颜色
    updateNavBarColor: (color) => {
      const navElements = document.querySelectorAll('nav, .navbar, header');
      
      if (navElements.length > 0) {
        navElements.forEach(nav => {
          nav.style.backgroundColor = color;
          // 根据背景亮度设置文字颜色
          const isLight = navigationBarUtils.isLightColor(color);
          nav.style.color = isLight ? '#000000' : '#FFFFFF';
          
          // 更新链接颜色
          const links = nav.querySelectorAll('a, button');
          links.forEach(link => {
            link.style.color = isLight ? '#000000' : '#FFFFFF';
          });
        });
      }
    },
  
    // 重置导航栏颜色
    resetNavBarColor: () => {
      const navElements = document.querySelectorAll('nav, .navbar, header');
      if (navElements.length > 0) {
        navElements.forEach(nav => {
          nav.style.backgroundColor = '';
          nav.style.color = '';
          
          const links = nav.querySelectorAll('a, button');
          links.forEach(link => {
            link.style.color = '';
          });
        });
      }
    },
  
    // 判断颜色是亮色还是暗色
    isLightColor: (color) => {
      // 转换 hex 到 RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // 计算亮度（YIQ公式）
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    }
  };