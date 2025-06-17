// src/components/PhotoBooth/UI/BackgroundLighting.js
import React, { useState } from 'react';

// 预设聚光灯颜色
const LIGHTING_PRESETS = [
  { name: "Natural Daylight", color: "#F5F5DC", spotlightColor: "rgba(245, 245, 220, 0.3)" }, // Beige
  { name: "Warm Tone", color: "#FFD580", spotlightColor: "rgba(255, 213, 128, 0.3)" },       // Light orange
  { name: "Cool Tone", color: "#ADD8E6", spotlightColor: "rgba(173, 216, 230, 0.3)" },       // Light blue
  { name: "Studio White", color: "#FFFFFF", spotlightColor: "rgba(255, 255, 255, 0.3)" },    // Pure white
  { name: "Sunset Glow", color: "#FFA07A", spotlightColor: "rgba(255, 160, 122, 0.3)" },     // Light salmon
  { name: "Stage Light", color: "#E6E6FA", spotlightColor: "rgba(230, 230, 250, 0.3)" },     // Lavender
  { name: "Pink Theme", color: "#FFC0CB", spotlightColor: "rgba(248, 187, 217, 0.3)" },      // Pink
];

const BackgroundLighting = ({ backgroundColor, setBackgroundColor, spotlightColor, setSpotlightColor, theme }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // 切换颜色选择器显示
  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  
  // 处理预设颜色选择
  const handlePresetSelect = (preset) => {
    setBackgroundColor(preset.color);
    if (setSpotlightColor) {
      setSpotlightColor(preset.spotlightColor);
    }
  };
  
  // 处理自定义颜色更改
  const handleColorChange = (e) => {
    const color = e.target.value;
    setBackgroundColor(color);
    // 自动生成对应的聚光灯颜色
    if (setSpotlightColor) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      setSpotlightColor(`rgba(${r}, ${g}, ${b}, 0.3)`);
    }
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
            onClick={() => handlePresetSelect(preset)}
            style={{
              backgroundColor: preset.color,
              color: isLightColor(preset.color) ? "#000000" : "#FFFFFF",
              border: backgroundColor === preset.color ? `3px solid ${theme.accentColor || '#D197B8'}` : "2px solid rgba(0,0,0,0.1)",
              margin: "5px",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: backgroundColor === preset.color ? "600" : "500",
              transition: "all 0.3s ease",
              boxShadow: backgroundColor === preset.color ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.1)"
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