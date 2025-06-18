import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FrameService from "../services/frameService";
import Meta from "./Meta";

const Templates = () => {
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
  const [loadingQueue, setLoadingQueue] = useState(new Set());

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

  // 加载可用的frames（仅列表，不加载draw函数）
  useEffect(() => {
    const loadFramesList = async () => {
      try {
        setIsLoading(true);
        const frames = await FrameService.getAllFrames();
        // 过滤掉'none'类型的frame
        const filteredFrames = frames.filter(frame => frame.name !== "none");
        setAvailableFrames(filteredFrames);
      } catch (error) {
        console.error('Failed to load frames:', error);
        // 设置默认frames作为fallback
        setAvailableFrames([
          { name: 'pastel', description: 'Pastel theme' },
          { name: 'retro', description: 'Retro theme' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadFramesList();
  }, []);

  // 获取frame类型数组
  const frameTypes = availableFrames.map(frame => frame.name);

  // Add canvas refs for each frame
  if (templateRefs.current.length !== frameTypes.length) {
    templateRefs.current = Array(frameTypes.length).fill().map(() => React.createRef());
  }

  // 懒加载单个frame的draw函数
  const loadFrameDrawFunction = async (frameType) => {
    if (frameDrawFunctions[frameType]) {
      return frameDrawFunctions[frameType]; // 已缓存
    }

    if (loadingQueue.has(frameType)) {
      // 如果正在加载，等待加载完成
      while (loadingQueue.has(frameType)) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return frameDrawFunctions[frameType] || (() => {});
    }

    try {
      // 添加到加载队列
      setLoadingQueue(prev => new Set(prev.add(frameType)));
      
      const drawFunction = await FrameService.getFrameDrawFunction(frameType);
      
      // 缓存到state中
      setFrameDrawFunctions(prev => ({
        ...prev,
        [frameType]: drawFunction
      }));
      
      return drawFunction;
    } catch (error) {
      console.error(`Failed to lazy load draw function for ${frameType}:`, error);
      const fallbackFunction = () => {};
      
      // 也缓存失败的结果，避免重复请求
      setFrameDrawFunctions(prev => ({
        ...prev,
        [frameType]: fallbackFunction
      }));
      
      return fallbackFunction;
    } finally {
      // 从加载队列中移除
      setLoadingQueue(prev => {
        const newQueue = new Set(prev);
        newQueue.delete(frameType);
        return newQueue;
      });
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

    // 异步加载并应用frame的draw函数
    try {
      const drawFunction = await loadFrameDrawFunction(frameType);
      
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
      "PicaPica.app",
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

  return (
    <>
      <Meta
        title="Photo Booth Frames & Templates "
        description="Choose from our collection of beautiful photo booth frames for your next event. Customizable photo booth frame templates for your special moment."
        canonicalUrl="/templates"
      />

      <div className="photo-booth-frames-container" style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Photo Booth Frames Collection</h1>

        <p style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px",
          color: "#666"
        }}>
          Browse our selection of premium photo booth frames for your next event. Each frame is designed to enhance your photo booth experience and create memorable keepsakes.
        </p>

        {/* AI Frame Maker Banner */}
        <div style={{
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
          margin: "0 auto 40px",
          maxWidth: "800px",
          color: "white",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
        }}>
          <h2 style={{ 
            margin: "0 0 15px", 
            fontSize: "28px", 
            fontWeight: "bold" 
          }}>
            ✨ Create Your Own Frame with AI
          </h2>
          <p style={{ 
            margin: "0 0 25px", 
            fontSize: "16px", 
            opacity: "0.9" 
          }}>
            Can't find the perfect frame? Describe your vision and let our AI create a custom frame just for you!
          </p>
          <button
            onClick={() => navigate("/frame-maker")}
            style={{
              padding: "15px 30px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "50px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            🎨 Try AI Frame Maker
          </button>
        </div>

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
                    touchAction: "manipulation" // Improves touch experience on mobile
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
                      {frameInfo ? frameInfo.description : frameType.charAt(0).toUpperCase() + frameType.slice(1)}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="photo-booth-frames-info" style={{
          maxWidth: "800px",
          margin: "50px auto 0",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px"
        }}>
          <h2 style={{ marginTop: 0 }}>About Our Photo Booth Frames</h2>
          <p>
            Our photo booth frames are designed to enhance your event photos with beautiful, customizable designs.
            Perfect for weddings, corporate events, birthday parties, and any special occasion.
            These digital photo booth frames help create memorable keepsakes for you and your guests.
          </p>
          <p>
            Simply select your favorite photo booth frame design from our collection and proceed to the photo booth
            to capture stunning photos with your chosen frame.
          </p>
        </div>

        {/* Request new frames section */}
        <div className="request-photo-booth-frames" style={{
          maxWidth: "800px",
          margin: "50px auto 30px",
          padding: "30px",
          backgroundColor: "#f0f7ff",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
        }}>
          <h2 style={{
            marginTop: 0,
            color: "#2c5282",
            fontSize: "24px"
          }}>
            Can't Find the Perfect Photo Booth Frame?
          </h2>

          <p style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#4a5568",
            marginBottom: "25px"
          }}>
            We're constantly adding new photo booth frames to our collection based on user feedback.
            If you have a specific frame design in mind for your event or occasion, we'd love to hear about it!
          </p>

          <p style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#4a5568",
            marginBottom: "25px"
          }}>
            Complete our quick survey to tell us what type of photo booth frames you'd like to see.
            We aim to implement popular requests as quickly as possible.
          </p>

          <a
            href="https://tally.so/r/mB0Wl4"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#3182ce",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              transition: "background-color 0.3s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2b6cb0"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3182ce"}
          >
            Request New Photo Booth Frames
          </a>

          <p style={{
            fontSize: "14px",
            marginTop: "20px",
            color: "#718096"
          }}>
            Your feedback helps us create better photo booth frame designs for everyone!
          </p>
        </div>
        {/* Creem link */}
        <div style={{
          textAlign: "center",
          margin: "30px auto",
          paddingTop: "20px",
          borderTop: "1px solid #eaeaea"
        }}>
          <a
            href="https://www.creem.io/bip/picapica"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              color: "#666",
              fontSize: "14px",
              textDecoration: "none"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#3182ce"}
            onMouseOut={(e) => e.currentTarget.style.color = "#666"}
          >
            Built in Public with Creem
          </a>
        </div>
      </div>
    </>
  );
};

export default Templates;