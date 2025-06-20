import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getAuthHeaders, getUsername } from "../utils/auth";
import FrameService from "../services/frameService";
import Meta from "./Meta";
import DebugHelper from "../utils/debugHelper";
import FrameRenderTest from "../utils/frameRenderTest";
import simpleFrameTest from "../utils/simpleFrameTest";

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

    // 🔥 在生产环境中记录环境信息，帮助调试
    DebugHelper.logEnvironmentInfo();
    
    // 🧪 运行诊断测试
    if (process.env.NODE_ENV === 'production') {
      FrameRenderTest.runAllTests().then(results => {
        console.log('🧪 Frame render test results:', results);
        
        // 额外测试：直接frame渲染
        simpleFrameTest.testWithSimpleFrame().then(result => {
          console.log('🧪 Simple frame test result:', result);
        });
      });
    }
    
    checkAuth();
  }, []);

  // 管理canvas引用，确保与frames数组长度一致
  useEffect(() => {
    if (canvasRefs.current.length !== frames.length) {
      canvasRefs.current = Array(frames.length).fill().map(() => React.createRef());
      console.log(`🔧 Created ${frames.length} canvas refs`);
    }
  }, [frames.length]);

  // 🔥 添加canvas元素就绪检查
  useEffect(() => {
    if (frames.length === 0) return;

    const checkCanvasReady = () => {
      let readyCount = 0;
      canvasRefs.current.forEach((ref, index) => {
        if (ref?.current && frames[index]) {
          readyCount++;
        }
      });
      
      console.log(`🔍 Canvas readiness check: ${readyCount}/${frames.length} canvases ready`);
      
      if (readyCount === frames.length) {
        console.log('✅ All canvases are ready!');
      } else if (readyCount > 0) {
        console.log(`⏳ ${readyCount} canvases ready, ${frames.length - readyCount} still waiting...`);
      }
      
      return readyCount;
    };

    // 立即检查一次
    const readyNow = checkCanvasReady();
    
    // 如果有canvas准备就绪，立即触发渲染
    if (readyNow > 0) {
      console.log('🎯 Some canvases ready, triggering immediate rendering');
      handleCanvasReadyRendering();
    }
    
    // 如果不是全部就绪，继续检查
    if (readyNow < frames.length) {
      const checkInterval = setInterval(() => {
        const readyCount = checkCanvasReady();
        if (readyCount >= frames.length) {
          console.log('🎉 All canvases became ready!');
          handleCanvasReadyRendering(); // 确保所有准备就绪时也触发渲染
          clearInterval(checkInterval);
        }
      }, 200); // 每200ms检查一次

      // 10秒后停止检查
      setTimeout(() => {
        clearInterval(checkInterval);
        console.log('⏰ Canvas readiness check timeout');
      }, 10000);

      return () => clearInterval(checkInterval);
    }
  }, [frames.length]);

  // 🔥 修复时序问题：确保在canvas DOM元素就绪后再设置Intersection Observer
  useEffect(() => {
    if (isLoading || frames.length === 0) return;

    // 检查是否支持Intersection Observer
    const supportsIntersectionObserver = typeof IntersectionObserver !== 'undefined';
    console.log('🔍 Intersection Observer support:', supportsIntersectionObserver);

    if (supportsIntersectionObserver) {
      // 🔥 关键修复：延迟设置Intersection Observer，确保DOM元素就绪
      const setupObserver = () => {
        const observer = new IntersectionObserver(
          (entries) => {
            console.log('📡 Intersection Observer triggered with', entries.length, 'entries');
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.frameIndex);
                const frame = frames[index];
                
                if (frame && !visibleFrames.has(frame.id)) {
                  console.log(`📡 IO: Rendering frame ${frame.name} at index ${index}`);
                  requestAnimationFrame(() => {
                    setVisibleFrames(prev => new Set(prev.add(frame.id)));
                    
                    setTimeout(() => {
                      if (canvasRefs.current[index]?.current) {
                        drawFramePreview(canvasRefs.current[index], frame);
                      }
                    }, 200);
                  });
                }
              }
            });
          },
          {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
          }
        );

        // 🔥 等待DOM元素准备就绪，最多尝试10次
        let attempts = 0;
        const maxAttempts = 10;
        
        const trySetupObserver = () => {
          attempts++;
          console.log(`🔍 Attempt ${attempts} to setup Intersection Observer`);
          
          let observedCount = 0;
          canvasRefs.current.forEach((ref, index) => {
            if (ref?.current && frames[index]) {
              ref.current.dataset.frameIndex = index;
              observer.observe(ref.current);
              observedCount++;
              console.log(`📡 Observing canvas for frame: ${frames[index].name}`);
            }
          });
          
          console.log(`📡 Set up Intersection Observer for ${observedCount} canvases (attempt ${attempts})`);
          
          if (observedCount === 0 && attempts < maxAttempts) {
            console.log(`⏰ No canvases found, retrying in 300ms...`);
            setTimeout(trySetupObserver, 300);
          } else if (observedCount === 0) {
            console.log(`⚠️ Failed to setup Intersection Observer after ${maxAttempts} attempts`);
          } else {
            console.log(`✅ Successfully set up Intersection Observer for ${observedCount} canvases`);
          }
        };

        trySetupObserver();
        return observer;
      };

      const observer = setupObserver();

      return () => {
        observer?.disconnect();
      };
    } else {
      console.log('⚠️ Intersection Observer not supported, will rely on fallback');
    }
  }, [isLoading, frames, visibleFrames]);

  // 🔥 改进的fallback机制：更积极的渲染策略
  useEffect(() => {
    if (isLoading || frames.length === 0) return;

    // 首先尝试立即渲染前几个可见的frames
    const immediateRenderTimer = setTimeout(() => {
      console.log('🎨 Starting immediate render for visible frames');
      const maxImmediateRender = Math.min(6, frames.length); // 最多立即渲染6个
      
      for (let i = 0; i < maxImmediateRender; i++) {
        const frame = frames[i];
        if (frame && canvasRefs.current[i]?.current && !visibleFrames.has(frame.id)) {
          console.log(`🎨 Immediate rendering frame ${frame.name}`);
          setVisibleFrames(prev => new Set(prev.add(frame.id)));
          
          setTimeout(() => {
            drawFramePreview(canvasRefs.current[i], frame);
          }, i * 200); // 错开渲染时间
        }
      }
    }, 800); // 增加到800ms，给Intersection Observer更多时间

    // 如果Intersection Observer失效，渲染所有剩余frames
    const fallbackTimer = setTimeout(() => {
      console.log('🔧 Fallback rendering: Checking if Intersection Observer worked');
      
      const unrenderedFrames = frames.filter(frame => !visibleFrames.has(frame.id));
      console.log(`🔧 Found ${unrenderedFrames.length} unrendered frames`);
      
      if (unrenderedFrames.length > 0) {
        console.log('🔧 Fallback rendering: Intersection Observer may have failed');
        
        unrenderedFrames.forEach((frame, idx) => {
          const index = frames.indexOf(frame);
          if (canvasRefs.current[index]?.current) {
            console.log(`🔧 Fallback rendering frame ${frame.name} at index ${index}`);
            
            // 强制更新可见状态
            setVisibleFrames(prev => {
              const newSet = new Set(prev);
              newSet.add(frame.id);
              return newSet;
            });
            
            // 更长的延迟确保DOM完全准备
            setTimeout(() => {
              if (canvasRefs.current[index]?.current) {
                console.log(`🔧 Actually drawing frame ${frame.name}`);
                drawFramePreview(canvasRefs.current[index], frame);
              } else {
                console.error(`🚨 Canvas ref missing for frame ${frame.name} at index ${index}`);
              }
            }, idx * 300 + 500); // 基础500ms延迟 + 错开时间
          }
        });
      } else {
        console.log('✅ All frames already rendered, no fallback needed');
      }
    }, 4000); // 增加到4秒，给Intersection Observer更多时间工作

    return () => {
      clearTimeout(immediateRenderTimer);
      clearTimeout(fallbackTimer);
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
        console.log(`📊 Loaded ${result.data.length} user frames`);
        setFrames(result.data);
      }
    } catch (error) {
      console.error('Failed to load frames:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 处理canvas准备就绪后的渲染逻辑
  const handleCanvasReadyRendering = () => {
    console.log('🎯 Handling canvas ready rendering');
    
    // 检查有多少canvas已经准备好
    let readyCanvases = 0;
    canvasRefs.current.forEach((ref, index) => {
      if (ref?.current && frames[index]) {
        readyCanvases++;
      }
    });
    
    console.log(`🎯 Found ${readyCanvases} ready canvases out of ${frames.length} frames`);
    
    if (readyCanvases > 0) {
      // 立即渲染前几个可见的frames
      const maxImmediateRender = Math.min(6, readyCanvases);
      
      for (let i = 0; i < maxImmediateRender; i++) {
        const frame = frames[i];
        if (frame && canvasRefs.current[i]?.current && !visibleFrames.has(frame.id)) {
          console.log(`🎯 Ready to render frame ${frame.name} immediately`);
          setVisibleFrames(prev => new Set(prev.add(frame.id)));
          
          setTimeout(() => {
            drawFramePreview(canvasRefs.current[i], frame);
          }, i * 150); // 错开渲染时间
        }
      }
    }
  };

  // 懒加载单个frame的draw函数 - 增强调试版本
  const loadFrameDrawFunction = async (frame) => {
    const cacheKey = `frame_${frame.id}`;
    console.log(`🔧 loadFrameDrawFunction called for: ${frame.name}`, { cacheKey });
    
    if (frameDrawFunctions[cacheKey]) {
      console.log(`✅ Using cached draw function for: ${frame.name}`);
      return frameDrawFunctions[cacheKey];
    }

    if (loadingQueue.has(cacheKey)) {
      console.log(`⏳ Waiting for existing load of: ${frame.name}`);
      // 等待正在进行的加载完成
      let waitCount = 0;
      while (loadingQueue.has(cacheKey) && waitCount < 100) { // 最多等待5秒
        await new Promise(resolve => setTimeout(resolve, 50));
        waitCount++;
      }
      console.log(`⏳ Wait completed for: ${frame.name}, waitCount: ${waitCount}`);
      return frameDrawFunctions[cacheKey] || (() => {});
    }

    try {
      console.log(`🚀 Starting to load draw function for: ${frame.name}`);
      setLoadingQueue(prev => new Set(prev.add(cacheKey)));
      
      // 检查frame是否有有效的code
      if (!frame.code || typeof frame.code !== 'string' || frame.code.trim() === '') {
        console.warn(`⚠️ Frame ${frame.name} has no valid code:`, {
          hasCode: !!frame.code,
          codeType: typeof frame.code,
          codeLength: frame.code?.length
        });
        const fallbackFunction = () => {};
        setFrameDrawFunctions(prev => ({
          ...prev,
          [cacheKey]: fallbackFunction
        }));
        return fallbackFunction;
      }
      
      console.log(`🔧 Creating draw function for frame: ${frame.name}`, {
        codeLength: frame.code.length,
        codePreview: frame.code.substring(0, 100) + '...'
      });
      
      // 🔥 关键修复：直接使用FrameService.createFrameDrawFunction，保持简单
      const drawFunction = FrameService.createFrameDrawFunction(frame.code);
      console.log(`🔧 Draw function created for: ${frame.name}`, {
        isFunction: typeof drawFunction === 'function',
        functionLength: drawFunction.toString().length
      });
      
      // 缓存函数
      setFrameDrawFunctions(prev => ({
        ...prev,
        [cacheKey]: drawFunction
      }));
      
      console.log(`✅ Draw function cached for: ${frame.name}`);
      return drawFunction;
    } catch (error) {
      console.error(`🚨 Failed to create draw function for frame ${frame.name}:`, error);
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
        console.log(`🔧 Removed ${frame.name} from loading queue`);
        return newQueue;
      });
    }
  };

  // 简化的绘制frame预览函数 - 增强调试版本
  const drawFramePreview = async (canvasRef, frame) => {
    console.log(`🎨 drawFramePreview called for frame: ${frame?.name || 'unknown'}`);
    
    if (!canvasRef?.current || !frame) {
      console.error('🚨 drawFramePreview: Missing canvasRef or frame', {
        hasCanvasRef: !!canvasRef?.current,
        hasFrame: !!frame,
        frameId: frame?.id
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error('🚨 drawFramePreview: Could not get canvas context');
      return;
    }

    console.log(`🎨 Canvas context obtained for frame ${frame.name}:`, {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      hasCode: !!frame.code,
      codeLength: frame.code?.length
    });

    // 添加调试日志
    DebugHelper.logFrameRenderAttempt(frame.id, frame.name, 'START', {
      hasCode: !!frame.code,
      codeLength: frame.code?.length,
      canvasElement: !!canvasRef.current,
      canvasSize: { width: canvas.width, height: canvas.height }
    });

    // 🔥 测试canvas基本功能
    try {
      const canvasTestPassed = await DebugHelper.testCanvasRendering(canvas);
      if (!canvasTestPassed) {
        console.error('🚨 Canvas test failed for frame:', frame.name);
        DebugHelper.logError('Canvas test failed', new Error('Basic canvas rendering failed'), {
          frameId: frame.id,
          frameName: frame.name
        });
        return;
      }
      console.log(`✅ Canvas test passed for frame: ${frame.name}`);
    } catch (debugError) {
      console.error('🚨 Debug helper failed:', debugError);
      // 继续执行，不让调试代码阻塞渲染
    }

    try {
      // 保持与 Templates.js 相同的比例
      const PREVIEW_WIDTH = 300;
      const ASPECT_RATIO = 1450/480;
      const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH * ASPECT_RATIO);

      // 设置画布尺寸
      canvas.width = PREVIEW_WIDTH;
      canvas.height = PREVIEW_HEIGHT;

      // 计算预览中的图片尺寸和间距
      const borderSize = Math.round((40 * PREVIEW_WIDTH) / 480);
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
        ctx.fillRect(borderSize, yOffset, imgWidth, imgHeight);

        // 添加占位符文本
        ctx.fillStyle = "#999999";
        ctx.font = `${Math.round(14 * PREVIEW_WIDTH / 480)}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("Photo Preview", PREVIEW_WIDTH / 2, yOffset + imgHeight / 2);
      }

      // 🔥 关键修复：改进异步处理和错误恢复
      try {
        console.log(`🔧 Loading draw function for frame: ${frame.name}`);
        const drawFunction = await loadFrameDrawFunction(frame);
        console.log(`🔧 Draw function loaded for frame: ${frame.name}`, {
          isFunction: typeof drawFunction === 'function',
          functionString: drawFunction ? drawFunction.toString().substring(0, 100) + '...' : 'null'
        });
        
        if (drawFunction && typeof drawFunction === "function") {
          console.log(`🎨 Starting frame rendering for: ${frame.name}`);
          
          // 🔥 增加超时保护，防止某些frame函数执行过久
          const frameRenderPromise = new Promise(async (resolve, reject) => {
            try {
              // 重新绘制每张照片的frame
              for (let i = 0; i < 4; i++) {
                const yOffset = borderSize + (imgHeight + photoSpacing) * i;
                
                console.log(`🎨 Rendering frame layer ${i} for ${frame.name}`);
                ctx.save();
                ctx.translate(borderSize, yOffset);
                
                // 🔥 添加try-catch保护每个frame渲染
                try {
                  await drawFunction(ctx, 0, 0, imgWidth, imgHeight);
                  console.log(`✅ Frame layer ${i} rendered successfully for ${frame.name}`);
                } catch (frameError) {
                  console.error(`🚨 Error applying frame ${i} for ${frame.name}:`, frameError);
                  // 继续渲染其他frames，不中断整个过程
                }
                
                ctx.restore();
              }
              console.log(`✅ All frame layers rendered for: ${frame.name}`);
              resolve();
            } catch (error) {
              console.error(`🚨 Frame render promise failed for ${frame.name}:`, error);
              reject(error);
            }
          });

          // 🔥 设置超时保护 - 10秒超时
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              console.error(`⏰ Frame render timeout for: ${frame.name}`);
              reject(new Error('Frame render timeout'));
            }, 10000);
          });

          await Promise.race([frameRenderPromise, timeoutPromise]);
          console.log(`🎉 Frame rendering completed for: ${frame.name}`);
        } else {
          console.warn(`⚠️ No valid draw function for frame ${frame.name}`, {
            drawFunction,
            type: typeof drawFunction
          });
          
          // 显示"无法加载frame"的提示
          ctx.fillStyle = "#ffa500";
          ctx.font = `${Math.round(12 * PREVIEW_WIDTH / 480)}px Arial`;
          ctx.textAlign = "center";
          ctx.fillText("Frame function unavailable", PREVIEW_WIDTH / 2, PREVIEW_HEIGHT / 2);
        }
      } catch (error) {
        console.error(`🚨 Failed to load and apply frame ${frame.name}:`, error);
        
        // 🔥 添加错误提示到canvas上
        ctx.fillStyle = "#ff6b6b";
        ctx.font = `${Math.round(12 * PREVIEW_WIDTH / 480)}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("Failed to load frame", PREVIEW_WIDTH / 2, PREVIEW_HEIGHT / 2);
        ctx.fillText("Click to try anyway", PREVIEW_WIDTH / 2, PREVIEW_HEIGHT / 2 + 20);
      }

      // 添加底部签名区域（与Templates.js保持一致）
      const footerY = borderSize + (imgHeight + photoSpacing) * 4;
      const footerHeight = PREVIEW_HEIGHT - footerY - borderSize;
      
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(borderSize, footerY - 2, imgWidth, 1);

      ctx.fillStyle = "#718096";
      ctx.font = `${Math.round(12 * PREVIEW_WIDTH / 480)}px Arial`;
      ctx.textAlign = "center";
      
      const textY = footerY + footerHeight / 2;
      ctx.fillText("Picapica.app", PREVIEW_WIDTH / 2, textY - 10);
      
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      ctx.font = `${Math.round(10 * PREVIEW_WIDTH / 480)}px Arial`;
      ctx.fillText(date, PREVIEW_WIDTH / 2, textY + 10);

    } catch (error) {
      console.error(`Critical error in drawFramePreview for frame ${frame.name}:`, error);
      
      // 🔥 错误恢复：显示错误信息而不是空白
      try {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffebee";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = "#c62828";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Preview Error", canvas.width / 2, canvas.height / 2 - 10);
          ctx.fillText("Click to use anyway", canvas.width / 2, canvas.height / 2 + 10);
        }
      } catch (recoveryError) {
        console.error('Even error recovery failed:', recoveryError);
      }
    } finally {
      // 🔥 关键修复：确保frame被标记为已渲染，避免一直显示loading
      if (frame?.id) {
        console.log(`🎯 Marking frame ${frame.name} as rendered (finally block)`);
        // 使用RAF确保状态更新在下一帧
        requestAnimationFrame(() => {
          setVisibleFrames(prev => {
            const newSet = new Set(prev);
            newSet.add(frame.id);
            console.log(`🎯 Frame ${frame.name} added to visible frames set, total: ${newSet.size}`);
            return newSet;
          });
        });
      }
    }
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
                     onLoad={() => {
                       console.log(`🎨 Canvas ${index} for frame ${frame.name} loaded`);
                     }}
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