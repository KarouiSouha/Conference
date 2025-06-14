import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Image as ImageIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryItem {
  id: number;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  type: 'photo' | 'video';
  file_path: string;
  file_url: string;
  thumbnail_path?: string;
  thumbnail_url?: string;
  year: string;
  duration?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

interface GalleryProps {
  language: 'fr' | 'en';
}

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les données depuis l'API
  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les photos et vidéos en parallèle
      const [photosResponse, videosResponse] = await Promise.all([
        fetch('http://localhost:8000/api/Gallery/photos'),
        fetch('http://localhost:8000/api/Gallery/videos')
      ]);

      if (!photosResponse.ok || !videosResponse.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const photosData = await photosResponse.json();
      const videosData = await videosResponse.json();

      setPhotos(photosData);
      setVideos(videosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const handleWatch = (video: GalleryItem) => {
    window.open(video.file_url, '_blank');
  };

  const handleViewPhoto = (photo: GalleryItem) => {
    window.open(photo.file_url, '_blank');
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement de la galerie...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Erreur: {error}</p>
            <Button onClick={fetchGalleryData} className="mt-4">
              Réessayer
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {language === 'fr' ? 'Galerie Photos & Vidéos' : 'Photo & Video Gallery'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'fr' ? 'Découvrez les moments forts des éditions précédentes' : 'Discover highlights from previous editions'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Section Photos */}
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                {language === 'fr' ? 'Photos' : 'Photos'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={photo.file_url}
                          alt={language === 'fr' ? photo.title_fr : photo.title_en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay avec bouton de visualisation */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            size="sm"
                            onClick={() => handleViewPhoto(photo)}
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {language === 'fr' ? 'Voir' : 'View'}
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-sm mb-2 line-clamp-2">
                          {language === 'fr' ? photo.title_fr : photo.title_en}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {language === 'fr' ? photo.description_fr : photo.description_en}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground font-medium">{photo.year}</p>
                          <p className="text-xs text-muted-foreground">
                            {photo.views} {language === 'fr' ? 'vues' : 'views'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Section Vidéos */}
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                <Play className="w-6 h-6" />
                {language === 'fr' ? 'Vidéos' : 'Videos'}
              </h3>
              <div className="space-y-4">
                {videos.map((video) => (
                  <Card key={video.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-18 bg-gradient-to-br from-primary/20 to-accent/30 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {video.thumbnail_url ? (
                            <>
                              <img
                                src={video.thumbnail_url}
                                alt={language === 'fr' ? video.title_fr : video.title_en}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white fill-current drop-shadow-lg" />
                              </div>
                            </>
                          ) : (
                            <Play className="w-8 h-8 text-primary fill-current" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-base mb-2">
                            {language === 'fr' ? video.title_fr : video.title_en}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {language === 'fr' ? video.description_fr : video.description_en}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <p className="text-xs text-muted-foreground font-medium">{video.duration}</p>
                              <p className="text-xs text-muted-foreground">{video.year}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {video.views} {language === 'fr' ? 'vues' : 'views'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={() => handleWatch(video)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {language === 'fr' ? 'Regarder la vidéo' : 'Watch Video'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;