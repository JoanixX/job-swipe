import axios from 'axios';

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
    const response = await axios.get('https://backendcy-dce4dqceb2ech0a2.westus3-01.azurewebsites.net/api/instagram/feed');
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
