import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FRAMES from "./Frames";
import Meta from "./Meta";

const Templates = () => {
  const navigate = useNavigate();
  const templateRefs = useRef([]);

  // Extract frame types from FRAMES object, remove "none"
  const frameTypes = Object.keys(FRAMES).filter(frameType => frameType !== "none");

  // Add canvas refs for each frame
  if (templateRefs.current.length !== frameTypes.length) {
    templateRefs.current = Array(frameTypes.length).fill().map(() => React.createRef());
  }

  // Function to draw a template preview
  const drawTemplate = (canvasRef, frameType) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = 225;
    
    // Fill with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw placeholder image
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(40, 30, 220, 165);
    
    // Add placeholder text
    ctx.fillStyle = "#999999";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Photo", canvas.width / 2, canvas.height / 2);
    
    // Apply the frame
    if (FRAMES[frameType] && typeof FRAMES[frameType].draw === "function") {
      FRAMES[frameType].draw(ctx, 0, 0, canvas.width, canvas.height);
    }
  };

  // Draw all templates after component mounts
  useEffect(() => {
    frameTypes.forEach((frameType, index) => {
      drawTemplate(templateRefs.current[index], frameType);
    });
  }, []);

  // Navigate to photobooth when template is selected
  const handleTemplateClick = (frameType) => {
    localStorage.setItem("selectedFrame", frameType);
    navigate("/photobooth", { state: { frameType } });
  };

  return (
    <>
      <Meta
        title="Photo Frame Templates"
        description="Choose a template for your photo strip. Select from various designs and styles for your photos."
        canonicalUrl="/templates"
      />
      
      <div className="templates-container" style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Choose Your Photo Frame</h1>
        
        <p style={{ 
          textAlign: "center", 
          maxWidth: "800px", 
          margin: "0 auto 40px", 
          color: "#666"
        }}>
          Select a frame style for your photo strip. Click on any template to continue to the photo booth.
        </p>
        
        <div className="templates-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {frameTypes.map((frameType, index) => (
            <div 
              key={frameType}
              className="template-item"
              onClick={() => handleTemplateClick(frameType)}
              style={{
                cursor: "pointer",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                overflow: "hidden",
                ":hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
                }
              }}
            >
              <canvas 
                ref={templateRefs.current[index]}
                width="300"
                height="225"
                style={{
                  width: "100%",
                  display: "block"
                }}
              />
              <div style={{
                padding: "15px",
                borderTop: "1px solid #f0f0f0",
                textAlign: "center"
              }}>
                <h3 style={{ 
                  margin: "0 0 5px", 
                  fontSize: "18px",
                  color: "#333"
                }}>
                  {frameType.charAt(0).toUpperCase() + frameType.slice(1)} Frame
                </h3>
                <p style={{ 
                  margin: "0", 
                  fontSize: "14px",
                  color: "#666"
                }}>
                  Click to select
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Templates;