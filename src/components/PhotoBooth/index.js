// src/components/PhotoBooth/index.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Meta from "../Meta";
import useCameraControl from "./CameraControl";
import { FilterSelector, FilterPreviewOverlay, getFilterById } from "./FilterModule";
import AdvancedSettings from "./UI/AdvancedSettings";
import { themeColors, animationStyles, navigationBarUtils } from "./styles";
import FrameService from "../../services/frameService";

// 本地存储工具函数
const STORAGE_KEYS = {
    COUNTDOWN_DURATION: 'photobooth_countdown_duration',
    SOUND_ENABLED: 'photobooth_sound_enabled',
    BACKGROUND_COLOR: 'photobooth_background_color',
    FILTER: 'photobooth_filter'
};

const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
};

const loadFromLocalStorage = (key, defaultValue) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return defaultValue;
    }
};

const PhotoBooth = ({ setCapturedImages }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const previewSideRef = useRef(null);

    // 状态管理 - 从本地存储加载保存的设置
    const [capturedImages, setImages] = useState([]);
    const [filter, setFilter] = useState(loadFromLocalStorage(STORAGE_KEYS.FILTER, "none"));
    const [filterObject, setFilterObject] = useState(getFilterById("none"));
    const [countdown, setCountdown] = useState(null);
    const [countdownDuration, setCountdownDuration] = useState(
        loadFromLocalStorage(STORAGE_KEYS.COUNTDOWN_DURATION, 3)
    );
    const [capturing, setCapturing] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(
        loadFromLocalStorage(STORAGE_KEYS.BACKGROUND_COLOR, "#FFFFFF")
    );
    const [spotlightColor, setSpotlightColor] = useState(
        loadFromLocalStorage('photobooth_spotlight_color', "rgba(248, 187, 217, 0.3)")
    );
    const [soundEnabled, setSoundEnabled] = useState(
        loadFromLocalStorage(STORAGE_KEYS.SOUND_ENABLED, true)
    );
    const [frameType, setFrameType] = useState(
        location.state?.frameType || localStorage.getItem("selectedFrame") || "none"
    );
    const [showAllFilters, setShowAllFilters] = useState(false);
    
    // Frame预览相关状态 - 独立于拍摄和合成流程
    const [previewFrameDrawFunction, setPreviewFrameDrawFunction] = useState(null);
    const [isLoadingPreviewFrame, setIsLoadingPreviewFrame] = useState(false);
    const frameOverlayCanvasRef = useRef(null);

    // 使用相机控制钩子 - 拍摄功能保持独立，不受frame预览影响
    const {
        videoRef,
        canvasRef,
        loading,
        error,
        cameraActive,
        startCamera,
        capturePhoto
    } = useCameraControl({ soundEnabled, filter, filterObject });

    // 导航函数
    const navigateTo = (path, state) => {
        console.log('Navigating to', path);
        navigate(path, { state });
    };

    // 声音开关 - 保存到本地存储
    const toggleSound = () => {
        const newSoundEnabled = !soundEnabled;
        setSoundEnabled(newSoundEnabled);
        saveToLocalStorage(STORAGE_KEYS.SOUND_ENABLED, newSoundEnabled);
    };

    // 设置倒计时持续时间 - 保存到本地存储
    const handleSetCountdownDuration = (duration) => {
        setCountdownDuration(duration);
        saveToLocalStorage(STORAGE_KEYS.COUNTDOWN_DURATION, duration);
    };

    // 设置背景颜色 - 保存到本地存储
    const handleSetBackgroundColor = (color) => {
        setBackgroundColor(color);
        saveToLocalStorage(STORAGE_KEYS.BACKGROUND_COLOR, color);
    };

    // 设置聚光灯颜色 - 保存到本地存储
    const handleSetSpotlightColor = (color) => {
        setSpotlightColor(color);
        saveToLocalStorage('photobooth_spotlight_color', color);
    };

    // 设置滤镜 - 保存到本地存储
    const handleSetFilter = (newFilter, newFilterObject) => {
        setFilter(newFilter);
        setFilterObject(newFilterObject || getFilterById("none"));
        saveToLocalStorage(STORAGE_KEYS.FILTER, newFilter);
    };

    // 确保 filter 和 filterObject 保持同步
    useEffect(() => {
        const newFilterObject = getFilterById(filter);
        if (newFilterObject.id !== filterObject.id) {
            setFilterObject(newFilterObject);
        }
    }, [filter]);

    // 加载选中的 frame 预览绘制函数 - 仅用于实时预览，不影响拍摄和合成
    useEffect(() => {
        const loadPreviewFrameFunction = async () => {
            if (frameType && frameType !== 'none') {
                setIsLoadingPreviewFrame(true);
                try {
                    if (frameType === 'generated') {
                        // 处理生成的 frame 预览
                        const generatedFrameData = localStorage.getItem('generatedFrame');
                        if (generatedFrameData) {
                            const frameData = JSON.parse(generatedFrameData);
                            const drawFunction = FrameService.createPreviewFrameFunction(frameData.code);
                            setPreviewFrameDrawFunction(() => drawFunction);
                        }
                    } else {
                        // 处理预定义的 frame 预览
                        const drawFunction = await FrameService.getPreviewFrameDrawFunction(frameType);
                        setPreviewFrameDrawFunction(() => drawFunction);
                    }
                } catch (error) {
                    console.error('Failed to load preview frame function:', error);
                    setPreviewFrameDrawFunction(null);
                } finally {
                    setIsLoadingPreviewFrame(false);
                }
            } else {
                setPreviewFrameDrawFunction(null);
                setIsLoadingPreviewFrame(false);
            }
        };

        loadPreviewFrameFunction();
    }, [frameType]);

    // 绘制 frame 预览叠加层的函数 - 仅用于预览，不影响拍摄
    const drawPreviewFrameOverlay = async () => {
        if (!frameOverlayCanvasRef.current || !previewFrameDrawFunction || !videoRef.current) return;
        
        const canvas = frameOverlayCanvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        // 获取视频的实际显示尺寸（考虑CSS样式和容器限制）
        const videoRect = video.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // 使用标准的4:3比例，确保一致性
        const aspectRatio = 4 / 3;
        let canvasWidth = 640;
        let canvasHeight = 480;
        
        // 如果视频已经加载，使用视频的原始尺寸但保持4:3比例
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            const videoAspectRatio = video.videoWidth / video.videoHeight;
            
            if (videoAspectRatio > aspectRatio) {
                // 视频太宽，以高度为准
                canvasHeight = video.videoHeight;
                canvasWidth = Math.round(canvasHeight * aspectRatio);
            } else {
                // 视频太高，以宽度为准
                canvasWidth = video.videoWidth;
                canvasHeight = Math.round(canvasWidth / aspectRatio);
            }
        }
        
        // 设置画布的内部尺寸（实际像素）
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制预览frame - 注意这只是预览，不影响实际拍摄
        try {
            await previewFrameDrawFunction(ctx, 0, 0, canvas.width, canvas.height);
        } catch (error) {
            console.error('Error drawing preview frame overlay:', error);
        }
    };

    // 调整Frame叠加层位置以精确匹配视频
    const adjustFrameOverlayPosition = () => {
        if (!frameOverlayCanvasRef.current || !videoRef.current) return;
        
        const canvas = frameOverlayCanvasRef.current;
        const video = videoRef.current;
        
        // 获取视频的实际显示尺寸和位置
        const videoRect = video.getBoundingClientRect();
        const containerRect = video.parentElement.getBoundingClientRect();
        
        // 计算视频在容器中的实际位置（考虑object-fit和aspect-ratio）
        const videoAspectRatio = video.videoWidth / video.videoHeight || 4/3;
        const containerAspectRatio = containerRect.width / containerRect.height;
        
        let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
        
        if (containerAspectRatio > videoAspectRatio) {
            // 容器比视频宽，视频会有左右边距
            displayHeight = containerRect.height;
            displayWidth = displayHeight * videoAspectRatio;
            offsetX = (containerRect.width - displayWidth) / 2;
        } else {
            // 容器比视频高，视频会有上下边距
            displayWidth = containerRect.width;
            displayHeight = displayWidth / videoAspectRatio;
            offsetY = (containerRect.height - displayHeight) / 2;
        }
        
        // 设置Canvas样式以精确匹配视频显示区域
        Object.assign(canvas.style, {
            position: "absolute",
            left: `${offsetX}px`,
            top: `${offsetY}px`,
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            transform: "scaleX(-1)", // 保持镜像效果
            transformOrigin: "center center"
        });
    };

    // 当视频加载完成时开始绘制 frame 预览叠加层 - 仅预览用，不影响拍摄
    useEffect(() => {
        if (videoRef.current && previewFrameDrawFunction) {
            const video = videoRef.current;
            
            const handleLoadedMetadata = async () => {
                adjustFrameOverlayPosition();
                await drawPreviewFrameOverlay();
            };
            
            const handleResize = async () => {
                adjustFrameOverlayPosition();
                await drawPreviewFrameOverlay();
            };
            
            const handleTimeUpdate = async () => {
                // 每秒更新一次 frame 预览叠加层（降低性能开销）
                if (Math.floor(video.currentTime) % 1 === 0) {
                    await drawPreviewFrameOverlay();
                }
            };
            
            // 使用 ResizeObserver 来监视视频元素的尺寸变化
            let resizeObserver;
            if (window.ResizeObserver) {
                resizeObserver = new ResizeObserver(async (entries) => {
                    for (const entry of entries) {
                        if (entry.target === video) {
                            adjustFrameOverlayPosition();
                            await drawPreviewFrameOverlay();
                        }
                    }
                });
                resizeObserver.observe(video);
            }
            
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('timeupdate', handleTimeUpdate);
            window.addEventListener('resize', handleResize);
            
            // 立即调整位置并绘制预览
            const initialSetup = async () => {
                adjustFrameOverlayPosition();
                if (video.videoWidth > 0) {
                    await drawPreviewFrameOverlay();
                }
            };
            
            // 尝试多次初始化，确保视频完全加载
            setTimeout(initialSetup, 100);
            setTimeout(initialSetup, 300);
            setTimeout(initialSetup, 500);
            
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('timeupdate', handleTimeUpdate);
                window.removeEventListener('resize', handleResize);
                if (resizeObserver) {
                    resizeObserver.disconnect();
                }
            };
        }
    }, [previewFrameDrawFunction]);

    // 组件挂载/更新时更新导航栏颜色
    useEffect(() => {
        navigationBarUtils.updateNavBarColor(backgroundColor);

        return () => {
            navigationBarUtils.resetNavBarColor();
            console.log("PhotoBooth component is unmounting");
        };
    }, [backgroundColor]);

    // 开始拍照倒计时
    const startCountdown = () => {
        if (capturing) return;
        setCapturing(true);

        let photosTaken = 0;
        const newCapturedImages = [];

        const captureSequence = async () => {
            // 完成拍摄4张照片后处理
            if (photosTaken >= 4) {
                setCountdown(null);
                setCapturing(false);

                try {
                    // 更新外部状态
                    if (setCapturedImages) {
                        setCapturedImages([...newCapturedImages]);
                    }
                    setImages([...newCapturedImages]);

                    // 显示通知
                    const notification = document.createElement('div');
                    notification.textContent = 'Photos captured! Redirecting to preview...';
                    notification.style.position = 'fixed';
                    notification.style.top = '20px';
                    notification.style.left = '50%';
                    notification.style.transform = 'translateX(-50%)';
                    notification.style.padding = '10px 20px';
                    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    notification.style.color = 'white';
                    notification.style.borderRadius = '5px';
                    notification.style.zIndex = '1000';
                    document.body.appendChild(notification);

                    // 延迟导航到预览页面
                    setTimeout(() => {
                        navigateTo("/preview", { state: { frameType } });
                        document.body.removeChild(notification);
                    }, 2000);
                } catch (error) {
                    console.error("Error navigating to preview:", error);
                }
                return;
            }

            // 延迟1秒后开始倒计时
            setTimeout(() => {
                let timeLeft = countdownDuration;
                setCountdown(timeLeft);

                const timer = setInterval(() => {
                    timeLeft -= 1;
                    setCountdown(timeLeft);

                    if (timeLeft === 0) {
                        clearInterval(timer);
                        const imageUrl = capturePhoto();
                        if (imageUrl) {
                            newCapturedImages.push(imageUrl);
                            setImages((prevImages) => {
                                const newImages = [...prevImages, imageUrl];
                                // 第一张照片居中，后续照片自动滚动到最新位置
                                setTimeout(() => {
                                    if (previewSideRef.current && newImages.length > 1) {
                                        previewSideRef.current.scrollLeft = previewSideRef.current.scrollWidth;
                                    }
                                }, 600); // 等待动画完成后再滚动
                                return newImages;
                            });
                        }
                        photosTaken += 1;
                        setTimeout(captureSequence, 1000);
                    }
                }, 1000);
            }, 1000);
        };

        captureSequence();
    };

    return (
        <>
            <Meta
                title="Take Photos in Our Online Photo Booth"
                description="Use Picapica Photo Booth to capture fun moments, apply filters, and create beautiful photo strips. Our free online photo booth lets you take 4 photos and customize them."
                canonicalUrl="/photobooth"
            />
            <style>
                {animationStyles}
                {`
                                 /* 可变色聚光灯背景效果 */
                 .spotlight-background {
                     position: absolute;
                     top: -60px;
                     left: -60px;
                     right: -60px;
                     bottom: -60px;
                     z-index: 1;
                     pointer-events: none;
                     overflow: visible;
                     border-radius: 50px;
                 }
                 
                 /* 聚光灯基础背景 - 确保可见性 */
                 .spotlight-base {
                     position: absolute;
                     top: 0;
                     left: 0;
                     right: 0;
                     bottom: 0;
                     background: radial-gradient(circle at center, 
                         var(--spotlight-color, rgba(248, 187, 217, 0.4)) 0%,
                         var(--spotlight-color-light, rgba(252, 228, 236, 0.3)) 30%,
                         var(--spotlight-color-lighter, rgba(232, 180, 203, 0.2)) 60%,
                         var(--spotlight-color-lightest, rgba(244, 143, 177, 0.1)) 80%,
                         transparent 100%
                     );
                     border-radius: 50%;
                     animation: baseGlow 6s ease-in-out infinite alternate;
                 }
                 
                 @keyframes baseGlow {
                     0% { opacity: 0.6; transform: scale(1); }
                     100% { opacity: 0.9; transform: scale(1.05); }
                 }
                 
                 /* 简化聚光灯效果 */
                 .spotlight-simple {
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     width: 200%;
                     height: 200%;
                     background: radial-gradient(circle at center,
                         rgba(255, 255, 255, 0.6) 0%,
                         var(--spotlight-color, rgba(248, 187, 217, 0.8)) 20%,
                         var(--spotlight-color-light, rgba(248, 187, 217, 0.6)) 40%,
                         var(--spotlight-color-lighter, rgba(248, 187, 217, 0.4)) 60%,
                         var(--spotlight-color-lightest, rgba(248, 187, 217, 0.2)) 80%,
                         transparent 100%
                     );
                     border-radius: 50%;
                     animation: simpleSpotlightPulse 4s ease-in-out infinite alternate;
                     filter: blur(4px);
                     opacity: 0.9;
                 }
                 
                 @keyframes simpleSpotlightPulse {
                     0% { 
                         opacity: 0.7; 
                         transform: translate(-50%, -50%) scale(1);
                     }
                     100% { 
                         opacity: 1; 
                         transform: translate(-50%, -50%) scale(1.1);
                     }
                 }
                 
                 /* 主聚光灯 - 从背后照射，带有可变色效果 */
                 .spotlight-main {
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     width: 85%;
                     height: 85%;
                     background: radial-gradient(circle at center, 
                         /* 中心最亮的聚光点 */
                         rgba(255, 255, 255, 0.6) 0%,
                         var(--spotlight-color, rgba(248, 187, 217, 0.5)) 15%,
                         var(--spotlight-color-light, rgba(252, 228, 236, 0.4)) 30%,
                         var(--spotlight-color-lighter, rgba(232, 180, 203, 0.3)) 45%,
                         var(--spotlight-color-lightest, rgba(209, 151, 184, 0.2)) 60%,
                         transparent 90%
                     );
                     border-radius: 50%;
                     animation: spotlightColorShift 8s ease-in-out infinite;
                     filter: blur(1px);
                 }
                 
                 /* 光晕效果 - 中等范围的柔和光晕 */
                 .spotlight-halo {
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     width: 130%;
                     height: 130%;
                     background: radial-gradient(circle at center, 
                         rgba(255, 255, 255, 0.3) 0%,
                         var(--spotlight-color-light, rgba(248, 187, 217, 0.4)) 20%,
                         var(--spotlight-color-lighter, rgba(252, 228, 236, 0.3)) 35%,
                         var(--spotlight-color-lightest, rgba(232, 180, 203, 0.2)) 50%,
                         transparent 100%
                     );
                     border-radius: 50%;
                     animation: haloColorShift 12s ease-in-out infinite reverse;
                     filter: blur(3px);
                 }
                 
                 /* 外层光晕 - 最大范围的微弱光晕 */
                 .spotlight-outer-glow {
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     width: 180%;
                     height: 180%;
                     background: radial-gradient(circle at center, 
                         rgba(255, 255, 255, 0.2) 0%,
                         var(--spotlight-color-lighter, rgba(248, 187, 217, 0.25)) 25%,
                         var(--spotlight-color-lightest, rgba(252, 228, 236, 0.15)) 40%,
                         transparent 100%
                     );
                     border-radius: 50%;
                     animation: outerGlowColorShift 15s ease-in-out infinite;
                     filter: blur(6px);
                 }
                 
                 /* 可变色动画 */
                 @keyframes spotlightColorShift {
                     0% { 
                         background: radial-gradient(circle at center, 
                             rgba(255, 255, 255, 0.25) 0%,
                             rgba(248, 187, 217, 0.2) 15%,
                             rgba(252, 228, 236, 0.15) 30%,
                             rgba(232, 180, 203, 0.12) 45%,
                             rgba(209, 151, 184, 0.08) 60%,
                             rgba(244, 143, 177, 0.05) 75%,
                             transparent 90%
                         );
                         opacity: 0.8;
                     }
                     25% { 
                         background: radial-gradient(circle at center, 
                             rgba(255, 255, 255, 0.28) 0%,
                             rgba(244, 143, 177, 0.22) 15%,
                             rgba(248, 187, 217, 0.18) 30%,
                             rgba(252, 228, 236, 0.14) 45%,
                             rgba(232, 180, 203, 0.1) 60%,
                             rgba(209, 151, 184, 0.06) 75%,
                             transparent 90%
                         );
                         opacity: 0.9;
                     }
                     50% { 
                         background: radial-gradient(circle at center, 
                             rgba(255, 255, 255, 0.3) 0%,
                             rgba(232, 180, 203, 0.24) 15%,
                             rgba(244, 143, 177, 0.2) 30%,
                             rgba(248, 187, 217, 0.16) 45%,
                             rgba(252, 228, 236, 0.12) 60%,
                             rgba(209, 151, 184, 0.08) 75%,
                             transparent 90%
                         );
                         opacity: 1;
                     }
                     75% { 
                         background: radial-gradient(circle at center, 
                             rgba(255, 255, 255, 0.27) 0%,
                             rgba(209, 151, 184, 0.21) 15%,
                             rgba(232, 180, 203, 0.17) 30%,
                             rgba(244, 143, 177, 0.13) 45%,
                             rgba(248, 187, 217, 0.09) 60%,
                             rgba(252, 228, 236, 0.05) 75%,
                             transparent 90%
                         );
                         opacity: 0.85;
                     }
                     100% { 
                         background: radial-gradient(circle at center, 
                             rgba(255, 255, 255, 0.25) 0%,
                             rgba(248, 187, 217, 0.2) 15%,
                             rgba(252, 228, 236, 0.15) 30%,
                             rgba(232, 180, 203, 0.12) 45%,
                             rgba(209, 151, 184, 0.08) 60%,
                             rgba(244, 143, 177, 0.05) 75%,
                             transparent 90%
                         );
                         opacity: 0.8;
                     }
                 }
                 
                 @keyframes haloColorShift {
                     0% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                     50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
                     100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                 }
                 
                 @keyframes outerGlowColorShift {
                     0% { opacity: 0.4; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
                     33% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.08) rotate(120deg); }
                     66% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.03) rotate(240deg); }
                     100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1) rotate(360deg); }
                 }
                 
                 /* 视频边框优化 */
                 .video-feed {
                     position: relative;
                     box-shadow: 
                         0 0 30px rgba(248, 187, 217, 0.4), 
                         0 0 60px rgba(255, 255, 255, 0.15),
                         inset 0 0 30px rgba(255, 255, 255, 0.08) !important;
                 }
                 
                 /* 拍摄时聚光灯闪光效果 */
                 .photo-booth.capturing .spotlight-background {
                     animation: captureSpotlightFlash 0.6s ease-out;
                 }
                 
                 @keyframes captureSpotlightFlash {
                     0% { opacity: 1; }
                     30% { 
                         opacity: 1.8; 
                         filter: brightness(1.6) saturate(1.3);
                         transform: scale(1.1);
                     }
                     100% { opacity: 1; }
                 }
                 
                 /* 移动端优化 */
                 @media (max-width: 768px) {
                     .spotlight-background {
                         top: -40px;
                         left: -40px;
                         right: -40px;
                         bottom: -40px;
                     }
                     
                     .spotlight-main {
                         width: 75%;
                         height: 75%;
                     }
                     
                     .spotlight-halo {
                         width: 110%;
                         height: 110%;
                     }
                     
                     .spotlight-outer-glow {
                         width: 140%;
                         height: 140%;
                         opacity: 0.7;
                     }
                     
                     /* 移动端倒计时样式调整 */
                     .countdown-display-header {
                         font-size: 36px !important;
                         padding: 15px 25px !important;
                         height: 60px !important;
                         min-width: 120px !important;
                         letter-spacing: 2px !important;
                     }
                     
                     .countdown-display-header[style*="32px"] {
                         font-size: 24px !important;
                     }
                 }
                 
                 /* Frame预览相关动画 */
                 @keyframes fadeIn {
                     from { opacity: 0; transform: translateY(-10px); }
                     to { opacity: 1; transform: translateY(0); }
                 }
                 
                 @keyframes frameLoad {
                     0% { opacity: 0; transform: scale(0.9); }
                     100% { opacity: 0.7; transform: scale(1); }
                 }
                 
                 .frame-overlay-canvas {
                     animation: frameLoad 0.5s ease-out;
                 }
                 
                 /* 倒计时动画 - 参考 Mac Photo Booth 风格 */
                 @keyframes countdownEnter {
                     0% { 
                         opacity: 0; 
                         transform: translateY(-10px) scale(0.9); 
                     }
                     100% { 
                         opacity: 1; 
                         transform: translateY(0) scale(1); 
                     }
                 }
                 
                 @keyframes fadeInUp {
                     0% {
                         opacity: 0;
                         transform: translateY(20px);
                     }
                     100% {
                         opacity: 1;
                         transform: translateY(0);
                     }
                 }
                 
                 @keyframes pulseGentle {
                     0% { 
                         transform: scale(1); 
                         box-shadow: 0 8px 24px rgba(248, 187, 217, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
                     }
                     50% { 
                         transform: scale(1.05); 
                         box-shadow: 0 12px 32px rgba(248, 187, 217, 0.5), 0 0 30px rgba(255, 255, 255, 0.2);
                         background: linear-gradient(135deg, #E8B4CB 0%, #F8BBD9 100%);
                     }
                     100% { 
                         transform: scale(1); 
                         box-shadow: 0 8px 24px rgba(248, 187, 217, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
                     }
                 }
                 
                 /* 相机容器定位修复 */
                 .camera-container {
                     display: flex;
                     justify-content: center;
                     align-items: center;
                 }
                 
                 .video-feed {
                     display: block;
                 }
                 
                 /* 确保Frame叠加层与视频精确对齐 */
                 @media (max-width: 768px) {
                     .camera-container {
                         max-width: 100%;
                         padding: 0 10px;
                     }
                     
                     .video-feed {
                         width: 100%;
                         max-width: none;
                     }
                 }
                 
                 @media (min-width: 769px) {
                     .camera-container {
                         max-width: 640px;
                     }
                 }
                `}
            </style>
            <div className={`photo-booth ${capturing ? 'capturing' : ''}`} style={{
                background: backgroundColor,
                paddingTop: "24px",
                overflow: "hidden",
                width: "100%",
                maxWidth: "100vw",
                boxSizing: "border-box",
                minHeight: "100vh",
                transition: "background 0.5s ease"
            }}>
                {/* 标题区域 - 拍照时显示倒计时，平时显示标题 */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '32px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {countdown !== null ? (
                        /* 倒计时显示 - 替代H1位置 */
                        <div className="countdown-display-header" style={{
                            fontSize: typeof countdown === "string" ? "32px" : "64px",
                            fontWeight: "700",
                            color: "#5D4E75",
                            textShadow: "0 2px 8px rgba(248, 187, 217, 0.4)",
                            animation: `countdownEnter 0.3s ease-out, pulseGentle 1s infinite`,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "80px",
                            pointerEvents: "none",
                            letterSpacing: "4px",
                            background: "linear-gradient(135deg, #F8BBD9 0%, #E8B4CB 100%)",
                            borderRadius: "20px",
                            padding: "20px 40px",
                            boxShadow: "0 8px 24px rgba(248, 187, 217, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                            border: "2px solid rgba(248, 187, 217, 0.4)",
                            minWidth: "150px",
                            backdropFilter: "blur(10px)"
                        }}>
                            {countdown}
                        </div>
                    ) : (
                        /* 正常标题显示 */
                        <h1 style={{ 
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            fontWeight: '700',
                            color: '#5D4E75',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #F8BBD9 0%, #E8B4CB 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'fadeInUp 0.8s ease-out',
                            margin: 0
                        }}>
                            ✨ Online Photo Booth
                        </h1>
                    )}
                </div>
                <div className="photo-container" style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "20px",
                    padding: "0 15px",
                    boxSizing: "border-box",
                    maxWidth: "800px",
                    margin: "0 auto"
                }}>
                    {/* 相机容器 */}
                    <div className="camera-container" style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "800px",
                        boxSizing: "border-box",
                        isolation: "isolate"
                    }}>
                        {/* 背景聚光灯效果 */}
                        <div 
                            className="spotlight-background"
                            style={{
                                '--spotlight-color': spotlightColor,
                                '--spotlight-color-light': (() => {
                                    if (spotlightColor.includes('rgba')) {
                                        return spotlightColor.replace(/0\.\d+\)$/, '0.6)');
                                    } else if (spotlightColor.includes('#')) {
                                        const hex = spotlightColor.replace('#', '');
                                        const r = parseInt(hex.substr(0, 2), 16);
                                        const g = parseInt(hex.substr(2, 2), 16);
                                        const b = parseInt(hex.substr(4, 2), 16);
                                        return `rgba(${r}, ${g}, ${b}, 0.6)`;
                                    }
                                    return spotlightColor;
                                })(),
                                '--spotlight-color-lighter': (() => {
                                    if (spotlightColor.includes('rgba')) {
                                        return spotlightColor.replace(/0\.\d+\)$/, '0.4)');
                                    } else if (spotlightColor.includes('#')) {
                                        const hex = spotlightColor.replace('#', '');
                                        const r = parseInt(hex.substr(0, 2), 16);
                                        const g = parseInt(hex.substr(2, 2), 16);
                                        const b = parseInt(hex.substr(4, 2), 16);
                                        return `rgba(${r}, ${g}, ${b}, 0.4)`;
                                    }
                                    return spotlightColor;
                                })(),
                                '--spotlight-color-lightest': (() => {
                                    if (spotlightColor.includes('rgba')) {
                                        return spotlightColor.replace(/0\.\d+\)$/, '0.2)');
                                    } else if (spotlightColor.includes('#')) {
                                        const hex = spotlightColor.replace('#', '');
                                        const r = parseInt(hex.substr(0, 2), 16);
                                        const g = parseInt(hex.substr(2, 2), 16);
                                        const b = parseInt(hex.substr(4, 2), 16);
                                        return `rgba(${r}, ${g}, ${b}, 0.2)`;
                                    }
                                    return spotlightColor;
                                })()
                            }}
                        >
                            <div className="spotlight-simple"></div>

                        </div>
                        
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="video-feed"
                            style={{
                                filter: filterObject?.type === 'css' 
                                    ? filter 
                                    : filterObject?.type === 'glfx' && filterObject?.cssPreview 
                                        ? filterObject.cssPreview 
                                        : 'none',
                                border: "2px solid rgba(248, 187, 217, 0.3)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 30px rgba(248, 187, 217, 0.3), 0 0 50px rgba(255, 255, 255, 0.1)",
                                width: "100%",
                                height: "auto",
                                maxWidth: "640px",
                                aspectRatio: "4/3",
                                objectFit: "cover",
                                boxSizing: "border-box",
                                overflow: "hidden",
                                position: "relative",
                                zIndex: 2,
                                transform: "scaleX(-1)" // 镜像效果
                            }}
                        />
                        
                        {/* Frame 预览叠加层 - 仅用于视觉预览，不影响实际拍摄和合成 */}
                        {frameType && frameType !== 'none' && (
                            <canvas
                                ref={frameOverlayCanvasRef}
                                className="frame-overlay-canvas"
                                style={{
                                    position: "absolute",
                                    borderRadius: "12px",
                                    pointerEvents: "none",
                                    zIndex: 3,
                                    opacity: isLoadingPreviewFrame ? 0.3 : 0.7,
                                    boxSizing: "border-box"
                                }}
                            />
                        )}
                        
                        {/* Frame 预览加载指示器 */}
                        {isLoadingPreviewFrame && (
                            <div style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                padding: "5px 10px",
                                borderRadius: "15px",
                                fontSize: "12px",
                                zIndex: 4,
                                animation: "fadeIn 0.3s ease-out"
                            }}>
                                🎨 Loading frame preview...
                            </div>
                        )}
                        
                        <canvas ref={canvasRef} className="hidden" style={{ display: 'none' }} />

                        {/* 倒计时显示 - 移至底部控制区域 */}
                    </div>



                    {/* 已拍摄照片预览 - 左右滑动，仅在有照片时显示 */}
                    {capturedImages.length > 0 && (
                        <div className="preview-container" style={{
                            width: "100%",
                            maxWidth: "800px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            position: "relative",
                            animation: "fadeInUp 0.5s ease-out"
                        }}>
                            <div 
                                ref={previewSideRef}
                                className="preview-side" 
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "10px",
                                    overflowX: "auto",
                                    overflowY: "hidden",
                                    padding: "10px 0",
                                    scrollBehavior: "smooth",
                                    WebkitOverflowScrolling: "touch",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "rgba(248, 187, 217, 0.5) transparent",
                                    justifyContent: "center"
                                }}>
                                {capturedImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Captured ${index + 1}`}
                                        className="side-preview"
                                        style={{
                                            width: "120px",
                                            height: "90px",
                                            minWidth: "120px",
                                            border: "2px solid rgba(248, 187, 217, 0.4)",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 12px rgba(248, 187, 217, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                                            objectFit: "cover",
                                            aspectRatio: "4/3",
                                            boxSizing: "border-box",
                                            filter: "brightness(1.05) contrast(1.02)",
                                            transition: "all 0.3s ease",
                                            flexShrink: 0,
                                            animation: index === capturedImages.length - 1 ? "slideInFromRight 0.5s ease-out" : "none"
                                        }}
                                    />
                                ))}
                                {/* 显示剩余拍摄位置的占位符，仅在有照片时显示 */}
                                {capturedImages.length > 0 && capturedImages.length < 4 && Array.from({ length: Math.max(0, 4 - capturedImages.length) }, (_, index) => (
                                    <div
                                        key={`placeholder-${index}`}
                                        className="side-preview-placeholder"
                                        style={{
                                            width: "120px",
                                            height: "90px",
                                            minWidth: "120px",
                                            border: "2px dashed rgba(248, 187, 217, 0.4)",
                                            borderRadius: "8px",
                                            backgroundColor: "rgba(248, 187, 217, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            aspectRatio: "4/3",
                                            boxSizing: "border-box",
                                            flexShrink: 0,
                                            color: "rgba(248, 187, 217, 0.6)",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            opacity: 0.7
                                        }}
                                    >
                                        {capturedImages.length + index + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 拍照按钮 */}
                <div className="controls" style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    maxWidth: "1000px",
                    padding: "0 15px",
                    boxSizing: "border-box"
                }}>

                    <button
                        onClick={startCountdown}
                        disabled={capturing}
                        className="elegant-button"
                        style={{
                            background: capturing ? "rgba(169, 169, 169, 0.6)" : themeColors.gradientPrimary,
                            color: capturing ? themeColors.textLight : themeColors.text,
                            padding: "14px 32px",
                            borderRadius: "24px",
                            border: "none",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: capturing ? "not-allowed" : "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: capturing ? "none" : "0 4px 20px rgba(248, 187, 217, 0.25)",
                            letterSpacing: "0.5px"
                        }}
                    >
                        {capturing ? "Capturing..." : "✨ Start Capture"}
                    </button>

                    {/* 滤镜选择器 */}
                    {/* 滤镜与Frame选择器区域 */}
                    <div className="filters-section elegant-card" style={{
                        marginTop: "32px",
                        background: "rgba(248, 187, 217, 0.05)",
                        borderRadius: "16px",
                        maxWidth: "1100px",
                        padding: "20px",
                        border: "1px solid rgba(248, 187, 217, 0.1)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 20px rgba(248, 187, 217, 0.15)",
                    }}>
                        {/* Frame选择器 */}
                        {frameType && frameType !== 'none' && (
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#5D4E75",
                                    marginBottom: "12px",
                                    textAlign: "center"
                                }}>
                                    🖼️ Current Frame: {frameType === 'generated' ? "Custom Frame" : frameType}
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px"
                                }}>
                                    <button
                                        onClick={() => navigateTo("/templates")}
                                        style={{
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            color: "white",
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            border: "none",
                                            fontSize: "14px",
                                            cursor: "pointer",
                                            transition: "transform 0.2s ease"
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    >
                                        Change Frame
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFrameType("none");
                                            localStorage.setItem("selectedFrame", "none");
                                        }}
                                        style={{
                                            background: "rgba(248, 187, 217, 0.2)",
                                            color: "#5D4E75",
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            border: "1px solid rgba(248, 187, 217, 0.3)",
                                            fontSize: "14px",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = "rgba(248, 187, 217, 0.3)";
                                            e.target.style.transform = "scale(1.05)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = "rgba(248, 187, 217, 0.2)";
                                            e.target.style.transform = "scale(1)";
                                        }}
                                    >
                                        Remove Frame
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <FilterSelector
                            activeFilter={filter}
                            onFilterChange={handleSetFilter}
                            theme={themeColors}
                            onShowMoreFilters={() => setShowAllFilters(true)}
                        />
                    </div>
                </div>

                {/* 高级设置 */}
                <AdvancedSettings
                    countdownDuration={countdownDuration}
                    setCountdownDuration={handleSetCountdownDuration}
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={handleSetBackgroundColor}
                    spotlightColor={spotlightColor}
                    setSpotlightColor={handleSetSpotlightColor}
                    capturing={capturing}
                    theme={themeColors}
                />

                {/* 错误信息显示 */}
                {error && (
                    <div className="error-message" style={{
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        color: "#D8000C",
                        padding: "15px",
                        margin: "20px auto",
                        borderRadius: "5px",
                        maxWidth: "800px",
                        textAlign: "center",
                        border: "1px solid #D8000C"
                    }}>
                        <p>{error}</p>
                        <button
                            onClick={startCamera}
                            style={{
                                backgroundColor: themeColors.accentColor,
                                color: "white",
                                padding: "8px 20px",
                                borderRadius: "4px",
                                border: "none",
                                marginTop: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Retry Camera Access
                        </button>
                    </div>
                )}

                {/* 加载指示器 */}
                {loading && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 1000
                    }}>
                        <div style={{
                            padding: "20px",
                            backgroundColor: "white",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            textAlign: "center"
                        }}>
                            <p>Initializing camera...</p>
                            <div style={{
                                width: "50px",
                                height: "50px",
                                border: `3px solid ${themeColors.mainPink}`,
                                borderRadius: "50%",
                                borderTop: `3px solid ${themeColors.accentColor}`,
                                animation: "spin 1s linear infinite",
                                margin: "10px auto"
                            }}></div>
                        </div>
                    </div>
                )}

                {/* SEO 优化段落 */}
                <div style={{
                    padding: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    marginTop: "40px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    textAlign: "center"
                }}>
                    <p>Welcome to our free online photo booth! Capture your favorite moments with ease and apply fun filters to create beautiful photo strips. Our online photo booth is perfect for any occasion, offering a seamless experience for both mobile and desktop users. Try our free photo booth online today and enjoy capturing memories!</p>
                </div>
            </div>

            {/* 滤镜预览覆盖层 - 放在最外层确保全屏显示 */}
            <FilterPreviewOverlay
                isOpen={showAllFilters}
                onClose={() => setShowAllFilters(false)}
                activeFilter={filter}
                onFilterChange={handleSetFilter}
                videoRef={videoRef}
            />
        </>
    );
};

export default PhotoBooth;