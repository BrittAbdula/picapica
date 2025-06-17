// src/components/PhotoBooth/CameraControl.js
import { useRef, useState, useEffect } from 'react';
import CameraManager from '../../utils/CameraManager';

const useCameraControl = ({ soundEnabled, filter }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraShutterRef = useRef(new Audio('/camera-shutter.mp3'));
  const currentStream = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // 启动相机
  const startCamera = async () => {
    try {
      setLoading(true);
      setError(null);
      setCameraActive(false);
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          aspectRatio: 4/3,
          facingMode: 'user'
        },
        audio: false
      };
      
      const stream = await CameraManager.getCamera(constraints);
      CameraManager.registerStream(stream);
      
      // 设置视频源
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
      }
      
      currentStream.current = stream;
      setCameraActive(true);
      setLoading(false);
    } catch (error) {
      console.error('启动摄像头失败:', error);
      setError(error.message || '无法访问摄像头。请确保您已授予权限并刷新页面。');
      setLoading(false);
      setCameraActive(false);
    }
  };

  // 停止相机
  const stopCamera = () => {
    if (currentStream.current) {
      CameraManager.stopCamera(currentStream.current);
      currentStream.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      console.log("Camera stopped from CameraControl module");
    }
  };

  // 捕获照片
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      // 创建闪光效果
      const flash = document.createElement('div');
      flash.style.position = 'absolute';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.width = '100%';
      flash.style.height = '100%';
      flash.style.backgroundColor = 'white';
      flash.style.opacity = '0';
      flash.style.animation = 'flash 0.5s ease-out';
      flash.style.zIndex = '99';
      flash.style.pointerEvents = 'none';
      flash.style.borderRadius = '8px';
      
      // 添加闪光效果到视频容器
      const container = video.parentElement;
      container.appendChild(flash);
      
      // 移除闪光效果
      setTimeout(() => {
        container.removeChild(flash);
      }, 500);
      
      // 播放快门声音
      if (soundEnabled) {
        cameraShutterRef.current.play().catch(err => console.error("Error playing sound:", err));
      }
      
      const context = canvas.getContext("2d");

      // 使用4:3尺寸
      const targetWidth = 640;
      const targetHeight = 480;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 确保4:3比例
      const videoRatio = video.videoWidth / video.videoHeight;
      const targetRatio = 4/3;

      let drawWidth = video.videoWidth;
      let drawHeight = video.videoHeight;
      let startX = 0;
      let startY = 0;

      // 计算裁剪区域以保持4:3比例
      if (videoRatio > targetRatio) {
        // 视频太宽，裁剪左右两边
        drawWidth = drawHeight * targetRatio;
        startX = (video.videoWidth - drawWidth) / 2;
      } else {
        // 视频太高，裁剪上下两边
        drawHeight = drawWidth / targetRatio;
        startY = (video.videoHeight - drawHeight) / 2;
      }

      // 应用镜像效果
      context.save();
      context.translate(canvas.width, 0);
      context.scale(-1, 1);

      context.drawImage(
        video,
        startX, startY, drawWidth, drawHeight,  
        0, 0, targetWidth, targetHeight        
      );
      context.restore();

      // 应用滤镜
      if (filter !== 'none') {
        context.filter = filter;
        context.drawImage(canvas, 0, 0);
        context.filter = 'none';
      }

      return canvas.toDataURL("image/png");
    }
    return null;
  };

  // 组件挂载时启动相机
  useEffect(() => {
    startCamera();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        startCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      console.log("Camera control module cleaning up");
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    loading,
    error,
    cameraActive,
    startCamera,
    stopCamera,
    capturePhoto
  };
};

export default useCameraControl;