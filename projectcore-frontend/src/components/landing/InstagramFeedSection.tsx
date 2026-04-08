'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getInstagramFeed, getInstagramEmbedUrl, InstagramPost } from '@/services/instagramService';

const InstagramFeedSection = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getInstagramFeed();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los posts de Instagram:', err);
        setError('No se pudieron cargar las publicaciones de Instagram. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  // Mostrar mensaje de carga
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="instagram-post-container bg-gray-800/50 rounded-xl animate-pulse">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-gray-500">Cargando...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-8">
        <p className="text-red-400">{error}</p>
        <a 
          href="https://www.instagram.com/projectcore.oficial" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 text-pink-400 hover:text-pink-300 font-semibold transition-colors"
        >
          Ver en Instagram
        </a>
      </div>
    );
  }

  // Mostrar los posts
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {posts.slice(0, 4).map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="instagram-post-container"
          >
            <iframe
              src={getInstagramEmbedUrl(post.permalink)}
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              className="rounded-xl shadow-lg overflow-hidden bg-white"
              title={`Instagram Post ${post.id}`}
            />
          </motion.div>
        ))}
      </div>
      
      <style jsx global>{`
        .instagram-post-container {
          position: relative;
          padding-bottom: 100%;
          height: 0;
          overflow: hidden;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .instagram-post-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .instagram-post-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default InstagramFeedSection;
