// Picapica UI Components - 统一导出
// 使用Tailwind CSS构建的设计系统组件库

// 基础UI组件
import {
  Button,
  LightingButton,
  CustomColorButton,
  FloatingActionButton,
  IconButton
} from './Button';

export {
  Button,
  LightingButton,
  CustomColorButton,
  FloatingActionButton,
  IconButton
};

import { Navbar } from './Navbar';
export { Navbar };

// PhotoBooth相关组件
import {
  PhotoBoothContainer,
  CameraSection,
  CountdownOverlay,
  CameraStatusIndicator,
  ControlPanel,
  FilterSection,
  BackgroundLightingSection,
  AdvancedSettingsSection,
  PhotoPreviewSection
} from './PhotoBooth';

export {
  PhotoBoothContainer,
  CameraSection,
  CountdownOverlay,
  CameraStatusIndicator,
  ControlPanel,
  FilterSection,
  BackgroundLightingSection,
  AdvancedSettingsSection,
  PhotoPreviewSection
};

// 通用布局组件
export const Container = ({ children, className = '' }) => (
  <div className={`container-main ${className}`}>
    {children}
  </div>
);

export const CenteredContainer = ({ children, className = '' }) => (
  <div className={`container-centered ${className}`}>
    {children}
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`elegant-card ${className}`}>
    {children}
  </div>
);

// 加载状态组件
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`} />
  );
};

// 提示消息组件
export const Alert = ({ type = 'info', children, className = '' }) => {
  const typeClasses = {
    error: 'alert-error',
    success: 'alert-success',
    info: 'alert-info'
  };

  return (
    <div className={`${typeClasses[type]} ${className}`}>
      {children}
    </div>
  );
};

// Gallery相关组件
export const MasonryGrid = ({ children, className = '' }) => (
  <div className={`masonry-grid ${className}`}>
    {children}
  </div>
);

export const MasonryItem = ({ children, className = '' }) => (
  <div className={`masonry-item ${className}`}>
    {children}
  </div>
);

// 表单组件
export const Input = ({ className = '', ...props }) => (
  <input className={`form-input ${className}`} {...props} />
);

export const TextArea = ({ className = '', ...props }) => (
  <textarea className={`form-input ${className}`} {...props} />
);

// 导出默认组件集合
const PicapicaUI = {
  Button,
  LightingButton,
  CustomColorButton,
  FloatingActionButton,
  IconButton,
  Navbar,
  PhotoBoothContainer,
  Container,
  CenteredContainer,
  Card,
  LoadingSpinner,
  Alert,
  MasonryGrid,
  MasonryItem,
  Input,
  TextArea
};

export default PicapicaUI;