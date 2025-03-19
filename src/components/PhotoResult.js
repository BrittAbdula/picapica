import { useNavigate } from 'react-router-dom';

const PhotoResult = ({ photos }) => {
  const navigate = useNavigate();
  
  const handleEditPhoto = (photo) => {
    // 可以将照片数据存储在 localStorage 或通过状态管理传递
    localStorage.setItem('editPhoto', photo);
    navigate('/editor');
  };
  
  return (
    <div className="photo-result">
      {/* ... 现有内容 */}
      
      <div className="actions">
        <button onClick={() => handleSavePhotos()}>保存照片</button>
        <button onClick={() => handleEditPhoto(photos[0])}>编辑照片</button>
        <button onClick={() => handleSharePhotos()}>分享照片</button>
      </div>
    </div>
  );
}; 
