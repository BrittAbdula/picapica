import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Meta from "./Meta";
import CameraManager from "../utils/CameraManager";

const PhotoBooth = ({ setCapturedImages }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [capturedImages, setImages] = useState([]);
	const [filter, setFilter] = useState("none");
	const [countdown, setCountdown] = useState(null);
	const [countdownDuration, setCountdownDuration] = useState(3); // Default countdown duration
	const [capturing, setCapturing] = useState(false);
	const cameraShutterRef = useRef(new Audio('/camera-shutter.mp3'));
	const [backgroundColor, setBackgroundColor] = useState("#FFF0F5"); // Default light pink background
	const [showColorPicker, setShowColorPicker] = useState(false); // Control color picker display
	const [soundEnabled, setSoundEnabled] = useState(true); // Sound enabled by default
	const [currentStream, setCurrentStream] = useState(null); // 存储当前摄像头流的引用
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [cameraActive, setCameraActive] = useState(false);

	// Website theme colors
	const themeColors = {
		mainPink: "#FFC0CB", // Pink
		lightPink: "#FFF0F5", // Lavender blush
		darkPink: "#FF69B4", // Hot pink
		accentColor: "#FF1493" // Deep pink
	};

	// CSS for animations
	const pulseKeyframes = `
		@keyframes pulse {
			0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
			50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
			100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
		}
		
		@keyframes countdownEnter {
			from { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
			to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
		}
		
		@keyframes countdownExit {
			from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
			to { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
		}
		
		@keyframes flash {
			0% { opacity: 0; }
			25% { opacity: 1; }
			50% { opacity: 0.8; }
			75% { opacity: 0.6; }
			100% { opacity: 0; }
		}
		
		/* 超大屏幕样式 */
		@media (min-width: 1600px) {
			.photo-booth {
				padding-top: 80px !important; /* 大屏幕顶部空间更大 */
			}
			
			.photo-container {
				max-width: 1400px !important;
			}
			
			.camera-container {
				max-width: 65% !important;
			}
			
			.preview-side {
				max-width: 250px !important;
			}
		}

		@media (max-width: 768px) {
			.countdown-display-overlay {
				font-size: 80px !important;
				width: 120px !important;
				height: 120px !important;
			}

			.controls {
				padding: 10px 5px !important;
			}
			
			.filters button, .lighting-presets button {
				padding: 6px 10px !important;
				margin: 3px !important;
				font-size: 12px !important;
			}
			
			.photo-container {
				flex-direction: column !important;
				align-items: center !important;
				padding: 0 10px !important;
			}
			
			.camera-container {
				max-width: 100% !important;
				width: 100% !important;
			}
			
			.preview-side {
				flex-direction: row !important;
				width: 100% !important;
				max-width: 100% !important;
				margin-left: 0 !important;
				margin-top: 10px !important;
				overflow-x: auto !important;
				padding-bottom: 5px !important;
				justify-content: center !important;
			}
			
			.side-preview, .preview-side > div {
				width: 120px !important;
				min-width: 120px !important;
				max-width: 120px !important;
			}
			
			.photo-booth {
				padding-top: 20px !important; /* 移动端顶部空间稍小 */
			}
		}

		@media (max-width: 480px) {
			.countdown-display-overlay {
				font-size: 60px !important;
				width: 100px !important;
				height: 100px !important;
			}

			.controls {
				flex-direction: column !important;
				padding: 10px 0 !important;
			}

			.countdown-setting {
				margin-right: 0 !important;
				margin-bottom: 15px !important;
			}

			.sound-toggle {
				margin-top: 15px !important;
			}
			
			.filters button, .lighting-presets button {
				padding: 5px 8px !important;
				margin: 2px !important;
				font-size: 11px !important;
			}
			
			.lighting-section h3 {
				font-size: 14px !important;
			}
			
			.side-preview, .preview-side > div {
				width: 100px !important;
				min-width: 100px !important;
				max-width: 100px !important;
			}
			
			.photo-booth {
				padding-top: 30px !important; /* 小屏幕顶部空间更小 */
			}
		}
	`;

	// Preset lighting colors for makeup
	const lightingPresets = [
		{ name: "Natural Daylight", color: "#F5F5DC" }, // Beige
		{ name: "Warm Tone", color: "#FFD580" },       // Light orange
		{ name: "Cool Tone", color: "#ADD8E6" },       // Light blue
		{ name: "Studio White", color: "#FFFFFF" },    // Pure white
		{ name: "Sunset Glow", color: "#FFA07A" },     // Light salmon
		{ name: "Stage Light", color: "#E6E6FA" },     // Lavender
		{ name: "Pink Theme", color: themeColors.mainPink }, // Website theme pink
		{ name: "Black", color: "#000000" },           // Black
	];

	// Toggle sound on/off
	const toggleSound = () => {
		setSoundEnabled(!soundEnabled);
	};

	useEffect(() => {
		startCamera();

		const handleVisibilityChange = () => {
			if (!document.hidden) {
				startCamera();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Update navigation bar color based on background
		updateNavBarColor(backgroundColor);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			// 不需要在这里手动停止摄像头，由RouteGuard处理
			// Reset navigation bar color when component unmounts
			resetNavBarColor();
		};
	}, []);

	// Update navigation bar color when background changes
	useEffect(() => {
		updateNavBarColor(backgroundColor);
	}, [backgroundColor]);

	// Function to update navigation bar color
	const updateNavBarColor = (color) => {
		// Get navigation elements - adjust selectors based on your actual navigation structure
		const navElements = document.querySelectorAll('nav, .navbar, header');
		
		if (navElements.length > 0) {
			navElements.forEach(nav => {
				nav.style.backgroundColor = color;
				// Set text color based on background brightness
				const isLight = isLightColor(color);
				nav.style.color = isLight ? '#000000' : '#FFFFFF';
				
				// Update links color if needed
				const links = nav.querySelectorAll('a, button');
				links.forEach(link => {
					link.style.color = isLight ? '#000000' : '#FFFFFF';
				});
			});
		}
	};

	// Function to reset navigation bar color
	const resetNavBarColor = () => {
		const navElements = document.querySelectorAll('nav, .navbar, header');
		if (navElements.length > 0) {
			navElements.forEach(nav => {
				nav.style.backgroundColor = '';
				nav.style.color = '';
				
				const links = nav.querySelectorAll('a, button');
				links.forEach(link => {
					link.style.color = '';
				});
			});
		}
	};

	// Helper function to determine if a color is light or dark
	const isLightColor = (color) => {
		// Convert hex to RGB
		const hex = color.replace('#', '');
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		
		// Calculate brightness (YIQ formula)
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness > 128;
	};

	// Start Camera
	const startCamera = async () => {
		try {
			setLoading(true);
			setError(null);
			setCameraActive(false);
			
			const constraints = {
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: 'user'
				},
				audio: false
			};
			
			const stream = await CameraManager.getCamera(constraints);
			
			// 设置视频源
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				// 重要：iOS 需要设置 playsinline 属性以避免全屏播放
				videoRef.current.setAttribute('playsinline', 'true');
				videoRef.current.muted = true;
			}
			
			setCurrentStream(stream);
			setCameraActive(true);
			setLoading(false);
		} catch (error) {
			console.error('启动摄像头失败:', error);
			setError(error.message || '无法访问摄像头。请确保您已授予权限并刷新页面。');
			setLoading(false);
			setCameraActive(false);
		}
	};

	// Stop Camera - 保留此方法用于组件内部需要停止摄像头的场景
	const stopCamera = () => {
		if (currentStream) {
			CameraManager.stopCamera(currentStream);
			setCurrentStream(null);
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
			console.log("Camera stopped from PhotoBooth component");
		}
	};

	// 导航函数 - 简化为普通导航，摄像头管理由RouteGuard处理
	const navigateTo = (path) => {
		console.log('Navigating to', path);
		navigate(path);
	};

	// Countdown to take 4 pictures automatically
	const startCountdown = () => {
		if (capturing) return;
		setCapturing(true);

		let photosTaken = 0;
		const newCapturedImages = [];

		const captureSequence = async () => {
			// push captured images to preview
			if (photosTaken >= 4) {
				setCountdown(null);
				setCapturing(false);

				try {
					setCapturedImages([...newCapturedImages]);
					setImages([...newCapturedImages]);
					
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

					setTimeout(() => {
						navigateTo("/preview");
						document.body.removeChild(notification);
					}, 2000);
				} catch (error) {
					console.error("Error navigating to preview:", error);
				}
				return;
			}

			
			
			// 延迟1秒后开始倒计时
			setTimeout(() => {
				let timeLeft = countdownDuration; // Use the selected countdown duration
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

	// Capture Photo
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
			
			// Play camera shutter sound if enabled
			if (soundEnabled) {
				cameraShutterRef.current.play().catch(err => console.error("Error playing sound:", err));
			}
			
			const context = canvas.getContext("2d");

			const targetWidth = 1280;
			const targetHeight = 720;

			canvas.width = targetWidth;
			canvas.height = targetHeight;

			const videoRatio = video.videoWidth / video.videoHeight;
			const targetRatio = targetWidth / targetHeight;

			let drawWidth = video.videoWidth;
			let drawHeight = video.videoHeight;
			let startX = 0;
			let startY = 0;

			// crop image (?)
			if (videoRatio > targetRatio) {
				drawWidth = drawHeight * targetRatio;
				startX = (video.videoWidth - drawWidth) / 2;
			} else {
				drawHeight = drawWidth / targetRatio;
				startY = (video.videoHeight - drawHeight) / 2;
			}

        // Flip canvas for mirroring
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(
            video,
            startX, startY, drawWidth, drawHeight,  
            0, 0, targetWidth, targetHeight        
        );
        context.restore();

        if (filter !== 'none') {
            context.filter = filter;
            context.drawImage(canvas, 0, 0);
            context.filter = 'none';
        }

        return canvas.toDataURL("image/png");
    }
};

	// Handle custom color change
	const handleColorChange = (e) => {
		setBackgroundColor(e.target.value);
	};

	// Toggle color picker display
	const toggleColorPicker = () => {
		setShowColorPicker(!showColorPicker);
	};

	return (
		<>
			<Meta 
				title="Take Photos in Our Online Photo Booth"
				description="Use Picapica Photo Booth to capture fun moments, apply filters, and create beautiful photo strips. Our free online photo booth lets you take 4 photos and customize them."
				canonicalUrl="/photobooth"
			/>
			<style>{pulseKeyframes}</style>
			<div className="photo-booth" style={{ 
				backgroundColor,
				paddingTop: "80px", // 增加顶部空间，避免被header遮挡
				overflow: "hidden", // 防止内容溢出
				width: "100%",
				maxWidth: "100vw", // 确保不超过视口宽度
				boxSizing: "border-box", // 确保padding不会增加宽度
				minHeight: "100vh" // 确保至少占满整个视口高度
			}}>
				{/* 添加提示信息 */}
				<div style={{
					textAlign: "center",
					marginBottom: "15px",
					color: "#333",
					fontSize: "14px",
					padding: "0 20px",
					maxWidth: "800px", // 限制最大宽度
					margin: "0 auto 15px" // 居中并保持下边距
				}}>
					<p>Choose countdown time, click "Start Capture" to take photos</p>
				</div>

				<div className="photo-container" style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "flex-start",
					gap: "15px",
					marginBottom: "20px",
					padding: "0 15px",
					boxSizing: "border-box", // 确保padding不会增加宽度
					maxWidth: "1200px", // 限制最大宽度
					margin: "0 auto" // 居中
				}}>
					<div className="camera-container" style={{ 
						position: "relative",
						maxWidth: "70%",
						flexGrow: 1,
						width: "100%", // 确保填充可用空间
						boxSizing: "border-box" // 确保边框不会增加宽度
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
								boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
								width: "100%",
								height: "auto",
								maxHeight: "70vh", // 限制最大高度
								objectFit: "cover", // 确保视频填充容器
								boxSizing: "border-box" // 确保边框不会增加宽度
							}}
						/>
						<canvas ref={canvasRef} className="hidden" />
						
						{/* 将倒计时放在视频流内部 */}
						{countdown !== null && (
							<div className="countdown-display-overlay" style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								fontSize: typeof countdown === "string" ? "40px" : "120px", // 如果是文字提示，使用较小的字体
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
								pointerEvents: "none" // 确保不会阻挡用户交互
							}}>
								{countdown}
							</div>
						)}
					</div>

					<div className="preview-side" style={{ 
						marginLeft: "10px", // 调整间距
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "flex-start",
						gap: "10px",
						width: "25%", // 固定宽度比例
						maxWidth: "200px", // 最大宽度限制
						minWidth: "120px", // 最小宽度限制
						boxSizing: "border-box" // 确保边框不会增加宽度
					}}>
						{capturedImages.length === 0 ? (
							<div style={{
								width: "100%",
								aspectRatio: "16/9",
								border: "2px solid #000",
								boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
								backgroundColor: "rgba(0,0,0,0.1)",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								color: "#666",
								fontSize: "12px",
								textAlign: "center",
								padding: "10px",
								boxSizing: "border-box" // 确保边框不会增加宽度
							}}>
								photos will show here
							</div>
						) : (
							capturedImages.map((image, index) => (
								<img
									key={index}
									src={image}
									alt={`Captured ${index + 1}`}
									className="side-preview"
									style={{
										width: "100%",
										height: "auto",
										border: "2px solid #000", // 使用与视频流相同的黑色边框
										boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // 与视频流相同的阴影效果
										objectFit: "cover", // 确保图片填充容器
										aspectRatio: "16/9", // 保持与视频相同的宽高比
										boxSizing: "border-box" // 确保边框不会增加宽度
									}}
								/>
							))
						)}
					</div>
				</div>

				<div className="controls" style={{ 
					display: "flex", 
					flexDirection: "row", 
					alignItems: "center", 
					justifyContent: "center",
					flexWrap: "wrap", // Allow wrapping on small screens
					gap: "15px", // Add gap between elements
					maxWidth: "1000px", // 限制最大宽度
					margin: "0 auto", // 居中
					marginTop: "20px",
					padding: "0 15px", // 添加水平内边距
					boxSizing: "border-box" // 确保padding不会增加宽度
				}}>
					{/* Countdown Duration Setting */}
					<div className="countdown-setting" style={{ 
						display: "flex", 
						flexDirection: "column", 
						alignItems: "center", 
						marginRight: "20px",
						minWidth: "120px",
						maxWidth: "150px",
						flex: "1 1 auto" // Allow flexible sizing
					}}>
						<label style={{ 
							marginBottom: "8px", 
							fontWeight: "bold", 
							color: "#333",
							fontSize: "14px",
							textAlign: "center"
						}}>
							Countdown: {countdownDuration}s
						</label>
						<div style={{ 
							display: "flex", 
							alignItems: "flex-end", 
							height: "40px", 
							width: "100%", 
							justifyContent: "space-between",
							maxWidth: "120px", // Limit maximum width
							padding: "0 5px" // Add padding for better spacing
						}}>
							{[1, 2, 3, 4, 5].map((value) => (
								<div 
									key={value} 
									onClick={() => !capturing && setCountdownDuration(value)}
									style={{
										width: "18px", // Slightly narrower for better mobile spacing
										height: `${value * 20}%`,
										backgroundColor: value === countdownDuration 
											? themeColors.accentColor 
											: themeColors.mainPink,
										borderRadius: "3px 3px 0 0",
										cursor: capturing ? "not-allowed" : "pointer",
										transition: "all 0.3s ease",
										opacity: capturing ? 0.6 : 1,
										position: "relative",
										boxShadow: value === countdownDuration ? "0 0 5px rgba(0,0,0,0.2)" : "none", // Add shadow to selected bar
										WebkitTapHighlightColor: "transparent" // Remove default mobile tap highlight
									}}
								>
									<span style={{
										position: "absolute",
										bottom: "-20px",
										left: "50%",
										transform: "translateX(-50%)",
										fontSize: "12px",
										fontWeight: value === countdownDuration ? "bold" : "normal",
										color: value === countdownDuration ? themeColors.accentColor : "#333"
									}}>
										{value}
									</span>
								</div>
							))}
						</div>
					</div>

					<button 
						onClick={startCountdown} 
						disabled={capturing}
						style={{
							backgroundColor: themeColors.mainPink,
							color: "#000000",
							border: "none",
							padding: "10px 20px",
							borderRadius: "5px",
							cursor: capturing ? "not-allowed" : "pointer",
							fontWeight: "bold"
						}}
					>
						{capturing ? "Capturing..." : "Start Capture :)"}
					</button>
					
					{/* Sound toggle switch - Fixed clickable version */}
					<div className="sound-toggle" style={{ 
						display: "flex", 
						flexDirection: "column", 
						alignItems: "center",
						minWidth: "150px"
					}}>
						<label style={{ 
							marginBottom: "8px", 
							fontWeight: "bold", 
							color: "#333",
							fontSize: "14px",
							userSelect: "none", 
							cursor: "pointer" 
						}} onClick={toggleSound}>
							Camera Sound: {soundEnabled ? "On" : "Off"}
						</label>
						<div 
							className="switch-container" 
							style={{ position: "relative", display: "inline-block", width: "60px", height: "30px", cursor: "pointer" }}
							onClick={toggleSound}
						>
							<div
								className="slider"
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: soundEnabled ? themeColors.accentColor : "#ccc",
									borderRadius: "34px",
									transition: "0.4s",
								}}
							>
								<div 
									className="slider-button"
									style={{
										position: "absolute",
										height: "22px",
										width: "22px",
										left: soundEnabled ? "34px" : "4px",
										bottom: "4px",
										backgroundColor: "white",
										borderRadius: "50%",
										transition: "0.4s",
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="filters" style={{ 
					marginTop: "20px",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: "8px",
					maxWidth: "1000px", // 限制最大宽度
					margin: "20px auto 0", // 居中并设置上边距
					padding: "0 15px", // 添加水平内边距
					boxSizing: "border-box" // 确保padding不会增加宽度
				}}>
					<button 
						onClick={() => setFilter("none")}
						style={{
							backgroundColor: filter === "none" ? themeColors.mainPink : "#f0f0f0",
							margin: "5px",
							padding: "8px 12px",
							borderRadius: "4px",
							cursor: "pointer",
							border: filter === "none" ? `2px solid ${themeColors.accentColor}` : "1px solid #ccc"
						}}
					>
						No Filter
					</button>
					<button 
						onClick={() => setFilter("grayscale(100%)")}
						style={{
							backgroundColor: filter === "grayscale(100%)" ? themeColors.mainPink : "#f0f0f0",
							margin: "5px",
							padding: "8px 12px",
							borderRadius: "4px",
							cursor: "pointer",
							border: filter === "grayscale(100%)" ? `2px solid ${themeColors.accentColor}` : "1px solid #ccc"
						}}
					>
						Grayscale
					</button>
					<button 
						onClick={() => setFilter("sepia(100%)")}
						style={{
							backgroundColor: filter === "sepia(100%)" ? themeColors.mainPink : "#f0f0f0",
							margin: "5px",
							padding: "8px 12px",
							borderRadius: "4px",
							cursor: "pointer",
							border: filter === "sepia(100%)" ? `2px solid ${themeColors.accentColor}` : "1px solid #ccc"
						}}
					>
						Sepia
					</button>
					<button
						onClick={() =>
							setFilter(
								"grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)"
							)
						}
						style={{
							backgroundColor: filter === "grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)" ? themeColors.mainPink : "#f0f0f0",
							margin: "5px",
							padding: "8px 12px",
							borderRadius: "4px",
							cursor: "pointer",
							border: filter === "grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)" ? `2px solid ${themeColors.accentColor}` : "1px solid #ccc"
						}}
					>
						Vintage
					</button>
					<button
						onClick={() =>
							setFilter(
								"brightness(130%) contrast(105%) saturate(80%) blur(0.3px)"
							)
						}
						style={{
							backgroundColor: filter === "brightness(130%) contrast(105%) saturate(80%) blur(0.3px)" ? themeColors.mainPink : "#f0f0f0",
							margin: "5px",
							padding: "8px 12px",
							borderRadius: "4px",
							cursor: "pointer",
							border: filter === "brightness(130%) contrast(105%) saturate(80%) blur(0.3px)" ? `2px solid ${themeColors.accentColor}` : "1px solid #ccc"
						}}
					>
						Soft
					</button>
				</div>

				{/* Background Lighting Section */}
				<div className="lighting-section" style={{ 
					marginTop: "20px",
					padding: "0 15px",
					maxWidth: "1000px", // 限制最大宽度
					margin: "20px auto 0", // 居中并设置上边距
					boxSizing: "border-box" // 确保padding不会增加宽度
				}}>
					<h3 style={{ 
						color: "#333", 
						marginBottom: "10px",
						textAlign: "center",
						fontSize: "16px"
					}}>
						Background Lighting
					</h3>
					<div className="lighting-presets" style={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						gap: "8px"
					}}>
						{lightingPresets.map((preset, index) => (
							<button
								key={index}
								onClick={() => setBackgroundColor(preset.color)}
								style={{
									backgroundColor: preset.color,
									color: preset.color === "#FFFFFF" || preset.color === "#F5F5DC" || preset.color === "#FFD580" || preset.color === "#ADD8E6" || preset.color === "#FFC0CB" || preset.color === "#FFF0F5" || preset.color === "#E6E6FA" ? "#000000" : "#FFFFFF",
									border: backgroundColor === preset.color ? `2px solid ${themeColors.accentColor}` : "1px solid #ccc",
									margin: "5px",
									padding: "8px 12px",
									borderRadius: "4px",
									cursor: "pointer",
									fontSize: "12px"
								}}
							>
								{preset.name}
							</button>
						))}
						<button 
							onClick={toggleColorPicker}
							style={{
								margin: "5px",
								padding: "8px 12px",
								borderRadius: "4px",
								cursor: "pointer",
								backgroundColor: themeColors.lightPink,
								border: "1px solid #ccc",
								fontSize: "12px"
							}}
						>
							Custom Color
						</button>
					</div>
					
					{showColorPicker && (
						<div className="color-picker-container" style={{ 
							margin: "15px 0",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexWrap: "wrap",
							gap: "10px"
						}}>
							<input
								type="color"
								value={backgroundColor}
								onChange={handleColorChange}
								style={{ width: "50px", height: "50px", cursor: "pointer" }}
							/>
							<span style={{ 
								fontSize: "14px",
								fontWeight: "bold",
								color: "#333"
							}}>
								{backgroundColor}
							</span>
						</div>
					)}
				</div>

				{/* 显示错误信息 */}
				{error && (
					<div className="error-message">
						<p>{error}</p>
						<button onClick={startCamera}>
							重试
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default PhotoBooth;
