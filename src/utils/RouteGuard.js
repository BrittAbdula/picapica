import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CameraManager from './CameraManager';

/**
 * 路由守卫组件
 * 监听路由变化，在路由切换时自动关闭摄像头
 * 
 * @param {Object} props - 组件属性
 * @param {Array} props.cameraRoutes - 使用摄像头的路由路径列表，例如 ['/photobooth']
 * @param {React.ReactNode} props.children - 子组件
 */
const RouteGuard = ({ cameraRoutes = ['/photobooth'], children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // 当前路由是否使用摄像头
    const isCurrentRouteCameraEnabled = cameraRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    // 如果当前路由不使用摄像头，则停止所有摄像头
    if (!isCurrentRouteCameraEnabled) {
      console.log('Route changed to non-camera route, stopping all cameras');
      CameraManager.stopAllCameras();
    }
    
    // 组件卸载时清理
    return () => {
      // 这里不需要额外操作，因为路由变化时会触发上面的逻辑
    };
  }, [location.pathname, cameraRoutes]);
  
  return <>{children}</>;
};

export default RouteGuard; 