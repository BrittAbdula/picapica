import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";

const PhotoBooth = ({ setCapturedImages }) => {
	const navigate = useNavigate();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [capturedImages, setImages] = useState([]);
	const [filter, setFilter] = useState("none");
	const [countdown, setCountdown] = useState(null);
	const [capturing, setCapturing] = useState(false);
	const cameraShutterRef = useRef(new Audio('/camera-shutter.mp3'));
	const [backgroundColor, setBackgroundColor] = useState("#FFF0F5"); // Default light pink background
	const [showColorPicker, setShowColorPicker] = useState(false); // Control color picker display
	const [soundEnabled, setSoundEnabled] = useState(true); // Sound enabled by default

	// Website theme colors
	const themeColors = {
		mainPink: "#FFC0CB", // Pink
		lightPink: "#FFF0F5", // Lavender blush
		darkPink: "#FF69B4", // Hot pink
		accentColor: "#FF1493" // Deep pink
	};

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
			stopCamera();
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
			if (videoRef.current && videoRef.current.srcObject) {
				return;
			}
			const constraints = {
				video: {
					facingMode: "user",
					width: { ideal: 1920 },
					height: { ideal: 1080 },
					frameRate: { ideal: 30 },
				},
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				
				// Use event listener instead of directly calling play()
				videoRef.current.onloadedmetadata = () => {
					if (videoRef.current) {
						videoRef.current.play()
							.catch((err) => console.error("Error playing video:", err));
					}
				};

				// mirror video stream
				videoRef.current.style.transform = "scaleX(-1)";
				videoRef.current.style.objectFit = "cover";
			}
		} catch (error) {
			if (error.name == "NotAllowedError") {
				console.error("User denied camera permissions.");
			} else console.error("Error accessing camera:", error);
		}
	};

	// Stop Camera
	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject;
			const tracks = stream.getTracks();
			
			tracks.forEach(track => {
				track.stop();
			});
			
			videoRef.current.srcObject = null;
			console.log("Camera stopped");
		}
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

					stopCamera();
					
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
						navigate("/preview");
						document.body.removeChild(notification);
					}, 2000);
				} catch (error) {
					console.error("Error navigating to preview:", error);
				}
				return;
			}

			let timeLeft = 3;
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
		};

		captureSequence();
	};

	// Capture Photo
	const capturePhoto = () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (video && canvas) {
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
			<div className="photo-booth" style={{ backgroundColor }}>
				{countdown !== null && <h2 className="countdown animate">{countdown}</h2>}

				<div className="photo-container">
					<div className="camera-container">
						<video
							ref={videoRef}
							autoPlay
							className="video-feed"
							style={{ filter }}
						/>
						<canvas ref={canvasRef} className="hidden" />
					</div>

					<div className="preview-side" style={{ 
						marginLeft: "-15px", // Shift preview images to the left
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "center",
						gap: "10px"
					}}>
						{capturedImages.map((image, index) => (
							<img
								key={index}
								src={image}
								alt={`Captured ${index + 1}`}
								className="side-preview"
								style={{
									maxWidth: "100%",
									height: "auto",
									borderRadius: "4px",
									border: `2px solid ${themeColors.mainPink}`,
									boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
								}}
							/>
						))}
					</div>
				</div>

				<div className="controls">
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
					<div className="sound-toggle" style={{ marginTop: "15px", display: "flex", alignItems: "center" }}>
						<label style={{ marginRight: "10px", userSelect: "none", cursor: "pointer" }} onClick={toggleSound}>
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

				<div className="filters" style={{ marginTop: "20px" }}>
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
				<div className="lighting-section" style={{ marginTop: "20px" }}>
					<h3 style={{ color: "#333", marginBottom: "10px" }}>Background Lighting</h3>
					<div className="lighting-presets">
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
									cursor: "pointer"
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
								border: "1px solid #ccc"
							}}
						>
							Custom Color
						</button>
					</div>
					
					{showColorPicker && (
						<div className="color-picker-container" style={{ margin: "10px 0" }}>
							<input
								type="color"
								value={backgroundColor}
								onChange={handleColorChange}
								style={{ width: "50px", height: "50px" }}
							/>
							<span style={{ marginLeft: "10px" }}>{backgroundColor}</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default PhotoBooth;
