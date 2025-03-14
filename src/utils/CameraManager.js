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
  
  activeStreams.forEach(stream => {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
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
const getCamera = async (constraints = {
  video: {
    facingMode: "user",
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 },
  }
}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    registerStream(stream);
    return stream;
  } catch (error) {
    if (error.name === "NotAllowedError") {
      console.error("user denied camera access");
    } else {
      console.error("error accessing camera:", error);
    }
    throw error;
  }
};

/**
 * 停止特定的摄像头流
 * @param {MediaStream} stream - 要停止的摄像头流
 */
const stopCamera = (stream) => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => {
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
  unregisterStream
}; 