import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import { fetchImagesFromAppwrite } from './config/fetchImage.js';
import { fetchMoreImagesFromAppwrite } from './config/fetchMoreImage.js';
import { storage } from './config/appwrite_config';

export default function List() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const bucketId = String(import.meta.env.VITE_BUCKET_ID);
  const projectId = '69fb57260028db60c6ee'; // Your project ID from config

  // Load initial images
  useEffect(() => {
    const loadInitialImages = async () => {
      setIsLoading(true);
      try {
        const result = await fetchImagesFromAppwrite();
        console.log('Initial fetch result:', result);
        if (result && Array.isArray(result.ids)) {
          setImages(result.ids);
        } else {
          console.warn('Unexpected response from fetchImagesFromAppwrite', result);
          setImages([]);
        }
      } catch (err) {
        console.error('Failed to fetch initial images:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialImages();
  }, []);

  // Load more images (pagination)
  const fetchMoreImages = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const lastImage = images[images.length - 1];
      const cursor = lastImage?.$id;
      if (!cursor) {
        console.warn('No cursor available, cannot fetch more');
        return;
      }
      const nextResult = await fetchMoreImagesFromAppwrite(cursor);
      if (nextResult && Array.isArray(nextResult.ids) && nextResult.ids.length > 0) {
        setImages(prevImages => [...prevImages, ...nextResult.ids]);
      }
    } catch (err) {
      console.error('Error fetching more images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal when clicking an image
  const handleClick = (imageUrl, index) => {
    setCurrentIndex(index);
    setClickedImg(imageUrl);
  };

  // Right arrow (next image)
  const handleRotationRight = () => {
    const totalLength = images.length;
    if (totalLength === 0) return;
    let newIndex = currentIndex + 1;
    if (newIndex >= totalLength) newIndex = 0;
    const nextImage = images[newIndex];
    // Use raw view URL instead of getFilePreview
    const newUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${nextImage.$id}/view?project=${projectId}`;
    setClickedImg(newUrl);
    setCurrentIndex(newIndex);
  };

  // Left arrow (previous image)
  const handleRotationLeft = () => {
    const totalLength = images.length;
    if (totalLength === 0) return;
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = totalLength - 1;
    const prevImage = images[newIndex];
    const newUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${prevImage.$id}/view?project=${projectId}`;
    setClickedImg(newUrl);
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <div className="wrapper">
        {!bucketId && <p style={{color: 'red'}}>Error: VITE_BUCKET_ID is undefined!</p>}

        {images.length > 0 ? (
          images.map((image, index) => {
            // Use raw Appwrite view URL (no SDK preview, works with public bucket)
            const imageUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${image.$id}/view?project=${projectId}`;
            console.log(`Image ${index} URL:`, imageUrl); // Debug: check console
            return (
              <img
                key={image.$id}
                src={imageUrl}
                alt=""
                onError={(e) => {
                  console.error(`Failed to load image ${image.$id}`, e);
                  e.target.src = 'https://via.placeholder.com/300?text=Image+not+loaded';
                }}
                onClick={() => handleClick(imageUrl, index)}
              />
            );
          })
        ) : (
          <p>{isLoading ? 'Betöltés...' : 'Nincsenek képek'}</p>
        )}

        {clickedImg && (
          <Modal
            clickedImg={clickedImg}
            handelRotationRight={handleRotationRight}
            setClickedImg={setClickedImg}
            handelRotationLeft={handleRotationLeft}
          />
        )}
      </div>

      <div className="footer">
        {isLoading && <h3>Betöltés...</h3>}
        <button className="file" onClick={fetchMoreImages} disabled={isLoading}>
          Meg tobb kep!
        </button>
      </div>
    </>
  );
}