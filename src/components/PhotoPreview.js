import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";

// Helper function to load an image and return a promise
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};


const PhotoPreview = ({ capturedImages: initialImages }) => {
	const stripCanvasRef = useRef(null);
	const fileInputRef = useRef(null);
	const stickerInputRef = useRef(null); // Ref for sticker upload input
	const navigate = useNavigate();
	const [stripColor, setStripColor] = useState("white");
	const [selectedFrame, setSelectedFrame] = useState("none");
	const [shareLink, setShareLink] = useState("");
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);
	const [localImages, setLocalImages] = useState(Array(4).fill(null));
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [prediction, setPrediction] = useState(null);
	const [isFetchingPrediction, setIsFetchingPrediction] = useState(false);
	const [showPrediction, setShowPrediction] = useState(false);

	// --- Sticker State ---
	const [uploadedStickers, setUploadedStickers] = useState([]); // Holds src of uploaded stickers
	const [placedStickers, setPlacedStickers] = useState([]); // Holds { id, src, x, y, width, height, rotation } of placed stickers
	const [selectedStickerId, setSelectedStickerId] = useState(null); // ID of the sticker being manipulated
	const [draggingStickerId, setDraggingStickerId] = useState(null); // ID of sticker being dragged on canvas
	const [stickerDragOffset, setStickerDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging
    const [activeStickerTool, setActiveStickerTool] = useState(null); // Which sticker src is ready to be placed

	// Initialize photos
	useEffect(() => {
		if (initialImages && initialImages.length > 0) {
			const newImages = [...Array(4).fill(null)];
			initialImages.forEach((img, index) => {
				if (index < 4) {
					newImages[index] = img;
				}
			});
			setLocalImages(newImages);
		}
	}, [initialImages]);

    // --- Refactored generatePhotoStrip using async/await and preloading ---
	const generatePhotoStrip = useCallback(async () => {
		const canvas = stripCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		const imgWidth = 400;
		const imgHeight = 300;
		const borderSize = 40;
		const photoSpacing = 20;
		const textHeight = showPrediction && prediction ? 150 : 50;
		const totalHeight =
			imgHeight * 4 + photoSpacing * 3 + borderSize * 2 + textHeight;

		canvas.width = imgWidth + borderSize * 2;
		canvas.height = totalHeight;

		// 1. Fill Background
		ctx.fillStyle = stripColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 2. Prepare image loading promises (Photos)
		const photoImagePromises = localImages
            .filter(src => src !== null)
            .map(src => loadImage(src).catch(e => { console.error("Error loading photo:", src, e); return null; })); // Add error handling

        // 3. Prepare image loading promises (Stickers) - Only unique sources
        const uniqueStickerSrcs = [...new Set(placedStickers.map(s => s.src))];
        const stickerImagePromises = uniqueStickerSrcs.map(src => loadImage(src).catch(e => { console.error("Error loading sticker:", src, e); return null; })); // Add error handling


		try {
            // 4. Wait for all images to load
            const loadedPhotoImages = await Promise.all(photoImagePromises);
            const loadedStickerImages = await Promise.all(stickerImagePromises);

            // Map loaded sticker images back to their sources for easy lookup
            const stickerImageMap = new Map();
            uniqueStickerSrcs.forEach((src, index) => {
                if (loadedStickerImages[index]) { // Check if loading succeeded
                    stickerImageMap.set(src, loadedStickerImages[index]);
                }
            });

            // Map loaded photo images back to their positions
            const photoImageMap = new Map();
            let currentLoadedPhotoIndex = 0;
            localImages.forEach((src, index) => {
                if (src !== null) {
                     if (loadedPhotoImages[currentLoadedPhotoIndex]) { // Check if loading succeeded
                        photoImageMap.set(index, loadedPhotoImages[currentLoadedPhotoIndex]);
                     }
                    currentLoadedPhotoIndex++;
                }
            });

			// 5. Draw Photos and Frames (Synchronously)
            for (let i = 0; i < 4; i++) {
                const yOffset = borderSize + (imgHeight + photoSpacing) * i;

                if (photoImageMap.has(i)) {
                    const img = photoImageMap.get(i);
                    const imageRatio = img.width / img.height;
                    const targetRatio = imgWidth / imgHeight;
                    let sourceWidth = img.width, sourceHeight = img.height, sourceX = 0, sourceY = 0;

                    if (imageRatio > targetRatio) {
                        sourceWidth = sourceHeight * targetRatio;
                        sourceX = (img.width - sourceWidth) / 2;
                    } else {
                        sourceHeight = sourceWidth / targetRatio;
                        sourceY = (img.height - sourceHeight) / 2;
                    }

                    ctx.drawImage(
                        img, sourceX, sourceY, sourceWidth, sourceHeight,
                        borderSize, yOffset, imgWidth, imgHeight
                    );

                    // Draw Frame if selected
                    if (FRAMES[selectedFrame] && typeof FRAMES[selectedFrame].draw === "function") {
                        FRAMES[selectedFrame].draw(ctx, borderSize, yOffset, imgWidth, imgHeight);
                    }

                    // Draw Prediction Keyword if needed
                    if (showPrediction && prediction?.keywords?.[i]) {
                        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                        ctx.fillRect(borderSize, yOffset + imgHeight - 40, imgWidth, 40);
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 20px Arial";
                        ctx.textAlign = "center";
                        ctx.fillText(prediction.keywords[i], borderSize + imgWidth / 2, yOffset + imgHeight - 15);
                    }
                } else {
                    // Draw Placeholder
                    ctx.fillStyle = "#f5f5f5";
                    ctx.fillRect(borderSize, yOffset, imgWidth, imgHeight);
                    ctx.fillStyle = "#cccccc";
                    ctx.font = "16px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("Add Photo " + (i + 1), borderSize + imgWidth / 2, yOffset + imgHeight / 2);
                }
            }

            // 6. Draw Placed Stickers (Synchronously)
            placedStickers.forEach(sticker => {
                const stickerImg = stickerImageMap.get(sticker.src);
                if (stickerImg) { // Check if sticker image loaded successfully
                    ctx.save();
                    // Translate to center for rotation, then draw relative to top-left
                    ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
                    ctx.rotate(sticker.rotation * Math.PI / 180);
                    ctx.drawImage(stickerImg, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
                    ctx.restore();

                    // Optional: Draw selection handles if selected
                    if (sticker.id === selectedStickerId) {
                        ctx.strokeStyle = "#FF69B4";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);
                        // Add delete button visualization
                        ctx.fillStyle = "#ff4d4d";
                        ctx.fillRect(sticker.x + sticker.width - 8, sticker.y - 8, 16, 16);
                        ctx.strokeStyle = "white";
                        ctx.lineWidth = 1.5;
                        ctx.strokeText("X", sticker.x + sticker.width - 4.5, sticker.y + 4);
                    }
                }
            });


			// 7. Add Footer, Watermark, Prediction Summary
			addFooterAndWatermark(ctx, totalHeight, borderSize, canvas.width);
			if (showPrediction && prediction?.summary) {
				const summaryY = borderSize + (imgHeight + photoSpacing) * 4 - 10;
                ctx.fillStyle = "#9C27B0";
                ctx.font = "bold 18px Arial";
                ctx.textAlign = "center";
                ctx.fillText("✨ Four Frames of Life ✨", borderSize + imgWidth / 2, summaryY + 25);
                ctx.fillStyle = "#333333";
                ctx.font = "16px Arial";
                ctx.textAlign = "left";
                const maxWidth = imgWidth - 20;
                let line = '';
                let y = summaryY + 50;
                const words = prediction.summary.split(' ');
                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ';
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && n > 0) {
                        ctx.fillText(line, borderSize + 10, y);
                        line = words[n] + ' ';
                        y += 20;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, borderSize + 10, y);
			}

		} catch (error) {
			console.error("Error during photo strip generation:", error);
			// Optionally draw an error message on the canvas
            ctx.fillStyle = "red";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Error loading images. Please try again.", canvas.width / 2, canvas.height / 2);
		}

	}, [localImages, stripColor, selectedFrame, prediction, showPrediction, placedStickers, selectedStickerId]); // Add placedStickers dependency

	// Footer drawing function remains the same
	const addFooterAndWatermark = (ctx, totalHeight, borderSize, canvasWidth) => {
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) + "  " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Picapica  " + timestamp, canvasWidth / 2, totalHeight - borderSize * 1);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("picapica.app   ", canvasWidth - borderSize, totalHeight - borderSize / 2);
    };

	// Redraw whenever relevant state changes
	useEffect(() => {
        // Debounce or throttle might be good here if updates are too frequent
        generatePhotoStrip();
	}, [localImages, stripColor, selectedFrame, prediction, showPrediction, placedStickers, selectedStickerId, generatePhotoStrip]); // Include generatePhotoStrip as dependency

	// --- Sticker Handling ---

	const handleStickerUpload = (e) => {
		const files = e.target.files;
		if (!files) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const reader = new FileReader();
			reader.onload = (event) => {
				setUploadedStickers((prev) => [...prev, event.target.result]);
			};
			reader.readAsDataURL(file);
		}
		// Reset file input
		e.target.value = null;
	};

    const selectStickerForPlacement = (stickerSrc) => {
        setActiveStickerTool(stickerSrc);
        setSelectedStickerId(null); // Deselect any placed sticker
        // Optional: change cursor to indicate placement mode
        if (stripCanvasRef.current) {
            stripCanvasRef.current.style.cursor = 'copy';
        }
    };

    const handleCanvasClick = (e) => {
        const canvas = stripCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // If a sticker tool is active, place the sticker
        if (activeStickerTool) {
            const defaultSize = 50; // Or calculate based on image aspect ratio
            const newSticker = {
                id: Date.now(),
                src: activeStickerTool,
                x: x - defaultSize / 2, // Center the sticker on click point
                y: y - defaultSize / 2,
                width: defaultSize,
                height: defaultSize,
                rotation: 0,
            };
            setPlacedStickers((prev) => [...prev, newSticker]);
            setActiveStickerTool(null); // Deactivate tool after placement
            setSelectedStickerId(newSticker.id); // Select the newly placed sticker
            if (stripCanvasRef.current) {
                stripCanvasRef.current.style.cursor = 'default'; // Reset cursor
            }
            return; // Stop further processing for this click
        }

        // Check if clicking on an existing sticker to select it (or its delete button)
        let clickedOnSticker = false;
        // Iterate in reverse order so top stickers are checked first
        for (let i = placedStickers.length - 1; i >= 0; i--) {
            const sticker = placedStickers[i];
            // Simple bounding box check (ignores rotation for simplicity)
            const hit = x >= sticker.x && x <= sticker.x + sticker.width &&
                      y >= sticker.y && y <= sticker.y + sticker.height;

             // Check for delete button click
            const deleteButtonSize = 16;
            const deleteButtonX = sticker.x + sticker.width - deleteButtonSize / 2;
            const deleteButtonY = sticker.y - deleteButtonSize / 2;
            const hitDelete = x >= deleteButtonX - deleteButtonSize / 2 && x <= deleteButtonX + deleteButtonSize / 2 &&
                              y >= deleteButtonY - deleteButtonSize / 2 && y <= deleteButtonY + deleteButtonSize / 2;

            if (selectedStickerId === sticker.id && hitDelete) {
                // Delete the sticker
                setPlacedStickers(prev => prev.filter(s => s.id !== sticker.id));
                setSelectedStickerId(null);
                clickedOnSticker = true; // Prevent deselecting
                break;
            } else if (hit) {
                setSelectedStickerId(sticker.id);
                clickedOnSticker = true;
                break; // Select the top-most sticker hit
            }
        }

        // If clicked outside any sticker, deselect
        if (!clickedOnSticker) {
            setSelectedStickerId(null);
        }
    };

    // --- Sticker Dragging on Canvas ---
    const handleCanvasMouseDown = (e) => {
         const canvas = stripCanvasRef.current;
         if (!canvas || activeStickerTool) return; // Don't drag if placing

         const rect = canvas.getBoundingClientRect();
         const scaleX = canvas.width / rect.width;
         const scaleY = canvas.height / rect.height;
         const x = (e.clientX - rect.left) * scaleX;
         const y = (e.clientY - rect.top) * scaleY;

        // Check if mouse down is on the selected sticker
        const selectedSticker = placedStickers.find(s => s.id === selectedStickerId);
        if (selectedSticker) {
             const hit = x >= selectedSticker.x && x <= selectedSticker.x + selectedSticker.width &&
                       y >= selectedSticker.y && y <= selectedSticker.y + selectedSticker.height;
             // Exclude hitting the delete button area from starting a drag
             const deleteButtonSize = 16;
             const deleteButtonX = selectedSticker.x + selectedSticker.width - deleteButtonSize / 2;
             const deleteButtonY = selectedSticker.y - deleteButtonSize / 2;
             const hitDelete = x >= deleteButtonX - deleteButtonSize / 2 && x <= deleteButtonX + deleteButtonSize / 2 &&
                               y >= deleteButtonY - deleteButtonSize / 2 && y <= deleteButtonY + deleteButtonSize / 2;


            if (hit && !hitDelete) {
                setDraggingStickerId(selectedStickerId);
                setStickerDragOffset({
                    x: x - selectedSticker.x,
                    y: y - selectedSticker.y
                });
                 canvas.style.cursor = 'grabbing'; // Change cursor
            }
        }
    };

    const handleCanvasMouseMove = (e) => {
        if (draggingStickerId === null) return;

        const canvas = stripCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        setPlacedStickers(prevStickers =>
            prevStickers.map(sticker => {
                if (sticker.id === draggingStickerId) {
                    return {
                        ...sticker,
                        x: mouseX - stickerDragOffset.x,
                        y: mouseY - stickerDragOffset.y,
                    };
                }
                return sticker;
            })
        );
    };

    const handleCanvasMouseUpOrLeave = (e) => {
        if (draggingStickerId !== null) {
            setDraggingStickerId(null);
            if (stripCanvasRef.current) {
                 stripCanvasRef.current.style.cursor = activeStickerTool ? 'copy' : 'default'; // Reset cursor appropriately
            }
        }
    };


	// --- Other Functions (Download, Share, Prediction, Photo Management) - Keep as they were ---
    // ... (downloadPhotoStrip, getShareableLink, copyLinkToClipboard, getPrediction, navigateToShare, handleDeleteImage, handleUploadImage, triggerFileUpload, handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDragLeave, handleDrop) ...
    // Ensure these functions use the canvas *after* stickers are drawn (which generatePhotoStrip now handles)

    // --- Example Placeholder Functions (replace with your existing ones) ---
    const downloadPhotoStrip = () => {
        const allSlotsFilled = localImages.every(img => img !== null);
        if (!allSlotsFilled) {
			alert("Please add photos to all slots before downloading.");
			return;
		}
        // Ensure final draw before download (though useEffect should handle it)
        generatePhotoStrip().then(() => {
            const link = document.createElement("a");
            link.download = "photostrip_with_stickers.png";
            link.href = stripCanvasRef.current.toDataURL("image/png");
            link.click();
        });
	};

    const getShareableLink = async () => {
        const allSlotsFilled = localImages.every(img => img !== null);
		if (!allSlotsFilled) {
			alert("Please add photos to all slots before sharing.");
			return;
		}
		if (!stripCanvasRef.current) return;

        setIsGeneratingLink(true);
		setLinkCopied(false);
        try {
            // Ensure final draw before generating blob
            await generatePhotoStrip();
            const blob = await new Promise(resolve => stripCanvasRef.current.toBlob(resolve, 'image/png'));
            const formData = new FormData();
            formData.append('image', blob, 'photostrip_with_stickers.png'); // Include stickers in filename
            const response = await fetch('https://api.picapica.app/api/photos/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Failed to upload image');
            const data = await response.json();
            const shareableLink = `${window.location.origin}/share?imageurl=${encodeURIComponent(data.imageUrl)}`;
			setShareLink(shareableLink);
        } catch (error) {
            console.error('Error generating link:', error);
			alert('Failed to generate shareable link. Please try again.');
        } finally {
            setIsGeneratingLink(false);
        }
    };

    // ... (rest of your existing functions like copyLinkToClipboard, getPrediction, etc.)

    	const copyLinkToClipboard = () => {
		if (!shareLink) return;

		if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(shareLink)
			.then(() => {
				setLinkCopied(true);
				setTimeout(() => setLinkCopied(false), 3000);
			})
			.catch(err => {
				console.error('Failed to copy link:', err);
			});
		} else {
			// Fallback
			const textArea = document.createElement('textarea');
			textArea.value = shareLink;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				setLinkCopied(true);
				setTimeout(() => setLinkCopied(false), 3000);
			} catch (err) {
				console.error('Fallback copy failed:', err);
			}
			document.body.removeChild(textArea);
		}
	};

	// Get Prediction Function
	const getPrediction = async () => {
		const allSlotsFilled = localImages.every(img => img !== null);
		if (!allSlotsFilled) {
			alert("Please add photos to all 4 positions before analysis.");
			return;
		}
		if (!stripCanvasRef.current) return;

		try {
			setIsFetchingPrediction(true);
			let imageUrl;

			// Use existing share link URL if available, otherwise upload
			if (shareLink) {
				const urlParams = new URL(shareLink).searchParams;
				imageUrl = urlParams.get('imageurl');
				if (!imageUrl) { // Fallback if extraction fails
                     await generatePhotoStrip(); // Ensure final draw
                     const blob = await new Promise(resolve => stripCanvasRef.current.toBlob(resolve, 'image/png'));
                     const formData = new FormData();
                     formData.append('image', blob, 'photostrip_with_stickers.png');
                     const uploadResponse = await fetch('https://api.picapica.app/api/photos/upload', { method: 'POST', body: formData });
                     if (!uploadResponse.ok) throw new Error('Failed to upload image for analysis');
                     const data = await uploadResponse.json();
                     imageUrl = data.imageUrl;
                }
			} else {
				 await generatePhotoStrip(); // Ensure final draw
                 const blob = await new Promise(resolve => stripCanvasRef.current.toBlob(resolve, 'image/png'));
                 const formData = new FormData();
                 formData.append('image', blob, 'photostrip_with_stickers.png');
                 const uploadResponse = await fetch('https://api.picapica.app/api/photos/upload', { method: 'POST', body: formData });
                 if (!uploadResponse.ok) throw new Error('Failed to upload image for analysis');
                 const data = await uploadResponse.json();
                 imageUrl = data.imageUrl;
                 // Optionally set the share link now as well
                 const generatedShareLink = `${window.location.origin}/share?imageurl=${encodeURIComponent(imageUrl)}`;
                 setShareLink(generatedShareLink);
			}

			// Analyze the image URL
			const analysisResponse = await fetch('https://api.picapica.app/api/ai/analyze-photo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imageUrl: imageUrl })
			});

			if (!analysisResponse.ok) {
                const errorData = await analysisResponse.json().catch(() => ({})); // Try to get error details
				throw new Error(`Failed to analyze image: ${analysisResponse.statusText} ${errorData.message || ''}`);
			}

			const analysisResult = await analysisResponse.json();
			if (analysisResult.success && analysisResult.data) {
				setPrediction(analysisResult.data);
				setShowPrediction(true); // Automatically show prediction when fetched
			} else {
				throw new Error(`Invalid analysis result: ${analysisResult.message || 'Unknown error'}`);
			}

		} catch (error) {
			console.error('Error getting prediction:', error);
			alert(`Failed to get prediction: ${error.message}. Please try again.`);
		} finally {
			setIsFetchingPrediction(false);
		}
	};

	const navigateToShare = () => {
		if (!shareLink) return;
		const imageUrl = new URL(shareLink).searchParams.get('imageurl');
        if (imageUrl) {
		    navigate(`/share?imageurl=${encodeURIComponent(imageUrl)}`); // Ensure encoding
        } else {
            console.error("Could not extract image URL from share link:", shareLink);
            alert("Could not navigate to share page - invalid link.");
        }
	};

    // --- Photo Management Functions ---
	const handleDeleteImage = (index) => {
		const newImages = [...localImages];
		newImages[index] = null;
		setLocalImages(newImages);
		setSelectedImageIndex(null);
	};

	const handleUploadImage = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			// No need for new Image() check here, just update state
            if (selectedImageIndex !== null) {
                const newImages = [...localImages];
                newImages[selectedImageIndex] = event.target.result; // Store data URL
                setLocalImages(newImages);
                setSelectedImageIndex(null);
            }
		};
		reader.readAsDataURL(file);
		e.target.value = null; // Reset file input
	};

	const triggerFileUpload = (index) => {
		setSelectedImageIndex(index);
		fileInputRef.current.click();
	};

	const handleDragStart = (e, index) => {
		if (localImages[index] === null) return;
		if (e.target.querySelector('img')) {
			const img = e.target.querySelector('img');
			// Use a smaller, less intrusive drag image if possible
			const dragImg = img.cloneNode();
			dragImg.style.width = '80px';
			dragImg.style.height = '60px';
			dragImg.style.position = 'absolute';
			dragImg.style.top = '-1000px'; // Position off-screen initially
			document.body.appendChild(dragImg);
			e.dataTransfer.setDragImage(dragImg, 40, 30);
			// Clean up the temporary drag image
			setTimeout(() => document.body.removeChild(dragImg), 0);
		} else {
            // Fallback if no img found
             const div = document.createElement('div');
             div.style.width = '80px'; div.style.height = '60px'; div.style.backgroundColor = '#ddd'; div.style.border = '1px solid #ccc';
             div.style.position = 'absolute'; div.style.top = '-1000px';
             document.body.appendChild(div);
             e.dataTransfer.setDragImage(div, 40, 30);
             setTimeout(() => document.body.removeChild(div), 0);
        }

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', index.toString());
		setDraggedIndex(index);
		setTimeout(() => { e.target.style.opacity = '0.4'; }, 0);
	};

	const handleDragEnd = (e) => {
        // Ensure target exists before setting opacity
        if (e.target) {
		    e.target.style.opacity = '1';
        }
		setDraggedIndex(null);
		setDragOverIndex(null);
		// Clean up styles added during drag
		document.querySelectorAll('.photo-item').forEach(item => {
			item.classList.remove('drag-over');
			item.style.transform = '';
			item.style.boxShadow = '';
		});
	};

	const handleDragOver = (e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		if (dragOverIndex !== index) {
			setDragOverIndex(index);
		}
	};

	const handleDragEnter = (e, index) => {
		e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return; // Don't highlight self or when not dragging
		e.currentTarget.classList.add('drag-over');
		e.currentTarget.style.transform = 'scale(1.03)';
		e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 123, 255, 0.5)';
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.currentTarget.classList.remove('drag-over');
		e.currentTarget.style.transform = '';
		e.currentTarget.style.boxShadow = '';
	};

	const handleDrop = (e, targetIndex) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.classList.remove('drag-over');
		e.currentTarget.style.transform = '';
		e.currentTarget.style.boxShadow = '';

		const dragIndexStr = e.dataTransfer.getData('text/plain');
        if (!dragIndexStr) { // No valid data transferred
            console.warn("Drag data missing");
             setDraggedIndex(null);
             setDragOverIndex(null);
            return;
        }

		const dragIndex = parseInt(dragIndexStr, 10);
		if (isNaN(dragIndex) || dragIndex === targetIndex || dragIndex < 0 || dragIndex >= localImages.length) return;

		const newImages = [...localImages];
		const temp = newImages[dragIndex];
		newImages[dragIndex] = newImages[targetIndex];
		newImages[targetIndex] = temp;

		setLocalImages(newImages);
		setDraggedIndex(null); // Reset drag state fully on drop
		setDragOverIndex(null);
	};
    // --- End Photo Management Functions ---


	const uploadedCount = localImages.filter(img => img !== null).length;
	const allSlotsFilled = uploadedCount === 4;

	const getPhotoItemClassName = (index) => {
		let className = "photo-item";
		if (draggedIndex === index) className += " dragged";
		// Don't apply drag-over class if it's the element being dragged
		if (dragOverIndex === index && draggedIndex !== index) className += " drag-over";
		return className;
	};


	return (
		<>
			<Meta
				title="Customize Your Photo Strip"
				description="Customize your Picapica photo strip with different colors, frames, and stickers. Download or share your photo strip with friends and family."
				canonicalUrl="/preview"
			/>

			{/* CSS for drag and drop effects + Stickers */}
			<style>{`
                /* ... (existing styles for photo drag/drop) ... */
                .photo-item { transition: all 0.2s ease; }
                .photo-item.dragged { opacity: 0.4; }
                .photo-item.drag-over {
                    background-color: rgba(0, 123, 255, 0.1);
                    border: 2px dashed #007bff !important;
                    transform: scale(1.03);
                }
                .photo-item:hover .drag-handle { opacity: 1; }
                .drag-handle { opacity: 0; transition: opacity 0.2s; cursor: move; background-color: rgba(0,0,0,0.1); }
                .photo-item.empty:hover { background-color: #f0f8ff; border-color: #89CFF0; }

                .sticker-palette {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    max-height: 150px; /* Limit height */
                    overflow-y: auto; /* Allow scrolling */
                }
                .sticker-palette-item {
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: border-color 0.2s;
                }
                 .sticker-palette-item:hover {
                    border-color: #FF69B4;
                }
                .sticker-palette-item.active-tool {
                     border-color: #FF69B4;
                     box-shadow: 0 0 5px #FF69B4;
                }
                .photo-strip-canvas-container { /* Container for positioning */
                    position: relative;
                    display: flex; /* Or inline-block if needed */
                    justify-content: center; /* Center canvas */
                }
			`}</style>

			<div className="photo-preview">
				<h2>Photo Strip Preview & Customize</h2>

                {/* Customization Section (Color, Preset Stickers) */}
                <div className="customization-section" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "15px" }}>1. Choose Background & Style</h3>
                    {/* Color Options */}
					<div style={{ marginBottom: "15px" }}>
						<label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Background Color:</label>
						<div className="color-options" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {/* Buttons for colors... */}
                            <button onClick={() => setStripColor("white")} style={{ backgroundColor: "white", border: stripColor === "white" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>White</button>
							<button onClick={() => setStripColor("black")} style={{ backgroundColor: "black", color: "white", border: stripColor === "black" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Black</button>
							<button onClick={() => setStripColor("#f6d5da")} style={{ backgroundColor: "#f6d5da", border: stripColor === "#f6d5da" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Pink</button>
							<button onClick={() => setStripColor("#dde6d5")} style={{ backgroundColor: "#dde6d5", border: stripColor === "#dde6d5" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Green</button>
							<button onClick={() => setStripColor("#adc3e5")} style={{ backgroundColor: "#adc3e5", border: stripColor === "#adc3e5" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Blue</button>
							<button onClick={() => setStripColor("#FFF2CC")} style={{ backgroundColor: "#FFF2CC", border: stripColor === "#FFF2CC" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Yellow</button>
							<button onClick={() => setStripColor("#dbcfff")} style={{ backgroundColor: "#dbcfff", border: stripColor === "#dbcfff" ? "3px solid #FF69B4" : "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Purple</button>
						</div>
					</div>
                    {/* Frame (Preset Sticker) Options */}
                    <div>
						<label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Preset Sticker Style:</label>
						<div className="frame-options" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
							<button onClick={() => setSelectedFrame("pastel")} style={{ backgroundColor: selectedFrame === "pastel" ? "#FF69B4" : "#f8f8f8", color: selectedFrame === "pastel" ? "white" : "black", border: "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Girlypop</button>
							<button onClick={() => setSelectedFrame("cute")} style={{ backgroundColor: selectedFrame === "cute" ? "#FF69B4" : "#f8f8f8", color: selectedFrame === "cute" ? "white" : "black", border: "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>Cute</button>
							<button onClick={() => setSelectedFrame("none")} style={{ backgroundColor: selectedFrame === "none" ? "#FF69B4" : "#f8f8f8", color: selectedFrame === "none" ? "white" : "black", border: "1px solid #ddd", borderRadius: "5px", padding: "10px 15px" }}>None</button>
						</div>
					</div>
                </div>

                 {/* Sticker Upload and Palette */}
                <div className="sticker-section" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "15px" }}>2. Add Custom Stickers (Optional)</h3>
                    <input
						type="file"
						ref={stickerInputRef}
						onChange={handleStickerUpload}
						accept="image/png, image/jpeg, image/gif" // Specify acceptable formats
						multiple // Allow multiple uploads at once
						style={{ display: "none" }}
					/>
                    <button
                        onClick={() => stickerInputRef.current.click()}
                        style={{
							backgroundColor: "#FF9800",
							color: "white",
							border: "none",
							padding: "10px 15px",
							borderRadius: "5px",
							cursor: "pointer",
                            marginBottom: "10px",
                            fontWeight: "bold"
						}}
                    >
                       + Upload Your Sticker(s)
                    </button>

                    {uploadedStickers.length > 0 && (
                         <>
                            <p style={{ fontSize: '14px', color: '#555', marginTop: '5px', marginBottom: '10px' }}>
                                Click a sticker below, then click on the photo strip preview to place it.
                                <br/> Click a placed sticker to select/move it. Click the <span style={{color: '#ff4d4d', fontWeight:'bold'}}>X</span> to delete.
                            </p>
                            <div className="sticker-palette">
                                {uploadedStickers.map((stickerSrc, index) => (
                                    <img
                                        key={index}
                                        src={stickerSrc}
                                        alt={`Uploaded Sticker ${index + 1}`}
                                        className={`sticker-palette-item ${activeStickerTool === stickerSrc ? 'active-tool' : ''}`}
                                        onClick={() => selectStickerForPlacement(stickerSrc)}
                                        title="Click to select, then click on preview to place"
                                    />
                                ))}
                            </div>
                         </>
                    )}
                </div>


                {/* Canvas Preview Area */}
                 <h3 style={{ marginTop: 0, marginBottom: "15px" }}>3. Preview & Finalize</h3>
				<div className="photo-strip-canvas-container" style={{
					padding: "20px 0", // Add padding around canvas container if needed
					marginBottom: "20px",
				}}>
					<canvas
                        ref={stripCanvasRef}
                        className="photo-strip-canvas"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            cursor: activeStickerTool ? 'copy' : (draggingStickerId ? 'grabbing' : 'default'), // Dynamic cursor
                            // border: selectedStickerId ? '2px dashed hotpink' : 'none' // Optional border for interaction feedback
                        }}
                        onClick={handleCanvasClick}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUpOrLeave}
                        onMouseLeave={handleCanvasMouseUpOrLeave} // Handle mouse leaving canvas while dragging
                    />
				</div>

                {/* Action Buttons (Download, Share, etc.) */}
                <div className="strip-buttons" style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", marginBottom: "30px" }}>
					<button onClick={downloadPhotoStrip} disabled={!allSlotsFilled} style={{ backgroundColor: allSlotsFilled ? "#4CAF50" : "#e0e0e0", color: "white", border: "none", padding: "12px 20px", borderRadius: "5px", cursor: allSlotsFilled ? "pointer" : "not-allowed", fontWeight: "bold", fontSize: "16px" }}>
						📥 Download
					</button>
					<button onClick={() => navigate("/photobooth")} style={{ backgroundColor: "#555555", color: "white", border: "none", padding: "12px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
						🔄 New Photos
					</button>
					<button onClick={getShareableLink} disabled={isGeneratingLink || !allSlotsFilled} style={{ backgroundColor: "#FF69B4", color: "white", border: "none", padding: "12px 20px", borderRadius: "5px", cursor: (isGeneratingLink || !allSlotsFilled) ? "not-allowed" : "pointer", opacity: !allSlotsFilled ? 0.6 : 1, fontWeight: "bold", fontSize: "16px" }}>
						{isGeneratingLink ? "Generating..." : "🔗 Get Link"}
					</button>
					<button onClick={getPrediction} disabled={isFetchingPrediction || !allSlotsFilled} style={{ backgroundColor: "#9C27B0", color: "white", border: "none", padding: "12px 20px", borderRadius: "5px", cursor: (isFetchingPrediction || !allSlotsFilled) ? "not-allowed" : "pointer", opacity: !allSlotsFilled ? 0.6 : 1, fontWeight: "bold", fontSize: "16px" }}>
						{isFetchingPrediction ? "Analyzing..." : "✨ Four Frames of Life"}
					</button>
				</div>

				{/* Notices and Info Sections */}
                {!allSlotsFilled && (
					<div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#FFF3CD", borderRadius: "5px", border: "1px solid #FFEEBA", color: "#856404", fontSize: "14px", textAlign: "center" }}>
						<strong>Notice:</strong> Please add photos to all 4 positions to enable download, sharing, and analysis.
					</div>
				)}

				{shareLink && (
                    <div className="share-link-container" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f8f8", borderRadius: "5px", border: "1px solid #ddd" }}>
                        {/* Share link display... */}
                        <h3>Shareable Link:</h3>
						<div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
							<input type="text" value={shareLink} readOnly style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginRight: "10px" }} />
							<button onClick={copyLinkToClipboard} style={{ backgroundColor: linkCopied ? "#4CAF50" : "#FF69B4", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
								{linkCopied ? "✓ Copied!" : "Copy"}
							</button>
						</div>
						<button onClick={navigateToShare} style={{ backgroundColor: "#FF69B4", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
							🔍 View Shared Page
						</button>
                        <div style={{ marginTop: "12px", fontSize: "12px", color: "#FF69B4", display: "flex", alignItems: "center", justifyContent: "center" }}>
							<span style={{ marginRight: "5px" }}>⏱️</span>Links and photos expire after 7 days.
						</div>
                    </div>
                )}

				{prediction && (
					<div style={{ marginTop: "20px", marginBottom: "20px", padding: "20px", backgroundColor: "#f8f5ff", borderRadius: "8px", border: "1px solid #e6d8ff", boxShadow: "0 2px 8px rgba(156, 39, 176, 0.1)" }}>
						<h3 style={{ color: "#9C27B0", marginTop: 0, marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
							<span style={{ marginRight: "8px" }}>✨</span>Four Frames of Life<span style={{ marginLeft: "8px" }}>✨</span>
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", margin: "10px 0" }}>
								{prediction.keywords.map((keyword, index) => ( <div key={index} style={{ backgroundColor: "#9C27B0", color: "white", padding: "10px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>{keyword}</div> ))}
							</div>
							<div onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(prediction.summary).then(() => alert("Summary copied!")).catch(err => console.error('Copy failed: ', err)); } }} style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px", border: "1px solid #e6d8ff", fontStyle: "italic", color: "#333", cursor: "pointer", position: "relative" }} title="Click to copy">
								<div style={{ position: "absolute", top: "8px", right: "8px", fontSize: "12px", color: "#9C27B0", opacity: 0.7 }}>📋 Click to copy</div>
								"{prediction.summary}"
							</div>
							<div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
								<label style={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none", padding: "8px 12px", backgroundColor: "#f0e6f7", borderRadius: "4px" }}>
									<input type="checkbox" checked={showPrediction} onChange={() => setShowPrediction(!showPrediction)} style={{ marginRight: "8px" }} /> Display interpretation on photos
								</label>
							</div>
						</div>
					</div>
				)}


                {/* Photo Management Section */}
				<div className="photo-management" style={{ marginTop: "30px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
					<h3 style={{ marginTop: 0 }}>Manage Photos ({uploadedCount}/4)</h3>
					<div style={{ display: "flex", alignItems: "center", marginBottom: "15px", backgroundColor: "#e9f7fe", padding: "10px", borderRadius: "5px" }}>
						<span style={{ marginRight: "10px", fontSize: "20px" }}>💡</span>
						<span style={{ fontSize: "14px" }}>Drag photos to reorder. Click empty slots to upload.</span>
					</div>
					<div className="photo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "15px" }}>
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className={`${getPhotoItemClassName(index)} ${localImages[index] === null ? 'empty' : ''}`}
								style={{
									position: "relative",
									border: "1px solid rgba(0,0,0,0.05)",
									borderRadius: "8px", // Rounded corners for photo slots
									overflow: "hidden",
									backgroundColor: localImages[index] ? "#fff" : "#f9f9f9",
									boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
									cursor: localImages[index] ? "move" : "pointer",
									minHeight: "160px", // Keep consistent height
									display: "flex",
									flexDirection: "column",
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease' // Added transitions
								}}
								onClick={() => localImages[index] === null && triggerFileUpload(index)}
								draggable={localImages[index] !== null}
								onDragStart={(e) => handleDragStart(e, index)}
								onDragEnd={handleDragEnd}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragEnter={(e) => handleDragEnter(e, index)}
								onDragLeave={handleDragLeave}
								onDrop={(e) => handleDrop(e, index)}
							>
								{localImages[index] ? (
									<>
										<div className="drag-handle" style={{ position: "absolute", top: "0", left: "0", right: "0", padding: "5px", textAlign: "center", fontSize: "12px", zIndex: "10", borderRadius: "8px 8px 0 0" }}>
											<span role="img" aria-label="drag handle">⣿ DRAG ⣿</span>
										</div>
										<div style={{ position: "relative", paddingTop: "75%", flexGrow: 1 /* 4:3 aspect ratio */ }}>
											<img src={localImages[index]} alt={`Photo ${index + 1}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
											<div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(255, 105, 180, 0.85)", color: "white", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
												{index + 1}
											</div>
										</div>
										<div className="photo-actions" style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "rgba(0,0,0,0.03)", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
											<button onClick={(e) => { e.stopPropagation(); triggerFileUpload(index); }} style={{ backgroundColor: "#FF69B4", color: "white", border: "none", borderRadius: "4px", padding: "6px 10px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>📤 Replace</button>
											<button onClick={(e) => { e.stopPropagation(); handleDeleteImage(index); }} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", padding: "6px 10px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>🗑️ Delete</button>
										</div>
									</>
								) : (
									<div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "15px" }}>
										<div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
											<span style={{ fontSize: "32px", color: "#666" }}>➕</span>
										</div>
										<div style={{ color: "#666", fontWeight: "bold" }}>Photo {index + 1}</div>
										<div style={{ color: "#999", fontSize: "12px", marginTop: "5px", textAlign: "center" }}>Click to upload</div>
									</div>
								)}
							</div>
						))}
					</div>
					<input type="file" ref={fileInputRef} onChange={handleUploadImage} accept="image/*" style={{ display: "none" }} />
                    <div style={{ fontSize: "14px", color: "#666", textAlign: "center", backgroundColor: allSlotsFilled ? "#e8f5e9" : "#fff9c4", padding: "10px", borderRadius: "5px", border: allSlotsFilled ? "1px solid #c8e6c9" : "1px solid #fff176" }}>
						<span role="img" aria-label="info">{allSlotsFilled ? "✅ All photos added!" : `ℹ️ ${uploadedCount} of 4 photos added.`}</span>
					</div>
				</div>
			</div>
		</>
	);
};

// FRAMES object remains the same
const FRAMES = {
	none: {
		draw: (ctx, x, y, width, height) => {}, // Empty function for no frame
	},
	pastel: {
		draw: (ctx, x, y, width, height) => {
			const drawSticker = (x, y, type) => { /* ... pastel sticker drawing logic ... */
            switch (type) {
					case "star":
						ctx.fillStyle = "#FFD700"; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill(); break;
					case "heart":
						ctx.fillStyle = "#cc8084"; ctx.beginPath(); const hs=22; ctx.moveTo(x,y+hs/4); ctx.bezierCurveTo(x,y,x-hs/2,y,x-hs/2,y+hs/4); ctx.bezierCurveTo(x-hs/2,y+hs/2,x,y+hs*0.75,x,y+hs); ctx.bezierCurveTo(x,y+hs*0.75,x+hs/2,y+hs/2,x+hs/2,y+hs/4); ctx.bezierCurveTo(x+hs/2,y,x,y,x,y+hs/4); ctx.fill(); break;
					case "flower":
						ctx.fillStyle="#FF9BE4"; for(let i=0;i<5;i++){ ctx.beginPath(); const a=(i*2*Math.PI)/5; ctx.ellipse(x+Math.cos(a)*10,y+Math.sin(a)*10,8,8,0,0,2*Math.PI); ctx.fill(); } ctx.fillStyle="#FFE4E1"; ctx.beginPath(); ctx.arc(x,y,6,0,2*Math.PI); ctx.fill(); break;
					case "bow":
						ctx.fillStyle="#f9cee7"; ctx.beginPath(); ctx.ellipse(x-10,y,10,6,Math.PI/4,0,2*Math.PI); ctx.fill(); ctx.beginPath(); ctx.ellipse(x+10,y,10,6,-Math.PI/4,0,2*Math.PI); ctx.fill(); ctx.fillStyle="#e68bbe"; ctx.beginPath(); ctx.arc(x,y,4,0,2*Math.PI); ctx.fill(); break;
                }
             };
			drawSticker(x + 11, y + 5, "bow"); drawSticker(x - 18, y + 95, "heart"); drawSticker(x + width - 160, y + 10, "star"); drawSticker(x + width - 1, y + 50, "heart"); drawSticker(x + 120, y + height - 20, "heart"); drawSticker(x + 20, y + height - 20, "star"); drawSticker(x + width - 125, y + height - 5, "bow"); drawSticker(x + width - 10, y + height - 45, "heart");
		},
	},
	cute: {
		draw: (ctx, x, y, width, height) => { /* ... cute sticker drawing logic ... */
             const drawStar = (cx,cy,sz,c="#FFD700")=>{ ctx.fillStyle=c; ctx.beginPath(); for(let i=0;i<5;i++){ const a=(i*4*Math.PI)/5-Math.PI/2; const p=i===0?"moveTo":"lineTo"; ctx[p](cx+sz*Math.cos(a),cy+sz*Math.sin(a)); } ctx.closePath(); ctx.fill(); };
             const drawCloud = (cx,cy)=>{ ctx.fillStyle="#87CEEB"; const pts=[{x:0,y:0,r:14},{x:-6,y:2,r:10},{x:6,y:2,r:10}]; pts.forEach(p=>{ ctx.beginPath(); ctx.arc(cx+p.x,cy+p.y,p.r,0,Math.PI*2); ctx.fill(); }); };
             drawStar(x + 150, y + 18, 15, "#FFD700"); drawCloud(x + 20, y + 5); drawStar(x + width - 1, y + 45, 12, "#FF69B4"); drawCloud(x + width - 80, y + 5); drawCloud(x + 150, y + height - 5); drawStar(x + 0, y + height - 65, 15, "#9370DB"); drawCloud(x + width - 5, y + height - 85); drawStar(x + width - 120, y + height - 5, 12, "#40E0D0");
        },
	},
};

export default PhotoPreview;