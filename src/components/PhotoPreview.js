import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PhotoPreview = ({ capturedImages }) => {
	const stripCanvasRef = useRef(null);
	const navigate = useNavigate();
	const [stripColor, setStripColor] = useState("white");
	const [selectedFrame, setSelectedFrame] = useState("none");
	const [shareLink, setShareLink] = useState("");
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);

	const generatePhotoStrip = useCallback(() => {
		const canvas = stripCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		const imgWidth = 400;
		const imgHeight = 300;
		const borderSize = 40;
		const photoSpacing = 20;
		const textHeight = 50;
		const totalHeight =
			imgHeight * 4 + photoSpacing * 3 + borderSize * 2 + textHeight;

		canvas.width = imgWidth + borderSize * 2;
		canvas.height = totalHeight;

		ctx.fillStyle = stripColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		let imagesLoaded = 0;
		capturedImages.forEach((image, index) => {
			const img = new Image();
			img.src = image;
			img.onload = () => {
				const yOffset = borderSize + (imgHeight + photoSpacing) * index;

				const imageRatio = img.width / img.height;
				const targetRatio = imgWidth / imgHeight;

				let sourceWidth = img.width;
				let sourceHeight = img.height;
				let sourceX = 0;
				let sourceY = 0;

				if (imageRatio > targetRatio) {
					sourceWidth = sourceHeight * targetRatio;
					sourceX = (img.width - sourceWidth) / 2;
				} else {
					sourceHeight = sourceWidth / targetRatio;
					sourceY = (img.height - sourceHeight) / 2;
				}

				ctx.drawImage(
					img,
					sourceX,
					sourceY,
					sourceWidth,
					sourceHeight,
					borderSize,
					yOffset,
					imgWidth,
					imgHeight
				);

				if (
					FRAMES[selectedFrame] &&
					typeof FRAMES[selectedFrame].draw === "function"
				) {
					FRAMES[selectedFrame].draw(
						ctx,
						borderSize,
						yOffset,
						imgWidth,
						imgHeight
					);
				}

				imagesLoaded++;

				if (imagesLoaded === capturedImages.length) {
					const now = new Date();
					const timestamp =
						now.toLocaleDateString("en-US", {
							month: "2-digit",
							day: "2-digit",
							year: "numeric",
						}) +
						"  " +
						now.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
						});

					ctx.fillStyle = "#000000";
					ctx.font = "20px Arial";
					ctx.textAlign = "center";

					ctx.fillText(
						"Picapica  " + timestamp,
						canvas.width / 2,
						totalHeight - borderSize * 1
					);

					ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
					ctx.font = "12px Arial";
					ctx.textAlign = "center";

					ctx.fillText(
						"© 2025 AW",
						canvas.width - borderSize,
						totalHeight - borderSize / 2
					);
				}
			};
		});
	}, [capturedImages, stripColor, selectedFrame]);

	useEffect(() => {
		if (capturedImages.length === 4) {
			setTimeout(() => {
				generatePhotoStrip();
			}, 100);
		}
	}, [capturedImages, stripColor, selectedFrame, generatePhotoStrip]);

	const downloadPhotoStrip = () => {
		const link = document.createElement("a");
		link.download = "photostrip.png";
		link.href = stripCanvasRef.current.toDataURL("image/png");
		link.click();
	};

	const getShareableLink = async () => {
		if (!stripCanvasRef.current) return;
		
		try {
			setIsGeneratingLink(true);
			setLinkCopied(false);
			
			// Convert canvas to blob
			const blob = await new Promise(resolve => {
				stripCanvasRef.current.toBlob(resolve, 'image/png');
			});
			
			// Create form data
			const formData = new FormData();
			formData.append('image', blob, 'photostrip.png');
			
			// Upload to server
			const response = await fetch('https://api.picapica.app/api/upload', {
				method: 'POST',
				body: formData
			});
			
			if (!response.ok) {
				throw new Error('Failed to upload image');
			}
			
			const data = await response.json();
			
			// Generate shareable link
			const shareableLink = `${window.location.origin}/share/${encodeURIComponent(data.imageUrl)}`;
			setShareLink(shareableLink);
			
		} catch (error) {
			console.error('Error generating link:', error);
			alert('Failed to generate shareable link. Please try again.');
		} finally {
			setIsGeneratingLink(false);
		}
	};
	
	const copyLinkToClipboard = () => {
		if (!shareLink) return;
		
		navigator.clipboard.writeText(shareLink)
			.then(() => {
				setLinkCopied(true);
				setTimeout(() => setLinkCopied(false), 3000);
			})
			.catch(err => {
				console.error('Failed to copy link:', err);
			});
	};
	
	const navigateToShare = () => {
		if (!shareLink) return;
		
		const imageUrl = shareLink.split('/share/')[1];
		navigate(`/share/${imageUrl}`);
	};

	return (
		<div className="photo-preview">
			<h2>Photo Strip Preview</h2>

      <div className="color-options">
        <button onClick={() => setStripColor("white")}>White</button>
        <button onClick={() => setStripColor("black")}>Black</button>
        <button onClick={() => setStripColor("#f6d5da")}>Pink</button>
        <button onClick={() => setStripColor("#dde6d5")}>Green</button>
        <button onClick={() => setStripColor("#adc3e5")}>Blue</button>
        <button onClick={() => setStripColor("#FFF2CC")}>Yellow</button>
        <button onClick={() => setStripColor("#dbcfff")}>Purple</button>
      </div>

      <div className="frame-options">
        <button onClick={() => setSelectedFrame("pastel")}>Girlypop Stickers</button>
        <button onClick={() => setSelectedFrame("cute")}>Cute Stickers</button>
      </div>

			<canvas ref={stripCanvasRef} className="photo-strip" />

			<div className="strip-buttons">
				<button onClick={downloadPhotoStrip}>📥 Download Photo Strip</button>
				<button onClick={() => navigate("/photobooth")}>
					🔄 Take New Photos
				</button>
				<button 
					onClick={getShareableLink} 
					disabled={isGeneratingLink}
					style={{
						backgroundColor: "#FF69B4",
						color: "white",
						border: "none",
						padding: "10px 15px",
						borderRadius: "5px",
						cursor: isGeneratingLink ? "wait" : "pointer",
						marginLeft: "10px"
					}}
				>
					{isGeneratingLink ? "Generating..." : "🔗 Get Shareable Link"}
				</button>
			</div>
			
			{shareLink && (
				<div className="share-link-container" style={{
					marginTop: "20px",
					padding: "15px",
					backgroundColor: "#f8f8f8",
					borderRadius: "5px",
					border: "1px solid #ddd"
				}}>
					<h3>Shareable Link:</h3>
					<div style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "10px"
					}}>
						<input 
							type="text" 
							value={shareLink} 
							readOnly 
							style={{
								flex: 1,
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #ccc",
								marginRight: "10px"
							}}
						/>
						<button 
							onClick={copyLinkToClipboard}
							style={{
								backgroundColor: linkCopied ? "#4CAF50" : "#FF69B4",
								color: "white",
								border: "none",
								padding: "8px 12px",
								borderRadius: "4px",
								cursor: "pointer"
							}}
						>
							{linkCopied ? "✓ Copied!" : "Copy"}
						</button>
					</div>
					<button 
						onClick={navigateToShare}
						style={{
							backgroundColor: "#FF69B4",
							color: "white",
							border: "none",
							padding: "8px 12px",
							borderRadius: "4px",
							cursor: "pointer"
						}}
					>
						🔍 View Shared Page
					</button>
				</div>
			)}
		</div>
	);
};

const FRAMES = {
	none: {
		draw: (ctx, x, y, width, height) => {}, // Empty function for no frame
	},
	pastel: {
		draw: (ctx, x, y, width, height) => {
			const drawSticker = (x, y, type) => {
				switch (type) {
					case "star":
						ctx.fillStyle = "#FFD700";
						ctx.beginPath();
						ctx.arc(x, y, 12, 0, Math.PI * 2);
						ctx.fill();
						break;
					case "heart":
						ctx.fillStyle = "#cc8084";
						ctx.beginPath();
						const heartSize = 22;
						ctx.moveTo(x, y + heartSize / 4);
						ctx.bezierCurveTo(
							x,
							y,
							x - heartSize / 2,
							y,
							x - heartSize / 2,
							y + heartSize / 4
						);
						ctx.bezierCurveTo(
							x - heartSize / 2,
							y + heartSize / 2,
							x,
							y + heartSize * 0.75,
							x,
							y + heartSize
						);
						ctx.bezierCurveTo(
							x,
							y + heartSize * 0.75,
							x + heartSize / 2,
							y + heartSize / 2,
							x + heartSize / 2,
							y + heartSize / 4
						);
						ctx.bezierCurveTo(x + heartSize / 2, y, x, y, x, y + heartSize / 4);
						ctx.fill();
						break;
					case "flower":
						ctx.fillStyle = "#FF9BE4";
						for (let i = 0; i < 5; i++) {
							ctx.beginPath();
							const angle = (i * 2 * Math.PI) / 5;
							ctx.ellipse(
								x + Math.cos(angle) * 10,
								y + Math.sin(angle) * 10,
								8,
								8,
								0,
								0,
								2 * Math.PI
							);
							ctx.fill();
						}
						// Center of flower
						ctx.fillStyle = "#FFE4E1";
						ctx.beginPath();
						ctx.arc(x, y, 6, 0, 2 * Math.PI);
						ctx.fill();
						break;
					case "bow":
						ctx.fillStyle = "#f9cee7";
						// Left loop
						ctx.beginPath();
						ctx.ellipse(x - 10, y, 10, 6, Math.PI / 4, 0, 2 * Math.PI);
						ctx.fill();
						// Right loop
						ctx.beginPath();
						ctx.ellipse(x + 10, y, 10, 6, -Math.PI / 4, 0, 2 * Math.PI);
						ctx.fill();
						// Center knot
						ctx.fillStyle = "#e68bbe";
						ctx.beginPath();
						ctx.arc(x, y, 4, 0, 2 * Math.PI);
						ctx.fill();
						break;
				}
			};

			// Top left corner
			drawSticker(x + 11, y + 5, "bow");
			drawSticker(x - 18, y + 95, "heart");

			// Top right corner
			drawSticker(x + width - 160, y + 10, "star");
			drawSticker(x + width - 1, y + 50, "heart");

			// Bottom left corner
			drawSticker(x + 120, y + height - 20, "heart");
			drawSticker(x + 20, y + height - 20, "star");

			// Bottom right corner
			drawSticker(x + width - 125, y + height - 5, "bow");
			drawSticker(x + width - 10, y + height - 45, "heart");
		},
	},

	cute: {
		draw: (ctx, x, y, width, height) => {
			const drawStar = (centerX, centerY, size, color = "#FFD700") => {
				ctx.fillStyle = color;
				ctx.beginPath();
				for (let i = 0; i < 5; i++) {
					const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
					const point = i === 0 ? "moveTo" : "lineTo";
					ctx[point](
						centerX + size * Math.cos(angle),
						centerY + size * Math.sin(angle)
					);
				}
				ctx.closePath();
				ctx.fill();
			};

			const drawCloud = (centerX, centerY) => {
				ctx.fillStyle = "#87CEEB";
				const cloudParts = [
					{ x: 0, y: 0, r: 14 },
					{ x: -6, y: 2, r: 10 },
					{ x: 6, y: 2, r: 10 },
				];
				cloudParts.forEach((part) => {
					ctx.beginPath();
					ctx.arc(centerX + part.x, centerY + part.y, part.r, 0, Math.PI * 2);
					ctx.fill();
				});
			};

			// Draw decorations around the frame
			// Top corners
			drawStar(x + 150, y + 18, 15, "#FFD700");
			drawCloud(x + 20, y + 5);
			drawStar(x + width - 1, y + 45, 12, "#FF69B4");
			drawCloud(x + width - 80, y + 5);

			// Bottom corners
			drawCloud(x + 150, y + height - 5);
			drawStar(x + 0, y + height - 65, 15, "#9370DB");
			drawCloud(x + width - 5, y + height - 85);
			drawStar(x + width - 120, y + height - 5, 12, "#40E0D0");
		},
	},
};

export default PhotoPreview;
