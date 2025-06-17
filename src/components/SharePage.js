import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Meta from './Meta';

const SharePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decodedUrl, setDecodedUrl] = useState('');

  useEffect(() => {
    // Get imageurl from query parameters
    const queryParams = new URLSearchParams(location.search);
    const imageUrl = queryParams.get('imageurl');

    if (!imageUrl) {
      setLoading(false);
      return;
    }

    try {
      // Decode the URL parameter
      const decoded = decodeURIComponent(imageUrl);
      setDecodedUrl(decoded);
      setLoading(false);
    } catch (err) {
      console.error('Error decoding URL:', err);
      setError('Invalid image URL');
      setLoading(false);
    }
  }, [location.search]);

  const handleCopyLink = () => {
    const shareUrl = window.location.href;
        if (!shareUrl) return;
      
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(shareUrl)
            .catch(err => {
              console.error('Failed to copy link:', err);
            });
        } else {
          // 回退方案
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Fallback copy failed:', err);
          }
          document.body.removeChild(textArea);
        }
  };

  // 为不同状态设置不同的元数据
  let metaTitle = 'Share Your Photo Strip';
  let metaDescription = 'Share your Picapica photo strip with friends and family. Create beautiful photo strips with our free online photo booth app.';
  let metaImage = decodedUrl || 'https://picapica.app/images/og-image.png';
  let canonicalPath = 'https://picapica.app/share';

  if (loading) {
    metaTitle = 'Loading Shared Photo';
    metaDescription = 'Loading a shared Picapica photo strip. Please wait a moment.';
  } else if (error) {
    metaTitle = 'Error Loading Photo';
    metaDescription = 'There was an error loading the shared Picapica photo strip.';
  } else if (!decodedUrl) {
    metaTitle = 'Share Your Photo Strip';
    metaDescription = 'Create and share beautiful photo strips with Picapica - your free online photo booth app.';
  }

  // 调试信息
  console.log('SharePage State:', {
    loading,
    error,
    decodedUrl,
    metaTitle,
    metaDescription,
    canonicalPath
  });

  if (loading) {
    return (
      <>
        <Meta 
          title={metaTitle}
          description={metaDescription}
          canonicalUrl={canonicalPath}
          ogImage={metaImage}
        />
        <div className="share-page" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Loading shared photo...</h2>
            <div className="loading-spinner" style={{
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #FF69B4',
              borderRadius: '50%',
              margin: '20px auto',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Meta 
          title={metaTitle}
          description={metaDescription}
          canonicalUrl={canonicalPath}
          ogImage={metaImage}
        />
        <div className="share-page error" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
            <h2 style={{ color: '#d32f2f' }}>Error Loading Photo</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#FF69B4',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // Default page when no imageUrl is provided
  if (!decodedUrl) {
    return (
      <>
        <Meta 
          title={metaTitle}
          description={metaDescription}
          canonicalUrl={canonicalPath}
          ogImage={metaImage}
        />
        <div className="share-page" style={{ 
          padding: '20px',
          maxWidth: '800px',
          margin: '0 auto',
          marginTop: '40px'
        }}>
          <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
            Create and Share Your Photo Strips
          </h1>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src="/images/picapica-icon.svg" 
              alt="Picapica Logo" 
              style={{ width: '120px', marginBottom: '20px' }}
            />
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
              Picapica is your free online photo booth app. Create beautiful photo strips, 
              add fun stickers, and share your memories with friends and family.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>📸 Take Photos</h3>
              <p style={{ color: '#666' }}>Use your camera to capture 4 photos in different poses</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>🎨 Customize</h3>
              <p style={{ color: '#666' }}>Add stickers, change colors, and make it your own</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>🔗 Share</h3>
              <p style={{ color: '#666' }}>Share your photo strip with friends and family</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button 
              onClick={() => navigate('/photobooth')}
              style={{
                backgroundColor: '#FF69B4',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
            >
              <span>📸</span> Start Creating Your Photo Strip
            </button>
          </div>

          <div className="footer" style={{ 
            marginTop: '40px',
            textAlign: 'center',
            color: '#777',
            fontSize: '14px'
          }}>
            <p>© 2025 Picapica - Create your own photo strip memories!</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'transparent',
                color: '#FF69B4',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // Shared photo page
  return (
    <>
      <Meta 
        title={metaTitle}
        description={metaDescription}
        canonicalUrl={canonicalPath}
        ogImage={metaImage}
      />
      
      <div className="share-page" style={{ 
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        marginTop: '40px'
      }}>
        
        <div className="image-container" style={{ 
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          position: 'relative'
        }}>
          <img 
            src={decodedUrl} 
            alt="Shared photo strip" 
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              height: 'auto',
              objectFit: 'contain',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
            onClick={() => {
              document.getElementById('fullscreen-viewer').style.display = 'flex';
            }}
          />
          <div 
            id="fullscreen-viewer" 
            style={{
              display: 'none',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.9)',
              zIndex: 1000,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                document.getElementById('fullscreen-viewer').style.display = 'none';
              }
            }}
          >
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '20px',
              color: 'white',
              fontSize: '30px',
              cursor: 'pointer',
              zIndex: 1001
            }}
            onClick={() => {
              document.getElementById('fullscreen-viewer').style.display = 'none';
            }}>
              ×
            </div>
            <div style={{
              overflow: 'auto',
              maxHeight: '90vh',
              maxWidth: '90vw',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={decodedUrl} 
                alt="Shared photo strip (fullscreen)" 
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="share-actions" style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleCopyLink}
            style={{
              backgroundColor: '#FF69B4',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📋</span> Copy Link
          </button>
          
          <button 
            onClick={() => navigate('/photobooth')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📸</span> Create Your Own
          </button>
          
          <a 
            href={decodedUrl} 
            download="photostrip.png"
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>💾</span> Download
          </a>
        </div>
        
        <div className="social-share" style={{ 
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#555', marginBottom: '15px' }}>Share on Social Media</h3>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <button 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              style={{
                backgroundColor: '#3b5998',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Facebook
            </button>
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out my photo strip!`, '_blank')}
              style={{
                backgroundColor: '#1DA1F2',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Twitter
            </button>
            <button 
              onClick={() => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(decodedUrl)}&description=My photo strip`, '_blank')}
              style={{
                backgroundColor: '#E60023',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '0px',
                cursor: 'pointer'
              }}
            >
              Pinterest
            </button>
          </div>
        </div>
        
        <div className="footer" style={{ 
          marginTop: '40px',
          textAlign: 'center',
          color: '#777',
          fontSize: '14px'
        }}>
          <p>© 2025 Picapica - Create your own photo strip memories!</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              color: '#FF69B4',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default SharePage; 