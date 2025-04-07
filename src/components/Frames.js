const FRAMES = {
	none: {
		draw: (ctx, x, y, width, height) => {}, // Empty function for no frame
	},
	pastel: {
		draw: (ctx, x, y, width, height) => {
            const description = "Pastel ......";
			const drawSticker = (x, y, type) => {
				switch (type) {
					case "star":
						ctx.fillStyle = "#FFD700";
						ctx.beginPath();
						ctx.arc(x, y, 12, 0, Math.PI * 2);
						ctx.fill();
						break;
					case "heart":
						ctx.fillStyle = "#cc8084";
						ctx.beginPath();
						const heartSize = 22;
						ctx.moveTo(x, y + heartSize / 4);
						ctx.bezierCurveTo(
							x,
							y,
							x - heartSize / 2,
							y,
							x - heartSize / 2,
							y + heartSize / 4
						);
						ctx.bezierCurveTo(
							x - heartSize / 2,
							y + heartSize / 2,
							x,
							y + heartSize * 0.75,
							x,
							y + heartSize
						);
						ctx.bezierCurveTo(
							x,
							y + heartSize * 0.75,
							x + heartSize / 2,
							y + heartSize / 2,
							x + heartSize / 2,
							y + heartSize / 4
						);
						ctx.bezierCurveTo(x + heartSize / 2, y, x, y, x, y + heartSize / 4);
						ctx.fill();
						break;
					case "flower":
						ctx.fillStyle = "#FF9BE4";
						for (let i = 0; i < 5; i++) {
							ctx.beginPath();
							const angle = (i * 2 * Math.PI) / 5;
							ctx.ellipse(
								x + Math.cos(angle) * 10,
								y + Math.sin(angle) * 10,
								8,
								8,
								0,
								0,
								2 * Math.PI
							);
							ctx.fill();
						}
						// Center of flower
						ctx.fillStyle = "#FFE4E1";
						ctx.beginPath();
						ctx.arc(x, y, 6, 0, 2 * Math.PI);
						ctx.fill();
						break;
					case "bow":
						ctx.fillStyle = "#f9cee7";
						// Left loop
						ctx.beginPath();
						ctx.ellipse(x - 10, y, 10, 6, Math.PI / 4, 0, 2 * Math.PI);
						ctx.fill();
						// Right loop
						ctx.beginPath();
						ctx.ellipse(x + 10, y, 10, 6, -Math.PI / 4, 0, 2 * Math.PI);
						ctx.fill();
						// Center knot
						ctx.fillStyle = "#e68bbe";
						ctx.beginPath();
						ctx.arc(x, y, 4, 0, 2 * Math.PI);
						ctx.fill();
						break;
				}
			};

			// Top left corner
			drawSticker(x + 11, y + 5, "bow");
			drawSticker(x - 18, y + 95, "heart");

			// Top right corner
			drawSticker(x + width - 160, y + 10, "star");
			drawSticker(x + width - 1, y + 50, "heart");

			// Bottom left corner
			drawSticker(x + 120, y + height - 20, "heart");
			drawSticker(x + 20, y + height - 20, "star");

			// Bottom right corner
			drawSticker(x + width - 125, y + height - 5, "bow");
			drawSticker(x + width - 10, y + height - 45, "heart");
		},
	},

	cute: {
		draw: (ctx, x, y, width, height) => {
			const drawStar = (centerX, centerY, size, color = "#FFD700") => {
				ctx.fillStyle = color;
				ctx.beginPath();
				for (let i = 0; i < 5; i++) {
					const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
					const point = i === 0 ? "moveTo" : "lineTo";
					ctx[point](
						centerX + size * Math.cos(angle),
						centerY + size * Math.sin(angle)
					);
				}
				ctx.closePath();
				ctx.fill();
			};

			const drawCloud = (centerX, centerY) => {
				ctx.fillStyle = "#87CEEB";
				const cloudParts = [
					{ x: 0, y: 0, r: 14 },
					{ x: -6, y: 2, r: 10 },
					{ x: 6, y: 2, r: 10 },
				];
				cloudParts.forEach((part) => {
					ctx.beginPath();
					ctx.arc(centerX + part.x, centerY + part.y, part.r, 0, Math.PI * 2);
					ctx.fill();
				});
			};

			// Draw decorations around the frame
			// Top corners
			drawStar(x + 150, y + 18, 15, "#FFD700");
			drawCloud(x + 20, y + 5);
			drawStar(x + width - 1, y + 45, 12, "#FF69B4");
			drawCloud(x + width - 80, y + 5);

			// Bottom corners
			drawCloud(x + 150, y + height - 5);
			drawStar(x + 0, y + height - 65, 15, "#9370DB");
			drawCloud(x + width - 5, y + height - 85);
			drawStar(x + width - 120, y + height - 5, 12, "#40E0D0");
		},
	},
    
	darkFairy: {
		draw: (ctx, x, y, width, height) => {
			// Twilight fairy tale theme
			const drawMoon = (centerX, centerY, size) => {
				// Glowing effect
				const gradient = ctx.createRadialGradient(
					centerX, centerY, size * 0.5,
					centerX, centerY, size * 1.5
				);
				gradient.addColorStop(0, "rgba(255, 253, 209, 0.8)");
				gradient.addColorStop(0.5, "rgba(255, 253, 209, 0.3)");
				gradient.addColorStop(1, "rgba(255, 253, 209, 0)");
				
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(centerX, centerY, size * 1.5, 0, Math.PI * 2);
				ctx.fill();
				
				// Moon
				ctx.fillStyle = "#FFFDD1";
				ctx.beginPath();
				ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
				ctx.fill();
				
				// Crescent effect
				ctx.fillStyle = "rgba(53, 28, 117, 0.9)";
				ctx.beginPath();
				ctx.arc(centerX + size * 0.3, centerY - size * 0.1, size * 0.9, 0, Math.PI * 2);
				ctx.fill();
			};
			
			const drawSparkle = (centerX, centerY, size, color) => {
				ctx.fillStyle = color;
				
				// Draw sparkle rays
				for (let i = 0; i < 4; i++) {
					ctx.beginPath();
					const angle = i * Math.PI / 2;
					ctx.moveTo(centerX, centerY);
					ctx.lineTo(
						centerX + Math.cos(angle) * size * 2,
						centerY + Math.sin(angle) * size * 2
					);
					ctx.lineTo(
						centerX + Math.cos(angle + 0.2) * size,
						centerY + Math.sin(angle + 0.2) * size
					);
					ctx.closePath();
					ctx.fill();
					
					ctx.beginPath();
					ctx.moveTo(centerX, centerY);
					ctx.lineTo(
						centerX + Math.cos(angle) * size * 2,
						centerY + Math.sin(angle) * size * 2
					);
					ctx.lineTo(
						centerX + Math.cos(angle - 0.2) * size,
						centerY + Math.sin(angle - 0.2) * size
					);
					ctx.closePath();
					ctx.fill();
				}
				
				// Center dot
				ctx.beginPath();
				ctx.arc(centerX, centerY, size * 0.5, 0, Math.PI * 2);
				ctx.fill();
			};
			
			// Draw thorny vines in corners
			const drawVine = (startX, startY, length, angle, isCurved) => {
				ctx.strokeStyle = "#452C63";
				ctx.lineWidth = 2;
				
				ctx.beginPath();
				ctx.moveTo(startX, startY);
				
				if (isCurved) {
					ctx.bezierCurveTo(
						startX + Math.cos(angle) * length * 0.3,
						startY + Math.sin(angle) * length * 0.8,
						startX + Math.cos(angle) * length * 0.7,
						startY + Math.sin(angle) * length * 0.4,
						startX + Math.cos(angle) * length,
						startY + Math.sin(angle) * length
					);
				} else {
					ctx.lineTo(
						startX + Math.cos(angle) * length,
						startY + Math.sin(angle) * length
					);
				}
				
				ctx.stroke();
				
				// Add thorns
				const thornLength = 5;
				const numThorns = Math.floor(length / 15);
				
				for (let i = 1; i <= numThorns; i++) {
					const thornStartX = startX + Math.cos(angle) * (length * i / numThorns);
					const thornStartY = startY + Math.sin(angle) * (length * i / numThorns);
					
					const thornAngle1 = angle + Math.PI * 0.5;
					const thornAngle2 = angle - Math.PI * 0.5;
					
					ctx.beginPath();
					ctx.moveTo(thornStartX, thornStartY);
					ctx.lineTo(
						thornStartX + Math.cos(thornAngle1) * thornLength,
						thornStartY + Math.sin(thornAngle1) * thornLength
					);
					ctx.stroke();
					
					ctx.beginPath();
					ctx.moveTo(thornStartX, thornStartY);
					ctx.lineTo(
						thornStartX + Math.cos(thornAngle2) * thornLength,
						thornStartY + Math.sin(thornAngle2) * thornLength
					);
					ctx.stroke();
				}
			};
			
			// Draw dark fairy elements
			drawMoon(x + 30, y + 30, 20);
			
			// Vines in corners
			drawVine(x, y, 60, Math.PI * 0.25, true);
			drawVine(x + width, y, 60, Math.PI * 0.75, true);
			drawVine(x, y + height, 60, -Math.PI * 0.25, true);
			drawVine(x + width, y + height, 60, -Math.PI * 0.75, true);
			
			// Add sparkles
			drawSparkle(x + 80, y + 20, 4, "#D6A5FF");
			drawSparkle(x + width - 40, y + 50, 3, "#A5C9FF");
			drawSparkle(x + 50, y + height - 30, 3, "#FFA5E0");
			drawSparkle(x + width - 70, y + height - 40, 4, "#FFE3A5");
		},
	},
	
	dreamyAura: {
		draw: (ctx, x, y, width, height) => {
			// 温柔梦幻的水彩渐变和微光装饰
			const drawWatercolorSplash = (cx, cy, maxRadius) => {
				const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
				gradient.addColorStop(0, "rgba(255, 192, 203, 0.5)");
				gradient.addColorStop(1, "rgba(255, 192, 203, 0)");
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
				ctx.fill();
			};
			const drawSparkle = (cx, cy, size) => {
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				ctx.beginPath();
				for(let i = 0; i < 5; i++){
					const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
					if(i === 0){
						ctx.moveTo(cx + size * Math.cos(angle), cy + size * Math.sin(angle));
					} else {
						ctx.lineTo(cx + size * Math.cos(angle), cy + size * Math.sin(angle));
					}
				}
				ctx.closePath();
				ctx.fill();
			};

			// 四边中点绘制柔和的水彩飞溅
			drawWatercolorSplash(x + width/2, y + 10, 25);
			drawWatercolorSplash(x + width/2, y + height - 10, 25);
			drawWatercolorSplash(x + 10, y + height/2, 25);
			drawWatercolorSplash(x + width - 10, y + height/2, 25);
			// 在四角添加微光星点
			drawSparkle(x + 30, y + 30, 6);
			drawSparkle(x + width - 30, y + 30, 6);
			drawSparkle(x + 30, y + height - 30, 6);
			drawSparkle(x + width - 30, y + height - 30, 6);
		},
	},
    
    minimalVibe: {
        draw: (ctx, x, y, width, height) => {
            // 简约线条装饰框架，不会遮挡中央
            
            // 设置线条样式
            ctx.strokeStyle = "#FFB6C1";
            ctx.lineWidth = 2;
            
            // 左上角装饰
            ctx.beginPath();
            ctx.moveTo(x + 20, y + 60);
            ctx.lineTo(x + 20, y + 20);
            ctx.lineTo(x + 60, y + 20);
            ctx.stroke();
            
            // 右上角装饰
            ctx.beginPath();
            ctx.moveTo(x + width - 20, y + 60);
            ctx.lineTo(x + width - 20, y + 20);
            ctx.lineTo(x + width - 60, y + 20);
            ctx.stroke();
            
            // 左下角装饰
            ctx.beginPath();
            ctx.moveTo(x + 20, y + height - 60);
            ctx.lineTo(x + 20, y + height - 20);
            ctx.lineTo(x + 60, y + height - 20);
            ctx.stroke();
            
            // 右下角装饰
            ctx.beginPath();
            ctx.moveTo(x + width - 20, y + height - 60);
            ctx.lineTo(x + width - 20, y + height - 20);
            ctx.lineTo(x + width - 60, y + height - 20);
            ctx.stroke();
            
            // 添加一些小点缀
            const starColors = ["#FFD700", "#FF85A1", "#91F5FF"];
            
            for (let i = 0; i < 3; i++) {
                const sparkleSize = 5 + Math.random() * 3;
                
                // 左边装饰
                ctx.fillStyle = starColors[i % starColors.length];
                ctx.beginPath();
                const sparkleX1 = x + 30 + i * 15;
                const sparkleY1 = y + 50 - i * 8;
                
                for (let j = 0; j < 4; j++) {
                    const angle = j * Math.PI / 2;
                    const longPoint = j % 2 === 0;
                    const radius = longPoint ? sparkleSize * 2 : sparkleSize;
                    
                    const px = sparkleX1 + Math.cos(angle) * radius;
                    const py = sparkleY1 + Math.sin(angle) * radius;
                    
                    if (j === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                
                // 右边装饰
                ctx.fillStyle = starColors[(i + 1) % starColors.length];
                ctx.beginPath();
                const sparkleX2 = x + width - 30 - i * 15;
                const sparkleY2 = y + 50 - i * 8;
                
                for (let j = 0; j < 4; j++) {
                    const angle = j * Math.PI / 2 + Math.PI / 4;
                    const longPoint = j % 2 === 0;
                    const radius = longPoint ? sparkleSize * 2 : sparkleSize;
                    
                    const px = sparkleX2 + Math.cos(angle) * radius;
                    const py = sparkleY2 + Math.sin(angle) * radius;
                    
                    if (j === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                
            }
            
            // 底部添加简约文字
            ctx.font = "italic 16px Arial";
            ctx.fillStyle = "#FF85A1";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText("✨ memories ✨", x + width/2, y + height - 10);
        }
    },
    
    floatingHearts: {
        draw: (ctx, x, y, width, height) => {
            // 漂浮爱心框架 - 仅在边缘放置元素
            
            // 绘制不同大小、透明度的爱心
            const drawHeart = (posX, posY, size, color, alpha) => {
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
                
                ctx.beginPath();
                ctx.moveTo(posX, posY + size / 4);
                ctx.bezierCurveTo(
                    posX, posY,
                    posX - size / 2, posY,
                    posX - size / 2, posY + size / 4
                );
                ctx.bezierCurveTo(
                    posX - size / 2, posY + size / 2,
                    posX, posY + size * 0.85,
                    posX, posY + size
                );
                ctx.bezierCurveTo(
                    posX, posY + size * 0.85,
                    posX + size / 2, posY + size / 2,
                    posX + size / 2, posY + size / 4
                );
                ctx.bezierCurveTo(
                    posX + size / 2, posY,
                    posX, posY,
                    posX, posY + size / 4
                );
                ctx.closePath();
                ctx.fill();
                
                // 添加高光
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
                ctx.beginPath();
                ctx.ellipse(
                    posX - size / 6, 
                    posY + size / 3, 
                    size / 8, 
                    size / 16, 
                    -Math.PI / 4, 
                    0, 
                    Math.PI * 2
                );
                ctx.fill();
            };
            
            // 心形颜色选项
            const heartColors = [
                [255, 107, 107], // 红色
                [255, 159, 191], // 粉色
                [255, 133, 161], // 深粉色
                [255, 204, 204]  // 浅粉色
            ];
            
            // 生成随机位置的心形（仅在边缘）
            const heartCount = 15;
            
            for (let i = 0; i < heartCount; i++) {
                const size = 15 + Math.random() * 20;
                const alpha = 0.6 + Math.random() * 0.4;
                const color = heartColors[Math.floor(Math.random() * heartColors.length)];
                
                // 保持边缘区域，避免遮挡中央
                let posX, posY;
                
                // 70%的几率生成在框架四周边缘，30%的几率生成在四角
                if (Math.random() < 0.7) {
                    // 四个边缘的随机位置
                    const edge = Math.floor(Math.random() * 4);
                    
                    switch(edge) {
                        case 0: // 顶部边缘
                            posX = x + size/2 + Math.random() * (width - size);
                            posY = y + size/2 + Math.random() * (height/8);
                            break;
                        case 1: // 右侧边缘
                            posX = x + width - size/2 - Math.random() * (width/8);
                            posY = y + size/2 + Math.random() * (height - size);
                            break;
                        case 2: // 底部边缘
                            posX = x + size/2 + Math.random() * (width - size);
                            posY = y + height - size/2 - Math.random() * (height/8);
                            break;
                        case 3: // 左侧边缘
                            posX = x + size/2 + Math.random() * (width/8);
                            posY = y + size/2 + Math.random() * (height - size);
                            break;
                    }
                } else {
                    // 四个角落的随机位置
                    const corner = Math.floor(Math.random() * 4);
                    
                    switch(corner) {
                        case 0: // 左上角
                            posX = x + size/2 + Math.random() * (width/5);
                            posY = y + size/2 + Math.random() * (height/5);
                            break;
                        case 1: // 右上角
                            posX = x + width - size/2 - Math.random() * (width/5);
                            posY = y + size/2 + Math.random() * (height/5);
                            break;
                        case 2: // 左下角
                            posX = x + size/2 + Math.random() * (width/5);
                            posY = y + height - size/2 - Math.random() * (height/5);
                            break;
                        case 3: // 右下角
                            posX = x + width - size/2 - Math.random() * (width/5);
                            posY = y + height - size/2 - Math.random() * (height/5);
                            break;
                    }
                }
                
                drawHeart(posX, posY, size, color, alpha);
            }
            
        }
    },
    
    japanesePurikura: {
        draw: (ctx, x, y, width, height) => {
            // 日式大头贴纯刮效果，边缘装饰丰富但中央区域保持清晰
            
            // 装饰元素函数
            const drawDecoration = (posX, posY, type, size, rotation = 0) => {
                ctx.save();
                ctx.translate(posX, posY);
                ctx.rotate(rotation);
                
                switch(type) {
                    case "star": {
                        // 星星
                        const points = 5;
                        const outerRadius = size;
                        const innerRadius = size / 2;
                        
                        ctx.fillStyle = "#FF96AD";
                        ctx.beginPath();
                        
                        for (let i = 0; i < points * 2; i++) {
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (Math.PI / points) * i;
                            const xPoint = Math.cos(angle) * radius;
                            const yPoint = Math.sin(angle) * radius;
                            
                            if (i === 0) ctx.moveTo(xPoint, yPoint);
                            else ctx.lineTo(xPoint, yPoint);
                        }
                        
                        ctx.closePath();
                        ctx.fill();
                        
                        // 添加亮点
                        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                        ctx.beginPath();
                        ctx.arc(-outerRadius/4, -outerRadius/4, outerRadius/5, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    }
                    
                    case "heart": {
                        // 心形
                        const heartSize = size;
                        
                        ctx.fillStyle = "#FF85A1";
                        ctx.beginPath();
                        ctx.moveTo(0, heartSize / 4);
                        ctx.bezierCurveTo(
                            0, 0,
                            -heartSize / 2, 0,
                            -heartSize / 2, heartSize / 4
                        );
                        ctx.bezierCurveTo(
                            -heartSize / 2, heartSize / 2,
                            0, heartSize * 0.85,
                            0, heartSize
                        );
                        ctx.bezierCurveTo(
                            0, heartSize * 0.85,
                            heartSize / 2, heartSize / 2,
                            heartSize / 2, heartSize / 4
                        );
                        ctx.bezierCurveTo(
                            heartSize / 2, 0,
                            0, 0,
                            0, heartSize / 4
                        );
                        ctx.closePath();
                        ctx.fill();
                        
                        // 添加亮点
                        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                        ctx.beginPath();
                        ctx.arc(-heartSize/5, heartSize/3, heartSize/6, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    }
                    
                    case "ribbon": {
                        // 蝴蝶结
                        ctx.fillStyle = "#AAE6FF";
                        
                        // 左侧蝴蝶结环
                        ctx.beginPath();
                        ctx.ellipse(-size/2, 0, size/2, size/3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 右侧蝴蝶结环
                        ctx.beginPath();
                        ctx.ellipse(size/2, 0, size/2, size/3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 中央结点
                        ctx.fillStyle = "#7ACEFF";
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size/4, size/4, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 丝带
                        ctx.beginPath();
                        ctx.moveTo(0, size/3);
                        ctx.quadraticCurveTo(size/4, size/2, size/3, size);
                        ctx.lineTo(size/6, size);
                        ctx.quadraticCurveTo(0, size/2, 0, size/3);
                        ctx.fill();
                        
                        ctx.beginPath();
                        ctx.moveTo(0, size/3);
                        ctx.quadraticCurveTo(-size/4, size/2, -size/3, size);
                        ctx.lineTo(-size/6, size);
                        ctx.quadraticCurveTo(0, size/2, 0, size/3);
                        ctx.fill();
                        break;
                    }
                    
                    case "crown": {
                        // 皇冠
                        ctx.fillStyle = "#FFD700";
                        
                        // 皇冠基础
                        ctx.beginPath();
                        ctx.moveTo(-size, 0);
                        ctx.lineTo(size, 0);
                        ctx.lineTo(size*0.8, -size*0.4);
                        ctx.lineTo(size*0.4, 0);
                        ctx.lineTo(0, -size*0.7);
                        ctx.lineTo(-size*0.4, 0);
                        ctx.lineTo(-size*0.8, -size*0.4);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 皇冠上的宝石
                        const gemColors = ["#FF5252", "#40C4FF", "#7CB342"];
                        
                        [-size*0.6, 0, size*0.6].forEach((xPos, index) => {
                            ctx.fillStyle = gemColors[index % gemColors.length];
                            ctx.beginPath();
                            ctx.arc(xPos, -size*0.2, size*0.15, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 宝石反光
                            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                            ctx.beginPath();
                            ctx.arc(xPos - size*0.05, -size*0.25, size*0.05, 0, Math.PI * 2);
                            ctx.fill();
                        });
                        break;
                    }
                    
                    case "sparkles": {
                        // 闪光效果
                        ctx.fillStyle = "#FFF176";
                        
                        for (let i = 0; i < 5; i++) {
                            const angle = i * Math.PI * 2 / 5;
                            const distance = size;
                            
                            // 绘制每个闪光
                            const sparkleX = Math.cos(angle) * distance;
                            const sparkleY = Math.sin(angle) * distance;
                            
                            ctx.save();
                            ctx.translate(sparkleX, sparkleY);
                            ctx.rotate(angle);
                            
                            // 十字星
                            ctx.beginPath();
                            ctx.moveTo(0, -size/4);
                            ctx.lineTo(0, size/4);
                            ctx.moveTo(-size/4, 0);
                            ctx.lineTo(size/4, 0);
                            ctx.lineWidth = size/8;
                            ctx.lineCap = "round";
                            ctx.strokeStyle = "#FFF176";
                            ctx.stroke();
                            
                            // 中心亮点
                            ctx.fillStyle = "#FFFFFF";
                            ctx.beginPath();
                            ctx.arc(0, 0, size/12, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.restore();
                        }
                        break;
                    }
                }
                
                ctx.restore();
            };
            
            // 在边缘绘制装饰，避开中央区域
            // 左上角
            drawDecoration(x + 30, y + 30, "star", 20, Math.PI / 8);
            drawDecoration(x + 60, y + 20, "sparkles", 8);
            
            // 右上角
            drawDecoration(x + width - 30, y + 30, "heart", 18, -Math.PI / 10);
            drawDecoration(x + width - 60, y + 20, "sparkles", 8);
            
            // 左下角
            drawDecoration(x + 35, y + height - 35, "ribbon", 22, Math.PI / 10);
            
            // 右下角
            drawDecoration(x + width - 35, y + height - 35, "crown", 20, -Math.PI / 12);
            
            // 边框效果 - 闪亮点缀的半透明边框
            ctx.strokeStyle = "rgba(255, 192, 203, 0.6)";
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
            ctx.setLineDash([]);
            
            // 随机添加一些装饰性文字
            if (Math.random() > 0.5) {
                const phrases = ["Kawaii", "Cute!", "BFF", "Love", "Sweet"];
                const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                
                ctx.font = "bold 16px 'Comic Sans MS', cursive";
                ctx.textAlign = "center";
                
                // 添加文字背景
                const textWidth = ctx.measureText(phrase).width;
                const textX = x + width - textWidth/2 - 40;
                const textY = y + 25;
                
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.fillRect(textX - textWidth/2 - 5, textY - 15, textWidth + 10, 25);
                
                // 添加文字
                ctx.fillStyle = "#FF85A1";
                ctx.fillText(phrase, textX, textY);
            }
        }
    },
    
    retroWave: {
        draw: (ctx, x, y, width, height) => {
            // 复古赛博朋克风格边框
            
            // 霓虹灯框架效果
            const createNeonGlow = (color, blur) => {
                ctx.shadowColor = color;
                ctx.shadowBlur = blur;
            };
            
            // 渐变网格背景 - 仅在边缘10px区域
            // 上边缘
            const topGradient = ctx.createLinearGradient(x, y, x, y + 30);
            topGradient.addColorStop(0, "rgba(255, 83, 198, 0.7)");
            topGradient.addColorStop(1, "rgba(255, 83, 198, 0)");
            
            ctx.fillStyle = topGradient;
            ctx.fillRect(x, y, width, 30);
            
            // 下边缘
            const bottomGradient = ctx.createLinearGradient(x, y + height - 30, x, y + height);
            bottomGradient.addColorStop(0, "rgba(23, 173, 255, 0)");
            bottomGradient.addColorStop(1, "rgba(23, 173, 255, 0.7)");
            
            ctx.fillStyle = bottomGradient;
            ctx.fillRect(x, y + height - 30, width, 30);
            
            // 左边缘
            const leftGradient = ctx.createLinearGradient(x, y, x + 30, y);
            leftGradient.addColorStop(0, "rgba(90, 139, 255, 0.7)");
            leftGradient.addColorStop(1, "rgba(90, 139, 255, 0)");
            
            ctx.fillStyle = leftGradient;
            ctx.fillRect(x, y, 30, height);
            
            // 右边缘
            const rightGradient = ctx.createLinearGradient(x + width - 30, y, x + width, y);
            rightGradient.addColorStop(0, "rgba(249, 88, 155, 0)");
            rightGradient.addColorStop(1, "rgba(249, 88, 155, 0.7)");
            
            ctx.fillStyle = rightGradient;
            ctx.fillRect(x + width - 30, y, 30, height);
            
            // 绘制网格线 - 仅在边缘区域
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 1;
            
            // 水平网格线 (上下边缘)
            for (let i = 0; i <= 30; i += 10) {
                // 上部边缘网格
                ctx.beginPath();
                ctx.moveTo(x, y + i);
                ctx.lineTo(x + width, y + i);
                ctx.stroke();
                
                // 下部边缘网格
                ctx.beginPath();
                ctx.moveTo(x, y + height - i);
                ctx.lineTo(x + width, y + height - i);
                ctx.stroke();
            }
            
            // 垂直网格线 (左右边缘)
            for (let i = 0; i <= 30; i += 10) {
                // 左侧边缘网格
                ctx.beginPath();
                ctx.moveTo(x + i, y);
                ctx.lineTo(x + i, y + height);
                ctx.stroke();
                
                // 右侧边缘网格
                ctx.beginPath();
                ctx.moveTo(x + width - i, y);
                ctx.lineTo(x + width - i, y + height);
                ctx.stroke();
            }
            
            // 霓虹边框
            createNeonGlow("#FF00FF", 15);
            ctx.strokeStyle = "#FF00FF";
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
            
            // 重置阴影
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            
            // 角落装饰 - 复古元素
            const drawRetroElement = (posX, posY, type) => {
                switch(type) {
                    case "triangle":
                        // 复古三角形
                        ctx.fillStyle = "#00FFFF";
                        ctx.strokeStyle = "#FF00FF";
                        ctx.lineWidth = 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(posX, posY - 15);
                        ctx.lineTo(posX + 15, posY + 10);
                        ctx.lineTo(posX - 15, posY + 10);
                        ctx.closePath();
                        
                        createNeonGlow("#00FFFF", 8);
                        ctx.fill();
                        ctx.stroke();
                        ctx.shadowColor = "transparent";
                        break;
                        
                    case "circle":
                        // 复古圆圈
                        ctx.fillStyle = "#FF00FF";
                        ctx.strokeStyle = "#00FFFF";
                        ctx.lineWidth = 2;
                        
                        ctx.beginPath();
                        ctx.arc(posX, posY, 12, 0, Math.PI * 2);
                        
                        createNeonGlow("#FF00FF", 8);
                        ctx.fill();
                        ctx.stroke();
                        ctx.shadowColor = "transparent";
                        break;
                        
                    case "square":
                        // 复古方块
                        ctx.fillStyle = "#FFFF00";
                        ctx.strokeStyle = "#FF00FF";
                        ctx.lineWidth = 2;
                        
                        createNeonGlow("#FFFF00", 8);
                        ctx.fillRect(posX - 10, posY - 10, 20, 20);
                        ctx.strokeRect(posX - 10, posY - 10, 20, 20);
                        ctx.shadowColor = "transparent";
                        break;
                }
            };
            
            // 在四个角落添加复古元素
            drawRetroElement(x + 25, y + 25, "triangle");
            drawRetroElement(x + width - 25, y + 25, "circle");
            drawRetroElement(x + 25, y + height - 25, "square");
            drawRetroElement(x + width - 25, y + height - 25, "triangle");
            
            // 底部添加年份
            ctx.font = "bold 14px 'VT323', monospace";
            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            
            createNeonGlow("#00FFFF", 5);
            ctx.fillStyle = "#00FFFF";
            ctx.fillText("2024", x + width - 15, y + height - 12);
            ctx.shadowColor = "transparent";
        }
    },
    
    memoryTape: {
        draw: (ctx, x, y, width, height) => {
            // 手账胶带风格，适合照片册或回忆录
            
            // 绘制和纸胶带，只在边缘不遮挡中央
            const drawWashiTape = (startX, startY, tapeWidth, tapeLength, angle, baseColor, pattern) => {
                ctx.save();
                ctx.translate(startX, startY);
                ctx.rotate(angle);
                
                // 基本胶带
                ctx.fillStyle = baseColor;
                ctx.fillRect(-tapeWidth/2, -tapeLength/2, tapeWidth, tapeLength);
                
                // 胶带纹理
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                
                if (pattern === "dots") {
                    // 圆点图案
                    for (let i = -tapeLength/2 + 5; i < tapeLength/2; i += 8) {
                        for (let j = -tapeWidth/2 + 4; j < tapeWidth/2; j += 8) {
                            ctx.beginPath();
                            ctx.arc(i, j, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                } else if (pattern === "stripes") {
                    // 条纹图案
                    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                    for (let i = -tapeLength/2; i < tapeLength/2; i += 7) {
                        ctx.fillRect(i, -tapeWidth/2, 4, tapeWidth);
                    }
                } else if (pattern === "grid") {
                    // 网格图案
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                    ctx.lineWidth = 1;
                    
                    // 水平线
                    for (let i = -tapeWidth/2 + 5; i < tapeWidth/2; i += 6) {
                        ctx.beginPath();
                        ctx.moveTo(-tapeLength/2, i);
                        ctx.lineTo(tapeLength/2, i);
                        ctx.stroke();
                    }
                    
                    // 垂直线
                    for (let i = -tapeLength/2 + 5; i < tapeLength/2; i += 10) {
                        ctx.beginPath();
                        ctx.moveTo(i, -tapeWidth/2);
                        ctx.lineTo(i, tapeWidth/2);
                        ctx.stroke();
                    }
                }
                
                // 胶带边缘效果 - 微透明
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.fillRect(-tapeWidth/2, -tapeLength/2, tapeWidth, 2);
                ctx.fillRect(-tapeWidth/2, tapeLength/2 - 2, tapeWidth, 2);
                
                ctx.restore();
            };
            
            // 绘制简单贴纸
            const drawSticker = (centerX, centerY, type, size) => {
                switch(type) {
                    case "memo": {
                        // 便利贴
                        ctx.fillStyle = "#FFF9C4";
                        ctx.strokeStyle = "#E6D74A";
                        ctx.lineWidth = 1;
                        
                        // 添加阴影
                        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
                        ctx.shadowBlur = 3;
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;
                        
                        // 便利贴主体 - 轻微倾斜
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(Math.PI/30);
                        
                        ctx.fillRect(-size/2, -size/2, size, size);
                        ctx.strokeRect(-size/2, -size/2, size, size);
                        
                        // 便利贴线条
                        ctx.strokeStyle = "#E6D74A";
                        ctx.lineWidth = 0.5;
                        
                        for (let i = 1; i <= 3; i++) {
                            const lineY = -size/2 + size * i / 4;
                            ctx.beginPath();
                            ctx.moveTo(-size/2 + 3, lineY);
                            ctx.lineTo(size/2 - 3, lineY);
                            ctx.stroke();
                        }
                        
                        ctx.restore();
                        
                        // 重置阴影
                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        break;
                    }
                    
                    case "flowerSticker": {
                        // 小花贴纸
                        const petalCount = 6;
                        
                        // 花瓣
                        ctx.fillStyle = "#FFB7C5";
                        
                        for (let i = 0; i < petalCount; i++) {
                            const angle = i * 2 * Math.PI / petalCount;
                            
                            ctx.save();
                            ctx.translate(centerX, centerY);
                            ctx.rotate(angle);
                            
                            // 椭圆花瓣
                            ctx.beginPath();
                            ctx.ellipse(0, -size/2, size/4, size/2, 0, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.restore();
                        }
                        
                        // 花心
                        ctx.fillStyle = "#FFEB3B";
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, size/4, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 花心纹理
                        ctx.fillStyle = "#FFC107";
                        for (let i = 0; i < 8; i++) {
                            const dotAngle = i * Math.PI / 4;
                            const dotX = centerX + Math.cos(dotAngle) * size/8;
                            const dotY = centerY + Math.sin(dotAngle) * size/8;
                            
                            ctx.beginPath();
                            ctx.arc(dotX, dotY, size/16, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                    }
                    
                    case "paperClip": {
                        // 回形针
                        ctx.strokeStyle = "#7986CB";
                        ctx.lineWidth = 3;
                        ctx.lineCap = "round";
                        
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(Math.PI/8);
                        
                        // 回形针形状
                        ctx.beginPath();
                        ctx.moveTo(-size/4, -size/2);
                        ctx.lineTo(-size/4, size/2);
                        ctx.lineTo(size/4, size/2);
                        ctx.lineTo(size/4, -size/2);
                        ctx.lineTo(-size/8, -size/2);
                        ctx.stroke();
                        
                        ctx.restore();
                        break;
                    }
                }
            };
            
            // 绘制手写文字
            const drawHandwrittenText = (text, posX, posY, color) => {
                ctx.font = "italic 16px 'Comic Sans MS', cursive";
                ctx.fillStyle = color;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, posX, posY);
            };
            
            // 在四个角落添加和纸胶带，不遮挡中央
            // 左上角胶带
            drawWashiTape(
                x + 30, 
                y, 
                30, 
                100, 
                Math.PI/2, 
                "#FFD3E0", 
                "dots"
            );
            
            // 右上角胶带
            drawWashiTape(
                x + width - 30, 
                y, 
                30, 
                100, 
                Math.PI/2, 
                "#D4E8FF", 
                "stripes"
            );
            
            // 左下角胶带
            drawWashiTape(
                x + 30, 
                y + height, 
                30, 
                100, 
                Math.PI/2, 
                "#E1BEE7", 
                "grid"
            );
            
            // 右下角胶带
            drawWashiTape(
                x + width - 30, 
                y + height, 
                30, 
                100, 
                Math.PI/2, 
                "#DCEDC8", 
                "dots"
            );
            
            // 顶部中间胶带
            drawWashiTape(
                x + width/2, 
                y, 
                40, 
                100, 
                Math.PI/2, 
                "#FFECB3", 
                "stripes"
            );
            
            // 底部中间胶带
            drawWashiTape(
                x + width/2, 
                y + height, 
                40, 
                100, 
                Math.PI/2, 
                "#B3E5FC", 
                "grid"
            );
            
            // 添加角落贴纸
            drawSticker(x + 55, y + 55, "memo", 40);
            drawSticker(x + width - 55, y + 55, "flowerSticker", 25);
            drawSticker(x + 55, y + height - 55, "paperClip", 40);
            drawSticker(x + width - 55, y + height - 55, "memo", 35);
            
            // 随机添加一些手写风格文字
            if (Math.random() > 0.5) {
                const memories = ["My day", "Love this", "Good times", "Remember", "Happy"];
                const memory = memories[Math.floor(Math.random() * memories.length)];
                
                // 随机决定文字位置，仅在边缘
                const positions = [
                    {x: x + 55, y: y + 20},
                    {x: x + width - 55, y: y + 20},
                    {x: x + 55, y: y + height - 20},
                    {x: x + width - 55, y: y + height - 20}
                ];
                
                const pos = positions[Math.floor(Math.random() * positions.length)];
                drawHandwrittenText(memory, pos.x, pos.y, "#7E57C2");
            }
        }
    },
    
    cuteDoodles: {
        draw: (ctx, x, y, width, height) => {
            // 可爱手绘涂鸦风格，保持边缘装饰
            
            // 绘制涂鸦元素
            const drawDoodle = (posX, posY, type, size, rotation = 0) => {
                ctx.save();
                ctx.translate(posX, posY);
                ctx.rotate(rotation);
                
                switch(type) {
                    case "cloud": {
                        // 云朵
                        ctx.fillStyle = "#E3F2FD";
                        ctx.strokeStyle = "#90CAF9";
                        ctx.lineWidth = 1.5;
                        
                        // 云朵形状
                        const parts = [
                            {x: 0, y: 0, r: size/2},
                            {x: -size/2, y: size/4, r: size/3},
                            {x: size/2, y: size/4, r: size/3},
                            {x: -size, y: 0, r: size/3},
                            {x: size, y: 0, r: size/3}
                        ];
                        
                        // 绘制云朵
                        ctx.beginPath();
                        parts.forEach(part => {
                            ctx.moveTo(part.x + part.r, part.y);
                            ctx.arc(part.x, part.y, part.r, 0, Math.PI * 2);
                        });
                        ctx.fill();
                        ctx.stroke();
                        
                        // 随机添加表情
                        if (Math.random() > 0.5) {
                            ctx.fillStyle = "#333";
                            
                            // 左眼
                            ctx.beginPath();
                            ctx.arc(-size/6, 0, size/12, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 右眼
                            ctx.beginPath();
                            ctx.arc(size/6, 0, size/12, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 笑容
                            ctx.beginPath();
                            ctx.arc(0, size/6, size/6, 0, Math.PI);
                            ctx.stroke();
                        }
                        break;
                    }
                    
                    case "rainbow": {
                        // 彩虹
                        const colors = [
                            "#FF5252", // 红
                            "#FF9800", // 橙
                            "#FFC107", // 黄
                            "#4CAF50", // 绿
                            "#2196F3", // 蓝
                            "#9C27B0"  // 紫
                        ];
                        
                        // 绘制彩虹弧
                        for (let i = 0; i < colors.length; i++) {
                            const arcSize = size - i * (size/colors.length);
                            
                            ctx.beginPath();
                            ctx.arc(0, size/2, arcSize, Math.PI, 0);
                            ctx.strokeStyle = colors[i];
                            ctx.lineWidth = size/colors.length;
                            ctx.stroke();
                        }
                        
                        // 添加云朵
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.arc(-size * 0.8, size/2, size/4, 0, Math.PI * 2);
                        ctx.arc(-size * 0.6, size/2 + size/8, size/5, 0, Math.PI * 2);
                        ctx.arc(size * 0.8, size/2, size/4, 0, Math.PI * 2);
                        ctx.arc(size * 0.6, size/2 + size/8, size/5, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    }
                    
                    case "star": {
                        // 星星
                        ctx.fillStyle = "#FFC107";
                        ctx.strokeStyle = "#FFA000";
                        ctx.lineWidth = 1.5;
                        
                        const points = 5;
                        const outerRadius = size;
                        const innerRadius = size/2;
                        
                        ctx.beginPath();
                        for (let i = 0; i < points * 2; i++) {
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (Math.PI / points) * i;
                            
                            const xPoint = Math.cos(angle) * radius;
                            const yPoint = Math.sin(angle) * radius;
                            
                            if (i === 0) ctx.moveTo(xPoint, yPoint);
                            else ctx.lineTo(xPoint, yPoint);
                        }
                        
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        // 随机添加表情
                        if (Math.random() > 0.5) {
                            ctx.fillStyle = "#333";
                            
                            // 左眼
                            ctx.beginPath();
                            ctx.arc(-size/5, -size/8, size/10, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 右眼
                            ctx.beginPath();
                            ctx.arc(size/5, -size/8, size/10, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 笑容
                            ctx.beginPath();
                            ctx.arc(0, size/8, size/6, 0, Math.PI);
                            ctx.stroke();
                        }
                        break;
                    }
                    
                    case "heart": {
                        // 爱心
                        ctx.fillStyle = "#F06292";
                        ctx.strokeStyle = "#EC407A";
                        ctx.lineWidth = 1.5;
                        
                        ctx.beginPath();
                        ctx.moveTo(0, size/3);
                        ctx.bezierCurveTo(
                            0, size/5,
                            -size/2, size/5,
                            -size/2, -size/3
                        );
                        ctx.bezierCurveTo(
                            -size/2, -size * 0.75,
                            0, -size * 0.75,
                            0, -size/3
                        );
                        ctx.bezierCurveTo(
                            0, -size * 0.75,
                            size/2, -size * 0.75,
                            size/2, -size/3
                        );
                        ctx.bezierCurveTo(
                            size/2, size/5,
                            0, size/5,
                            0, size/3
                        );
                        ctx.fill();
                        ctx.stroke();
                        
                        // 随机添加表情
                        if (Math.random() > 0.5) {
                            ctx.fillStyle = "#FFFFFF";
                            
                            // 左眼
                            ctx.beginPath();
                            ctx.arc(-size/6, -size/6, size/10, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 右眼
                            ctx.beginPath();
                            ctx.arc(size/6, -size/6, size/10, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 眼珠
                            ctx.fillStyle = "#333";
                            ctx.beginPath();
                            ctx.arc(-size/6, -size/6, size/20, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.beginPath();
                            ctx.arc(size/6, -size/6, size/20, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 笑容
                            ctx.beginPath();
                            ctx.arc(0, 0, size/8, 0, Math.PI);
                            ctx.stroke();
                        }
                        break;
                    }
                    
                    case "flower": {
                        // 花朵
                        const petalCount = 6;
                        
                        // 花瓣
                        ctx.fillStyle = "#CE93D8";
                        
                        for (let i = 0; i < petalCount; i++) {
                            const angle = i * 2 * Math.PI / petalCount;
                            ctx.save();
                            ctx.rotate(angle);
                            
                            ctx.beginPath();
                            ctx.ellipse(0, -size/2, size/3, size/2, 0, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.restore();
                        }
                        
                        // 花心
                        ctx.fillStyle = "#FFC107";
                        ctx.beginPath();
                        ctx.arc(0, 0, size/3, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 随机添加表情
                        if (Math.random() > 0.5) {
                            ctx.fillStyle = "#333";
                            
                            // 左眼
                            ctx.beginPath();
                            ctx.arc(-size/8, -size/12, size/12, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 右眼
                            ctx.beginPath();
                            ctx.arc(size/8, -size/12, size/12, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 笑容
                            ctx.beginPath();
                            ctx.arc(0, size/12, size/10, 0, Math.PI);
                            ctx.stroke();
                        }
                        break;
                    }
                }
                
                ctx.restore();
            };
            
            // 绘制气泡/对话框
            const drawSpeechBubble = (posX, posY, width, height, text) => {
                const cornerRadius = 10;
                
                // 气泡背景
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#BBDEFB";
                ctx.lineWidth = 2;
                
                // 绘制圆角矩形
                ctx.beginPath();
                ctx.moveTo(posX - width/2 + cornerRadius, posY - height/2);
                ctx.lineTo(posX + width/2 - cornerRadius, posY - height/2);
                ctx.quadraticCurveTo(posX + width/2, posY - height/2, posX + width/2, posY - height/2 + cornerRadius);
                ctx.lineTo(posX + width/2, posY + height/2 - cornerRadius);
                ctx.quadraticCurveTo(posX + width/2, posY + height/2, posX + width/2 - cornerRadius, posY + height/2);
                
                // 添加尖角
                if (posX < x + width/2) { // 左侧气泡
                    ctx.lineTo(posX + width/8, posY + height/2);
                    ctx.lineTo(posX, posY + height/2 + height/4);
                    ctx.lineTo(posX - width/8, posY + height/2);
                } else { // 右侧气泡
                    ctx.lineTo(posX - width/8, posY + height/2);
                    ctx.lineTo(posX, posY + height/2 + height/4);
                    ctx.lineTo(posX + width/8, posY + height/2);
                }
                
                ctx.lineTo(posX - width/2 + cornerRadius, posY + height/2);
                ctx.quadraticCurveTo(posX - width/2, posY + height/2, posX - width/2, posY + height/2 - cornerRadius);
                ctx.lineTo(posX - width/2, posY - height/2 + cornerRadius);
                ctx.quadraticCurveTo(posX - width/2, posY - height/2, posX - width/2 + cornerRadius, posY - height/2);
                ctx.closePath();
                
                // 填充和描边
                ctx.fill();
                ctx.stroke();
                
                // 添加文字
                ctx.fillStyle = "#333333";
                ctx.font = "14px 'Comic Sans MS', cursive";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, posX, posY);
            };
            
            // 背景细微纹理 - 斑点，仅在边缘
            ctx.fillStyle = "rgba(200, 200, 200, 0.1)";
            for (let i = 0; i < 100; i++) {
                const dotSize = 1 + Math.random() * 2;
                let dotX, dotY;
                
                // 确保仅在边缘区域生成斑点
                if (Math.random() < 0.5) {
                    // 水平边缘
                    dotX = x + Math.random() * width;
                    if (Math.random() < 0.5) {
                        dotY = y + Math.random() * 30; // 上边缘
                    } else {
                        dotY = y + height - Math.random() * 30; // 下边缘
                    }
                } else {
                    // 垂直边缘
                    dotY = y + Math.random() * height;
                    if (Math.random() < 0.5) {
                        dotX = x + Math.random() * 30; // 左边缘
                    } else {
                        dotX = x + width - Math.random() * 30; // 右边缘
                    }
                }
                
                ctx.beginPath();
                ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 在四个角落添加涂鸦
            drawDoodle(x + 30, y + 30, "cloud", 25, Math.PI / 10);
            drawDoodle(x + width - 30, y + 30, "star", 25, -Math.PI / 12);
            drawDoodle(x + 30, y + height - 30, "heart", 25, Math.PI / 15);
            drawDoodle(x + width - 30, y + height - 30, "flower", 25, -Math.PI / 8);
            
            // 左侧边缘加入彩虹
            drawDoodle(x, y + height/4, "rainbow", 40, -Math.PI / 2);
            
            // 右侧边缘加入云朵
            drawDoodle(x + width, y + height * 3/4, "cloud", 20, Math.PI / 8);
            
            // 随机添加语音泡泡
            if (Math.random() > 0.5) {
                const bubbleTexts = ["So cute!", "Love it!", "BFF!", "Awesome!", "Sweet!"];
                const bubbleText = bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)];
                
                // 随机决定气泡位置
                if (Math.random() > 0.5) {
                    drawSpeechBubble(x + 70, y + 60, 90, 35, bubbleText);
                } else {
                    drawSpeechBubble(x + width - 70, y + 60, 90, 35, bubbleText);
                }
            }
            
            // 轻微的粉色虚线边框
            ctx.strokeStyle = "#F8BBD0";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
            ctx.setLineDash([]);
        }
    },
    
    comicStrip: {
        draw: (ctx, x, y, width, height) => {
            // 漫画风格边框，有趣且动感
            
            // 漫画效果函数
            const drawComicElement = (posX, posY, type, size) => {
                switch(type) {
                    case "burst": {
                        // 爆炸星形
                        const points = 8 + Math.floor(Math.random() * 4);
                        const innerRadius = size * 0.5;
                        const outerRadius = size;
                        
                        ctx.fillStyle = "#FFEB3B";
                        ctx.strokeStyle = "#FFA000";
                        ctx.lineWidth = 2;
                        
                        ctx.beginPath();
                        for (let i = 0; i < points * 2; i++) {
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (Math.PI / points) * i;
                            
                            const xPoint = posX + Math.cos(angle) * radius;
                            const yPoint = posY + Math.sin(angle) * radius;
                            
                            if (i === 0) ctx.moveTo(xPoint, yPoint);
                            else ctx.lineTo(xPoint, yPoint);
                        }
                        
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        // 添加文字
                        const burstTexts = ["POW!", "BAM!", "WOW!", "ZAP!", "POP!"];
                        const burstText = burstTexts[Math.floor(Math.random() * burstTexts.length)];
                        
                        ctx.fillStyle = "#333";
                        ctx.font = "bold 18px 'Comic Sans MS', cursive";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(burstText, posX, posY);
                        break;
                    }
                    
                    case "speedlines": {
                        // 速度线
                        ctx.strokeStyle = "#333";
                        ctx.lineWidth = 1.5;
                        
                        const lineCount = 8;
                        const maxLength = size * 1.5;
                        
                        for (let i = 0; i < lineCount; i++) {
                            const angle = (i * 2 * Math.PI) / lineCount;
                            const length = size + Math.random() * size * 0.5;
                            
                            const startX = posX + Math.cos(angle) * size * 0.3;
                            const startY = posY + Math.sin(angle) * size * 0.3;
                            const endX = posX + Math.cos(angle) * length;
                            const endY = posY + Math.sin(angle) * length;
                            
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(endX, endY);
                            ctx.stroke();
                        }
                        break;
                    }
                    
                    case "soundEffect": {
                        // 音效波纹
                        ctx.strokeStyle = "#333";
                        ctx.lineWidth = 2;
                        
                        const arcCount = 3;
                        
                        for (let i = arcCount; i > 0; i--) {
                            const radius = size * i / arcCount;
                            
                            ctx.beginPath();
                            ctx.arc(posX, posY, radius, Math.PI * 0.7, Math.PI * 1.3);
                            ctx.stroke();
                        }
                        break;
                    }
                    
                    case "thoughtBubble": {
                        // 思考泡泡
                        ctx.fillStyle = "#FFF";
                        ctx.strokeStyle = "#333";
                        ctx.lineWidth = 1.5;
                        
                        // 主泡泡
                        ctx.beginPath();
                        ctx.ellipse(posX, posY - size/2, size, size * 0.7, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // 小泡泡
                        const bubbleCount = 3;
                        for (let i = 1; i <= bubbleCount; i++) {
                            const bubbleSize = size * 0.15 * (bubbleCount - i + 1) / bubbleCount;
                            const bubbleX = posX + (i % 2 === 0 ? -1 : 1) * size * 0.1;
                            const bubbleY = posY + size * 0.5 + i * size * 0.15;
                            
                            ctx.beginPath();
                            ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                        }
                        
                        // 随机添加小图标
                        const icons = ["❓", "💭", "💡", "✨", "❤️"];
                        const icon = icons[Math.floor(Math.random() * icons.length)];
                        
                        ctx.fillStyle = "#333";
                        ctx.font = `${Math.floor(size/2)}px Arial`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(icon, posX, posY - size/2);
                        break;
                    }
                }
            };
            
            // 漫画线条边框
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 3;
            
            // 使用不规则的线条绘制边框
            ctx.beginPath();
            
            // 顶部边框 - 不规则
            ctx.moveTo(x, y);
            for (let i = 0; i < 5; i++) {
                const segWidth = width / 5;
                const xPos = x + (i + 1) * segWidth;
                const yOffset = Math.random() * 6 - 3;
                ctx.lineTo(xPos, y + yOffset);
            }
            
            // 右侧边框 - 不规则
            for (let i = 0; i < 5; i++) {
                const segHeight = height / 5;
                const yPos = y + (i + 1) * segHeight;
                const xOffset = Math.random() * 6 - 3;
                ctx.lineTo(x + width + xOffset, yPos);
            }
            
            // 底部边框 - 不规则
            for (let i = 5; i > 0; i--) {
                const segWidth = width / 5;
                const xPos = x + i * segWidth;
                const yOffset = Math.random() * 6 - 3;
                ctx.lineTo(xPos, y + height + yOffset);
            }
            
            // 左侧边框 - 不规则
            for (let i = 5; i > 0; i--) {
                const segHeight = height / 5;
                const yPos = y + i * segHeight;
                const xOffset = Math.random() * 6 - 3;
                ctx.lineTo(x + xOffset, yPos);
            }
            
            ctx.closePath();
            ctx.stroke();
            
            // 角落黑色三角形 - 模拟漫画页角
            ctx.fillStyle = "#000";
            
            // 左上角
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 20, y);
            ctx.lineTo(x, y + 20);
            ctx.closePath();
            ctx.fill();
            
            // 右上角
            ctx.beginPath();
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width - 20, y);
            ctx.lineTo(x + width, y + 20);
            ctx.closePath();
            ctx.fill();
            
            // 左下角
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + 20, y + height);
            ctx.lineTo(x, y + height - 20);
            ctx.closePath();
            ctx.fill();
            
            // 右下角
            ctx.beginPath();
            ctx.moveTo(x + width, y + height);
            ctx.lineTo(x + width - 20, y + height);
            ctx.lineTo(x + width, y + height - 20);
            ctx.closePath();
            ctx.fill();
            
            // 在边缘区域添加漫画元素
            drawComicElement(x + 30, y + 30, "burst", 25);
            drawComicElement(x + width - 30, y + 30, "speedlines", 20);
            drawComicElement(x + 30, y + height - 30, "thoughtBubble", 30);
            drawComicElement(x + width - 30, y + height - 30, "soundEffect", 25);
            
            // 添加小气泡
            ctx.fillStyle = "#FFF";
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1.5;
            
            // 随机位置的小气泡
            for (let i = 0; i < 3; i++) {
                const bubbleSize = 15 + Math.random() * 10;
                let bubbleX, bubbleY;
                
                // 确保只在边缘区域
                if (Math.random() < 0.5) {
                    // 水平边缘
                    bubbleX = x + 30 + Math.random() * (width - 60);
                    if (Math.random() < 0.5) {
                        bubbleY = y + 15; // 上边缘
                    } else {
                        bubbleY = y + height - 15; // 下边缘
                    }
                } else {
                    // 垂直边缘
                    bubbleY = y + 30 + Math.random() * (height - 60);
                    if (Math.random() < 0.5) {
                        bubbleX = x + 15; // 左边缘
                    } else {
                        bubbleX = x + width - 15; // 右边缘
                    }
                }
                
                ctx.beginPath();
                ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            
            // 半色调风格的点
            ctx.fillStyle = "#333";
            for (let i = 0; i < 50; i++) {
                const dotSize = 1 + Math.random() * 3;
                let dotX, dotY;
                
                // 确保只在边缘区域
                if (Math.random() < 0.5) {
                    // 水平边缘
                    dotX = x + Math.random() * width;
                    if (Math.random() < 0.5) {
                        dotY = y + Math.random() * 30; // 上边缘
                    } else {
                        dotY = y + height - Math.random() * 30; // 下边缘
                    }
                } else {
                    // 垂直边缘
                    dotY = y + Math.random() * height;
                    if (Math.random() < 0.5) {
                        dotX = x + Math.random() * 30; // 左边缘
                    } else {
                        dotX = x + width - Math.random() * 30; // 右边缘
                    }
                }
                
                ctx.beginPath();
                ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },

    
    vaporwave: {
        draw: (ctx, x, y, width, height) => {
            // 蒸汽波美学框架 - 结合 80/90 年代复古和网络美学
            
            // 创建渐变网格背景 - 仅在边缘
            const gridSize = 20;
            const gridWidth = 2;
            ctx.strokeStyle = "rgba(255, 0, 255, 0.5)";
            ctx.lineWidth = gridWidth;
            
            // 绘制网格 - 仅在边框区域
            // 上方网格区域
            const topGridHeight = 30;
            for (let i = 0; i <= width; i += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x + i, y);
                ctx.lineTo(x + i, y + topGridHeight);
                ctx.stroke();
            }
            
            for (let j = 0; j <= topGridHeight; j += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, y + j);
                ctx.lineTo(x + width, y + j);
                ctx.stroke();
            }
            
            // 底部网格区域
            const bottomGridHeight = 30;
            for (let i = 0; i <= width; i += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x + i, y + height - bottomGridHeight);
                ctx.lineTo(x + i, y + height);
                ctx.stroke();
            }
            
            for (let j = 0; j <= bottomGridHeight; j += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, y + height - j);
                ctx.lineTo(x + width, y + height - j);
                ctx.stroke();
            }
            
            // 左方网格区域
            const leftGridWidth = 30;
            for (let i = 0; i <= leftGridWidth; i += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x + i, y);
                ctx.lineTo(x + i, y + height);
                ctx.stroke();
            }
            
            for (let j = 0; j <= height; j += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, y + j);
                ctx.lineTo(x + leftGridWidth, y + j);
                ctx.stroke();
            }
            
            // 右方网格区域
            const rightGridWidth = 30;
            for (let i = 0; i <= rightGridWidth; i += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x + width - i, y);
                ctx.lineTo(x + width - i, y + height);
                ctx.stroke();
            }
            
            for (let j = 0; j <= height; j += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x + width - rightGridWidth, y + j);
                ctx.lineTo(x + width, y + j);
                ctx.stroke();
            }
            
            // 添加霓虹效果
            ctx.shadowColor = "#FF00FF";
            ctx.shadowBlur = 15;
            
            // 霓虹边框
            ctx.strokeStyle = "#FF00FF";
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 8, y + 8, width - 16, height - 16);
            
            // 重置阴影
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            
            // 经典元素 - 石膏像
            const drawStatue = (posX, posY, size) => {
                // 简化的希腊雕塑剪影
                ctx.fillStyle = "#FFFFFF";
                
                // 头部
                ctx.beginPath();
                ctx.arc(posX, posY - size * 0.7, size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // 颈部和躯干的轮廓
                ctx.beginPath();
                ctx.moveTo(posX - size * 0.2, posY - size * 0.4);
                ctx.quadraticCurveTo(
                    posX - size * 0.25, posY, 
                    posX - size * 0.15, posY + size * 0.3
                );
                ctx.lineTo(posX + size * 0.15, posY + size * 0.3);
                ctx.quadraticCurveTo(
                    posX + size * 0.25, posY,
                    posX + size * 0.2, posY - size * 0.4
                );
                ctx.closePath();
                ctx.fill();
                
                // 基座
                ctx.fillRect(posX - size * 0.3, posY + size * 0.3, size * 0.6, size * 0.1);
            };
            
            // 绘制棕榈树
            const drawPalmTree = (posX, posY, size) => {
                // 树干
                ctx.fillStyle = "#000000";
                ctx.fillRect(posX - size * 0.1, posY, size * 0.2, size * 0.6);
                
                // 叶子
                ctx.fillStyle = "#000000";
                const leafCount = 5;
                for (let i = 0; i < leafCount; i++) {
                    const angle = (i * Math.PI) / (leafCount - 1) - Math.PI/2;
                    
                    ctx.save();
                    ctx.translate(posX, posY);
                    ctx.rotate(angle);
                    
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(
                        size * 0.3, -size * 0.2,
                        size * 0.6, 0
                    );
                    ctx.quadraticCurveTo(
                        size * 0.3, size * 0.1,
                        0, 0
                    );
                    ctx.fill();
                    
                    ctx.restore();
                }
            };
            
            // 绘制经典太阳图案
            const drawRetroSun = (posX, posY, size) => {
                // 阳光
                ctx.fillStyle = "#FF00FF";
                const rayCount = 12;
                for (let i = 0; i < rayCount; i++) {
                    const angle = (i * 2 * Math.PI) / rayCount;
                    
                    ctx.save();
                    ctx.translate(posX, posY);
                    ctx.rotate(angle);
                    
                    ctx.fillRect(-size * 0.05, -size, size * 0.1, size * 0.6);
                    
                    ctx.restore();
                }
                
                // 太阳
                ctx.fillStyle = "#00FFFF";
                ctx.beginPath();
                ctx.arc(posX, posY, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 添加装饰元素到边缘
            drawStatue(x + width - 35, y + 60, 50);
            drawPalmTree(x + 40, y + 30, 40);
            drawRetroSun(x + width/2, y + height - 25, 30);
            
            // 添加日语/希腊字符的复古文本
            const retroTexts = ["ＡＥＳＴＨＥＴＩＣ", "ｖａｐｏｒｗａｖｅ", "ノスタルジア", "サイバー", "ＲＥＴＲＯ"];
            const retroText = retroTexts[Math.floor(Math.random() * retroTexts.length)];
            
            ctx.font = "bold 18px 'Arial', sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#00FFFF";
            
            // 添加霓虹文字效果
            ctx.shadowColor = "#00FFFF";
            ctx.shadowBlur = 10;
            ctx.fillText(retroText, x + width/2, y + 22);
            
            // 重置阴影
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
        }
    },
    festivalStickers: {
        draw: (ctx, x, y, width, height) => {
            // 节日主题贴纸边框，模拟音乐节/旅行贴纸样式
            
            // 绘制贴纸
            const drawSticker = (posX, posY, type, size, rotation = 0) => {
                ctx.save();
                ctx.translate(posX, posY);
                ctx.rotate(rotation);
                
                // 添加贴纸阴影效果
                ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                switch(type) {
                    case "circleStamp": {
                        // 圆形邮戳风格贴纸
                        
                        // 背景圆
                        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
                        
                        // 随机颜色
                        const colors = [
                            ["#F48FB1", "#EC407A"], // 粉色
                            ["#90CAF9", "#2196F3"], // 蓝色
                            ["#FFCC80", "#FF9800"], // 橙色
                            ["#A5D6A7", "#4CAF50"], // 绿色
                            ["#CE93D8", "#9C27B0"]  // 紫色
                        ];
                        
                        const colorSet = colors[Math.floor(Math.random() * colors.length)];
                        
                        gradient.addColorStop(0, colorSet[0]);
                        gradient.addColorStop(1, colorSet[1]);
                        
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(0, 0, size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 边缘锯齿/邮票效果
                        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
                        ctx.lineWidth = 2;
                        ctx.setLineDash([3, 2]);
                        ctx.beginPath();
                        ctx.arc(0, 0, size * 0.9, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.setLineDash([]);
                        
                        // 中心文字
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "bold 12px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        
                        // 随机选择贴纸文字
                        const stickerTexts = ["LIVE", "FUN", "COOL", "ROCK", "LOVE", "YES"];
                        const text = stickerTexts[Math.floor(Math.random() * stickerTexts.length)];
                        
                        ctx.fillText(text, 0, 0);
                        
                        // 添加小图标
                        const icons = ["★", "♥", "♪", "✿", "✓"];
                        const icon = icons[Math.floor(Math.random() * icons.length)];
                        
                        ctx.font = "10px Arial";
                        ctx.fillText(icon, 0, size * 0.4);
                        break;
                    }
                    
                    case "flagBanner": {
                        // 旗帜横幅贴纸
                        
                        // 随机颜色
                        const bannerColors = ["#FF5252", "#FF4081", "#7C4DFF", "#536DFE", "#00B0FF", "#009688"];
                        ctx.fillStyle = bannerColors[Math.floor(Math.random() * bannerColors.length)];
                        
                        // 标记主体 - 长方形随机宽度
                        const bannerWidth = size * 1.5 + Math.random() * size;
                        const bannerHeight = size * 0.6;
                        
                        ctx.fillRect(-bannerWidth/2, -bannerHeight/2, bannerWidth, bannerHeight);
                        
                        // 三角形边缘
                        ctx.beginPath();
                        ctx.moveTo(bannerWidth/2, -bannerHeight/2);
                        ctx.lineTo(bannerWidth/2 + bannerHeight/2, 0);
                        ctx.lineTo(bannerWidth/2, bannerHeight/2);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 添加文本
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "bold 10px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        
                        // 随机选择文本
                        const texts = ["FESTIVAL", "HAPPY", "FRIENDS", "PARTY", "MEMORIES"];
                        const text = texts[Math.floor(Math.random() * texts.length)];
                        
                        ctx.fillText(text, 0, 0);
                        break;
                    }
                    
                    case "locationPin": {
                        // 位置标记贴纸
                        
                        // 随机颜色
                        const pinColors = ["#F44336", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0"];
                        ctx.fillStyle = pinColors[Math.floor(Math.random() * pinColors.length)];
                        
                        // 画定位图标
                        ctx.beginPath();
                        ctx.arc(0, -size * 0.2, size * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.5, -size * 0.2);
                        ctx.quadraticCurveTo(
                            0, size * 0.8,
                            size * 0.5, -size * 0.2
                        );
                        ctx.fill();
                        
                        // 中心圆
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.arc(0, -size * 0.2, size * 0.2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 随机添加位置代码
                        if (Math.random() > 0.5) {
                            ctx.fillStyle = "#FFFFFF";
                            ctx.font = "bold 8px Arial";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            
                            // 随机位置代码
                            const locCodes = ["NYC", "LA", "TYO", "SEL", "HKG", "LON"];
                            const locCode = locCodes[Math.floor(Math.random() * locCodes.length)];
                            
                            ctx.fillText(locCode, 0, size * 0.3);
                        }
                        break;
                    }
                    
                    case "label": {
                        // 标签贴纸
                        
                        // 随机颜色
                        const labelColors = ["#E3F2FD", "#F3E5F5", "#FBE9E7", "#F1F8E9", "#FFFDE7"];
                        ctx.fillStyle = labelColors[Math.floor(Math.random() * labelColors.length)];
                        
                        // 标签形状
                        const labelWidth = size * 1.5;
                        const labelHeight = size * 0.7;
                        const cornerRadius = 5;
                        
                        // 圆角矩形
                        ctx.beginPath();
                        ctx.moveTo(-labelWidth/2 + cornerRadius, -labelHeight/2);
                        ctx.lineTo(labelWidth/2 - cornerRadius, -labelHeight/2);
                        ctx.quadraticCurveTo(labelWidth/2, -labelHeight/2, labelWidth/2, -labelHeight/2 + cornerRadius);
                        ctx.lineTo(labelWidth/2, labelHeight/2 - cornerRadius);
                        ctx.quadraticCurveTo(labelWidth/2, labelHeight/2, labelWidth/2 - cornerRadius, labelHeight/2);
                        ctx.lineTo(-labelWidth/2 + cornerRadius, labelHeight/2);
                        ctx.quadraticCurveTo(-labelWidth/2, labelHeight/2, -labelWidth/2, labelHeight/2 - cornerRadius);
                        ctx.lineTo(-labelWidth/2, -labelHeight/2 + cornerRadius);
                        ctx.quadraticCurveTo(-labelWidth/2, -labelHeight/2, -labelWidth/2 + cornerRadius, -labelHeight/2);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 添加边框
                        ctx.strokeStyle = "#BDBDBD";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        
                        // 添加文本
                        ctx.fillStyle = "#424242";
                        ctx.font = "bold 10px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        
                        // 随机标签文本
                        const labelTexts = ["PHOTO", "#SELFIE", "MOMENTS", "ME & YOU", "BFF"];
                        const labelText = labelTexts[Math.floor(Math.random() * labelTexts.length)];
                        
                        ctx.fillText(labelText, 0, 0);
                        break;
                    }
                    
                    case "starBurst": {
                        // 星形爆炸贴纸
                        
                        // 随机颜色
                        const starColors = ["#FFC107", "#FF5722", "#2196F3", "#E91E63", "#8BC34A"];
                        ctx.fillStyle = starColors[Math.floor(Math.random() * starColors.length)];
                        
                        // 画星星
                        const points = 8;
                        const outerRadius = size;
                        const innerRadius = size * 0.4;
                        
                        ctx.beginPath();
                        for (let i = 0; i < points * 2; i++) {
                            const radius = i % 2 === 0 ? outerRadius : innerRadius;
                            const angle = (Math.PI / points) * i;
                            
                            const xPoint = Math.cos(angle) * radius;
                            const yPoint = Math.sin(angle) * radius;
                            
                            if (i === 0) ctx.moveTo(xPoint, yPoint);
                            else ctx.lineTo(xPoint, yPoint);
                        }
                        
                        ctx.closePath();
                        ctx.fill();
                        
                        // 添加边缘
                        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        
                        // 中心圆
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.arc(0, 0, innerRadius * 0.8, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 添加文本
                        ctx.fillStyle = "#333333";
                        ctx.font = "bold 12px Arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        
                        // 随机惊叹文本
                        const exclTexts = ["WOW!", "NEW!", "YES!", "FUN!", "COOL!"];
                        const exclText = exclTexts[Math.floor(Math.random() * exclTexts.length)];
                        
                        ctx.fillText(exclText, 0, 0);
                        break;
                    }
                }
                
                // 重置阴影
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                
                ctx.restore();
            };
            
            // 在边缘区域随机添加贴纸
            const edgeZones = [
                // 上边缘区域
                { 
                    minX: x + 30, 
                    maxX: x + width - 30, 
                    minY: y + 5, 
                    maxY: y + 35 
                },
                // 左边缘区域
                { 
                    minX: x + 5, 
                    maxX: x + 35, 
                    minY: y + 30, 
                    maxY: y + height - 30 
                },
                // 右边缘区域
                { 
                    minX: x + width - 35, 
                    maxX: x + width - 5, 
                    minY: y + 30, 
                    maxY: y + height - 30 
                },
                // 下边缘区域
                { 
                    minX: x + 30, 
                    maxX: x + width - 30, 
                    minY: y + height - 35, 
                    maxY: y + height - 5 
                }
            ];
            
            // 四个角落区域
            const cornerZones = [
                // 左上角
                {
                    minX: x + 5,
                    maxX: x + 50,
                    minY: y + 5,
                    maxY: y + 50
                },
                // 右上角
                {
                    minX: x + width - 50,
                    maxX: x + width - 5,
                    minY: y + 5,
                    maxY: y + 50
                },
                // 左下角
                {
                    minX: x + 5,
                    maxX: x + 50,
                    minY: y + height - 50,
                    maxY: y + height - 5
                },
                // 右下角
                {
                    minX: x + width - 50,
                    maxX: x + width - 5,
                    minY: y + height - 50,
                    maxY: y + height - 5
                }
            ];
            
            // 贴纸类型
            const stickerTypes = ["circleStamp", "flagBanner", "locationPin", "label", "starBurst"];
            
            // 在每个角落放置贴纸
            cornerZones.forEach((zone, index) => {
                const stickerType = stickerTypes[index % stickerTypes.length];
                const posX = zone.minX + (zone.maxX - zone.minX) * Math.random();
                const posY = zone.minY + (zone.maxY - zone.minY) * Math.random();
                const size = 20 + Math.random() * 10;
                const rotation = (Math.random() - 0.5) * Math.PI / 2;
                
                drawSticker(posX, posY, stickerType, size, rotation);
            });
            
            // 在边缘区域随机放置额外贴纸
            const extraStickerCount = 3 + Math.floor(Math.random() * 4); // 3-6个额外贴纸
            
            for (let i = 0; i < extraStickerCount; i++) {
                const zone = edgeZones[Math.floor(Math.random() * edgeZones.length)];
                const stickerType = stickerTypes[Math.floor(Math.random() * stickerTypes.length)];
                const posX = zone.minX + (zone.maxX - zone.minX) * Math.random();
                const posY = zone.minY + (zone.maxY - zone.minY) * Math.random();
                const size = 15 + Math.random() * 10;
                const rotation = (Math.random() - 0.5) * Math.PI;
                
                drawSticker(posX, posY, stickerType, size, rotation);
            }
            
            // 添加一个底部横幅
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fillRect(x, y + height - 20, width, 20);
            
            ctx.fillStyle = "#444444";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            // 随机标语
            const slogans = ["GOOD TIMES", "MEMORIES", "FRIENDS FOREVER", "BEST DAY EVER", "SQUAD GOALS"];
            const slogan = slogans[Math.floor(Math.random() * slogans.length)];
            
            ctx.fillText(slogan, x + width/2, y + height - 10);
        }
    },
    
    gradientBorder: {
        draw: (ctx, x, y, width, height) => {
            // 渐变边框效果，现代时尚风格
            
            // 创建随机颜色组合
            const colorSets = [
                ["#FF9A8B", "#FF6A88", "#FF99AC"], // 粉色渐变
                ["#A8EDEA", "#FED6E3"], // 冷淡渐变
                ["#5EE7DF", "#B490CA"], // 蓝紫渐变
                ["#D4FC79", "#96E6A1"], // 绿色渐变
                ["#FFD26F", "#FFBE88"], // 橙色渐变
                ["#A0FE65", "#FA016D"] // 高对比渐变
            ];
            
            const selectedColors = colorSets[Math.floor(Math.random() * colorSets.length)];
            
            // 创建边框渐变
            const createGradientBorder = (startX, startY, endX, endY, width) => {
                // 创建渐变
                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                
                for (let i = 0; i < selectedColors.length; i++) {
                    gradient.addColorStop(i / (selectedColors.length - 1), selectedColors[i]);
                }
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = width;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
            };
            
            // 绘制四周渐变边框
            // 上边框
            createGradientBorder(x, y, x + width, y, 3);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.stroke();
            
            // 右边框
            createGradientBorder(x + width, y, x + width, y + height, 3);
            ctx.beginPath();
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width, y + height);
            ctx.stroke();
            
            // 下边框
            createGradientBorder(x + width, y + height, x, y + height, 3);
            ctx.beginPath();
            ctx.moveTo(x + width, y + height);
            ctx.lineTo(x, y + height);
            ctx.stroke();
            
            // 左边框
            createGradientBorder(x, y + height, x, y, 3);
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // 添加圆角装饰
            const cornerRadius = 15;
            
            // 左上角装饰
            createGradientBorder(x, y + cornerRadius, x + cornerRadius, y, 3);
            ctx.beginPath();
            ctx.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, Math.PI * 1.5);
            ctx.stroke();
            
            // 右上角装饰
            createGradientBorder(x + width - cornerRadius, y, x + width, y + cornerRadius, 3);
            ctx.beginPath();
            ctx.arc(x + width - cornerRadius, y + cornerRadius, cornerRadius, Math.PI * 1.5, 0);
            ctx.stroke();
            
            // 右下角装饰
            createGradientBorder(x + width, y + height - cornerRadius, x + width - cornerRadius, y + height, 3);
            ctx.beginPath();
            ctx.arc(x + width - cornerRadius, y + height - cornerRadius, cornerRadius, 0, Math.PI * 0.5);
            ctx.stroke();
            
            // 左下角装饰
            createGradientBorder(x + cornerRadius, y + height, x, y + height - cornerRadius, 3);
            ctx.beginPath();
            ctx.arc(x + cornerRadius, y + height - cornerRadius, cornerRadius, Math.PI * 0.5, Math.PI);
            ctx.stroke();
            
            // 添加一些点缀元素
            const dotSize = 5;
            
            // 获取渐变作为填充色
            const fillGradient = ctx.createLinearGradient(x, y, x + width, y + height);
            for (let i = 0; i < selectedColors.length; i++) {
                fillGradient.addColorStop(i / (selectedColors.length - 1), selectedColors[i]);
            }
            
            // 在边缘随机位置添加装饰点
            for (let i = 0; i < 8; i++) {
                let dotX, dotY;
                
                // 确保点只在边缘位置
                if (i % 4 === 0) {
                    // 上边缘
                    dotX = x + width * (0.2 + Math.random() * 0.6);
                    dotY = y + dotSize * 2;
                } else if (i % 4 === 1) {
                    // 右边缘
                    dotX = x + width - dotSize * 2;
                    dotY = y + height * (0.2 + Math.random() * 0.6);
                } else if (i % 4 === 2) {
                    // 下边缘
                    dotX = x + width * (0.2 + Math.random() * 0.6);
                    dotY = y + height - dotSize * 2;
                } else {
                    // 左边缘
                    dotX = x + dotSize * 2;
                    dotY = y + height * (0.2 + Math.random() * 0.6);
                }
                
                ctx.fillStyle = fillGradient;
                ctx.beginPath();
                ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 添加一个轻微的内阴影
            const shadowWidth = 15;
            
            // 上边阴影
            const topShadow = ctx.createLinearGradient(x, y, x, y + shadowWidth);
            topShadow.addColorStop(0, "rgba(0, 0, 0, 0.1)");
            topShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.fillStyle = topShadow;
            ctx.fillRect(x, y, width, shadowWidth);
            
            // 左边阴影
            const leftShadow = ctx.createLinearGradient(x, y, x + shadowWidth, y);
            leftShadow.addColorStop(0, "rgba(0, 0, 0, 0.1)");
            leftShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.fillStyle = leftShadow;
            ctx.fillRect(x, y, shadowWidth, height);
            
            // 为边框添加轻微闪光效果
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#FFFFFF";
            
            // 左上角闪光
            ctx.beginPath();
            ctx.arc(x + cornerRadius, y + cornerRadius, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 右上角闪光
            ctx.beginPath();
            ctx.arc(x + width - cornerRadius, y + cornerRadius, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 右下角闪光
            ctx.beginPath();
            ctx.arc(x + width - cornerRadius, y + height - cornerRadius, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 左下角闪光
            ctx.beginPath();
            ctx.arc(x + cornerRadius, y + height - cornerRadius, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
        }
    },
    
    minimalCorners: {
        draw: (ctx, x, y, width, height) => {
            // 简约风格装饰角框架，类似现代设计风格
            
            // 设置线条样式
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            
            // 角落线条长度
            const cornerLength = 25;
            
            // 绘制左上角装饰
            ctx.beginPath();
            ctx.moveTo(x, y + cornerLength);
            ctx.lineTo(x, y);
            ctx.lineTo(x + cornerLength, y);
            ctx.stroke();
            
            // 绘制右上角装饰
            ctx.beginPath();
            ctx.moveTo(x + width - cornerLength, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + cornerLength);
            ctx.stroke();
            
            // 绘制右下角装饰
            ctx.beginPath();
            ctx.moveTo(x + width, y + height - cornerLength);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + width - cornerLength, y + height);
            ctx.stroke();
            
            // 绘制左下角装饰
            ctx.beginPath();
            ctx.moveTo(x + cornerLength, y + height);
            ctx.lineTo(x, y + height);
            ctx.lineTo(x, y + height - cornerLength);
            ctx.stroke();
            
            // 添加简约小装饰点，位于边缘
            const dotSize = 3;
            ctx.fillStyle = "#000000";
            
            // 上边缘装饰点
            ctx.beginPath();
            ctx.arc(x + width/4, y + dotSize * 2, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x + width * 3/4, y + dotSize * 2, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 底边缘装饰点
            ctx.beginPath();
            ctx.arc(x + width/4, y + height - dotSize * 2, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x + width * 3/4, y + height - dotSize * 2, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 左侧边缘装饰点
            ctx.beginPath();
            ctx.arc(x + dotSize * 2, y + height/4, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x + dotSize * 2, y + height * 3/4, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 右侧边缘装饰点
            ctx.beginPath();
            ctx.arc(x + width - dotSize * 2, y + height/4, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x + width - dotSize * 2, y + height * 3/4, dotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加一个半透明的灰色边缘微光效果
            ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.rect(x + 4, y + 4, width - 8, height - 8);
            ctx.stroke();
            
            // 添加一个简约的标签到底部中央
            if (Math.random() > 0.5) {
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                
                const labelWidth = 80;
                const labelHeight = 20;
                
                // 标签位置
                const labelX = x + width/2 - labelWidth/2;
                const labelY = y + height - labelHeight - 5;
                
                // 绘制标签背景
                ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
                ctx.strokeRect(labelX, labelY, labelWidth, labelHeight);
                
                // 标签文字
                const labels = ["MOMENT", "CAPTURED", "MEMORY", "PHOTO"];
                const label = labels[Math.floor(Math.random() * labels.length)];
                
                ctx.fillStyle = "#000000";
                ctx.font = "10px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, x + width/2, labelY + labelHeight/2);
            }
        }
    },
    
    colorfulConfetti: {
        draw: (ctx, x, y, width, height) => {
            // 彩色纸屑边框，庆祝/派对风格
            
            // 绘制彩色纸屑
            const drawConfetti = (posX, posY, size, color, rotation) => {
                ctx.save();
                ctx.translate(posX, posY);
                ctx.rotate(rotation);
                
                // 随机形状 - 长方形或圆形
                if (Math.random() > 0.3) {
                    // 长方形纸屑
                    ctx.fillStyle = color;
                    ctx.fillRect(-size/2, -size/4, size, size/2);
                } else {
                    // 圆形纸屑
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, size/2, size/3, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            };
            
            // 纸屑颜色组合
            const confettiColors = [
                "#FF5252", // 红
                "#FF9800", // 橙
                "#FFEB3B", // 黄
                "#4CAF50", // 绿
                "#2196F3", // 蓝
                "#9C27B0", // 紫
                "#FF4081"  // 粉
            ];
            
            // 确定哪些区域是边缘区域
            const edgeZones = [
                // 上边缘区域
                {
                    minX: x, 
                    maxX: x + width, 
                    minY: y, 
                    maxY: y + 30
                },
                // 左边缘区域
                {
                    minX: x, 
                    maxX: x + 30, 
                    minY: y, 
                    maxY: y + height
                },
                // 右边缘区域
                {
                    minX: x + width - 30, 
                    maxX: x + width, 
                    minY: y, 
                    maxY: y + height
                },
                // 下边缘区域
                {
                    minX: x, 
                    maxX: x + width, 
                    minY: y + height - 30, 
                    maxY: y + height
                }
            ];
            
            // 生成纸屑
            const confettiCount = 80; // 大量纸屑
            
            for (let i = 0; i < confettiCount; i++) {
                // 随机选择一个边缘区域
                const zone = edgeZones[Math.floor(Math.random() * edgeZones.length)];
                
                const confettiX = zone.minX + Math.random() * (zone.maxX - zone.minX);
                const confettiY = zone.minY + Math.random() * (zone.maxY - zone.minY);
                const confettiSize = 3 + Math.random() * 10;
                const confettiColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                const confettiRotation = Math.random() * Math.PI * 2;
                
                // 添加透明度变化
                const opacity = 0.7 + Math.random() * 0.3;
                const colorWithOpacity = `${confettiColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
                
                drawConfetti(confettiX, confettiY, confettiSize, colorWithOpacity, confettiRotation);
            }
            
            // 添加一些更突出的条纹纸带
            const ribbonCount = 10;
            
            for (let i = 0; i < ribbonCount; i++) {
                // 随机选择一个边缘区域
                const zone = edgeZones[Math.floor(Math.random() * edgeZones.length)];
                
                const startX = zone.minX + Math.random() * (zone.maxX - zone.minX);
                const startY = zone.minY + Math.random() * (zone.maxY - zone.minY);
                const ribbonLength = 15 + Math.random() * 25;
                const ribbonWidth = 2 + Math.random() * 3;
                const ribbonColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                const ribbonRotation = Math.random() * Math.PI * 2;
                
                // 绘制卷曲纸带
                ctx.save();
                ctx.translate(startX, startY);
                ctx.rotate(ribbonRotation);
                
                // 卷曲纸带路径
                ctx.fillStyle = ribbonColor;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                
                // 波浪形状的纸带
                for (let j = 0; j < ribbonLength; j += 5) {
                    ctx.quadraticCurveTo(
                        j + 2.5, ribbonWidth * (j % 10 === 0 ? 1 : -1),
                        j + 5, 0
                    );
                }
                
                ctx.quadraticCurveTo(
                    ribbonLength + 2.5, ribbonWidth * -1,
                    ribbonLength + 5, 0
                );
                
                // 返回路径
                for (let j = ribbonLength; j >= 0; j -= 5) {
                    ctx.quadraticCurveTo(
                        j + 2.5, ribbonWidth * (j % 10 === 0 ? -2 : 2),
                        j, ribbonWidth
                    );
                }
                
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
            }
            
            // 添加一些亮点
            ctx.fillStyle = "#FFFFFF";
            
            for (let i = 0; i < 20; i++) {
                // 随机选择一个边缘区域
                const zone = edgeZones[Math.floor(Math.random() * edgeZones.length)];
                
                const spotX = zone.minX + Math.random() * (zone.maxX - zone.minX);
                const spotY = zone.minY + Math.random() * (zone.maxY - zone.minY);
                const spotSize = 1 + Math.random() * 2;
                
                ctx.globalAlpha = 0.5 + Math.random() * 0.5;
                ctx.beginPath();
                ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
            
            // 添加薄边框增强照片区分度
            ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, width, height);
            
            // 可选：底部添加欢乐文字
            if (Math.random() > 0.5) {
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 3;
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                
                ctx.font = "bold 16px 'Comic Sans MS', cursive";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                
                // 随机庆祝文字
                const celebrationTexts = ["PARTY!", "CELEBRATE!", "FUN TIMES!", "CHEERS!", "HOORAY!"];
                const celebrationText = celebrationTexts[Math.floor(Math.random() * celebrationTexts.length)];
                
                // 描边文字效果
                ctx.strokeText(celebrationText, x + width/2, y + height - 10);
                ctx.fillText(celebrationText, x + width/2, y + height - 10);
            }
        }
    },
    colorfulDots: {
        draw: (ctx, x, y, width, height, stripColor) => {
            // 彩色圆点框架，轻松活泼
            const bgColor = stripColor || "white";
            
            // 定义与每种背景色相协调的圆点颜色
            const dotPalettes = {
                "white": ["#FF69B4", "#3498DB", "#2ECC71", "#F1C40F", "#9B59B6"],
                "black": ["#FF69B4", "#3498DB", "#2ECC71", "#F1C40F", "#9B59B6"],
                "#f6d5da": ["#D25377", "#8C3A57", "#E98195", "#FFFFFF", "#5D3754"], // Pink
                "#dde6d5": ["#5D7D50", "#2F4F2F", "#8FB07C", "#FFFFFF", "#3E5F3E"], // Green
                "#adc3e5": ["#4A6DA3", "#2A4374", "#829BC7", "#FFFFFF", "#1A355A"], // Blue
                "#FFF2CC": ["#D6A922", "#8E6C0A", "#E0C160", "#FFFFFF", "#876012"], // Yellow
                "#dbcfff": ["#7E57C2", "#4D2C91", "#A58FD8", "#FFFFFF", "#3D2076"]  // Purple
            };
            
            // 获取当前背景色的圆点调色板
            let colors = dotPalettes["white"]; // 默认
            
            if (dotPalettes[bgColor]) {
                colors = dotPalettes[bgColor];
            }
            
            // 绘制圆点边框
            const dotSize = 6;
            const dotSpacing = 15;
            
            // 计算每条边需要的点数
            const dotsH = Math.floor(width / dotSpacing);
            const dotsV = Math.floor(height / dotSpacing);
            
            // 绘制上边缘点
            for (let i = 0; i < dotsH; i++) {
                const dotX = x + (i + 0.5) * (width / dotsH);
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(dotX, y + dotSize, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制右边缘点
            for (let i = 0; i < dotsV; i++) {
                const dotY = y + (i + 0.5) * (height / dotsV);
                ctx.fillStyle = colors[(i + 1) % colors.length];
                ctx.beginPath();
                ctx.arc(x + width - dotSize, dotY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制下边缘点
            for (let i = dotsH - 1; i >= 0; i--) {
                const dotX = x + (i + 0.5) * (width / dotsH);
                ctx.fillStyle = colors[(dotsH - i) % colors.length];
                ctx.beginPath();
                ctx.arc(dotX, y + height - dotSize, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制左边缘点
            for (let i = dotsV - 1; i >= 0; i--) {
                const dotY = y + (i + 0.5) * (height / dotsV);
                ctx.fillStyle = colors[(dotsV - i + 1) % colors.length];
                ctx.beginPath();
                ctx.arc(x + dotSize, dotY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 在四个角落添加特殊大点
            const cornerDotSize = dotSize * 1.5;
            
            // 左上角
            ctx.fillStyle = colors[0];
            ctx.beginPath();
            ctx.arc(x + cornerDotSize, y + cornerDotSize, cornerDotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 右上角
            ctx.fillStyle = colors[1];
            ctx.beginPath();
            ctx.arc(x + width - cornerDotSize, y + cornerDotSize, cornerDotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 右下角
            ctx.fillStyle = colors[2];
            ctx.beginPath();
            ctx.arc(x + width - cornerDotSize, y + height - cornerDotSize, cornerDotSize, 0, Math.PI * 2);
            ctx.fill();
            
            // 左下角
            ctx.fillStyle = colors[3];
            ctx.beginPath();
            ctx.arc(x + cornerDotSize, y + height - cornerDotSize, cornerDotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    },
};

export default FRAMES;