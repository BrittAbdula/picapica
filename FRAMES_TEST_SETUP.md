# Frames 测试环境配置说明

## 页面对比

### `/templates` - 正式模板页面
- **数据源**: API 服务器 (`api.picapica.app`)
- **用途**: 生产环境使用
- **调用方式**: `FrameService.getAllFrames()` (原有逻辑)
- **特征**: 标准 UI

### `/template-test` - 测试页面
- **数据源**: 本地 `Frames.js` 文件
- **用途**: 开发和测试环境
- **调用方式**: 直接使用 `import FRAMES from './Frames'`
- **特征**: 绿色边框，LOCAL 标记

## 技术实现

### FrameService.js 关键方法

```javascript
// frameService 保持原有逻辑不变
static async getAllFrames()                    // 默认使用 API
static async getFrameByName(name)              // 默认使用 API  
static async getFrameDrawFunction(frameName)   // 默认使用 API
```

### TemplateTest 独立实现
- 直接从 `frontend/src/components/Frames.js` 导入 FRAMES 对象
- 不使用 frameService，避免影响原有逻辑
- 本地处理 frames 列表和 draw 函数
- 独立的缓存机制

## 路由配置

```javascript
// App.js 中的路由
<Route path="/templates" element={<Templates />} />        // API数据
<Route path="/template-test" element={<TemplateTest />} /> // 本地数据
```

## 使用场景

1. **开发新 Frame**: 在 `Frames.js` 中添加新frame，通过 `/template-test` 预览
2. **调试现有 Frame**: 在本地修改 frame 代码，实时测试效果
3. **API 测试**: 通过 `/templates` 验证 API 和本地的一致性
4. **生产部署**: 只使用 `/templates`，确保数据来源于 API

## 注意事项

- TemplateTest 页面完全独立，不影响 frameService 原有逻辑
- Templates 页面保持原有逻辑不变，继续使用 API 数据
- TemplateTest 直接导入本地 Frames.js，无需修改 frameService
- 两个页面 UI 和功能完全一致，仅数据源和实现方式不同
- 开发时可同时打开两个页面对比效果 