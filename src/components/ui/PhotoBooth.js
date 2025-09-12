// Picapica PhotoBooth Components - 使用Tailwind CSS重构
// 核心拍照组件，统一样式管理

import React, { useState, useEffect, useRef } from 'react';
import { Button, LightingButton, CustomColorButton } from './Button';

/**
 * 主拍照亭容器组件
 * @param {Object} props
 * @param {Array} props.capturedImages - 已拍摄的图片数组
 * @param {Function} props.onImagesChange - 图片变化回调
 * @param {Object} props.frameConfig - 相框配置
 */
export const PhotoBoothContainer = ({ capturedImages, onImagesChange, frameConfig }) => {
  return (
    <div className="min-h-screen bg-picapica-soft py-8">
      <div className="container-main">
        <div className="camera-container">
          {/* 相机主体区域 */}
          <CameraSection frameConfig={frameConfig} />
          
          {/* 控制面板 */}
          <ControlPanel />
          
          {/* 照片预览区域 */}
          <PhotoPreviewSection 
            capturedImages={capturedImages}
            onImagesChange={onImagesChange}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 相机区域组件
 * @param {Object} props
 * @param {Object} props.frameConfig - 相框配置
 */
export const CameraSection = ({ frameConfig }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [countdown, setCountdown] = useState(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* 视频显示区域 */}
      <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-picapica-medium">
        <video
          ref={videoRef}
          className="video-feed w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        
        {/* 相框预览叠加层 */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* 倒计时显示 */}
        {countdown && (
          <CountdownOverlay countdown={countdown} />
        )}
        
        {/* 相机状态指示器 */}
        <CameraStatusIndicator isStreaming={isStreaming} />
      </div>

      {/* 相机控制按钮 */}
      <div className="flex justify-center mt-6 gap-4">
        <Button
          variant="primary"
          size="lg"
          className="px-8 py-4 text-lg font-semibold"
        >
          📸 拍摄照片
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
        >
          🎬 开始录像
        </Button>
      </div>
    </div>
  );
};

/**
 * 倒计时叠加层组件
 * @param {Object} props
 * @param {number} props.countdown - 倒计时数字
 */
export const CountdownOverlay = ({ countdown }) => {
  return (
    <div className="countdown-overlay">
      <div className="text-8xl font-bold animate-countdown-pulse">
        {countdown}
      </div>
    </div>
  );
};

/**
 * 相机状态指示器
 * @param {Object} props
 * @param {boolean} props.isStreaming - 是否正在流式传输
 */
export const CameraStatusIndicator = ({ isStreaming }) => {
  return (
    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
      <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
      <span className="text-white text-sm font-medium">
        {isStreaming ? '直播中' : '离线'}
      </span>
    </div>
  );
};

/**
 * 控制面板组件
 */
export const ControlPanel = () => {
  const [currentFilter, setCurrentFilter] = useState('none');
  const [backgroundLighting, setBackgroundLighting] = useState('#F8BBD9');
  const [countdownDuration, setCountdownDuration] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
      {/* 滤镜选择区域 */}
      <FilterSection 
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
      
      {/* 背景灯光控制 */}
      <BackgroundLightingSection
        currentColor={backgroundLighting}
        onColorChange={setBackgroundLighting}
      />
      
      {/* 高级设置 */}
      <AdvancedSettingsSection
        countdownDuration={countdownDuration}
        onCountdownChange={setCountdownDuration}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
      />
    </div>
  );
};

/**
 * 滤镜选择区域
 * @param {Object} props
 * @param {string} props.currentFilter - 当前滤镜
 * @param {Function} props.onFilterChange - 滤镜变化回调
 */
export const FilterSection = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'none', name: '无滤镜', preview: 'bg-gray-200' },
    { id: 'sepia', name: '复古', preview: 'bg-amber-200' },
    { id: 'grayscale', name: '黑白', preview: 'bg-gray-400' },
    { id: 'vintage', name: '怀旧', preview: 'bg-orange-200' },
    { id: 'blur', name: '模糊', preview: 'bg-blue-200' },
    { id: 'contrast', name: '对比', preview: 'bg-purple-200' },
  ];

  return (
    <div className="elegant-card">
      <h3 className="text-lg font-semibold text-picapica-900 mb-4">📸 滤镜效果</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              relative p-3 rounded-xl transition-all duration-200
              border-2 hover:-translate-y-1 hover:shadow-md
              ${currentFilter === filter.id 
                ? 'border-picapica-300 bg-picapica-100 shadow-picapica-soft' 
                : 'border-picapica-200 bg-white hover:border-picapica-300'
              }
            `}
          >
            {/* 滤镜预览 */}
            <div className={`w-full h-16 rounded-lg mb-2 ${filter.preview}`} />
            
            {/* 滤镜名称 */}
            <span className="text-sm font-medium text-picapica-800">{filter.name}</span>
            
            {/* 选中状态指示器 */}
            {currentFilter === filter.id && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-picapica-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 背景灯光控制区域
 * @param {Object} props
 * @param {string} props.currentColor - 当前颜色
 * @param {Function} props.onColorChange - 颜色变化回调
 */
export const BackgroundLightingSection = ({ currentColor, onColorChange }) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const presetColors = [
    { name: '粉色', color: '#F8BBD9' },
    { name: '紫色', color: '#E1A1C7' },
    { name: '蓝色', color: '#64B5F6' },
    { name: '绿色', color: '#81C784' },
    { name: '橙色', color: '#FFB74D' },
    { name: '红色', color: '#E57373' },
    { name: '白色', color: '#FFFFFF' },
    { name: '黑色', color: '#000000' },
  ];

  return (
    <div className="elegant-card">
      <h3 className="text-lg font-semibold text-picapica-900 mb-4">💡 背景灯光</h3>
      
      {/* 预设颜色 */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
        {presetColors.map(preset => (
          <LightingButton
            key={preset.color}
            color={preset.color}
            active={currentColor === preset.color}
            onClick={() => onColorChange(preset.color)}
            className="aspect-square"
          >
            <span className="sr-only">{preset.name}</span>
          </LightingButton>
        ))}
      </div>
      
      {/* 自定义颜色选择器 */}
      <div className="border-t border-picapica-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-picapica-800">自定义颜色</span>
          
          <div className="flex items-center space-x-3">
            {showCustomPicker && (
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 rounded border-0 cursor-pointer"
              />
            )}
            
            <CustomColorButton
              onClick={() => setShowCustomPicker(!showCustomPicker)}
            >
              {showCustomPicker ? '隐藏' : '自定义'}
            </CustomColorButton>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 高级设置区域
 * @param {Object} props
 * @param {number} props.countdownDuration - 倒计时时长
 * @param {Function} props.onCountdownChange - 倒计时变化回调
 * @param {boolean} props.soundEnabled - 是否启用声音
 * @param {Function} props.onSoundToggle - 声音切换回调
 */
export const AdvancedSettingsSection = ({ 
  countdownDuration, 
  onCountdownChange, 
  soundEnabled, 
  onSoundToggle 
}) => {
  return (
    <div className="elegant-card">
      <h3 className="text-lg font-semibold text-picapica-900 mb-4">⚙️ 高级设置</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 倒计时设置 */}
        <div>
          <label className="block text-sm font-medium text-picapica-800 mb-2">
            倒计时时长
          </label>
          <div className="flex items-center space-x-3">
            {[1, 2, 3, 5].map(duration => (
              <button
                key={duration}
                onClick={() => onCountdownChange(duration)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200 min-w-12
                  ${countdownDuration === duration
                    ? 'bg-picapica-300 text-white shadow-picapica-soft'
                    : 'bg-picapica-50 text-picapica-700 hover:bg-picapica-100'
                  }
                `}
              >
                {duration}s
              </button>
            ))}
          </div>
        </div>
        
        {/* 声音设置 */}
        <div>
          <label className="block text-sm font-medium text-picapica-800 mb-2">
            快门声音
          </label>
          <button
            onClick={() => onSoundToggle(!soundEnabled)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-all duration-200
              ${soundEnabled
                ? 'bg-picapica-300 text-white shadow-picapica-soft'
                : 'bg-picapica-50 text-picapica-700 hover:bg-picapica-100'
              }
            `}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span>{soundEnabled ? '开启' : '关闭'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 照片预览区域
 * @param {Object} props
 * @param {Array} props.capturedImages - 已拍摄图片
 * @param {Function} props.onImagesChange - 图片变化回调
 */
export const PhotoPreviewSection = ({ capturedImages, onImagesChange }) => {
  if (capturedImages.length === 0) {
    return (
      <div className="elegant-card text-center py-12">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-picapica-700 text-lg">还没有拍摄照片</p>
        <p className="text-picapica-600 text-sm mt-2">点击上方按钮开始拍照吧！</p>
      </div>
    );
  }

  return (
    <div className="elegant-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-picapica-900">
          📸 已拍摄照片 ({capturedImages.length})
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onImagesChange([])}
        >
          清空
        </Button>
      </div>
      
      <div className="photo-grid">
        {capturedImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={`照片 ${index + 1}`}
              className="photo-item"
            />
            
            {/* 删除按钮 */}
            <button
              onClick={() => {
                const newImages = capturedImages.filter((_, i) => i !== index);
                onImagesChange(newImages);
              }}
              className="
                absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white
                rounded-full flex items-center justify-center text-xs
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:bg-red-600 shadow-md
              "
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {/* 生成照片条按钮 */}
      {capturedImages.length >= 4 && (
        <div className="mt-6 text-center">
          <Button variant="primary" size="lg">
            🎞️ 生成照片条
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoBoothContainer;