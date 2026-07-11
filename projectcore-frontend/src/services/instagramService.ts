import axios from 'axios';
import { API_BASE_URL } from '@/services/backend-api';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

export const getInstagramFeed = async (): Promise<InstagramPost[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instagram/feed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return [];
  }
};

export const getInstagramEmbedUrl = (postUrl: string): string => {
  try {
    const url = new URL(postUrl);
    return `https://www.instagram.com/p${url.pathname.split('/p')[1]}/embed`;
  } catch (error) {
    console.error('Error generating Instagram embed URL:', error);
    return '';
  }
};
