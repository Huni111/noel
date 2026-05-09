// config/fetchImage.js
import { storage } from './appwrite_config';
import { Query } from 'appwrite';

const bucketId = import.meta.env.VITE_BUCKET_ID;

export async function fetchImagesFromAppwrite() {
  try {
    const response = await storage.listFiles(bucketId, [Query.limit(10)]);
    const images = response.files.filter(file => file.mimeType.startsWith('image/'));
    return { ids: images };
  } catch (error) {
    console.error('Error fetching initial images:', error);
    return { ids: [] };
  }
}