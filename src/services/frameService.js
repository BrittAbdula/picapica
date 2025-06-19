import { getAuthHeaders } from '../utils/auth';

const API_BASE_URL = 'https://api.picapica.app/api';

// 全局缓存
const frameCache = new Map();
const loadingPromises = new Map();
const frameDataCache = new Map(); // 缓存原始 frame 数据

// Frame响应接口
export class FrameService {
  /**
   * 获取所有活跃的frames
   */
  static async getAllFrames() {
    try {
      // 检查是否有缓存的 frames 列表
      if (frameDataCache.has('all_frames')) {
        return frameDataCache.get('all_frames');
      }

      const response = await fetch(`${API_BASE_URL}/frames`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch frames');
      }

      const frames = await response.json();
      
      // 缓存 frames 列表（5分钟过期）
      frameDataCache.set('all_frames', frames);
      setTimeout(() => {
        frameDataCache.delete('all_frames');
      }, 5 * 60 * 1000);

      return frames;
    } catch (error) {
      console.error('Error fetching frames:', error);
      throw error;
    }
  }

  /**
   * 根据名称获取frame的完整信息(包含代码) - 带缓存
   */
  static async getFrameByName(name) {
    try {
      // 检查缓存
      const cacheKey = `frame_${name}`;
      if (frameDataCache.has(cacheKey)) {
        return frameDataCache.get(cacheKey);
      }

      // 检查是否正在加载
      if (loadingPromises.has(cacheKey)) {
        return await loadingPromises.get(cacheKey);
      }

      // 创建加载 Promise
      const loadingPromise = this._fetchFrameByName(name);
      loadingPromises.set(cacheKey, loadingPromise);

      try {
        const frameData = await loadingPromise;
        
        // 缓存结果（10分钟过期）
        if (frameData) {
          frameDataCache.set(cacheKey, frameData);
          setTimeout(() => {
            frameDataCache.delete(cacheKey);
          }, 10 * 60 * 1000);
        }
        
        return frameData;
      } finally {
        loadingPromises.delete(cacheKey);
      }
    } catch (error) {
      console.error(`Error fetching frame ${name}:`, error);
      throw error;
    }
  }

  static async _fetchFrameByName(name) {
    const response = await fetch(`${API_BASE_URL}/frames/name/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch frame');
    }

    return await response.json();
  }

  /**
   * 根据ID获取frame的完整信息(包含代码)
   */
  static async getFrameWithCode(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/frames/${encodeURIComponent(id)}?code=true`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch frame with code');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching frame with code ${id}:`, error);
      throw error;
    }
  }

  /**
   * 创建frame的draw函数（用于PhotoPreview和photo strip合成）
   */
  static createFrameDrawFunction(frameCode) {
    try {
        let code = frameCode.trim();
        let functionBody;
        
        // 步骤 1: 智能解析，提取函数体
        
        // 检查是否是箭头函数格式 (包括带或不带 async)
        if (code.includes('=>')) {
            const bodyStartIndex = code.indexOf('{');
            const bodyEndIndex = code.lastIndexOf('}');
            
            if (bodyStartIndex === -1 || bodyEndIndex === -1 || bodyEndIndex < bodyStartIndex) {
                throw new Error("Invalid arrow function format: could not find function body.");
            }
            
            functionBody = code.substring(bodyStartIndex + 1, bodyEndIndex);

        } else if (code.startsWith('{') && code.endsWith('}')) {
            // 假设 AI 只返回了函数体 (情况 C)
            functionBody = code.substring(1, code.length - 1);

        } else {
            // 如果都不是，可能是一个未知的格式，或者是一个无效的代码片段
            // 我们可以把它当作函数体来尝试，或者直接抛出错误
            // 为了最大的兼容性，我们尝试把它当作函数体
            console.warn("FrameService: Unknown code format, attempting to treat as function body.");
            functionBody = code;
        }

        // 步骤 2: 使用标准、安全的方式构造异步函数
        
        // 获取 AsyncFunction 的构造函数
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

        // 明确指定参数名和我们提取出的函数体
        const drawFunction = new AsyncFunction('ctx', 'x', 'y', 'width', 'height', functionBody);
        
        return drawFunction;

    } catch (error) {
        console.error('FrameService: Error creating frame draw function:', error);
        console.error('Frame code:', frameCode);
        return async () => { /* no-op fallback */ };
    }
}

  /**
   * 将frames转换为与原Frames.js兼容的格式
   */
  static async getFramesAsLegacyFormat() {
    try {
      const frames = await this.getAllFrames();
      const legacyFrames = {};

      // 为每个frame创建draw函数
      for (const frame of frames) {
        const frameWithCode = await this.getFrameByName(frame.name);
        if (frameWithCode && frameWithCode.code) {
          legacyFrames[frame.name] = {
            name: frame.name,
            description: frame.description,
            draw: this.createFrameDrawFunction(frameWithCode.code)
          };
        }
      }

      return legacyFrames;
    } catch (error) {
      console.error('Error converting frames to legacy format:', error);
      // 返回一个包含默认frame的fallback
      return {
        none: {
          name: 'none',
          description: 'No frame',
          draw: () => {}
        }
      };
    }
  }

  /**
   * 获取单个frame的draw函数（带全局缓存）
   */
  static async getFrameDrawFunction(frameName) {
    // 检查缓存
    if (frameCache.has(frameName)) {
      return frameCache.get(frameName);
    }
    
    // 检查是否正在加载，避免重复请求
    const loadingKey = `loading_${frameName}`;
    if (loadingPromises.has(loadingKey)) {
      return await loadingPromises.get(loadingKey);
    }
    
    // 创建加载 Promise
    const loadingPromise = this._loadFrameFunction(frameName);
    loadingPromises.set(loadingKey, loadingPromise);
    
    try {
      const drawFunction = await loadingPromise;
      frameCache.set(frameName, drawFunction);
      console.log(`FrameService: Frame ${frameName} loaded and cached`);
      return drawFunction;
    } catch (error) {
      console.error(`FrameService: Error loading frame ${frameName}:`, error);
      const fallbackFunction = () => {};
      frameCache.set(frameName, fallbackFunction);
      return fallbackFunction;
    } finally {
      loadingPromises.delete(loadingKey);
    }
  }

  static async _loadFrameFunction(frameName) {
    const frameWithCode = await this.getFrameByName(frameName);
    
    if (frameWithCode && frameWithCode.code) {
      return this.createFrameDrawFunction(frameWithCode.code);
    }
    return () => {}; // 返回空函数作为fallback
  }

  /**
   * 批量预加载 frames
   */
  static async preloadFrames(frameNames) {
    console.log(`FrameService: Preloading frames:`, frameNames);
    const promises = frameNames.map(name => this.getFrameDrawFunction(name));
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`FrameService: Preloaded ${successful} frames successfully, ${failed} failed`);
    return results;
  }

  /**
   * 创建专门用于预览的frame函数 - 独立于拍摄和合成流程
   * 这个函数仅用于实时预览，不影响实际的photo strip生成
   */
  static createPreviewFrameFunction(frameCode) {
    try {
        let code = frameCode.trim();
        let functionBody;
        
        // 步骤 1: 智能解析，提取函数体
        
        // 检查是否是箭头函数格式 (包括带或不带 async)
        if (code.includes('=>')) {
            const bodyStartIndex = code.indexOf('{');
            const bodyEndIndex = code.lastIndexOf('}');
            
            if (bodyStartIndex === -1 || bodyEndIndex === -1 || bodyEndIndex < bodyStartIndex) {
                throw new Error("Invalid arrow function format: could not find function body.");
            }
            
            functionBody = code.substring(bodyStartIndex + 1, bodyEndIndex);

        } else if (code.startsWith('{') && code.endsWith('}')) {
            // 假设 AI 只返回了函数体 (情况 C)
            functionBody = code.substring(1, code.length - 1);

        } else {
            console.warn("FrameService: Unknown code format, attempting to treat as function body.");
            functionBody = code;
        }

        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        
        const drawFunction = new AsyncFunction('ctx', 'x', 'y', 'width', 'height', functionBody);
        
        return drawFunction;

    } catch (error) {
        console.error('FrameService: Error creating frame draw function:', error);
        console.error('Frame code:', frameCode);
        return async () => { /* no-op fallback */ };
    }
  }

  /**
   * 获取单个frame的预览draw函数 - 专门用于实时预览
   */
  static async getPreviewFrameDrawFunction(frameName) {
    try {
      const frameWithCode = await this.getFrameByName(frameName);
      
      if (frameWithCode && frameWithCode.code) {
        const drawFunction = this.createPreviewFrameFunction(frameWithCode.code);
        return drawFunction;
      }
      return () => {}; // 返回空函数作为fallback
    } catch (error) {
      console.error(`Error getting preview draw function for frame ${frameName}:`, error);
      return () => {};
    }
  }

  /**
   * 清除缓存
   */
  static clearCache() {
    frameCache.clear();
    loadingPromises.clear();
    frameDataCache.clear();
    console.log('FrameService: All caches cleared');
  }

  /**
   * 获取缓存统计信息
   */
  static getCacheStats() {
    return {
      frameCache: frameCache.size,
      frameDataCache: frameDataCache.size,
      loadingPromises: loadingPromises.size
    };
  }
}

export default FrameService;