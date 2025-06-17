import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserInfo, getAuthHeaders, logout } from '../utils/auth';
import GoogleLogin from './GoogleLogin';

const MyPhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(getUserInfo());

    // 获取用户照片
    const fetchUserPhotos = async () => {
        if (!userInfo.isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/photos/user', {
                headers: getAuthHeaders()
            });
            setPhotos(response.data.photos || []);
        } catch (error) {
            console.error('Failed to fetch user photos:', error);
            setError('Failed to fetch user photos');
            if (error.response?.status === 401) {
                // Token过期，清除认证信息
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    // 删除照片
    const deletePhoto = async (photoId) => {
        if (!confirm('Are you sure you want to delete this photo?')) {
            return;
        }

        try {
            await axios.delete(`/api/photos/${photoId}`, {
                headers: getAuthHeaders()
            });
            // 重新获取照片列表
            fetchUserPhotos();
        } catch (error) {
            console.error('Failed to delete photo:', error);
            alert('Failed to delete photo');
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

    // 处理登出
    const handleLogout = () => {
        logout();
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
        <div className="my-photos">
            <div className="my-photos-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: '1px solid #eee'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>My Photos</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                        欢迎, {userInfo.username}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Logout
                </button>
            </div>

            <div className="my-photos-content" style={{ padding: '20px' }}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #007bff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#d32f2f'
                    }}>
                        {error}
                    </div>
                ) : photos.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        <p>You haven't uploaded any photos yet</p>
                        <p>Go to the home page to upload your first photo!</p>
                    </div>
                ) : (
                    <div className="photos-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '20px'
                    }}>
                        {photos.map((photo) => (
                            <div key={photo.id} className="photo-card" style={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={photo.public_url}
                                        alt="用户照片"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <button
                                        onClick={() => deletePhoto(photo.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            color: '#d32f2f'
                                        }}
                                        title="Delete photo"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div style={{ padding: '12px' }}>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        {new Date(photo.created_at).toLocaleDateString()}
                                    </p>
                                    {photo.filter_applied && (
                                        <p style={{
                                            margin: '4px 0 0 0',
                                            fontSize: '12px',
                                            color: '#007bff'
                                        }}>
                                            滤镜: {photo.filter_applied}
                                        </p>
                                    )}
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
            `}</style>
        </div>
    );
};

export default MyPhotos;