import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FRAMES from "./Frames"; // 直接导入本地 Frames
import Meta from "./Meta";

const TemplateTest = () => {
  const navigate = useNavigate();
  const templateRefs = useRef([]);
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });
  const [availableFrames, setAvailableFrames] = useState([]);
  const [frameDrawFunctions, setFrameDrawFunctions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visibleFrames, setVisibleFrames] = useState(new Set());

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 加载本地 Frames.js 中的frames
  useEffect(() => {
    const loadLocalFrames = () => {
      try {
        setIsLoading(true);
        console.log(`[TemplateTest] Loading frames from local Frames.js`);
        
        // 直接从本地 FRAMES 对象创建 frames 列表
        const framesList = Object.keys(FRAMES)
          .filter(key => key !== "none") // 过滤掉'none'类型的frame
          .map(key => ({
            name: key,
            description: FRAMES[key].description || `${key} frame`,
            active: true,
            id: key
          }));
        
        setAvailableFrames(framesList);
        console.log(`[TemplateTest] Loaded ${framesList.length} local frames:`, framesList.map(f => f.name));
      } catch (error) {
        console.error('Failed to load local frames:', error);
        // 设置默认frames作为fallback
        setAvailableFrames([
          { name: 'pastel', description: 'Pastel theme' },
          { name: 'retro', description: 'Retro theme' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocalFrames();
  }, []);

  // 获取frame类型数组
  const frameTypes = availableFrames.map(frame => frame.name);

  // Add canvas refs for each frame
  if (templateRefs.current.length !== frameTypes.length) {
    templateRefs.current = Array(frameTypes.length).fill().map(() => React.createRef());
  }

  // 直接从本地 FRAMES 获取 draw 函数
  const getLocalFrameDrawFunction = (frameType) => {
    if (frameDrawFunctions[frameType]) {
      return frameDrawFunctions[frameType]; // 已缓存
    }

    try {
      console.log(`[TemplateTest] Getting draw function for ${frameType} from local Frames.js`);
      
      if (FRAMES[frameType] && FRAMES[frameType].draw) {
        const drawFunction = FRAMES[frameType].draw;
        
        // 缓存到state中
        setFrameDrawFunctions(prev => ({
          ...prev,
          [frameType]: drawFunction
        }));
        
        return drawFunction;
      } else {
        console.warn(`[TemplateTest] No draw function found for ${frameType}`);
        const fallbackFunction = () => {};
        
        // 也缓存失败的结果，避免重复请求
        setFrameDrawFunctions(prev => ({
          ...prev,
          [frameType]: fallbackFunction
        }));
        
        return fallbackFunction;
      }
    } catch (error) {
      console.error(`Failed to get draw function for ${frameType}:`, error);
      const fallbackFunction = () => {};
      
      setFrameDrawFunctions(prev => ({
        ...prev,
        [frameType]: fallbackFunction
      }));
      
      return fallbackFunction;
    }
  };

  // Function to draw a template preview
  const drawTemplate = async (canvasRef, frameType) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 保持与 PhotoPreview.js 相同的比例
    const PREVIEW_WIDTH = 300;
    const ASPECT_RATIO = 1450/480; // ≈ 3.02
    const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH * ASPECT_RATIO);

    // 设置画布尺寸
    canvas.width = PREVIEW_WIDTH;
    canvas.height = PREVIEW_HEIGHT;

    // 计算预览中的图片尺寸和间距
    const borderSize = Math.round((40 * PREVIEW_WIDTH) / 480); // 比例缩放边框
    const imgWidth = PREVIEW_WIDTH - (borderSize * 2);
    const imgHeight = Math.round((300 * PREVIEW_WIDTH) / 480);
    const photoSpacing = Math.round((20 * PREVIEW_WIDTH) / 480);

    // 填充背景
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制4张预览图片
    for (let i = 0; i < 4; i++) {
      const yOffset = borderSize + (imgHeight + photoSpacing) * i;
      
      // 绘制占位符背景
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(
        borderSize,
        yOffset,
        imgWidth,
        imgHeight
      );

      // 添加占位符文本
      ctx.fillStyle = "#999999";
      ctx.font = `${Math.round(14 * PREVIEW_WIDTH / 480)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(
        "Photo Preview",
        PREVIEW_WIDTH / 2,
        yOffset + imgHeight / 2
      );
    }

    // 直接获取并应用frame的draw函数
    try {
      const drawFunction = getLocalFrameDrawFunction(frameType);
      
      if (drawFunction && typeof drawFunction === "function") {
        // 重新绘制每张照片的frame
        for (let i = 0; i < 4; i++) {
          const yOffset = borderSize + (imgHeight + photoSpacing) * i;
          
          // 保存当前绘图状态
          ctx.save();
          // 将绘图上下文移动到当前图片的位置
          ctx.translate(borderSize, yOffset);
          // 在当前图片区域绘制边框
                      try {
            // 本地 draw 函数不需要 await，直接调用
            drawFunction(
              ctx,
              0,  // 相对于当前图片区域的x坐标
              0,  // 相对于当前图片区域的y坐标
              imgWidth,
              imgHeight
            );
          } catch (error) {
            console.error(`Error applying frame ${frameType} in template:`, error);
          }
          // 恢复绘图状态
          ctx.restore();
        }
      }
    } catch (error) {
      console.error(`Failed to load and apply frame ${frameType}:`, error);
    }

    // 添加底部签名区域
    const footerY = borderSize + (imgHeight + photoSpacing) * 4;
    const footerHeight = PREVIEW_HEIGHT - footerY - borderSize;
    
    // 添加优雅的分隔线
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(borderSize, footerY - 2, imgWidth, 1);

    // 添加签名文本
    ctx.fillStyle = "#718096";
    ctx.font = `${Math.round(12 * PREVIEW_WIDTH / 480)}px Arial`;
    ctx.textAlign = "center";
    
    // 计算文本位置
    const textY = footerY + footerHeight / 2;
    
    // 添加照片条标识
    ctx.fillText(
      "Picapica.app",
      PREVIEW_WIDTH / 2,
      textY - 10
    );
    
    // 添加日期占位符
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.font = `${Math.round(10 * PREVIEW_WIDTH / 480)}px Arial`;
    ctx.fillText(
      date,
      PREVIEW_WIDTH / 2,
      textY + 10
    );
  };

  // 使用 Intersection Observer 实现瀑布流加载
  useEffect(() => {
    if (isLoading || frameTypes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.frameIndex);
            const frameType = frameTypes[index];
            
            if (frameType && !visibleFrames.has(frameType)) {
              // 标记为可见
              setVisibleFrames(prev => new Set(prev.add(frameType)));
              
              // 异步绘制模板
              drawTemplate(templateRefs.current[index], frameType);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '100px', // 提前100px开始加载
        threshold: 0.1
      }
    );

    // 观察所有canvas元素
    templateRefs.current.forEach((ref, index) => {
      if (ref && ref.current) {
        ref.current.dataset.frameIndex = index;
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isLoading, frameTypes, visibleFrames]);

  // Navigate to photobooth when template is selected
  const handleTemplateClick = (frameType) => {
    localStorage.setItem("selectedFrame", frameType);
    navigate("/photobooth", { state: { frameType } });
  };

  // 清除本地缓存功能
  const clearCache = () => {
    setFrameDrawFunctions({});
    setVisibleFrames(new Set());
    console.log('[TemplateTest] Local cache cleared');
  };

  return (
    <>
      <Meta
        title="Photo Booth Frames Test - Local Frames.js"
        description="Test page for loading photo booth frames from local Frames.js file. Development and testing environment."
        canonicalUrl="/template-test"
      />

      <div className="photo-booth-frames-container" style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          🧪 Photo Booth Frames Test
        </h1>

        {/* 测试控制面板 */}
        <div style={{
          backgroundColor: "#f8f9fa",
          border: "2px solid #e9ecef",
          borderRadius: "8px",
          padding: "20px",
          margin: "0 auto 30px",
          maxWidth: "800px",
          textAlign: "center"
        }}>
          <h3 style={{ 
            margin: "0 0 15px", 
            color: "#495057",
            fontSize: "18px"
          }}>
            📄 本地 Frames.js 测试页面
          </h3>
          
          <div style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb"
          }}>
            此页面专门用于测试本地 Frames.js 文件中的相框功能
          </div>

          {/* 统计信息 */}
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "6px",
              border: "1px solid #dee2e6"
            }}>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>数据源</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#28a745" }}>
                本地 Frames.js
              </div>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "6px",
              border: "1px solid #dee2e6"
            }}>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>加载的Frames数量</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#495057" }}>
                {availableFrames.length}
              </div>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "6px",
              border: "1px solid #dee2e6"
            }}>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>已渲染预览</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#495057" }}>
                {visibleFrames.size}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={clearCache}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              清除缓存
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              重新加载页面
            </button>
          </div>
        </div>

        <p style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px",
          color: "#666"
        }}>
          这是测试页面，专门用于验证从本地 Frames.js 文件加载相框的功能。所有相框都来源于本地文件，便于开发和调试。
        </p>

        {isLoading ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666"
          }}>
            <div style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #FF69B4",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "20px"
            }}></div>
            <p>Loading photo booth frames...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div className="photo-booth-frames-grid" style={{
            display: "grid",
            gridTemplateColumns: screenSize.isDesktop
              ? "repeat(6, 1fr)"
              : (screenSize.isTablet ? "repeat(3, 1fr)" : "repeat(2, 1fr)"),
            gap: screenSize.isDesktop ? "20px" : "15px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 10px"
          }}>
            {frameTypes.map((frameType, index) => {
              const frameInfo = availableFrames.find(f => f.name === frameType);
              return (
                <div
                  key={frameType}
                  className="photo-booth-frame-item"
                  onClick={() => handleTemplateClick(frameType)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    touchAction: "manipulation",
                    border: "2px solid #28a745" // 绿色边框表示本地数据源
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <canvas
                      ref={templateRefs.current[index]}
                      width={300}
                      height={Math.round(300 * 1450/480)}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        objectFit: "contain",
                        backgroundColor: "#f8f8f8"
                      }}
                      aria-label={`${frameType} photo booth frame preview`}
                    />
                    
                    {/* 如果frame还没有被渲染，显示加载提示 */}
                    {!visibleFrames.has(frameType) && (
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#999",
                        fontSize: "14px",
                        textAlign: "center",
                        pointer: "none"
                      }}>
                        <div style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #f3f3f3",
                          borderTop: "2px solid #FF69B4",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          margin: "0 auto 8px"
                        }}></div>
                        Loading Preview...
                      </div>
                    )}

                    {/* 数据源标记 */}
                    <div style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "10px",
                      fontWeight: "bold"
                    }}>
                      LOCAL
                    </div>
                  </div>
                  <div style={{
                    padding: "15px",
                    borderTop: "1px solid #f0f0f0",
                    textAlign: "center",
                    marginTop: "auto"
                  }}>
                    <h3 style={{
                      margin: "0 0 5px",
                      fontSize: "14px",
                      color: "#333"
                    }}>
                      {frameInfo ? frameInfo.name : frameType.charAt(0).toUpperCase() + frameType.slice(1)}
                    </h3>
                    <p style={{
                      margin: "0",
                      fontSize: "12px",
                      color: "#666"
                    }}>
                      {frameInfo ? frameInfo.description : 'No description'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 测试说明 */}
        <div className="test-info" style={{
          maxWidth: "800px",
          margin: "50px auto 0",
          padding: "20px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "8px"
        }}>
          <h2 style={{ marginTop: 0, color: "#856404" }}>测试说明</h2>
          <ul style={{ color: "#856404", lineHeight: "1.6" }}>
            <li>此页面专门从本地 <strong>Frames.js</strong> 文件加载相框，用于开发和测试</li>
            <li>所有相框都有绿色边框和 "LOCAL" 标记，表示来自本地文件</li>
            <li>不依赖 frameService，直接使用本地 FRAMES 对象</li>
            <li>点击相框可以跳转到拍照页面测试实际功能</li>
            <li>使用浏览器开发者工具查看控制台日志获取详细调试信息</li>
            <li>与 <strong>/templates</strong> 页面的区别：该页面使用 API 数据，此页面使用本地数据</li>
          </ul>
        </div>

        {/* 回到正式页面链接 */}
        <div style={{
          textAlign: "center",
          margin: "30px auto",
          paddingTop: "20px",
          borderTop: "1px solid #eaeaea"
        }}>
          <a
            href="/templates"
            style={{
              display: "inline-block",
              color: "#007bff",
              fontSize: "16px",
              textDecoration: "none",
              padding: "10px 20px",
              border: "1px solid #007bff",
              borderRadius: "4px",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#007bff";
            }}
          >
            ← 返回正式模板页面
          </a>
        </div>
      </div>
    </>
  );
};

export default TemplateTest; 