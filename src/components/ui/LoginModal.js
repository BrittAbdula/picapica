import React, { useEffect } from 'react';
import GoogleLogin from '../GoogleLogin';

/**
 * Login Modal Component
 * Displays a modal with Google Login button
 */
const LoginModal = ({ isOpen, onClose, onLoginSuccess, onLoginError }) => {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-picapica-strong max-w-md w-full p-8 relative animate-fade-in-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-picapica-600 hover:text-picapica-900 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Modal Content */}
                    <div className="text-center">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-picapica-900 mb-2">
                                Welcome to Picapica
                            </h2>
                            <p className="text-picapica-700">
                                Sign in to save your photos and access them anywhere
                            </p>
                        </div>

                        {/* Google Login Button */}
                        <div className="flex justify-center mb-6">
                            <GoogleLogin
                                onLoginSuccess={(data) => {
                                    onLoginSuccess(data);
                                    onClose();
                                }}
                                onLoginError={onLoginError}
                            />
                        </div>

                        <div className="text-sm text-picapica-600">
                            By signing in, you agree to our{' '}
                            <a href="/terms-of-service" className="text-picapica-500 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy-policy" className="text-picapica-500 hover:underline">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginModal;
