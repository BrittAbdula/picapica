import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage = 'https://picapica.app/images/og-image.jpg',
  keywords = 'picapica, picapica photo booth, Pica Pica Photo Booth, photo booth, online photo booth, photo strip'
}) => {
  // 构建完整的标题，确保包含品牌名
  const fullTitle = title ? `${title} | Picapica Photo Booth` : 'Picapica Photo Booth - Create and Share Photo Strips Online';
  
  // 确保 canonicalUrl 是完整的 URL
  const fullCanonicalUrl = canonicalUrl.startsWith('http') 
    ? canonicalUrl 
    : `https://picapica.app${canonicalUrl}`;

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