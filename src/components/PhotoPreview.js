import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Meta from "./Meta";
import FrameService from "../services/frameService";
import QRCode from 'qrcode';
import { getAuthHeaders } from '../utils/auth';
import './PhotoPreview.css';

const PhotoPreview = ({ capturedImages: initialImages }) => {
	const stripCanvasRef = useRef(null);
	const fileInputRef = useRef(null);
	const multipleFilesInputRef = useRef(null);
	const navigate = useNavigate();
	const [stripColor, setStripColor] = useState("white");
	const [borderWidth, setBorderWidth] = useState(0); // 新增：照片边框宽度设置
	const location = useLocation();
	const [selectedFrame, setSelectedFrame] = useState(location.state?.frameType || localStorage.getItem("selectedFrame") || "none");
	const [shareLink, setShareLink] = useState("");
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);
	const [localImages, setLocalImages] = useState(Array(4).fill(null));
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [prediction, setPrediction] = useState(null);
	const [isFetchingPrediction, setIsFetchingPrediction] = useState(false);
	const [showPrediction, setShowPrediction] = useState(false);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [customColor, setCustomColor] = useState("#FFFFFF");
	const [activeDrawer, setActiveDrawer] = useState(null); // null, 'customize', 'manage'
	const [customizeTab, setCustomizeTab] = useState('colors'); // 'colors', 'frames', 'border'
	const [qrCodeUrl, setQrCodeUrl] = useState("");
	// 添加新的状态变量
	const [isRandomizing, setIsRandomizing] = useState(false);
	const [randomSuccess, setRandomSuccess] = useState(false);
	const [availableFrames, setAvailableFrames] = useState([]);

	// 加载可用的frames并预加载常用frames
	useEffect(() => {
		const loadFrames = async () => {
			try {
				const frames = await FrameService.getAllFrames();
				let allFrames = [...frames];
				
				// 检查是否有生成的框架
				const generatedFrameData = localStorage.getItem('generatedFrame');
				if (generatedFrameData) {
					try {
						const frameData = JSON.parse(generatedFrameData);
						// 将生成的框架添加到列表顶部
						allFrames.unshift({
							name: 'generated',
							description: `AI Generated: ${frameData.description || 'Custom Frame'}`
						});
					} catch (error) {
						console.error('Error parsing generated frame data:', error);
					}
				}
				
				setAvailableFrames(allFrames);
				
				// 使用 FrameService 的预加载功能
				const frameNames = frames.map(f => f.name);
				
				// 预加载前5个最常用的 frames
				const priorityFrames = ['none', 'pastel', 'retro', 'neon', 'vintage'].filter(name => 
					frameNames.includes(name)
				);
				if (priorityFrames.length > 0) {
					await FrameService.preloadFrames(priorityFrames);
				}
				
				// 后台预加载剩余的 frames
				const remainingFrames = frameNames.filter(name => !priorityFrames.includes(name));
				if (remainingFrames.length > 0) {
					setTimeout(() => {
						FrameService.preloadFrames(remainingFrames.slice(0, 10)); // 限制预加载数量
					}, 1000);
				}
				
			} catch (error) {
				console.error('Failed to load frames:', error);
				// 设置默认frames作为fallback
				let fallbackFrames = [
					{ name: 'none', description: 'No frame' },
					{ name: 'pastel', description: 'Pastel theme' }
				];
				
				// 即使在错误情况下也检查生成的框架
				const generatedFrameData = localStorage.getItem('generatedFrame');
				if (generatedFrameData) {
					try {
						const frameData = JSON.parse(generatedFrameData);
						fallbackFrames.unshift({
							name: 'generated',
							description: `AI Generated: ${frameData.description || 'Custom Frame'}`
						});
					} catch (error) {
						console.error('Error parsing generated frame data:', error);
					}
				}
				
				setAvailableFrames(fallbackFrames);
			}
		};
		loadFrames();
	}, []);
	
	// 监听页面focus事件，当用户返回页面时重新检查生成的框架
	useEffect(() => {
		const handleFocus = () => {
			// 重新加载框架列表以包含新生成的框架
			const checkGeneratedFrame = () => {
				const generatedFrameData = localStorage.getItem('generatedFrame');
				if (generatedFrameData) {
					try {
						const frameData = JSON.parse(generatedFrameData);
						const hasGeneratedFrame = availableFrames.some(f => f.name === 'generated');
						
						if (!hasGeneratedFrame) {
							// 如果还没有生成的框架在列表中，添加它
							setAvailableFrames(prev => [
								{
									name: 'generated',
									description: `AI Generated: ${frameData.description || 'Custom Frame'}`
								},
								...prev
							]);
						}
					} catch (error) {
						console.error('Error parsing generated frame data:', error);
					}
				}
			};
			
			checkGeneratedFrame();
		};
		
		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, [availableFrames]);

	// 实现随机样式选择功能
	const handleRandomStyle = () => {
		// 设置正在随机标志
		setIsRandomizing(true);

		// 随机选择框架
		const frameKeys = availableFrames.map(f => f.name);
		const randomFrameIndex = Math.floor(Math.random() * frameKeys.length);
		const randomFrame = frameKeys[randomFrameIndex];

		// 随机选择颜色
		const randomColorIndex = Math.floor(Math.random() * bgColorOptions.length);
		const randomColor = bgColorOptions[randomColorIndex].value;

		// 随机选择边框宽度
		const randomBorderIndex = Math.floor(Math.random() * borderWidthOptions.length);
		const randomBorderWidth = borderWidthOptions[randomBorderIndex].value;

		// 应用随机样式
		setSelectedFrame(randomFrame);
		setStripColor(randomColor);
		setBorderWidth(randomBorderWidth);

		// 切换到自定义选项卡以显示选择结果
		setActiveDrawer('customize');
		setCustomizeTab('frames');

		// 显示成功提示
		setTimeout(() => {
			setIsRandomizing(false);
			setRandomSuccess(true);

			// 3秒后隐藏成功提示
			setTimeout(() => {
				setRandomSuccess(false);
			}, 3000);

			// 依次切换到各个选项卡展示效果
			setTimeout(() => setCustomizeTab('colors'), 600);
			setTimeout(() => setCustomizeTab('border'), 1200);
			setTimeout(() => setCustomizeTab('frames'), 1800);
			// 关闭选项卡

			if (isMobile) {
				setActiveDrawer(null);
			}
		}, 800);
	};
	// 检测设备宽度
	const isMobile = window.innerWidth <= 768;

	// 定义边框宽度选项
	const borderWidthOptions = [
		{ name: "0px", value: 0 },
		{ name: "2px", value: 2 },
		{ name: "5px", value: 5 },
		{ name: "10px", value: 10 },
		{ name: "15px", value: 15 },
		{ name: "20px", value: 20 }
	];

	// 初始化照片数组 - 固定4个位置
	useEffect(() => {
		if (!isMobile) {
			setActiveDrawer('customize')
		}
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

	// 应用frame的函数（优化版本）
	const applyFrame = useCallback(async (ctx, x, y, width, height) => {
		if (!selectedFrame || selectedFrame === 'none') {
			return;
		}
		
		// 检查是否是生成的框架
		if (selectedFrame === 'generated') {
			try {
				// 从 localStorage 获取生成的框架数据
				const generatedFrameData = localStorage.getItem('generatedFrame');
				if (generatedFrameData) {
					const frameData = JSON.parse(generatedFrameData);
					console.log('PhotoPreview: Using generated frame for composition');
					
					// 使用 FrameService 创建 draw 函数
					const drawFunction = FrameService.createFrameDrawFunction(frameData.code);
					if (typeof drawFunction === 'function') {
						try {
							await drawFunction(ctx, x, y, width, height);
							console.log('PhotoPreview: Generated frame applied successfully');
						} catch (error) {
							console.error('PhotoPreview: Error executing generated frame function:', error);
						}
						return;
					}
				}
				console.warn('PhotoPreview: No generated frame data found');
				return;
			} catch (error) {
				console.error('PhotoPreview: Error applying generated frame:', error);
				return;
			}
		}
		
		// 使用 FrameService 的全局缓存，无需本地状态管理
		try {
			const drawFunction = await FrameService.getFrameDrawFunction(selectedFrame);
			
			if (typeof drawFunction === 'function') {
				await drawFunction(ctx, x, y, width, height);
			}
		} catch (error) {
			console.error(`PhotoPreview: Error applying frame ${selectedFrame}:`, error);
		}
	}, [selectedFrame]);

	const generatePhotoStrip = useCallback(async () => {
		const canvas = stripCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		// 使用4:3比例
		const imgWidth = 400;
		const imgHeight = 300; // 400/300 = 4:3
		const borderSize = 20;
		const photoSpacing = 20;
		const textHeight = showPrediction && prediction ? 150 : 60;
		const totalHeight =
			imgHeight * 4 + photoSpacing * 3 + borderSize * 2 + textHeight;

		canvas.width = imgWidth + borderSize * 2;
		canvas.height = totalHeight;

		// 先填充背景颜色
		ctx.fillStyle = stripColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 预加载 frame 函数，减少重复调用
		let frameDrawFunction = null;
		if (selectedFrame && selectedFrame !== 'none') {
			try {
				if (selectedFrame === 'generated') {
					const generatedFrameData = localStorage.getItem('generatedFrame');
					if (generatedFrameData) {
						const frameData = JSON.parse(generatedFrameData);
						frameDrawFunction = FrameService.createFrameDrawFunction(frameData.code);
					}
				} else {
					frameDrawFunction = await FrameService.getFrameDrawFunction(selectedFrame);
				}
			} catch (error) {
				console.error('Error preloading frame function:', error);
			}
		}

		// 计算有多少实际照片需要加载
		const actualImages = localImages.filter(img => img !== null);
		let imagesLoaded = 0;

		// 处理四个位置
		for (let i = 0; i < 4; i++) {
			const yOffset = borderSize + (imgHeight + photoSpacing) * i;

			if (localImages[i]) {
				// 绘制有照片的位置
				const img = new Image();
				img.src = localImages[i];
				img.onload = async () => {
					// 确保4:3比例
					const imageRatio = img.width / img.height;
					const targetRatio = 4/3; // 固定4:3比例

					let sourceWidth = img.width;
					let sourceHeight = img.height;
					let sourceX = 0;
					let sourceY = 0;

					// 裁剪图片以适应4:3比例
					if (imageRatio > targetRatio) {
						// 图片太宽，裁剪左右两边
						sourceWidth = sourceHeight * targetRatio;
						sourceX = (img.width - sourceWidth) / 2;
					} else {
						// 图片太高，裁剪上下两边
						sourceHeight = sourceWidth / targetRatio;
						sourceY = (img.height - sourceHeight) / 2;
					}

					// 如果设置了边框宽度，先绘制白色边框
					if (borderWidth > 0) {
						ctx.fillStyle = "white";
						ctx.fillRect(
							borderSize,
							yOffset,
							imgWidth,
							imgHeight
						);
					}

					// 根据边框宽度调整图片大小
					const adjustedWidth = imgWidth - (borderWidth * 2);
					const adjustedHeight = imgHeight - (borderWidth * 2);

					// 绘制图片（考虑边框宽度）
					ctx.drawImage(
						img,
						sourceX,
						sourceY,
						sourceWidth,
						sourceHeight,
						borderSize + borderWidth,
						yOffset + borderWidth,
						adjustedWidth,
						adjustedHeight
					);

					// 应用预加载的frame函数
					if (frameDrawFunction && typeof frameDrawFunction === 'function') {
						ctx.save();
						ctx.translate(borderSize, yOffset);
						try {
							await frameDrawFunction(ctx, 0, 0, imgWidth, imgHeight);
						} catch (error) {
							console.error(`Error applying frame at position ${i}:`, error);
						}
						ctx.restore();
					}

					// 如果有预言且需要显示，在照片上添加关键词
					if (showPrediction && prediction && prediction.keywords && prediction.keywords[i]) {
						// 添加半透明背景
						ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
						ctx.fillRect(borderSize, yOffset + imgHeight - 40, imgWidth, 40);

						// 添加关键词文本
						ctx.fillStyle = "#ffffff";
						ctx.font = "bold 20px Arial";
						ctx.textAlign = "center";
						ctx.fillText(
							prediction.keywords[i],
							borderSize + imgWidth / 2,
							yOffset + imgHeight - 15
						);
					}

					imagesLoaded++;

					// 所有实际照片都加载完成后，添加底部文字
					if (imagesLoaded === actualImages.length) {
						addFooterAndWatermark(ctx, totalHeight, borderSize, canvas.width);

						// 添加预言总结
						if (showPrediction && prediction && prediction.summary) {
							const summaryY = borderSize + (imgHeight + photoSpacing) * 4 - 10;

							// 添加预言文本 - 自动换行
							ctx.fillStyle = "#333333";
							ctx.font = "16px Arial";
							ctx.textAlign = "left"; // 内容仍然是左对齐
							const maxWidth = imgWidth - 20;
							const words = prediction.summary.split(' ');
							let line = '';
							let y = summaryY + 50;

							for (let n = 0; n < words.length; n++) {
								const testLine = line + words[n] + ' ';
								const metrics = ctx.measureText(testLine);
								const testWidth = metrics.width;

								if (testWidth > maxWidth && n > 0) {
									ctx.fillText(line, borderSize + 10, y);
									line = words[n] + ' ';
									y += 20;
								} else {
									line = testLine;
								}
							}
							ctx.fillText(line, borderSize + 10, y);
						}
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

				// 使用预加载的frame函数
				if (frameDrawFunction && typeof frameDrawFunction === 'function') {
					ctx.save();
					ctx.translate(borderSize, yOffset);
					try {
						await frameDrawFunction(ctx, 0, 0, imgWidth, imgHeight);
					} catch (error) {
						console.error(`Error applying frame at empty position ${i}:`, error);
					}
					ctx.restore();
				}
			}
		}

		// 如果没有照片，仍然显示底部文字
		if (actualImages.length === 0) {
			addFooterAndWatermark(ctx, totalHeight, borderSize, canvas.width);
		}
	}, [localImages, stripColor, selectedFrame, prediction, showPrediction, borderWidth]);

	const addFooterAndWatermark = (ctx, totalHeight, borderSize, canvasWidth) => {
		const now = new Date();
		// 手写体风格的日期格式：Jul 3, 2025
		const timestamp = now.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric", 
			year: "numeric",
		});

		ctx.fillStyle = stripColor === "black" ? "white" : "black";
		// 使用手写体风格字体，降级到 cursive 通用字体族
		ctx.font = "20px 'Brush Script MT', 'Lucida Handwriting', cursive";
		ctx.textAlign = "center";

		// 调整时间戳位置，确保有足够空间显示（20px字体需要至少25px空间）
		ctx.fillText(
			timestamp,
			canvasWidth / 2,
			totalHeight - Math.max(borderSize, 25)
		);

		ctx.fillStyle = stripColor === "black" ? "white" : "black";
		ctx.font = "12px Arial";
		ctx.textAlign = "right";

		// 调整水印位置，右侧留出20px空间，确保不与时间戳重叠
		ctx.fillText(
			"Picapica.app",
			canvasWidth - 20,
			totalHeight - Math.max(borderSize / 2, 8)
		);
	};

	// 每当localImages变化，都重新生成照片条
	useEffect(() => {
		setTimeout(() => {
			generatePhotoStrip();
		}, 100);
	}, [localImages, stripColor, selectedFrame, generatePhotoStrip, borderWidth]);

	// 开发环境下显示缓存统计
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			const interval = setInterval(() => {
				const stats = FrameService.getCacheStats();
				console.log('FrameService Cache Stats:', stats);
			}, 30000); // 30秒输出一次

			return () => clearInterval(interval);
		}
	}, []);

	// 生成QR码
	const generateQRCode = async (url) => {
		try {
			// 使用 qrcode 库生成 Base64 图像 URL
			const qrCodeDataUrl = await QRCode.toDataURL(url, {
				width: 200, // 设置二维码宽度
				margin: 2   // 设置边距
			});
			return qrCodeDataUrl; // 返回生成的二维码图像 URL
		} catch (error) {
			console.error('generate qrcode error:', error);
			throw error;
		}
	};

	const downloadPhotoStrip = () => {
		// 检查是否所有位置都有照片
		const allSlotsFilled = localImages.every(img => img !== null);
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
		const allSlotsFilled = localImages.every(img => img !== null);
		if (!allSlotsFilled) {
			alert("Please add photos to all slots before sharing.");
			return;
		}

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
			formData.append('frame', selectedFrame);
			formData.append('image', blob, 'photostrip.png');

			// Upload to server
			const response = await fetch('https://api.picapica.app/api/photos/upload', {
				method: 'POST',
			headers: getAuthHeaders(false), // 不包含Content-Type让浏览器自动设置multipart/form-data
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to upload image');
			}

			const data = await response.json();

			// Generate shareable link
			const shareableLink = `https://picapica.app/share?imageurl=${data.imageUrl}`;
			setShareLink(shareableLink);

			// 生成QR码URL
			const qrCodeURL = await generateQRCode(shareableLink);
			setQrCodeUrl(qrCodeURL);

		} catch (error) {
			console.error('Error generating link:', error);
			alert('Failed to generate shareable link. Please try again.');
		} finally {
			setIsGeneratingLink(false);
		}
	};

	const copyLinkToClipboard = () => {
		if (!shareLink) return;

		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(shareLink)
				.then(() => {
					setLinkCopied(true);
					setTimeout(() => setLinkCopied(false), 3000);
				})
				.catch(err => {
					console.error('Failed to copy link:', err);
				});
		} else {
			// 回退方案
			const textArea = document.createElement('textarea');
			textArea.value = shareLink;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				setLinkCopied(true);
				setTimeout(() => setLinkCopied(false), 3000);
			} catch (err) {
				console.error('Fallback copy failed:', err);
			}
			document.body.removeChild(textArea);
		}
	};

	// 获取人生四格预言的函数
	const getPrediction = async () => {
		// 检查是否所有位置都有照片
		const allSlotsFilled = localImages.every(img => img !== null);
		if (!allSlotsFilled) {
			alert("Please add photos to all 4 positions before analysis.");
			return;
		}

		if (!stripCanvasRef.current) return;

		try {
			setIsFetchingPrediction(true);

			let imageUrl;

			// 如果已经生成了分享链接，提取图片URL而不是重新上传
			if (shareLink) {
				const urlParams = new URL(shareLink).searchParams;
				imageUrl = urlParams.get('imageurl');
				if (!imageUrl) {
					throw new Error('Could not extract image URL from share link');
				}
			} else {
				// 首先上传照片，获取图片URL
				const blob = await new Promise(resolve => {
					stripCanvasRef.current.toBlob(resolve, 'image/png');
				});

				// 创建表单并上传
				const formData = new FormData();
				formData.append('image', blob, 'photostrip.png');

				// 上传到服务器
				const response = await fetch('https://api.picapica.app/api/photos/upload', {
					method: 'POST',
				headers: getAuthHeaders(false), // 不包含Content-Type让浏览器自动设置multipart/form-data
					body: formData
				});

				if (!response.ok) {
					throw new Error('Failed to upload image');
				}

				const data = await response.json();
				imageUrl = data.imageUrl;
			}

			// 分析照片获取预言
			const analysisResponse = await fetch('https://api.picapica.app/api/ai/analyze-photo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ imageUrl: imageUrl })
			});

			if (!analysisResponse.ok) {
				throw new Error('Failed to analyze image');
			}

			const analysisResult = await analysisResponse.json();

			if (analysisResult.success && analysisResult.data) {
				setPrediction(analysisResult.data);
				setShowPrediction(true);
			} else {
				throw new Error('Invalid analysis result');
			}

		} catch (error) {
			console.error('Error getting prediction:', error);
			alert('Failed to get prediction. Please try again.');
		} finally {
			setIsFetchingPrediction(false);
		}
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

	// 处理多张照片上传
	const handleUploadMultipleImages = (e) => {
		const files = Array.from(e.target.files);
		if (!files.length) return;

		// 限制最多上传4张
		const filesToProcess = files.slice(0, 4);

		// 查找空槽
		let emptySlots = [];
		localImages.forEach((img, index) => {
			if (img === null) {
				emptySlots.push(index);
			}
		});

		// 如果没有空槽，就从头覆盖
		if (emptySlots.length === 0) {
			emptySlots = [0, 1, 2, 3].slice(0, filesToProcess.length);
		}

		// 只使用需要的空槽
		emptySlots = emptySlots.slice(0, filesToProcess.length);

		// 创建新的图片数组
		const newImages = [...localImages];

		// 处理每张照片
		const processFile = (file, slotIndex) => {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					const img = new Image();
					img.onload = () => {
						newImages[slotIndex] = event.target.result;
						resolve();
					};
					img.src = event.target.result;
				};
				reader.readAsDataURL(file);
			});
		};

		// 并行处理所有照片
		Promise.all(filesToProcess.map((file, index) => {
			return processFile(file, emptySlots[index]);
		})).then(() => {
			setLocalImages(newImages);
		});

		// 重置文件输入
		e.target.value = null;
	};

	const triggerFileUpload = (index) => {
		setSelectedImageIndex(index);
		fileInputRef.current.click();
	};

	const triggerMultipleFilesUpload = () => {
		multipleFilesInputRef.current.click();
	};

	// 拖拽开始
	const handleDragStart = (e, index) => {
		if (localImages[index] === null) return; // 空位置不能拖拽

		// 设置拖拽时的图像预览 (可选)
		if (e.dataTransfer.setDragImage && e.target.querySelector('img')) {
			const img = e.target.querySelector('img');
			e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
		}

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', index.toString());

		setDraggedIndex(index);

		// 添加类使元素看起来正在被拖拽
		setTimeout(() => {
			e.target.style.opacity = '0.4';
		}, 0);
	};

	// 拖拽结束
	const handleDragEnd = (e) => {
		e.target.style.opacity = '1';
		setDraggedIndex(null);
		setDragOverIndex(null);

		// 清除所有拖拽效果
		document.querySelectorAll('.photo-item').forEach(item => {
			item.classList.remove('drag-over');
			item.style.transform = 'scale(1)';
			item.style.boxShadow = '';
		});
	};

	// 拖拽经过
	const handleDragOver = (e, index) => {
		e.preventDefault(); // 必须阻止默认行为以允许放置
		e.dataTransfer.dropEffect = 'move';

		// 只有当拖拽到新位置时才更新状态
		if (dragOverIndex !== index) {
			setDragOverIndex(index);
		}
	};

	// 拖拽进入
	const handleDragEnter = (e, index) => {
		e.preventDefault();
		// 添加视觉反馈
		e.currentTarget.classList.add('drag-over');
		e.currentTarget.style.transform = 'scale(1.03)';
		e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 123, 255, 0.5)';
	};

	// 拖拽离开
	const handleDragLeave = (e) => {
		e.preventDefault();
		// 移除视觉反馈
		e.currentTarget.classList.remove('drag-over');
		e.currentTarget.style.transform = 'scale(1)';
		e.currentTarget.style.boxShadow = '';
	};

	// 放置
	const handleDrop = (e, targetIndex) => {
		e.preventDefault();
		e.stopPropagation();

		// 移除视觉反馈
		e.currentTarget.classList.remove('drag-over');
		e.currentTarget.style.transform = 'scale(1)';
		e.currentTarget.style.boxShadow = '';

		// 获取拖拽的索引
		const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

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
	const uploadedCount = localImages.filter(img => img !== null).length;
	// 检查是否所有位置都有照片
	const allSlotsFilled = localImages.every(img => img !== null);

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

	// 定义背景颜色选项数组
	const bgColorOptions = [
		{ name: "White", value: "white" },
		{ name: "Black", value: "black" },
		{ name: "Pink", value: "#f6d5da" },
		{ name: "Green", value: "#dde6d5" },
		{ name: "Blue", value: "#adc3e5" },
		{ name: "Yellow", value: "#FFF2CC" },
		{ name: "Purple", value: "#dbcfff" },
		{ name: "Coral", value: "#FF6B6B" },
		{ name: "Mint", value: "#4ECDC4" },
	];

	// 判断颜色是否为深色的辅助函数
	const isDarkColor = (color) => {
		// 对于命名颜色的特殊处理
		if (color === 'black') return true;
		if (color === 'white') return false;
		
		// 对于十六进制颜色，计算亮度
		if (color.startsWith('#')) {
			const hex = color.replace('#', '');
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			// 使用相对亮度公式
			const brightness = (r * 299 + g * 587 + b * 114) / 1000;
			return brightness < 128;
		}
		
		return false;
	};

	// 渲染自定义抽屉内容
	const renderCustomizeDrawer = () => {
		return (
			<div className="customization-section" style={{
				padding: "15px"
			}}>
				<div style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "10px"
				}}>
					<div style={{
						display: "flex",
						borderBottom: "1px solid #ddd",
						width: "100%"
					}}>
						<button
							className={customizeTab === 'colors' ? 'active-tab' : ''}
							onClick={() => setCustomizeTab('colors')}
							style={{
								flex: 1,
								background: customizeTab === 'colors' ? "#FF69B4" : "#f0f0f0",
								color: customizeTab === 'colors' ? "white" : "#333",
								border: "none",
								padding: "8px 15px",
								borderRadius: "5px 5px 0 0",
								fontWeight: customizeTab === 'colors' ? "bold" : "normal",
								cursor: "pointer"
							}}
						>
							Colors
						</button>
						<button
							className={customizeTab === 'frames' ? 'active-tab' : ''}
							onClick={() => setCustomizeTab('frames')}
							style={{
								flex: 1,
								background: customizeTab === 'frames' ? "#FF69B4" : "#f0f0f0",
								color: customizeTab === 'frames' ? "white" : "#333",
								border: "none",
								padding: "8px 15px",
								borderRadius: "5px 5px 0 0",
								fontWeight: customizeTab === 'frames' ? "bold" : "normal",
								cursor: "pointer"
							}}
						>
							Frames
						</button>
						<button
							className={customizeTab === 'border' ? 'active-tab' : ''}
							onClick={() => setCustomizeTab('border')}
							style={{
								flex: 1,
								background: customizeTab === 'border' ? "#FF69B4" : "#f0f0f0",
								color: customizeTab === 'border' ? "white" : "#333",
								border: "none",
								padding: "8px 15px",
								borderRadius: "5px 5px 0 0",
								fontWeight: customizeTab === 'border' ? "bold" : "normal",
								cursor: "pointer"
							}}
						>
							Border
						</button>
					</div>
				</div>

				{customizeTab === 'colors' && (
					<>
						{/* PC端颜色网格 */}
						{!isMobile && (
							<div className="color-options" style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "10px"
							}}>
								{bgColorOptions.map((color) => (
									<button
										key={color.value}
										onClick={() => setStripColor(color.value)}
										className={`color-button ${
											stripColor === color.value ? 'selected' : ''
										} ${
											isDarkColor(color.value) ? 'dark-background' : 'light-background'
										}`}
										data-color={color.value}
										style={{
											'--button-bg-color': color.value
										}}
									>
										{color.name}
									</button>
								))}

								<label className="color-button custom-color-button">
									Custom
									<input
										type="color"
										value={customColor}
										onChange={(e) => {
											setCustomColor(e.target.value);
											setStripColor(e.target.value);
										}}
									/>
								</label>
							</div>
						)}

						{/* 移动端两行颜色网格 */}
						{isMobile && (
							<div className="mobile-colors-grid" style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gridTemplateRows: "repeat(4, auto)",
								gap: "8px",
								padding: "5px 0"
							}}>
								{bgColorOptions.map((color) => (
									<button
										key={color.value}
										onClick={() => setStripColor(color.value)}
										className={`color-button ${
											stripColor === color.value ? 'selected' : ''
										} ${
											isDarkColor(color.value) ? 'dark-background' : 'light-background'
										}`}
										data-color={color.value}
										style={{
											'--button-bg-color': color.value
										}}
									>
										{color.name}
									</button>
								))}

								<label className="color-button custom-color-button">
									Custom
									<input
										type="color"
										value={customColor}
										onChange={(e) => {
											setCustomColor(e.target.value);
											setStripColor(e.target.value);
										}}
									/>
								</label>
							</div>
						)}
					</>
				)}

				{customizeTab === 'frames' && (
					<>
											{/* PC 端多行显示框架选项 */}
					{!isMobile && (
						<div className="frame-options" style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "8px"
						}}>
							{availableFrames.map((frame) => (
								<button
									key={frame.name}
									onClick={() => setSelectedFrame(frame.name)}
									style={{
										backgroundColor: selectedFrame === frame.name ? "#FF69B4" : "#f8f8f8",
										color: selectedFrame === frame.name ? "white" : "black",
										border: "1px solid #ddd",
										borderRadius: "5px",
										padding: "8px 5px",
										fontSize: "12px"
									}}
									title={frame.description}
								>
									{frame.name}
								</button>
							))}
						</div>
					)}

											{/* 移动端两行网格布局的框架选项 */}
					{isMobile && (
						<div className="mobile-frames-grid" style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gridAutoRows: "auto",
							gap: "2px",
						}}>
							{availableFrames.map((frame) => (
								<button
									key={frame.name}
									onClick={() => setSelectedFrame(frame.name)}
									style={{
										backgroundColor: selectedFrame === frame.name ? "#FF69B4" : "#f8f8f8",
										color: selectedFrame === frame.name ? "white" : "black",
										border: "1px solid #ddd",
										borderRadius: "5px",
										padding: "12px 0",
										fontSize: "12px",
										fontWeight: selectedFrame === frame.name ? "bold" : "normal"
									}}
									title={frame.description}
								>
									{frame.name}
								</button>
							))}
						</div>
					)}
					</>
				)}

				{/* 边框宽度设置选项卡 */}
				{customizeTab === 'border' && (
					<>

						{/* PC端边框宽度网格 */}
						{!isMobile && (
							<div className="border-options" style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "10px"
							}}>
								{borderWidthOptions.map((option) => (
									<button
										key={option.value}
										onClick={() => setBorderWidth(option.value)}
										style={{
											backgroundColor: "#f8f8f8",
											color: "#333",
											border: borderWidth === option.value ? "3px solid #FF69B4" : "1px solid #ddd",
											borderRadius: "5px",
											padding: "16px 0",
											fontSize: "14px",
											fontWeight: borderWidth === option.value ? "bold" : "500",
											position: "relative",
											overflow: "hidden"
										}}
									>
										{option.name}
										{option.value > 0 && (
											<div style={{
												position: "absolute",
												bottom: "0",
												left: "0",
												right: "0",
												height: `${Math.min(option.value, 10)}px`,
												backgroundColor: "white",
												borderTop: "1px solid #ddd"
											}} />
										)}
									</button>
								))}
							</div>
						)}

						{/* 移动端两行边框宽度网格 */}
						{isMobile && (
							<div className="mobile-border-grid" style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gridTemplateRows: "repeat(2, auto)",
								gap: "8px",
								padding: "5px 0"
							}}>
								{borderWidthOptions.map((option) => (
									<button
										key={option.value}
										onClick={() => setBorderWidth(option.value)}
										style={{
											backgroundColor: "#f8f8f8",
											color: "#333",
											border: borderWidth === option.value ? "3px solid #FF69B4" : "1px solid #ddd",
											borderRadius: "5px",
											padding: "12px 0",
											fontSize: "12px",
											fontWeight: borderWidth === option.value ? "bold" : "500",
											position: "relative",
											overflow: "hidden"
										}}
									>
										{option.name}
										{option.value > 0 && (
											<div style={{
												position: "absolute",
												bottom: "0",
												left: "0",
												right: "0",
												height: `${Math.min(option.value, 8)}px`,
												backgroundColor: "white",
												borderTop: "1px solid #ddd"
											}} />
										)}
									</button>
								))}
							</div>
						)}

						{/* 边框预览 */}
						<div style={{
							marginTop: "15px",
							padding: "15px",
							backgroundColor: "#f0f8ff",
							borderRadius: "5px",
							textAlign: "center"
						}}>
							<div style={{
								width: "120px",
								height: "90px",
								margin: "0 auto",
								backgroundColor: "#eee",
								padding: `${borderWidth}px`,
								boxSizing: "content-box",
								border: "1px dashed #aaa"
							}}>
								<div style={{
									width: "100%",
									height: "100%",
									backgroundColor: "#666",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontSize: "12px"
								}}>
									Preview
								</div>
							</div>
							<p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
								Current border width: {borderWidth}px
							</p>
						</div>
					</>
				)}
			</div>
		);
	};

	// 渲染管理照片抽屉内容
	const renderManageDrawer = () => {
		return (
			<div className="photo-management" style={{
				padding: "15px"
			}}>
				<div style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "10px"
				}}>
					<h3 style={{ margin: 0 }}>Manage Photos</h3>
					<button
						onClick={() => setActiveDrawer(null)}
						aria-label="Close"
						style={{
							background: "none",
							border: "none",
							fontSize: "24px",
							cursor: "pointer",
							padding: "0 10px"
						}}
					>
						×
					</button>
				</div>

				<div className="photo-grid" style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "8px",
					marginBottom: "10px"
				}}>
					{Array.from({ length: 4 }).map((_, index) => (
						<div
							key={index}
							className={`${getPhotoItemClassName(index)} ${localImages[index] === null ? 'empty' : ''}`}
							style={{
								position: "relative",
								border: "1px solid rgba(0,0,0,0.05)",
								overflow: "hidden",
								backgroundColor: localImages[index] ? "#fff" : "#f9f9f9",
								boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
								cursor: localImages[index] ? "move" : "pointer",
								minHeight: "60px",
								maxHeight: "80px",
								display: "flex",
								flexDirection: "column"
							}}
							onClick={() => localImages[index] === null && triggerFileUpload(index)}
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
									<div style={{
										position: "relative",
										paddingTop: "75%", // 4:3 aspect ratio
										flexGrow: 1,
									}}>
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
										<div style={{
											position: "absolute",
											top: "2px",
											right: "2px",
											backgroundColor: "#FF69B4",
											color: "white",
											borderRadius: "50%",
											width: "18px",
											height: "18px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: "10px",
											fontWeight: "bold",
											boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
										}}>
											{index + 1}
										</div>

										{/* 控制按钮浮层 */}
										<div style={{
											position: "absolute",
											left: 0,
											right: 0,
											bottom: 0,
											display: "flex",
											justifyContent: "space-between",
											padding: "2px",
											backgroundColor: "rgba(0,0,0,0.5)"
										}}>
											<button
												onClick={(e) => {
													e.stopPropagation();
													triggerFileUpload(index);
												}}
												style={{
													backgroundColor: "#FF69B4",
													color: "white",
													border: "none",
													borderRadius: "2px",
													padding: "2px 4px",
													fontSize: "9px",
													cursor: "pointer"
												}}
											>
												📤
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
													borderRadius: "2px",
													padding: "2px 4px",
													fontSize: "9px",
													cursor: "pointer"
												}}
											>
												🗑️
											</button>
										</div>
									</div>
								</>
							) : (
								<div style={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									padding: "5px"
								}}>
									<span style={{
										fontSize: "20px",
										color: "#666"
									}}>
										+
									</span>
									<div style={{
										color: "#666",
										fontSize: "10px",
										textAlign: "center"
									}}>
										Photo {index + 1}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				<div style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "10px"
				}}>
					<div style={{
						fontSize: "12px",
						color: "#666",
						backgroundColor: allSlotsFilled ? "#e8f5e9" : "#e9f7fe",
						padding: "5px 10px",
						borderRadius: "5px",
						border: allSlotsFilled ? "1px solid #c8e6c9" : "1px solid #bbdefb"
					}}>
						{allSlotsFilled
							? "✅ All photos added!"
							: `${uploadedCount}/4 photos added`}
					</div>

					<div style={{ display: "flex", gap: "5px" }}>
						<button
							onClick={() => triggerMultipleFilesUpload()}
							style={{
								backgroundColor: "#FF69B4",
								color: "white",
								border: "none",
								borderRadius: "4px",
								padding: "5px 10px",
								fontSize: "12px",
								cursor: "pointer",
								fontWeight: "bold",
								display: "flex",
								alignItems: "center",
								whiteSpace: "nowrap"
							}}
						>
							<span style={{ marginRight: "3px" }}>📤</span> Add Multiple
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<Meta
				title="Customize Your Photo Strip"
				description="Customize your Picapica photo strip with different colors, frames, and stickers. Download or share your photo strip with friends and family."
				canonicalUrl="/preview"
			/>

			<div className="photo-preview" style={{
				maxWidth: "1000px",
				margin: "0 auto",
				padding: "0 0 80px", // Added extra padding at bottom for mobile
			}}>
				{/* 主要内容区 - 响应式布局 */}
				<div className="main-content">
					{/* 左侧预览区 */}
					<div className="preview-panel">
						<div className="preview-container">
							<canvas ref={stripCanvasRef} className="photo-strip" />
						</div>

						<div className="action-buttons">
							<button
								onClick={downloadPhotoStrip}
								disabled={!allSlotsFilled}
								className={`action-button ${allSlotsFilled ? 'primary' : 'disabled'}`}
							>
								📥 Download
							</button>

							<button
								onClick={() => navigate("/photobooth")}
								className="action-button"
								style={{
									backgroundColor: "#555555",
									color: "white"
								}}
							>
								🔄 Take New
							</button>

							<button
								onClick={getShareableLink}
								disabled={isGeneratingLink || !allSlotsFilled}
								className={`action-button ${allSlotsFilled && !isGeneratingLink ? 'primary' : 'disabled'}`}
								style={{
									backgroundColor: allSlotsFilled && !isGeneratingLink ? "#FF69B4" : "#e0e0e0"
								}}
							>
								{isGeneratingLink ? "Generating..." : "🔗 Share"}
							</button>
						</div>

						{!allSlotsFilled && (
							<div style={{
								marginTop: "15px",
								padding: "15px",
								backgroundColor: "#FFF3CD",
								borderRadius: "5px",
								border: "1px solid #FFEEBA",
								color: "#856404",
								fontSize: "14px",
								textAlign: "center"
							}}>
								<strong>Notice:</strong> Please add photos to all 4 positions to enable download and sharing.
							</div>
						)}

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
									marginBottom: "10px",
									flexWrap: "wrap",
									gap: "10px"
								}}>
									<input
										type="text"
										value={shareLink}
										readOnly
										style={{
											flex: "1 1 250px",
											padding: "8px",
											borderRadius: "4px",
											border: "1px solid #ccc",
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
											whiteSpace: "nowrap"
										}}
									>
										{linkCopied ? "✓ Copied!" : "Copy Link"}
									</button>
								</div>

								<div style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "15px",
									justifyContent: "space-between",
									alignItems: "center"
								}}>
									{/* QR Code显示 */}
									{qrCodeUrl && (
										<div style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											gap: "5px"
										}}>
											<img
												src={qrCodeUrl}
												alt="QR Code for sharing"
												style={{
													width: "100px",
													height: "100px",
													border: "1px solid #eee",
													borderRadius: "5px"
												}}
											/>
											<span style={{ fontSize: "12px", color: "#666" }}>Scan to Share</span>
										</div>
									)}

									<a
										href={shareLink}
										style={{
											backgroundColor: "#FF69B4",
											color: "white",
											border: "none",
											padding: "8px 12px",
											borderRadius: "4px",
											cursor: "pointer",
											marginLeft: "auto",
											flex: "0 0 auto"
										}}
										target="_blank"
									>
										🔍 View Shared Page
									</a>
								</div>
							</div>
						)}

						{/* 预言结果显示区域 */}
						{prediction && (
							<div style={{
								marginTop: "20px",
								marginBottom: "20px",
								padding: "20px",
								backgroundColor: "#f8f5ff",
								borderRadius: "8px",
								border: "1px solid #e6d8ff",
								boxShadow: "0 2px 8px rgba(156, 39, 176, 0.1)"
							}}>
								<h3 style={{
									color: "#9C27B0",
									marginTop: 0,
									marginBottom: "15px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}>
									<span style={{ marginRight: "8px" }}>✨</span>
									Your Four Moments Interpretation
									<span style={{ marginLeft: "8px" }}>✨</span>
								</h3>

								<div style={{
									display: "flex",
									flexDirection: "column",
									gap: "15px"
								}}>
									<div style={{
										display: "grid",
										gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
										gap: "10px",
										margin: "10px 0"
									}}>
										{prediction.keywords.map((keyword, index) => (
											<div key={index} style={{
												backgroundColor: "#9C27B0",
												color: "white",
												padding: "10px",
												borderRadius: "5px",
												textAlign: "center",
												fontWeight: "bold"
											}}>
												{keyword}
											</div>
										))}
									</div>

									<div
										onClick={() => {
											if (navigator.clipboard) {
												navigator.clipboard.writeText(prediction.summary)
													.then(() => {
														alert("Summary copied to clipboard!");
													})
													.catch(err => {
														console.error('Failed to copy text: ', err);
													});
											}
										}}
										style={{
											backgroundColor: "white",
											padding: "15px",
											borderRadius: "5px",
											border: "1px solid #e6d8ff",
											fontStyle: "italic",
											color: "#333",
											cursor: "pointer",
											position: "relative"
										}}
										title="Click to copy"
									>
										<div style={{
											position: "absolute",
											top: "8px",
											right: "8px",
											fontSize: "12px",
											color: "#9C27B0",
											opacity: 0.7
										}}>
											📋 Click to copy
										</div>
										"{prediction.summary}"
									</div>

									<div style={{
										display: "flex",
										justifyContent: "center",
										marginTop: "10px"
									}}>
										<label style={{
											display: "flex",
											alignItems: "center",
											cursor: "pointer",
											userSelect: "none",
											padding: "8px 12px",
											backgroundColor: "#f0e6f7",
											borderRadius: "4px"
										}}>
											<input
												type="checkbox"
												checked={showPrediction}
												onChange={() => setShowPrediction(!showPrediction)}
												style={{ marginRight: "8px" }}
											/>
											Display interpretation on photos
										</label>
									</div>
								</div>
							</div>
						)}

						{/* 调查问卷区域 */}
						<div style={{
							marginTop: "30px",
							padding: "20px",
							backgroundColor: "#f0f8ff",
							borderRadius: "8px",
							border: "1px solid #d1e6ff",
							textAlign: "center"
						}}>
							<h3 style={{ marginTop: 0, color: "#0066cc" }}>Help Us Improve!</h3>
							<p style={{ marginBottom: "15px" }}>
								Need a specific photo booth frame design for your event? Share your ideas with us! We aim to add new frames based on your feedback.
							</p>
							<a
								href="https://tally.so/r/mB0Wl4"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									display: "inline-block",
									backgroundColor: "#0066cc",
									color: "white",
									padding: "10px 20px",
									borderRadius: "4px",
									textDecoration: "none",
									fontWeight: "bold",
									transition: "background-color 0.3s"
								}}
							>
								Request New Frame Design
							</a>
						</div>
					</div>

					{/* 控制面板区域 - 在小屏幕上折叠显示 */}
					{!isMobile && (
						<div className="control-panel">
							{/* 随机样式按钮 */}
							<button
								className="random-button"
								onClick={handleRandomStyle}
								style={{
									width: "100%",
									marginBottom: "15px"
								}}
							>
								<span className={`dice-icon ${isRandomizing ? 'spin-animation' : ''}`}>🎲</span>
								Random Style
							</button>

							{randomSuccess && (
								<div className="random-success">
									Style randomized successfully!
								</div>
							)}

							<div style={{
								display: "flex",
								marginBottom: "15px",
								borderBottom: "1px solid #ddd"
							}}>
								<div
									className={`section-tab ${activeDrawer === 'customize' ? 'active' : ''}`}
									onClick={() => setActiveDrawer('customize')}
									style={{
										cursor: "pointer",
										padding: "10px 15px",
										backgroundColor: activeDrawer === 'customize' ? "#FF69B4" : "#f0f0f0",
										color: activeDrawer === 'customize' ? "white" : "inherit",
										fontWeight: activeDrawer === 'customize' ? "bold" : "normal",
										borderRadius: "5px 5px 0 0",
										flex: 1,
										textAlign: "center"
									}}
								>
									Customize
								</div>
								<div
									className={`section-tab ${activeDrawer === 'manage' ? 'active' : ''}`}
									onClick={() => setActiveDrawer('manage')}
									style={{
										cursor: "pointer",
										padding: "10px 15px",
										backgroundColor: activeDrawer === 'manage' ? "#FF69B4" : "#f0f0f0",
										color: activeDrawer === 'manage' ? "white" : "inherit",
										fontWeight: activeDrawer === 'manage' ? "bold" : "normal",
										borderRadius: "5px 5px 0 0",
										flex: 1,
										textAlign: "center"
									}}
								>
									Manage Photos
								</div>
							</div>

							{/* PC 端渲染抽屉内容 */}
							<div style={{
								backgroundColor: "#f9f9f9",
								borderRadius: "0 0 5px 5px",
								marginBottom: "20px",
								overflow: "auto", // 添加滚动条，以防内容过多
								maxHeight: "80vh" // 限制最大高度，确保在小屏幕上可以滚动查看
							}}>
								{activeDrawer === 'customize' ? renderCustomizeDrawer() : null}
								{activeDrawer === 'manage' ? renderManageDrawer() : null}
							</div>
						</div>
					)}
				</div>

				{/* 文件上传隐藏输入 */}
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleUploadImage}
					accept="image/*"
					style={{ display: "none" }}
				/>

				{/* 多文件上传隐藏输入 */}
				<input
					type="file"
					ref={multipleFilesInputRef}
					onChange={handleUploadMultipleImages}
					accept="image/*"
					multiple
					style={{ display: "none" }}
				/>

				{/* 移动端底部导航 */}
				{isMobile && (
					<div className="bottom-nav">
						<button
							className={`bottom-nav-btn ${activeDrawer === 'customize' ? 'active' : ''}`}
							onClick={() => setActiveDrawer(activeDrawer === 'customize' ? null : 'customize')}
						>
							<div style={{ fontSize: "20px", marginBottom: "2px" }}>🎨</div>
							Customize
						</button>
						<button
							className={`bottom-nav-btn ${activeDrawer === 'manage' ? 'active' : ''}`}
							onClick={() => setActiveDrawer(activeDrawer === 'manage' ? null : 'manage')}
						>
							<div style={{ fontSize: "20px", marginBottom: "2px" }}>📷</div>
							Manage Photos
						</button>
						{/* 移动端随机样式按钮 */}
						<button
							className="bottom-nav-btn"
							onClick={handleRandomStyle}
						>
							<div style={{ fontSize: "20px", marginBottom: "2px" }}>🎲</div>
							Random
						</button>
					</div>
				)}

				{/* 移动端抽屉容器 */}
				{isMobile && (
					<div className={`drawer ${activeDrawer ? 'open' : ''}`}>
						<div className="drawer-handle"></div>
						{activeDrawer === 'customize' ? renderCustomizeDrawer() : null}
						{activeDrawer === 'manage' ? renderManageDrawer() : null}
					</div>
				)}

				{/* 遮罩层，用于点击关闭抽屉 */}
				{isMobile && activeDrawer && (
					<div
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,0,0,0.5)",
							zIndex: 998,
							opacity: 0.5,
						}}
						onClick={() => setActiveDrawer(null)}
					/>
				)}

				{/* 随机成功提示（移动端） */}
				{isMobile && randomSuccess && (
					<div className="random-success">
						Style randomized successfully!
					</div>
				)}
			</div>
		</>
	);
};

export default PhotoPreview;