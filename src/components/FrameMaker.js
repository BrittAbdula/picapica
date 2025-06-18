import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";
import { isAuthenticated, getAuthHeaders, getUsername } from "../utils/auth";
import FrameService from "../services/frameService";

const FrameMaker = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFrame, setGeneratedFrame] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const canvasRef = useRef(null);

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

  // 当生成的框架数据更新时，自动绘制预览
  useEffect(() => {
    if (generatedFrame && canvasRef.current) {
      drawFramePreview(generatedFrame);
    }
  }, [generatedFrame]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your frame");
      return;
    }

    // 检查用户是否已登录
    if (!userAuthenticated) {
      setError("Please login to generate custom frames");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccessMessage(""); // 清除之前的成功消息
    
    try {
      const response = await fetch('https://api.picapica.app/api/ai/frames/generate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedFrame(result.data);
        // 等待状态更新后再绘制预览
        setTimeout(() => {
          drawFramePreview(result.data);
        }, 100);
      } else {
        setError(result.message || "Failed to generate frame");
      }
    } catch (err) {
      console.error('Error generating frame:', err);
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const drawFramePreview = async (frameData) => {
    console.log('drawFramePreview called with:', frameData);
    if (!canvasRef.current || !frameData) {
      console.log('Canvas ref or frame data missing:', { canvasRef: canvasRef.current, frameData });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log('Canvas element:', canvas, 'Context:', ctx);

    // 设置画布尺寸
    const PREVIEW_WIDTH = 300;
    const ASPECT_RATIO = 1450/480;
    const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH * ASPECT_RATIO);

    canvas.width = PREVIEW_WIDTH;
    canvas.height = PREVIEW_HEIGHT;

    // 填充背景
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 计算预览中的图片尺寸和间距
    const borderSize = Math.round((40 * PREVIEW_WIDTH) / 480);
    const imgWidth = PREVIEW_WIDTH - (borderSize * 2);
    const imgHeight = Math.round((300 * PREVIEW_WIDTH) / 480);
    const photoSpacing = Math.round((20 * PREVIEW_WIDTH) / 480);

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

    // 应用生成的frame代码
    try {
      const drawFunctionCode = frameData.code;
      console.log('Frame code:', drawFunctionCode); // 调试信息
      
      // 使用FrameService来创建draw函数，与Templates.js保持一致
      const drawFunction = FrameService.createFrameDrawFunction(drawFunctionCode);
      
      if (drawFunction && typeof drawFunction === 'function') {
        // 重新绘制每张照片的frame
        for (let i = 0; i < 4; i++) {
          const yOffset = borderSize + (imgHeight + photoSpacing) * i;
          
          ctx.save();
          ctx.translate(borderSize, yOffset);
          try {
            await drawFunction(ctx, 0, 0, imgWidth, imgHeight);
          } catch (error) {
            console.error(`Error applying generated frame at position ${i}:`, error);
          }
          ctx.restore();
        }
      } else {
        console.error('Could not create draw function from code:', drawFunctionCode);
      }
    } catch (error) {
      console.error('Failed to apply generated frame:', error);
    }

    // 添加底部签名区域
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
  };

  const handleSaveFrame = async () => {
    if (!generatedFrame || !userAuthenticated) return;
    
    try {
      const saveData = {
        name: generatedFrame.name || generatedFrame.description || 'Custom Frame',
        description: generatedFrame.description || prompt,
        code: generatedFrame.code,
        prompt: prompt, // 使用用户输入的原始提示词
        is_public: false // 默认设为私有
      };

      console.log('Saving frame with data:', saveData);

      const response = await fetch('https://api.picapica.app/api/ai/frames/save', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(saveData)
      });

      const result = await response.json();
      console.log('Save response:', result);

      if (result.success) {
        setError(""); // 清除错误
        setSuccessMessage(`✅ Frame saved successfully! ID: ${result.data.id}`);
        // 5秒后清除成功消息
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        console.error('Failed to save frame:', result.message);
        setError(`Failed to save frame: ${result.message}`);
      }
    } catch (err) {
      console.error('Error saving frame:', err);
      setError("Network error while saving frame. Please try again.");
    }
  };

  const handleUseInPhotoBooth = () => {
    if (!generatedFrame) return;
    
    // Store the generated frame temporarily for photobooth to use
    localStorage.setItem("generatedFrame", JSON.stringify(generatedFrame));
    localStorage.setItem("selectedFrame", "generated"); // 特殊标识符表示使用生成的框架
    
    // Navigate to photobooth page
    navigate("/photobooth", { 
      state: { 
        frameType: "generated",
        generatedFrame: generatedFrame 
      } 
    });
  };

  const examplePrompts = [
    "A romantic wedding frame with gold accents and roses",
    "Retro 80s neon frame with geometric patterns",
    "Birthday party frame with colorful balloons and confetti",
    "Elegant black and white vintage frame",
    "Christmas theme with snowflakes and holly",
    "Summer beach frame with palm trees and waves"
  ];

  return (
    <>
      <Meta
        title="AI Frame Maker - Create Custom Photo Booth Frames"
        description="Create custom photo booth frames using AI. Describe your vision and watch as our AI generates unique frame designs for your photo booth experience."
        canonicalUrl="/frame-maker"
      />

      <div className="frame-maker-container" style={{ 
        padding: "20px", 
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          AI Frame Maker
        </h1>
        
        <p style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 20px",
          color: "#666",
          fontSize: "16px",
          lineHeight: "1.6"
        }}>
          Describe your ideal photo booth frame and our AI will create it for you. 
          Be specific about colors, themes, decorations, and style preferences.
        </p>

        {/* 用户登录状态提示 */}
        {userAuthenticated ? (
          <div style={{
            textAlign: "center",
            margin: "0 auto 40px",
            padding: "12px 20px",
            backgroundColor: "#f0fff4",
            color: "#22543d",
            borderRadius: "8px",
            maxWidth: "600px",
            fontSize: "14px"
          }}>
            ✅ Welcome back, {username}! You can generate and save custom frames.
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            margin: "0 auto 40px",
            padding: "12px 20px",
            backgroundColor: "#fff5f5",
            color: "#c53030",
            borderRadius: "8px",
            maxWidth: "600px",
            fontSize: "14px"
          }}>
            ⚠️ Please login to generate custom frames. You can login from the navigation menu.
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth >= 1024 ? "1fr 1fr" : "1fr",
          gap: "40px",
          alignItems: "start"
        }}>
          {/* Input Section */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
              Describe Your Frame
            </h2>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your frame idea... (e.g., 'A magical unicorn-themed frame with rainbow colors and sparkles for a children's birthday party')"
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "15px",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3182ce"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !userAuthenticated}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "20px",
                backgroundColor: (isGenerating || !prompt.trim() || !userAuthenticated) ? "#cbd5e0" : "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: (isGenerating || !prompt.trim() || !userAuthenticated) ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              {isGenerating ? (
                <>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                  Generating Frame...
                </>
              ) : !userAuthenticated ? (
                "Login Required"
              ) : (
                "Generate Frame"
              )}
            </button>

            {error && (
              <div style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: "#fed7d7",
                color: "#c53030",
                borderRadius: "6px",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            {successMessage && (
              <div style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: "#f0fff4",
                color: "#22543d",
                borderRadius: "6px",
                fontSize: "14px"
              }}>
                {successMessage}
              </div>
            )}

            {generatedFrame && (
              <div style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f0fff4",
                color: "#22543d",
                borderRadius: "6px",
                fontSize: "14px"
              }}>
                <strong>Frame Generated!</strong><br/>
                Name: {generatedFrame.description}<br/>
                <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleUseInPhotoBooth}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#38a169",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      flex: "1",
                      minWidth: "120px"
                    }}
                  >
                    📸 Use Now
                  </button>
                  <button
                    onClick={handleSaveFrame}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#3182ce",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      flex: "1",
                      minWidth: "120px"
                    }}
                  >
                    Save Frame
                  </button>
                </div>
              </div>
            )}

            <h3 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "18px" }}>
              Example Ideas
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#f7fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#edf2f7"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#f7fafc"}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
              Frame Preview
            </h2>
            
            <div style={{
              border: "2px dashed #e2e8f0",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              position: "relative",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {isGenerating ? (
                <div style={{
                  textAlign: "center",
                  color: "#4a5568"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    border: "4px solid #e2e8f0",
                    borderTop: "4px solid #3182ce",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 20px"
                  }}></div>
                  <h3 style={{ 
                    marginBottom: "10px", 
                    color: "#2d3748",
                    fontSize: "18px"
                  }}>
                    🎨 Generating Your Frame
                  </h3>
                  <p style={{
                    color: "#718096",
                    fontSize: "14px",
                    margin: "0"
                  }}>
                    Our AI is creating your custom frame...
                  </p>
                  <div style={{
                    marginTop: "15px",
                    padding: "10px 20px",
                    backgroundColor: "rgba(49, 130, 206, 0.1)",
                    borderRadius: "20px",
                    display: "inline-block"
                  }}>
                    <div style={{
                      width: "100px",
                      height: "4px",
                      backgroundColor: "#e2e8f0",
                      borderRadius: "2px",
                      overflow: "hidden",
                      position: "relative"
                    }}>
                      <div style={{
                        width: "30px",
                        height: "100%",
                        backgroundColor: "#3182ce",
                        borderRadius: "2px",
                        animation: "progress 2s ease-in-out infinite"
                      }}></div>
                    </div>
                  </div>
                </div>
              ) : generatedFrame ? (
                <div style={{ textAlign: "center" }}>
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={Math.round(300 * 1450/480)}
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      height: "auto",
                      display: "block",
                      margin: "0 auto 20px",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white"
                    }}
                  />
                  
                  {/* 使用按钮 */}
                  <button
                    onClick={handleUseInPhotoBooth}
                    style={{
                      padding: "12px 30px",
                      backgroundColor: "#38a169",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(56, 161, 105, 0.2)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#2f855a";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 8px rgba(56, 161, 105, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#38a169";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(56, 161, 105, 0.2)";
                    }}
                  >
                    📸 Use in Photo Booth
                  </button>
                </div>
              ) : (
                <div style={{
                  color: "#718096",
                  fontSize: "16px",
                  padding: "40px 20px",
                  textAlign: "center"
                }}>
                  <div style={{
                    fontSize: "48px",
                    marginBottom: "15px",
                    opacity: "0.5"
                  }}>
                    🖼️
                  </div>
                  <p style={{ margin: "0" }}>
                    Your generated frame will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: "50px",
          padding: "30px",
          backgroundColor: "#f0f7ff",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h2 style={{ marginTop: 0, color: "#2c5282" }}>
            How It Works
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth >= 768 ? "repeat(3, 1fr)" : "1fr",
            gap: "30px",
            marginTop: "30px"
          }}>
            <div>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#3182ce",
                borderRadius: "50%",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold"
              }}>
                1
              </div>
              <h3 style={{ fontSize: "18px", color: "#2d3748" }}>Describe</h3>
              <p style={{ color: "#4a5568", fontSize: "14px", lineHeight: "1.5" }}>
                Tell our AI what kind of frame you want. Be as detailed as possible about colors, themes, and style.
              </p>
            </div>
            <div>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#3182ce",
                borderRadius: "50%",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold"
              }}>
                2
              </div>
              <h3 style={{ fontSize: "18px", color: "#2d3748" }}>Generate</h3>
              <p style={{ color: "#4a5568", fontSize: "14px", lineHeight: "1.5" }}>
                Our AI processes your description and creates a unique frame design with custom graphics and styling.
              </p>
            </div>
            <div>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#3182ce",
                borderRadius: "50%",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold"
              }}>
                3
              </div>
              <h3 style={{ fontSize: "18px", color: "#2d3748" }}>Use</h3>
              <p style={{ color: "#4a5568", fontSize: "14px", lineHeight: "1.5" }}>
                Preview your frame and use it immediately in the photo booth to create amazing photos.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes progress {
            0% { transform: translateX(-100px); }
            50% { transform: translateX(70px); }
            100% { transform: translateX(-100px); }
          }
        `}</style>
      </div>
    </>
  );
};

export default FrameMaker;