import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Image, Eye, Calendar } from 'lucide-react';
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
  const [allPhotos, setAllPhotos] = useState<GalleryItem[]>([]);
  const [allVideos, setAllVideos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  // Données statiques pour les photos (2023 existantes + nouvelles pour 2024)
  const staticPhotos: GalleryItem[] = [
    // Photos 2023 (existantes)
    {
      id: 1,
      title_fr: "Networking et pause café",
      title_en: "Networking and Coffee Break",
      description_fr: "Moments d'échange et de networking entre participants.",
      description_en: "Exchange and networking moments between participants.",
      type: 'photo',
      file_path: '/asset/images/gallery/pausecafe.jpg',
      file_url: '/asset/images/gallery/pausecafe.jpg',
      year: '2023',
      views: 634,
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: 2,
      title_fr: "Cérémonie d'ouverture SITE 2023",
      title_en: "Opening Ceremony SITE 2023",
      description_fr: "Moment d'ouverture officielle de la conférence avec les discours d'inauguration.",
      description_en: "Official opening moment of the conference with inauguration speeches.",
      type: 'photo',
      file_path: '/asset/images/gallery/session.jpg',
      file_url: '/asset/images/gallery/session.jpg',
      year: '2023',
      views: 1250,
      created_at: '2024-01-16',
      updated_at: '2024-01-16'
    },
    {
      id: 3,
      title_fr: "Sessions techniques",
      title_en: "Technical Sessions",
      description_fr: "Présentations des recherches et débats techniques entre experts.",
      description_en: "Research presentations and technical debates between experts.",
      type: 'photo',
      file_path: '/asset/images/gallery/session_technique.jpg',
      file_url: '/asset/images/gallery/session_technique.jpg',
      year: '2023',
      views: 890,
      created_at: '2024-01-17',
      updated_at: '2024-01-17'
    },
    {
      id: 4,
      title_fr: "Intervenants",
      title_en: "Speakers",
      description_fr: "Session interactive avec des démonstrations technologiques en direct et des présentations par affiches animées par des intervenants invités.",
      description_en: "Interactive session featuring live technology demos and poster presentations by guest speakers.",
      type: 'photo',
      file_path: '/asset/images/gallery/speekers.jpg',
      file_url: '/asset/images/gallery/speekers.jpg',
      year: '2023',
      views: 543,
      created_at: '2023-01-18',
      updated_at: '2023-01-18'
    },
    {
      id: 5,
      title_fr: "Jury et démonstrations",
      title_en: "Jury",
      description_fr: "Cérémonie de clôture festive avec un jury d'experts et l'annonce des prix.",
      description_en: "Closing ceremony featuring a panel of experts and award announcements in a festive atmosphere.",
      type: 'photo',
      file_path: '/asset/images/gallery/jury.jpg',
      file_url: '/asset/images/gallery/jury.jpg',
      year: '2023',
      views: 789,
      created_at: '2023-01-19',
      updated_at: '2023-01-19'
    }
  ];

  // Données statiques pour les vidéos (2023 existantes + nouvelles pour 2024)
  const staticVideos: GalleryItem[] = [
    // Vidéos 2023 (existantes)
    {
      id: 8,
      title_fr: "Nexus Eau-Énergie",
      title_en: "Nexus Eau-Energie",
      description_fr: "Session plénière 3 : « Nexus Eau-Énergie » animée par M. Khaled El Moueddeb, Professeur à l'ESIM.",
      description_en: "Plenary session 3 Nexus Eau-Energie Mr Khaled El Moueddeb: Professeur ESIM",
      type: 'video',
      file_path: '/asset/videos/gallery/artists-interview.mp4',
      file_url: '/asset/videos/gallery/artists-interview.mp4',
      thumbnail_path: '/asset/images/gallery/speekers.jpg',
      thumbnail_url: '/asset/images/gallery/speekers.jpg',
      year: '2023',
      duration: '1:00',
      views: 1890,
      created_at: '2024-01-25',
      updated_at: '2024-01-25'
    },
    {
      id: 9,
      title_fr: "La cérémonie d'ouverture",
      title_en: "Opening ceremony",
      description_fr: "La cérémonie d'ouverture de la Conférence Internationale sur l'Industrie Intelligente, la Technologie et l'Environnement a officiellement eu lieu.",
      description_en: "The opening ceremony of the International Conference on Smart Industry, Technology and Environment has officially taken place!",
      type: 'video',
      file_path: '/asset/videos/gallery/behind-scenes.mp4',
      file_url: '/asset/videos/gallery/behind-scenes.mp4',
      thumbnail_path: '/asset/images/gallery/speekers.jpg',
      thumbnail_url: '/asset/images/gallery/speekers.jpg',
      year: '2023',
      duration: '1:00',
      views: 2140,
      created_at: '2023-02-10',
      updated_at: '2023-02-10'
    },
    // Nouvelles vidéos 2024
    {
      id: 7,
      title_fr: "Site Web 2024",
      title_en: "Web site 2024",
      description_fr: "Présentation du nouveau site web et des innovations digitales 2024.",
      description_en: "Presentation of the new website and digital innovations 2024.",
      type: 'video',
      file_path: '/asset/videos/gallery/website.mp4',
      file_url: '/asset/videos/gallery/website.mp4',
      thumbnail_path: '/asset/images/gallery/session.jpg',
      thumbnail_url: '/asset/images/gallery/session.jpg',
      year: '2024',
      duration: '2:30',
      views: 3456,
      created_at: '2024-02-01',
      updated_at: '2024-02-01'
    }
  ];

  // Simuler le chargement des données
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAllPhotos(staticPhotos);
        setAllVideos(staticVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryData();
  }, []);

  // Filtrer les données par année
  const filteredPhotos = allPhotos.filter(photo => photo.year === selectedYear);
  const filteredVideos = allVideos.filter(video => video.year === selectedYear);

  // Obtenir les années disponibles
  const availableYears = ['2024', '2023']; // On peut aussi le calculer dynamiquement

  const handleWatch = (video: GalleryItem) => {
    // Ouvrir la vidéo dans un nouvel onglet ou utiliser un lecteur vidéo
    window.open(video.file_url, '_blank');
  };

  const handleViewPhoto = (photo: GalleryItem) => {
    // Ouvrir l'image dans un nouvel onglet
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
            <Button onClick={() => window.location.reload()} className="mt-4">
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
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'fr' ? 'Découvrez les moments forts des éditions précédentes' : 'Discover highlights from previous editions'}
            </p>
            
            {/* Onglets de filtrage par année */}
            <div className="flex justify-center gap-2 mb-8">
              {availableYears.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => setSelectedYear(year)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {year}
                </Button>
              ))}
            </div>
          </div>

          {/* Affichage conditionnel si aucun contenu pour l'année sélectionnée */}
          {filteredPhotos.length === 0 && filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {language === 'fr' 
                  ? `Aucun contenu disponible pour l'année ${selectedYear}` 
                  : `No content available for year ${selectedYear}`}
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Section Photos */}
              {filteredPhotos.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                    <Image className="w-6 h-6" />
                    {language === 'fr' ? `Photos ${selectedYear}` : `Photos ${selectedYear}`}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredPhotos.map((photo) => (
                      <Card key={photo.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={photo.file_url}
                              alt={language === 'fr' ? photo.title_fr : photo.title_en}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                // Image de fallback si l'image n'existe pas
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
                              }}
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
              )}

              {/* Section Vidéos */}
              {filteredVideos.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                    <Play className="w-6 h-6" />
                    {language === 'fr' ? `Vidéos ${selectedYear}` : `Videos ${selectedYear}`}
                  </h3>
                  <div className="space-y-4">
                    {filteredVideos.map((video) => (
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
                                    onError={(e) => {
                                      // Thumbnail de fallback si l'image n'existe pas
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
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
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;