 // Debug helper for production environment issues
export class DebugHelper {
    static isProduction() {
      return process.env.NODE_ENV === 'production';
    }
  
    static logEnvironmentInfo() {
      const info = {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        isDev: !this.isProduction(),
        canvasSupported: typeof HTMLCanvasElement !== 'undefined',
        intersectionObserverSupported: typeof IntersectionObserver !== 'undefined',
        requestAnimationFrameSupported: typeof requestAnimationFrame !== 'undefined',
        asyncFunctionSupported: typeof (Object.getPrototypeOf(async function(){}).constructor) === 'function',
        timestamp: new Date().toISOString()
      };
      
      console.log('🔍 Environment Debug Info:', info);
      return info;
    }
  
    static async testCanvasRendering(canvas) {
      try {
        if (!canvas) {
          throw new Error('Canvas element not provided');
        }
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get 2D rendering context');
        }
  
        // Test basic canvas operations
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 10, 10);
        
        // Test if canvas is actually rendering
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const hasRendered = imageData.data[0] > 0; // Check if red pixel was drawn
  
        console.log('✅ Canvas rendering test passed', { hasRendered });
        return true;
      } catch (error) {
        console.error('❌ Canvas rendering test failed:', error);
        return false;
      }
    }
  
    static async testFrameFunction(frameFunction, canvas) {
      try {
        if (typeof frameFunction !== 'function') {
          throw new Error('Frame function is not a function');
        }
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
  
        // Test frame function execution
        await Promise.race([
          frameFunction(ctx, 0, 0, 100, 100),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Frame function timeout')), 5000)
          )
        ]);
  
        console.log('✅ Frame function test passed');
        return true;
      } catch (error) {
        console.error('❌ Frame function test failed:', error);
        return false;
      }
    }
  
    static logFrameRenderAttempt(frameId, frameName, step, details = {}) {
      if (this.isProduction()) {
        console.log(`🎨 Frame Render [${frameId}] ${frameName} - ${step}:`, details);
      }
    }
  
    static logError(context, error, additionalInfo = {}) {
      console.error(`🚨 ${context}:`, error, additionalInfo);
      
      // In production, you might want to send this to an error tracking service
      if (this.isProduction()) {
        // Example: Send to analytics or error tracking
        // analytics.track('Frame Render Error', { context, error: error.message, ...additionalInfo });
      }
    }
  
    static createDebugCanvas(width = 100, height = 100) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
  }
  
  export default DebugHelper;