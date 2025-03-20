import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Meta from './Meta';
import '../styles/GalleryPage.css';

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
    <div className="gallery-container">
      <Meta 
        title="Photo Gallery | Pica Pica"
        description="Browse all photos taken with Pica Pica photo booth app"
        canonicalUrl="/gallery"
        keywords="photo gallery, photo booth, pica pica, image gallery, photo collection"
      />
      
      <h1 className="gallery-title">Photo Gallery</h1>
      
      {initialLoad ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading photos...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchPhotos(0);
            }}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="masonry-grid">
            {photos.map((photo, index) => {
              const isLastElement = index === photos.length - 1;
              return (
                <div 
                  key={photo.id} 
                  className={`masonry-item ${photo.filter}`}
                  ref={isLastElement ? lastPhotoElementRef : null}
                >
                  <Link to={`/share?imageurl=${encodeURIComponent(photo.imageUrl)}`}>
                    <img 
                      src={photo.imageUrl} 
                      alt={`Photo ${photo.id}`} 
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="photo-overlay">
                      <span className="photo-date">
                        {new Date(photo.timestamp).toLocaleDateString()}
                      </span>
                      {photo.filter !== 'none' && (
                        <span className="photo-filter">{photo.filter}</span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          
          {loading && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <p>Loading more photos...</p>
            </div>
          )}
          
          {!hasMore && photos.length > 0 && (
            <p className="no-more-photos">No more photos to load</p>
          )}
          
          {photos.length === 0 && !loading && (
            <div className="no-photos">
              <p>No photos found</p>
              <Link to="/photobooth" className="take-photo-button">
                Take a Photo
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryPage; 