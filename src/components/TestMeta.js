import React, { useEffect } from 'react';
import Meta from './Meta';

const TestMeta = () => {
  useEffect(() => {
    // 检查 meta 标签
    setTimeout(() => {
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      const metaDescription = document.querySelector('meta[name="description"]');
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      
      console.log('TestMeta - Meta Tags Check:', {
        canonicalLink: canonicalLink ? canonicalLink.getAttribute('href') : 'Not found',
        metaDescription: metaDescription ? metaDescription.getAttribute('content') : 'Not found',
        metaKeywords: metaKeywords ? metaKeywords.getAttribute('content') : 'Not found',
        ogTitle: ogTitle ? ogTitle.getAttribute('content') : 'Not found'
      });
    }, 1000);
  }, []);

  return (
    <div>
      <Meta 
        title="Test Meta Component"
        description="This is a test page for the Meta component"
        canonicalUrl="/test-meta"
      />
      <h1>Test Meta Component</h1>
      <p>This page is used to test if the Meta component is working correctly.</p>
      <p>Please check the browser console for debug information.</p>
      <p>You can also check the page source or use browser developer tools to inspect the meta tags.</p>
    </div>
  );
};

export default TestMeta; 