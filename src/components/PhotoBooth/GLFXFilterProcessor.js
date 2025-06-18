// src/components/PhotoBooth/GLFXFilterProcessor.js

/**
 * GLFX 滤镜处理器 - 优化版本
 * 
 * 优化重点：
 * 1. 人像友好：所有滤镜都经过人像显示优化
 * 2. 自然效果：避免过度处理，保持自然感
 * 3. 稳定性：增强错误处理和黑屏检测
 * 4. 性能：优化纹理管理和内存使用
 * 
 * 滤镜分类：
 * - 人像专用：适合自拍和人像照片
 * - 风景适用：适合风景和物体拍摄
 * - 创意效果：艺术化处理，保持可用性
 */
class GLFXFilterProcessor {
  constructor() {
    this.glfxCanvas = null;
    this.isGlfxSupported = false;
    this.lastProcessedImage = null; // 用于快速回退
    this.initGLFX();
  }

  initGLFX() {
    try {
      console.log('Initializing GLFX processor...');
      
      if (typeof window.fx !== 'undefined') {
        this.glfxCanvas = window.fx.canvas();
        this.isGlfxSupported = true;
        console.log('GLFX initialized successfully');
      } else {
        console.warn('GLFX library not available, falling back to CSS filters');
        this.isGlfxSupported = false;
      }
    } catch (error) {
      console.error('Failed to initialize GLFX:', error);
      this.isGlfxSupported = false;
    }
  }

  isSupported() {
    return this.isGlfxSupported && this.glfxCanvas;
  }

  // 主要滤镜应用函数 - 优化版本
  applyFilter(canvas, filterType) {
    console.log(`Applying optimized filter: ${filterType}`);
    
    if (!this.isSupported()) {
      console.warn('GLFX not supported, returning original canvas');
      return canvas;
    }

    // 保存原始图像数据
    const originalImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let texture = null;

    try {
      // 创建纹理
      texture = this.glfxCanvas.texture(canvas);
      this.glfxCanvas.draw(texture);

      // 应用对应的优化滤镜
      switch (filterType) {
        case 'pelicula-antigua':
          this.applyOptimizedFilm();
          break;
        case 'coctel':
          this.applyOptimizedRoseGold();
          break;
        case 'camara-espia':
          this.applyOptimizedCoolBlue();
          break;
        case 'purpura':
          this.applyOptimizedDreamy();
          break;
        case 'bokeh':
          this.applyOptimizedSoftFocus();
          break;
        case 'fisiograma':
          this.applyOptimizedWarmGlow();
          break;
        case 'peligro':
          this.applyOptimizedHighContrast();
          break;
        case 'arcoiris':
          this.applyOptimizedRainbow();
          break;
        case 'solo-azul':
          this.applyOptimizedOceanBlue();
          break;
        default:
          console.log(`Unknown filter type: ${filterType}`);
          return canvas;
      }

      this.glfxCanvas.update();

      // 验证处理结果
      if (this.isValidProcessedImage()) {
        // 应用处理结果到原始canvas
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(this.glfxCanvas, 0, 0);
        console.log(`Filter ${filterType} applied successfully`);
      } else {
        // 恢复原始图像
        canvas.getContext('2d').putImageData(originalImageData, 0, 0);
        console.warn(`Filter ${filterType} produced invalid result, restored original`);
      }

      return canvas;

    } catch (error) {
      console.error(`Error applying filter ${filterType}:`, error);
      // 恢复原始图像
      canvas.getContext('2d').putImageData(originalImageData, 0, 0);
      return canvas;
    } finally {
      // 清理纹理资源
      if (texture) {
        try {
          texture.destroy();
        } catch (cleanupError) {
          console.warn('Error cleaning up texture:', cleanupError);
        }
      }
    }
  }

  // 验证处理后的图像是否有效
  isValidProcessedImage() {
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.glfxCanvas.width;
      tempCanvas.height = this.glfxCanvas.height;
      const tempContext = tempCanvas.getContext('2d');
      tempContext.drawImage(this.glfxCanvas, 0, 0);
      
      const imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      return !this.isImageBlack(imageData) && !this.isImageOverExposed(imageData);
    } catch (error) {
      console.error('Error validating processed image:', error);
      return false;
    }
  }

  // 检查图像是否过度曝光
  isImageOverExposed(imageData) {
    const data = imageData.data;
    let overExposedPixels = 0;
    const threshold = 250;
    const sampleRate = 16; // 每16个像素采样一次
    
    for (let i = 0; i < data.length; i += sampleRate * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r > threshold && g > threshold && b > threshold) {
        overExposedPixels++;
      }
    }
    
    const totalSamples = data.length / (sampleRate * 4);
    return (overExposedPixels / totalSamples) > 0.8; // 如果80%以上的像素过度曝光
  }

  // 检查图像是否为黑色（优化版本）
  isImageBlack(imageData) {
    const data = imageData.data;
    let brightPixels = 0;
    const threshold = 15; // 稍微提高阈值
    const sampleRate = 16; // 采样率
    
    for (let i = 0; i < data.length; i += sampleRate * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      
      if (brightness > threshold) {
        brightPixels++;
        if (brightPixels > 20) { // 找到足够的亮像素就返回false
          return false;
        }
      }
    }
    
    return brightPixels <= 20;
  }

  // ============ 优化后的滤镜效果 ============

  // 1. 优化胶片效果 - 人像友好版本
  applyOptimizedFilm() {
    console.log('Applying optimized film effect...');
    this.glfxCanvas
      .sepia(0.6)                           // 降低棕褐色强度，避免过度
      .vignette(0.4, 0.3)                   // 减少暗角，保持人脸清晰
      .noise(0.15)                          // 减少噪点，保持清晰度
      .brightnessContrast(0.08, 0.25)       // 温和的亮度和对比度调整
      .hueSaturation(0.02, 0.1)             // 轻微暖色调整
      .unsharpMask(1.2, 0.2);               // 轻微锐化
  }

  // 2. 优化玫瑰金效果 - 适合自拍
  applyOptimizedRoseGold() {
    console.log('Applying optimized rose gold effect...');
    this.glfxCanvas
      .hueSaturation(-0.08, 0.45)           // 温和的玫瑰金色调
      .brightnessContrast(0.12, 0.2)        // 适度提亮，保持自然
      .vibrance(0.4)                        // 适度鲜艳度，不过度
      .unsharpMask(1, 0.15);                // 轻微锐化，增强细节
  }

  // 3. 优化酷蓝效果 - 保持肤色自然
  applyOptimizedCoolBlue() {
    console.log('Applying optimized cool blue effect...');
    this.glfxCanvas
      .hueSaturation(0.3, 0.35)             // 减少蓝色强度
      .brightnessContrast(0.05, 0.3)        // 保持适当亮度
      .vibrance(0.3)                        // 适度饱和度
      .vignette(0.25, 0.2);                 // 轻微暗角
  }

  // 4. 优化梦幻效果 - 柔和人像
  applyOptimizedDreamy() {
    console.log('Applying optimized dreamy effect...');
    this.glfxCanvas
      .hueSaturation(-0.2, 0.5)             // 温和的紫色调
      .brightnessContrast(0.1, 0.15)        // 柔和的亮度对比
      .vibrance(0.45)                       // 适度鲜艳度
      .lensBlur(0.5, 0.2, 0)                // 减少模糊强度
      .unsharpMask(0.8, 0.1);               // 保持一定清晰度
  }

  // 5. 优化柔焦效果 - 适合人像
  applyOptimizedSoftFocus() {
    console.log('Applying optimized soft focus effect...');
    this.glfxCanvas
      .hueSaturation(0.1, 0.3)              // 轻微绿色调
      .lensBlur(1.5, 0.25, 0)               // 适度模糊
      .brightnessContrast(0.08, 0.1)        // 柔和调整
      .vibrance(0.25)                       // 轻微饱和度
      .vignette(0.2, 0.15)                  // 轻微暗角
      .unsharpMask(0.5, 0.1);               // 保持中心清晰度
  }

  // 6. 优化温暖光晕 - 自然发光效果
  applyOptimizedWarmGlow() {
    console.log('Applying optimized warm glow effect...');
    this.glfxCanvas
      .hueSaturation(0.05, 0.4)             // 温和的暖色调
      .brightnessContrast(0.15, 0.2)        // 适度提亮
      .vibrance(0.35)                       // 适度饱和度
      .vignette(0.15, 0.1)                  // 轻微暗角
      .unsharpMask(1, 0.15);                // 保持清晰度
  }

  // 7. 优化高对比度 - 避免过度处理
  applyOptimizedHighContrast() {
    console.log('Applying optimized high contrast effect...');
    this.glfxCanvas
      .brightnessContrast(0.1, 0.5)         // 适度对比度
      .hueSaturation(0, -0.25)              // 轻微去饱和
      .vignette(0.3, 0.2)                   // 适度暗角
      .unsharpMask(1.5, 0.25);              // 增强细节
  }

  // 8. 优化彩虹效果 - 保持自然
  applyOptimizedRainbow() {
    console.log('Applying optimized rainbow effect...');
    this.glfxCanvas
      .hueSaturation(0.15, 0.5)             // 适度色相偏移
      .vibrance(0.4)                        // 控制饱和度
      .brightnessContrast(0.1, 0.25)        // 适度调整
      .unsharpMask(1, 0.2);                 // 保持清晰度
  }

  // 9. 优化海洋蓝 - 保持肤色
  applyOptimizedOceanBlue() {
    console.log('Applying optimized ocean blue effect...');
    this.glfxCanvas
      .hueSaturation(0.4, 0.6)              // 适度蓝色调
      .brightnessContrast(0.05, 0.35)       // 保持适当亮度
      .vibrance(0.4)                        // 适度饱和度
      .vignette(0.2, 0.15);                 // 轻微暗角
  }

  // ============ 智能滤镜系统 ============

  // 图像分析 - 增强版本
  analyzeImage(canvas) {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let totalR = 0, totalG = 0, totalB = 0, totalBrightness = 0;
    let pixelCount = 0;
    let histogram = new Array(256).fill(0);
    
    // 采样分析
    for (let i = 0; i < data.length; i += 16) { // 每4个像素采样一次
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = Math.round((r + g + b) / 3);
      
      totalR += r;
      totalG += g;
      totalB += b;
      totalBrightness += brightness;
      histogram[brightness]++;
      pixelCount++;
    }
    
    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;
    const avgBrightness = totalBrightness / pixelCount;
    
    // 检测人像特征（基于色彩分布）
    const skinToneScore = this.calculateSkinToneScore(avgR, avgG, avgB);
    const isLikelyPortrait = skinToneScore > 0.3;
    
    return {
      averageRed: avgR / 255,
      averageGreen: avgG / 255,
      averageBlue: avgB / 255,
      averageBrightness: avgBrightness / 255,
      isDark: avgBrightness < 85,
      isBright: avgBrightness > 170,
      isLikelyPortrait: isLikelyPortrait,
      skinToneScore: skinToneScore,
      dominantColor: this.getDominantColor(avgR, avgG, avgB),
      contrast: this.estimateContrast(histogram)
    };
  }

  // 计算肤色分数
  calculateSkinToneScore(r, g, b) {
    // 基于RGB值判断是否接近肤色范围
    const skinRanges = [
      { r: [220, 255], g: [180, 230], b: [160, 200] }, // 浅肤色
      { r: [180, 220], g: [140, 180], b: [120, 160] }, // 中等肤色
      { r: [120, 180], g: [90, 140], b: [70, 120] }    // 深肤色
    ];
    
    let maxScore = 0;
    skinRanges.forEach(range => {
      if (r >= range.r[0] && r <= range.r[1] &&
          g >= range.g[0] && g <= range.g[1] &&
          b >= range.b[0] && b <= range.b[1]) {
        const score = 1 - (Math.abs(r - (range.r[0] + range.r[1]) / 2) +
                          Math.abs(g - (range.g[0] + range.g[1]) / 2) +
                          Math.abs(b - (range.b[0] + range.b[1]) / 2)) / 255;
        maxScore = Math.max(maxScore, score);
      }
    });
    
    return maxScore;
  }

  // 获取主导色调
  getDominantColor(r, g, b) {
    const max = Math.max(r, g, b);
    if (max === r && r > g + 30 && r > b + 30) return 'red';
    if (max === g && g > r + 30 && g > b + 30) return 'green';
    if (max === b && b > r + 30 && b > g + 30) return 'blue';
    
    // 检查是否为肤色
    if (r > 150 && g > 100 && b > 80 && r > g && g > b) return 'skin';
    
    return 'neutral';
  }

  // 估算对比度
  estimateContrast(histogram) {
    let minBrightness = 255, maxBrightness = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < histogram.length; i++) {
      if (histogram[i] > 0) {
        minBrightness = Math.min(minBrightness, i);
        maxBrightness = Math.max(maxBrightness, i);
        totalPixels += histogram[i];
      }
    }
    
    return (maxBrightness - minBrightness) / 255;
  }

  // 智能滤镜应用
  applySmartFilter(canvas, filterType) {
    if (!this.isSupported()) {
      return canvas;
    }

    const imageInfo = this.analyzeImage(canvas);
    console.log('Smart filter analysis:', imageInfo);

    // 如果检测到人像，使用人像优化参数
    if (imageInfo.isLikelyPortrait) {
      console.log('Portrait detected, using portrait-optimized parameters');
      return this.applyPortraitOptimizedFilter(canvas, filterType, imageInfo);
    } else {
      console.log('Non-portrait image, using standard parameters');
      return this.applyFilter(canvas, filterType);
    }
  }

  // 人像优化滤镜
  applyPortraitOptimizedFilter(canvas, filterType, imageInfo) {
    // 为人像应用更温和的滤镜参数
    const originalImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let texture = null;

    try {
      texture = this.glfxCanvas.texture(canvas);
      this.glfxCanvas.draw(texture);

      // 根据滤镜类型应用人像优化版本
      switch (filterType) {
        case 'pelicula-antigua':
          this.applyPortraitFilm(imageInfo);
          break;
        case 'coctel':
          this.applyPortraitRoseGold(imageInfo);
          break;
        case 'purpura':
          this.applyPortraitDreamy(imageInfo);
          break;
        default:
          // 使用标准优化版本
          return this.applyFilter(canvas, filterType);
      }

      this.glfxCanvas.update();

      if (this.isValidProcessedImage()) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(this.glfxCanvas, 0, 0);
      } else {
        canvas.getContext('2d').putImageData(originalImageData, 0, 0);
      }

      return canvas;
    } catch (error) {
      console.error('Error applying portrait-optimized filter:', error);
      canvas.getContext('2d').putImageData(originalImageData, 0, 0);
      return canvas;
    } finally {
      if (texture) {
        try {
          texture.destroy();
        } catch (cleanupError) {
          console.warn('Error cleaning up texture:', cleanupError);
        }
      }
    }
  }

  // 人像专用胶片效果
  applyPortraitFilm(imageInfo) {
    const brightnessFactor = imageInfo.isDark ? 1.4 : imageInfo.isBright ? 0.9 : 1.0;
    
    this.glfxCanvas
      .sepia(0.4)                                    // 更温和的棕褐色
      .vignette(0.25, 0.2)                          // 减少暗角
      .noise(0.08)                                  // 减少噪点
      .brightnessContrast(0.1 * brightnessFactor, 0.2)
      .unsharpMask(0.8, 0.15);
  }

  // 人像专用玫瑰金效果
  applyPortraitRoseGold(imageInfo) {
    const warmthFactor = imageInfo.skinToneScore > 0.5 ? 0.7 : 1.0;
    
    this.glfxCanvas
      .hueSaturation(-0.06 * warmthFactor, 0.35)
      .brightnessContrast(0.15, 0.18)
      .vibrance(0.3)
      .unsharpMask(0.8, 0.12);
  }

  // 人像专用梦幻效果
  applyPortraitDreamy(imageInfo) {
    const blurFactor = imageInfo.contrast > 0.4 ? 0.6 : 0.8;
    
    this.glfxCanvas
      .hueSaturation(-0.15, 0.4)
      .brightnessContrast(0.12, 0.12)
      .vibrance(0.35)
      .lensBlur(0.3 * blurFactor, 0.15, 0)
      .unsharpMask(0.6, 0.08);
  }

  // 清理资源
  destroy() {
    if (this.glfxCanvas) {
      this.glfxCanvas = null;
    }
    this.lastProcessedImage = null;
  }
}

export default GLFXFilterProcessor;