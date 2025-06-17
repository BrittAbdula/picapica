import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from "./components/Home";
import Welcome from "./components/Welcome";
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
import { isAuthenticated, getUsername, logout } from "./utils/auth";
import Clarity from "@microsoft/clarity";
import VConsoleComponent from "./utils/VConsole";
import Templates from "./components/Templates";
function App() {
	const [capturedImages, setCapturedImages] = useState([]);
	const [menuOpen, setMenuOpen] = useState(false);
	const [userAuthenticated, setUserAuthenticated] = useState(isAuthenticated());
	const [username, setUsername] = useState(getUsername());

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

	// 处理登录成功
	const handleLoginSuccess = (authData) => {
		setUserAuthenticated(true);
		setUsername(authData.username);
	};

	// 处理登出
	const handleLogout = () => {
		if (window.confirm("Are you sure you want to log out?")) {
			logout();
			setUserAuthenticated(false);
			setUsername(null);
		}
	};

	// 定义使用摄像头的路由
	const cameraRoutes = ["/photobooth"];

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<GoogleOAuthProvider clientId="462051871205-4hqqnifmm7ckp8cjn37ca0ussfa1j7g9.apps.googleusercontent.com">
			<div className="App">
				{/* 添加分析工具 */}
				<GoogleAnalytics />
				<AnalyticsTracker />
			<nav className="navbar">
				<Link to="/" className="logo-link">
					<img src="/images/picapica-icon.svg" alt="Pica Pica" className="navbar-logo" />
					<span className="site-name">Picapica.app</span>
				</Link>

				<div className="hamburger-menu" onClick={toggleMenu}>
					<div className={`hamburger-line ${menuOpen ? "open" : ""}`}></div>
					<div className={`hamburger-line ${menuOpen ? "open" : ""}`}></div>
					<div className={`hamburger-line ${menuOpen ? "open" : ""}`}></div>
				</div>

				{/* 添加独立的遮罩元素 */}
				<div
					className={`nav-backdrop ${menuOpen ? 'open' : ''}`}
					onClick={() => setMenuOpen(false)}
				></div>

				<div className={`nav-links ${menuOpen ? 'open' : ''}`}>
					<Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
					<Link to="/templates" onClick={() => setMenuOpen(false)}>Templates</Link>
					<Link to="/photobooth" onClick={() => setMenuOpen(false)}>Photobooth</Link>
					<Link to="/preview" onClick={() => setMenuOpen(false)}>Photo Preview</Link>
					<Link to="/share" onClick={() => setMenuOpen(false)}>Share</Link>
					{userAuthenticated ? (
						<>
							<Link to="/my-photos" onClick={() => setMenuOpen(false)}>My Photos</Link>
							<div className="nav-user-avatar" onClick={() => {
								handleLogout();
								setMenuOpen(false);
							}}>
								<div className="user-avatar">
									<span className="avatar-text">{username ? username.charAt(0).toUpperCase() : 'U'}</span>
								</div>
							</div>
						</>
					) : (
						<div className="nav-login">
							<GoogleLogin 
								onLoginSuccess={handleLoginSuccess}
								onLoginError={(error) => console.error('Login error:', error)}
							/>
						</div>
					)}
				</div>
			</nav>

			{/* 使用RouteGuard包裹Routes，实现路由层面的摄像头管理 */}
			<RouteGuard cameraRoutes={cameraRoutes}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/welcome" element={<Welcome />} />
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
				</Routes>
			</RouteGuard>

			<footer className="text-sm text-gray-600">
				<p>© 2025 picapica.app - The Web Photo Booth App</p>
				<Link to="/privacy-policy" onClick={() => setMenuOpen(false)}>
					Privacy Policy
				</Link>
				<Link to="/terms-of-service" onClick={() => setMenuOpen(false)} style={{ marginLeft: "10px" }}>
					Terms of Service
				</Link>
			</footer>

			{/* 添加 VConsole 组件 */}
			<VConsoleComponent />
		</div>
		</GoogleOAuthProvider>
	);
}

export default App;
