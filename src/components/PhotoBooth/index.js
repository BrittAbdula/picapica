// src/components/PhotoBooth/index.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Meta from "../Meta";
import useCameraControl from "./CameraControl";
import { FilterSelector } from "./FilterModule";
import AdvancedSettings from "./UI/AdvancedSettings";
import { themeColors, animationStyles, navigationBarUtils } from "./styles";

const PhotoBooth = ({ setCapturedImages }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 状态管理
    const [capturedImages, setImages] = useState([]);
    const [filter, setFilter] = useState("none");
    const [countdown, setCountdown] = useState(null);
    const [countdownDuration, setCountdownDuration] = useState(3); // 默认倒计时3秒
    const [capturing, setCapturing] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#FFC0CB"); // 默认浅粉色背景
    const [soundEnabled, setSoundEnabled] = useState(true); // 默认开启声音
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

    // 声音开关
    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
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
            <style>{animationStyles}</style>
            <div className="photo-booth" style={{
                background: `radial-gradient(circle at 55% 40%, ${backgroundColor} 10%, #fff 35%)`,
                paddingTop: "20px",
                overflow: "hidden",
                width: "100%",
                maxWidth: "100vw",
                boxSizing: "border-box",
                minHeight: "100vh"
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Online Photo Booth</h1>
                <div className="photo-container" style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "20px",
                    padding: "0 15px",
                    boxSizing: "border-box",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    {/* 相机容器 */}
                    <div className="camera-container" style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "800px",
                        boxSizing: "border-box"
                    }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="video-feed"
                            style={{
                                filter,
                                border: "2px solid #000",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                width: "100%",
                                height: "auto",
                                maxHeight: "70vh",
                                objectFit: "cover",
                                boxSizing: "border-box",
                                overflow: "hidden"
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
                                fontSize: typeof countdown === "string" ? "40px" : "120px",
                                fontWeight: "bold",
                                color: "rgba(255, 255, 255, 0.8)",
                                textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                                zIndex: 100,
                                animation: `countdownEnter 0.3s ease-out, pulse 1s infinite`,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                pointerEvents: "none"
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
                                    height: "auto",
                                    border: "2px solid #000",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    objectFit: "cover",
                                    aspectRatio: "16/9",
                                    boxSizing: "border-box"
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
                        style={{
                            backgroundColor: capturing ? "#ccc" : themeColors.accentColor,
                            color: "white",
                            padding: "12px 30px",
                            borderRadius: "50px",
                            border: "none",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: capturing ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                        }}
                    >
                        {capturing ? "Capturing..." : "Start Capture :)"}
                    </button>

                    {/* 滤镜选择器 */}
                    {/* 滤镜选择器区域，调整为更宽松的布局 */}
                    <div className="filters-section" style={{
                        marginTop: "30px",
                        background: "rgba(255, 255, 255, 0.5)",
                        borderRadius: "8px",
                        maxWidth: "1100px",
                    }}>
                        <FilterSelector
                            activeFilter={filter}
                            onFilterChange={setFilter}
                            theme={themeColors}
                        />
                    </div>
                </div>

                {/* 高级设置 */}
                <AdvancedSettings
                    countdownDuration={countdownDuration}
                    setCountdownDuration={setCountdownDuration}
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
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