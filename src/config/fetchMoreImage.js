// config/fetchMoreImage.js
import { storage } from './appwrite_config';
import { Query } from 'appwrite';

const bucketId = import.meta.env.VITE_BUCKET_ID;

export async function fetchMoreImagesFromAppwrite(cursor) {
  try {
    if (!cursor) return { ids: [] };
    const response = await storage.listFiles(bucketId, [
      Query.limit(10),
      Query.cursorAfter(cursor)
    ]);
    const images = response.files.filter(file => file.mimeType.startsWith('image/'));
    return { ids: images };
  } catch (error) {
    console.error('Error fetching more images:', error);
    return { ids: [] };
  }
}