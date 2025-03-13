import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";  
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import PhotoBooth from "./components/PhotoBooth";
import PhotoPreview from "./components/PhotoPreview";
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

function App() {
	const [capturedImages, setCapturedImages] = useState([]);
	const [menuOpen, setMenuOpen] = useState(false);
	
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="App">
			<nav className="navbar">
				<Link to="/" className="logo-link">
					<img 
						src="/images/picapica-icon.svg" 
						alt="Pica Pica" 
						className="navbar-logo" 
					/>
					<span className="site-name">picapica.app</span>
				</Link>
				
				<div className="hamburger-menu" onClick={toggleMenu}>
					<div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
					<div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
					<div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
				</div>
				
				<div className={`nav-links ${menuOpen ? 'open' : ''}`}>
					<Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
					<Link to="/privacy-policy" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
					<Link to="/terms-of-service" onClick={() => setMenuOpen(false)}>Terms of Service</Link>
				</div>
			</nav>
	
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/welcome" element={<Welcome />} />
				<Route path="/photobooth" element={<PhotoBooth setCapturedImages={setCapturedImages} />} />
				<Route path="/preview" element={<PhotoPreview capturedImages={capturedImages} />} />
				<Route path="/privacy-policy" element={<PrivacyPolicy />} />
				<Route path="/terms-of-service" element={<TermsOfService />} />
			</Routes>
		</div>
	);
}

export default App;
