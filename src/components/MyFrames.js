import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FrameService from "../services/frameService";
import Meta from "./Meta";
import { isAuthenticated, getAuthHeaders, getUsername } from "../utils/auth";

const MyFrames = () => {
  const navigate = useNavigate();
  const templateRefs = useRef([]);
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });
  const [userFrames, setUserFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleFrames, setVisibleFrames] = useState(new Set());
  const [loadingQueue, setLoadingQueue] = useState(new Set());
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

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

  // 检查用户认证状态
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setUserAuthenticated(authenticated);
      if (authenticated) {
        setUsername(getUsername() || "");
      }
    };

    checkAuth();
    
    // 监听storage变化
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // 加载用户制作的frames
  useEffect(() => {
    const loadUserFrames = async () => {
      if (!userAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        
        const response = await fetch('https://api.picapica.app/api/ai/frames/user', {
          method: 'GET',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Please login to view your frames");
            setUserAuthenticated(false);
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setUserFrames(result.data || []);
        } else {
          setError(result.message || "Failed to load your frames");
        }
      } catch (error) {
        console.error('Failed to load user frames:', error);
        setError("Failed to load your frames. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFrames();
  }, [userAuthenticated]);

  // Add canvas refs for each frame
  if (templateRefs.current.length !== userFrames.length) {
    templateRefs.current = Array(userFrames.length).fill().map(() => React.createRef());
  }

  // 使用用户frame的code创建draw函数并绘制预览
  const drawFramePreview = async (canvasRef, frameData) => {
    if (!canvasRef.current || !frameData) return;

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

    // 应用用户生成的frame代码
    try {
      if (frameData.code) {
        const drawFunction = FrameService.createFrameDrawFunction(frameData.code);
        
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
              console.error(`Error applying user frame ${frameData.name}:`, error);
            }
            // 恢复绘图状态
            ctx.restore();
          }
        }
      }
    } catch (error) {
      console.error(`Failed to load and apply user frame ${frameData.name}:`, error);
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
    
    // 添加创建日期
    const date = new Date(frameData.created_at).toLocaleDateString('en-US', {
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
    if (isLoading || userFrames.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.frameIndex);
            const frameData = userFrames[index];
            
            if (frameData && !visibleFrames.has(frameData.id)) {
              // 标记为可见
              setVisibleFrames(prev => new Set(prev.add(frameData.id)));
              
              // 异步绘制模板
              drawFramePreview(templateRefs.current[index], frameData);
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
  }, [isLoading, userFrames, visibleFrames]);

  // Navigate to photobooth when frame is selected
  const handleFrameClick = (frameData) => {
    // Store the frame data temporarily for photobooth to use
    localStorage.setItem("generatedFrame", JSON.stringify(frameData));
    localStorage.setItem("selectedFrame", "generated");
    navigate("/photobooth", { 
      state: { 
        frameType: "generated",
        generatedFrame: frameData 
      } 
    });
  };

  // 删除frame
  const handleDeleteFrame = async (frameId, frameName) => {
    if (!window.confirm(`Are you sure you want to delete "${frameName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`https://api.picapica.app/api/ai/frames/${frameId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // 从本地状态中移除deleted frame
        setUserFrames(prev => prev.filter(frame => frame.id !== frameId));
        setVisibleFrames(prev => {
          const newSet = new Set(prev);
          newSet.delete(frameId);
          return newSet;
        });
      } else {
        alert("Failed to delete frame. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting frame:', error);
      alert("Failed to delete frame. Please try again.");
    }
  };

  // 如果用户未登录，显示登录提示
  if (!userAuthenticated) {
    return (
      <>
        <Meta
          title="My Custom Frames - Picapica Photo Booth"
          description="View and manage your custom AI-generated photo booth frames."
          canonicalUrl="/my-frames"
        />
        
        <div className="my-frames-container" style={{ padding: "20px", textAlign: "center" }}>
          <h1>My Custom Frames</h1>
          <div style={{
            maxWidth: "600px",
            margin: "50px auto",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            color: "#666"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔒</div>
            <h2 style={{ color: "#333", marginBottom: "15px" }}>Login Required</h2>
            <p style={{ marginBottom: "25px", lineHeight: "1.6" }}>
              Please log in to view and manage your custom AI-generated frames.
            </p>
            <button
              onClick={() => navigate("/templates")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginRight: "15px"
              }}
            >
              Browse Templates
            </button>
            <button
              onClick={() => navigate("/frame-maker")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#38a169",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Create Frame
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Meta
        title="My Custom Frames - Picapica Photo Booth"
        description="View and manage your custom AI-generated photo booth frames."
        canonicalUrl="/my-frames"
      />

      <div className="my-frames-container" style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          My Custom Frames
        </h1>

        <p style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px",
          color: "#666"
        }}>
          Welcome back, <strong>{username}</strong>! Here are all the custom frames you've created with our AI Frame Maker.
        </p>

        {/* Create New Frame Button */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <button
            onClick={() => navigate("/frame-maker")}
            style={{
              padding: "15px 30px",
              backgroundColor: "#38a169",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(56, 161, 105, 0.2)"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#2f855a";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#38a169";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ✨ Create New Frame
          </button>
        </div>

        {error && (
          <div style={{
            maxWidth: "800px",
            margin: "0 auto 30px",
            padding: "15px",
            backgroundColor: "#fed7d7",
            color: "#c53030",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

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
            <p>Loading your custom frames...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : userFrames.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            maxWidth: "600px",
            margin: "0 auto",
            color: "#666"
          }}>
            <div style={{ fontSize: "72px", marginBottom: "20px", opacity: "0.5" }}>🎨</div>
            <h2 style={{ color: "#333", marginBottom: "15px" }}>No Custom Frames Yet</h2>
            <p style={{ marginBottom: "30px", lineHeight: "1.6" }}>
              You haven't created any custom frames yet. Use our AI Frame Maker to create your first personalized photo booth frame!
            </p>
            <button
              onClick={() => navigate("/frame-maker")}
              style={{
                padding: "15px 30px",
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginRight: "15px"
              }}
            >
              🎨 Create Your First Frame
            </button>
            <button
              onClick={() => navigate("/templates")}
              style={{
                padding: "15px 30px",
                backgroundColor: "#718096",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Browse Templates
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
            padding: "0 10px"
          }}>
            {userFrames.map((frameData, index) => (
              <div
                key={frameData.id}
                className="my-frame-item"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative"
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
                      backgroundColor: "#f8f8f8",
                      cursor: "pointer"
                    }}
                    onClick={() => handleFrameClick(frameData)}
                    aria-label={`${frameData.name} frame preview`}
                  />
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFrame(frameData.id, frameData.name);
                    }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      color: "#e53e3e",
                      opacity: "0.8",
                      transition: "opacity 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = "1"}
                    onMouseLeave={(e) => e.target.style.opacity = "0.8"}
                    title="Delete frame"
                  >
                    ×
                  </button>
                  
                  {/* 如果frame还没有被渲染，显示加载提示 */}
                  {!visibleFrames.has(frameData.id) && (
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
                </div>
                
                <div style={{
                  padding: "15px",
                  borderTop: "1px solid #f0f0f0",
                  textAlign: "center",
                  marginTop: "auto"
                }}>
                  <h3 style={{
                    margin: "0 0 8px",
                    fontSize: "16px",
                    color: "#333",
                    fontWeight: "600"
                  }}>
                    {frameData.name}
                  </h3>
                  
                  {frameData.description && (
                    <p style={{
                      margin: "0 0 8px",
                      fontSize: "12px",
                      color: "#666",
                      lineHeight: "1.4"
                    }}>
                      {frameData.description}
                    </p>
                  )}
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "8px"
                  }}>
                    <span>
                      Created: {new Date(frameData.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      Uses: {frameData.usage_count || 0}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFrameClick(frameData);
                    }}
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#3182ce",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      width: "100%"
                    }}
                  >
                    Use in Photo Booth
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info section */}
        <div className="my-frames-info" style={{
          maxWidth: "800px",
          margin: "50px auto 0",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px"
        }}>
          <h2 style={{ marginTop: 0 }}>About Your Custom Frames</h2>
          <p>
            These are your personalized photo booth frames created using our AI Frame Maker.
            Each frame is unique and generated based on your specific descriptions and preferences.
          </p>
          <p>
            Click on any frame to use it in the photo booth, or create new ones to expand your collection.
            Your frames are saved to your account and can be used anytime.
          </p>
        </div>
      </div>
    </>
  );
};

export default MyFrames;
