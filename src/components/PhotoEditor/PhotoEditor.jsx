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

		const canvas = new fabric.Canvas(canvasRef.current, {
			width: window.innerWidth * 0.8,
			height: window.innerHeight - 250, // 减去顶部和底部空间
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
			const savedImage = localStorage.getItem("photoToEnhance");

			if (!savedImage) {
				setError("未找到需要美化的图片");
				setLoading(false);
				return;
			}

			// 初始化画布并添加图片
			if (!fabricCanvasRef.current) {
				initCanvas();
				// 等待画布初始化完成后再添加图片
				setTimeout(() => {
					if (fabricCanvasRef.current) {
						addPhotoToCanvas(savedImage);
					} else {
						setError("画布初始化失败");
						setLoading(false);
					}
				}, 0);
			}
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
	const addPhotoToCanvas = (photoSrc) => {
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
		const photos = JSON.parse(localStorage.getItem("photoToEnhance"));

		console.log("photos", photos.length);

		for (let i = 0; i < photos.length; i++) {
			// 继续添加照片到画布的逻辑...
			fabric.Image.fromURL(
				photos[i],
				(img) => {
					console.log("加载照片");
					// 设置图片属性
					const canvas = fabricCanvasRef.current;
					const canvasWidth = canvas.width;
					const canvasHeight = canvas.height;

					// 调整图片大小以适应画布
					const scale = Math.min(
						(canvasWidth * 0.7) / img.width,
						(canvasHeight * 0.7) / img.height
					);

					const yOffset =
						(canvasHeight -
							(photos.length * img.height * scale +
								(photos.length - 1) * photoSpacing)) /
							2 +
						i * (img.height * scale + photoSpacing);
					// 确保图片不超出画布边界

					img.set({
						scaleX: scale,
						scaleY: scale,
						left: (canvasWidth - img.width * scale) / 2,
						top: yOffset,
						hasControls: true,
						hasBorders: true,
						cornerColor: "#00a9ff",
						borderColor: "#00a9ff",
						cornerSize: 10,
						transparentCorners: false,
						isUserImage: true, // 自定义标记
						lockRotation: false, // 允许旋转
						selectable: true, // 确保可选择
						evented: true, // 确保可以接收事件
					});

					// 启用所有控制点
					// img.setControlsVisibility({
					// 	mt: true, // 上中
					// 	mb: true, // 下中
					// 	ml: true, // 左中
					// 	mr: true, // 右中
					// 	bl: true, // 左下
					// 	br: true, // 右下
					// 	tl: true, // 左上
					// 	tr: true, // 右上
					// 	mtr: true, // 旋转控制点
					// });

					// 将图片添加到画布
					canvas.add(img);
					canvas.setActiveObject(img);
					canvas.renderAll();

					if (i === photos.length - 1) {
						// 确保图层顺序正确
						// arrangeLayerOrder();
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
			});

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

		// 保存当前选中对象
		const activeObject = canvas.getActiveObject();
		canvas.discardActiveObject();

		// 先提取所有对象
		const templates = objects.filter((obj) => obj.isTemplate);
		const userImages = objects.filter((obj) => obj.isUserImage);
		const stickers = objects.filter((obj) => obj.isSticker);

		// 然后按顺序移动它们
		canvas.clear();

		// 模板放在最底层
		templates.forEach((obj) => canvas.add(obj));

		// 图片放在中间层
		userImages.forEach((obj) => canvas.add(obj));

		// 贴纸放在最上层
		stickers.forEach((obj) => canvas.add(obj));

		// 恢复选中状态
		if (activeObject && canvas.contains(activeObject)) {
			canvas.setActiveObject(activeObject);
		}

		canvas.renderAll();
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
				<button className="toolbar-button" onClick={handleSaveImage}>
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
		</div>
	);
};

export default PhotoEditor;
