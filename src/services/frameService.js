import { getAuthHeaders } from '../utils/auth';

const API_BASE_URL = 'https://api.picapica.app/api';

// Frame响应接口
export class FrameService {
  /**
   * 获取所有活跃的frames
   */
  static async getAllFrames() {
    try {
      const response = await fetch(`${API_BASE_URL}/frames`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch frames');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching frames:', error);
      throw error;
    }
  }

  /**
   * 根据名称获取frame的完整信息(包含代码)
   */
  static async getFrameByName(name) {
    try {
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
    } catch (error) {
      console.error(`Error fetching frame ${name}:`, error);
      throw error;
    }
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
   * 创建frame的draw函数
   */
  static createFrameDrawFunction(frameCode) {
    try {
      // 检查frameCode是否为箭头函数格式
      let functionCode = frameCode.trim();
      
      if (functionCode.startsWith('(ctx, x, y, width, height) =>')) {
        // 如果是完整的箭头函数，直接评估
        const drawFunction = eval(`(${functionCode})`);
        return drawFunction;
      } else if (functionCode.includes('=>')) {
        // 可能是其他格式的箭头函数，尝试直接评估
        const drawFunction = eval(`(${functionCode})`);
        return drawFunction;
      } else {
        // 如果是函数体，使用Function constructor
        const drawFunction = new Function('ctx', 'x', 'y', 'width', 'height', functionCode);
        return drawFunction;
      }
    } catch (error) {
      console.error('Error creating frame draw function:', error);
      console.error('Frame code:', frameCode);
      // 返回一个空的draw函数作为fallback
      return (ctx, x, y, width, height) => {
        console.log(`Frame function failed for area: ${x}, ${y}, ${width}, ${height}`);
      };
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
   * 获取单个frame的draw函数
   */
  static async getFrameDrawFunction(frameName) {
    try {
      const frameWithCode = await this.getFrameByName(frameName);
      
      if (frameWithCode && frameWithCode.code) {
        const drawFunction = this.createFrameDrawFunction(frameWithCode.code);
        return drawFunction;
      }
      return () => {}; // 返回空函数作为fallback
    } catch (error) {
      console.error(`Error getting draw function for frame ${frameName}:`, error);
      return () => {};
    }
  }
}

export default FrameService;