 // Frame Render Test Utility for Production Debugging
export const FrameRenderTest = {
    // Test basic canvas functionality
    testCanvasBasics() {
      console.log('🧪 Testing Canvas Basics...');
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get 2D context');
        }
        
        // Test basic drawing
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 50, 50);
        
        // Check if pixel was drawn
        const imageData = ctx.getImageData(20, 20, 1, 1);
        const hasPixel = imageData.data[0] > 0;
        
        console.log('✅ Canvas basics test passed', { hasPixel });
        return true;
      } catch (error) {
        console.error('❌ Canvas basics test failed:', error);
        return false;
      }
    },
  
    // Test AsyncFunction creation
    testAsyncFunctionCreation() {
      console.log('🧪 Testing AsyncFunction Creation...');
      
      try {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const testFunction = new AsyncFunction('ctx', 'x', 'y', 'w', 'h', `
          ctx.fillStyle = 'blue';
          ctx.fillRect(x, y, w, h);
        `);
        
        if (typeof testFunction !== 'function') {
          throw new Error('Created function is not callable');
        }
        
        console.log('✅ AsyncFunction creation test passed');
        return testFunction;
      } catch (error) {
        console.error('❌ AsyncFunction creation test failed:', error);
        return null;
      }
    },
  
    // Test frame function execution
    async testFrameFunctionExecution() {
      console.log('🧪 Testing Frame Function Execution...');
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        const testFunction = this.testAsyncFunctionCreation();
        if (!testFunction) {
          throw new Error('Could not create test function');
        }
        
        await testFunction(ctx, 10, 10, 50, 50);
        
        // Check if function executed successfully
        const imageData = ctx.getImageData(20, 20, 1, 1);
        const hasBluePixel = imageData.data[2] > 0; // Blue channel
        
        console.log('✅ Frame function execution test passed', { hasBluePixel });
        return true;
      } catch (error) {
        console.error('❌ Frame function execution test failed:', error);
        return false;
      }
    },
  
    // Test Intersection Observer
    testIntersectionObserver() {
      console.log('🧪 Testing Intersection Observer...');
      
      try {
        if (typeof IntersectionObserver === 'undefined') {
          throw new Error('IntersectionObserver not supported');
        }
        
        let observerWorked = false;
        const testElement = document.createElement('div');
        testElement.style.height = '100px';
        testElement.style.width = '100px';
        document.body.appendChild(testElement);
        
        const observer = new IntersectionObserver((entries) => {
          observerWorked = true;
          console.log('✅ Intersection Observer callback triggered');
          observer.disconnect();
          document.body.removeChild(testElement);
        });
        
        observer.observe(testElement);
        
        // Clean up after 2 seconds if observer doesn't trigger
        setTimeout(() => {
          if (!observerWorked) {
            console.log('⚠️ Intersection Observer may not be working properly');
            observer.disconnect();
            if (document.body.contains(testElement)) {
              document.body.removeChild(testElement);
            }
          }
        }, 2000);
        
        return true;
      } catch (error) {
        console.error('❌ Intersection Observer test failed:', error);
        return false;
      }
    },
  
    // Run all tests
    async runAllTests() {
      console.log('🧪 Running Frame Render Tests...');
      
      const results = {
        canvasBasics: this.testCanvasBasics(),
        asyncFunctionCreation: !!this.testAsyncFunctionCreation(),
        frameFunctionExecution: await this.testFrameFunctionExecution(),
        intersectionObserver: this.testIntersectionObserver()
      };
      
      console.log('🧪 Test Results:', results);
      
      const allPassed = Object.values(results).every(result => result === true);
      console.log(allPassed ? '✅ All tests passed!' : '⚠️ Some tests failed');
      
      return results;
    }
  };
  
  // Auto-run tests in production
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    window.FrameRenderTest = FrameRenderTest;
    
    // Run tests after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => FrameRenderTest.runAllTests(), 1000);
      });
    } else {
      setTimeout(() => FrameRenderTest.runAllTests(), 1000);
    }
  }
  
  export default FrameRenderTest;