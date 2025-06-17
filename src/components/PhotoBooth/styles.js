// src/components/PhotoBooth/styles.js

// 优雅粉色系主题颜色
export const themeColors = {
    // 主要粉色系 - 更加优雅和自然
    primary: "#F8BBD9",           // 柔和玫瑰粉
    primaryLight: "#FCE4EC",      // 浅樱花粉
    primaryDark: "#E1A1C7",       // 深玫瑰粉
    
    // 辅助色系
    secondary: "#E8B4CB",         // 薰衣草粉
    accent: "#D197B8",            // 高级灰粉
    highlight: "#F48FB1",         // 明亮粉作为强调色
    
    // 中性色系
    background: "#FEFEFF",        // 纯净白
    surface: "rgba(248, 187, 217, 0.05)", // 极淡粉色表面
    text: "#5D4E75",              // 优雅的深紫灰
    textLight: "#8E7A9B",         // 浅紫灰
    
    // 渐变色
    gradientPrimary: "linear-gradient(135deg, #F8BBD9 0%, #FCE4EC 100%)",
    gradientSecondary: "linear-gradient(45deg, #E8B4CB 0%, #F8BBD9 50%, #FCE4EC 100%)",
    gradientSoft: "linear-gradient(180deg, rgba(248, 187, 217, 0.1) 0%, rgba(252, 228, 236, 0.05) 100%)",
    
    // 功能色
    success: "#81C784",
    warning: "#FFB74D",
    error: "#E57373",
    info: "#64B5F6",
    
    // 兼容旧版本
    mainPink: "#F8BBD9",
    lightPink: "#FCE4EC",
    darkPink: "#E1A1C7",
    accentColor: "#F48FB1"
};
  
  // 优化的CSS动画和样式
  export const animationStyles = `
    :root {
      --primary: #F8BBD9;
      --primary-light: #FCE4EC;
      --primary-dark: #E1A1C7;
      --secondary: #E8B4CB;
      --accent: #D197B8;
      --highlight: #F48FB1;
      --background: #FEFEFF;
      --surface: rgba(248, 187, 217, 0.05);
      --text: #5D4E75;
      --text-light: #8E7A9B;
      --shadow-soft: 0 4px 20px rgba(248, 187, 217, 0.15);
      --shadow-medium: 0 8px 30px rgba(248, 187, 217, 0.25);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
    }

    @keyframes pulseGentle {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.95; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes countdownEnter {
      from { 
        transform: translate(-50%, -50%) scale(1.3); 
        opacity: 0; 
        filter: blur(4px);
      }
      to { 
        transform: translate(-50%, -50%) scale(1); 
        opacity: 1; 
        filter: blur(0px);
      }
    }
    
    @keyframes countdownExit {
      from { 
        transform: translate(-50%, -50%) scale(1); 
        opacity: 1; 
        filter: blur(0px);
      }
      to { 
        transform: translate(-50%, -50%) scale(0.8); 
        opacity: 0; 
        filter: blur(2px);
      }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes buttonHover {
      0% { transform: translateY(0px); box-shadow: var(--shadow-soft); }
      100% { transform: translateY(-2px); box-shadow: var(--shadow-medium); }
    }

    /* 全局美化样式 */
    .elegant-button {
      background: linear-gradient(135deg, #F8BBD9 0%, #FCE4EC 100%);
      color: var(--text);
      border: none;
      border-radius: var(--radius-md);
      padding: 12px 24px;
      font-weight: 500;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-soft);
      position: relative;
      overflow: hidden;
    }

    .elegant-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s;
    }

    .elegant-button:hover::before {
      left: 100%;
    }

    .elegant-button:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }

    .elegant-button:active {
      transform: translateY(0px);
      box-shadow: var(--shadow-soft);
    }

    .elegant-card {
      background: var(--background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-soft);
      padding: 20px;
      border: 1px solid rgba(248, 187, 217, 0.1);
      backdrop-filter: blur(10px);
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