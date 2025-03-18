import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import PhotoBooth from "./components/PhotoBooth";
import PhotoPreview from "./components/PhotoPreview";
import SharePage from "./components/SharePage";
import GalleryPage from "./components/GalleryPage";
import GoogleAnalytics from "./components/GoogleAnalytics";
import AnalyticsTracker from "./components/AnalyticsTracker";
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import RouteGuard from './utils/RouteGuard';
import Clarity from '@microsoft/clarity';
import VConsoleComponent from './utils/VConsole';

function App() {
	const [capturedImages, setCapturedImages] = useState([]);
	const [menuOpen, setMenuOpen] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState('#ffffff');
	
	// 在组件挂载后初始化 Clarity
	useEffect(() => {
		// 延迟初始化 Clarity，让更重要的资源先加载
		const timer = setTimeout(() => {
			Clarity.init('qp466xa3k1');
		}, 2000); // 延迟 2 秒加载
		
		return () => clearTimeout(timer);
	}, []);

	// 定义使用摄像头的路由
	const cameraRoutes = ['/photobooth'];

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const handleBackgroundColorChange = (color) => {
		console.log('Background color changed:', color);
		setBackgroundColor(color);
	};

	return (
		<div className="App">
			{/* 添加分析工具 */}
			<GoogleAnalytics />
			<AnalyticsTracker />
			
			<nav className="navbar">
				<Link to="/" className="logo-link">
					<img
						src="/images/picapica-icon.svg"
						alt="Pica Pica"
						className="navbar-logo"
					/>
					<span className="site-name">Picapica.app</span>
				</Link>

				<div className="hamburger-menu" onClick={toggleMenu}>
					<div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
					<div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
					<div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
				</div>

				<div className={`nav-links ${menuOpen ? 'open' : ''}`}>
					<Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
					<Link to="/welcome" onClick={() => setMenuOpen(false)}>Welcome</Link>
					<Link to="/preview" onClick={() => setMenuOpen(false)}>Photo Preview</Link>
					<Link to="/share" onClick={() => setMenuOpen(false)}>Share</Link>
				</div>
			</nav>

			{/* 使用RouteGuard包裹Routes，实现路由层面的摄像头管理 */}
			<RouteGuard cameraRoutes={cameraRoutes}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/welcome" element={<Welcome />} />
					<Route path="/photobooth" element={<PhotoBooth setCapturedImages={setCapturedImages} handleBackgroundColorChange={handleBackgroundColorChange} />} />
					<Route path="/preview" element={<PhotoPreview capturedImages={capturedImages} />} />
					<Route path="/g" element={<GalleryPage />} />
					<Route path="/share" element={<SharePage />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
					<Route path="/terms-of-service" element={<TermsOfService />} />
				</Routes>
			</RouteGuard>

			<footer className="text-sm text-gray-600" style={{ backgroundColor: backgroundColor }}>
				<p>© 2025 picapica.app - The Web Photo Booth App</p>
					<Link to="/privacy-policy" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
					<Link to="/terms-of-service" onClick={() => setMenuOpen(false)}>Terms of Service</Link>
			</footer>

			{/* 添加 VConsole 组件 */}
			<VConsoleComponent />
		</div>
	);
}

export default App;
