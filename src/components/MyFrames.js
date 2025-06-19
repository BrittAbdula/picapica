import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getAuthHeaders, getUsername } from "../utils/auth";
import FrameService from "../services/frameService";
import Meta from "./Meta";

const MyFrames = () => {
  const navigate = useNavigate();
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [frames, setFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [frameDrawFunctions, setFrameDrawFunctions] = useState({});
  const [loadingQueue, setLoadingQueue] = useState(new Set());
  const [visibleFrames, setVisibleFrames] = useState(new Set());
  const canvasRefs = useRef([]);
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });

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

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setUserAuthenticated(authenticated);
      if (authenticated) {
        setUsername(getUsername() || "");
        loadUserFrames();
      } else {
        // 不强制跳转，让用户看到需要登录的提示
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 管理canvas引用，确保与frames数组长度一致
  useEffect(() => {
    if (canvasRefs.current.length !== frames.length) {
      canvasRefs.current = Array(frames.length).fill().map(() => React.createRef());
    }
  }, [frames.length]);

  // 使用 Intersection Observer 实现懒加载，参考Templates.js
  useEffect(() => {
    if (isLoading || frames.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.frameIndex);
            const frame = frames[index];
            
            if (frame && !visibleFrames.has(frame.id)) {
              // 标记为可见
              setVisibleFrames(prev => new Set(prev.add(frame.id)));
              
              // 异步绘制frame预览
              drawFramePreview(canvasRefs.current[index], frame);
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
    canvasRefs.current.forEach((ref, index) => {
      if (ref && ref.current) {
        ref.current.dataset.frameIndex = index;
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isLoading, frames, visibleFrames]);

  // 实现加载用户frames的功能
  const loadUserFrames = async () => {
    try {
      // 清除已可见状态
      setVisibleFrames(new Set());
      
      const response = await fetch('https://api.picapica.app/api/ai/frames/user', {
        headers: getAuthHeaders()
      });
      const result = await response.json();
      if (result.success) {
        setFrames(result.data);
      }
    } catch (error) {
      console.error('Failed to load frames:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 懒加载单个frame的draw函数，参考Templates.js
  const loadFrameDrawFunction = async (frame) => {
    // 使用完整的frame对象而不是只有code
    const cacheKey = `frame_${frame.id}`;
    
    if (frameDrawFunctions[cacheKey]) {
      return frameDrawFunctions[cacheKey];
    }
  
    if (loadingQueue.has(cacheKey)) {
      while (loadingQueue.has(cacheKey)) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return frameDrawFunctions[cacheKey] || (() => {});
    }
  
    try {
      setLoadingQueue(prev => new Set(prev.add(cacheKey)));
      
      // 检查frame是否有有效的code
      if (!frame.code || typeof frame.code !== 'string' || frame.code.trim() === '') {
        console.warn(`Frame ${frame.name} has no valid code`);
        const fallbackFunction = () => {};
        setFrameDrawFunctions(prev => ({
          ...prev,
          [cacheKey]: fallbackFunction
        }));
        return fallbackFunction;
      }
      
      console.log('Creating draw function for frame:', frame.name);
      const drawFunction = FrameService.createFrameDrawFunction(frame.code);
      
      setFrameDrawFunctions(prev => ({
        ...prev,
        [cacheKey]: drawFunction
      }));
      
      return drawFunction;
    } catch (error) {
      console.error(`Failed to create draw function for frame ${frame.name}:`, error);
      const fallbackFunction = () => {};
      setFrameDrawFunctions(prev => ({
        ...prev,
        [cacheKey]: fallbackFunction
      }));
      return fallbackFunction;
    } finally {
      setLoadingQueue(prev => {
        const newQueue = new Set(prev);
        newQueue.delete(cacheKey);
        return newQueue;
      });
    }
  };

  // 绘制frame预览，参考Templates.js
  const drawFramePreview = async (canvasRef, frame) => {
    if (!canvasRef.current || !frame) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 保持与 Templates.js 相同的比例
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
      const drawFunction = await loadFrameDrawFunction(frame);
      
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
            await drawFunction(
              ctx,
              0,  // 相对于当前图片区域的x坐标
              0,  // 相对于当前图片区域的y坐标
              imgWidth,
              imgHeight
            );
          } catch (error) {
            console.error(`Error applying frame in preview:`, error);
          }
          // 恢复绘图状态
          ctx.restore();
        }
      }
    } catch (error) {
      console.error(`Failed to load and apply frame:`, error);
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
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    ctx.font = `${Math.round(10 * PREVIEW_WIDTH / 480)}px Arial`;
    ctx.fillText(
      date,
      PREVIEW_WIDTH / 2,
      textY + 10
    );

    // 标记frame为已渲染，隐藏加载动画
    setVisibleFrames(prev => new Set(prev.add(frame.id)));
  };

  // 使用frame功能，与Templates保持一致的导航方式
  const handleUseFrame = (frame) => {
    // Store the frame temporarily for photobooth to use
    localStorage.setItem("generatedFrame", JSON.stringify(frame));
    localStorage.setItem("selectedFrame", "generated"); // 特殊标识符表示使用生成的框架
    
    // Navigate to photobooth page
    navigate("/photobooth", { 
      state: { 
        frameType: "generated",
        generatedFrame: frame 
      } 
    });
  };

  if (isLoading) {
    return (
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
        <p>Loading your custom frames...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!userAuthenticated) {
    return (
      <>
        <Meta
          title="My AI Generated Frames - PicaPica"
          description="View and manage your custom AI-generated photo booth frames"
          canonicalUrl="/my-frames"
        />
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <h1 style={{ marginBottom: "20px", color: "#333" }}>My Frames</h1>
          <div style={{
            padding: "30px",
            backgroundColor: "#fff5f5",
            borderRadius: "12px",
            border: "1px solid #fed7d7"
          }}>
            <p style={{ 
              color: "#c53030", 
              fontSize: "18px", 
              marginBottom: "20px" 
            }}>
              🔒 Please login to view your custom frames
            </p>
            <p style={{ 
              color: "#666", 
              marginBottom: "25px" 
            }}>
              You need to be logged in to access your AI-generated frames collection.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#2c5282"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#3182ce"}
            >
              Go to Homepage & Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta
        title="My AI Generated Frames - PicaPica"
        description="View and manage your custom AI-generated photo booth frames"
        canonicalUrl="/my-frames"
      />

      <div className="my-frames-container" style={{ 
        padding: "20px", 
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          My AI Generated Frames
        </h1>
        
        <p style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px",
          color: "#666",
          fontSize: "16px",
          lineHeight: "1.6"
        }}>
          Welcome back, {username}! Here are your custom AI-generated frames.
        </p>

        {/* 操作按钮 */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/frame-maker")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#2c5282"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#3182ce"}
            >
              ➕ Create New Frame
            </button>
            <button
              onClick={() => navigate("/frames")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#38a169",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#2f855a"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#38a169"}
            >
              🔍 Browse All Frames
            </button>
          </div>
        </div>

        {/* Frames 列表 */}
        {frames.length === 0 ? (
          <div style={{
            textAlign: "center",
            margin: "40px auto",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            border: "2px dashed #dee2e6"
          }}>
            <h3 style={{ color: "#6c757d", marginBottom: "15px" }}>
              🎨 No Custom Frames Yet
            </h3>
            <p style={{ color: "#6c757d", marginBottom: "20px" }}>
              You haven't created any custom frames yet. Create your first frame with AI Frame Maker!
            </p>
            <button
              onClick={() => navigate("/frame-maker")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#2c5282"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#3182ce"}
            >
              Create Your First Frame
            </button>
          </div>
        ) : (
          <div className="my-frames-grid" style={{
            display: "grid",
            gridTemplateColumns: screenSize.isDesktop
              ? "repeat(6, 1fr)"
              : (screenSize.isTablet ? "repeat(3, 1fr)" : "repeat(2, 1fr)"),
            gap: screenSize.isDesktop ? "20px" : "15px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 10px",
            marginBottom: "40px"
          }}>
                         {frames.map((frame, index) => (
               <div 
                 key={frame.id} 
                 className="my-frame-item"
                 onClick={() => handleUseFrame(frame)}
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
                 }}>
                 {/* Frame 预览区域 */}
                 <div style={{ position: "relative" }}>
                   <canvas
                     ref={canvasRefs.current[index]}
                     width={300}
                     height={Math.round(300 * 1450/480)}
                     style={{
                       width: "100%",
                       height: "auto",
                       display: "block",
                       objectFit: "contain",
                       backgroundColor: "#f8f8f8"
                     }}
                     aria-label={`${frame.name} frame preview`}
                   />
                   
                   {/* 如果frame还没有被渲染，显示加载提示 */}
                   {!visibleFrames.has(frame.id) && (
                     <div style={{
                       position: "absolute",
                       top: "50%",
                       left: "50%",
                       transform: "translate(-50%, -50%)",
                       color: "#999",
                       fontSize: "14px",
                       textAlign: "center",
                       pointerEvents: "none"
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

                   {/* 使用次数标签 */}
                   <div style={{
                     position: "absolute",
                     bottom: "10px",
                     right: "10px",
                     backgroundColor: "rgba(0,0,0,0.7)",
                     color: "white",
                     padding: "4px 8px",
                     borderRadius: "4px",
                     fontSize: "12px"
                   }}>
                     Used {frame.usage_count} times
                   </div>
                 </div>
                
                {/* Frame 信息 */}
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
                    {frame.name}
                  </h3>
                  
                  {frame.description && (
                    <p style={{
                      margin: "0 0 8px 0",
                      fontSize: "12px",
                      color: "#666",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {frame.description}
                    </p>
                  )}
                  
                  <div style={{
                    fontSize: "10px",
                    color: "#999",
                    marginBottom: "8px"
                  }}>
                    {new Date(frame.created_at).toLocaleDateString()}
                    {frame.is_public && (
                      <span style={{
                        marginLeft: "8px",
                        backgroundColor: "#e6fffa",
                        color: "#047857",
                        padding: "1px 4px",
                        borderRadius: "3px",
                        fontSize: "9px"
                      }}>
                        PUBLIC
                      </span>
                    )}
                  </div>
                  
                  {/* 操作按钮 - 简化 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseFrame(frame);
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 12px",
                      backgroundColor: "#3182ce",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#2b6cb0"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#3182ce"}
                  >
                    Use Frame
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 功能说明 */}
        <div style={{
          marginTop: "50px",
          padding: "30px",
          backgroundColor: "#f0f7ff",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h2 style={{ marginTop: 0, color: "#2c5282", marginBottom: "20px" }}>
            Available Features
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth >= 768 ? "repeat(3, 1fr)" : "1fr",
            gap: "20px",
            marginTop: "30px"
          }}>
            <div style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ color: "#2d3748", marginBottom: "10px" }}>📚 Frame Library</h4>
              <p style={{ color: "#4a5568", fontSize: "14px", margin: 0 }}>
                View all your AI-generated frames in one organized collection
              </p>
            </div>
            <div style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ color: "#2d3748", marginBottom: "10px" }}>📸 Quick Use</h4>
              <p style={{ color: "#4a5568", fontSize: "14px", margin: 0 }}>
                Instantly use any saved frame in the photo booth with one click
              </p>
            </div>
            <div style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ color: "#2d3748", marginBottom: "10px" }}>📊 Usage Stats</h4>
              <p style={{ color: "#4a5568", fontSize: "14px", margin: 0 }}>
                Track how often your frames are used in photo sessions
              </p>
            </div>
          </div>
          
          {/* 更多功能即将推出 */}
          <div style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "rgba(49, 130, 206, 0.1)",
            borderRadius: "8px",
            border: "1px dashed #3182ce"
          }}>
            <h3 style={{ color: "#2c5282", marginBottom: "10px", fontSize: "16px" }}>
              🚀 Coming Soon
            </h3>
            <p style={{ color: "#4a5568", fontSize: "14px", margin: 0 }}>
              Frame editing, sharing with community, and advanced management features
            </p>
          </div>
        </div>
        
        {/* CSS动画样式 */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default MyFrames;