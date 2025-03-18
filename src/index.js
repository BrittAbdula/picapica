import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App";

// 仅在开发环境和非桌面设备上启用 vConsole
if (process.env.NODE_ENV !== 'production' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	// 动态导入 vConsole
	import('vconsole').then(({ default: VConsole }) => {
		const vConsole = new VConsole();
		console.log('vConsole 已启用', vConsole);
	});
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<HelmetProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</HelmetProvider>
	</React.StrictMode>
);
