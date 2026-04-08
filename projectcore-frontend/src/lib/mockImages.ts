// Mock images for the application
// This file contains URLs to images for development purposes

export const studentImages = [
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
  "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6"
];

export const businessImages = [
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
  "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  "https://images.unsplash.com/photo-1497215842964-222b430dc094"
];

export const networkingImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  "https://images.unsplash.com/photo-1552664730-d307ca884978",
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c"
];

export const getRandomImage = (type: 'student' | 'business' | 'networking'): string => {
  const images = type === 'student' 
    ? studentImages 
    : type === 'business' 
      ? businessImages 
      : networkingImages;
  
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};
