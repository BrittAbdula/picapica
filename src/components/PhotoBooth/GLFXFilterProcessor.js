// src/components/PhotoBooth/GLFXFilterProcessor.js
class GLFXFilterProcessor {
    constructor() {
      this.glfxCanvas = null;
      this.isGlfxSupported = false;
      this.initGLFX();
    }
  
    initGLFX() {
      try {
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
  
    isSupported() {
      return this.isGlfxSupported && this.glfxCanvas;
    }
  
    applyFilter(canvas, filterType) {
      console.log('Applying filter:', filterType);
      console.log('GLFX supported:', this.isSupported());
      
      if (!this.isSupported()) {
        console.warn('GLFX not supported, falling back to original canvas');
        return canvas;
      }

      try {
        console.log('Creating texture from canvas...');
        const texture = this.glfxCanvas.texture(canvas);
        this.glfxCanvas.draw(texture);
        console.log('Texture created and drawn');

        console.log('Applying filter type:', filterType);
        switch (filterType) {
          // 原有滤镜
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
          
          // 新增滤镜
          case 'libro-comico':
            this.applyLibroComico();
            break;
          case 'mono-cuatro':
            this.applyMonoCuatro(canvas);
            break;
          case 'lomo-cuatro':
            this.applyLomoCuatro(canvas);
            break;
          case 'historietas':
            this.applyHistorietas();
            break;
          case 'revista':
            this.applyRevista();
            break;
          case 'blanco-negro':
            this.applyBlancoNegro();
            break;
          case 'caricatura':
            this.applyCaricatura();
            break;
          case 'termica':
            this.applyTermica();
            break;
          case 'xray':
            this.applyXRay();
            break;
          case 'oleo':
            this.applyOleo();
            break;
          case 'acuarela':
            this.applyAcuarela();
            break;
          case 'espejo':
            this.applyEspejo(canvas);
            break;
          default:
            console.log('No filter applied for type:', filterType);
            break;
        }

        console.log('Updating GLFX canvas...');
        this.glfxCanvas.update();
        
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(this.glfxCanvas, 0, 0);
        console.log('Filter applied successfully');

        texture.destroy();
        
        return canvas;
      } catch (error) {
        console.error('Error applying GLFX filter:', error);
        console.error('Error stack:', error.stack);
        return canvas;
      }
    }
  
    // 原有滤镜方法...
    applyPeliculaAntigua() {
      console.log('Applying Pelicula Antigua filter...');
      this.glfxCanvas
        .sepia(0.8)
        .vignette(0.5, 0.4)
        .noise(0.25)
        .brightnessContrast(0.15, 0.3);
    }
  
    applyCoctel() {
      console.log('Applying Coctel filter...');
      this.glfxCanvas
        .hueSaturation(-0.15, 0.6)
        .brightnessContrast(0.2, 0.35)
        .vibrance(0.5);
    }
  
    applyCamaraEspia() {
      console.log('Applying Camara Espia filter...');
      this.glfxCanvas
        .hueSaturation(0.5, 0.4)
        .brightnessContrast(-0.1, 0.4)
        .vignette(0.4, 0.3);
    }
  
    applyPurpura() {
      console.log('Applying Purpura filter...');
      this.glfxCanvas
        .hueSaturation(-0.4, 0.7)
        .brightnessContrast(0.15, 0.25)
        .vibrance(0.6);
    }
  
    applyBokeh() {
      console.log('Applying Bokeh filter...');
      this.glfxCanvas
        .hueSaturation(0.2, 0.5)
        .lensBlur(3, 0.5, 0)
        .brightnessContrast(0.15, 0.2)
        .vibrance(0.4);
    }
  
    applyFisiograma() {
      console.log('Applying Fisiograma filter...');
      this.glfxCanvas
        .hueSaturation(0.08, 0.6)
        .brightnessContrast(0.25, 0.3)
        .vibrance(0.5);
    }
  
    applyPeligro() {
      console.log('Applying Peligro filter...');
      this.glfxCanvas
        .brightnessContrast(0.1, 1.2)
        .hueSaturation(-0.8, -0.6)
        .vignette(0.7, 0.5);
    }
  
    applyArcoiris() {
      console.log('Applying Arcoiris filter...');
      this.glfxCanvas
        .hueSaturation(0.3, 1.0)
        .vibrance(0.8)
        .brightnessContrast(0.2, 0.4);
    }
  
    applySoloAzul() {
      console.log('Applying Solo Azul filter...');
      this.glfxCanvas
        .hueSaturation(0.6, 0.8)
        .brightnessContrast(0.1, 0.5)
        .vibrance(0.4);
    }
  
    // 新增滤镜方法
    
    // 漫画书风格
    applyLibroComico() {
      console.log('Applying Libro Comico filter...');
      this.glfxCanvas
        .edgeWork(10)                      // 边缘检测增强轮廓
        .ink(0.4)                          // 墨水效果
        .brightnessContrast(0.3, 0.8)      // 高对比度
        .vibrance(0.8)                     // 增强颜色
        .hueSaturation(0, 0.7);            // 稍微降低饱和度
    }
  
    // 四格黑白
    applyMonoCuatro(originalCanvas) {
      console.log('Applying Mono Cuatro filter...');
      // 先应用黑白高对比效果
      this.glfxCanvas
        .desaturate()                      // 完全去色
        .brightnessContrast(0.2, 1.5)      // 极高对比度
        .curves([                          // S曲线增强对比
          [0, 0],
          [64, 20],
          [128, 128],
          [192, 235],
          [255, 255]
        ]);
      
      // 特殊处理：这个效果需要在canvas上创建四格
      // 由于GLFX不直接支持分格，这里只应用黑白效果
      // 分格效果需要在外部处理
    }
  
    // 四格复古
    applyLomoCuatro(originalCanvas) {
      console.log('Applying Lomo Cuatro filter...');
      // LOMO复古效果
      this.glfxCanvas
        .curves([                          // 复古色调曲线
          [0, 0],
          [64, 60],
          [128, 130],
          [192, 210],
          [255, 255]
        ], [                               // 绿色通道
          [0, 0],
          [64, 50],
          [128, 120],
          [192, 200],
          [255, 255]
        ], [                               // 蓝色通道
          [0, 20],
          [64, 50],
          [128, 100],
          [192, 180],
          [255, 220]
        ])
        .vignette(0.6, 0.35)               // 强烈暗角
        .brightnessContrast(0.1, 1.2)      // 增强对比度
        .vibrance(0.5)                     // 适度鲜艳度
        .sepia(0.2);                       // 轻微棕褐色
    }
  
    // 漫画风格
    applyHistorietas() {
      console.log('Applying Historietas filter...');
      this.glfxCanvas
        .edgeWork(15)                      // 更强的边缘
        .ink(0.5)                          // 更强的墨水效果
        .dotScreen(320, 239.5, 1.1, 4)    // 网点效果
        .brightnessContrast(0.4, 1.0)      // 高亮高对比
        .vibrance(1.0);                    // 最大鲜艳度
    }
  
    // 杂志风格
    applyRevista() {
      console.log('Applying Revista filter...');
      this.glfxCanvas
        .unsharpMask(20, 2)                // 锐化效果
        .brightnessContrast(0.15, 1.3)     // 时尚杂志对比度
        .vibrance(0.6)                     // 适度鲜艳
        .curves([                          // 时尚色调曲线
          [0, 10],
          [64, 70],
          [128, 135],
          [192, 205],
          [255, 245]
        ])
        .vignette(0.3, 0.2);               // 轻微暗角
    }
  
    // 黑白高对比
    applyBlancoNegro() {
      console.log('Applying Blanco y Negro filter...');
      this.glfxCanvas
        .desaturate()                      // 完全去色
        .brightnessContrast(0.1, 2.0)      // 极高对比度
        .curves([                          // 强S曲线
          [0, 0],
          [64, 10],
          [128, 128],
          [192, 245],
          [255, 255]
        ])
        .denoise(10)                       // 降噪使画面更干净
        .unsharpMask(10, 1);               // 锐化
    }
  
    // 卡通风格
    applyCaricatura() {
      console.log('Applying Caricatura filter...');
      this.glfxCanvas
        .edgeWork(20)                      // 强边缘
        .ink(0.3)                          // 墨水轮廓
        .brightnessContrast(0.5, 1.2)      // 明亮卡通色彩
        .vibrance(1.2)                     // 超级鲜艳
        .hueSaturation(0.05, 1.5)          // 增强饱和度
        .denoise(20);                      // 平滑效果
    }
  
    // 热成像
    applyTermica() {
      console.log('Applying Termica filter...');
      this.glfxCanvas
        .hueSaturation(0.8, 2.0)           // 偏向红黄色调
        .brightnessContrast(0.3, 1.8)      // 高对比度
        .curves([                          // 热成像色彩映射
          [0, 0],
          [64, 100],
          [128, 200],
          [192, 255],
          [255, 255]
        ], [                               // 绿色通道
          [0, 0],
          [64, 50],
          [128, 100],
          [192, 150],
          [255, 200]
        ], [                               // 蓝色通道
          [0, 100],
          [64, 50],
          [128, 0],
          [192, 0],
          [255, 0]
        ])
        .vibrance(0.8);
    }
  
    // X光效果
    applyXRay() {
      console.log('Applying X-Ray filter...');
      this.glfxCanvas
        .desaturate()                      // 去色
        .curves([                          // 反转曲线
          [0, 255],
          [64, 192],
          [128, 128],
          [192, 64],
          [255, 0]
        ])
        .brightnessContrast(-0.1, 1.5)     // 调整对比度
        .hueSaturation(0.5, 0.3)           // 轻微蓝绿色调
        .edgeWork(5);                      // 轻微边缘增强
    }
  
    // 油画效果
    applyOleo() {
      console.log('Applying Oleo filter...');
      this.glfxCanvas
        .denoise(50)                       // 强降噪产生油画笔触
        .unsharpMask(50, 5)                // 强锐化
        .brightnessContrast(0.1, 1.4)      // 油画般的对比度
        .vibrance(0.7)                     // 油画色彩
        .vignette(0.4, 0.25);              // 画框效果
    }
  
    // 水彩效果
    applyAcuarela() {
      console.log('Applying Acuarela filter...');
      this.glfxCanvas
        .edgeWork(8)                       // 水彩边缘
        .denoise(30)                       // 水彩柔和感
        .brightnessContrast(0.3, 0.8)      // 水彩透明感
        .vibrance(0.6)                     // 水彩色彩
        .curves([                          // 水彩色调
          [0, 20],
          [64, 80],
          [128, 140],
          [192, 210],
          [255, 250]
        ]);
    }
  
    // 镜像效果
    applyEspejo(originalCanvas) {
      console.log('Applying Espejo filter...');
      // 基础效果
      this.glfxCanvas
        .brightnessContrast(0.1, 1.1)      // 轻微调整
        .vibrance(0.3);                    // 轻微增强色彩
      // 镜像效果需要在canvas层面处理
    }
  
    destroy() {
      if (this.glfxCanvas) {
        this.glfxCanvas = null;
      }
    }
  }
  
  export default GLFXFilterProcessor;