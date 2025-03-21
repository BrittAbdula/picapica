import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";

const PhotoPreview = ({ capturedImages: initialImages }) => {
	const stripCanvasRef = useRef(null);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();
	const [stripColor, setStripColor] = useState("white");
	const [selectedFrame, setSelectedFrame] = useState("none");
	const [shareLink, setShareLink] = useState("");
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);
	const [localImages, setLocalImages] = useState(Array(4).fill(null));
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);

	// 初始化照片数组 - 固定4个位置
	useEffect(() => {
		if (initialImages && initialImages.length > 0) {
			const newImages = [...Array(4).fill(null)];
			initialImages.forEach((img, index) => {
				if (index < 4) {
					newImages[index] = img;
				}
			});
			setLocalImages(newImages);
		}
	}, [initialImages]);

	const generatePhotoStrip = useCallback(() => {
		const canvas = stripCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		const imgWidth = 400;
		const imgHeight = 300;
		const borderSize = 40;
		const photoSpacing = 20;
		const textHeight = 50;
		const totalHeight = imgHeight * 4 + photoSpacing * 3 + borderSize * 2 + textHeight;

		canvas.width = imgWidth + borderSize * 2;
		canvas.height = totalHeight;

		// 先填充背景颜色
		ctx.fillStyle = stripColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 计算有多少实际照片需要加载
		const actualImages = localImages.filter((img) => img !== null);
		let imagesLoaded = 0;

		// 处理四个位置
		for (let i = 0; i < 4; i++) {
			const yOffset = borderSize + (imgHeight + photoSpacing) * i;

			if (localImages[i]) {
				// 绘制有照片的位置
				const img = new Image();
				img.src = localImages[i];
				img.onload = () => {
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

					if (FRAMES[selectedFrame] && typeof FRAMES[selectedFrame].draw === "function") {
						FRAMES[selectedFrame].draw(ctx, borderSize, yOffset, imgWidth, imgHeight);
					}

					imagesLoaded++;

					// 所有实际照片都加载完成后，添加底部文字
					if (imagesLoaded === actualImages.length) {
						addFooterAndWatermark(ctx, totalHeight, borderSize, canvas.width);
					}
				};
			} else {
				// 绘制空白位置的占位符
				ctx.fillStyle = "#f5f5f5";
				ctx.fillRect(borderSize, yOffset, imgWidth, imgHeight);

				ctx.fillStyle = "#cccccc";
				ctx.font = "16px Arial";
				ctx.textAlign = "center";
				ctx.fillText(
					"Add Photo " + (i + 1),
					borderSize + imgWidth / 2,
					yOffset + imgHeight / 2
				);
			}
		}

		// 如果没有照片，仍然显示底部文字
		if (actualImages.length === 0) {
			addFooterAndWatermark(ctx, totalHeight, borderSize, canvas.width);
		}
	}, [localImages, stripColor, selectedFrame]);

	const addFooterAndWatermark = (ctx, totalHeight, borderSize, canvasWidth) => {
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

		ctx.fillText("Picapica  " + timestamp, canvasWidth / 2, totalHeight - borderSize * 1);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.font = "12px Arial";
		ctx.textAlign = "center";

		ctx.fillText("pica pica.app   ", canvasWidth - borderSize, totalHeight - borderSize / 2);
	};

	// 每当localImages变化，都重新生成照片条
	useEffect(() => {
		setTimeout(() => {
			generatePhotoStrip();
		}, 100);
	}, [localImages, stripColor, selectedFrame, generatePhotoStrip]);

	const downloadPhotoStrip = () => {
		// 检查是否所有位置都有照片
		const allSlotsFilled = localImages.every((img) => img !== null);
		if (!allSlotsFilled) {
			alert("Please add photos to all slots before downloading.");
			return;
		}

		const link = document.createElement("a");
		link.download = "photostrip.png";
		link.href = stripCanvasRef.current.toDataURL("image/png");
		link.click();
	};

	const getShareableLink = async () => {
		// 检查是否所有位置都有照片
		const allSlotsFilled = localImages.every((img) => img !== null);
		if (!allSlotsFilled) {
			alert("Please add photos to all slots before sharing.");
			return;
		}

		if (!stripCanvasRef.current) return;

		try {
			setIsGeneratingLink(true);
			setLinkCopied(false);

			// Convert canvas to blob
			const blob = await new Promise((resolve) => {
				stripCanvasRef.current.toBlob(resolve, "image/png");
			});

			// Create form data
			const formData = new FormData();
			formData.append("image", blob, "photostrip.png");

			// Upload to server
			const response = await fetch("https://api.picapica.app/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload image");
			}

			const data = await response.json();

			// Generate shareable link
			const shareableLink = `${window.location.origin}/share?imageurl=${encodeURIComponent(
				data.imageUrl
			)}`;
			setShareLink(shareableLink);
		} catch (error) {
			console.error("Error generating link:", error);
			alert("Failed to generate shareable link. Please try again.");
		} finally {
			setIsGeneratingLink(false);
		}
	};

	const copyLinkToClipboard = () => {
		if (!shareLink) return;

		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(shareLink)
				.then(() => {
					setLinkCopied(true);
					setTimeout(() => setLinkCopied(false), 3000);
				})
				.catch((err) => {
					console.error("Failed to copy link:", err);
				});
		} else {
			// 回退方案
			const textArea = document.createElement("textarea");
			textArea.value = shareLink;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand("copy");
				setLinkCopied(true);
				setTimeout(() => setLinkCopied(false), 3000);
			} catch (err) {
				console.error("Fallback copy failed:", err);
			}
			document.body.removeChild(textArea);
		}
	};

	const navigateToShare = () => {
		if (!shareLink) return;

		// Extract the query parameter
		const imageUrl = new URL(shareLink).searchParams.get("imageurl");
		navigate(`/share?imageurl=${imageUrl}`);
	};

	const handleDeleteImage = (index) => {
		const newImages = [...localImages];
		newImages[index] = null;
		setLocalImages(newImages);
		setSelectedImageIndex(null);
	};

	const handleUploadImage = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				if (selectedImageIndex !== null) {
					// Replace existing image
					const newImages = [...localImages];
					newImages[selectedImageIndex] = event.target.result;
					setLocalImages(newImages);
					setSelectedImageIndex(null);
				}
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
		// Reset file input
		e.target.value = null;
	};

	const triggerFileUpload = (index) => {
		setSelectedImageIndex(index);
		fileInputRef.current.click();
	};

	// 拖拽开始
	const handleDragStart = (e, index) => {
		if (localImages[index] === null) return; // 空位置不能拖拽

		// 设置拖拽时的图像预览 (可选)
		if (e.dataTransfer.setDragImage && e.target.querySelector("img")) {
			const img = e.target.querySelector("img");
			e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
		}

		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", index.toString());

		setDraggedIndex(index);

		// 添加类使元素看起来正在被拖拽
		setTimeout(() => {
			e.target.style.opacity = "0.4";
		}, 0);
	};

	// 拖拽结束
	const handleDragEnd = (e) => {
		e.target.style.opacity = "1";
		setDraggedIndex(null);
		setDragOverIndex(null);

		// 清除所有拖拽效果
		document.querySelectorAll(".photo-item").forEach((item) => {
			item.classList.remove("drag-over");
			item.style.transform = "scale(1)";
			item.style.boxShadow = "";
		});
	};

	// 拖拽经过
	const handleDragOver = (e, index) => {
		e.preventDefault(); // 必须阻止默认行为以允许放置
		e.dataTransfer.dropEffect = "move";

		// 只有当拖拽到新位置时才更新状态
		if (dragOverIndex !== index) {
			setDragOverIndex(index);
		}
	};

	// 拖拽进入
	const handleDragEnter = (e, index) => {
		e.preventDefault();
		// 添加视觉反馈
		e.currentTarget.classList.add("drag-over");
		e.currentTarget.style.transform = "scale(1.03)";
		e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 123, 255, 0.5)";
	};

	// 拖拽离开
	const handleDragLeave = (e) => {
		e.preventDefault();
		// 移除视觉反馈
		e.currentTarget.classList.remove("drag-over");
		e.currentTarget.style.transform = "scale(1)";
		e.currentTarget.style.boxShadow = "";
	};

	// 放置
	const handleDrop = (e, targetIndex) => {
		e.preventDefault();
		e.stopPropagation();

		// 移除视觉反馈
		e.currentTarget.classList.remove("drag-over");
		e.currentTarget.style.transform = "scale(1)";
		e.currentTarget.style.boxShadow = "";

		// 获取拖拽的索引
		const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

		if (isNaN(dragIndex) || dragIndex === targetIndex) return;

		// 交换两个位置的照片
		const newImages = [...localImages];
		const temp = newImages[dragIndex];
		newImages[dragIndex] = newImages[targetIndex];
		newImages[targetIndex] = temp;

		setLocalImages(newImages);
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	// 计算已上传的照片数量
	const uploadedCount = localImages.filter((img) => img !== null).length;
	// 检查是否所有位置都有照片
	const allSlotsFilled = localImages.every((img) => img !== null);

	// 获取样式类名
	const getPhotoItemClassName = (index) => {
		let className = "photo-item";
		if (draggedIndex === index) {
			className += " dragged";
		}
		if (dragOverIndex === index) {
			className += " drag-over";
		}
		return className;
	};

	const enhancePhoto = () => {
		// 检查是否有照片可用
		const availablePhotos = localImages.filter((img) => img !== null);
		if (availablePhotos.length === 0) {
			alert("Please add at least one photo before enhancing.");
			return;
		}

		try {
			console.log("availablePhotos", availablePhotos, availablePhotos.length);
			console.log("JSON.stringify(availablePhotos)", JSON.stringify(availablePhotos));
			// 保存到localStorage
			localStorage.setItem("photoToEnhance", JSON.stringify(availablePhotos));
			localStorage.setItem("photoToEnhanceColor", stripColor);
			// 跳转到编辑页面
			navigate(`/editor`);
		} catch (error) {
			console.error("Error preparing photo for enhancement:", error);
			alert("Failed to prepare photo for enhancement. Please try again.");
		}
	};

	return (
		<>
			<Meta
				title="Customize Your Photo Strip"
				description="Customize your Picapica photo strip with different colors, frames, and stickers. Download or share your photo strip with friends and family."
				canonicalUrl="/preview"
			/>

			{/* CSS for drag and drop effects */}
			<style>
				{`
					.photo-item {
						transition: all 0.2s ease;
					}
					.photo-item.dragged {
						opacity: 0.4;
					}
					.photo-item.drag-over {
						background-color: rgba(0, 123, 255, 0.1);
						border: 2px dashed #007bff !important;
					}
					.photo-item:hover .drag-handle {
						opacity: 1;
					}
					.drag-handle {
						opacity: 0;
						transition: opacity 0.2s;
						cursor: move;
						background-color: rgba(0,0,0,0.1);
					}
					.photo-item.empty:hover {
						background-color: #f0f8ff;
						border-color: #89CFF0;
					}
				`}
			</style>

			<div className="photo-preview">
				<h2>Photo Strip Preview</h2>

				{/* Photo management section */}
				<div
					className="photo-management"
					style={{
						marginBottom: "20px",
						padding: "15px",
					}}
				>
					<h3 style={{ marginTop: 0 }}>Manage Photos</h3>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "15px",
							backgroundColor: "#e9f7fe",
							padding: "10px",
							borderRadius: "5px",
						}}
					>
						<span
							style={{
								marginRight: "10px",
								fontSize: "20px",
							}}
						>
							💡
						</span>
						<span style={{ fontSize: "14px" }}>
							Drag and drop photos to rearrange their order. Click empty slots to add
							new photos.
						</span>
					</div>

					<div
						className="photo-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(2, 1fr)",
							gap: "15px",
							marginBottom: "15px",
						}}
					>
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className={`${getPhotoItemClassName(index)} ${
									localImages[index] === null ? "empty" : ""
								}`}
								style={{
									position: "relative",
									border: "1px solid rgba(0,0,0,0.05)",
									overflow: "hidden",
									backgroundColor: localImages[index] ? "#fff" : "#f9f9f9",
									boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
									cursor: localImages[index] ? "move" : "pointer",
									minHeight: "160px",
									display: "flex",
									flexDirection: "column",
								}}
								onClick={() =>
									localImages[index] === null && triggerFileUpload(index)
								}
								draggable={localImages[index] !== null}
								onDragStart={(e) => handleDragStart(e, index)}
								onDragEnd={handleDragEnd}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragEnter={(e) => handleDragEnter(e, index)}
								onDragLeave={handleDragLeave}
								onDrop={(e) => handleDrop(e, index)}
							>
								{localImages[index] ? (
									<>
										{/* 拖动手柄 */}
										<div
											className="drag-handle"
											style={{
												position: "absolute",
												top: "0",
												left: "0",
												right: "0",
												padding: "5px",
												textAlign: "center",
												fontSize: "12px",
												zIndex: "10",
												borderRadius: "8px 8px 0 0",
											}}
										>
											<span role="img" aria-label="drag handle">
												⣿ DRAG TO REORDER ⣿
											</span>
										</div>

										{/* 照片容器 */}
										<div
											style={{
												position: "relative",
												paddingTop: "75%", // 4:3 aspect ratio
												flexGrow: 1,
												border: "1px solid rgba(0, 0, 0, 0.93)",
											}}
										>
											<img
												src={localImages[index]}
												alt={`Photo ${index + 1}`}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
											{/* 照片序号标记 */}
											<div
												style={{
													position: "absolute",
													top: "10px",
													right: "10px",
													backgroundColor: "#FF69B4",
													color: "white",
													borderRadius: "50%",
													width: "28px",
													height: "28px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "14px",
													fontWeight: "bold",
													boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
												}}
											>
												{index + 1}
											</div>
										</div>

										{/* 照片控制按钮 */}
										<div
											className="photo-actions"
											style={{
												display: "flex",
												justifyContent: "space-between",
												padding: "10px",
												backgroundColor: "rgba(0,0,0,0.05)",
											}}
										>
											<button
												onClick={(e) => {
													e.stopPropagation();
													triggerFileUpload(index);
												}}
												style={{
													backgroundColor: "#FF69B4",
													color: "white",
													border: "none",
													borderRadius: "4px",
													padding: "6px 10px",
													fontSize: "12px",
													cursor: "pointer",
													fontWeight: "bold",
												}}
											>
												📤 Replace
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteImage(index);
												}}
												style={{
													backgroundColor: "#ff4d4d",
													color: "white",
													border: "none",
													borderRadius: "4px",
													padding: "6px 10px",
													fontSize: "12px",
													cursor: "pointer",
													fontWeight: "bold",
												}}
											>
												🗑️ Delete
											</button>
										</div>
									</>
								) : (
									<div
										style={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											padding: "15px",
										}}
									>
										<div
											style={{
												width: "60px",
												height: "60px",
												borderRadius: "50%",
												backgroundColor: "#e0e0e0",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												marginBottom: "15px",
											}}
										>
											<span
												style={{
													fontSize: "32px",
													color: "#666",
												}}
											>
												➕
											</span>
										</div>
										<div
											style={{
												color: "#666",
												fontWeight: "bold",
											}}
										>
											Photo {index + 1}
										</div>
										<div
											style={{
												color: "#999",
												fontSize: "12px",
												marginTop: "5px",
												textAlign: "center",
											}}
										>
											Click to upload
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleUploadImage}
						accept="image/*"
						style={{ display: "none" }}
					/>

					<div
						style={{
							fontSize: "14px",
							color: "#666",
							textAlign: "center",
							backgroundColor: allSlotsFilled ? "#e8f5e9" : "#e9f7fe",
							padding: "10px",
							borderRadius: "5px",
							border: allSlotsFilled ? "1px solid #c8e6c9" : "1px solid #bbdefb",
						}}
					>
						<span role="img" aria-label="info">
							{allSlotsFilled ? "✅" : "ℹ️"}
						</span>{" "}
						{allSlotsFilled
							? "All photos added! Your photo strip is ready to download or share."
							: `${uploadedCount} of 4 photos added. ${
									4 - uploadedCount
							  } more needed to complete your strip.`}
					</div>
				</div>

				<div
					className="customization-section"
					style={{
						marginBottom: "20px",
						padding: "15px",
					}}
				>
					<h3 style={{ marginTop: 0, marginBottom: "15px" }}>Customize Your Strip</h3>

					<div style={{ marginBottom: "15px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "8px",
								fontWeight: "bold",
							}}
						>
							Background Color:
						</label>
						<div
							className="color-options"
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: "10px",
							}}
						>
							<button
								onClick={() => setStripColor("white")}
								style={{
									backgroundColor: "white",
									border:
										stripColor === "white"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								White
							</button>
							<button
								onClick={() => setStripColor("black")}
								style={{
									backgroundColor: "black",
									color: "white",
									border:
										stripColor === "black"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Black
							</button>
							<button
								onClick={() => setStripColor("#f6d5da")}
								style={{
									backgroundColor: "#f6d5da",
									border:
										stripColor === "#f6d5da"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Pink
							</button>
							<button
								onClick={() => setStripColor("#dde6d5")}
								style={{
									backgroundColor: "#dde6d5",
									border:
										stripColor === "#dde6d5"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Green
							</button>
							<button
								onClick={() => setStripColor("#adc3e5")}
								style={{
									backgroundColor: "#adc3e5",
									border:
										stripColor === "#adc3e5"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Blue
							</button>
							<button
								onClick={() => setStripColor("#FFF2CC")}
								style={{
									backgroundColor: "#FFF2CC",
									border:
										stripColor === "#FFF2CC"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Yellow
							</button>
							<button
								onClick={() => setStripColor("#dbcfff")}
								style={{
									backgroundColor: "#dbcfff",
									border:
										stripColor === "#dbcfff"
											? "3px solid #FF69B4"
											: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Purple
							</button>
						</div>
					</div>

					<div>
						<label
							style={{
								display: "block",
								marginBottom: "8px",
								fontWeight: "bold",
							}}
						>
							Sticker Style:
						</label>
						<div
							className="frame-options"
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: "10px",
							}}
						>
							<button
								onClick={() => setSelectedFrame("pastel")}
								style={{
									backgroundColor:
										selectedFrame === "pastel" ? "#FF69B4" : "#f8f8f8",
									color: selectedFrame === "pastel" ? "white" : "black",
									border: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Girlypop Stickers
							</button>
							<button
								onClick={() => setSelectedFrame("cute")}
								style={{
									backgroundColor:
										selectedFrame === "cute" ? "#FF69B4" : "#f8f8f8",
									color: selectedFrame === "cute" ? "white" : "black",
									border: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								Cute Stickers
							</button>
							<button
								onClick={() => setSelectedFrame("none")}
								style={{
									backgroundColor:
										selectedFrame === "none" ? "#FF69B4" : "#f8f8f8",
									color: selectedFrame === "none" ? "white" : "black",
									border: "1px solid #ddd",
									borderRadius: "5px",
									padding: "10px 15px",
								}}
							>
								No Stickers
							</button>
						</div>
					</div>
				</div>

				<div
					style={{
						padding: "20px",
						marginBottom: "20px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<canvas
						ref={stripCanvasRef}
						className="photo-strip"
						style={{
							maxWidth: "100%",
							height: "auto",
							boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
						}}
					/>
				</div>

				<div
					className="strip-buttons"
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "15px",
						justifyContent: "center",
						marginBottom: "30px",
					}}
				>
					<button
						onClick={downloadPhotoStrip}
						disabled={!allSlotsFilled}
						style={{
							backgroundColor: allSlotsFilled ? "#4CAF50" : "#e0e0e0",
							color: "white",
							border: "none",
							padding: "12px 20px",
							borderRadius: "5px",
							cursor: allSlotsFilled ? "pointer" : "not-allowed",
							fontWeight: "bold",
							fontSize: "16px",
						}}
					>
						📥 Download Photo Strip
					</button>
					<button
						onClick={() => navigate("/photobooth")}
						style={{
							backgroundColor: "#555555",
							color: "white",
							border: "none",
							padding: "12px 20px",
							borderRadius: "5px",
							cursor: "pointer",
							fontWeight: "bold",
							fontSize: "16px",
						}}
					>
						🔄 Take New Photos
					</button>
					<button
						onClick={getShareableLink}
						disabled={isGeneratingLink || !allSlotsFilled}
						style={{
							backgroundColor: "#FF69B4",
							color: "white",
							border: "none",
							padding: "12px 20px",
							borderRadius: "5px",
							cursor: isGeneratingLink || !allSlotsFilled ? "not-allowed" : "pointer",
							opacity: !allSlotsFilled ? 0.6 : 1,
							fontWeight: "bold",
							fontSize: "16px",
						}}
					>
						{isGeneratingLink ? "Generating..." : "🔗 Get Shareable Link"}
					</button>
					<button
						onClick={enhancePhoto}
						disabled={!allSlotsFilled}
						style={{
							backgroundColor: localImages.some((img) => img !== null)
								? "#1E90FF"
								: "#e0e0e0",
							color: "white",
							border: "none",
							padding: "12px 20px",
							borderRadius: "5px",
							cursor: localImages.some((img) => img !== null)
								? "pointer"
								: "not-allowed",
							fontWeight: "bold",
							fontSize: "16px",
						}}
					>
						✨ Enhance Photo
					</button>
				</div>

				{!allSlotsFilled && (
					<div
						style={{
							marginTop: "15px",
							padding: "15px",
							backgroundColor: "#FFF3CD",
							borderRadius: "5px",
							border: "1px solid #FFEEBA",
							color: "#856404",
							fontSize: "14px",
							textAlign: "center",
						}}
					>
						<strong>Notice:</strong> Please add photos to all 4 positions to enable
						download and sharing.
					</div>
				)}

				{shareLink && (
					<div
						className="share-link-container"
						style={{
							marginTop: "20px",
							padding: "15px",
							backgroundColor: "#f8f8f8",
							borderRadius: "5px",
							border: "1px solid #ddd",
						}}
					>
						<h3>Shareable Link:</h3>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: "10px",
							}}
						>
							<input
								type="text"
								value={shareLink}
								readOnly
								style={{
									flex: 1,
									padding: "8px",
									borderRadius: "4px",
									border: "1px solid #ccc",
									marginRight: "10px",
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
									cursor: "pointer",
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
								cursor: "pointer",
							}}
						>
							🔍 View Shared Page
						</button>
					</div>
				)}
			</div>
		</>
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
					ctx[point](centerX + size * Math.cos(angle), centerY + size * Math.sin(angle));
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
