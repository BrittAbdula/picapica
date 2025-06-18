 // src/components/PhotoBooth/GLFXFilterProcessor.js
class GLFXFilterProcessor {
    constructor() {
      this.glfxCanvas = null;
      this.isGlfxSupported = false;
      this.initGLFX();
    }
  
      initGLFX() {
    try {
      // 添加更多调试信息
      console.log('Checking for glfx availability...');
      console.log('window.fx exists:', typeof window.fx !== 'undefined');
      
      if (typeof window.fx !== 'undefined') {
        console.log('Creating fx canvas...');
        this.glfxCanvas = window.fx.canvas();
        this.isGlfxSupported = true;
        console.log('GLFX initialized successfully');
        console.log('GLFX canvas:', this.glfxCanvas);
      } else {
        console.warn('GLFX library not loaded. Please ensure glfx.js is included in your HTML');
        this.isGlfxSupported = false;
      }
    } catch (error) {
      console.error('Failed to initialize GLFX:', error);
      this.isGlfxSupported = false;
    }
  }
  
    // 检查 glfx 是否可用
    isSupported() {
      return this.isGlfxSupported && this.glfxCanvas;
    }
  
      // 应用复合滤镜效果
  applyFilter(canvas, filterType) {
    console.log('Applying filter:', filterType);
    console.log('GLFX supported:', this.isSupported());
    
    if (!this.isSupported()) {
      console.warn('GLFX not supported, falling back to original canvas');
      return canvas;
    }

    try {
      // 从原始 canvas 创建 glfx 纹理
      console.log('Creating texture from canvas...');
      const texture = this.glfxCanvas.texture(canvas);
      this.glfxCanvas.draw(texture);
      console.log('Texture created and drawn');

      // 根据滤镜类型应用不同的效果
      console.log('Applying filter type:', filterType);
      switch (filterType) {
        case 'pelicula-antigua':
          this.applyPeliculaAntigua();
          break;
        case 'coctel':
          this.applyCoctel();
          break;
        case 'camara-espia':
          this.applyCamaraEspia();
          break;
        case 'purpura':
          this.applyPurpura();
          break;
        case 'bokeh':
          this.applyBokeh();
          break;
        case 'fisiograma':
          this.applyFisiograma();
          break;
        case 'peligro':
          this.applyPeligro();
          break;
        case 'arcoiris':
          this.applyArcoiris();
          break;
        case 'solo-azul':
          this.applySoloAzul();
          break;
        default:
          console.log('No filter applied for type:', filterType);
          break;
      }

      console.log('Updating GLFX canvas...');
      this.glfxCanvas.update();
      
      // 将处理后的图像绘制回原始 canvas
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(this.glfxCanvas, 0, 0);
      console.log('Filter applied successfully');

      // 清理纹理
      texture.destroy();
      
      return canvas;
    } catch (error) {
      console.error('Error applying GLFX filter:', error);
      console.error('Error stack:', error.stack);
      return canvas;
    }
  }
  
      // 老电影效果 - 复古怀旧
  applyPeliculaAntigua() {
    console.log('Applying Pelicula Antigua filter...');
    this.glfxCanvas
      .sepia(0.8)                           // 更强的棕褐色调
      .vignette(0.5, 0.4)                   // 更明显的边缘暗角
      .noise(0.25)                          // 更多胶片噪点
      .brightnessContrast(0.15, 0.3);      // 更高对比度
  }
  
      // 鸡尾酒效果 - 红色调
  applyCoctel() {
    console.log('Applying Coctel filter...');
    this.glfxCanvas
      .hueSaturation(-0.15, 0.6)            // 更强的红色调和饱和度
      .brightnessContrast(0.2, 0.35)        // 更亮更有对比度
      .vibrance(0.5);                       // 更强鲜艳度
  }
  
    // 间谍相机效果 - 蓝色调
    applyCamaraEspia() {
      console.log('Applying Camara Espia filter...');
      this.glfxCanvas
        .hueSaturation(0.5, 0.4)              // 更强蓝色调
        .brightnessContrast(-0.1, 0.4)        // 更暗，更高对比度
        .vignette(0.4, 0.3);                  // 更明显暗角
    }
  
    // 紫色效果
    applyPurpura() {
      console.log('Applying Purpura filter...');
      this.glfxCanvas
        .hueSaturation(-0.4, 0.7)             // 更强紫色调
        .brightnessContrast(0.15, 0.25)       // 更亮
        .vibrance(0.6);                       // 更强紫色鲜艳度
    }
  
    // 散景效果 - 绿色调
    applyBokeh() {
      console.log('Applying Bokeh filter...');
      this.glfxCanvas
        .hueSaturation(0.2, 0.5)              // 更强绿色调
        .lensBlur(3, 0.5, 0)                  // 更强散景模糊
        .brightnessContrast(0.15, 0.2)        // 更亮
        .vibrance(0.4);                       // 增强绿色鲜艳度
    }
  
    // 生理图效果 - 橙色调
    applyFisiograma() {
      console.log('Applying Fisiograma filter...');
      this.glfxCanvas
        .hueSaturation(0.08, 0.6)             // 更强橙色调
        .brightnessContrast(0.25, 0.3)        // 更亮更有对比度
        .vibrance(0.5);                       // 更强暖色调
    }
  
    // 危险效果 - 黑白红色高对比度
    applyPeligro() {
      console.log('Applying Peligro filter...');
      this.glfxCanvas
        .brightnessContrast(0.1, 1.2)         // 极高对比度
        .hueSaturation(-0.8, -0.6)            // 强烈去色，保留红色
        .vignette(0.7, 0.5);                  // 更强烈暗角
    }
  
    // 彩虹效果 - 多彩渐变
    applyArcoiris() {
      console.log('Applying Arcoiris filter...');
      this.glfxCanvas
        .hueSaturation(0.3, 1.0)              // 更强色相偏移和极高饱和度
        .vibrance(0.8)                        // 极高鲜艳度
        .brightnessContrast(0.2, 0.4);       // 更亮更有对比度
    }
  
    // 只有蓝色效果
    applySoloAzul() {
      console.log('Applying Solo Azul filter...');
      this.glfxCanvas
        .hueSaturation(0.6, 0.8)              // 更强蓝色调
        .brightnessContrast(0.1, 0.5)         // 更高对比度
        .vibrance(0.4);                       // 适度鲜艳度
    }
  
    // 清理资源
    destroy() {
      if (this.glfxCanvas) {
        // glfx canvas 没有专门的销毁方法，设为 null 即可
        this.glfxCanvas = null;
      }
    }
  }
  
  export default GLFXFilterProcessor;
