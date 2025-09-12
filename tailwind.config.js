/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Picapica专属色彩系统
      colors: {
        picapica: {
          // 基础色彩 - 从浅到深
          50: '#FEFEFF',   // background - 纯净白
          100: '#FCE4EC',  // primary-light - 浅樱花粉
          200: '#F8BBD9',  // primary - 柔和玫瑰粉 (主色)
          300: '#F48FB1',  // highlight - 明亮粉 (强调色)
          400: '#E8B4CB',  // secondary - 薰衣草粉
          500: '#E1A1C7',  // primary-dark - 深玫瑰粉
          600: '#D197B8',  // accent - 高级灰粉
          700: '#A699B5',  // text-muted - 浅紫灰
          800: '#8E7A9B',  // text-light - 中紫灰
          900: '#5D4E75',  // text - 优雅深紫灰 (主文本色)
        },
        // 功能色彩
        success: '#81C784',
        warning: '#FFB74D', 
        error: '#E57373',
        info: '#64B5F6',
      },
      
      // 自定义渐变背景
      backgroundImage: {
        'picapica-primary': 'linear-gradient(135deg, #F8BBD9 0%, #FCE4EC 100%)',
        'picapica-secondary': 'linear-gradient(45deg, #E8B4CB 0%, #F8BBD9 50%, #FCE4EC 100%)',
        'picapica-soft': 'linear-gradient(180deg, rgba(248, 187, 217, 0.1) 0%, rgba(252, 228, 236, 0.05) 100%)',
        'picapica-hero': 'radial-gradient(circle at 40% 60%, rgba(248, 187, 217, 0.12) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(232, 180, 203, 0.08) 0%, transparent 50%)',
        'picapica-navbar': 'linear-gradient(135deg, rgba(248, 187, 217, 0.15) 0%, rgba(252, 228, 236, 0.1) 100%)',
      },
      
      // 自定义阴影系统
      boxShadow: {
        'picapica-soft': '0 4px 20px rgba(248, 187, 217, 0.15)',
        'picapica-medium': '0 8px 30px rgba(248, 187, 217, 0.25)',
        'picapica-strong': '0 12px 40px rgba(248, 187, 217, 0.35)',
        'picapica-hover': '0 12px 40px rgba(248, 187, 217, 0.4)',
      },
      
      // 扩展边框圆角
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      
      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      
      // 自定义动画
      animation: {
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in-up-delay': 'fade-in-up 0.8s ease-out 0.2s both',
        'fade-in-up-delay-2': 'fade-in-up 0.8s ease-out 0.4s both',
        'countdown-pulse': 'countdown-pulse 0.5s ease-in-out alternate infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
      },
      
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
          '50%': { 
            transform: 'scale(1.05)', 
            opacity: '0.95' 
          }
        },
        'fade-in-up': {
          'from': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        'countdown-pulse': {
          'from': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
          'to': { 
            opacity: '0.5',
            transform: 'scale(1.05)' 
          }
        },
        'slide-in-right': {
          'from': { 
            transform: 'translateX(100px)', 
            opacity: '0' 
          },
          'to': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'bounce-gentle': {
          '0%, 100%': { 
            transform: 'translateY(0)' 
          },
          '50%': { 
            transform: 'translateY(-10px)' 
          }
        }
      },
      
      // 自定义断点
      screens: {
        'xs': '480px',
        '3xl': '1600px',
      },
      
      // 自定义字体
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      
      // 自定义透明度
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      },
      
      // 自定义背景透明度
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px',
      },
    }
  },
  plugins: []
}