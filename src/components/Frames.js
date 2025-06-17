const FRAMES = {
	none: {
		draw: (ctx, x, y, width, height) => {}, // Empty function for no frame
	},
    kawaiiDoodle: {
        draw: (ctx, x, y, width, height) => {
            // --- 辅助绘图函数 (Helper Drawing Functions) ---
    
            /**
             * 绘制脸颊腮红效果
             * @param {number} cx - 中心点 x 坐标
             * @param {number} cy - 中心点 y 坐标
             * @param {number} radius - 腮红半径
             */
            const drawCheekBlush = (cx, cy, radius) => {
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                gradient.addColorStop(0, "rgba(255, 105, 180, 0.6)"); // 中心为热粉色
                gradient.addColorStop(1, "rgba(255, 182, 193, 0)"); // 边缘为透明的浅粉色
    
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();
            };
    
            /**
             * 绘制口红印（吻痕）贴纸
             * @param {number} cx - 中心点 x 坐标
             * @param {number} cy - 中心点 y 坐标
             * @param {number} size - 大小
             * @param {number} angle - 旋转角度 (弧度)
             */
            const drawKissMark = (cx, cy, size, angle) => {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                ctx.fillStyle = "#D42A4B"; // 口红红色
    
                // 用两个椭圆模拟嘴唇上半部分
                ctx.beginPath();
                ctx.ellipse(-size * 0.5, -size * 0.2, size * 0.5, size, Math.PI * 0.1, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(size * 0.5, -size * 0.2, size * 0.5, size, -Math.PI * 0.1, 0, Math.PI * 2);
                ctx.fill();
    
                ctx.restore();
            };
    
            /**
             * 绘制可爱的颜文字表情 ( ^ ω ^ )
             * @param {number} cx - 中心点 x 坐标
             * @param {number} cy - 中心点 y 坐标
             * @param {number} size - 大小
             */
            const drawKawaiiFace = (cx, cy, size) => {
                ctx.fillStyle = "#4B4B4B"; // 深灰色用于眼睛和嘴巴
                ctx.strokeStyle = "#4B4B4B";
                ctx.lineWidth = size / 8;
                
                // 眼睛 (^)
                ctx.beginPath();
                ctx.moveTo(cx - size * 0.7, cy - size * 0.1);
                ctx.lineTo(cx - size * 0.4, cy - size * 0.5);
                ctx.lineTo(cx - size * 0.1, cy - size * 0.1);
                ctx.stroke();
    
                ctx.beginPath();
                ctx.moveTo(cx + size * 0.1, cy - size * 0.1);
                ctx.lineTo(cx + size * 0.4, cy - size * 0.5);
                ctx.lineTo(cx + size * 0.7, cy - size * 0.1);
                ctx.stroke();
    
                // 嘴巴 (ω)
                ctx.beginPath();
                ctx.arc(cx, cy + size * 0.3, size * 0.3, 0, Math.PI, false);
                ctx.stroke();
    
                // 脸颊上的小腮红
                drawCheekBlush(cx - size * 0.8, cy + size * 0.2, size * 0.4);
                drawCheekBlush(cx + size * 0.8, cy + size * 0.2, size * 0.4);
            };
    
            /**
             * 绘制手绘涂鸦风格的闪光星星
             * @param {number} cx - 中心点 x 坐标
             * @param {number} cy - 中心点 y 坐标
             * @param {number} size - 大小
             */
            const drawDoodleSparkle = (cx, cy, size) => {
                ctx.fillStyle = "#FFD700"; // 金黄色
                // 绘制一个加号形状的星星
                ctx.fillRect(cx - size / 4, cy - size, size / 2, size * 2);
                ctx.fillRect(cx - size, cy - size / 4, size * 2, size / 2);
            };
    
            // --- 开始在相框周围绘制元素 ---
    
            // 1. 虚拟妆容 - 在照片区域的左上和右上角绘制腮红
            drawCheekBlush(x + 35, y + 45, 35);
            drawCheekBlush(x + width - 35, y + 45, 35);
            
            // 2. 贴纸和表情 - 随机散落在相框周围
            // 左上角
            drawDoodleSparkle(x + 20, y + 20, 8);
    
            // 右上角
            drawKawaiiFace(x + width - 45, y + 80, 20);
    
            // 左下角
            drawKissMark(x + 40, y + height - 40, 15, -Math.PI / 8); // 轻微旋转的吻痕
    
            // 右下角
            drawDoodleSparkle(x + width - 25, y + height - 25, 12);
            drawKissMark(x + width - 90, y + height - 70, 10, Math.PI / 6);
        },
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
    darkFairy: {
        draw: (ctx, x, y, width, height) => {
            // 暮光仙境主题
            const drawMoon = (centerX, centerY, size) => {
                // 发光效果
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
                
                // 月亮
                ctx.fillStyle = "#FFFDD1";
                ctx.beginPath();
                ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
                ctx.fill();
                
                // 新月效果
                ctx.fillStyle = "rgba(53, 28, 117, 0.9)";
                ctx.beginPath();
                ctx.arc(centerX + size * 0.3, centerY - size * 0.1, size * 0.9, 0, Math.PI * 2);
                ctx.fill();
            };
            
            const drawSparkle = (centerX, centerY, size, color) => {
                ctx.fillStyle = color;
                
                // 绘制闪光光线
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
                
                // 中心点
                ctx.beginPath();
                ctx.arc(centerX, centerY, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 绘制带刺藤蔓
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
                
                // 添加刺
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
            
            // 绘制黑暗仙境元素
            drawMoon(x + 30, y + 30, 20);
            
            // 角落藤蔓
            drawVine(x, y, 60, Math.PI * 0.25, true);
            drawVine(x + width, y, 60, Math.PI * 0.75, true);
            drawVine(x, y + height, 60, -Math.PI * 0.25, true);
            drawVine(x + width, y + height, 60, -Math.PI * 0.75, true);
            
            // 添加闪光
            drawSparkle(x + 80, y + 20, 4, "#D6A5FF");
            drawSparkle(x + width - 40, y + 50, 3, "#A5C9FF");
            drawSparkle(x + 50, y + height - 30, 3, "#FFA5E0");
            drawSparkle(x + width - 70, y + height - 40, 4, "#FFE3A5");
        },
    },
    dreamyStarlight: {
        draw: (ctx, x, y, width, height) => {
            // 创建渐变星空背景
            const createStarryBackground = () => {
      const gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, "rgba(25, 25, 77, 0.6)");
      gradient.addColorStop(0.5, "rgba(65, 39, 120, 0.6)");
      gradient.addColorStop(1, "rgba(16, 24, 64, 0.6)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, height);
    };
    
    // 绘制闪烁星星
    const drawStar = (centerX, centerY, size, brightness) => {
      // 星星光晕
      const glow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size * 2
      );
      glow.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.8})`);
      glow.addColorStop(0.5, `rgba(255, 255, 255, ${brightness * 0.4})`);
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 星星中心
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.beginPath();
      
      // 创建五角星
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const pointX = centerX + Math.cos(angle) * size;
        const pointY = centerY + Math.sin(angle) * size;
        
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      
      ctx.closePath();
      ctx.fill();
    };
    
    // 绘制月亮
    const drawMoon = (centerX, centerY, size) => {
      // 月亮光晕
      const moonGlow = ctx.createRadialGradient(
        centerX, centerY, size,
        centerX, centerY, size * 2.5
      );
      moonGlow.addColorStop(0, "rgba(255, 253, 230, 0.6)");
      moonGlow.addColorStop(0.5, "rgba(255, 253, 230, 0.2)");
      moonGlow.addColorStop(1, "rgba(255, 253, 230, 0)");
      
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // 月亮本体
      ctx.fillStyle = "rgba(255, 253, 230, 0.9)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.fill();
      
      // 月亮阴影部分（弯月效果）
      ctx.fillStyle = "rgba(25, 25, 77, 0.8)";
      ctx.beginPath();
      ctx.arc(centerX + size * 0.3, centerY - size * 0.1, size * 0.95, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // 绘制流星
    const drawShootingStar = (startX, startY, length, angle, thickness) => {
      const gradient = ctx.createLinearGradient(
        startX, startY,
        startX + Math.cos(angle) * length,
        startY + Math.sin(angle) * length
      );
      
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.6, "rgba(200, 220, 255, 0.4)");
      gradient.addColorStop(1, "rgba(200, 220, 255, 0)");
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + Math.cos(angle) * length,
        startY + Math.sin(angle) * length
      );
      ctx.stroke();
    };
    
    // 开始绘制边框
    // 仅在照片边缘绘制，不遮挡主体内容
    createStarryBackground();
    
    // 在各个角落和边缘随机绘制星星
    const numStars = 35; // 星星数量
    const now = Date.now() / 1000; // 用于星星闪烁动画
    
    for (let i = 0; i < numStars; i++) {
      // 随机位置，集中在边缘
      let starX, starY;
      const edge = Math.floor(Math.random() * 4);
      
      switch (edge) {
        case 0: // 上边缘
          starX = x + Math.random() * width;
          starY = y + Math.random() * 30;
          break;
        case 1: // 右边缘
          starX = x + width - Math.random() * 30;
          starY = y + Math.random() * height;
          break;
        case 2: // 下边缘
          starX = x + Math.random() * width;
          starY = y + height - Math.random() * 30;
          break;
        case 3: // 左边缘
          starX = x + Math.random() * 30;
          starY = y + Math.random() * height;
          break;
      }
      
      // 星星大小
      const starSize = 1 + Math.random() * 3;
      
      // 闪烁效果 - 使用正弦函数使亮度随时间变化
      const flickerSpeed = 0.3 + Math.random() * 1.5;
      const brightness = 0.5 + 0.5 * Math.sin(now * flickerSpeed + i);
      
      drawStar(starX, starY, starSize, brightness);
    }
    
    // 添加几个特别大而亮的星星作为焦点
    const specialStars = [
      { x: x + 25, y: y + 35, size: 4 },
      { x: x + width - 30, y: y + 25, size: 5 },
      { x: x + 65, y: y + height - 25, size: 4.5 },
      { x: x + width - 55, y: y + height - 30, size: 5.5 }
    ];
    
    specialStars.forEach(star => {
      // 使用较慢的闪烁速度
      const brightness = 0.7 + 0.3 * Math.sin(now * 0.5);
      drawStar(star.x, star.y, star.size, brightness);
    });
    
    // 添加月亮在右上角
    drawMoon(x + width - 40, y + 40, 20);
    
    // 添加流星 - 角度和位置略有随机
    drawShootingStar(x + 100, y + 20, 80, Math.PI * 1.65, 2);
    drawShootingStar(x + width - 130, y + height - 40, 60, Math.PI * 0.7, 1.5);
    
    // 添加星云效果点缀
    ctx.fillStyle = "rgba(180, 180, 255, 0.1)";
    ctx.beginPath();
    ctx.ellipse(x + 50, y + height - 70, 60, 40, Math.PI * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "rgba(255, 200, 255, 0.1)";
            ctx.beginPath();
            ctx.ellipse(x + width - 70, y + 60, 50, 30, Math.PI * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    glamGirlChic:{
        draw: (ctx, x, y, width, height) => {
            // 定义颜色调色板 - 明亮少女色系
            const colors = {
              pinks: ["#FF80B3", "#FF3385", "#FF69B4", "#FF0066"],
              pastels: ["#FFCCE5", "#FFE6F2", "#FFF0F5", "#FFCCFF"],
              golds: ["#FFD700", "#FFC125", "#F0E68C", "#FFDF00"]
            };
            
            // 辅助函数 - 获取随机项
            const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
            
            // 辅助函数 - 获取随机数
            const random = (min, max) => min + Math.random() * (max - min);
            
            // 全局样式设定 - 只设置一次，用于所有四张照片
            const globalStyle = {
              // 基础背景颜色
              bgColorStart: getRandomItem(colors.pastels),
              bgColorEnd: getRandomItem(colors.pinks),
              // 边框颜色
              borderColor: Math.random() < 0.7 ? getRandomItem(colors.golds) : "#E0E0E0",
              // 随机样式选择
              useDottedBorder: Math.random() < 0.5,
              // 唇印颜色
              lipColor: getRandomItem(colors.pinks),
              // 装饰元素数量
              numLipprints: Math.floor(random(3, 6)), 
              numDiamonds: Math.floor(random(3, 5)),
              numStars: Math.floor(random(4, 7))
            };
            
            // 设置随机种子元素位置 - 只会计算一次位置，然后四张照片用相同位置
            const decorationPositions = {
              lipprints: [],
              diamonds: [],
              stars: []
            };
            
            // 预先计算装饰元素位置，集中在边缘
            // 唇印位置
            for (let i = 0; i < globalStyle.numLipprints; i++) {
              const side = Math.floor(random(0, 4)); // 0=上, 1=右, 2=下, 3=左
              let posX, posY, rotation;
              
              switch (side) {
                case 0: // 上边缘
                  posX = random(0.1, 0.9) * width;
                  posY = random(10, 25);
                  rotation = random(-0.2, 0.2);
                  break;
                case 1: // 右边缘
                  posX = width - random(10, 25);
                  posY = random(0.1, 0.9) * height;
                  rotation = Math.PI/2 + random(-0.2, 0.2);
                  break;
                case 2: // 下边缘
                  posX = random(0.1, 0.9) * width;
                  posY = height - random(10, 25);
                  rotation = random(-0.2, 0.2);
                  break;
                case 3: // 左边缘
                  posX = random(10, 25);
                  posY = random(0.1, 0.9) * height;
                  rotation = -Math.PI/2 + random(-0.2, 0.2);
                  break;
              }
              
              decorationPositions.lipprints.push({
                x: posX, y: posY, rotation, 
                size: random(10, 15),
                opacity: random(0.7, 1)
              });
            }
            
            // 钻石位置
            for (let i = 0; i < globalStyle.numDiamonds; i++) {
              const corner = i % 4; // 确保每个角落都有
              let posX, posY;
              
              switch (corner) {
                case 0: // 左上角
                  posX = random(20, 60);
                  posY = random(20, 60);
                  break;
                case 1: // 右上角
                  posX = width - random(20, 60);
                  posY = random(20, 60);
                  break;
                case 2: // 左下角
                  posX = random(20, 60);
                  posY = height - random(20, 60);
                  break;
                case 3: // 右下角
                  posX = width - random(20, 60);
                  posY = height - random(20, 60);
                  break;
              }
              
              decorationPositions.diamonds.push({
                x: posX, y: posY, 
                size: random(8, 12)
              });
            }
            
            // 星星位置
            for (let i = 0; i < globalStyle.numStars; i++) {
              const side = Math.floor(random(0, 4));
              let posX, posY;
              
              switch (side) {
                case 0: // 上边缘
                  posX = random(0.2, 0.8) * width;
                  posY = random(5, 20);
                  break;
                case 1: // 右边缘
                  posX = width - random(5, 20);
                  posY = random(0.2, 0.8) * height;
                  break;
                case 2: // 下边缘
                  posX = random(0.2, 0.8) * width;
                  posY = height - random(5, 20);
                  break;
                case 3: // 左边缘
                  posX = random(5, 20);
                  posY = random(0.2, 0.8) * height;
                  break;
              }
              
              decorationPositions.stars.push({
                x: posX, y: posY, 
                size: random(7, 12),
                color: Math.random() < 0.6 ? 
                  getRandomItem(colors.golds) : 
                  getRandomItem(colors.pinks) + "B3" // 加透明度
              });
            }
            
            // 绘制背景
            const createBackground = () => {
              // 创建粉色渐变背景
              const bgGradient = ctx.createLinearGradient(x, y, x + width, y + height);
              bgGradient.addColorStop(0, `${globalStyle.bgColorStart}40`); // 40 = 25% 透明度
              bgGradient.addColorStop(1, `${globalStyle.bgColorEnd}40`);
              
              ctx.fillStyle = bgGradient;
              ctx.fillRect(x, y, width, height);
            };
            
            // 绘制边框
            const drawBorder = () => {
              ctx.strokeStyle = globalStyle.borderColor;
              ctx.lineWidth = 2.5;
              
              if (globalStyle.useDottedBorder) {
                // 虚线边框
                ctx.setLineDash([8, 5]);
              } else {
                // 实线边框
                ctx.setLineDash([]);
              }
              
              // 绘制边框
              ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
              
              // 重置虚线设置，避免影响其他绘制
              ctx.setLineDash([]);
              
              // 绘制角落装饰
              ctx.beginPath();
              const cornerSize = 15;
              
              // 左上角装饰
              ctx.moveTo(x + 5, y + cornerSize + 5);
              ctx.lineTo(x + 5, y + 5);
              ctx.lineTo(x + cornerSize + 5, y + 5);
              
              // 右上角装饰
              ctx.moveTo(x + width - cornerSize - 5, y + 5);
              ctx.lineTo(x + width - 5, y + 5);
              ctx.lineTo(x + width - 5, y + cornerSize + 5);
              
              // 左下角装饰
              ctx.moveTo(x + 5, y + height - cornerSize - 5);
              ctx.lineTo(x + 5, y + height - 5);
              ctx.lineTo(x + cornerSize + 5, y + height - 5);
              
              // 右下角装饰
              ctx.moveTo(x + width - cornerSize - 5, y + height - 5);
              ctx.lineTo(x + width - 5, y + height - 5);
              ctx.lineTo(x + width - 5, y + height - cornerSize - 5);
              
              ctx.stroke();
            };
            
            // 绘制唇印
            const drawLipstickKiss = (centerX, centerY, size, rotation, opacity) => {
              ctx.save();
              ctx.translate(centerX, centerY);
              ctx.rotate(rotation);
              
              // 唇印形状
              ctx.fillStyle = `${globalStyle.lipColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
              ctx.beginPath();
              
              // 上唇
              ctx.moveTo(-size * 0.5, 0);
              ctx.bezierCurveTo(
                -size * 0.4, -size * 0.3,
                -size * 0.1, -size * 0.4,
                0, -size * 0.3
              );
              ctx.bezierCurveTo(
                size * 0.1, -size * 0.4,
                size * 0.4, -size * 0.3,
                size * 0.5, 0
              );
              
              // 下唇
              ctx.bezierCurveTo(
                size * 0.4, size * 0.5,
                size * 0.1, size * 0.6,
                0, size * 0.5
              );
              ctx.bezierCurveTo(
                -size * 0.1, size * 0.6,
                -size * 0.4, size * 0.5,
                -size * 0.5, 0
              );
              
              ctx.closePath();
              ctx.fill();
              
              // 添加高光
              ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
              ctx.beginPath();
              ctx.ellipse(-size * 0.2, -size * 0.1, size * 0.15, size * 0.05, 0, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.restore();
            };
            
            // 绘制钻石
            const drawDiamond = (centerX, centerY, size) => {
              // 钻石顶部
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size);
              ctx.lineTo(centerX - size * 0.8, centerY);
              ctx.lineTo(centerX + size * 0.8, centerY);
              ctx.closePath();
              ctx.fill();
              
              // 钻石底部
              ctx.fillStyle = "rgba(200, 220, 255, 0.8)";
              ctx.beginPath();
              ctx.moveTo(centerX, centerY + size);
              ctx.lineTo(centerX - size * 0.8, centerY);
              ctx.lineTo(centerX + size * 0.8, centerY);
              ctx.closePath();
              ctx.fill();
              
              // 钻石左侧
              ctx.fillStyle = "rgba(160, 200, 255, 0.8)";
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size);
              ctx.lineTo(centerX - size * 0.8, centerY);
              ctx.lineTo(centerX, centerY + size);
              ctx.closePath();
              ctx.fill();
              
              // 钻石右侧
              ctx.fillStyle = "rgba(220, 240, 255, 0.8)";
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size);
              ctx.lineTo(centerX + size * 0.8, centerY);
              ctx.lineTo(centerX, centerY + size);
              ctx.closePath();
              ctx.fill();
              
              // 钻石高光
              ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size * 0.7);
              ctx.lineTo(centerX - size * 0.2, centerY - size * 0.4);
              ctx.lineTo(centerX, centerY - size * 0.2);
              ctx.lineTo(centerX + size * 0.2, centerY - size * 0.4);
              ctx.closePath();
              ctx.fill();
            };
            
            // 绘制星星
            const drawStar = (centerX, centerY, size, color) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              
              for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const outerX = centerX + Math.cos(angle) * size;
                const outerY = centerY + Math.sin(angle) * size;
                
                if (i === 0) {
                  ctx.moveTo(outerX, outerY);
                } else {
                  ctx.lineTo(outerX, outerY);
                }
                
                // 内部点
                const innerAngle = angle + Math.PI / 5;
                const innerX = centerX + Math.cos(innerAngle) * (size * 0.4);
                const innerY = centerY + Math.sin(innerAngle) * (size * 0.4);
                ctx.lineTo(innerX, innerY);
              }
              
              ctx.closePath();
              ctx.fill();
            };
            
            // 添加闪光效果
            const drawGlitter = () => {
              const numGlitters = 25; // 减少数量，保持简洁
              const now = Date.now() / 1000;
              
              for (let i = 0; i < numGlitters; i++) {
                // 随机位置，在边缘分布更多
                let glitterX, glitterY;
                
                if (Math.random() < 0.8) {
                  // 边缘区域
                  const edge = Math.floor(Math.random() * 4);
                  const offset = 25;
                  
                  switch (edge) {
                    case 0: // 上边缘
                      glitterX = x + random(0, width);
                      glitterY = y + random(0, offset);
                      break;
                    case 1: // 右边缘
                      glitterX = x + width - random(0, offset);
                      glitterY = y + random(0, height);
                      break;
                    case 2: // 下边缘
                      glitterX = x + random(0, width);
                      glitterY = y + height - random(0, offset);
                      break;
                    case 3: // 左边缘
                      glitterX = x + random(0, offset);
                      glitterY = y + random(0, height);
                      break;
                  }
                } else {
                  // 随机位置
                  glitterX = x + random(0, width);
                  glitterY = y + random(0, height);
                }
                
                // 闪烁效果 - 使用正弦函数
                const flickerSpeed = 0.5 + Math.random() * 1.5;
                const brightness = 0.3 + 0.7 * Math.abs(Math.sin(now * flickerSpeed + i));
                
                // 随机颜色 - 金色或银色
                const glitterColor = Math.random() < 0.7 ? 
                  `rgba(255, 215, 0, ${brightness})` : 
                  `rgba(230, 230, 230, ${brightness})`;
                
                // 闪光大小
                const glitterSize = 1 + Math.random() * 2;
                
                // 绘制闪光点
                ctx.fillStyle = glitterColor;
                ctx.beginPath();
                ctx.arc(glitterX, glitterY, glitterSize, 0, Math.PI * 2);
                ctx.fill();
              }
            };
            
            // 开始绘制帧
            createBackground();
            drawBorder();
            
            // 绘制所有预置的装饰元素
            decorationPositions.lipprints.forEach(lip => {
              drawLipstickKiss(x + lip.x, y + lip.y, lip.size, lip.rotation, lip.opacity);
            });
            
            decorationPositions.diamonds.forEach(diamond => {
              drawDiamond(x + diamond.x, y + diamond.y, diamond.size);
            });
            
            decorationPositions.stars.forEach(star => {
              drawStar(x + star.x, y + star.y, star.size, star.color);
            });
            
            // 添加闪光效果
            drawGlitter();
          }
    },
    kpopVibes: {
        description: "Soft gradients, sparkling stars, and cute hearts inspired by K-Pop aesthetics.",
        draw: (ctx, x, y, width, height) => {
            // Helper function for sharp 4-point sparkle
            const drawSparkle4Point = (cx, cy, size, color) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                for(let i = 0; i < 8; i++){
                    const angle = (i * Math.PI) / 4;
                    const radius = (i % 2 === 0) ? size : size / 2;
                    const px = cx + radius * Math.cos(angle);
                    const py = cy + radius * Math.sin(angle);
                    if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
            };

            // Helper function for simple heart
             const drawSimpleHeart = (cx, cy, size, color) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(cx, cy + size * 0.25);
                ctx.bezierCurveTo(cx, cy, cx - size / 2, cy - size / 4, cx - size / 2, cy + size / 4);
                ctx.arc(cx - size / 4, cy + size / 4, size / 4, Math.PI, 0, false);
                ctx.arc(cx + size / 4, cy + size / 4, size / 4, Math.PI, 0, false);
                ctx.bezierCurveTo(cx + size / 2, cy - size / 4, cx, cy, cx, cy + size * 0.25);
                ctx.closePath();
                ctx.fill();
            };

            // Soft gradient border effect (subtle)
            const gradientThickness = 40;
            const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
            gradient.addColorStop(0, "rgba(255, 192, 203, 0.1)"); // Light Pink
            gradient.addColorStop(0.5, "rgba(173, 216, 230, 0.1)"); // Light Blue
            gradient.addColorStop(1, "rgba(255, 223, 186, 0.1)"); // Light Peach

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, gradientThickness); // Top
            ctx.fillRect(x, y + height - gradientThickness, width, gradientThickness); // Bottom
            ctx.fillRect(x, y + gradientThickness, gradientThickness, height - 2 * gradientThickness); // Left
            ctx.fillRect(x + width - gradientThickness, y + gradientThickness, gradientThickness, height - 2 * gradientThickness); // Right


            // Decorations
            // Top Left
            drawSparkle4Point(x + 30, y + 30, 12, "#FFFFFF");
            drawSparkle4Point(x + 55, y + 45, 8, "rgba(255, 255, 255, 0.7)");
            drawSimpleHeart(x + 70, y + 25, 15, "#FFB6C1"); // Pastel Pink

            // Top Right
            drawSparkle4Point(x + width - 35, y + 25, 10, "#FFFFFF");
            drawSimpleHeart(x + width - 60, y + 40, 18, "#ADD8E6"); // Light Blue

            // Bottom Left
            drawSimpleHeart(x + 25, y + height - 30, 20, "#FFFACD"); // Lemon Chiffon
             drawSparkle4Point(x + 50, y + height - 50, 9, "rgba(255, 255, 255, 0.8)");


            // Bottom Right
            drawSparkle4Point(x + width - 50, y + height - 55, 11, "#FFFFFF");
            drawSparkle4Point(x + width - 25, y + height - 30, 15, "#FFFFFF");
             drawSimpleHeart(x + width - 75, y + height - 25, 16, "#D8BFD8"); // Thistle
        }
    },

    stardustGlitter: {
        description: "Sparkling glitter dust and celestial stars on a deep space backdrop.",
        draw: (ctx, x, y, width, height) => {
            // Subtle dark gradient background wash in corners
            const drawGradientWash = (cx, cy, maxRadius, color1, color2) => {
				const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
				gradient.addColorStop(0, color1); // More opaque center
				gradient.addColorStop(1, color2); // Transparent edge
				ctx.fillStyle = gradient;
				ctx.beginPath();
                // Draw a partial circle or shape covering the corner
                 ctx.arc(cx, cy, maxRadius, 0, Math.PI*2); // Full circle for simplicity, adjust angles if needed
				ctx.fill();
			};

             // Draw corner washes
             drawGradientWash(x, y, 150, "rgba(48, 25, 52, 0.15)", "rgba(48, 25, 52, 0)"); // Top Left - Deep Purple
             drawGradientWash(x + width, y, 150, "rgba(25, 25, 112, 0.15)", "rgba(25, 25, 112, 0)"); // Top Right - Midnight Blue
             drawGradientWash(x, y + height, 150, "rgba(25, 25, 112, 0.15)", "rgba(25, 25, 112, 0)"); // Bottom Left
             drawGradientWash(x + width, y + height, 150, "rgba(48, 25, 52, 0.15)", "rgba(48, 25, 52, 0)"); // Bottom Right

            // Helper function for drawing glitter particles
            const drawGlitter = (count, areaX, areaY, areaW, areaH) => {
                const colors = ["#FFFFFF", "#FFFACD", "#E6E6FA", "#ADD8E6", "#FFB6C1"]; // White, Lemon, Lavender, LightBlue, Pink
                 for(let i=0; i<count; i++){
                    const gx = areaX + Math.random() * areaW;
                    const gy = areaY + Math.random() * areaH;
                    const gSize = 1 + Math.random() * 2; // Tiny dots
                    const gColor = colors[Math.floor(Math.random() * colors.length)];
                     ctx.fillStyle = gColor + Math.floor(150 + Math.random() * 105).toString(16); // Add some alpha variance
                    ctx.beginPath();
                    ctx.arc(gx, gy, gSize, 0, Math.PI * 2);
                    ctx.fill();
                 }
            }
            const edgeWidth = 60;
             // Scatter glitter along edges
             drawGlitter(150, x, y, width, edgeWidth); // Top edge
             drawGlitter(150, x, y + height - edgeWidth, width, edgeWidth); // Bottom edge
             drawGlitter(150, x, y + edgeWidth, edgeWidth, height - 2 * edgeWidth); // Left edge
             drawGlitter(150, x + width - edgeWidth, y + edgeWidth, edgeWidth, height - 2 * edgeWidth); // Right edge

            // Add a few larger stars
            const drawStar = (centerX, centerY, size, color = "#FFFFFF") => {
				ctx.fillStyle = color;
				ctx.beginPath();
                ctx.moveTo(centerX, centerY - size); // Top point
                for (let i = 0; i < 5; i++) {
                     const angle = Math.PI / 5;
                     ctx.lineTo(centerX + Math.cos(1.5*Math.PI + i*2*angle) * size, centerY + Math.sin(1.5*Math.PI + i*2*angle) * size);
                     ctx.lineTo(centerX + Math.cos(1.5*Math.PI + (i+0.5)*2*angle) * size*0.5, centerY + Math.sin(1.5*Math.PI + (i+0.5)*2*angle) * size*0.5);
                 }
                 ctx.closePath();
				ctx.fill();
			};

            drawStar(x + 50, y + 40, 10);
            drawStar(x + width - 60, y + 50, 12, "#FFFACD");
            drawStar(x + 40, y + height - 50, 8, "#E6E6FA");
            drawStar(x + width - 55, y + height - 45, 11);
            drawStar(x + width/2, y + 25, 9);
            drawStar(x + width/2, y + height - 25, 7, "#ADD8E6");
        }
    },

    y2kRetro: {
        description: "Funky Y2K style with bright colors, chunky shapes, and maybe a butterfly.",
         draw: (ctx, x, y, width, height) => {
            const colors = ["#FF69B4", "#00FFFF", "#FFD700", "#7FFF00", "#FF00FF"]; // HotPink, Cyan, Gold, Chartreuse, Magenta

            // Helper for chunky star
            const drawChunkyStar = (cx, cy, size, color) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(cx, cy - size); // Start top point
                for (let i = 0; i < 5; i++) {
                     const angle = Math.PI / 5; // 36 degrees between outer points
                     // Outer point
                     ctx.lineTo(cx + Math.cos(1.5 * Math.PI + i * 2 * angle) * size, cy + Math.sin(1.5 * Math.PI + i * 2 * angle) * size);
                     // Inner point (make it less deep for chunkiness)
                     ctx.lineTo(cx + Math.cos(1.5 * Math.PI + (i + 0.5) * 2 * angle) * size * 0.6, cy + Math.sin(1.5 * Math.PI + (i + 0.5) * 2 * angle) * size * 0.6);
                 }
                 ctx.closePath();
                 ctx.fill();

                 // Optional: Add a contrasting outline
                 // ctx.strokeStyle = "#000000"; // Black outline
                 // ctx.lineWidth = 1;
                 // ctx.stroke();
            };

             // Helper for simple flower
             const drawSimpleFlower = (cx, cy, petalSize, centerSize, petalColor, centerColor) => {
                // Petals
                 ctx.fillStyle = petalColor;
                 for (let i = 0; i < 6; i++) { // 6 Petals
                     const angle = (i * Math.PI) / 3;
                     ctx.beginPath();
                     ctx.ellipse(
                        cx + Math.cos(angle) * petalSize * 0.8,
                        cy + Math.sin(angle) * petalSize * 0.8,
                        petalSize / 1.5, // Width of petal
                        petalSize, // Height of petal
                        angle, // Rotate ellipse to point outwards
                        0,
                        Math.PI * 2
                     );
                     ctx.fill();
                 }
                 // Center
                 ctx.fillStyle = centerColor;
                 ctx.beginPath();
                 ctx.arc(cx, cy, centerSize, 0, Math.PI * 2);
                 ctx.fill();
             };

              // Helper for simple butterfly outline
              const drawButterfly = (cx, cy, size, color) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                // Left Wing Top
                ctx.moveTo(cx, cy);
                ctx.quadraticCurveTo(cx - size * 1.2, cy - size * 0.8, cx - size * 0.5, cy - size);
                ctx.quadraticCurveTo(cx - size * 0.1, cy - size * 0.5, cx, cy);
                // Left Wing Bottom
                ctx.quadraticCurveTo(cx - size, cy + size * 0.7, cx - size * 0.4, cy + size);
                ctx.quadraticCurveTo(cx - size * 0.1, cy + size * 0.5, cx, cy);
                // Right Wing Top
                ctx.moveTo(cx, cy);
                ctx.quadraticCurveTo(cx + size * 1.2, cy - size * 0.8, cx + size * 0.5, cy - size);
                ctx.quadraticCurveTo(cx + size * 0.1, cy - size * 0.5, cx, cy);
                // Right Wing Bottom
                ctx.quadraticCurveTo(cx + size, cy + size * 0.7, cx + size * 0.4, cy + size);
                ctx.quadraticCurveTo(cx + size * 0.1, cy + size * 0.5, cx, cy);
                ctx.stroke();
            };

             // Decorations (Place them boldly)
             drawChunkyStar(x + 40, y + 50, 25, colors[0]); // Pink star
             drawSimpleFlower(x + width - 50, y + 60, 15, 8, colors[1], colors[2]); // Cyan flower, gold center

             drawButterfly(x + 60, y + height - 70, 20, colors[3]); // Chartreuse butterfly

             drawChunkyStar(x + width - 70, y + height - 50, 22, colors[4]); // Magenta star

             // Add some simple dots
              ctx.fillStyle = colors[2]; // Gold
              ctx.beginPath(); ctx.arc(x+15, y+100, 5, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = colors[1]; // Cyan
              ctx.beginPath(); ctx.arc(x+width-15, y+120, 6, 0, Math.PI*2); ctx.fill();
              ctx.fillStyle = colors[0]; // Pink
              ctx.beginPath(); ctx.arc(x+width-30, y+height-100, 4, 0, Math.PI*2); ctx.fill();

         }
    },

    journalDoodles: {
        description: "Hand-drawn doodle style with washi tape corners and simple icons.",
        draw: (ctx, x, y, width, height) => {

            // Helper function for drawing 'washi tape' in corners
             const drawWashiTape = (cx, cy, w, h, rotation, color, patternOpacity = 0.3) => {
                ctx.save();
                ctx.translate(cx, cy); // Move origin to tape center
                ctx.rotate(rotation * Math.PI / 180); // Rotate
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.8; // Make tape slightly transparent
                ctx.fillRect(-w/2, -h/2, w, h); // Draw the tape base

                 // Simple pattern (lines)
                 if (patternOpacity > 0) {
                     ctx.globalAlpha = patternOpacity;
                     ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                     ctx.lineWidth = 1;
                     ctx.beginPath();
                     for(let i = -w/2; i < w/2; i += 5) {
                         ctx.moveTo(i, -h/2);
                         ctx.lineTo(i, h/2);
                     }
                     ctx.stroke();
                 }

                ctx.restore(); // Restore context state (rotation, alpha, translation)
            };

            // Helper for drawing simple doodles
             const drawDoodle = (type, cx, cy, size, color = '#333333') => {
                 ctx.strokeStyle = color;
                 ctx.lineWidth = 1.5; // Slightly thicker than default
                 ctx.lineCap = "round"; // Rounded ends for cuter look
                 ctx.lineJoin = "round";
                 ctx.beginPath();

                 switch(type) {
                     case 'heart':
                        // Draw a slightly asymmetric heart
                        ctx.moveTo(cx, cy + size * 0.2);
                        ctx.bezierCurveTo(cx - size*0.1, cy - size*0.1, cx - size * 0.6, cy - size*0.2, cx - size * 0.5, cy + size*0.1);
                        ctx.arc(cx - size * 0.25, cy + size*0.1, size * 0.25, Math.PI*0.9, Math.PI*0.1, true); // Left lobe
                         ctx.arc(cx + size * 0.25, cy - size * 0.15, size * 0.3, Math.PI*0.8, 0, false); // Right lobe slightly different
                        ctx.bezierCurveTo(cx + size * 0.5, cy - size * 0.1, cx + size*0.15, cy + size*0.4, cx, cy + size*0.2);
                        break;
                     case 'star':
                        // Draw a slightly wonky star
                         for(let i=0; i<5; i++){
                             const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                             const jitterX = (Math.random() - 0.5) * size * 0.1;
                             const jitterY = (Math.random() - 0.5) * size * 0.1;
                             const px = cx + size * Math.cos(angle) + jitterX;
                             const py = cy + size * Math.sin(angle) + jitterY;
                             if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                         }
                         ctx.closePath();
                         break;
                     case 'spiral':
                        let currentRadius = 1;
                        let currentAngle = 0;
                        ctx.moveTo(cx, cy);
                         for(let i=0; i<50; i++){ // Draw a short spiral
                            currentAngle += 0.3;
                            currentRadius += 0.15;
                            ctx.lineTo(cx + Math.cos(currentAngle)*currentRadius, cy + Math.sin(currentAngle)*currentRadius);
                         }
                         break;
                     case 'sparkle':
                        // Simple 4 point sparkle cross
                        ctx.moveTo(cx - size, cy); ctx.lineTo(cx + size, cy);
                        ctx.moveTo(cx, cy - size); ctx.lineTo(cx, cy + size);
                        break;
                 }
                 ctx.stroke();
             };


             // Place Washi Tape in corners (adjust placement as needed)
             drawWashiTape(x + 30, y + 30, 60, 25, -45, '#FFDAB9', 0.2); // Peach Puff - Top Left
             drawWashiTape(x + width - 30, y + 30, 60, 25, 45, '#E6E6FA', 0.3); // Lavender - Top Right
             drawWashiTape(x + 30, y + height - 30, 60, 25, 45, '#98FB98', 0.25); // Pale Green - Bottom Left
             drawWashiTape(x + width - 30, y + height - 30, 60, 25, -45, '#ADD8E6', 0.3); // Light Blue - Bottom Right

             // Scatter some doodles
             drawDoodle('heart', x + 80, y + 60, 12);
             drawDoodle('star', x + width - 70, y + 80, 10);
             drawDoodle('sparkle', x + 50, y + height - 80, 8);
             drawDoodle('spiral', x + width - 90, y + height - 60, 15);
             drawDoodle('heart', x + width - 65, y + height - 100, 9, '#FF6A6A'); // Reddish heart
             drawDoodle('star', x + 90, y + height - 50, 11, '#5F9EA0'); // Cadet blue star
        }
    },
    decoStickers: {
        description: "韩系咕卡/拍立得装饰风，小熊小兔、丝带爱心贴纸。", // Polcoo (Polaroid Deco) inspired
        draw: (ctx, x, y, width, height) => {
            // Helper: Simple Bear Head
            const drawBear = (cx, cy, size, color = "#E0B9A0") => {
                ctx.fillStyle = color;
                // Head
                ctx.beginPath();
                ctx.arc(cx, cy, size, 0, Math.PI * 2);
                ctx.fill();
                // Ears
                const earSize = size * 0.4;
                ctx.beginPath();
                ctx.arc(cx - size * 0.7, cy - size * 0.6, earSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(cx + size * 0.7, cy - size * 0.6, earSize, 0, Math.PI * 2);
                ctx.fill();
                // Snout (optional simpler)
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.beginPath();
                ctx.ellipse(cx, cy + size * 0.1, size*0.5, size*0.4, 0, 0, Math.PI * 2);
                ctx.fill();
            };

             // Helper: Simple Bunny Head
            const drawBunny = (cx, cy, size, color = "#F5F5F5") => {
                 ctx.fillStyle = color;
                 // Head
                 ctx.beginPath();
                 ctx.arc(cx, cy, size, 0, Math.PI * 2);
                 ctx.fill();
                 // Ears
                 const earW = size * 0.4;
                 const earH = size * 1.1;
                 ctx.beginPath();
                 ctx.ellipse(cx - size * 0.5, cy - size * 0.7, earW, earH, -Math.PI/12, 0, Math.PI*2);
                 ctx.fill();
                 ctx.beginPath();
                 ctx.ellipse(cx + size * 0.5, cy - size * 0.7, earW, earH, Math.PI/12, 0, Math.PI*2);
                 ctx.fill();
                 // Blush (optional)
                 ctx.fillStyle = "rgba(255, 182, 193, 0.7)"; // LightPink
                 ctx.beginPath();
                 ctx.ellipse(cx - size*0.4, cy+size*0.1, size*0.2, size*0.15, -Math.PI/8, 0, Math.PI*2);
                 ctx.fill();
                  ctx.beginPath();
                 ctx.ellipse(cx + size*0.4, cy+size*0.1, size*0.2, size*0.15, Math.PI/8, 0, Math.PI*2);
                 ctx.fill();
            };

            // Helper: Simple Ribbon
            const drawRibbon = (cx, cy, size, color = "#FFC0CB") => {
                 ctx.fillStyle = color;
                 const loopWidth = size * 1.2;
                 const loopHeight = size * 0.8;
                 // Left loop
                 ctx.beginPath();
                 ctx.ellipse(cx - size*0.6, cy, loopWidth, loopHeight, Math.PI/6, 0, Math.PI * 2);
                 ctx.fill();
                 // Right loop
                  ctx.beginPath();
                 ctx.ellipse(cx + size*0.6, cy, loopWidth, loopHeight, -Math.PI/6, 0, Math.PI * 2);
                 ctx.fill();
                 // Center knot
                 ctx.beginPath();
                 ctx.arc(cx, cy, size*0.4, 0, Math.PI*2);
                 ctx.fill();
                 // Tails (optional simple lines)
                 ctx.strokeStyle = color;
                 ctx.lineWidth = size * 0.3;
                 ctx.lineCap = 'round';
                 ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - size*0.5, cy + size*1.2); ctx.stroke();
                 ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + size*0.5, cy + size*1.2); ctx.stroke();
            };

            // Helper: Simple heart (using one from kpopVibes)
            const drawSimpleHeart = (cx, cy, size, color) => { /* ... copy from kpopVibes ... */
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(cx, cy + size * 0.25);
                ctx.bezierCurveTo(cx, cy, cx - size / 2, cy - size / 4, cx - size / 2, cy + size / 4);
                ctx.arc(cx - size / 4, cy + size / 4, size / 4, Math.PI, 0, false);
                ctx.arc(cx + size / 4, cy + size / 4, size / 4, Math.PI, 0, false);
                ctx.bezierCurveTo(cx + size / 2, cy - size / 4, cx, cy, cx, cy + size * 0.25);
                ctx.closePath();
                ctx.fill();
            };
            // Helper: Simple 4-point sparkle (using one from kpopVibes)
            const drawSparkle4Point = (cx, cy, size, color) => { /* ... copy from kpopVibes ... */
                ctx.fillStyle = color;
                ctx.beginPath();
                for(let i = 0; i < 8; i++){
                    const angle = (i * Math.PI) / 4;
                    const radius = (i % 2 === 0) ? size : size / 2;
                    const px = cx + radius * Math.cos(angle);
                    const py = cy + radius * Math.sin(angle);
                    if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
            };


            // Place stickers (like decorating a photo card)
            drawBear(x + 40, y + 50, 15);
            drawBunny(x + width - 55, y + 40, 16);
            drawSimpleHeart(x + 70, y + 25, 12, "#FF6384"); // Reddish Pink
            drawRibbon(x + width - 40, y + height - 70, 10, "#B0E0E6"); // Powder Blue
            drawSimpleHeart(x + 30, y + height - 40, 18, "#FFB6C1"); // Light Pink

            drawBear(x + width - 90, y + height - 35, 13, "#D2B48C"); // Tan Bear
            drawBunny(x + 80, y + height - 70, 12, "#FFF0F5"); // Lavender Blush Bunny

            // Add tiny sparkles
            drawSparkle4Point(x + 20, y + 25, 6, "rgba(255, 215, 0, 0.8)"); // Gold
            drawSparkle4Point(x + width - 25, y + 70, 5, "rgba(192, 192, 192, 0.8)"); // Silver
            drawSparkle4Point(x + 60, y + height - 20, 7, "rgba(255, 255, 255, 0.9)"); // White
            drawSparkle4Point(x + width - 60, y + height - 55, 4, "rgba(255, 192, 203, 0.8)"); // Pink
        }
    },
    retroPopParty: {
        description: "复古波普派对风！大胆撞色+几何图形背景。", // Retro Pop Art style
        draw: (ctx, x, y, width, height) => {
            // Background: Bold Stripes + Polka Dots Mix
            const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]; // Chart.js colors
            const stripeHeight = height / 6;
            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = colors[i % colors.length];
                ctx.fillRect(x, y + i * stripeHeight, width, stripeHeight);
            }
            // Add Polka Dots layer
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White transparent dots
            const dotRadius = 8;
            const dotSpacing = 30;
            for (let i = x + dotSpacing/2; i < x + width; i += dotSpacing) {
                for (let j = y + dotSpacing/2; j < y + height; j += dotSpacing) {
                     ctx.beginPath();
                     ctx.arc(i + (Math.random()-0.5)*5, j + (Math.random()-0.5)*5, dotRadius, 0, Math.PI*2); // Add jitter
                     ctx.fill();
                 }
             }

             // Border: Thick simple frame + Inner line
             ctx.strokeStyle = "#000000"; // Black border
             ctx.lineWidth = 8;
             ctx.strokeRect(x + 4, y + 4, width - 8, height - 8);
             ctx.strokeStyle = "#FFFFFF"; // White inner line
             ctx.lineWidth = 2;
             ctx.strokeRect(x + 10, y + 10, width - 20, height - 20);
             ctx.lineWidth = 1; // Reset

             // Stickers: Chunky simple shapes + outline
             const drawChunkyShape = (type, cx, cy, size, color, outlineColor = "#000000") => {
                 ctx.fillStyle = color;
                 ctx.strokeStyle = outlineColor;
                 ctx.lineWidth = 2;
                 ctx.beginPath();
                 if (type === 'star') { // Using Y2K chunky star logic
                    ctx.moveTo(cx, cy - size);
                     for (let i = 0; i < 5; i++) {
                         const angle = Math.PI / 5;
                         ctx.lineTo(cx + Math.cos(1.5 * Math.PI + i * 2 * angle) * size, cy + Math.sin(1.5 * Math.PI + i * 2 * angle) * size);
                         ctx.lineTo(cx + Math.cos(1.5 * Math.PI + (i + 0.5) * 2 * angle) * size * 0.6, cy + Math.sin(1.5 * Math.PI + (i + 0.5) * 2 * angle) * size * 0.6);
                     }
                 } else if (type === 'heart') { // Simpler chunky heart
                     ctx.moveTo(cx, cy + size*0.8); // Bottom point
                     ctx.arc(cx - size*0.5, cy, size*0.7, Math.PI * 0.25, Math.PI * 1.25, false); // Left Lobe
                     ctx.arc(cx + size*0.5, cy, size*0.7, Math.PI * 1.75, Math.PI * 0.75, false); // Right Lobe
                 } else if (type === 'lightning') {
                     ctx.moveTo(cx - size*0.5, cy - size);
                     ctx.lineTo(cx + size*0.3, cy - size*0.2);
                     ctx.lineTo(cx - size*0.2, cy - size*0.1);
                     ctx.lineTo(cx + size*0.5, cy + size);
                     ctx.lineTo(cx - size*0.3, cy + size*0.2);
                     ctx.lineTo(cx + size*0.2, cy + size*0.1);
                     ctx.closePath();
                 }
                 ctx.closePath();
                 ctx.fill();
                 ctx.stroke();
             };

            // Layout Stickers (fewer, larger, bolder)
             drawChunkyShape('star', x + 60, y + 70, 25, colors[2]); // Yellow star
             drawChunkyShape('heart', x + width - 70, y + 60, 22, colors[0]); // Pink heart
             drawChunkyShape('lightning', x + width / 2, y + height - 50, 30, colors[1]); // Blue lightning

             // Simple Text
             ctx.font = "bold 24px 'Impact', sans-serif";
             ctx.fillStyle = "#FFFFFF";
             ctx.strokeStyle = "#000000";
             ctx.lineWidth = 4;
             ctx.textAlign = "left";
             ctx.strokeText("POP!", x + 25, y + 35);
             ctx.fillText("POP!", x + 25, y + 35);

             ctx.textAlign = "right";
             ctx.strokeText("WOW!", x + width - 25, y + height - 25);
             ctx.fillText("WOW!", x + width - 25, y + height - 25);
        }
    },
    retroPopParty: {
        description: "复古波普派对风！大胆撞色+几何图形装饰边框。", // Retro Pop Art style
        draw: (ctx, x, y, width, height) => {
            // 定义波普色彩
            const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
            
            // 1. 仅在边框绘制条纹而不是整个背景
            const borderWidth = 40; // 边框宽度
            
            // 绘制上边框条纹
            const topStripeWidth = width / 6;
            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = colors[i % colors.length];
                ctx.fillRect(x + i * topStripeWidth, y, topStripeWidth, borderWidth);
            }
            
            // 绘制下边框条纹
            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = colors[(i + 3) % colors.length]; // 错开颜色
                ctx.fillRect(x + i * topStripeWidth, y + height - borderWidth, topStripeWidth, borderWidth);
            }
            
            // 绘制左边框条纹
            const sideStripeHeight = (height - 2 * borderWidth) / 4;
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = colors[(i + 1) % colors.length];
                ctx.fillRect(x, y + borderWidth + i * sideStripeHeight, borderWidth, sideStripeHeight);
            }
            
            // 绘制右边框条纹
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = colors[(i + 4) % colors.length];
                ctx.fillRect(x + width - borderWidth, y + borderWidth + i * sideStripeHeight, borderWidth, sideStripeHeight);
            }
            
            // 2. 添加波点装饰在边框上
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // 半透明白色圆点
            const dotRadius = 6;
            const dotSpacing = 20;
            
            // 上边框波点
            for (let i = x + dotSpacing; i < x + width; i += dotSpacing) {
                for (let j = y + dotSpacing/2; j < y + borderWidth; j += dotSpacing) {
                    ctx.beginPath();
                    ctx.arc(i + (Math.random()-0.5)*3, j + (Math.random()-0.5)*3, dotRadius, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            // 下边框波点
            for (let i = x + dotSpacing; i < x + width; i += dotSpacing) {
                for (let j = y + height - borderWidth + dotSpacing/2; j < y + height; j += dotSpacing) {
                    ctx.beginPath();
                    ctx.arc(i + (Math.random()-0.5)*3, j + (Math.random()-0.5)*3, dotRadius, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            // 左边框波点
            for (let i = x + dotSpacing/2; i < x + borderWidth; i += dotSpacing) {
                for (let j = y + borderWidth + dotSpacing; j < y + height - borderWidth; j += dotSpacing) {
                    ctx.beginPath();
                    ctx.arc(i + (Math.random()-0.5)*3, j + (Math.random()-0.5)*3, dotRadius, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            // 右边框波点
            for (let i = x + width - borderWidth + dotSpacing/2; i < x + width; i += dotSpacing) {
                for (let j = y + borderWidth + dotSpacing; j < y + height - borderWidth; j += dotSpacing) {
                    ctx.beginPath();
                    ctx.arc(i + (Math.random()-0.5)*3, j + (Math.random()-0.5)*3, dotRadius, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            // 3. 内部黑白边框
            ctx.strokeStyle = "#000000"; // 黑色边框
            ctx.lineWidth = 6;
            ctx.strokeRect(x + borderWidth/2, y + borderWidth/2, width - borderWidth, height - borderWidth);
            
            ctx.strokeStyle = "#FFFFFF"; // 白色内线
            ctx.lineWidth = 2;
            ctx.strokeRect(x + borderWidth/2 + 5, y + borderWidth/2 + 5, width - borderWidth - 10, height - borderWidth - 10);
            
            // 4. 形状装饰函数
            const drawChunkyShape = (type, cx, cy, size, color, outlineColor = "#000000") => {
                ctx.fillStyle = color;
                ctx.strokeStyle = outlineColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                if (type === 'star') {
                    for (let i = 0; i < 5; i++) {
                        const angle = Math.PI / 5;
                        const startAngle = -Math.PI / 2 + i * 2 * angle;
                        const endAngle = startAngle + angle;
                        
                        if (i === 0) {
                            ctx.moveTo(
                                cx + Math.cos(startAngle) * size,
                                cy + Math.sin(startAngle) * size
                            );
                        }
                        
                        ctx.lineTo(
                            cx + Math.cos(startAngle) * size,
                            cy + Math.sin(startAngle) * size
                        );
                        ctx.lineTo(
                            cx + Math.cos(endAngle) * (size * 0.4),
                            cy + Math.sin(endAngle) * (size * 0.4)
                        );
                    }
                } else if (type === 'heart') {
                    ctx.moveTo(cx, cy + size*0.7);
                    ctx.arc(cx - size*0.5, cy, size*0.5, Math.PI * 0.25, Math.PI * 1.3, false);
                    ctx.arc(cx + size*0.5, cy, size*0.5, Math.PI * 1.7, Math.PI * 0.75, false);
                } else if (type === 'lightning') {
                    ctx.moveTo(cx - size*0.3, cy - size);
                    ctx.lineTo(cx + size*0.2, cy - size*0.3);
                    ctx.lineTo(cx - size*0.1, cy - size*0.1);
                    ctx.lineTo(cx + size*0.3, cy + size);
                    ctx.lineTo(cx - size*0.2, cy + size*0.3);
                    ctx.lineTo(cx + size*0.1, cy + size*0.1);
                    ctx.closePath();
                } else if (type === 'circle') {
                    ctx.arc(cx, cy, size, 0, Math.PI * 2);
                } else if (type === 'triangle') {
                    ctx.moveTo(cx, cy - size);
                    ctx.lineTo(cx - size, cy + size/2);
                    ctx.lineTo(cx + size, cy + size/2);
                    ctx.closePath();
                } else if (type === 'speech') {
                    // 语音气泡
                    ctx.arc(cx, cy, size, 0, Math.PI * 2);
                    // 添加小尖角
                    ctx.moveTo(cx - size/2, cy + size*0.8);
                    ctx.lineTo(cx - size, cy + size*1.5);
                    ctx.lineTo(cx, cy + size*0.7);
                }
                
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
            
            // 5. 在四个角落添加装饰，而不是中央
            // 左上角
            drawChunkyShape('star', x + borderWidth + 15, y + borderWidth + 15, 20, colors[2], "#000000");
            
            // 右上角
            drawChunkyShape('heart', x + width - borderWidth - 20, y + borderWidth + 20, 18, colors[0], "#000000");
            
            // 左下角
            drawChunkyShape('lightning', x + borderWidth + 20, y + height - borderWidth - 20, 20, colors[4], "#000000");
            
            // 右下角
            drawChunkyShape('speech', x + width - borderWidth - 20, y + height - borderWidth - 20, 18, colors[1], "#000000");
            
            // 6. 边缘添加额外波普元素
            drawChunkyShape('triangle', x + width/4, y + borderWidth/2, 12, colors[3], "#000000");
            drawChunkyShape('circle', x + width*3/4, y + height - borderWidth/2, 12, colors[5], "#000000");
            drawChunkyShape('circle', x + borderWidth/2, y + height/2, 12, colors[2], "#000000");
            drawChunkyShape('triangle', x + width - borderWidth/2, y + height/2, 12, colors[0], "#000000");
            
            // 7. 文字标语 - 放在边框上而不是中央
            ctx.font = "bold 22px 'Impact', sans-serif";
            ctx.textAlign = "center";
            
            // 上边框文字
            ctx.fillStyle = "#000000";
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 3;
            ctx.strokeText("POP!", x + width/2, y + borderWidth/2 + 8);
            ctx.fillText("POP!", x + width/2, y + borderWidth/2 + 8);
            
            // 下边框文字
            ctx.strokeText("WOW!", x + width/2, y + height - borderWidth/2 + 8);
            ctx.fillText("WOW!", x + width/2, y + height - borderWidth/2 + 8);
            
            // 左边旋转文字
            ctx.save();
            ctx.translate(x + borderWidth/2, y + height/2);
            ctx.rotate(-Math.PI/2);
            ctx.strokeText("YEAH!", 0, 0);
            ctx.fillText("YEAH!", 0, 0);
            ctx.restore();
            
            // 右边旋转文字
            ctx.save();
            ctx.translate(x + width - borderWidth/2, y + height/2);
            ctx.rotate(Math.PI/2);
            ctx.strokeText("COOL!", 0, 0);
            ctx.fillText("COOL!", 0, 0);
            ctx.restore();
        }
    },
    girlyGraffitiScrapbook: {
        description: "手绘涂鸦+剪贴簿风，胶带、手绘图案、拍纸本背景。",
        draw: (ctx, x, y, width, height) => {
            // 为避免遮挡中央内容，调整装饰边框宽度
            const borderWidth = 50;
            
            // 绘制拍纸本背景 - 仅在边框区域
            ctx.fillStyle = "#FFFDF0"; 
            
            // 仅绘制边框区域的背景
            // 上边框
            ctx.fillRect(x, y, width, borderWidth);
            // 下边框
            ctx.fillRect(x, y + height - borderWidth, width, borderWidth);
            // 左边框
            ctx.fillRect(x, y + borderWidth, borderWidth, height - 2 * borderWidth);
            // 右边框
            ctx.fillRect(x + width - borderWidth, y + borderWidth, borderWidth, height - 2 * borderWidth);
            
            // 在边框区域绘制横线 - 笔记本纸效果
            ctx.strokeStyle = "rgba(173, 216, 230, 0.4)"; 
            ctx.lineWidth = 0.5;
            
            // 上边框区域横线
            for(let i = y + 10; i < y + borderWidth; i += 10) { 
                ctx.beginPath(); 
                ctx.moveTo(x, i); 
                ctx.lineTo(x + width, i); 
                ctx.stroke();
            }
            
            // 下边框区域横线
            for(let i = y + height - borderWidth + 10; i < y + height; i += 10) { 
                ctx.beginPath(); 
                ctx.moveTo(x, i); 
                ctx.lineTo(x + width, i); 
                ctx.stroke();
            }
            
            // 添加粉色竖线（笔记本边线）
            ctx.strokeStyle = "rgba(255, 105, 180, 0.5)"; 
            ctx.lineWidth = 1;
            ctx.beginPath(); 
            ctx.moveTo(x + 20, y); 
            ctx.lineTo(x + 20, y + borderWidth); 
            ctx.stroke();
            
            ctx.beginPath(); 
            ctx.moveTo(x + 20, y + height - borderWidth); 
            ctx.lineTo(x + 20, y + height); 
            ctx.stroke();
            
            // 自定义绘制和纸胶带函数
            const drawWashiTape = (centerX, centerY, width, height, angle, color, pattern = null) => {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle * Math.PI / 180);
                
                // 胶带背景
                ctx.fillStyle = color;
                ctx.fillRect(-width/2, -height/2, width, height);
                
                // 胶带图案
                if (pattern === 'stripes') {
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.lineWidth = 1;
                    for (let i = -width/2 + 4; i < width/2; i += 4) {
                        ctx.beginPath();
                        ctx.moveTo(i, -height/2);
                        ctx.lineTo(i, height/2);
                        ctx.stroke();
                    }
                } else if (pattern === 'dots') {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                    for (let i = -width/2 + 4; i < width/2; i += 6) {
                        for (let j = -height/2 + 3; j < height/2; j += 6) {
                            ctx.beginPath();
                            ctx.arc(i, j, 1, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                } else if (pattern === 'zigzag') {
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    let x = -width/2 + 2;
                    ctx.moveTo(x, -height/2 + 2);
                    while (x < width/2 - 2) {
                        x += 4;
                        ctx.lineTo(x, -height/2 + height/4);
                        x += 4;
                        ctx.lineTo(x, -height/2 + 2);
                    }
                    ctx.stroke();
                    
                    ctx.beginPath();
                    x = -width/2 + 2;
                    ctx.moveTo(x, height/2 - 2);
                    while (x < width/2 - 2) {
                        x += 4;
                        ctx.lineTo(x, height/2 - height/4);
                        x += 4;
                        ctx.lineTo(x, height/2 - 2);
                    }
                    ctx.stroke();
                }
                
                // 胶带边缘半透明效果
                ctx.globalAlpha = 0.1;
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(-width/2, -height/2, width, 2);
                ctx.fillRect(-width/2, height/2 - 2, width, 2);
                ctx.globalAlpha = 1;
                
                ctx.restore();
            };
            
            // 绘制涂鸦函数
            const drawDoodle = (type, cx, cy, size, color) => {
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.lineWidth = size/5;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                
                switch(type) {
                    case 'heart':
                        ctx.beginPath();
                        ctx.moveTo(cx, cy + size/2);
                        ctx.bezierCurveTo(
                            cx, cy, 
                            cx - size, cy, 
                            cx - size, cy - size/2
                        );
                        ctx.bezierCurveTo(
                            cx - size, cy - size, 
                            cx, cy - size, 
                            cx, cy - size/2
                        );
                        ctx.bezierCurveTo(
                            cx, cy - size, 
                            cx + size, cy - size, 
                            cx + size, cy - size/2
                        );
                        ctx.bezierCurveTo(
                            cx + size, cy, 
                            cx, cy, 
                            cx, cy + size/2
                        );
                        ctx.fill();
                        break;
                        
                    case 'star':
                        ctx.beginPath();
                        for (let i = 0; i < 5; i++) {
                            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                            const x1 = cx + Math.cos(angle) * size;
                            const y1 = cy + Math.sin(angle) * size;
                            
                            if (i === 0) {
                                ctx.moveTo(x1, y1);
                            } else {
                                ctx.lineTo(x1, y1);
                            }
                            
                            const angle2 = angle + Math.PI / 5;
                            const x2 = cx + Math.cos(angle2) * (size/2);
                            const y2 = cy + Math.sin(angle2) * (size/2);
                            
                            ctx.lineTo(x2, y2);
                        }
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 'sparkle':
                        // 十字星形
                        for (let i = 0; i < 4; i++) {
                            const angle = (i * Math.PI / 2);
                            ctx.beginPath();
                            ctx.moveTo(cx, cy);
                            ctx.lineTo(
                                cx + Math.cos(angle) * size,
                                cy + Math.sin(angle) * size
                            );
                            ctx.stroke();
                            
                            // 十字星的小点
                            ctx.beginPath();
                            ctx.arc(
                                cx + Math.cos(angle) * size,
                                cy + Math.sin(angle) * size,
                                size/5, 0, Math.PI * 2
                            );
                            ctx.fill();
                        }
                        
                        // 中心点
                        ctx.beginPath();
                        ctx.arc(cx, cy, size/4, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 'spiral':
                        ctx.beginPath();
                        let angle = 0;
                        let radius = size / 10;
                        let x1 = cx, y1 = cy;
                        ctx.moveTo(x1, y1);
                        
                        for (let i = 0; i < 30; i++) {
                            angle += 0.2;
                            radius += size / 50;
                            const x2 = cx + Math.cos(angle) * radius;
                            const y2 = cy + Math.sin(angle) * radius;
                            ctx.lineTo(x2, y2);
                            x1 = x2;
                            y1 = y2;
                        }
                        ctx.stroke();
                        break;
                        
                    case 'flower':
                        for (let i = 0; i < 6; i++) {
                            const angle = i * Math.PI / 3;
                            ctx.beginPath();
                            ctx.arc(
                                cx + Math.cos(angle) * size/2,
                                cy + Math.sin(angle) * size/2,
                                size/2, 0, Math.PI * 2
                            );
                            ctx.fill();
                        }
                        
                        // 花芯
                        ctx.fillStyle = "#FFFF88";
                        ctx.beginPath();
                        ctx.arc(cx, cy, size/3, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                        
                    case 'cloud':
                        ctx.beginPath();
                        ctx.arc(cx, cy, size/2, Math.PI, 2 * Math.PI);
                        ctx.arc(cx - size/2, cy, size/3, 0, Math.PI);
                        ctx.arc(cx + size/2, cy, size/3, 0, Math.PI);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
            };
            
            // 绘制对话气泡函数
            const drawTextBubble = (cx, cy, width, height, pointX, pointY) => {
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#999999";
                ctx.lineWidth = 1;
                
                // 气泡主体
                ctx.beginPath();
                ctx.ellipse(cx, cy, width/2, height/2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // 气泡尖角
                ctx.beginPath();
                ctx.moveTo(cx, cy - height/4);
                ctx.quadraticCurveTo(
                    (cx + pointX) / 2,
                    (cy + pointY) / 2,
                    pointX, pointY
                );
                ctx.quadraticCurveTo(
                    (cx + pointX) / 2 + 5,
                    (cy + pointY) / 2 + 5,
                    cx + 10, cy - height/4
                );
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
            
            // 在四个角落添加胶带，位置调整到边缘
            drawWashiTape(x + 30, y + 25, 60, 20, -35, '#FFDAB9', 'stripes');
            drawWashiTape(x + width - 30, y + 25, 60, 20, 35, '#98FB98', 'dots');
            drawWashiTape(x + 30, y + height - 25, 60, 20, 40, '#E6E6FA', 'zigzag');
            drawWashiTape(x + width - 30, y + height - 25, 60, 20, -40, '#ADD8E6', 'stripes');
            
            // 额外的胶带在边框中间位置
            drawWashiTape(x + width/2, y + 25, 80, 25, 0, '#FFD1DC', 'dots');
            drawWashiTape(x + width/2, y + height - 25, 80, 25, 0, '#B5EAD7', 'zigzag');
            drawWashiTape(x + 25, y + height/2, 80, 25, 90, '#C7CEEB', 'dots');
            drawWashiTape(x + width - 25, y + height/2, 80, 25, 90, '#FFE4B5', 'stripes');
            
            // 边框手绘线条
            ctx.strokeStyle = "#444444"; 
            ctx.lineWidth = 1.5; 
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            
            const wiggle = 2; // 线条的摆动量
            ctx.beginPath(); 
            
            // 只绘制边框区域的手绘线条，不进入中心区域
            ctx.moveTo(x + borderWidth + (Math.random()-0.5)*wiggle, y + borderWidth + (Math.random()-0.5)*wiggle);
            ctx.lineTo(x + width - borderWidth + (Math.random()-0.5)*wiggle, y + borderWidth + (Math.random()-0.5)*wiggle);
            ctx.lineTo(x + width - borderWidth + (Math.random()-0.5)*wiggle, y + height - borderWidth + (Math.random()-0.5)*wiggle);
            ctx.lineTo(x + borderWidth + (Math.random()-0.5)*wiggle, y + height - borderWidth + (Math.random()-0.5)*wiggle);
            ctx.closePath();
            ctx.stroke();
            
            // 在边缘区域添加涂鸦，避免遮挡中央区域
            drawDoodle('heart', x + borderWidth/2 + 15, y + borderWidth/2 + 15, 12, '#E57373');
            drawDoodle('star', x + width - borderWidth/2 - 15, y + borderWidth/2 + 15, 12, '#81C784');
            drawDoodle('sparkle', x + borderWidth/2 + 15, y + height - borderWidth/2 - 15, 10, '#64B5F6');
            drawDoodle('spiral', x + width - borderWidth/2 - 15, y + height - borderWidth/2 - 15, 10, '#FFB74D');
            
            // 沿着边框添加额外的涂鸦
            drawDoodle('heart', x + width / 4, y + borderWidth/2, 8, '#FF94A1');
            drawDoodle('star', x + width * 3/4, y + borderWidth/2, 8, '#82DDA7');
            drawDoodle('flower', x + borderWidth/2, y + height/3, 12, '#FF94D0');
            drawDoodle('cloud', x + width - borderWidth/2, y + height/3, 12, '#94CAFF');
            drawDoodle('heart', x + borderWidth/2, y + height * 2/3, 8, '#FFBE7D');
            drawDoodle('sparkle', x + width - borderWidth/2, y + height * 2/3, 8, '#C08FFF');
            drawDoodle('flower', x + width / 4, y + height - borderWidth/2, 8, '#7DC1FF');
            drawDoodle('cloud', x + width * 3/4, y + height - borderWidth/2, 8, '#AAD9A8');
            
            // 将对话气泡移到边框上
            drawTextBubble(x + width - borderWidth/2, y + height - borderWidth/2 - 10, 70, 30, x + width - borderWidth - 30, y + height - borderWidth - 30);
            
            // 手写风格文字
            ctx.font = "16px Arial";  // 假设没有特殊字体
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.fillText("So fun!", x + width - borderWidth/2, y + height - borderWidth/2 - 7);
            
            // 日期文本移至右上角边框区域
            ctx.textAlign = "left";
            // ctx.fillText("Date:__/__", x + width - borderWidth + 5, y + 20);
        }
    },
    
    kawaiiCosmicVoyage: {
        description: "可爱宇宙主题！行星、UFO、星星背景。",
        draw: (ctx, x, y, width, height) => {
            // 设置边框宽度，确保装饰不遮挡中央内容
            const borderWidth = 60;
            
            // 仅绘制边框区域的深色背景
            ctx.fillStyle = "#1A1A40";
            
            // 上边框
            ctx.fillRect(x, y, width, borderWidth);
            // 下边框
            ctx.fillRect(x, y + height - borderWidth, width, borderWidth);
            // 左边框
            ctx.fillRect(x, y + borderWidth, borderWidth, height - 2 * borderWidth);
            // 右边框
            ctx.fillRect(x + width - borderWidth, y + borderWidth, borderWidth, height - 2 * borderWidth);
            
            // 自定义星尘函数
            const drawSparkleDust = (minX, minY, maxX, maxY, count, color, minSize, maxSize) => {
                ctx.fillStyle = color;
                
                for (let i = 0; i < count; i++) {
                    // 随机位置，但仅限于边框区域
                    let starX, starY;
                    
                    // 确定星星位置在哪个边框区域
                    const side = Math.floor(Math.random() * 4);
                    
                    switch(side) {
                        case 0: // 上边框
                            starX = minX + Math.random() * (maxX - minX);
                            starY = minY + Math.random() * borderWidth;
                            break;
                        case 1: // 右边框
                            starX = maxX - borderWidth + Math.random() * borderWidth;
                            starY = minY + borderWidth + Math.random() * (maxY - minY - 2 * borderWidth);
                            break;
                        case 2: // 下边框
                            starX = minX + Math.random() * (maxX - minX);
                            starY = maxY - borderWidth + Math.random() * borderWidth;
                            break;
                        case 3: // 左边框
                            starX = minX + Math.random() * borderWidth;
                            starY = minY + borderWidth + Math.random() * (maxY - minY - 2 * borderWidth);
                            break;
                    }
                    
                    const size = minSize + Math.random() * (maxSize - minSize);
                    
                    // 20%的几率绘制十字星
                    if (Math.random() < 0.2) {
                        ctx.beginPath();
                        ctx.moveTo(starX - size, starY);
                        ctx.lineTo(starX + size, starY);
                        ctx.moveTo(starX, starY - size);
                        ctx.lineTo(starX, starY + size);
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.arc(starX, starY, size/2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 有10%几率添加光芒
                        if (Math.random() < 0.1) {
                            const glow = ctx.createRadialGradient(starX, starY, 0, starX, starY, size * 3);
                            glow.addColorStop(0, "rgba(255, 255, 255, 0.3)");
                            glow.addColorStop(1, "rgba(255, 255, 255, 0)");
                            
                            ctx.fillStyle = glow;
                            ctx.beginPath();
                            ctx.arc(starX, starY, size * 3, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.fillStyle = color; // 重置填充色
                        }
                    }
                }
            };
            
            // 自定义绘制行星函数
            const drawPlanet = (cx, cy, size, color, ringColor, hasFace) => {
                // 行星光晕
                const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
                glow.addColorStop(0, "rgba(255, 255, 255, 0.2)");
                glow.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(cx, cy, size * 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                // 行星主体
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(cx, cy, size, 0, Math.PI * 2);
                ctx.fill();
                
                // 行星环（如果有）
                if (ringColor) {
                    ctx.strokeStyle = ringColor;
                    ctx.lineWidth = size / 4;
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, size * 1.3, size * 0.3, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // 环的顶部半透明遮盖
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                    ctx.beginPath();
                    ctx.ellipse(cx, cy, size * 1.3, size * 0.3, 0, Math.PI, 2 * Math.PI);
                    ctx.stroke();
                    ctx.globalCompositeOperation = 'source-over';
                }
                
                // 行星表面细节
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                
                // 随机添加表面纹理
                for (let i = 0; i < 4; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * size * 0.7;
                    const spotSize = size * (0.1 + Math.random() * 0.1);
                    
                    ctx.beginPath();
                    ctx.arc(
                        cx + Math.cos(angle) * distance,
                        cy + Math.sin(angle) * distance,
                        spotSize, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
                
                // 可爱表情（如果需要）
                if (hasFace) {
                    // 眼睛
                    ctx.fillStyle = "#000";
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.3, cy - size * 0.1, size * 0.15, 0, Math.PI * 2);
                    ctx.arc(cx + size * 0.3, cy - size * 0.1, size * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 眼睛高光
                    ctx.fillStyle = "#FFF";
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.25, cy - size * 0.15, size * 0.05, 0, Math.PI * 2);
                    ctx.arc(cx + size * 0.35, cy - size * 0.15, size * 0.05, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 笑容
                    ctx.strokeStyle = "#000";
                    ctx.lineWidth = size * 0.08;
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    ctx.arc(cx, cy + size * 0.1, size * 0.4, 0.1 * Math.PI, 0.9 * Math.PI);
                    ctx.stroke();
                }
            };
            
            // 自定义绘制UFO函数
            const drawUFO = (cx, cy, size, bodyColor, domeColor, lightColor) => {
                // UFO光束
                if (lightColor) {
                    const beamGradient = ctx.createLinearGradient(cx, cy + size * 0.5, cx, cy + size * 2);
                    beamGradient.addColorStop(0, lightColor);
                    beamGradient.addColorStop(1, "rgba(255, 0, 255, 0)");
                    
                    ctx.fillStyle = beamGradient;
                    ctx.beginPath();
                    ctx.moveTo(cx - size * 0.7, cy + size * 0.5);
                    ctx.lineTo(cx + size * 0.7, cy + size * 0.5);
                    ctx.lineTo(cx + size * 1.2, cy + size * 2);
                    ctx.lineTo(cx - size * 1.2, cy + size * 2);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // UFO底部
                ctx.fillStyle = bodyColor;
                ctx.beginPath();
                ctx.ellipse(cx, cy + size * 0.1, size, size * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // UFO舱体
                ctx.fillStyle = domeColor;
                ctx.beginPath();
                ctx.ellipse(cx, cy - size * 0.2, size * 0.7, size * 0.5, 0, Math.PI, 0);
                ctx.fill();
                
                // 舱体反光
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.beginPath();
                ctx.ellipse(cx, cy - size * 0.25, size * 0.6, size * 0.3, 0, Math.PI, 0);
                ctx.fill();
                
                // 底部灯光
                const lightCount = 5;
                for (let i = 0; i < lightCount; i++) {
                    const lightAngle = (i / lightCount) * Math.PI;
                    const lightX = cx + Math.cos(lightAngle) * size * 0.8;
                    const lightY = cy + size * 0.1;
                    
                    ctx.fillStyle = `rgba(255, 255, 100, ${0.5 + 0.5 * Math.sin(Date.now() / 500 + i)})`; // 闪烁效果
                    ctx.beginPath();
                    ctx.arc(lightX, lightY, size * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            // 自定义绘制流星函数
            const drawShootingStar = (startX, startY, length, angle, width, color) => {
                const endX = startX + Math.cos(angle) * length;
                const endY = startY + Math.sin(angle) * length;
                
                // 流星尾巴渐变
                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = width;
                ctx.lineCap = "round";
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                // 流星头部
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(startX, startY, width * 0.8, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 绘制星尘，限制在边框区域
            drawSparkleDust(x, y, x + width, y + height, 150, "rgba(255, 255, 255, 0.8)", 0.5, 1.5);
            
            // 在边框区域添加星云渐变
            // 左上角星云
            let nebulaX = x + borderWidth/2;
            let nebulaY = y + borderWidth/2;
            let nebulaRadius = borderWidth * 1.5;
            
            let nebulaGrad = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, nebulaRadius);
            nebulaGrad.addColorStop(0, "rgba(218, 112, 214, 0.15)");
            nebulaGrad.addColorStop(0.5, "rgba(138, 43, 226, 0.08)");
            nebulaGrad.addColorStop(1, "rgba(75, 0, 130, 0)");
            
            ctx.fillStyle = nebulaGrad;
            ctx.beginPath();
            ctx.arc(nebulaX, nebulaY, nebulaRadius, 0, Math.PI*2);
            ctx.fill();
            
            // 右下角星云
            nebulaX = x + width - borderWidth/2;
            nebulaY = y + height - borderWidth/2;
            
            nebulaGrad = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, nebulaRadius);
            nebulaGrad.addColorStop(0, "rgba(0, 191, 255, 0.15)");
            nebulaGrad.addColorStop(0.5, "rgba(30, 144, 255, 0.08)");
            nebulaGrad.addColorStop(1, "rgba(0, 0, 139, 0)");
            
            ctx.fillStyle = nebulaGrad;
            ctx.beginPath();
            ctx.arc(nebulaX, nebulaY, nebulaRadius, 0, Math.PI*2);
            ctx.fill();
            
            // 边框线条
            ctx.strokeStyle = "rgba(173, 216, 230, 0.3)";
            ctx.lineWidth = 3;
            ctx.strokeRect(x + borderWidth, y + borderWidth, width - 2 * borderWidth, height - 2 * borderWidth);
            
            // 所有装饰元素放在边框上，而不是中央区域
            // 左上方装饰
            drawPlanet(x + borderWidth/2, y + borderWidth/2, 20, "#FFB347", "#FDFD96");
            
            // 右上方装饰
            drawUFO(x + width - borderWidth/2, y + borderWidth/2, 18, "#C0C0C0", "#AFEEEE", "#FF00FF");
            
            // 左下方装饰
            drawShootingStar(x + borderWidth/2, y + height - borderWidth/2, 50, -Math.PI/4, 6, "#FFFACD");
            
            // 右下方装饰
            drawPlanet(x + width - borderWidth/2, y + height - borderWidth/2, 15, "#77DD77", null, true);
            
            // 添加更多装饰在边框中部
            drawPlanet(x + width/4, y + borderWidth/2, 12, "#FFD700", null, false);
            drawPlanet(x + width*3/4, y + height - borderWidth/2, 12, "#FF6B88", "#C9E4FF", false);
            drawUFO(x + borderWidth/2, y + height/2, 15, "#E1E1E1", "#B5EAD7", "#87CEEB");
            drawShootingStar(x + width - borderWidth/2, y + height/3, 40, Math.PI*3/4, 5, "#FFC3E6");
            
            // 在边框顶部添加文字，而不是干扰中央内容
            ctx.font = "bold 18px Arial";  // 假设没有特殊字体
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = "rgba(255, 105, 180, 0.7)";
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.textAlign = "center";
            ctx.fillText("Cosmic Cutie ☆", x + width/2, y + borderWidth/2);
            
            // 添加底部文字
            ctx.fillText("★ Space Adventure ★", x + width/2, y + height - borderWidth/3);
            
            // 重置阴影
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
        }
    },
    ghibliDreamworld: {
        description: "吉卜力梦境，带你进入宫崎骏的奇幻世界。温馨自然的边框装饰，充满童话感。",
        draw: (ctx, x, y, width, height) => {
            // 设置边框宽度，确保中心内容不被遮挡
            const borderWidth = 70;
            
            // 绘制吉卜力特色的渐变天空背景（仅在边框区域）
            const drawSkyBackground = () => {
                // 上边框天空渐变
                const topGradient = ctx.createLinearGradient(x, y, x, y + borderWidth);
                topGradient.addColorStop(0, "#87CEEB");  // 浅蓝色天空
                topGradient.addColorStop(1, "#E0F7FF");  // 更浅的蓝色
                
                ctx.fillStyle = topGradient;
                ctx.fillRect(x, y, width, borderWidth);
                
                // 下边框草地渐变
                const bottomGradient = ctx.createLinearGradient(x, y + height - borderWidth, x, y + height);
                bottomGradient.addColorStop(0, "#8FBC8F");  // 深绿色
                bottomGradient.addColorStop(1, "#A7D282");  // 浅绿色
                
                ctx.fillStyle = bottomGradient;
                ctx.fillRect(x, y + height - borderWidth, width, borderWidth);
                
                // 左边框渐变
                const leftGradient = ctx.createLinearGradient(x, y + borderWidth, x + borderWidth, y + borderWidth);
                leftGradient.addColorStop(0, "#87CEEB");
                leftGradient.addColorStop(1, "#E0F7FF");
                
                ctx.fillStyle = leftGradient;
                ctx.fillRect(x, y + borderWidth, borderWidth, height - 2 * borderWidth);
                
                // 右边框渐变
                const rightGradient = ctx.createLinearGradient(x + width - borderWidth, y + borderWidth, x + width, y + borderWidth);
                rightGradient.addColorStop(0, "#E0F7FF");
                rightGradient.addColorStop(1, "#87CEEB");
                
                ctx.fillStyle = rightGradient;
                ctx.fillRect(x + width - borderWidth, y + borderWidth, borderWidth, height - 2 * borderWidth);
                
                // 添加一些柔和的云朵（仅在上边框）
                drawCloud(x + width * 0.2, y + borderWidth * 0.4, borderWidth * 0.8);
                drawCloud(x + width * 0.6, y + borderWidth * 0.6, borderWidth * 0.7);
                drawCloud(x + width * 0.85, y + borderWidth * 0.3, borderWidth * 0.5);
            };
            
            // 绘制吉卜力风格的蓬松云朵
            const drawCloud = (cloudX, cloudY, cloudSize) => {
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                
                // 蓬松的云朵由多个重叠的圆形组成
                ctx.beginPath();
                ctx.arc(cloudX, cloudY, cloudSize * 0.5, 0, Math.PI * 2);
                ctx.arc(cloudX + cloudSize * 0.4, cloudY - cloudSize * 0.1, cloudSize * 0.45, 0, Math.PI * 2);
                ctx.arc(cloudX + cloudSize * 0.7, cloudY + cloudSize * 0.05, cloudSize * 0.35, 0, Math.PI * 2);
                ctx.arc(cloudX + cloudSize * 0.3, cloudY + cloudSize * 0.2, cloudSize * 0.4, 0, Math.PI * 2);
                ctx.arc(cloudX - cloudSize * 0.2, cloudY + cloudSize * 0.1, cloudSize * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // 为云朵添加轻微的阴影，增加立体感
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.beginPath();
                ctx.arc(cloudX + cloudSize * 0.1, cloudY + cloudSize * 0.3, cloudSize * 0.3, 0, Math.PI);
                ctx.fill();
            };
            
            // 绘制草地和花朵（在下边框）
            const drawGrassAndFlowers = () => {
                // 绘制一些随机的草丛
                ctx.fillStyle = "#528539";
                for (let i = 0; i < width; i += 20) {
                    const grassHeight = 10 + Math.random() * 15;
                    const grassWidth = 5 + Math.random() * 8;
                    
                    ctx.beginPath();
                    ctx.moveTo(x + i, y + height - 2);
                    ctx.quadraticCurveTo(
                        x + i + grassWidth/2, 
                        y + height - grassHeight - 10, 
                        x + i + grassWidth, 
                        y + height - 2
                    );
                    ctx.fill();
                }
                
                // 绘制几朵小花
                const flowerPositions = [
                    {x: x + width * 0.1, y: y + height - borderWidth * 0.6, color: "#FFD700"},
                    {x: x + width * 0.3, y: y + height - borderWidth * 0.5, color: "#FF69B4"},
                    {x: x + width * 0.5, y: y + height - borderWidth * 0.7, color: "#FFFFFF"},
                    {x: x + width * 0.7, y: y + height - borderWidth * 0.4, color: "#9370DB"},
                    {x: x + width * 0.9, y: y + height - borderWidth * 0.6, color: "#FF6347"},
                    {x: x + width * 0.15, y: y + height - borderWidth * 0.3, color: "#FFFFFF"},
                    {x: x + width * 0.65, y: y + height - borderWidth * 0.3, color: "#FFD700"},
                    {x: x + width * 0.85, y: y + height - borderWidth * 0.5, color: "#FF69B4"}
                ];
                
                flowerPositions.forEach(flower => {
                    drawFlower(flower.x, flower.y, 6, flower.color);
                });
            };
            
            // 绘制吉卜力风格的简单花朵
            const drawFlower = (fx, fy, size, color) => {
                // 花瓣
                ctx.fillStyle = color;
                for (let i = 0; i < 5; i++) {
                    const angle = i * (Math.PI * 2) / 5;
                    ctx.beginPath();
                    ctx.ellipse(
                        fx + Math.cos(angle) * size * 0.8,
                        fy + Math.sin(angle) * size * 0.8,
                        size, size * 0.6,
                        angle, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
                
                // 花蕊
                ctx.fillStyle = "#FFFF00";
                ctx.beginPath();
                ctx.arc(fx, fy, size * 0.6, 0, Math.PI * 2);
                ctx.fill();
                
                // 花茎
                ctx.strokeStyle = "#528539";
                ctx.lineWidth = size * 0.3;
                ctx.beginPath();
                ctx.moveTo(fx, fy + size * 0.5);
                ctx.lineTo(fx, fy + size * 3);
                ctx.stroke();
                
                // 叶子
                ctx.fillStyle = "#528539";
                ctx.beginPath();
                ctx.ellipse(
                    fx - size * 1.2, fy + size * 1.5,
                    size * 1.2, size * 0.5,
                    -Math.PI/4, 0, Math.PI * 2
                );
                ctx.fill();
            };
            
            // 绘制吉卜力风格的龙猫 (Totoro)
            const drawTotoro = (tx, ty, size) => {
                // 身体
                ctx.fillStyle = "#8c8c8c";
                ctx.beginPath();
                ctx.ellipse(tx, ty, size * 0.8, size, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // 肚子
                ctx.fillStyle = "#d9d9d9";
                ctx.beginPath();
                ctx.ellipse(tx, ty + size * 0.2, size * 0.6, size * 0.7, 0, 0, Math.PI);
                ctx.fill();
                
                // 腹部花纹
                ctx.strokeStyle = "#8c8c8c";
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(tx - size * 0.2, ty + size * (0.3 + i * 0.15));
                    ctx.lineTo(tx + size * 0.2, ty + size * (0.3 + i * 0.15));
                    ctx.stroke();
                }
                
                // 耳朵
                ctx.fillStyle = "#8c8c8c";
                ctx.beginPath();
                ctx.ellipse(tx - size * 0.5, ty - size * 0.8, size * 0.25, size * 0.4, -Math.PI/6, 0, Math.PI * 2);
                ctx.ellipse(tx + size * 0.5, ty - size * 0.8, size * 0.25, size * 0.4, Math.PI/6, 0, Math.PI * 2);
                ctx.fill();
                
                // 眼睛
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(tx - size * 0.25, ty - size * 0.3, size * 0.15, 0, Math.PI * 2);
                ctx.arc(tx + size * 0.25, ty - size * 0.3, size * 0.15, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(tx - size * 0.25, ty - size * 0.3, size * 0.07, 0, Math.PI * 2);
                ctx.arc(tx + size * 0.25, ty - size * 0.3, size * 0.07, 0, Math.PI * 2);
                ctx.fill();
                
                // 鼻子
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(tx, ty - size * 0.1, size * 0.08, 0, Math.PI * 2);
                ctx.fill();
                
                // 胡须
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                // 左侧胡须
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(tx - size * 0.1, ty - size * 0.1 + i * size * 0.1);
                    ctx.lineTo(tx - size * 0.6, ty - size * 0.2 + i * size * 0.2);
                    ctx.stroke();
                }
                // 右侧胡须
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(tx + size * 0.1, ty - size * 0.1 + i * size * 0.1);
                    ctx.lineTo(tx + size * 0.6, ty - size * 0.2 + i * size * 0.2);
                    ctx.stroke();
                }
            };
            
            // 绘制吉卜力风格的小煤炭精灵 (Soot Sprite)
            const drawSootSprite = (sx, sy, size) => {
                // 身体 - 黑色毛球
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fill();
                
                // 随机的毛发效果
                ctx.fillStyle = "#000000";
                const hairCount = 12;
                for (let i = 0; i < hairCount; i++) {
                    const angle = i * (Math.PI * 2) / hairCount;
                    const hairLength = size * (0.1 + Math.random() * 0.2);
                    
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(
                        sx + Math.cos(angle) * (size + hairLength),
                        sy + Math.sin(angle) * (size + hairLength)
                    );
                    ctx.lineWidth = 1 + Math.random() * 2;
                    ctx.stroke();
                }
                
                // 眼睛
                ctx.fillStyle = "#FFFFFF";
                const eyeOffset = size * 0.4;
                ctx.beginPath();
                ctx.arc(sx - eyeOffset, sy - eyeOffset, size * 0.3, 0, Math.PI * 2);
                ctx.arc(sx + eyeOffset, sy - eyeOffset, size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // 眼球
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(sx - eyeOffset, sy - eyeOffset, size * 0.15, 0, Math.PI * 2);
                ctx.arc(sx + eyeOffset, sy - eyeOffset, size * 0.15, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 绘制吉卜力风格的小白龙 (Haku)
            const drawHaku = (hx, hy, size, isFull = false) => {
                if (isFull) {
                    // 完整的龙身
                    ctx.fillStyle = "#FFFFFF";
                    
                    // 身体主干（蜿蜒的曲线）
                    ctx.beginPath();
                    ctx.moveTo(hx, hy);
                    ctx.bezierCurveTo(
                        hx - size * 1.5, hy - size * 0.5,
                        hx - size, hy + size,
                        hx + size * 0.5, hy + size * 0.8
                    );
                    ctx.bezierCurveTo(
                        hx + size * 2, hy + size * 0.6,
                        hx + size * 2.5, hy - size * 0.5,
                        hx + size * 1.5, hy - size * 0.8
                    );
                    
                    ctx.lineWidth = size * 0.4;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                    
                    // 龙头
                    ctx.fillStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.ellipse(hx, hy, size * 0.5, size * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 角
                    ctx.strokeStyle = "#b3ecff";
                    ctx.lineWidth = size * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(hx, hy - size * 0.2);
                    ctx.bezierCurveTo(
                        hx - size * 0.3, hy - size * 0.6,
                        hx - size * 0.1, hy - size * 0.8,
                        hx + size * 0.2, hy - size * 0.6
                    );
                    ctx.stroke();
                    
                    // 眼睛
                    ctx.fillStyle = "#49796b";
                    ctx.beginPath();
                    ctx.arc(hx - size * 0.2, hy - size * 0.05, size * 0.08, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // 仅绘制龙头（简化版本，适合小尺寸）
                    // 龙头
                    ctx.fillStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.ellipse(hx, hy, size * 0.5, size * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 角
                    ctx.strokeStyle = "#b3ecff";
                    ctx.lineWidth = size * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(hx, hy - size * 0.2);
                    ctx.bezierCurveTo(
                        hx - size * 0.3, hy - size * 0.6,
                        hx - size * 0.1, hy - size * 0.8,
                        hx + size * 0.2, hy - size * 0.6
                    );
                    ctx.stroke();
                    
                    // 身体一小段
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.lineWidth = size * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(hx + size * 0.4, hy);
                    ctx.bezierCurveTo(
                        hx + size * 0.8, hy + size * 0.2,
                        hx + size * 1.2, hy - size * 0.2,
                        hx + size * 1.6, hy - size * 0.4
                    );
                    ctx.stroke();
                    
                    // 眼睛
                    ctx.fillStyle = "#49796b";
                    ctx.beginPath();
                    ctx.arc(hx - size * 0.2, hy - size * 0.05, size * 0.08, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            // 绘制吉卜力风格的无脸男 (No-Face)
            const drawNoFace = (nx, ny, size) => {
                // 黑色身体
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(nx, ny, size * 0.6, 0, Math.PI);
                ctx.lineTo(nx - size * 0.3, ny + size * 1.2);
                ctx.lineTo(nx + size * 0.3, ny + size * 1.2);
                ctx.closePath();
                ctx.fill();
                
                // 面具
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(nx, ny, size * 0.5, 0, Math.PI);
                ctx.closePath();
                ctx.fill();
                
                // 面具上的纹路
                ctx.strokeStyle = "#800000";
                ctx.lineWidth = 1;
                
                // 眼睛和嘴巴
                ctx.fillStyle = "#000000";
                // 两个小黑点作为眼睛
                ctx.beginPath();
                ctx.arc(nx - size * 0.2, ny - size * 0.1, size * 0.05, 0, Math.PI * 2);
                ctx.arc(nx + size * 0.2, ny - size * 0.1, size * 0.05, 0, Math.PI * 2);
                ctx.fill();
                
                // 嘴巴线条
                ctx.beginPath();
                ctx.arc(nx, ny + size * 0.1, size * 0.1, 0, Math.PI);
                ctx.stroke();
            };
            
            // 绘制吉卜力风格的千与千寻的小煤炭工人
            const drawSootWorker = (wx, wy, size) => {
                // 身体 - 就是个椭圆
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.ellipse(wx, wy, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // 眼睛 - 两个白点
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(wx - size * 0.15, wy - size * 0.1, size * 0.1, 0, Math.PI * 2);
                ctx.arc(wx + size * 0.15, wy - size * 0.1, size * 0.1, 0, Math.PI * 2);
                ctx.fill();
                
                // 腿 - 细线
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = size * 0.1;
                ctx.beginPath();
                ctx.moveTo(wx - size * 0.2, wy + size * 0.7);
                ctx.lineTo(wx - size * 0.2, wy + size * 1);
                ctx.moveTo(wx + size * 0.2, wy + size * 0.7);
                ctx.lineTo(wx + size * 0.2, wy + size * 1);
                ctx.stroke();
                
                // 手臂
                ctx.beginPath();
                ctx.moveTo(wx - size * 0.5, wy);
                ctx.lineTo(wx - size * 0.8, wy + size * 0.1);
                ctx.moveTo(wx + size * 0.5, wy);
                ctx.lineTo(wx + size * 0.8, wy + size * 0.1);
                ctx.stroke();
            };
            
            // 绘制吉卜力风格的小箭头路标
            const drawSignpost = (px, py, size, text) => {
                // 木桩
                ctx.fillStyle = "#8B4513";
                ctx.beginPath();
                ctx.rect(px - size * 0.1, py, size * 0.2, size * 1.5);
                ctx.fill();
                
                // 箭头牌
                ctx.fillStyle = "#D2B48C";
                ctx.beginPath();
                ctx.moveTo(px, py - size * 0.3);
                ctx.lineTo(px + size, py);
                ctx.lineTo(px + size, py + size * 0.5);
                ctx.lineTo(px, py + size * 0.8);
                ctx.lineTo(px - size * 0.2, py + size * 0.5);
                ctx.lineTo(px - size * 0.2, py);
                ctx.closePath();
                ctx.fill();
                
                // 描边
                ctx.strokeStyle = "#8B4513";
                ctx.lineWidth = size * 0.05;
                ctx.stroke();
                
                // 文字
                ctx.fillStyle = "#5D4037";
                ctx.font = `${size * 0.3}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, px + size * 0.4, py + size * 0.25);
            };
            
            // 绘制霍尔移动城堡的小样式
            const drawMovingCastle = (cx, cy, size) => {
                // 城堡基础部分 - 简化版
                ctx.fillStyle = "#E0E0E0";
                
                // 主要建筑物
                ctx.beginPath();
                ctx.rect(cx - size * 0.8, cy - size * 1.2, size * 1.6, size * 1.2);
                ctx.fill();
                
                // 屋顶
                ctx.fillStyle = "#8B4513";
                ctx.beginPath();
                ctx.moveTo(cx - size * 0.9, cy - size * 1.2);
                ctx.lineTo(cx, cy - size * 1.7);
                ctx.lineTo(cx + size * 0.9, cy - size * 1.2);
                ctx.closePath();
                ctx.fill();
                
                // 窗户
                ctx.fillStyle = "#87CEEB";
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        ctx.beginPath();
                        ctx.rect(
                            cx - size * 0.6 + i * size * 0.5, 
                            cy - size * 1 + j * size * 0.4, 
                            size * 0.3, size * 0.3
                        );
                        ctx.fill();
                    }
                }
                
                // 城堡腿部
                ctx.fillStyle = "#A0522D";
                ctx.beginPath();
                ctx.rect(cx - size * 0.7, cy, size * 0.3, size * 0.5);
                ctx.rect(cx + size * 0.4, cy, size * 0.3, size * 0.5);
                ctx.fill();
                
                // 烟囱
                ctx.fillStyle = "#8B4513";
                ctx.beginPath();
                ctx.rect(cx - size * 0.5, cy - size * 1.9, size * 0.2, size * 0.5);
                ctx.rect(cx + size * 0.2, cy - size * 1.8, size * 0.2, size * 0.4);
                ctx.fill();
                
                // 烟雾
                ctx.fillStyle = "rgba(200, 200, 200, 0.7)";
                ctx.beginPath();
                ctx.arc(cx - size * 0.4, cy - size * 2, size * 0.15, 0, Math.PI * 2);
                ctx.arc(cx - size * 0.3, cy - size * 2.2, size * 0.2, 0, Math.PI * 2);
                ctx.arc(cx - size * 0.1, cy - size * 2.4, size * 0.25, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 执行绘制函数
            // 先绘制边框背景
            drawSkyBackground();
            // 绘制草地和花朵
            drawGrassAndFlowers();
            
            // 添加装饰性的内框边线
            ctx.strokeStyle = "#5D4037";
            ctx.lineWidth = 2;
            ctx.strokeRect(x + borderWidth/2, y + borderWidth/2, 
                           width - borderWidth, height - borderWidth);
            
            // 绘制一个水彩风的半透明效果
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = "#87CEEB";
            const watercolorPos = [
                {x: x + borderWidth/2, y: y + borderWidth/2},
                {x: x + width - borderWidth/2, y: y + borderWidth/2},
                {x: x + borderWidth/2, y: y + height - borderWidth/2},
                {x: x + width - borderWidth/2, y: y + height - borderWidth/2}
            ];
            
            watercolorPos.forEach(pos => {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, borderWidth, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.globalAlpha = 1.0;
            
            // 添加吉卜力风格的装饰元素到边框四周
            // 左上角：龙猫和小煤炭精灵
            drawTotoro(x + borderWidth/2, y + borderWidth/2, borderWidth * 0.35);
            drawSootSprite(x + borderWidth * 0.3, y + borderWidth * 0.8, borderWidth * 0.15);
            drawSootSprite(x + borderWidth * 0.8, y + borderWidth * 0.3, borderWidth * 0.12);
            
            // 右上角：飞行的白龙
            drawHaku(x + width - borderWidth * 0.6, y + borderWidth * 0.5, borderWidth * 0.3, true);
            
            // 左下角：无脸男和小煤炭工人
            drawNoFace(x + borderWidth * 0.4, y + height - borderWidth * 0.6, borderWidth * 0.3);
            drawSootWorker(x + borderWidth * 0.8, y + height - borderWidth * 0.3, borderWidth * 0.2);
            
            // 右下角：移动城堡小图样
            drawMovingCastle(x + width - borderWidth * 0.5, y + height - borderWidth * 0.7, borderWidth * 0.3);
            
            // 在边框中间位置添加小标志
            drawSignpost(x + width * 0.25, y + height - borderWidth * 0.5, borderWidth * 0.2, "魔法");
            drawSignpost(x + width * 0.75, y + borderWidth * 0.5, borderWidth * 0.2, "冒险");
            
            // 在框架四角添加一些小装饰元素
            ctx.fillStyle = "#D0F0C0"; // 淡绿色
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + borderWidth * 0.3, y);
            ctx.lineTo(x, y + borderWidth * 0.3);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width - borderWidth * 0.3, y);
            ctx.lineTo(x + width, y + borderWidth * 0.3);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + borderWidth * 0.3, y + height);
            ctx.lineTo(x, y + height - borderWidth * 0.3);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(x + width, y + height);
            ctx.lineTo(x + width - borderWidth * 0.3, y + height);
            ctx.lineTo(x + width, y + height - borderWidth * 0.3);
            ctx.closePath();
            ctx.fill();
            
            // 添加一些装饰性的手绘线条
            ctx.strokeStyle = "#5D4037";
            ctx.lineWidth = 0.5;
            
            // 上边框装饰线
            ctx.beginPath();
            ctx.moveTo(x + borderWidth, y + borderWidth * 0.3);
            ctx.lineTo(x + width - borderWidth, y + borderWidth * 0.3);
            ctx.stroke();
            
            // 下边框装饰线
            ctx.beginPath();
            ctx.moveTo(x + borderWidth, y + height - borderWidth * 0.3);
            ctx.lineTo(x + width - borderWidth, y + height - borderWidth * 0.3);
            ctx.stroke();
            
            // 添加标题文字
            ctx.font = "italic 24px serif";
            ctx.fillStyle = "#5D4037";
            ctx.textAlign = "center";
        }
    },
};

export default FRAMES;