import React, { useState, useRef, useEffect } from "react";
import * as fabric from "fabric";
import "./PhotoEditor.css";

const PhotoEditor = () => {
	// 状态管理
	const [canvas, setCanvas] = useState(null);
	const [uploadedImage, setUploadedImage] = useState(null);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [stickers, setStickers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// 引用
	const canvasRef = useRef(null);
	const fileInputRef = useRef(null);

	// 模板列表
	const templates = [
		{ id: 1, name: "简约白边", url: "/templates/1.jpg" },
		{ id: 2, name: "复古相框", url: "/templates/2.jpg" },
		{ id: 3, name: "粉色气泡", url: "/templates/3.jpg" },
		{ id: 4, name: "节日主题", url: "/templates/4.jpg" },
	];

	// 贴纸列表
	const stickerList = [
		{ id: 1, name: "爱心", url: "/stickers/1.png" },
		{ id: 2, name: "星星", url: "/stickers/2.png" },
	];

	// 初始化画布
	useEffect(() => {
		const initCanvas = () => {
			const canvasElement = canvasRef.current;
			const fabricCanvas = new fabric.Canvas(canvasElement, {
				width: 600,
				height: 600,
				backgroundColor: "#f8f8f8",
			});

			// 启用对象选择和移动
			fabricCanvas.selection = true;

			setCanvas(fabricCanvas);

			// 添加事件监听器，以便保存对象移动的位置
			fabricCanvas.on("object:modified", updateObjectPositions);

			return () => {
				fabricCanvas.dispose();
			};
		};

		initCanvas();
	}, []);

	// 更新对象位置的函数
	const updateObjectPositions = () => {
		if (!canvas) return;

		console.log("对象位置已更新");
		// 这里可以保存当前所有对象的位置信息
		const objects = canvas.getObjects();
		console.log(
			"当前画布对象:",
			objects.map((obj) => ({
				type: obj.type,
				left: obj.left,
				top: obj.top,
				scaleX: obj.scaleX,
				scaleY: obj.scaleY,
				angle: obj.angle,
			}))
		);
	};

	// 处理图片上传
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// 校验文件类型
		const validTypes = ["image/jpeg", "image/png", "image/gif"];
		if (!validTypes.includes(file.type)) {
			setError("请上传 JPG、PNG 或 GIF 格式的图片");
			return;
		}

		setLoading(true);
		setError(null);

		const reader = new FileReader();
		reader.onload = (e) => {
			const imgObj = new Image();
			imgObj.src = e.target.result;

			imgObj.onload = () => {
				// 创建 fabric 图像对象
				const fabricImage = new fabric.Image(imgObj, {
					left: 0,
					top: 0,
					selectable: true,
					hasControls: true,
					hasBorders: true,
				});

				// 调整图像大小以适应画布
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;
				const imgRatio = imgObj.width / imgObj.height;
				const canvasRatio = canvasWidth / canvasHeight;

				if (imgRatio > canvasRatio) {
					fabricImage.scaleToWidth(canvasWidth * 0.8);
				} else {
					fabricImage.scaleToHeight(canvasHeight * 0.8);
				}

				// 居中图片
				fabricImage.set({
					left: (canvasWidth - fabricImage.getScaledWidth()) / 2,
					top: (canvasHeight - fabricImage.getScaledHeight()) / 2,
				});

				// 如果已经有图像，先移除
				const existingImages = canvas
					.getObjects()
					.filter((obj) => obj.type === "image" && !obj.isTemplate && !obj.isSticker);
				existingImages.forEach((img) => canvas.remove(img));

				// 添加新图像
				canvas.add(fabricImage);

				// 如果有选择的模板，确保模板在最底层
				if (selectedTemplate) {
					canvas.sendToBack(fabricImage);
					const templateObj = canvas.getObjects().find((obj) => obj.isTemplate);
					if (templateObj) {
						canvas.sendToBack(templateObj);
					}
				}

				canvas.renderAll();
				setUploadedImage(fabricImage);
				setLoading(false);
			};
		};

		reader.onerror = () => {
			setError("读取图片失败，请重试");
			setLoading(false);
		};

		reader.readAsDataURL(file);
	};

	// 选择模板
	const selectTemplate = (template) => {
		if (!canvas) return;

		setLoading(true);
		setSelectedTemplate(template);

		// 移除现有模板
		const existingTemplate = canvas.getObjects().find((obj) => obj.isTemplate);
		if (existingTemplate) {
			canvas.remove(existingTemplate);
		}

		// 加载新模板
		fabric.Image.fromURL(
			template.url,
			(templateObj) => {
				templateObj.set({
					left: 0,
					top: 0,
					selectable: false, // 模板不可选择
					evented: false, // 模板不接收事件
					isTemplate: true, // 自定义标记
					width: canvas.width,
					height: canvas.height,
				});

				// 将模板添加到画布并放到最底层
				canvas.add(templateObj);
				canvas.sendToBack(templateObj);
				canvas.renderAll();
				setLoading(false);
			},
			{ crossOrigin: "anonymous" }
		);
	};

	// 添加贴纸
	const addSticker = (sticker) => {
		if (!canvas) return;

		setLoading(true);

		fabric.Image.fromURL(
			sticker.url,
			(stickerObj) => {
				// 设置贴纸属性
				stickerObj.set({
					left: canvas.width / 2,
					top: canvas.height / 2,
					selectable: true,
					hasControls: true,
					hasBorders: true,
					isSticker: true, // 自定义标记
					name: sticker.name,
				});

				// 缩放贴纸到合适大小
				stickerObj.scaleToWidth(150);

				// 添加贴纸到画布
				canvas.add(stickerObj);
				canvas.setActiveObject(stickerObj);
				canvas.renderAll();

				// 更新贴纸列表
				setStickers([...stickers, stickerObj]);
				setLoading(false);
			},
			{ crossOrigin: "anonymous" }
		);
	};

	// 移除选中的对象
	const removeSelected = () => {
		if (!canvas) return;

		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			canvas.remove(activeObject);

			// 如果删除的是贴纸，更新贴纸列表
			if (activeObject.isSticker) {
				setStickers(stickers.filter((s) => s !== activeObject));
			}

			canvas.renderAll();
		}
	};

	// 合成并保存图片
	const saveComposition = () => {
		if (!canvas) return;

		// 如果没有上传图片，提示错误
		if (!uploadedImage) {
			setError("请先上传一张照片");
			return;
		}

		setLoading(true);

		try {
			// 临时禁用选择边框，以便导出干净的图像
			canvas.discardActiveObject();
			canvas.renderAll();

			// 导出画布为图片
			const dataURL = canvas.toDataURL({
				format: "png",
				quality: 1.0,
			});

			// 创建下载链接
			const link = document.createElement("a");
			link.href = dataURL;
			link.download = `picapica_${new Date().getTime()}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			setLoading(false);
		} catch (err) {
			setError("保存图片失败: " + err.message);
			setLoading(false);
		}
	};

	// 触发文件选择器
	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	useEffect(() => {
		// 检查是否有从拍照页面传来的照片
		const editPhoto = localStorage.getItem("editPhoto");

		if (editPhoto && canvas) {
			const imgObj = new Image();
			imgObj.src = editPhoto;

			imgObj.onload = () => {
				fabric.Image.fromURL(editPhoto, (img) => {
					// 设置图片属性并添加到画布
					// ... 设置代码与 handleImageUpload 函数中类似

					canvas.add(img);
					canvas.renderAll();
					setUploadedImage(img);

					// 清除 localStorage
					localStorage.removeItem("editPhoto");
				});
			};
		}
	}, [canvas]);

	return (
		<div className="photo-editor-container">
			<h1 className="editor-title">照片编辑器</h1>

			{/* 主编辑区域 */}
			<div className="editor-main">
				{/* 左侧工具栏 */}
				<div className="editor-sidebar">
					<div className="sidebar-section">
						<h3>照片</h3>
						<button className="upload-btn" onClick={triggerFileInput}>
							上传照片
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							style={{ display: "none" }}
						/>
					</div>

					<div className="sidebar-section">
						<h3>模板</h3>
						<div className="template-list">
							{templates.map((template) => (
								<div
									key={template.id}
									className={`template-item ${
										selectedTemplate?.id === template.id ? "selected" : ""
									}`}
									onClick={() => selectTemplate(template)}
								>
									<img src={template.url} alt={template.name} />
									<span>{template.name}</span>
								</div>
							))}
						</div>
					</div>

					<div className="sidebar-section">
						<h3>贴纸</h3>
						<div className="sticker-list">
							{stickerList.map((sticker) => (
								<div
									key={sticker.id}
									className="sticker-item"
									onClick={() => addSticker(sticker)}
								>
									<img src={sticker.url} alt={sticker.name} />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* 中央画布区域 */}
				<div className="canvas-container">
					<canvas ref={canvasRef} id="photo-canvas"></canvas>

					{loading && (
						<div className="loading-overlay">
							<div className="spinner"></div>
							<p>处理中...</p>
						</div>
					)}

					{error && (
						<div className="error-message">
							<p>{error}</p>
							<button onClick={() => setError(null)}>关闭</button>
						</div>
					)}
				</div>

				{/* 右侧控制区域 */}
				<div className="editor-controls">
					<button
						className="control-btn remove-btn"
						onClick={removeSelected}
						disabled={!canvas || !canvas.getActiveObject()}
					>
						移除选中项
					</button>

					<button
						className="control-btn save-btn"
						onClick={saveComposition}
						disabled={!uploadedImage}
					>
						保存图片
					</button>

					<div className="help-text">
						<h3>操作提示:</h3>
						<ul>
							<li>点击并拖动可移动照片和贴纸</li>
							<li>用鼠标滚轮可以缩放选中的对象</li>
							<li>点击角落的控制点可以旋转或调整大小</li>
							<li>点击"移除选中项"删除当前选中的贴纸</li>
							<li>完成编辑后点击"保存图片"下载</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PhotoEditor;
