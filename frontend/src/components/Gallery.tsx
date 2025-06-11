import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Image as ImageIcon, ExternalLink, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';

// Import images et vidéos locales
import Session from '../../public/assets/session.jpg';
import SessionTechnique from '../../public/assets/session_technique.jpg';
import Pausecafe from '../../public/assets/pausecafe.jpg';
import Jury from '../../public/assets/jury.jpg';
import Speekers from '../../public/assets/speekers.jpg';
import Ceremony from '../../public/assets/ceremony.mp4';
import Nexus from '../../public/assets/Nexus_Eau_Énergie.mp4';
import WebSite from '../../public/assets/SITE_2024.mp4';

interface GalleryProps {
  language: 'fr' | 'en';
}

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  const { toast } = useToast();
  
  type PhotoItem = {
    title: string;
    year: string;
    description: string;
    views: number;
    image?: string;
  };

  type VideoItem = {
    title: string;
    duration: string;
    description: string;
    views: number;
    localPath?: string;
    thumbnail?: string;
  };

  type SelectedMedia = (PhotoItem & { type: 'photo' }) | (VideoItem & { type: 'video' }) | null;

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia>(null);

  const content = {
    fr: {
      title: 'Galerie Photos & Vidéos',
      subtitle: 'Découvrez les moments forts des éditions précédentes',
      photos: {
        title: 'Photos',
        items: [
          {
            title: 'Cérémonie d\'ouverture SITE 2023',
            year: '2023',
            description: 'Moment d\'ouverture officielle de la conférence avec les discours d\'inauguration.',
            views: 1250,
            image: Session
          },
          {
            title: 'Sessions techniques',
            year: '2023',
            description: 'Présentations des recherches et débats techniques entre experts.',
            views: 890,
            image: SessionTechnique
          },
          {
            title: 'Networking et pause café',
            year: '2023',
            description: 'Moments d\'échange et de networking entre participants.',
            views: 634,
            image: Pausecafe
          },
          {
            title: 'Intervenants',
            year: '2023',
            description: 'Session interactive avec des démonstrations technologiques en direct et des présentations par affiches animées par des intervenants invités.',
            views: 543,
            image: Speekers
          },
          {
            title: 'Jury et démonstrations',
            year: '2023',
            description: "Cérémonie de clôture festive avec un jury d'experts et l'annonce des prix.",
            views: 789,
            image: Jury
          }
        ]
      },
      videos: {
        title: 'Vidéos',
        items: [
          {
            title: "La cérémonie d'ouverture",
            duration: '1:00',
            description: "La cérémonie d'ouverture de la Conférence Internationale sur l'Industrie Intelligente, la Technologie et l'Environnement a officiellement eu lieu.",
            views: 2340,
            localPath: Ceremony,
            thumbnail: Ceremony // Utiliser une image comme miniature
          },
          {
            title: 'Nexus Eau-Énergie',
            duration: '1:00',
            description: "Session plénière 3 : « Nexus Eau-Énergie » animée par M. Khaled El Moueddeb, Professeur à l'ESIM.",
            views: 1876,
            localPath: Nexus,
            thumbnail: Nexus // Utiliser une image comme miniature
          },
          {
            title: 'Site Web 2024',
            duration: '1:00',
            description: 'Site Web 2024',
            views: 1456,
            localPath: WebSite,
            thumbnail: WebSite // Utiliser une image comme miniature
          }
        ]
      },
      actions: {
        viewAll: 'Voir tout',
        download: 'Télécharger',
        watch: 'Regarder',
        view: 'Voir',
        fullscreen: 'Plein écran'
      }
    },
    en: {
      title: 'Photo & Video Gallery',
      subtitle: 'Discover highlights from previous editions',
      photos: {
        title: 'Photos',
        items: [
          {
            title: 'Opening Ceremony',
            year: '2023',
            description: 'The opening ceremony of the International Conference on Smart Industry, Technology and Environment has officially taken place!',
            views: 1250,
            image: Session
          },
          {
            title: 'Technical Sessions',
            year: '2023',
            description: 'Research presentations and technical debates between experts.',
            views: 890,
            image: SessionTechnique
          },
          {
            title: 'Networking and Coffee Break',
            year: '2023',
            description: 'Exchange and networking moments between participants.',
            views: 634,
            image: Pausecafe
          },
          {
            title: 'Speakers',
            year: '2023',
            description: 'Interactive session featuring live technology demos and poster presentations by guest speakers.',
            views: 756,
            image: Speekers
          },
          {
            title: 'Jury',
            year: '2023',
            description: 'Closing ceremony featuring a panel of experts and award announcements in a festive atmosphere.',
            views: 789,
            image: Jury
          }
        ]
      },
      videos: {
        title: 'Videos',
        items: [
          {
            title: 'Opening ceremony',
            duration: '1:00',
            description: 'The opening ceremony of the International Conference on Smart Industry, Technology and Environment has officially taken place!',
            views: 2340,
            localPath: Ceremony,
            thumbnail: Session // Utiliser une image comme miniature
          },
          {
            title: 'Nexus Eau-Energie',
            duration: '1:00',
            description: 'Plenary session 3 "Nexus Eau-Energie" Mr Khaled El Moueddeb: Professeur ESIM',
            views: 1876,
            localPath: Nexus,
            thumbnail: SessionTechnique // Utiliser une image comme miniature
          },
          {
            title: 'Web site 2024',
            duration: '1:00',
            description: 'Web site 2024',
            views: 1456,
            localPath: WebSite,
            thumbnail: Speekers // Utiliser une image comme miniature
          }
        ]
      },
      actions: {
        viewAll: 'View All',
        download: 'Download',
        watch: 'Watch',
        view: 'View',
        fullscreen: 'Fullscreen'
      }
    }
  };

  const handleDownload = (title: string, filePath?: string) => {
    if (filePath) {
      // Créer un lien de téléchargement pour le fichier local
      const link = document.createElement('a');
      link.href = filePath;
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast({
      title: language === 'fr' ? 'Téléchargement' : 'Download',
      description: language === 'fr' ? 'Le téléchargement va commencer...' : 'Download will start...',
    });
  };

  const handleWatch = (video: VideoItem) => {
    if (video.localPath) {
      // Ouvrir la vidéo locale dans un nouvel onglet ou dans le lecteur par défaut
      window.open(video.localPath, '_blank');
    } else {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Vidéo non disponible' : 'Video not available',
        variant: 'destructive'
      });
    }
  };
 
  const handleView = (item: PhotoItem | VideoItem, type: 'photo' | 'video') => {
    setSelectedMedia({ ...item, type } as SelectedMedia);
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content[language].subtitle}
            </p>
          </div>
         
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Photos Section */}
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                {content[language].photos.title}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {content[language].photos.items.map((photo, index) => (
                  <Card key={index} className="group cursor-pointer transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden transition-transform duration-300">
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/30', 'flex', 'items-center', 'justify-center');
                            const fallbackIcon = document.createElement('div');
                            fallbackIcon.innerHTML = '<svg class="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                            e.currentTarget.parentElement!.appendChild(fallbackIcon);
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{photo.title}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">{photo.year}</p>
                          <p className="text-xs text-muted-foreground">{photo.views} {language === 'fr' ? 'vues' : 'views'}</p>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleView(photo, 'photo')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {content[language].actions.view}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleDownload(photo.title, photo.image)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {content[language].actions.download}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Videos Section */}
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                <Play className="w-6 h-6" />
                {content[language].videos.title}
              </h3>
              <div className="space-y-4">
                {content[language].videos.items.map((video, index) => (
                  <Card key={index} className="group cursor-pointer  transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-16 bg-gradient-to-br from-primary/20 to-accent/30 rounded-lg flex items-center justify-center  transition-transform duration-300 relative overflow-hidden">
                          {video.thumbnail ? (
                            <>
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover absolute inset-0"
                                onError={(e) => {
                                  // Fallback vers la vidéo si l'image ne charge pas
                                  e.currentTarget.style.display = 'none';
                                  const videoElement = e.currentTarget.parentElement?.querySelector('video');
                                  if (videoElement) {
                                    videoElement.style.display = 'block';
                                  }
                                }}
                              />
                              <video
                                className="w-full h-full object-cover absolute inset-0"
                                src={video.localPath}
                                muted
                                preload="metadata"
                                style={{ display: 'none' }}
                                onLoadedMetadata={(e) => {
                                  e.currentTarget.currentTime = 1;
                                }}
                              />
                  
                            </>
                          ) : video.localPath ? (
                            <>
                              <video
                                className="w-full h-full object-cover absolute inset-0"
                                src={video.localPath}
                                muted
                                preload="metadata"
                                onLoadedMetadata={(e) => {
                                  e.currentTarget.currentTime = 1;
                                }}
                              />
                              <div className="absolute inset-0  transition-all duration-300 rounded-lg flex items-center justify-center">
                                <Play className="w-6 h-6 text-white fill-current drop-shadow-lg" />
                              </div>
                            </>
                          ) : (
                            <>
                              <Play className="w-6 h-6 text-primary fill-current" />
                              <div className="absolute inset-0  transition-all duration-300 rounded-lg"></div>
                            </>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{video.title}</h4>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-muted-foreground">{video.duration}</p>
                            <p className="text-xs text-muted-foreground">{video.views} {language === 'fr' ? 'vues' : 'views'}</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleWatch(video)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {content[language].actions.watch}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(video, 'video')}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {content[language].actions.view}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(video.title, video.localPath)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Media Viewer Modal */}
          {selectedMedia && (
            <Modal
              open={!!selectedMedia}
              onOpenChange={(open) => !open && setSelectedMedia(null)}
              trigger={<div />}
              title={selectedMedia.title}
            >
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/30 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedMedia.type === 'photo' && selectedMedia.image ? (
                    <img
                      src={selectedMedia.image}
                      alt={selectedMedia.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : selectedMedia.type === 'video' && selectedMedia.localPath ? (
                    <video
                      width="100%"
                      height="100%"
                      controls
                      className="rounded-lg"
                      src={selectedMedia.localPath}
                    >
                      Votre navigateur ne supporte pas les vidéos HTML5.
                    </video>
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center" style={{ display: (selectedMedia.type === 'photo' && selectedMedia.image) || (selectedMedia.type === 'video' && selectedMedia.localPath) ? 'none' : 'flex' }}>
                    {selectedMedia.type === 'photo' ? (
                      <ImageIcon className="w-16 h-16 text-primary/60" />
                    ) : (
                      <Play className="w-16 h-16 text-primary fill-current" />
                    )}
                  </div>
                </div>
               
                <div>
                  <h4 className="font-semibold mb-2">{selectedMedia.title}</h4>
                  <p className="text-muted-foreground mb-2">{selectedMedia.description}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {selectedMedia.type === 'photo'
                        ? selectedMedia.year
                        : selectedMedia.type === 'video'
                        ? selectedMedia.duration
                        : ''}
                    </span>
                    <span>{selectedMedia.views} {language === 'fr' ? 'vues' : 'views'}</span>
                  </div>
                </div>
               
                <div className="flex gap-2">
                  {selectedMedia.type === 'video' && selectedMedia.localPath && (
                    <Button onClick={() => handleWatch(selectedMedia)} className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {content[language].actions.fullscreen}
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleDownload(
                      selectedMedia.title, 
                      selectedMedia.type === 'photo' ? selectedMedia.image : selectedMedia.localPath
                    )} 
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {content[language].actions.download}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;