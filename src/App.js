import "./App.css"; // 保留少量兼容样式
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

// 组件导入
import Home from "./components/Home";
import PhotoBooth from "./components/PhotoBooth";
import PhotoPreview from "./components/PhotoPreview";
import SharePage from "./components/SharePage";
import GalleryPage from "./components/GalleryPage";
import MyPhotos from "./components/MyPhotos";
import GoogleLogin from "./components/GoogleLogin";
import GoogleAnalytics from "./components/GoogleAnalytics";
import AnalyticsTracker from "./components/AnalyticsTracker";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import RouteGuard from "./utils/RouteGuard";
import ScrollToTop from "./utils/ScrollToTop";
import { isAuthenticated, getUsername, logout } from "./utils/auth";
import Clarity from "@microsoft/clarity";
import VConsoleComponent from "./utils/VConsole";
import Templates from "./components/Templates";
import TemplateTest from "./components/TemplateTest";
import FrameMaker from "./components/FrameMaker";
import MyFrames from "./components/MyFrames";

// 新的UI组件
import { Navbar } from "./components/ui";
import LoginModal from "./components/ui/LoginModal";

function App() {
	const location = useLocation();
	const isPhotoBooth = location.pathname === '/photobooth';

	const [capturedImages, setCapturedImages] = useState([]);
	const [userAuthenticated, setUserAuthenticated] = useState(isAuthenticated());
	const [username, setUsername] = useState(getUsername());
	const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar'));
	const [showLoginModal, setShowLoginModal] = useState(false);

	// 用户对象，用于新的Navbar组件
	const user = userAuthenticated ? {
		name: username,
		email: localStorage.getItem('userEmail'),
		avatar: userAvatar
	} : null;

	// 在组件挂载后初始化 Clarity
	useEffect(() => {
		// 延迟初始化 Clarity，让更重要的资源先加载
		const timer = setTimeout(() => {
			Clarity.init("qp466xa3k1");
		}, 2000); // 延迟 2 秒加载

		return () => clearTimeout(timer);
	}, []);

	// 监听认证状态变化
	useEffect(() => {
		const checkAuthStatus = () => {
			setUserAuthenticated(isAuthenticated());
			setUsername(getUsername());
			setUserAvatar(localStorage.getItem('userAvatar'));
		};

		// 监听storage变化
		window.addEventListener('storage', checkAuthStatus);

		// 定期检查认证状态
		const interval = setInterval(checkAuthStatus, 1000);

		return () => {
			window.removeEventListener('storage', checkAuthStatus);
			clearInterval(interval);
		};
	}, []);

	// 获取最新用户信息
	useEffect(() => {
		if (userAuthenticated) {
			const fetchUserInfo = async () => {
				try {
					const token = localStorage.getItem('authToken');
					if (!token) return;

					const response = await fetch('https://api.picapica.app/api/auth/me', {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (response.ok) {
						const data = await response.json();
						if (data.avatar) {
							localStorage.setItem('userAvatar', data.avatar);
							setUserAvatar(data.avatar);
						}
						if (data.email) {
							localStorage.setItem('userEmail', data.email);
						}
					}
				} catch (error) {
					console.error('Failed to fetch user info:', error);
				}
			};

			fetchUserInfo();
		}
	}, [userAuthenticated]);

	// 处理登录成功
	const handleLoginSuccess = (authData) => {
		// 保存额外的用户信息
		if (authData.email) {
			localStorage.setItem('userEmail', authData.email);
		}
		if (authData.avatar) {
			localStorage.setItem('userAvatar', authData.avatar);
			setUserAvatar(authData.avatar);
		}

		setUserAuthenticated(true);
		setUsername(authData.username);
		setShowLoginModal(false);
	};

	// 处理登录错误
	const handleLoginError = (error) => {
		console.error('Login error:', error);
		alert('Login failed. Please try again.');
	};

	// 处理登录 - 打开登录弹窗
	const handleLogin = () => {
		setShowLoginModal(true);
	};

	// 处理登出
	const handleLogout = () => {
		logout();
		setUserAuthenticated(false);
		setUsername(null);
		setUserAvatar(null);
	};

	// 定义使用摄像头的路由
	const cameraRoutes = ["/photobooth"];

	return (
		<GoogleOAuthProvider clientId="462051871205-4hqqnifmm7ckp8cjn37ca0ussfa1j7g9.apps.googleusercontent.com">
			<div className={`App bg-picapica-50 min-h-screen ${isPhotoBooth ? '' : 'pt-24'}`}>
				{/* 分析和工具组件 */}
				<GoogleAnalytics />
				<AnalyticsTracker />
				<ScrollToTop />

				{/* 新的Navbar组件 */}
				<Navbar
					user={user}
					onLogin={handleLogin}
					onLogout={handleLogout}
				/>

				{/* 使用RouteGuard包裹Routes，实现路由层面的摄像头管理 */}
				<RouteGuard cameraRoutes={cameraRoutes}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/photobooth"
							element={<PhotoBooth setCapturedImages={setCapturedImages} />}
						/>
						<Route
							path="/preview"
							element={<PhotoPreview capturedImages={capturedImages} />}
						/>
						<Route path="/g" element={<GalleryPage />} />
						<Route path="/share" element={<SharePage />} />
						<Route path="/my-photos" element={<MyPhotos />} />
						<Route path="/privacy-policy" element={<PrivacyPolicy />} />
						<Route path="/terms-of-service" element={<TermsOfService />} />
						<Route path="/templates" element={<Templates />} />
						<Route path="/template-test" element={<TemplateTest />} />
						<Route path="/frames" element={<Templates />} />
						<Route path="/frame-maker" element={<FrameMaker />} />
						<Route path="/my-frames" element={<MyFrames />} />
					</Routes>
				</RouteGuard>

				{/* 页脚 */}
				<footer className={`bg-picapica-100 border-t border-picapica-200 py-8 ${isPhotoBooth ? 'mt-0' : 'mt-16'}`}>
					<div className="container-main text-center">
						<p className="text-picapica-700 mb-4">
							© 2025 Picapica.app - The Web Photo Booth App
						</p>
						<div className="flex justify-center space-x-6">
							<Link
								to="/privacy-policy"
								className="text-picapica-600 hover:text-picapica-300 transition-colors duration-200"
							>
								privacy policy
							</Link>
							<Link
								to="/terms-of-service"
								className="text-picapica-600 hover:text-picapica-300 transition-colors duration-200"
							>
								terms of service
							</Link>
						</div>
					</div>
				</footer>

				{/* 添加 VConsole 组件 */}
				<VConsoleComponent />

				{/* 登录弹窗 */}
				<LoginModal
					isOpen={showLoginModal}
					onClose={() => setShowLoginModal(false)}
					onLoginSuccess={handleLoginSuccess}
					onLoginError={handleLoginError}
				/>
			</div>
		</GoogleOAuthProvider>
	);
}

export default App;
