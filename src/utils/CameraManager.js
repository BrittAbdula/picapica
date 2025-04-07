/**
 * 全局摄像头管理工具
 * 提供统一的方法来控制摄像头资源
 */

// 存储当前活跃的摄像头流
let activeStreams = [];

/**
 * 停止所有活跃的摄像头流
 */
const stopAllCameras = () => {
	// console.log('Stopping all camera streams:', activeStreams.length);
	activeStreams.forEach((stream) => {
		const tracks = stream.getTracks();
		tracks.forEach((track) => {
			console.log('track', track);
			track.stop();
		});
	});

	activeStreams = [];
	// console.log('All camera streams stopped');
};

/**
 * 注册一个摄像头流以便后续管理
 * @param {MediaStream} stream - 要注册的摄像头流
 */
const registerStream = (stream) => {
	if (stream && !activeStreams.includes(stream)) {
		activeStreams.push(stream);
		// console.log('Camera stream registered, total active streams:', activeStreams.length);
	}
};

/**
 * 注销一个摄像头流
 * @param {MediaStream} stream - 要注销的摄像头流
 */
const unregisterStream = (stream) => {
	if (stream) {
		const index = activeStreams.indexOf(stream);
		if (index !== -1) {
			activeStreams.splice(index, 1);
			// console.log('Camera stream unregistered, remaining active streams:', activeStreams.length);
		}
	}
};

/**
 * 获取摄像头访问权限并返回媒体流
 * @param {Object} constraints - 摄像头约束条件
 * @returns {Promise<MediaStream>} 摄像头媒体流
 */
const getCamera = async (constraints) => {
	try {

		// 默认约束条件
		const defaultConstraints = {
			video: {
				width: { ideal: 640 },
				height: { ideal: 480 },
				facingMode: "user",
			},
			audio: false,
		};

		// 合并用户提供的约束条件
		const finalConstraints = constraints || defaultConstraints;

		// iOS Safari 特殊处理
		if (isIOS()) {
			// 移除可能导致问题的特定约束
			if (finalConstraints.video && typeof finalConstraints.video === "object") {
				// 移除 frameRate 约束，在某些 iOS 版本上可能导致问题
				delete finalConstraints.video.frameRate;

				// 确保 width 和 height 使用 ideal 值而非 exact
				if (finalConstraints.video.width && finalConstraints.video.width.exact) {
					finalConstraints.video.width.ideal = finalConstraints.video.width.exact;
					delete finalConstraints.video.width.exact;
				}

				if (finalConstraints.video.height && finalConstraints.video.height.exact) {
					finalConstraints.video.height.ideal = finalConstraints.video.height.exact;
					delete finalConstraints.video.height.exact;
				}
			}
		}


		// 记录支持的设备
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter((device) => device.kind === "videoinput");
			} catch (enumError) {
				console.warn("枚举设备失败:", enumError);
			}
		}

		// 尝试获取媒体流
		const stream = await navigator.mediaDevices.getUserMedia(finalConstraints);

		// 记录流的 tracks 信息
		const videoTracks = stream.getVideoTracks();
		if (videoTracks.length > 0) {
			console.log("视频轨道信息:", {
				label: videoTracks[0].label,
				settings: videoTracks[0].getSettings(),
				constraints: videoTracks[0].getConstraints(),
			});
		}

		return stream;
	} catch (error) {
		console.error("获取摄像头失败:", {
			name: error.name,
			message: error.message,
			stack: error.stack,
			constraints: JSON.stringify(constraints),
		});

		// 处理特定错误类型
		if (error.name === "NotAllowedError") {
			throw new Error("用户拒绝了摄像头访问权限。请在浏览器设置中允许访问摄像头。");
		} else if (error.name === "NotFoundError") {
			throw new Error("未找到摄像头设备。请确保您的设备有摄像头并且工作正常。");
		} else if (error.name === "NotReadableError") {
			throw new Error(
				"无法访问摄像头。可能已被其他应用程序占用，请关闭其他可能使用摄像头的应用后重试。"
			);
		} else if (error.name === "OverconstrainedError") {
			// 如果约束条件过严，尝试使用更简单的约束
			console.log("约束条件过严，尝试使用基本约束...");
			return this.getCamera({ video: true, audio: false });
		} else {
			throw error;
		}
	}
};

// 检测是否为 iOS 设备的辅助方法
const isIOS = () => {
	return (
		(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	);
};

/**
 * 停止特定的摄像头流
 * @param {MediaStream} stream - 要停止的摄像头流
 */
const stopCamera = (stream) => {
	if (stream) {
		const tracks = stream.getTracks();
		tracks.forEach((track) => {
			track.stop();
		});
		unregisterStream(stream);
		// console.log('Camera stream stopped');
	}
};

export default {
	getCamera,
	stopCamera,
	stopAllCameras,
	registerStream,
	unregisterStream,
};
