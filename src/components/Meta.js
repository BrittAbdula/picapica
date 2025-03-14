import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = 'https://picapica.app/images/og-image.jpg',
  keywords = ''
}) => {
  // 构建完整的标题，确保包含品牌名
  const fullTitle = title ? `${title} | Picapica Photo Booth` : 'Picapica Photo Booth - Create and Share Photo Strips Online';
  
  // 确保 canonicalUrl 是完整的 URL
  const fullCanonicalUrl = canonicalUrl.startsWith('http') 
    ? canonicalUrl 
    : `https://picapica.app${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`;


  // 直接修改文档头部
  useEffect(() => {
    // 设置标题
    document.title = fullTitle;

    // 设置 meta 描述
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 设置 meta 关键词
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // 设置 canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 设置 Open Graph 标签
    const ogTags = {
      'og:type': 'website',
      'og:url': fullCanonicalUrl,
      'og:title': fullTitle,
      'og:description': description,
      'og:image': ogImage
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // 设置 Twitter 卡片标签
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:url': fullCanonicalUrl,
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': ogImage
    };

    Object.entries(twitterTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

  }, [fullTitle, description, keywords, fullCanonicalUrl, ogImage]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Meta; 