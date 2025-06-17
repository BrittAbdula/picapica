// src/components/PhotoBooth/index.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Meta from "../Meta";
import useCameraControl from "./CameraControl";
import { FilterSelector } from "./FilterModule";
import AdvancedSettings from "./UI/AdvancedSettings";
import { themeColors, animationStyles, navigationBarUtils } from "./styles";

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

    // 状态管理 - 从本地存储加载保存的设置
    const [capturedImages, setImages] = useState([]);
    const [filter, setFilter] = useState(loadFromLocalStorage(STORAGE_KEYS.FILTER, "none"));
    const [countdown, setCountdown] = useState(null);
    const [countdownDuration, setCountdownDuration] = useState(
        loadFromLocalStorage(STORAGE_KEYS.COUNTDOWN_DURATION, 3)
    );
    const [capturing, setCapturing] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(
        loadFromLocalStorage(STORAGE_KEYS.BACKGROUND_COLOR, "#FFC0CB")
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

    // 使用相机控制钩子
    const {
        videoRef,
        canvasRef,
        loading,
        error,
        cameraActive,
        startCamera,
        capturePhoto
    } = useCameraControl({ soundEnabled, filter });

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
    const handleSetFilter = (newFilter) => {
        setFilter(newFilter);
        saveToLocalStorage(STORAGE_KEYS.FILTER, newFilter);
    };

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
                            setImages((prevImages) => [...prevImages, imageUrl]);
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
                <h1 style={{ 
                    textAlign: 'center', 
                    marginBottom: '32px', 
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: '700',
                    color: '#5D4E75',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #F8BBD9 0%, #E8B4CB 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'fadeInUp 0.8s ease-out'
                }}>
                    ✨ Online Photo Booth
                </h1>
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
                                filter,
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
                        <canvas ref={canvasRef} className="hidden" style={{ display: 'none' }} />

                        {/* 倒计时显示 */}
                        {countdown !== null && (
                            <div className="countdown-display-overlay" style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: typeof countdown === "string" ? "44px" : "120px",
                                fontWeight: "700",
                                color: "#FFFFFF",
                                textShadow: "0 4px 20px rgba(248, 187, 217, 0.5)",
                                zIndex: 100,
                                animation: `countdownEnter 0.3s ease-out, pulseGentle 1s infinite`,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "160px",
                                height: "160px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, rgba(248, 187, 217, 0.9) 0%, rgba(232, 180, 203, 0.95) 100%)",
                                backdropFilter: "blur(10px)",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                boxShadow: "0 8px 30px rgba(248, 187, 217, 0.4)",
                                pointerEvents: "none",
                                letterSpacing: "2px"
                            }}>
                                {countdown}
                            </div>
                        )}
                    </div>

                    {/* 已拍摄照片预览 */}
                    <div className="preview-side" style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                        maxWidth: "800px",
                        boxSizing: "border-box",
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
                                    border: "2px solid rgba(248, 187, 217, 0.4)",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(248, 187, 217, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                                    objectFit: "cover",
                                    aspectRatio: "4/3",
                                    boxSizing: "border-box",
                                    filter: "brightness(1.05) contrast(1.02)",
                                    transition: "all 0.3s ease"
                                }}
                            />
                        ))}
                    </div>
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
                    {/* 滤镜选择器区域，调整为更宽松的布局 */}
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
                        <FilterSelector
                            activeFilter={filter}
                            onFilterChange={handleSetFilter}
                            theme={themeColors}
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
        </>
    );
};

export default PhotoBooth;