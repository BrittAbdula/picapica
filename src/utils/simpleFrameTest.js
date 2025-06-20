// Simple Frame Rendering Test for MyFrames
export const simpleFrameTest = {
  // Test if we can render a simple frame directly
  async testDirectFrameRender(frameCode) {
    console.log('🧪 Testing direct frame render...');
    
    try {
      // Create a test canvas
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Fill background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Test AsyncFunction creation
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const drawFunction = new AsyncFunction('ctx', 'x', 'y', 'width', 'height', frameCode);
      
      // Test drawing
      await drawFunction(ctx, 50, 50, 200, 150);
      
      // Check if something was drawn
      const imageData = ctx.getImageData(100, 100, 1, 1);
      const hasDrawing = imageData.data.some(value => value > 0);
      
      console.log('✅ Direct frame render test passed', { hasDrawing });
      
      // Append to body for visual verification
      canvas.style.border = '2px solid red';
      canvas.style.position = 'fixed';
      canvas.style.top = '10px';
      canvas.style.right = '10px';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);
      
      // Remove after 5 seconds
      setTimeout(() => {
        if (document.body.contains(canvas)) {
          document.body.removeChild(canvas);
        }
      }, 5000);
      
      return true;
    } catch (error) {
      console.error('❌ Direct frame render test failed:', error);
      return false;
    }
  },
  
  // Test with a simple frame code
  async testWithSimpleFrame() {
    const simpleFrameCode = `
      // Simple frame test
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 5;
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = '#0000FF';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TEST FRAME', x + width/2, y + height/2);
    `;
    
    return await this.testDirectFrameRender(simpleFrameCode);
  }
};

// Make available globally in production
if (typeof window !== 'undefined') {
  window.simpleFrameTest = simpleFrameTest;
}

export default simpleFrameTest;