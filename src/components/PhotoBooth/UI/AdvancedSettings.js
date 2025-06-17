// src/components/PhotoBooth/UI/AdvancedSettings.js
import React from 'react';
import BackgroundLighting from './BackgroundLighting';

const AdvancedSettings = ({ 
  countdownDuration, 
  setCountdownDuration, 
  soundEnabled, 
  toggleSound, 
  backgroundColor, 
  setBackgroundColor, 
  spotlightColor,
  setSpotlightColor,
  capturing, 
  theme 
}) => {
  return (
    <div className="advanced-settings" style={{ 
      marginTop: "60px",
      padding: "40px 15px",
      maxWidth: "1000px",
      margin: "60px auto 0",
    }}>
      <h3 style={{ 
        color: "#333", 
        marginBottom: "30px",
        textAlign: "center",
        fontSize: "18px"
      }}>
        Advanced Settings
      </h3>
      
      {/* Countdown and Sound Controls */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        {/* Countdown Setting */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          minWidth: "150px"
        }}>
          <label style={{ 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333",
            fontSize: "14px",
            textAlign: "center"
          }}>
            Countdown: {countdownDuration}s
          </label>
          <div 
            className="switch-container" 
            style={{ 
              position: "relative", 
              display: "inline-block", 
              width: "80px", 
              height: "30px", 
              cursor: capturing ? "not-allowed" : "pointer",
              opacity: capturing ? 0.6 : 1
            }}
          >
            <input
              type="range"
              min="1"
              max="10"
              value={countdownDuration}
              onChange={(e) => !capturing && setCountdownDuration(Number(e.target.value))}
              disabled={capturing}
              style={{
                width: "100%",
                height: "6px",
                background: theme.mainPink,
                outline: "none",
                WebkitAppearance: "none",
                appearance: "none",
                borderRadius: "3px"
              }}
            />
          </div>
        </div>

        {/* Sound Toggle */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          minWidth: "150px"
        }}>
          <label style={{ 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333",
            fontSize: "14px",
            userSelect: "none", 
            cursor: "pointer" 
          }} onClick={toggleSound}>
            Camera Sound: {soundEnabled ? "On" : "Off"}
          </label>
          <div 
            className="switch-container" 
            style={{ position: "relative", display: "inline-block", width: "60px", height: "30px", cursor: "pointer" }}
            onClick={toggleSound}
          >
            <div
              className="slider"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: soundEnabled ? theme.accentColor : "#ccc",
                borderRadius: "34px",
                transition: "0.4s",
              }}
            >
              <div 
                className="slider-button"
                style={{
                  position: "absolute",
                  height: "22px",
                  width: "22px",
                  left: soundEnabled ? "34px" : "4px",
                  bottom: "4px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "0.4s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Lighting Component */}
      <BackgroundLighting 
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        spotlightColor={spotlightColor}
        setSpotlightColor={setSpotlightColor}
        theme={theme}
      />
    </div>
  );
};

export default AdvancedSettings;