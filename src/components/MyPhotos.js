import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserInfo, getAuthHeaders, logout } from '../utils/auth';
import GoogleLogin from './GoogleLogin';

const MyPhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());
    const [deleteLoading, setDeleteLoading] = useState(null);

    // 获取用户照片
    const fetchUserPhotos = async () => {
        if (!userInfo.isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('https://api.picapica.app/api/photos/user', {
                headers: getAuthHeaders()
            });
            setPhotos(response.data.photos || []);
            setError('');
        } catch (error) {
            console.error('Failed to fetch user photos:', error);
            setError('Failed to fetch user photos');
            if (error.response?.status === 401) {
                // Token过期，清除认证信息
                logout();
                setUserInfo({ isAuthenticated: false });
            }
        } finally {
            setLoading(false);
        }
    };

    // 删除照片
    const deletePhoto = async (photoId) => {
        if (!confirm('Are you sure you want to delete this photo strip? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleteLoading(photoId);
            console.log(`Deleting photo with ID: ${photoId}`);
            
            const response = await axios.delete(`https://api.picapica.app/api/photos/${photoId}`, {
                headers: getAuthHeaders()
            });
            
            console.log('Delete response:', response.data);
            
            if (response.data.success) {
                // 从本地状态中移除照片，避免重新获取
                setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
                console.log(`Successfully deleted photo ${photoId}`);
            } else {
                throw new Error('Delete operation returned false');
            }
        } catch (error) {
            console.error('Failed to delete photo:', error);
            
            let errorMessage = 'Failed to delete photo. Please try again.';
            if (error.response?.data?.error) {
                errorMessage = `Failed to delete photo: ${error.response.data.error}`;
            } else if (error.message) {
                errorMessage = `Failed to delete photo: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            setDeleteLoading(null);
        }
    };

    // 复制分享链接
    const copyShareLink = async (accessKey) => {
        const shareUrl = `https://picapica.app/share?imageurl=${encodeURIComponent(`https://picapica.app/cdn-cgi/imagedelivery/DEOVdDdfeGzASe0KdtD7FA/${accessKey}/picastrip`)}`;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                // 回退方案
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            // 简单的视觉反馈
            const button = document.getElementById(`copy-btn-${accessKey}`);
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '#007bff';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy link:', err);
            alert('Failed to copy link');
        }
    };

    // Google登录成功处理
    const handleLoginSuccess = (authData) => {
        setUserInfo({
            ...authData,
            isAuthenticated: true
        });
    };

    // Google登录失败处理
    const handleLoginError = (error) => {
        setError(error);
    };

    useEffect(() => {
        fetchUserPhotos();
    }, [userInfo.isAuthenticated]);

    if (!userInfo.isAuthenticated) {
        return (
            <div className="my-photos-login">
                <div className="login-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    padding: '20px'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#333' }}>Login to view your photos</h2>
                    <p style={{ marginBottom: '30px', color: '#666', textAlign: 'center' }}>
                        Please use Google account to login to view and manage your photos
                    </p>
                    <GoogleLogin 
                        onLoginSuccess={handleLoginSuccess}
                        onLoginError={handleLoginError}
                    />
                    {error && (
                        <div style={{
                            marginTop: '20px',
                            padding: '10px',
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            borderRadius: '4px',
                            border: '1px solid #f5c6cb'
                        }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="my-photos" style={{
            minHeight: '100vh',
            backgroundColor: '#fafbfc'
        }}>
            {/* 简洁的头部 */}
            <div className="user-header" style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #eef2f5',
                padding: '32px 24px',
                marginBottom: '40px'
            }}>
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 style={{
                            margin: '0 0 6px 0',
                            color: '#1a1d29',
                            fontSize: '32px',
                            fontWeight: '600',
                            letterSpacing: '-0.5px'
                        }}>
                            My Photos
                        </h1>
                        <p style={{
                            margin: 0,
                            color: '#6b7280',
                            fontSize: '15px',
                            fontWeight: '400'
                        }}>
                            {photos.length === 0 ? 'No photo strips yet' : `${photos.length} photo strip${photos.length !== 1 ? 's' : ''} created`}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/photobooth'}
                        style={{
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#5855eb';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#6366f1';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.2)';
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>+</span>
                        Create New
                    </button>
                </div>
            </div>

            <div className="my-photos-content" style={{ 
                padding: '0 24px 40px 24px',
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '300px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '3px solid #f1f3f4',
                            borderTop: '3px solid #6366f1',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '16px'
                        }} />
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            margin: 0
                        }}>
                            Loading your photos...
                        </p>
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        border: '1px solid #fee2e2'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '16px'
                        }}>⚠️</div>
                        <h3 style={{
                            color: '#dc2626',
                            margin: '0 0 8px 0',
                            fontSize: '18px',
                            fontWeight: '600'
                        }}>
                            Something went wrong
                        </h3>
                        <p style={{
                            color: '#6b7280',
                            margin: 0,
                            fontSize: '14px'
                        }}>
                            {error}
                        </p>
                    </div>
                ) : photos.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        border: '1px solid #f3f4f6'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto',
                            border: '1px solid #e2e8f0'
                        }}>
                            <span style={{ fontSize: '32px', opacity: 0.6 }}>📸</span>
                        </div>
                        <h3 style={{
                            color: '#1a1d29',
                            marginBottom: '8px',
                            fontSize: '20px',
                            fontWeight: '600'
                        }}>
                            Start Your Photo
                        </h3>
                        <p style={{
                            marginBottom: '32px',
                            fontSize: '15px',
                            maxWidth: '400px',
                            margin: '0 auto 32px auto',
                            lineHeight: '1.6',
                            color: '#6b7280'
                        }}>
                            Create your first photo strip to get started. Capture memories and share them with friends.
                        </p>
                        <button
                            onClick={() => window.location.href = '/photobooth'}
                            style={{
                                backgroundColor: '#6366f1',
                                color: 'white',
                                border: 'none',
                                padding: '14px 28px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#5855eb';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#6366f1';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>+</span>
                            Create First Strip
                        </button>
                    </div>
                ) : (
                    <div className="photos-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '20px'
                    }}>
                        {photos.map((photo) => (
                            <div key={photo.id} className="photo-card" style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                border: '1px solid #f3f4f6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                e.currentTarget.style.borderColor = '#f3f4f6';
                            }}>
                                <div style={{ position: 'relative', padding: '16px 16px 0 16px' }}>
                                    <div style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#f8fafc',
                                        position: 'relative'
                                    }}>
                                        <img
                                            src={photo.imageUrl}
                                            alt="Photo Strip"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                maxHeight: '350px',
                                                objectFit: 'contain',
                                                display: 'block',
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s ease'
                                            }}
                                            onClick={() => window.open(`https://picapica.app/share?imageurl=${photo.imageUrl}`, '_blank')}
                                            loading="lazy"
                                            onMouseEnter={(e) => e.target.style.opacity = '0.95'}
                                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                                        />
                                        <button
                                            onClick={() => deletePhoto(photo.id)}
                                            disabled={deleteLoading === photo.id}
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                backgroundColor: deleteLoading === photo.id ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                width: '32px',
                                                height: '32px',
                                                cursor: deleteLoading === photo.id ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                color: '#6b7280',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                transition: 'all 0.2s ease',
                                                backdropFilter: 'blur(8px)'
                                            }}
                                            title="Delete photo strip"
                                            onMouseEnter={(e) => {
                                                if (deleteLoading !== photo.id) {
                                                    e.target.style.backgroundColor = '#ef4444';
                                                    e.target.style.color = 'white';
                                                    e.target.style.transform = 'scale(1.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (deleteLoading !== photo.id) {
                                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
                                                    e.target.style.color = '#6b7280';
                                                    e.target.style.transform = 'scale(1)';
                                                }
                                            }}
                                        >
                                            {deleteLoading === photo.id ? '...' : '×'}
                                        </button>
                                        {photo.isProtected && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                left: '8px',
                                                backgroundColor: 'rgba(251, 191, 36, 0.9)',
                                                color: '#92400e',
                                                padding: '4px 8px',
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                backdropFilter: 'blur(8px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                🔒 Protected
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <p style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '13px',
                                                color: '#6b7280',
                                                fontWeight: '500'
                                            }}>
                                                {new Date(photo.timestamp).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                color: '#9ca3af'
                                            }}>
                                                {new Date(photo.timestamp).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        gap: '6px'
                                    }}>
                                        <button
                                            id={`copy-btn-${photo.accessKey}`}
                                            onClick={() => copyShareLink(photo.accessKey)}
                                            style={{
                                                backgroundColor: '#f3f4f6',
                                                color: '#374151',
                                                border: '1px solid #e5e7eb',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease',
                                                flex: 1
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#e5e7eb';
                                                e.target.style.borderColor = '#d1d5db';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                                e.target.style.borderColor = '#e5e7eb';
                                            }}
                                        >
                                            <span style={{ fontSize: '10px' }}>🔗</span>
                                            Share
                                        </button>
                                        
                                        <a
                                            href={photo.imageUrl}
                                            download={`picapica_app-${photo.id}.png`}
                                            style={{
                                                backgroundColor: '#f3f4f6',
                                                color: '#374151',
                                                border: '1px solid #e5e7eb',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#e5e7eb';
                                                e.target.style.borderColor = '#d1d5db';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                                e.target.style.borderColor = '#e5e7eb';
                                            }}
                                        >
                                            <span style={{ fontSize: '10px' }}>⬇</span>
                                            Save
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* 响应式设计 */
                @media (max-width: 768px) {
                    .photos-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    
                    .user-header {
                        padding: 24px 16px !important;
                    }
                    
                    .user-header h1 {
                        font-size: 28px !important;
                    }
                    
                    .my-photos-content {
                        padding: 0 16px 40px 16px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .user-header {
                        padding: 20px 12px !important;
                    }
                    
                    .user-header h1 {
                        font-size: 24px !important;
                    }
                    
                    .my-photos-content {
                        padding: 0 12px 30px 12px !important;
                    }
                    
                    .photos-grid {
                        gap: 12px !important;
                    }
                    
                    .photo-card > div:first-child {
                        padding: 12px 12px 0 12px !important;
                    }
                    
                    .photo-card > div:last-child {
                        padding: 16px !important;
                    }
                }
                
                /* 全局样式优化 */
                .my-photos {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .photo-card {
                    will-change: transform;
                }
                
                .photo-card img {
                    will-change: opacity;
                }
                
                /* 平滑滚动 */
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </div>
    );
};

export default MyPhotos;