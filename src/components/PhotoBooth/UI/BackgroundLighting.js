// src/components/PhotoBooth/UI/BackgroundLighting.js
import React, { useState } from 'react';

// 预设照明颜色
const LIGHTING_PRESETS = [
  { name: "Natural Daylight", color: "#F5F5DC" }, // Beige
  { name: "Warm Tone", color: "#FFD580" },       // Light orange
  { name: "Cool Tone", color: "#ADD8E6" },       // Light blue
  { name: "Studio White", color: "#FFFFFF" },    // Pure white
  { name: "Sunset Glow", color: "#FFA07A" },     // Light salmon
  { name: "Stage Light", color: "#E6E6FA" },     // Lavender
  { name: "Pink Theme", color: "#FFC0CB" },      // Pink
];

const BackgroundLighting = ({ backgroundColor, setBackgroundColor, theme }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // 切换颜色选择器显示
  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  
  // 处理自定义颜色更改
  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };
  
  // 判断颜色是亮色还是暗色（用于文字颜色）
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };
  
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "16px" }}>
        Background Lighting
      </h3>
      
      <div className="lighting-presets" style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "8px"
      }}>
        {LIGHTING_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => setBackgroundColor(preset.color)}
            style={{
              backgroundColor: preset.color,
              color: isLightColor(preset.color) ? "#000000" : "#FFFFFF",
              border: backgroundColor === preset.color ? `2px solid ${theme.accentColor}` : "1px solid #ccc",
              margin: "5px",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            {preset.name}
          </button>
        ))}
        
        <button 
          onClick={toggleColorPicker}
          style={{
            margin: "5px",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: theme.lightPink,
            border: "1px solid #ccc",
            fontSize: "12px"
          }}
        >
          Custom Color
        </button>
      </div>
      
      {showColorPicker && (
        <div className="color-picker-container" style={{ 
          margin: "15px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <input
            type="color"
            value={backgroundColor}
            onChange={handleColorChange}
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
          <span style={{ 
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333"
          }}>
            {backgroundColor}
          </span>
        </div>
      )}
    </div>
  );
};

export default BackgroundLighting;