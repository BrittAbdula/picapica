import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Meta from './Meta';

// 导入新的UI组件
import { Container, MasonryGrid, MasonryItem, LoadingSpinner, Alert, Button } from './ui';

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const ITEMS_PER_PAGE = 30;
  const observer = useRef();
  
  // Function to fetch photos from the API
  const fetchPhotos = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const offset = pageNum * ITEMS_PER_PAGE;
      const response = await fetch(`https://api.picapica.app/api/x/images?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      
      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
      
      setPhotos(prevPhotos => pageNum === 0 ? data : [...prevPhotos, ...data]);
      setLoading(false);
      setInitialLoad(false);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos. Please try again later.');
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    fetchPhotos(0);
  }, [fetchPhotos]);
  
  // Setup intersection observer for infinite scrolling
  const lastPhotoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // Load more photos when page changes
  useEffect(() => {
    if (page > 0) {
      fetchPhotos(page);
    }
  }, [page, fetchPhotos]);
  
  return (
    <>
      <Meta 
        title="Photo Gallery | Pica Pica"
        description="Browse all photos taken with Pica Pica photo booth app"
        canonicalUrl="/gallery"
        keywords="photo gallery, photo booth, pica pica, image gallery, photo collection"
      />
      
      <div className="min-h-screen bg-picapica-50 py-8">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-picapica mb-4">
              照片画廊
            </h1>
            <p className="text-lg text-picapica-700 max-w-2xl mx-auto">
              浏览来自全世界用户创建的精美照片条，为您的下一次Picapica拍照获得灵感。
            </p>
          </div>
      
          {initialLoad ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-picapica-700">正在加载照片...</p>
            </div>
          ) : error ? (
            <Alert type="error" className="max-w-md mx-auto text-center">
              <p className="mb-4">{error}</p>
              <Button 
                variant="secondary"
                onClick={() => {
                  setError(null);
                  fetchPhotos(0);
                }}
              >
                重试
              </Button>
            </Alert>
          ) : (
            <>
              <MasonryGrid>
                {photos.map((photo, index) => {
                  const isLastElement = index === photos.length - 1;
                  return (
                    <MasonryItem 
                      key={photo.id}
                      className={`group cursor-pointer ${photo.filter}`}
                      ref={isLastElement ? lastPhotoElementRef : null}
                    >
                      <Link to={`/share?imageurl=${encodeURIComponent(photo.imageUrl)}`}>
                        <div className="relative overflow-hidden">
                          <img 
                            src={photo.imageUrl} 
                            alt={`照片 ${photo.id}`} 
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          
                          {/* 悬浮信息层 */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <div className="p-4 text-white w-full">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">
                                  {new Date(photo.timestamp).toLocaleDateString()}
                                </span>
                                {photo.filter !== 'none' && (
                                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                                    {photo.filter}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </MasonryItem>
                  );
                })}
              </MasonryGrid>
              
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner />
                  <p className="mt-4 text-picapica-700">正在加载更多照片...</p>
                </div>
              )}
              
              {!hasMore && photos.length > 0 && (
                <p className="text-center text-picapica-600 py-8 italic">
                  没有更多照片了
                </p>
              )}
              
              {photos.length === 0 && !loading && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-6">📷</div>
                  <p className="text-xl text-picapica-700 mb-6">还没有照片</p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => window.location.href = '/photobooth'}
                  >
                    开始拍照
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default GalleryPage; 