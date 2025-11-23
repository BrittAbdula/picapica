import React, { useState } from 'react';
import { GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLogin = ({ onLoginSuccess, onLoginError }) => {
    const [isLoading, setIsLoading] = useState(false);

    // 处理Google登录成功
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);

        try {
            // 发送ID token到后端验证
            const apiResponse = await axios.post('https://api.picapica.app/api/auth/google/token', {
                idToken: credentialResponse.credential
            });

            if (apiResponse.data.token) {
                // 保存token到localStorage
                localStorage.setItem('authToken', apiResponse.data.token);
                localStorage.setItem('userId', apiResponse.data.userId);
                localStorage.setItem('username', apiResponse.data.username);

                // 调用成功回调
                if (onLoginSuccess) {
                    onLoginSuccess({
                        token: apiResponse.data.token,
                        userId: apiResponse.data.userId,
                        username: apiResponse.data.username,
                        email: apiResponse.data.email || null,
                        avatar: apiResponse.data.avatar || apiResponse.data.picture || null
                    });
                }
            }
        } catch (error) {
            console.error('Google login failed:', error);
            if (onLoginError) {
                onLoginError(error.response?.data?.error || 'Google Login Failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 处理Google登录失败
    const handleGoogleError = () => {
        console.error('Google login failed');
        if (onLoginError) {
            onLoginError('Google login failed');
        }
    };

    return (
        <div className="google-login-container">
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 24px',
                    backgroundColor: '#fff',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#3c4043',
                    minWidth: '200px'
                }}>
                    <div style={{ marginRight: '8px' }}>
                        <div
                            style={{
                                width: '18px',
                                height: '18px',
                                border: '2px solid #f3f3f3',
                                borderTop: '2px solid #4285f4',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}
                        />
                    </div>
                    Loading...
                </div>
            ) : (
                <GoogleOAuthLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={true}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="pill"
                    locale="en-US"
                />
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GoogleLogin;