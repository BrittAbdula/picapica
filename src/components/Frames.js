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
    // 1. 精致梦幻光环 - 改进版
    dreamyAuraRefined: {
        draw: (ctx, x, y, width, height) => {
            // 多层次渐变光环效果
            const createMultiLayerGlow = (cx, cy, baseRadius) => {
                // 外层光晕
                const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.8);
                outerGlow.addColorStop(0, "rgba(255, 182, 193, 0.05)");
                outerGlow.addColorStop(0.3, "rgba(255, 218, 185, 0.08)");
                outerGlow.addColorStop(0.6, "rgba(230, 230, 250, 0.06)");
                outerGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, baseRadius * 1.8, 0, Math.PI * 2);
                ctx.fill();
                
                // 中层彩虹光环
                const middleGlow = ctx.createRadialGradient(cx, cy, baseRadius * 0.3, cx, cy, baseRadius * 1.2);
                middleGlow.addColorStop(0, "rgba(255, 192, 203, 0.15)");
                middleGlow.addColorStop(0.25, "rgba(255, 218, 185, 0.12)");
                middleGlow.addColorStop(0.5, "rgba(221, 160, 221, 0.10)");
                middleGlow.addColorStop(0.75, "rgba(176, 224, 230, 0.08)");
                middleGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.fillStyle = middleGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, baseRadius * 1.2, 0, Math.PI * 2);
                ctx.fill();
                
                // 内层聚焦光
                const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.6);
                innerGlow.addColorStop(0, "rgba(255, 255, 255, 0.25)");
                innerGlow.addColorStop(0.5, "rgba(255, 250, 250, 0.15)");
                innerGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.fillStyle = innerGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, baseRadius * 0.6, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 精致的星光粒子
            const drawRefinedSparkle = (cx, cy, size, intensity = 1) => {
                // 光晕效果
                const sparkleGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 3);
                sparkleGlow.addColorStop(0, `rgba(255, 255, 255, ${0.8 * intensity})`);
                sparkleGlow.addColorStop(0.2, `rgba(255, 255, 255, ${0.4 * intensity})`);
                sparkleGlow.addColorStop(0.5, `rgba(255, 250, 250, ${0.2 * intensity})`);
                sparkleGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.fillStyle = sparkleGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, size * 3, 0, Math.PI * 2);
                ctx.fill();
                
                // 十字星光
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * intensity})`;
                ctx.lineWidth = 1;
                ctx.shadowBlur = 3;
                ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
                
                // 垂直线
                const gradient1 = ctx.createLinearGradient(cx, cy - size * 2, cx, cy + size * 2);
                gradient1.addColorStop(0, "rgba(255, 255, 255, 0)");
                gradient1.addColorStop(0.3, `rgba(255, 255, 255, ${0.6 * intensity})`);
                gradient1.addColorStop(0.5, `rgba(255, 255, 255, ${0.9 * intensity})`);
                gradient1.addColorStop(0.7, `rgba(255, 255, 255, ${0.6 * intensity})`);
                gradient1.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.strokeStyle = gradient1;
                ctx.beginPath();
                ctx.moveTo(cx, cy - size * 2);
                ctx.lineTo(cx, cy + size * 2);
                ctx.stroke();
                
                // 水平线
                const gradient2 = ctx.createLinearGradient(cx - size * 2, cy, cx + size * 2, cy);
                gradient2.addColorStop(0, "rgba(255, 255, 255, 0)");
                gradient2.addColorStop(0.3, `rgba(255, 255, 255, ${0.6 * intensity})`);
                gradient2.addColorStop(0.5, `rgba(255, 255, 255, ${0.9 * intensity})`);
                gradient2.addColorStop(0.7, `rgba(255, 255, 255, ${0.6 * intensity})`);
                gradient2.addColorStop(1, "rgba(255, 255, 255, 0)");
                
                ctx.strokeStyle = gradient2;
                ctx.beginPath();
                ctx.moveTo(cx - size * 2, cy);
                ctx.lineTo(cx + size * 2, cy);
                ctx.stroke();
                
                // 中心亮点
                ctx.shadowBlur = 0;
                ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 绘制精致的水彩效果背景
            const drawWatercolorEffect = () => {
                // 底层淡彩
                ctx.globalAlpha = 0.05;
                const baseGradient = ctx.createLinearGradient(x, y, x + width, y + height);
                baseGradient.addColorStop(0, "#FFE4E1");
                baseGradient.addColorStop(0.3, "#F0E68C");
                baseGradient.addColorStop(0.6, "#E6E6FA");
                baseGradient.addColorStop(1, "#F0FFFF");
                
                ctx.fillStyle = baseGradient;
                ctx.fillRect(x, y, width, height);
                ctx.globalAlpha = 1;
            };
            
            // 应用效果
            drawWatercolorEffect();
            
            // 四角光环
            createMultiLayerGlow(x + 50, y + 50, 35);
            createMultiLayerGlow(x + width - 50, y + 50, 35);
            createMultiLayerGlow(x + 50, y + height - 50, 35);
            createMultiLayerGlow(x + width - 50, y + height - 50, 35);
            
            // 边缘装饰光点
            const sparklePositions = [
                { x: x + 30, y: y + 25, size: 4, intensity: 0.9 },
                { x: x + width - 30, y: y + 25, size: 5, intensity: 1 },
                { x: x + width/2, y: y + 15, size: 3, intensity: 0.7 },
                { x: x + 25, y: y + height - 25, size: 4, intensity: 0.8 },
                { x: x + width - 25, y: y + height - 25, size: 5, intensity: 1 },
                { x: x + width/2, y: y + height - 15, size: 3, intensity: 0.6 },
                { x: x + 15, y: y + height/2, size: 3, intensity: 0.7 },
                { x: x + width - 15, y: y + height/2, size: 4, intensity: 0.8 }
            ];
            
            sparklePositions.forEach(pos => {
                drawRefinedSparkle(pos.x, pos.y, pos.size, pos.intensity);
            });
        }
    },
    
    // 2. 精致日式大头贴 - 改进版
    japanesePurikuraRefined: {
        draw: (ctx, x, y, width, height) => {
            // 辅助函数 - 颜色处理
            const darkenColor = (color, amount) => {
                // 简单的颜色变暗处理
                const colorMap = {
                    "#FFB6C1": "#FF91A4",
                    "#87CEEB": "#6AB5E3",
                    "#FFFFE0": "#E6E6C8",
                    "#DDA0DD": "#C48FC4",
                    "#FFD700": "#E6C200"
                };
                return colorMap[color] || color;
            };
            
            const lightenColor = (color, amount) => {
                // 简单的颜色变亮处理
                const colorMap = {
                    "#FFB6C1": "#FFD6E1",
                    "#87CEEB": "#B7E3F5",
                    "#FFFFE0": "#FFFFF0",
                    "#DDA0DD": "#EEB7EE",
                    "#FFD700": "#FFED4E"
                };
                return colorMap[color] || color;
            };
            
            const drawStarPath = (ctx, cx, cy, size) => {
                const points = 5;
                const outerRadius = size;
                const innerRadius = size / 2;
                
                ctx.beginPath();
                for (let i = 0; i < points * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (Math.PI / points) * i - Math.PI / 2;
                    const x = cx + Math.cos(angle) * radius;
                    const y = cy + Math.sin(angle) * radius;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
            };
            
            // 渐变边框背景
            const createBorderGradient = () => {
                const borderWidth = 15;
                
                // 上边框渐变
                const topGradient = ctx.createLinearGradient(x, y, x, y + borderWidth);
                topGradient.addColorStop(0, "rgba(255, 182, 193, 0.3)");
                topGradient.addColorStop(1, "rgba(255, 182, 193, 0)");
                ctx.fillStyle = topGradient;
                ctx.fillRect(x, y, width, borderWidth);
                
                // 下边框渐变
                const bottomGradient = ctx.createLinearGradient(x, y + height - borderWidth, x, y + height);
                bottomGradient.addColorStop(0, "rgba(173, 216, 230, 0)");
                bottomGradient.addColorStop(1, "rgba(173, 216, 230, 0.3)");
                ctx.fillStyle = bottomGradient;
                ctx.fillRect(x, y + height - borderWidth, width, borderWidth);
                
                // 左边框渐变
                const leftGradient = ctx.createLinearGradient(x, y, x + borderWidth, y);
                leftGradient.addColorStop(0, "rgba(255, 218, 185, 0.3)");
                leftGradient.addColorStop(1, "rgba(255, 218, 185, 0)");
                ctx.fillStyle = leftGradient;
                ctx.fillRect(x, y, borderWidth, height);
                
                // 右边框渐变
                const rightGradient = ctx.createLinearGradient(x + width - borderWidth, y, x + width, y);
                rightGradient.addColorStop(0, "rgba(221, 160, 221, 0)");
                rightGradient.addColorStop(1, "rgba(221, 160, 221, 0.3)");
                ctx.fillStyle = rightGradient;
                ctx.fillRect(x + width - borderWidth, y, borderWidth, height);
            };
            
            // 精致的3D装饰元素
            const draw3DDecoration = (posX, posY, type, size, rotation = 0) => {
                ctx.save();
                ctx.translate(posX, posY);
                ctx.rotate(rotation);
                
                switch(type) {
                    case "gem": {
                        // 宝石效果
                        const colors = {
                            pink: ["#FF69B4", "#FF1493", "#FFB6C1"],
                            blue: ["#87CEEB", "#4682B4", "#B0E0E6"],
                            purple: ["#DDA0DD", "#9370DB", "#E6E6FA"]
                        };
                        
                        const colorSet = Object.values(colors)[Math.floor(Math.random() * 3)];
                        
                        // 底部阴影
                        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                        ctx.beginPath();
                        ctx.ellipse(2, 2, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 宝石主体
                        const gradient = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size);
                        gradient.addColorStop(0, colorSet[2]);
                        gradient.addColorStop(0.5, colorSet[0]);
                        gradient.addColorStop(1, colorSet[1]);
                        
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(0, 0, size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 高光
                        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                        ctx.beginPath();
                        ctx.ellipse(-size/3, -size/3, size/3, size/4, -Math.PI/4, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 反光
                        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                        ctx.beginPath();
                        ctx.arc(size/4, size/4, size/5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        break;
                    }
                    
                    case "ribbon": {
                        // 立体蝴蝶结
                        const ribbonColor = ["#FFB6C1", "#87CEEB", "#FFFFE0", "#DDA0DD"][Math.floor(Math.random() * 4)];
                        
                        // 阴影
                        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
                        ctx.beginPath();
                        ctx.ellipse(2, 3, size * 1.2, size * 0.8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 左侧蝴蝶结
                        const leftGradient = ctx.createLinearGradient(-size, -size/2, 0, size/2);
                        leftGradient.addColorStop(0, ribbonColor);
                        leftGradient.addColorStop(0.7, ribbonColor);
                        leftGradient.addColorStop(1, darkenColor(ribbonColor, 0.3));
                        
                        ctx.fillStyle = leftGradient;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.bezierCurveTo(-size, -size/2, -size*1.2, size/2, 0, size/3);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 右侧蝴蝶结
                        const rightGradient = ctx.createLinearGradient(0, -size/2, size, size/2);
                        rightGradient.addColorStop(0, ribbonColor);
                        rightGradient.addColorStop(0.3, ribbonColor);
                        rightGradient.addColorStop(1, darkenColor(ribbonColor, 0.3));
                        
                        ctx.fillStyle = rightGradient;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.bezierCurveTo(size, -size/2, size*1.2, size/2, 0, size/3);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 中心结
                        ctx.fillStyle = darkenColor(ribbonColor, 0.2);
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size/3, size/4, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 高光
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.beginPath();
                        ctx.ellipse(-size/2, -size/4, size/4, size/8, -Math.PI/6, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.beginPath();
                        ctx.ellipse(size/2, -size/4, size/4, size/8, Math.PI/6, 0, Math.PI * 2);
                        ctx.fill();
                        
                        break;
                    }
                    
                    case "star": {
                        // 立体星星
                        const starColor = ["#FFD700", "#FFA500", "#FF69B4", "#87CEEB"][Math.floor(Math.random() * 4)];
                        
                        // 阴影
                        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                        ctx.save();
                        ctx.translate(3, 3);
                        drawStarPath(ctx, 0, 0, size);
                        ctx.fill();
                        ctx.restore();
                        
                        // 星星主体 - 渐变
                        const starGradient = ctx.createRadialGradient(-size/3, -size/3, 0, 0, 0, size);
                        starGradient.addColorStop(0, lightenColor(starColor, 0.3));
                        starGradient.addColorStop(0.5, starColor);
                        starGradient.addColorStop(1, darkenColor(starColor, 0.2));
                        
                        ctx.fillStyle = starGradient;
                        drawStarPath(ctx, 0, 0, size);
                        ctx.fill();
                        
                        // 内部高光
                        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                        drawStarPath(ctx, -size/4, -size/4, size/3);
                        ctx.fill();
                        
                        break;
                    }
                    
                    case "heart": {
                        // 立体爱心
                        const heartColor = ["#FF69B4", "#FF1493", "#FFB6C1", "#FF85A1"][Math.floor(Math.random() * 4)];
                        
                        // 阴影
                        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                        ctx.save();
                        ctx.translate(2, 3);
                        
                        ctx.beginPath();
                        ctx.moveTo(0, size/3);
                        ctx.bezierCurveTo(0, 0, -size/2, 0, -size/2, size/3);
                        ctx.bezierCurveTo(-size/2, size*0.6, 0, size*0.9, 0, size*1.2);
                        ctx.bezierCurveTo(0, size*0.9, size/2, size*0.6, size/2, size/3);
                        ctx.bezierCurveTo(size/2, 0, 0, 0, 0, size/3);
                        ctx.fill();
                        ctx.restore();
                        
                        // 爱心主体
                        const heartGradient = ctx.createRadialGradient(-size/4, -size/4, 0, 0, 0, size);
                        heartGradient.addColorStop(0, lightenColor(heartColor, 0.3));
                        heartGradient.addColorStop(0.5, heartColor);
                        heartGradient.addColorStop(1, darkenColor(heartColor, 0.2));
                        
                        ctx.fillStyle = heartGradient;
                        ctx.beginPath();
                        ctx.moveTo(0, size/3);
                        ctx.bezierCurveTo(0, 0, -size/2, 0, -size/2, size/3);
                        ctx.bezierCurveTo(-size/2, size*0.6, 0, size*0.9, 0, size*1.2);
                        ctx.bezierCurveTo(0, size*0.9, size/2, size*0.6, size/2, size/3);
                        ctx.bezierCurveTo(size/2, 0, 0, 0, 0, size/3);
                        ctx.fill();
                        
                        // 高光
                        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                        ctx.beginPath();
                        ctx.ellipse(-size/4, size/6, size/4, size/3, -Math.PI/6, 0, Math.PI * 2);
                        ctx.fill();
                        
                        break;
                    }
                }
                
                ctx.restore();
            };
            
            // 应用效果
            createBorderGradient();
            
            // 精心布置的装饰元素
            draw3DDecoration(x + 35, y + 35, "gem", 15, Math.PI / 8);
            draw3DDecoration(x + width - 35, y + 35, "ribbon", 20, -Math.PI / 10);
            draw3DDecoration(x + 35, y + height - 35, "star", 18, Math.PI / 6);
            draw3DDecoration(x + width - 35, y + height - 35, "heart", 16, -Math.PI / 8);
            
            // 添加更多小装饰
            draw3DDecoration(x + width/2, y + 20, "star", 12, 0);
            draw3DDecoration(x + width/2, y + height - 20, "ribbon", 15, Math.PI);
            draw3DDecoration(x + 20, y + height/2, "gem", 10, Math.PI / 4);
            draw3DDecoration(x + width - 20, y + height/2, "heart", 10, -Math.PI / 4);
            
            // 添加闪光点缀
            const drawSparkle = (cx, cy, size) => {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();
                
                // 十字闪光
                ctx.moveTo(cx - size, cy);
                ctx.lineTo(cx + size, cy);
                ctx.moveTo(cx, cy - size);
                ctx.lineTo(cx, cy + size);
                
                // 斜十字
                const smallSize = size * 0.7;
                ctx.moveTo(cx - smallSize, cy - smallSize);
                ctx.lineTo(cx + smallSize, cy + smallSize);
                ctx.moveTo(cx - smallSize, cy + smallSize);
                ctx.lineTo(cx + smallSize, cy - smallSize);
                
                ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // 中心亮点
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 添加随机闪光
            for (let i = 0; i < 8; i++) {
                const sparkleX = x + 10 + Math.random() * (width - 20);
                const sparkleY = y + 10 + Math.random() * (height - 20);
                // 确保闪光只在边缘
                if (sparkleX < x + 50 || sparkleX > x + width - 50 || 
                    sparkleY < y + 50 || sparkleY > y + height - 50) {
                    drawSparkle(sparkleX, sparkleY, 3 + Math.random() * 2);
                }
            }
        }
    },
    
    // 3. 精致霓虹光效 - 全新设计
    neonGlowDeluxe: {
        draw: (ctx, x, y, width, height) => {
            // 创建复杂的霓虹光效
            const createNeonEffect = (path, color, glowSize = 10) => {
                // 外层光晕
                ctx.shadowColor = color;
                ctx.shadowBlur = glowSize * 2;
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.3;
                ctx.stroke(path);
                
                // 中层光晕
                ctx.shadowBlur = glowSize;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5;
                ctx.stroke(path);
                
                // 内层光线
                ctx.shadowBlur = glowSize / 2;
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.8;
                ctx.stroke(path);
                
                // 核心线条
                ctx.shadowBlur = 0;
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1;
                ctx.stroke(path);
                
                ctx.globalAlpha = 1;
            };
            
            // 创建几何图案路径
            const createGeometricPattern = () => {
                const path = new Path2D();
                
                // 六边形图案
                const hexSize = 20;
                const drawHexagon = (cx, cy) => {
                    path.moveTo(cx + hexSize, cy);
                    for (let i = 1; i <= 6; i++) {
                        const angle = (i * Math.PI) / 3;
                        path.lineTo(cx + hexSize * Math.cos(angle), cy + hexSize * Math.sin(angle));
                    }
                };
                
                // 在角落创建六边形
                drawHexagon(x + 40, y + 40);
                drawHexagon(x + width - 40, y + 40);
                drawHexagon(x + 40, y + height - 40);
                drawHexagon(x + width - 40, y + height - 40);
                
                return path;
            };
            
            // 创建流动线条
            const createFlowingLines = () => {
                const path = new Path2D();
                
                // 上边流动线
                path.moveTo(x + 60, y + 10);
                path.bezierCurveTo(
                    x + width/3, y + 15,
                    x + width*2/3, y + 15,
                    x + width - 60, y + 10
                );
                
                // 下边流动线
                path.moveTo(x + 60, y + height - 10);
                path.bezierCurveTo(
                    x + width/3, y + height - 15,
                    x + width*2/3, y + height - 15,
                    x + width - 60, y + height - 10
                );
                
                return path;
            };
            
            // 应用霓虹效果
            const geometricPath = createGeometricPattern();
            createNeonEffect(geometricPath, "#00FFFF", 15); // 青色霓虹
            
            const flowingPath = createFlowingLines();
            createNeonEffect(flowingPath, "#FF00FF", 12); // 品红霓虹
            
            // 添加点缀光点
            const drawNeonDot = (cx, cy, size, color) => {
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 3);
                gradient.addColorStop(0, color);
                gradient.addColorStop(0.3, color + "80");
                gradient.addColorStop(0.6, color + "40");
                gradient.addColorStop(1, color + "00");
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cx, cy, size * 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 随机放置霓虹点
            const neonColors = ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00"];
            for (let i = 0; i < 12; i++) {
                const edge = Math.floor(Math.random() * 4);
                let dotX, dotY;
                
                switch(edge) {
                    case 0: // 上边
                        dotX = x + 30 + Math.random() * (width - 60);
                        dotY = y + 10 + Math.random() * 20;
                        break;
                    case 1: // 右边
                        dotX = x + width - 30 + Math.random() * 20;
                        dotY = y + 30 + Math.random() * (height - 60);
                        break;
                    case 2: // 下边
                        dotX = x + 30 + Math.random() * (width - 60);
                        dotY = y + height - 30 + Math.random() * 20;
                        break;
                    case 3: // 左边
                        dotX = x + 10 + Math.random() * 20;
                        dotY = y + 30 + Math.random() * (height - 60);
                        break;
                }
                
                const color = neonColors[Math.floor(Math.random() * neonColors.length)];
                drawNeonDot(dotX, dotY, 2 + Math.random() * 2, color);
            }
        }
    },
    // 1. 甜点派对主题 - 修正版
    sweetPartyFrame: {
        draw: (ctx, x, y, width, height) => {
            // 只在照片周围绘制装饰，不遮挡中心区域
            
            // 绘制装饰边框
            const drawDecorativeBorder = () => {
                // 顶部装饰条
                const topGradient = ctx.createLinearGradient(x, y, x, y + 40);
                topGradient.addColorStop(0, "rgba(255, 182, 193, 0.8)");
                topGradient.addColorStop(1, "rgba(255, 182, 193, 0)");
                ctx.fillStyle = topGradient;
                ctx.fillRect(x, y, width, 40);
                
                // 底部装饰条
                const bottomGradient = ctx.createLinearGradient(x, y + height - 40, x, y + height);
                bottomGradient.addColorStop(0, "rgba(255, 218, 185, 0)");
                bottomGradient.addColorStop(1, "rgba(255, 218, 185, 0.8)");
                ctx.fillStyle = bottomGradient;
                ctx.fillRect(x, y + height - 40, width, 40);
                
                // 左侧装饰条
                const leftGradient = ctx.createLinearGradient(x, y, x + 40, y);
                leftGradient.addColorStop(0, "rgba(255, 240, 245, 0.8)");
                leftGradient.addColorStop(1, "rgba(255, 240, 245, 0)");
                ctx.fillStyle = leftGradient;
                ctx.fillRect(x, y, 40, height);
                
                // 右侧装饰条
                const rightGradient = ctx.createLinearGradient(x + width - 40, y, x + width, y);
                rightGradient.addColorStop(0, "rgba(255, 239, 213, 0)");
                rightGradient.addColorStop(1, "rgba(255, 239, 213, 0.8)");
                ctx.fillStyle = rightGradient;
                ctx.fillRect(x + width - 40, y, 40, height);
            };
            
            // 绘制角落装饰
            const drawCornerDecoration = () => {
                // 左上角 - 小熊和蛋糕
                const drawBear = (cx, cy, size) => {
                    // 身体
                    ctx.fillStyle = "#D2691E";
                    ctx.beginPath();
                    ctx.arc(cx, cy, size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 耳朵
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.7, cy - size * 0.7, size * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cx + size * 0.7, cy - size * 0.7, size * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 内耳
                    ctx.fillStyle = "#FFB6C1";
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.7, cy - size * 0.7, size * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cx + size * 0.7, cy - size * 0.7, size * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 脸部特征
                    ctx.fillStyle = "#000000";
                    // 眼睛
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.3, cy - size * 0.1, size * 0.08, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cx + size * 0.3, cy - size * 0.1, size * 0.08, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 鼻子
                    ctx.beginPath();
                    ctx.arc(cx, cy + size * 0.1, size * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 腮红
                    ctx.fillStyle = "rgba(255, 182, 193, 0.5)";
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.5, cy + size * 0.2, size * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cx + size * 0.5, cy + size * 0.2, size * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                };
                
                const drawCake = (cx, cy, size) => {
                    // 盘子
                    ctx.fillStyle = "#E6E6FA";
                    ctx.beginPath();
                    ctx.ellipse(cx, cy + size * 0.8, size * 0.8, size * 0.2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 蛋糕底层
                    ctx.fillStyle = "#8B4513";
                    ctx.beginPath();
                    ctx.moveTo(cx - size * 0.5, cy + size * 0.5);
                    ctx.lineTo(cx + size * 0.5, cy + size * 0.5);
                    ctx.lineTo(cx + size * 0.4, cy);
                    ctx.lineTo(cx - size * 0.4, cy);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 奶油层
                    ctx.fillStyle = "#FFFACD";
                    ctx.beginPath();
                    ctx.moveTo(cx - size * 0.4, cy);
                    ctx.lineTo(cx + size * 0.4, cy);
                    ctx.lineTo(cx + size * 0.3, cy - size * 0.3);
                    ctx.lineTo(cx - size * 0.3, cy - size * 0.3);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 草莓
                    ctx.fillStyle = "#FF1493";
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - size * 0.5);
                    ctx.lineTo(cx - size * 0.2, cy - size * 0.3);
                    ctx.lineTo(cx + size * 0.2, cy - size * 0.3);
                    ctx.closePath();
                    ctx.fill();
                };
                
                // 绘制装饰
                drawBear(x + 25, y + 25, 15);
                drawCake(x + 60, y + 30, 20);
                
                // 右上角 - 蝴蝶结
                const drawRibbon = (cx, cy, size) => {
                    // 阴影
                    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
                    ctx.beginPath();
                    ctx.ellipse(cx + 2, cy + 2, size * 1.2, size * 0.8, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = "#FF69B4";
                    // 左边蝴蝶结
                    ctx.beginPath();
                    ctx.ellipse(cx - size * 0.6, cy, size * 0.8, size * 0.5, -Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 右边蝴蝶结
                    ctx.beginPath();
                    ctx.ellipse(cx + size * 0.6, cy, size * 0.8, size * 0.5, Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 中心结
                    ctx.fillStyle = "#FF1493";
                    ctx.beginPath();
                    ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 高光
                    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.5, cy - size * 0.2, size * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                };
                
                drawRibbon(x + width - 40, y + 35, 20);
                
                // 左下角 - 星星和心形
                const drawStar = (cx, cy, size) => {
                    ctx.fillStyle = "#FFD700";
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                        const px = cx + size * Math.cos(angle);
                        const py = cy + size * Math.sin(angle);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fill();
                    
                    // 高光
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.beginPath();
                    ctx.arc(cx - size * 0.2, cy - size * 0.2, size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                };
                
                const drawHeart = (cx, cy, size) => {
                    ctx.fillStyle = "#FF69B4";
                    ctx.beginPath();
                    ctx.moveTo(cx, cy + size * 0.3);
                    ctx.bezierCurveTo(
                        cx, cy,
                        cx - size, cy,
                        cx - size, cy + size * 0.3
                    );
                    ctx.bezierCurveTo(
                        cx - size, cy + size * 0.8,
                        cx, cy + size * 1.2,
                        cx, cy + size * 1.5
                    );
                    ctx.bezierCurveTo(
                        cx, cy + size * 1.2,
                        cx + size, cy + size * 0.8,
                        cx + size, cy + size * 0.3
                    );
                    ctx.bezierCurveTo(
                        cx + size, cy,
                        cx, cy,
                        cx, cy + size * 0.3
                    );
                    ctx.fill();
                };
                
                drawStar(x + 30, y + height - 40, 12);
                drawHeart(x + 55, y + height - 35, 10);
                
                // 右下角 - Picapica.app 品牌标识
                ctx.save();
                // 品牌背景
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.beginPath();
                ctx.roundRect(x + width - 110, y + height - 35, 100, 25, 10);
                ctx.fill();
                
                // 品牌文字
                ctx.font = "bold 12px Arial";
                ctx.fillStyle = "#FF69B4";
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.fillText("Picapica.app", x + width - 15, y + height - 22);
                ctx.restore();
            };
            
            // 绘制点缀元素
            const drawSparkles = () => {
                const sparkleColors = ["#FFD700", "#FF69B4", "#87CEEB", "#DDA0DD"];
                
                // 只在边缘区域添加闪光点
                for (let i = 0; i < 15; i++) {
                    const side = Math.floor(Math.random() * 4);
                    let sparkleX, sparkleY;
                    
                    switch(side) {
                        case 0: // 顶部
                            sparkleX = x + 50 + Math.random() * (width - 100);
                            sparkleY = y + 5 + Math.random() * 30;
                            break;
                        case 1: // 右侧
                            sparkleX = x + width - 35 + Math.random() * 30;
                            sparkleY = y + 50 + Math.random() * (height - 100);
                            break;
                        case 2: // 底部
                            sparkleX = x + 50 + Math.random() * (width - 100);
                            sparkleY = y + height - 35 + Math.random() * 30;
                            break;
                        case 3: // 左侧
                            sparkleX = x + 5 + Math.random() * 30;
                            sparkleY = y + 50 + Math.random() * (height - 100);
                            break;
                    }
                    
                    ctx.fillStyle = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, 2 + Math.random() * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            // 应用所有装饰
            drawDecorativeBorder();
            drawCornerDecoration();
            drawSparkles();
        }
    },
    
    // 2. 粉色梦幻主题 - 修正版
    pinkDreamFrame: {
        draw: (ctx, x, y, width, height) => {
            // 绘制边框渐变
            const drawGradientBorder = () => {
                const borderWidth = 35;
                
                // 创建遮罩路径 - 只绘制边框区域
                ctx.save();
                
                // 外部矩形
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                
                // 内部矩形（反向路径）
                ctx.moveTo(x + borderWidth, y + borderWidth);
                ctx.lineTo(x + borderWidth, y + height - borderWidth);
                ctx.lineTo(x + width - borderWidth, y + height - borderWidth);
                ctx.lineTo(x + width - borderWidth, y + borderWidth);
                ctx.lineTo(x + borderWidth, y + borderWidth);
                
                ctx.clip('evenodd');
                
                // 绘制渐变
                const gradient = ctx.createRadialGradient(
                    x + width/2, y + height/2, 0,
                    x + width/2, y + height/2, Math.max(width, height) * 0.7
                );
                gradient.addColorStop(0, "rgba(255, 192, 203, 0.3)");
                gradient.addColorStop(0.5, "rgba(255, 182, 193, 0.5)");
                gradient.addColorStop(1, "rgba(255, 105, 180, 0.3)");
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, width, height);
                
                ctx.restore();
            };
            
            // 绘制装饰花朵
            const drawFlower = (cx, cy, size, color) => {
                const petalCount = 6;
                
                // 花瓣
                ctx.fillStyle = color;
                for (let i = 0; i < petalCount; i++) {
                    const angle = (i * 2 * Math.PI) / petalCount;
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(angle);
                    
                    ctx.beginPath();
                    ctx.ellipse(0, -size * 0.7, size * 0.4, size * 0.7, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
                
                // 花心
                ctx.fillStyle = "#FFD700";
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // 花心纹理
                ctx.fillStyle = "#FFA500";
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI) / 4;
                    const dotX = cx + Math.cos(angle) * size * 0.2;
                    const dotY = cy + Math.sin(angle) * size * 0.2;
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, size * 0.05, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            
            // 绘制云朵装饰
            const drawCloud = (cx, cy, size) => {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                
                // 云朵主体
                const circles = [
                    { x: 0, y: 0, r: size },
                    { x: -size * 0.6, y: size * 0.1, r: size * 0.7 },
                    { x: size * 0.6, y: size * 0.1, r: size * 0.7 },
                    { x: -size * 0.3, y: -size * 0.3, r: size * 0.5 },
                    { x: size * 0.3, y: -size * 0.3, r: size * 0.5 }
                ];
                
                circles.forEach(circle => {
                    ctx.beginPath();
                    ctx.arc(cx + circle.x, cy + circle.y, circle.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                // 云朵高光
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.beginPath();
                ctx.arc(cx - size * 0.2, cy - size * 0.2, size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // 绘制边框和装饰
            drawGradientBorder();
            
            // 角落装饰
            drawFlower(x + 30, y + 30, 20, "#FFB6C1");
            drawCloud(x + width - 50, y + 35, 15);
            drawFlower(x + width - 30, y + height - 30, 18, "#DDA0DD");
            drawCloud(x + 40, y + height - 40, 12);
            
            // 边缘小花装饰
            const edgeFlowers = [
                { x: x + width/2, y: y + 20, size: 15, color: "#87CEEB" },
                { x: x + width/2, y: y + height - 20, size: 15, color: "#F0E68C" },
                { x: x + 20, y: y + height/2, size: 12, color: "#FFB6C1" },
                { x: x + width - 20, y: y + height/2, size: 12, color: "#DDA0DD" }
            ];
            
            edgeFlowers.forEach(flower => {
                drawFlower(flower.x, flower.y, flower.size, flower.color);
            });
            
            // 添加梦幻光点
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            for (let i = 0; i < 20; i++) {
                const sparkleX = x + Math.random() * width;
                const sparkleY = y + Math.random() * height;
                
                // 确保光点只在边缘
                if (sparkleX < x + 40 || sparkleX > x + width - 40 ||
                    sparkleY < y + 40 || sparkleY > y + height - 40) {
                    const sparkleSize = 1 + Math.random() * 3;
                    ctx.beginPath();
                    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // 品牌标识
            ctx.font = "14px Arial";
            ctx.fillStyle = "rgba(255, 105, 180, 0.8)";
            ctx.textAlign = "center";
            ctx.fillText("Picapica.app", x + width/2, y + height - 10);
        }
    },
    
    // 3. 卡通贴纸风格 - 新设计
    cartoonStickerFrame: {
        draw: (ctx, x, y, width, height) => {
            // 只在边缘添加贴纸装饰
            
            // 绘制卡通小动物
            const drawCartoonAnimal = (type, cx, cy, size) => {
                switch(type) {
                    case 'cat':
                        // 猫咪
                        ctx.fillStyle = "#FFB366";
                        // 身体
                        ctx.beginPath();
                        ctx.ellipse(cx, cy + size * 0.2, size * 0.8, size, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 头
                        ctx.beginPath();
                        ctx.arc(cx, cy - size * 0.3, size * 0.6, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 耳朵
                        ctx.beginPath();
                        ctx.moveTo(cx - size * 0.5, cy - size * 0.3);
                        ctx.lineTo(cx - size * 0.3, cy - size * 0.8);
                        ctx.lineTo(cx - size * 0.1, cy - size * 0.5);
                        ctx.closePath();
                        ctx.fill();
                        
                        ctx.beginPath();
                        ctx.moveTo(cx + size * 0.5, cy - size * 0.3);
                        ctx.lineTo(cx + size * 0.3, cy - size * 0.8);
                        ctx.lineTo(cx + size * 0.1, cy - size * 0.5);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 脸部特征
                        ctx.fillStyle = "#000000";
                        // 眼睛
                        ctx.beginPath();
                        ctx.ellipse(cx - size * 0.2, cy - size * 0.3, size * 0.05, size * 0.1, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.ellipse(cx + size * 0.2, cy - size * 0.3, size * 0.05, size * 0.1, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 鼻子
                        ctx.beginPath();
                        ctx.moveTo(cx, cy - size * 0.2);
                        ctx.lineTo(cx - size * 0.05, cy - size * 0.1);
                        ctx.lineTo(cx + size * 0.05, cy - size * 0.1);
                        ctx.closePath();
                        ctx.fill();
                        
                        // 胡须
                        ctx.strokeStyle = "#000000";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(cx - size * 0.4, cy - size * 0.15);
                        ctx.lineTo(cx - size * 0.6, cy - size * 0.2);
                        ctx.moveTo(cx + size * 0.4, cy - size * 0.15);
                        ctx.lineTo(cx + size * 0.6, cy - size * 0.2);
                        ctx.stroke();
                        break;
                        
                    case 'bunny':
                        // 兔子
                        ctx.fillStyle = "#FFFFFF";
                        // 身体
                        ctx.beginPath();
                        ctx.ellipse(cx, cy + size * 0.3, size * 0.7, size * 0.9, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 头
                        ctx.beginPath();
                        ctx.arc(cx, cy - size * 0.2, size * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 长耳朵
                        ctx.beginPath();
                        ctx.ellipse(cx - size * 0.3, cy - size * 0.7, size * 0.15, size * 0.5, -Math.PI/12, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.ellipse(cx + size * 0.3, cy - size * 0.7, size * 0.15, size * 0.5, Math.PI/12, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 内耳
                        ctx.fillStyle = "#FFB6C1";
                        ctx.beginPath();
                        ctx.ellipse(cx - size * 0.3, cy - size * 0.7, size * 0.08, size * 0.3, -Math.PI/12, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.ellipse(cx + size * 0.3, cy - size * 0.7, size * 0.08, size * 0.3, Math.PI/12, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 脸部
                        ctx.fillStyle = "#000000";
                        // 眼睛
                        ctx.beginPath();
                        ctx.arc(cx - size * 0.15, cy - size * 0.2, size * 0.05, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(cx + size * 0.15, cy - size * 0.2, size * 0.05, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 鼻子
                        ctx.fillStyle = "#FFB6C1";
                        ctx.beginPath();
                        ctx.arc(cx, cy - size * 0.05, size * 0.06, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 腮红
                        ctx.fillStyle = "rgba(255, 182, 193, 0.5)";
                        ctx.beginPath();
                        ctx.arc(cx - size * 0.3, cy, size * 0.1, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(cx + size * 0.3, cy, size * 0.1, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                }
            };
            
            // 绘制对话框
            const drawSpeechBubble = (cx, cy, width, height, text) => {
                // 气泡主体
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#333333";
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.roundRect(cx - width/2, cy - height/2, width, height, 10);
                ctx.fill();
                ctx.stroke();
                
                // 气泡尾巴
                ctx.beginPath();
                ctx.moveTo(cx - 10, cy + height/2);
                ctx.lineTo(cx - 20, cy + height/2 + 15);
                ctx.lineTo(cx + 5, cy + height/2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // 文字
                ctx.fillStyle = "#333333";
                ctx.font = "14px 'Comic Sans MS', Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, cx, cy);
            };
            
            // 角落贴纸
            drawCartoonAnimal('cat', x + 35, y + 40, 20);
            drawSpeechBubble(x + 80, y + 30, 60, 30, "Meow!");
            
            drawCartoonAnimal('bunny', x + width - 35, y + height - 50, 22);
            drawSpeechBubble(x + width - 80, y + height - 30, 70, 30, "Hello!");
            
            // 边缘装饰性元素
            const drawDecoElement = (type, cx, cy, size) => {
                switch(type) {
                    case 'star':
                        ctx.fillStyle = "#FFD700";
                        ctx.beginPath();
                        for (let i = 0; i < 5; i++) {
                            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                            const px = cx + size * Math.cos(angle);
                            const py = cy + size * Math.sin(angle);
                            if (i === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.fill();
                        break;
                        
                    case 'heart':
                        ctx.fillStyle = "#FF69B4";
                        ctx.beginPath();
                        ctx.moveTo(cx, cy + size * 0.3);
                        ctx.bezierCurveTo(cx, cy, cx - size, cy, cx - size, cy + size * 0.3);
                        ctx.bezierCurveTo(cx - size, cy + size * 0.8, cx, cy + size * 1.2, cx, cy + size * 1.5);
                        ctx.bezierCurveTo(cx, cy + size * 1.2, cx + size, cy + size * 0.8, cx + size, cy + size * 0.3);
                        ctx.bezierCurveTo(cx + size, cy, cx, cy, cx, cy + size * 0.3);
                        ctx.fill();
                        break;
                        
                    case 'rainbow':
                        const colors = ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF", "#4B0082"];
                        const arcWidth = size / colors.length;
                        
                        colors.forEach((color, i) => {
                            ctx.strokeStyle = color;
                            ctx.lineWidth = arcWidth;
                            ctx.beginPath();
                            ctx.arc(cx, cy + size, size - i * arcWidth, Math.PI, 0);
                            ctx.stroke();
                        });
                        break;
                }
            };
            
            // 添加边缘装饰
            drawDecoElement('star', x + width - 30, y + 30, 12);
            drawDecoElement('heart', x + 25, y + height - 30, 10);
            drawDecoElement('rainbow', x + width/2, y + 20, 20);
            
            // 底部品牌标识
            ctx.save();
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(x + width - 100, y + height - 25, 95, 20);
            
            ctx.font = "12px Arial";
            ctx.fillStyle = "#FF69B4";
            ctx.textAlign = "right";
            ctx.fillText("Picapica.app", x + width - 10, y + height - 10);
            ctx.restore();
        }
    }
    
};

export default FRAMES;