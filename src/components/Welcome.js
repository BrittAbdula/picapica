import React from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";
import { CenteredContainer, Button } from "./ui";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Meta 
        title="Welcome to Picapica Photo Booth"
        description="Experience the fun of a vintage photo booth online with Picapica. Take 4 photos in a row, apply vintage film effects, and create shareable photo strips."
        canonicalUrl="/welcome"
      />
      <CenteredContainer className="text-center px-8">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-picapica mb-8">
            欢迎使用Picapica拍照亭！
          </h1>
          
          <div className="space-y-6 text-lg md:text-xl text-picapica-800 leading-relaxed">
            <p className="animate-fade-in-up-delay">
              在picapica.app上体验真正的复古拍照亭乐趣！
            </p>
            
            <p className="animate-fade-in-up-delay">
              您有 <span className="font-bold text-picapica-300">3秒钟</span> 的时间拍摄每张照片 – 没有重拍机会！<br />
              我们的拍照亭会连续拍摄 <span className="font-bold text-picapica-300">4张照片</span>，所以请做好最美的姿势并享受乐趣！
            </p>
            
            <p className="animate-fade-in-up-delay-2">
              拍摄结束后，您可以为照片添加 <span className="font-bold text-picapica-300">复古胶片效果</span>，
              然后下载您的数字照片条并分享给朋友！
            </p>
          </div>
          
          <div className="mt-12 animate-fade-in-up-delay-2">
            <Button 
              variant="primary" 
              size="xl"
              onClick={() => navigate("/photobooth")}
              className="text-xl px-12 py-5 font-semibold"
            >
              📸 开始拍照旅程
            </Button>
          </div>
        </div>
      </CenteredContainer>
    </>
  );
};

export default Welcome;
