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
    ctx.fillText("Photo Booth Preview", canvas.width / 2, canvas.height / 2);
    
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
        
        <div className="photo-booth-frames-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {frameTypes.map((frameType, index) => (
            <div 
              key={frameType}
              className="photo-booth-frame-item"
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
                aria-label={`${frameType} photo booth frame preview`}
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
                  {frameType.charAt(0).toUpperCase() + frameType.slice(1)} Photo Booth Frame
                </h3>
                <p style={{ 
                  margin: "0", 
                  fontSize: "14px",
                  color: "#666"
                }}>
                  Select this photo booth frame
                </p>
              </div>
            </div>
          ))}
        </div>
        
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