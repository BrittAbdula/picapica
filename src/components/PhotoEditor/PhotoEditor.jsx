import React, { useState, useRef, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import "./PhotoEditor.css";

const PhotoEditor = () => {
	// 状态管理
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [activeTab, setActiveTab] = useState("template"); // 'template' 或 'sticker'
	const [isEditing, setIsEditing] = useState(true); // 默认处于编辑状态
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [loading, setLoading] = useState(true); // 默认为加载状态
	const [error, setError] = useState(null);
	const [textInput, setTextInput] = useState(""); // 添加文本输入状态
	const [showTextInputSheet, setShowTextInputSheet] = useState(false); // 控制文本输入弹窗显示

	// Fabric.js 画布引用
	const canvasRef = useRef(null);
	const fabricCanvasRef = useRef(null);

	// 模板列表示例
	const templates = [
		{ id: 1, name: "生日模板", src: "/images/templates/1.jpg" },
		{ id: 2, name: "旅行模板", src: "/images/templates/2.jpg" },
		{ id: 3, name: "节日模板", src: "/images/templates/3.jpg" },
		{ id: 4, name: "简约模板", src: "/images/templates/4.jpg" },
	];

	// 贴纸列表示例
	const stickers = [
		{ id: 1, name: "爱心", src: "/images/stickers/1.png" },
		{ id: 2, name: "星星", src: "/images/stickers/2.png" },
	];

	// 初始化 Fabric.js 画布
	const initCanvas = useCallback(() => {
		console.log("initCanvas", canvasRef.current);
		if (!canvasRef.current) return;

		const totalHeight = 20 * 2 + 225 * 4 + 20 * 3 + 30;

		const canvas = new fabric.Canvas(canvasRef.current, {
			width: 340,
			height: totalHeight, // 减去顶部和底部空间
			backgroundColor: localStorage.getItem("photoToEnhanceColor") || "#ffffff",
			preserveObjectStacking: true,
			selection: true, // 确保可以选择对象
			interactive: true, // 确保画布交互性启用
		});
		console.log("color", localStorage.getItem("photoToEnhanceColor"));

		console.log("canvas", canvas);

		fabricCanvasRef.current = canvas;

		// 添加选择事件
		canvas.on("selection:created", handleSelectionChange);
		canvas.on("selection:updated", handleSelectionChange);
		canvas.on("selection:cleared", handleSelectionCleared);

		// 添加窗口大小改变事件
		const resizeCanvas = () => {
			canvas.setWidth(window.innerWidth);
			canvas.setHeight(window.innerHeight - 120);
			canvas.renderAll();
		};

		window.addEventListener("resize", resizeCanvas);

		return () => {
			canvas.dispose();
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	// 初始化时从 localStorage 获取图片
	useEffect(() => {
		try {
			// 从 localStorage 获取图片
			// const savedImage = localStorage.getItem("photoToEnhance");

			const dbName = "picapicaDB";
			const storeName = "photoData";
			const request = indexedDB.open(dbName, 1);

			request.onsuccess = (event) => {
				const db = event.target.result;
				const transaction = db.transaction([storeName], "readonly");
				const store = transaction.objectStore(storeName);

				const getRequest = store.get("photoToEnhance");

				getRequest.onsuccess = () => {
					if (getRequest.result) {
						const { photos } = getRequest.result;
						// 使用获取到的照片数据
						// 初始化画布并添加图片
						if (!fabricCanvasRef.current) {
							initCanvas();
							// 等待画布初始化完成后再添加图片
							setTimeout(() => {
								if (fabricCanvasRef.current) {
									addPhotoToCanvas(photos);
								} else {
									setError("画布初始化失败");
									setLoading(false);
								}
							}, 0);
						}
					}
				};

				getRequest.onerror = (error) => {
					console.error("Error getting photo data from IndexedDB:", error);
				};
			};

			request.onerror = (event) => {
				console.error("Error opening IndexedDB:", event.target.error);
			};
		} catch (error) {
			console.error("从localStorage加载图片失败:", error);
			setError("加载图片失败，请重试");
			setLoading(false);
		}
	}, []); // 空依赖数组，只在组件挂载时执行一次

	// 防止弹窗显示时背景滚动
	useEffect(() => {
		if (showBottomSheet) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [showBottomSheet]);

	// 打开底部弹窗并设置活动标签
	const openBottomSheet = (tab) => {
		setActiveTab(tab);
		setShowBottomSheet(true);
	};

	// 处理选中对象
	const handleSelectionChange = (e) => {
		const selectedObject = fabricCanvasRef.current.getActiveObject();
		// 根据选中对象类型可以执行不同操作
	};

	// 处理清除选择
	const handleSelectionCleared = () => {
		// 清除选择时的操作
	};

	// 修改 addPhotoToCanvas 函数，避免重复初始化画布
	const addPhotoToCanvas = (photos) => {
		// 确保 canvas 已初始化
		if (!fabricCanvasRef.current) {
			console.error("画布未初始化");
			setError("画布初始化失败");
			setLoading(false);
			return;
		}

		console.log("canvas已经初始化");

		// 清除画布上现有的用户图片，防止重复添加
		const existingUserImages = fabricCanvasRef.current
			.getObjects()
			.filter((obj) => obj.isUserImage);
		existingUserImages.forEach((obj) => fabricCanvasRef.current.remove(obj));

		const photoSpacing = 10;

		console.log("photos", photos.length);

		// 目标矩形尺寸
		const targetWidth = 300;
		const targetHeight = 225;

		for (let i = 0; i < photos.length; i++) {
			// 继续添加照片到画布的逻辑...
			fabric.Image.fromURL(
				photos[i],
				(img) => {
					console.log("加载照片");
					// 设置图片属性
					const canvas = fabricCanvasRef.current;

					const originalWidth = img.width; // 1920
					const originalHeight = img.height; // 1080

					// 计算目标宽高比
					const targetAspectRatio = targetWidth / targetHeight; // 4:3
					const originalAspectRatio = originalWidth / originalHeight; // 16:9

					let cropWidth, cropHeight;

					if (originalAspectRatio > targetAspectRatio) {
						// 如果原始图片更宽，按高度裁剪
						cropHeight = originalHeight;
						cropWidth = cropHeight * targetAspectRatio; // 按目标宽高比计算裁剪宽度
					} else {
						// 如果原始图片更高，按宽度裁剪
						cropWidth = originalWidth;
						cropHeight = cropWidth / targetAspectRatio; // 按目标宽高比计算裁剪高度
					}

					// 计算裁剪起始点（居中裁剪）
					const cropX = (originalWidth - cropWidth) / 2;
					const cropY = (originalHeight - cropHeight) / 2;

					// 设置裁剪区域
					img.set({
						width: cropWidth, // 裁剪后的宽度
						height: cropHeight, // 裁剪后的高度
						cropX: cropX, // 裁剪起始 X 坐标
						cropY: cropY, // 裁剪起始 Y 坐标
						left: 20,
						top: 20 + i * (targetHeight + photoSpacing), // 每个图片之间有一定的间距
						selectable: false,
						isUserImage: true,
					});

					// 缩放图片到目标尺寸
					const scaleX = targetWidth / cropWidth;
					const scaleY = targetHeight / cropHeight;
					img.scaleX = scaleX;
					img.scaleY = scaleY;
					// 将图片添加到画布
					canvas.add(img);
					canvas.renderAll();

					if (i === photos.length - 1) {
						// 确保图层顺序正确
						arrangeLayerOrder();
						// 图片加载完成
						setLoading(false);
					}
				},
				(err) => {
					// 图片加载失败
					console.error("加载图片失败:", err);
					setError("加载图片失败，请重试");
					setLoading(false);
				}
			);
		}
	};

	// 添加模板到画布
	const handleSelectTemplate = (template) => {
		if (!fabricCanvasRef.current) return;

		setSelectedTemplate(template);
		setShowBottomSheet(false); // 选择后关闭底部弹窗

		// 移除现有模板
		const existingTemplates = fabricCanvasRef.current
			.getObjects()
			.filter((obj) => obj.isTemplate);
		existingTemplates.forEach((obj) => fabricCanvasRef.current.remove(obj));

		// 添加新模板
		fabric.Image.fromURL(template.src, (img) => {
			const canvas = fabricCanvasRef.current;

			img.set({
				width: canvas.width,
				height: canvas.height,
				selectable: false,
				evented: false,
				isTemplate: true, // 自定义标记
				// 模板应该在最底层
			});

			// 添加模板到画布
			canvas.add(img);
			// 确保模板在最底层
			img.moveTo(0);
			canvas.renderAll();

			// 确保图层顺序
			arrangeLayerOrder();
		});
	};

	// 添加贴纸到画布
	const handleAddSticker = (sticker) => {
		if (!fabricCanvasRef.current) return;

		setShowBottomSheet(false); // 选择后关闭底部弹窗

		fabric.Image.fromURL(sticker.src, (img) => {
			const canvas = fabricCanvasRef.current;
			const canvasWidth = canvas.width;
			const canvasHeight = canvas.height;

			// 设置贴纸大小为画布宽度的1/4
			const scale = canvasWidth / 4 / img.width;

			img.set({
				scaleX: scale,
				scaleY: scale,
				left: canvasWidth / 2,
				top: canvasHeight / 2,
				originX: "center",
				originY: "center",
				hasControls: true,
				hasBorders: true,
				cornerColor: "#ff4a8d",
				borderColor: "#ff4a8d",
				cornerSize: 10,
				transparentCorners: false,
				isSticker: true, // 自定义标记
				lockRotation: false, // 允许旋转
				centeredRotation: true, // 启用居中旋转
			});

			// 确保所有控制点都可见，包括旋转控制
			img.setControlsVisibility({
				mtr: true, // 保留旋转控制点
				mt: false, // 禁用上中控制点
				mb: false, // 禁用下中控制点
				ml: false, // 禁用左中控制点
				mr: false, // 禁用右中控制点
				bl: false, // 禁用左下控制点
				br: false, // 禁用右下控制点
				tl: false, // 禁用左上控制点
				tr: false, // 禁用右上控制点
			});

			// 设置对象属性，锁定缩放比例
			img.lockScalingX = true;
			img.lockScalingY = true;
			img.lockSkewingX = true;
			img.lockSkewingY = true;
			img.lockUniScaling = true;

			// 添加贴纸到画布
			canvas.add(img);
			canvas.setActiveObject(img);
			canvas.renderAll();

			// 确保图层顺序
			arrangeLayerOrder();
		});
	};

	// 删除选中对象
	const handleDeleteSelected = () => {
		if (!fabricCanvasRef.current) return;

		const activeObject = fabricCanvasRef.current.getActiveObject();
		if (activeObject) {
			// 不能删除模板
			if (activeObject.isTemplate) return;

			fabricCanvasRef.current.remove(activeObject);
			fabricCanvasRef.current.renderAll();
		}
	};

	// 保存编辑结果
	const handleSaveImage = () => {
		if (!fabricCanvasRef.current) return;

		// 暂时取消当前选择
		fabricCanvasRef.current.discardActiveObject();
		fabricCanvasRef.current.renderAll();

		// 生成图片
		const dataURL = fabricCanvasRef.current.toDataURL({
			format: "png",
			quality: 1.0,
		});

		// 创建下载链接
		const link = document.createElement("a");
		link.href = dataURL;
		link.download = `edited_image_${new Date().getTime()}.png`;
		link.click();
	};

	// 调整图层顺序
	const arrangeLayerOrder = () => {
		if (!fabricCanvasRef.current) return;

		const canvas = fabricCanvasRef.current;
		const objects = canvas.getObjects();

		// 先提取所有对象
		const templates = objects.filter((obj) => obj.isTemplate);
		const userImages = objects.filter((obj) => obj.isUserImage);
		const stickers = objects.filter((obj) => obj.isSticker);
		const texts = objects.filter((obj) => obj.isText);

		// 获取背景颜色
		const backgroundColor = localStorage.getItem("photoToEnhanceColor") || "#ffffff";
		
		// 清空画布并设置背景颜色
		canvas.clear();
		canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));

		// 然后按顺序添加对象
		// 模板放在最底层
		templates.forEach((obj) => canvas.add(obj));

		// 图片放在中间层
		userImages.forEach((obj) => canvas.add(obj));

		// 贴纸放在最上层
		stickers.forEach((obj) => canvas.add(obj));
		
		// 文本放在最顶层
		texts.forEach((obj) => canvas.add(obj));

		canvas.renderAll();
	};

	// 添加文本到画布
	const handleAddTextToCanvas = () => {
		if (!fabricCanvasRef.current || !textInput.trim()) return;

		const canvas = fabricCanvasRef.current;
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;

		const text = new fabric.Text(textInput, {
			left: canvasWidth / 2,
			top: canvasHeight / 2,
			originX: "center",
			originY: "center",
			fontFamily: "Arial",
			fontSize: 30,
			fill: "#000000",
			hasControls: true,
			hasBorders: true,
			cornerColor: "#4285f4",
			borderColor: "#4285f4",
			cornerSize: 10,
			transparentCorners: false,
			isText: true, // 自定义标记
			selectable: true,
			evented: true,
		});

		canvas.add(text);
		canvas.setActiveObject(text);
		canvas.renderAll();

		// 清空输入框并隐藏弹窗
		setTextInput("");
		setShowTextInputSheet(false);
	};

	// 切换文本输入弹窗显示
	const toggleTextInputSheet = () => {
		setShowTextInputSheet(!showTextInputSheet);
	};

	return (
		<div className="photo-editor">
			{/* 主内容区域 */}
			<div className="editor-content">
				{/* 编辑界面 */}
				<div className="canvas-container">
					{loading && <div className="loading">加载中...</div>}

					{error && (
						<div className="error-message">
							<p>{error}</p>
						</div>
					)}

					<canvas ref={canvasRef}></canvas>

					{/* 编辑操作浮动按钮 */}
					<div className="floating-controls">
						<button className="action-button delete" onClick={handleDeleteSelected}>
							<i className="icon-delete">🗑️</i>
						</button>

						{/* 悬浮的文字按钮 */}
						<button className="floating-text-button" onClick={toggleTextInputSheet}>
							<i className="icon-text">T</i>
						</button>
					</div>
				</div>
			</div>

			{/* 编辑工具底部菜单 */}
			<div className="editor-toolbar">
				<button className="toolbar-button" onClick={() => openBottomSheet("template")}>
					<i className="toolbar-icon">🖼️</i>
					<span>Templates</span>
				</button>
				<button className="toolbar-button" onClick={() => openBottomSheet("sticker")}>
					<i className="toolbar-icon">🌟</i>
					<span>Stickers</span>
				</button>
				<button className="toolbar-button save-button" onClick={handleSaveImage}>
					<i className="toolbar-icon">💾</i>
					<span>Save</span>
				</button>
			</div>

			{/* 合并的模板和贴纸底部弹窗 */}
			{showBottomSheet && (
				<div className="bottom-sheet">
					<div
						className="bottom-sheet-backdrop"
						onClick={() => setShowBottomSheet(false)}
					></div>
					<div className="bottom-sheet-container">
						<div className="bottom-sheet-header">
							<div className="bottom-sheet-handle"></div>
							<div className="sheet-tabs">
								<button
									className={`sheet-tab-button ${
										activeTab === "template" ? "active" : ""
									}`}
									onClick={() => setActiveTab("template")}
								>
									Templates
								</button>
								<button
									className={`sheet-tab-button ${
										activeTab === "sticker" ? "active" : ""
									}`}
									onClick={() => setActiveTab("sticker")}
								>
									Stickers
								</button>
							</div>
							<button
								className="bottom-sheet-close"
								onClick={() => setShowBottomSheet(false)}
							>
								×
							</button>
						</div>
						<div className="bottom-sheet-content">
							{activeTab === "template" ? (
								<div className="template-grid">
									{templates.map((template) => (
										<div
											key={template.id}
											className="template-item"
											onClick={() => handleSelectTemplate(template)}
										>
											<img src={template.src} alt={template.name} />
											<span>{template.name}</span>
										</div>
									))}
								</div>
							) : (
								<div className="sticker-grid">
									{stickers.map((sticker) => (
										<div
											key={sticker.id}
											className="sticker-item"
											onClick={() => handleAddSticker(sticker)}
										>
											<img src={sticker.src} alt={sticker.name} />
											<span>{sticker.name}</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* 文本输入底部弹窗 */}
			{showTextInputSheet && (
				<div className="bottom-sheet">
					<div className="bottom-sheet-backdrop" onClick={toggleTextInputSheet}></div>
					<div className="bottom-sheet-container">
						<div className="bottom-sheet-header">
							<div className="bottom-sheet-handle"></div>
							<h3>Add Text</h3>
							<button className="bottom-sheet-close" onClick={toggleTextInputSheet}>
								×
							</button>
						</div>
						<div className="bottom-sheet-content">
							<input
								type="text"
								value={textInput}
								onChange={(e) => setTextInput(e.target.value)}
								placeholder="Enter your text..."
								className="text-input"
								autoFocus
							/>
							<div className="text-input-buttons">
								<button onClick={toggleTextInputSheet} className="cancel-button">
									Cancel
								</button>
								<button onClick={handleAddTextToCanvas} className="add-text-button">
									Add
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PhotoEditor;
