// src/components/PhotoBooth/CameraControl.js
import { useRef, useState, useEffect } from 'react';
import CameraManager from '../../utils/CameraManager';
import GLFXFilterProcessor from './GLFXFilterProcessor';

const useCameraControl = ({ soundEnabled, filter, filterObject }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraShutterRef = useRef(new Audio('/camera-shutter.mp3'));
  const currentStream = useRef(null);
  const glfxProcessor = useRef(null);
  
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
      console.log('Starting photo capture...');
      console.log('Filter:', filter);
      console.log('Filter Object:', filterObject);
      
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

      // 应用滤镜 - 修复CSS滤镜应用方式
      if (filter !== 'none' && filterObject) {
        console.log('Filter type:', filterObject.type);
        
        if (filterObject.type === 'css') {
          // 对于CSS滤镜，先应用滤镜再绘制
          console.log('Applying CSS filter:', filter);
          context.filter = filter;
          context.drawImage(
            video,
            startX, startY, drawWidth, drawHeight,  
            0, 0, targetWidth, targetHeight        
          );
          context.filter = 'none';
          console.log('CSS filter applied successfully');
        } else {
          // 对于非CSS滤镜，先绘制再处理
          context.drawImage(
            video,
            startX, startY, drawWidth, drawHeight,  
            0, 0, targetWidth, targetHeight        
          );
        }
      } else {
        // 无滤镜，直接绘制
        context.drawImage(
          video,
          startX, startY, drawWidth, drawHeight,  
          0, 0, targetWidth, targetHeight        
        );
      }
      
      context.restore();

      console.log('Image drawn to canvas, applying advanced filters...');

             // 应用GLFX滤镜（仅适用于GLFX类型）
       if (filter !== 'none' && filterObject && filterObject.type === 'glfx') {
         console.log('Applying GLFX filter:', filter);
         if (glfxProcessor.current && glfxProcessor.current.isSupported()) {
           try {
             console.log('GLFX processor is ready, applying filter...');
             glfxProcessor.current.applyFilter(canvas, filter);
             console.log('GLFX filter applied successfully');
           } catch (error) {
             console.error('GLFX filter application failed:', error);
             console.error('Error details:', error.message, error.stack);
             // 降级为CSS滤镜
             if (filterObject.cssPreview) {
               console.log('Falling back to CSS filter preview:', filterObject.cssPreview);
               const tempCanvas = document.createElement('canvas');
               const tempContext = tempCanvas.getContext('2d');
               tempCanvas.width = canvas.width;
               tempCanvas.height = canvas.height;
               tempContext.filter = filterObject.cssPreview;
               tempContext.drawImage(canvas, 0, 0);
               // 清除原canvas并应用CSS滤镜版本
               context.clearRect(0, 0, canvas.width, canvas.height);
               context.drawImage(tempCanvas, 0, 0);
               console.log('CSS fallback filter applied');
             }
           }
         } else {
           console.warn('GLFX not supported, falling back to CSS preview');
           console.log('Processor exists:', !!glfxProcessor.current);
           console.log('Processor supported:', glfxProcessor.current?.isSupported());
           // 降级为CSS滤镜
           if (filterObject.cssPreview) {
             console.log('Using CSS filter as fallback:', filterObject.cssPreview);
             const tempCanvas = document.createElement('canvas');
             const tempContext = tempCanvas.getContext('2d');
             tempCanvas.width = canvas.width;
             tempCanvas.height = canvas.height;
             tempContext.filter = filterObject.cssPreview;
             tempContext.drawImage(canvas, 0, 0);
             // 清除原canvas并应用CSS滤镜版本
             context.clearRect(0, 0, canvas.width, canvas.height);
             context.drawImage(tempCanvas, 0, 0);
             console.log('CSS fallback filter applied');
           }
         }
       } else {
         console.log('No filter to apply or CSS filter already applied');
       }

      const dataURL = canvas.toDataURL("image/png");
      console.log('Photo capture completed');
      return dataURL;
    }
    console.log('No video or canvas available');
    return null;
  };

  // 初始化 GLFX 处理器
  useEffect(() => {
    // 初始化 GLFX 滤镜处理器
    try {
      glfxProcessor.current = new GLFXFilterProcessor();
      console.log('GLFX Processor initialized:', glfxProcessor.current.isSupported());
    } catch (error) {
      console.warn('Failed to initialize GLFX processor:', error);
    }

    return () => {
      if (glfxProcessor.current) {
        glfxProcessor.current.destroy();
      }
    };
  }, []);

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