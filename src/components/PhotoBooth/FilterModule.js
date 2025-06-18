
//src/components/PhotoBooth/FilterModule.js
import React, { useState, useEffect, useRef } from 'react';

// 扁平化滤镜列表 - 包含 CSS 滤镜和 GLFX 滤镜，全部使用英文名称
const BASE_FILTERS = [
  { id: 'none', name: 'Original', value: 'none', type: 'css', isPopular: true },
  
  // CSS 滤镜 (保留原有的)
  { id: 'grayscale', name: 'Black & White', value: 'grayscale(100%)', type: 'css', isPopular: false },
  { id: 'sepia', name: 'Sepia', value: 'sepia(100%)', type: 'css', isPopular: false },
  // B&W
  { id: 'b&w', name: 'B&W', value: 'grayscale(100%)', type: 'css', isPopular: true },
  
  // Vintage and effect filters
  { 
    id: 'vintage', 
    name: 'Vintage', 
    value: 'grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)',
    type: 'css',
    isPopular: true
  },
  
  // 新的 GLFX 滤镜 - 女生最爱的滤镜
  { 
    id: 'pelicula-antigua', 
    name: 'Film', 
    value: 'pelicula-antigua',
    type: 'glfx',
    description: 'Classic film effect',
    cssPreview: 'sepia(60%) brightness(110%) contrast(120%) saturate(90%)',
    isPopular: true
  },
  { 
    id: 'coctel', 
    name: 'Rose Gold', 
    value: 'coctel',
    type: 'glfx',
    description: 'Warm rose gold tone',
    cssPreview: 'hue-rotate(-10deg) saturate(140%) brightness(115%) contrast(125%)',
    isPopular: false
  },
  { 
    id: 'camara-espia', 
    name: 'Cool Blue', 
    value: 'camara-espia',
    type: 'glfx',
    description: 'Cool blue tone',
    cssPreview: 'hue-rotate(40deg) saturate(130%) brightness(95%) contrast(130%)',
    isPopular: false
  },
  { 
    id: 'purpura', 
    name: 'Dreamy', 
    value: 'purpura',
    type: 'glfx',
    description: 'Purple dreamy effect',
    cssPreview: 'hue-rotate(-30deg) saturate(150%) brightness(110%) contrast(115%)',
    isPopular: false
  },
  { 
    id: 'bokeh', 
    name: 'Soft Focus', 
    value: 'bokeh',
    type: 'glfx',
    description: 'Soft bokeh green tone',
    cssPreview: 'hue-rotate(15deg) saturate(130%) brightness(110%) blur(0.5px)',
    isPopular: false
  },
  { 
    id: 'fisiograma', 
    name: 'Warm Glow', 
    value: 'fisiograma',
    type: 'glfx',
    description: 'Warm orange glow',
    cssPreview: 'hue-rotate(5deg) saturate(140%) brightness(120%) contrast(120%)',
    isPopular: false
  },
  { 
    id: 'peligro', 
    name: 'High Contrast', 
    value: 'peligro',
    type: 'glfx',
    description: 'Bold high contrast',
    cssPreview: 'contrast(180%) saturate(60%) brightness(100%)',
    isPopular: false
  },
  { 
    id: 'arcoiris', 
    name: 'Rainbow', 
    value: 'arcoiris',
    type: 'glfx',
    description: 'Colorful rainbow effect',
    cssPreview: 'hue-rotate(20deg) saturate(180%) brightness(110%) contrast(130%)',
    isPopular: false
  },
  { 
    id: 'solo-azul', 
    name: 'Ocean Blue', 
    value: 'solo-azul',
    type: 'glfx',
    description: 'Pure blue tone',
    cssPreview: 'hue-rotate(50deg) saturate(160%) brightness(105%) contrast(140%)',
    isPopular: false
  },
  // Warm sunlight effect
  { 
    id: 'soleado', 
    name: 'Sunny', 
    value: 'brightness(120%) contrast(110%) saturate(130%) sepia(30%) hue-rotate(10deg)',
    type: 'css',
    isPopular: false
  },
  // Soft focus effect
  { 
    id: 'enfoqueSuave', 
    name: 'Soft', 
    value: 'brightness(105%) contrast(95%) blur(0.7px)',
    type: 'css',
    isPopular: true
  },
  // Pink effect
  { 
    id: 'rosa', 
    name: 'Pink', 
    value: 'brightness(105%) contrast(110%) saturate(130%) hue-rotate(-30deg)',
    type: 'css',
    isPopular: true
  },
  // Vintage blue tone
  { 
    id: 'retro', 
    name: 'Retro', 
    value: 'brightness(100%) contrast(120%) saturate(110%) hue-rotate(180deg) sepia(20%)',
    type: 'css',
    isPopular: false
  },
  // Cocoa tone
  { 
    id: 'cacao', 
    name: 'Cocoa', 
    value: 'sepia(60%) brightness(105%) contrast(110%) saturate(90%)',
    type: 'css',
    isPopular: false
  },
  // Professional filter
  { 
    id: 'proX', 
    name: 'Pro', 
    value: 'brightness(110%) contrast(115%) saturate(120%) hue-rotate(5deg)',
    type: 'css',
    isPopular: false
  },
  // Green filter
  { 
    id: 'envidia', 
    name: 'Emerald', 
    value: 'brightness(105%) contrast(110%) saturate(120%) hue-rotate(70deg)',
    type: 'css',
    isPopular: false
  },
  // Zinc gray effect
  { 
    id: 'zinc', 
    name: 'Zinc', 
    value: 'grayscale(90%) brightness(110%) contrast(110%) saturate(20%)',
    type: 'css',
    isPopular: false
  },
  // Vivid filter
  { 
    id: 'vivid', 
    name: 'Vivid', 
    value: 'brightness(120%) contrast(120%) saturate(150%) hue-rotate(20deg)',
    type: 'css',
    isPopular: true
  },
  // Moody filter
  { 
    id: 'moody', 
    name: 'Moody', 
    value: 'brightness(90%) contrast(110%) saturate(90%) hue-rotate(-10deg)',
    type: 'css',
    isPopular: false
  },
  // Portrait filter
  { 
    id: 'portrait', 
    name: 'Portrait', 
    value: 'brightness(110%) contrast(130%) saturate(120%) hue-rotate(5deg) blur(0.2px)',
    type: 'css',
    isPopular: false
  },
  // 更多类似 webcam toy 的滤镜效果
  { 
    id: 'alienígena', 
    name: 'Alien', 
    value: 'hue-rotate(120deg) saturate(200%) brightness(120%) contrast(150%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'baya', 
    name: 'Berry', 
    value: 'hue-rotate(-20deg) saturate(160%) brightness(110%) contrast(130%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'luz', 
    name: 'Light', 
    value: 'brightness(140%) contrast(110%) saturate(120%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'caricatura', 
    name: 'Cartoon', 
    value: 'contrast(150%) saturate(180%) brightness(110%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'cítrico', 
    name: 'Citrus', 
    value: 'hue-rotate(30deg) saturate(170%) brightness(115%) contrast(120%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'disco', 
    name: 'Disco', 
    value: 'hue-rotate(180deg) saturate(200%) brightness(130%) contrast(140%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'fuego', 
    name: 'Fire', 
    value: 'hue-rotate(-30deg) saturate(180%) brightness(120%) contrast(140%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'ojo-de-pez', 
    name: 'Fisheye', 
    value: 'brightness(110%) contrast(130%) saturate(140%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'glitch', 
    name: 'Glitch', 
    value: 'hue-rotate(90deg) saturate(300%) brightness(120%) contrast(200%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'aureola', 
    name: 'Halo', 
    value: 'brightness(130%) contrast(90%) saturate(80%) blur(0.3px)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'lomo', 
    name: 'Lomo', 
    value: 'contrast(130%) brightness(110%) saturate(140%) sepia(20%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'menta', 
    name: 'Mint', 
    value: 'hue-rotate(60deg) saturate(130%) brightness(115%) contrast(110%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'neón', 
    name: 'Neon', 
    value: 'saturate(200%) brightness(130%) contrast(160%) hue-rotate(45deg)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'visión-nocturna', 
    name: 'Night Vision', 
    value: 'hue-rotate(80deg) saturate(300%) brightness(130%) contrast(150%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'pop-art', 
    name: 'Pop Art', 
    value: 'contrast(200%) saturate(250%) brightness(110%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'destello', 
    name: 'Sparkle', 
    value: 'brightness(140%) contrast(120%) saturate(150%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'espectro', 
    name: 'Spectrum', 
    value: 'hue-rotate(270deg) saturate(200%) brightness(120%) contrast(140%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'termal', 
    name: 'Thermal', 
    value: 'hue-rotate(200deg) saturate(300%) brightness(110%) contrast(180%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'subacuático', 
    name: 'Underwater', 
    value: 'hue-rotate(180deg) saturate(150%) brightness(90%) contrast(120%)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'acuarela', 
    name: 'Watercolor', 
    value: 'contrast(90%) saturate(120%) brightness(110%) blur(0.4px)',
    type: 'css',
    isPopular: false
  },
  { 
    id: 'rayos-x', 
    name: 'X-Ray', 
    value: 'invert(100%) contrast(200%) brightness(150%)',
    type: 'css',
    isPopular: false
  }
];

// 获取常用滤镜 - 女生最爱的4个
const getPopularFilters = () => BASE_FILTERS.filter(filter => filter.isPopular);

// 获取其他滤镜 - 除了常用的其他滤镜
const getOtherFilters = () => BASE_FILTERS.filter(filter => !filter.isPopular);

// 实际显示的滤镜列表（添加了随机滤镜）
const FILTERS = [
  { id: 'random', name: 'Random', value: 'random', isSpecial: true },
  ...BASE_FILTERS
];

// 获取滤镜列表
const getAllFilters = () => FILTERS;

// 根据ID获取滤镜
const getFilterById = (filterId) => {
  return FILTERS.find(filter => filter.id === filterId) || 
         { id: 'none', name: 'Original', value: 'none', type: 'css' };
};

// 随机选择滤镜（不包括 none 和 random）
const getRandomFilter = () => {
  // 过滤掉 none 滤镜和 random 滤镜
  const filterPool = BASE_FILTERS.filter(filter => filter.id !== 'none');
  const randomIndex = Math.floor(Math.random() * filterPool.length);
  return filterPool[randomIndex];
};

// 滤镜预览覆盖层组件 - 导出供外部使用
const FilterPreviewOverlay = ({ isOpen, onClose, activeFilter, onFilterChange, videoRef }) => {
  const previewVideoRefs = useRef({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [allOtherFilters, setAllOtherFilters] = useState([]);

  // 初始化其他滤镜列表
  useEffect(() => {
    const otherFilters = getOtherFilters();
    setAllOtherFilters(otherFilters);
  }, []);

  // 选择要展示的 9 个滤镜
  useEffect(() => {
    if (isOpen && allOtherFilters.length > 0) {
      const startIndex = currentPage * 9;
      const endIndex = startIndex + 9;
      const pageFilters = allOtherFilters.slice(startIndex, endIndex);
      
      // 如果当前页不足9个，用之前的滤镜补齐
      while (pageFilters.length < 9 && allOtherFilters.length > 0) {
        const remainingIndex = pageFilters.length + startIndex - allOtherFilters.length;
        if (remainingIndex >= 0) {
          pageFilters.push(allOtherFilters[remainingIndex % allOtherFilters.length]);
        } else {
          break;
        }
      }
      
      setSelectedFilters(pageFilters);
    }
  }, [isOpen, currentPage, allOtherFilters]);

  const totalPages = Math.ceil(allOtherFilters.length / 9);

  const goToPrevPage = () => {
    setCurrentPage(prev => prev === 0 ? totalPages - 1 : prev - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(254, 254, 255, 0.98), rgba(248, 187, 217, 0.95), rgba(252, 228, 236, 0.98))',
      backdropFilter: 'blur(20px)',
      zIndex: 99999, // 提高层级确保在最顶层
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // 垂直居中
      alignItems: 'center', // 水平居中
      padding: '0',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* 头部 */}
      <div className="filter-preview-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        background: 'rgba(248, 187, 217, 0.1)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '1200px',
        borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(248, 187, 217, 0.2)',
        borderBottom: 'none'
      }}>
        <h2 style={{
          color: '#5D4E75',
          fontSize: '28px',
          fontWeight: '700',
          margin: 0,
          background: 'linear-gradient(135deg, #F8BBD9 0%, #E8B4CB 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Choose Your Filter</h2>
        <button
          onClick={onClose}
          className="filter-preview-close"
          style={{
            background: 'linear-gradient(135deg, #F8BBD9, #E8B4CB)',
            border: '2px solid rgba(248, 187, 217, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: '#5D4E75',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(248, 187, 217, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #E8B4CB, #D197B8)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(248, 187, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #F8BBD9, #E8B4CB)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(248, 187, 217, 0.3)';
          }}
        >
          ×
        </button>
      </div>

      {/* 3x3 滤镜网格容器 */}
      <div style={{
        background: 'rgba(254, 254, 255, 0.95)',
        borderRadius: '0 0 16px 16px',
        border: '1px solid rgba(248, 187, 217, 0.2)',
        borderTop: 'none',
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(248, 187, 217, 0.2)'
      }}>
        {/* 3x3 滤镜网格 */}
        <div className="filter-preview-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '16px', // 固定间距
          padding: '24px', // 增加内边距
          overflow: 'hidden',
          width: '100%',
          maxWidth: '900px', // 限制网格最大宽度
          alignItems: 'center',
          justifyItems: 'center'
        }}>
        {selectedFilters.map((filter, index) => {
          const isSelected = activeFilter === filter.value;
          
          return (
            <div
              key={filter.id}
              className="filter-preview-item"
              onClick={() => {
                onFilterChange(filter.value, filter);
                onClose();
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected ? '3px solid #F8BBD9' : '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px', // 增加圆角
                boxShadow: isSelected 
                  ? '0 8px 32px rgba(248, 187, 217, 0.6), inset 0 0 20px rgba(248, 187, 217, 0.2)' 
                  : '0 6px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                background: 'rgba(0, 0, 0, 0.3)',
                aspectRatio: '4/3', // 确保4:3比例
                width: '100%',
                maxWidth: '280px', // 限制最大宽度
                height: 'auto',
                backdropFilter: 'blur(4px)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(248, 187, 217, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(248, 187, 217, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
            >
              {/* 实时视频预览 - 4:3尺寸 */}
              <video
                ref={(el) => {
                  if (el && videoRef?.current) {
                    // 克隆主视频流到预览视频
                    el.srcObject = videoRef.current.srcObject;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: '4/3', // 强制4:3比例
                  transform: 'scaleX(-1)', // 镜像效果
                  borderRadius: '8px', // 内容圆角稍小
                  filter: (() => {
                    if (filter.type === 'css' && filter.value !== 'none') {
                      return filter.value;
                    } else if (filter.type === 'glfx' && filter.cssPreview) {
                      return filter.cssPreview;
                    }
                    return 'none';
                  })()
                }}
              />

              {/* 渐变遮罩层 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, transparent 75%, rgba(0, 0, 0, 0.8) 100%)',
                borderRadius: '8px',
                pointerEvents: 'none'
              }} />

                            {/* 滤镜名称覆盖层 */}
              <div className="filter-preview-name" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'transparent', // 移除背景，使用渐变遮罩
                color: 'white',
                padding: '8px 6px',
                textAlign: 'center',
                borderRadius: '0 0 8px 8px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '0.3px',
                  lineHeight: '1.2'
                }}>
                  {filter.name}
                </div>
                </div>

              {/* 选中指示器 */}
              {isSelected && (
                <>
                  <div className="filter-preview-selected" style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #F8BBD9, #E8B4CB)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#5D4E75',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(248, 187, 217, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    ✓
                  </div>
                  {/* 选中边框动画 */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    border: '2px solid #F8BBD9',
                    borderRadius: '8px',
                    animation: 'pulseGlow 2s ease-in-out infinite',
                    pointerEvents: 'none'
                  }} />
                </>
              )}

              {/* 点击涟漪效果 */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'transparent',
                borderRadius: '16px',
                transition: 'background 0.2s ease'
              }} 
              onMouseDown={(e) => {
                e.currentTarget.style.background = 'rgba(248, 187, 217, 0.15)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              />
            </div>
          );
        })}
        </div>
      </div>

      {/* 底部导航 */}
      <div style={{
        padding: '20px 30px',
        background: 'rgba(248, 187, 217, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        borderRadius: '0 0 16px 16px',
        border: '1px solid rgba(248, 187, 217, 0.2)',
        borderTop: 'none',
        marginTop: '-1px'
      }}>
        {/* 左箭头 */}
        <button
          onClick={goToPrevPage}
          style={{
            background: 'linear-gradient(135deg, #F8BBD9, #E8B4CB)',
            border: '2px solid rgba(248, 187, 217, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: '#5D4E75',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(248, 187, 217, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #E8B4CB, #D197B8)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(248, 187, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #F8BBD9, #E8B4CB)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(248, 187, 217, 0.3)';
          }}
        >
          ←
        </button>

        {/* 页面指示器和提示文字 */}
        <div style={{
          textAlign: 'center',
          color: '#5D4E75',
          fontSize: '14px'
        }}>
          <div style={{ marginBottom: '5px', fontWeight: '500' }}>
            Tap any filter to apply it instantly
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, color: '#8E7A9B' }}>
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>

        {/* 右箭头 */}
        <button
          onClick={goToNextPage}
          style={{
            background: 'linear-gradient(135deg, #F8BBD9, #E8B4CB)',
            border: '2px solid rgba(248, 187, 217, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: '#5D4E75',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(248, 187, 217, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #E8B4CB, #D197B8)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(248, 187, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #F8BBD9, #E8B4CB)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(248, 187, 217, 0.3)';
          }}
        >
          →
        </button>
      </div>

      <style>
        {`
          @keyframes pulseGlow {
            0% { 
              opacity: 1;
              box-shadow: 0 0 5px #F8BBD9;
            }
            50% { 
              opacity: 0.7;
              box-shadow: 0 0 20px #F8BBD9, 0 0 30px rgba(248, 187, 217, 0.5);
            }
            100% { 
              opacity: 1;
              box-shadow: 0 0 5px #F8BBD9;
            }
          }

          /* 移动端优化 */
          @media (max-width: 768px) {
            .filter-preview-overlay {
              padding: 10px !important;
            }
            
            .filter-preview-grid {
              gap: 12px !important;
              padding: 16px !important;
              max-width: 95vw !important;
            }
            
            .filter-preview-item {
              border-radius: 12px !important;
              max-width: none !important;
            }
            
            .filter-preview-header {
              padding: 15px 20px !important;
              border-radius: 12px 12px 0 0 !important;
            }
            
            .filter-preview-header h2 {
              font-size: 22px !important;
            }
            
            .filter-preview-close {
              width: 40px !important;
              height: 40px !important;
              font-size: 20px !important;
            }
            
            .filter-preview-name {
              font-size: 11px !important;
              padding: 6px 4px !important;
            }
            
            .filter-preview-enhanced {
              font-size: 10px !important;
            }
            
            .filter-preview-selected {
              width: 28px !important;
              height: 28px !important;
              font-size: 14px !important;
              top: 8px !important;
              right: 8px !important;
            }
          }
          
          @media (max-width: 480px) {
            .filter-preview-overlay {
              padding: 8px !important;
            }
            
            .filter-preview-grid {
              gap: 10px !important;
              padding: 14px !important;
              max-width: 98vw !important;
            }
            
            .filter-preview-item {
              border-radius: 10px !important;
            }
            
            .filter-preview-name {
              font-size: 10px !important;
              padding: 6px 4px !important;
            }
            
            .filter-preview-enhanced {
              font-size: 9px !important;
            }
            
            .filter-preview-selected {
              width: 24px !important;
              height: 24px !important;
              font-size: 12px !important;
              top: 6px !important;
              right: 6px !important;
            }
            
            .filter-preview-header {
              padding: 12px 16px !important;
              border-radius: 10px 10px 0 0 !important;
            }
            
            .filter-preview-header h2 {
              font-size: 20px !important;
            }
            
            .filter-preview-close {
              width: 36px !important;
              height: 36px !important;
              font-size: 18px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

// 滤镜选择器组件 - 移除内部的FilterPreviewOverlay
const FilterSelector = ({ activeFilter, onFilterChange, theme, onShowMoreFilters }) => {
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [diceValue, setDiceValue] = useState('⚀');
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  
  // 骰子动画效果
  const rollDice = () => {
    // 骰子面
    const diceValues = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    setIsRollingDice(true);
    
    let rollCount = 0;
    const maxRolls = 10; // 滚动次数
    
    const rollInterval = setInterval(() => {
      // 随机选择一个骰子面
      const randomIndex = Math.floor(Math.random() * diceValues.length);
      setDiceValue(diceValues[randomIndex]);
      
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRollingDice(false);
        
        // 选择一个随机滤镜
        const randomFilter = getRandomFilter();
        onFilterChange(randomFilter.value, randomFilter);
      }
    }, 100); // 每100毫秒切换一次骰子
  };

  // 处理滤镜改变
  const handleFilterChange = (filterValue, filterOption) => {
    // 如果选择了随机滤镜
    if (filterOption && filterOption.id === 'random') {
      rollDice();
    } else {
      // 应用选定的滤镜
      onFilterChange(filterValue, filterOption);
    }
  };

  // 获取要显示的滤镜列表（女生最爱的4个 + Random）
  const popularFilters = [
    { id: 'random', name: 'Random', value: 'random', isSpecial: true },
    ...getPopularFilters()
  ];

  // 切换到上一个滤镜
  const goToPrevFilter = () => {
    const newIndex = currentFilterIndex === 0 ? popularFilters.length - 1 : currentFilterIndex - 1;
    setCurrentFilterIndex(newIndex);
    const selectedFilter = popularFilters[newIndex];
    handleFilterChange(selectedFilter.value, selectedFilter);
  };

  // 切换到下一个滤镜
  const goToNextFilter = () => {
    const newIndex = currentFilterIndex === popularFilters.length - 1 ? 0 : currentFilterIndex + 1;
    setCurrentFilterIndex(newIndex);
    const selectedFilter = popularFilters[newIndex];
    handleFilterChange(selectedFilter.value, selectedFilter);
  };

  // 更新当前滤镜索引
  useEffect(() => {
    const currentIndex = popularFilters.findIndex(filter => filter.value === activeFilter);
    if (currentIndex !== -1) {
      setCurrentFilterIndex(currentIndex);
    }
  }, [activeFilter, popularFilters]);

  return (
    <div className="filter-selector">
      <style>
        {`
          @media (max-width: 768px) {
            .filter-button {
              flex-basis: calc(50% - 20px); /* Adjust based on gap and desired spacing */
              margin: 4px !important; /* Reduce margin for tighter fit */
              padding: 8px 5px !important; /* Adjust padding if needed */
              font-size: 13px !important; /* Slightly smaller font for mobile */
              text-align: center;
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spinning-dice {
            display: inline-block;
            animation: spin 0.5s linear infinite;
          }

          .glfx-filter {
            position: relative;
          }

          .glfx-filter::after {
            content: '✨';
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 10px;
            opacity: 0.8;
          }

          /* Special More Button Animations */
          @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .more-button {
            position: relative;
            overflow: hidden;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #98D8C8);
            background-size: 400% 400%;
            animation: rainbow 3s ease infinite;
            color: white !important;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            border: none !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.1) inset;
            transition: all 0.3s ease;
          }

          .more-button:hover {
            animation: rainbow 1s ease infinite, pulse 0.6s ease infinite;
            box-shadow: 0 6px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.2) inset;
            transform: translateY(-2px);
          }

          .more-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
          }

          .more-button::after {
            content: '✨';
            position: absolute;
            top: 2px;
            right: 4px;
            font-size: 12px;
            animation: pulse 1.5s ease infinite;
          }
        `}
      </style>
      {/* 标题区域带左右切换按钮 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '15px',
        gap: '15px'
      }}>
        {/* 左切换按钮 */}
        <button
          onClick={goToPrevFilter}
          style={{
            background: 'linear-gradient(135deg, #F8BBD9, #E8B4CB)',
            border: '2px solid rgba(248, 187, 217, 0.3)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#5D4E75',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(248, 187, 217, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #E8B4CB, #D197B8)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(248, 187, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #F8BBD9, #E8B4CB)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(248, 187, 217, 0.3)';
          }}
        >
          ‹
        </button>

        {/* 标题 */}
        <h3 style={{ 
          textAlign: 'center', 
          margin: 0, 
          color: '#5D4E75',
          fontSize: '18px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #F8BBD9 0%, #E8B4CB 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Photo Filters
        </h3>

        {/* 右切换按钮 */}
        <button
          onClick={goToNextFilter}
          style={{
            background: 'linear-gradient(135deg, #F8BBD9, #E8B4CB)',
            border: '2px solid rgba(248, 187, 217, 0.3)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#5D4E75',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(248, 187, 217, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #E8B4CB, #D197B8)';
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(248, 187, 217, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #F8BBD9, #E8B4CB)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(248, 187, 217, 0.3)';
          }}
        >
          ›
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {popularFilters.map((filterOption) => (
          <button
            key={filterOption.id}
            className={`filter-button ${filterOption.type === 'glfx' ? 'glfx-filter' : ''}`}
            onClick={() => handleFilterChange(filterOption.value, filterOption)}
            title={filterOption.description || filterOption.name}
            style={{
              backgroundColor: activeFilter === filterOption.value ? theme.mainPink : '#f0f0f0',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              border: activeFilter === filterOption.value ? `2px solid ${theme.accentColor}` : '1px solid #ccc',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: activeFilter === filterOption.value ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              flexGrow: 1,
              flexShrink: 1,
              position: 'relative'
            }}
          >
            {filterOption.id === 'random' ? (
              <>
                {isRollingDice ? (
                  <span className="spinning-dice" style={{ fontSize: '18px' }}>
                    {diceValue}
                  </span>
                ) : (
                  <span style={{ fontSize: '18px' }}>🎲</span>
                )}
                <span style={{ marginLeft: '5px' }}>
                  {filterOption.name}
                </span>
              </>
            ) : (
              filterOption.name
            )}
          </button>
        ))}
        
        {/* Special More 按钮 */}
        <button
          onClick={onShowMoreFilters}
          className="more-button"
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            flexGrow: 1,
            flexShrink: 1,
            position: 'relative'
          }}
        >
          🌈 More Filters
        </button>
      </div>
    </div>
  );
};

export { FilterSelector, FilterPreviewOverlay, FILTERS, getAllFilters, getFilterById, getRandomFilter };