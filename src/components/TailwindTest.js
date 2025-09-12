// Tailwind CSS迁移测试页面
// 用于验证新UI组件系统的功能

import React, { useState } from 'react';
import { 
  Container, 
  CenteredContainer,
  Card, 
  Button, 
  LightingButton,
  CustomColorButton,
  LoadingSpinner, 
  Alert,
  MasonryGrid,
  MasonryItem,
  Input,
  TextArea
} from './ui';

const TailwindTest = () => {
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState('info');
  const [currentColor, setCurrentColor] = useState('#F8BBD9');

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const presetColors = [
    { name: '粉色', color: '#F8BBD9' },
    { name: '紫色', color: '#E1A1C7' },
    { name: '蓝色', color: '#64B5F6' },
    { name: '绿色', color: '#81C784' },
  ];

  const mockPhotos = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/300/400?random=${i}`,
    title: `测试图片 ${i + 1}`
  }));

  return (
    <div className="min-h-screen bg-picapica-50 py-8">
      <Container>
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gradient-picapica mb-4 animate-fade-in-up">
            Tailwind CSS 组件测试
          </h1>
          <p className="text-xl text-picapica-700 animate-fade-in-up-delay">
            验证新UI组件系统的功能和样式
          </p>
        </div>

        {/* 按钮测试区域 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-picapica-900 mb-6">按钮组件测试</h2>
          
          <div className="space-y-6">
            {/* 基础按钮 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">基础按钮</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">主要按钮</Button>
                <Button variant="secondary">次要按钮</Button>
                <Button variant="outline">边框按钮</Button>
                <Button variant="filter">滤镜按钮</Button>
                <Button variant="danger">危险按钮</Button>
              </div>
            </div>

            {/* 不同尺寸 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">不同尺寸</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">小按钮</Button>
                <Button size="md">中等按钮</Button>
                <Button size="lg">大按钮</Button>
                <Button size="xl">超大按钮</Button>
              </div>
            </div>

            {/* 状态测试 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">按钮状态</h3>
              <div className="flex flex-wrap gap-4">
                <Button disabled>禁用状态</Button>
                <Button loading={loading} onClick={handleLoadingTest}>
                  {loading ? '加载中...' : '点击测试加载'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 灯光按钮测试 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-picapica-900 mb-6">灯光按钮组件</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">预设颜色</h3>
              <div className="flex flex-wrap gap-3">
                {presetColors.map(preset => (
                  <LightingButton
                    key={preset.color}
                    color={preset.color}
                    active={currentColor === preset.color}
                    onClick={() => setCurrentColor(preset.color)}
                    className="w-16 h-16"
                  >
                    <span className="sr-only">{preset.name}</span>
                  </LightingButton>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">自定义颜色</h3>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-12 h-12 rounded border-0 cursor-pointer"
                />
                <CustomColorButton>
                  自定义颜色
                </CustomColorButton>
              </div>
            </div>
          </div>
        </Card>

        {/* 提示和加载测试 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-picapica-900 mb-6">提示和加载组件</h2>
          
          <div className="space-y-6">
            {/* 加载器测试 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">加载器</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <LoadingSpinner size="sm" />
                  <p className="mt-2 text-sm">小</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" />
                  <p className="mt-2 text-sm">中</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-2 text-sm">大</p>
                </div>
              </div>
            </div>

            {/* 提示框测试 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">提示框</h3>
              <div className="space-y-4">
                <Alert type="info">这是一条信息提示</Alert>
                <Alert type="success">操作成功完成！</Alert>
                <Alert type="error">出现了错误，请重试</Alert>
              </div>
            </div>
          </div>
        </Card>

        {/* 表单组件测试 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-picapica-900 mb-6">表单组件</h2>
          
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-picapica-800 mb-2">
                用户名
              </label>
              <Input 
                type="text" 
                placeholder="请输入用户名" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-picapica-800 mb-2">
                邮箱
              </label>
              <Input 
                type="email" 
                placeholder="请输入邮箱地址" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-picapica-800 mb-2">
                留言
              </label>
              <TextArea 
                placeholder="请输入您的留言..." 
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* 瀑布流布局测试 */}
        <Card>
          <h2 className="text-2xl font-bold text-picapica-900 mb-6">瀑布流布局</h2>
          
          <MasonryGrid>
            {mockPhotos.map(photo => (
              <MasonryItem key={photo.id} className="group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white font-medium">{photo.title}</p>
                  </div>
                </div>
              </MasonryItem>
            ))}
          </MasonryGrid>
        </Card>
      </Container>
    </div>
  );
};

export default TailwindTest;