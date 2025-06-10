
// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Play, Image as ImageIcon, ExternalLink, Download, Eye } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Modal from './Modal';
// import { useToast } from '@/hooks/use-toast';

// // Import images
// import conferenceOpeningImg from '@/assets/gallery/conference-opening.jpg';
// import technicalSessionsImg from '@/assets/gallery/technical-sessions.jpg';
// import postersDemoImg from '@/assets/gallery/posters-demo.jpg';
// import networkingImg from '@/assets/gallery/networking.jpg';
// import awardsImg from '@/assets/gallery/awards.jpg';
// import closingGalaImg from '@/assets/gallery/closing-gala.jpg';

// interface GalleryProps {
//   language: 'fr' | 'en';
// }

// const Gallery: React.FC<GalleryProps> = ({ language }) => {
//   const { toast } = useToast();
//   const [selectedMedia, setSelectedMedia] = useState<any>(null);

//   const content = {
//     fr: {
//       title: 'Galerie Photos & Vidéos',
//       subtitle: 'Découvrez les moments forts des éditions précédentes',
//       photos: {
//         title: 'Photos',
//         items: [
//           { 
//             title: 'Cérémonie d\'ouverture SITE 2023', 
//             year: '2023',
//             description: 'Moment d\'ouverture officielle de la conférence avec les discours d\'inauguration.',
//             views: 1250,
//             image: conferenceOpeningImg
//           },
//           { 
//             title: 'Sessions techniques', 
//             year: '2023',
//             description: 'Présentations des recherches et débats techniques entre experts.',
//             views: 890,
//             image: technicalSessionsImg
//           },
//           { 
//             title: 'Posters et démonstrations', 
//             year: '2023',
//             description: 'Session poster interactive avec démonstrations technologiques.',
//             views: 756,
//             image: postersDemoImg
//           },
//           { 
//             title: 'Networking et pause café', 
//             year: '2023',
//             description: 'Moments d\'échange et de networking entre participants.',
//             views: 634,
//             image: networkingImg
//           },
//           { 
//             title: 'Remise des prix', 
//             year: '2023',
//             description: 'Cérémonie de remise des prix pour les meilleurs articles.',
//             views: 543,
//             image: awardsImg
//           },
//           { 
//             title: 'Gala de clôture', 
//             year: '2023',
//             description: 'Événement festif de clôture de la conférence.',
//             views: 789,
//             image: closingGalaImg
//           }
//         ]
//       },
//       videos: {
//         title: 'Vidéos',
//         items: [
//           { 
//             title: 'Résumé SITE 2023', 
//             duration: '5:30',
//             description: 'Résumé vidéo des moments forts de SITE 2023.',
//             views: 2340,
//             youtubeId: 'dQw4w9WgXcQ',
//             thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
//           },
//           { 
//             title: 'Keynote Dr. Sarah Johnson', 
//             duration: '45:20',
//             description: 'Conférence plénière sur l\'avenir de l\'IA dans l\'industrie.',
//             views: 1876,
//             youtubeId: 'jNQXAC9IVRw',
//             thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg'
//           },
//           { 
//             title: 'Table ronde industrie 4.0', 
//             duration: '32:15',
//             description: 'Discussion entre experts sur les défis de l\'industrie 4.0.',
//             views: 1456,
//             youtubeId: 'ScMzIvxBSi4',
//             thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg'
//           }
//         ]
//       },
//       actions: {
//         viewAll: 'Voir tout',
//         download: 'Télécharger',
//         watch: 'Regarder',
//         view: 'Voir',
//         fullscreen: 'Plein écran'
//       }
//     },
//     en: {
//       title: 'Photo & Video Gallery',
//       subtitle: 'Discover highlights from previous editions',
//       photos: {
//         title: 'Photos',
//         items: [
//           { 
//             title: 'SITE 2023 Opening Ceremony', 
//             year: '2023',
//             description: 'Official conference opening moment with inaugural speeches.',
//             views: 1250,
//             image: conferenceOpeningImg
//           },
//           { 
//             title: 'Technical Sessions', 
//             year: '2023',
//             description: 'Research presentations and technical debates between experts.',
//             views: 890,
//             image: technicalSessionsImg
//           },
//           { 
//             title: 'Posters and Demonstrations', 
//             year: '2023',
//             description: 'Interactive poster session with technology demonstrations.',
//             views: 756,
//             image: postersDemoImg
//           },
//           { 
//             title: 'Networking and Coffee Break', 
//             year: '2023',
//             description: 'Exchange and networking moments between participants.',
//             views: 634,
//             image: networkingImg
//           },
//           { 
//             title: 'Award Ceremony', 
//             year: '2023',
//             description: 'Award ceremony for the best papers.',
//             views: 543,
//             image: awardsImg
//           },
//           { 
//             title: 'Closing Gala', 
//             year: '2023',
//             description: 'Festive conference closing event.',
//             views: 789,
//             image: closingGalaImg
//           }
//         ]
//       },
//       videos: {
//         title: 'Videos',
//         items: [
//           { 
//             title: 'SITE 2023 Summary', 
//             duration: '5:30',
//             description: 'Video summary of SITE 2023 highlights.',
//             views: 2340,
//             youtubeId: 'dQw4w9WgXcQ',
//             thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
//           },
//           { 
//             title: 'Keynote Dr. Sarah Johnson', 
//             duration: '45:20',
//             description: 'Plenary lecture on the future of AI in industry.',
//             views: 1876,
//             youtubeId: 'jNQXAC9IVRw',
//             thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg'
//           },
//           { 
//             title: 'Industry 4.0 Panel', 
//             duration: '32:15',
//             description: 'Expert discussion on Industry 4.0 challenges.',
//             views: 1456,
//             youtubeId: 'ScMzIvxBSi4',
//             thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg'
//           }
//         ]
//       },
//       actions: {
//         viewAll: 'View All',
//         download: 'Download',
//         watch: 'Watch',
//         view: 'View',
//         fullscreen: 'Fullscreen'
//       }
//     }
//   };

//   const handleDownload = (title: string) => {
//     toast({
//       title: language === 'fr' ? 'Téléchargement' : 'Download',
//       description: language === 'fr' ? 'Le téléchargement va commencer...' : 'Download will start...',
//     });
//   };

//   const handleWatch = (video: any) => {
//     window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank');
//   };

//   const handleView = (item: any, type: 'photo' | 'video') => {
//     setSelectedMedia({ ...item, type });
//   };

//   return (
//     <section id="gallery" className="py-20 bg-background">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
//               {content[language].title}
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               {content[language].subtitle}
//             </p>
//           </div>
          
//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* Photos Section */}
//             <div>
//               <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
//                 <ImageIcon className="w-6 h-6" />
//                 {content[language].photos.title}
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {content[language].photos.items.map((photo, index) => (
//                   <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
//                     <CardContent className="p-0">
//                       <div className="aspect-video relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
//                         <img 
//                           src={photo.image} 
//                           alt={photo.title}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             // Fallback to gradient if image fails to load
//                             e.currentTarget.style.display = 'none';
//                             e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/30', 'flex', 'items-center', 'justify-center');
//                             const fallbackIcon = document.createElement('div');
//                             fallbackIcon.innerHTML = '<svg class="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
//                             e.currentTarget.parentElement!.appendChild(fallbackIcon);
//                           }}
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
//                           <Eye className="w-6 h-6 text-white" />
//                         </div>
//                       </div>
//                       <div className="p-3">
//                         <h4 className="font-medium text-sm line-clamp-2 mb-1">{photo.title}</h4>
//                         <div className="flex justify-between items-center">
//                           <p className="text-xs text-muted-foreground">{photo.year}</p>
//                           <p className="text-xs text-muted-foreground">{photo.views} {language === 'fr' ? 'vues' : 'views'}</p>
//                         </div>
//                         <div className="flex gap-1 mt-2">
//                           <Button 
//                             size="sm" 
//                             variant="ghost" 
//                             className="flex-1 h-7 text-xs"
//                             onClick={() => handleView(photo, 'photo')}
//                           >
//                             <Eye className="w-3 h-3 mr-1" />
//                             {content[language].actions.view}
//                           </Button>
//                           <Button 
//                             size="sm" 
//                             variant="ghost" 
//                             className="flex-1 h-7 text-xs"
//                             onClick={() => handleDownload(photo.title)}
//                           >
//                             <Download className="w-3 h-3 mr-1" />
//                             {content[language].actions.download}
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* Videos Section */}
//             <div>
//               <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
//                 <Play className="w-6 h-6" />
//                 {content[language].videos.title}
//               </h3>
//               <div className="space-y-4">
//                 {content[language].videos.items.map((video, index) => (
//                   <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-4">
//                         <div className="w-20 h-16 relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
//                           <img 
//                             src={video.thumbnail}
//                             alt={video.title}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.currentTarget.style.display = 'none';
//                               e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/30', 'flex', 'items-center', 'justify-center');
//                             }}
//                           />
//                           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//                             <Play className="w-4 h-4 text-white fill-current" />
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-medium text-sm mb-1">{video.title}</h4>
//                           <div className="flex justify-between items-center mb-2">
//                             <p className="text-xs text-muted-foreground">{video.duration}</p>
//                             <p className="text-xs text-muted-foreground">{video.views} {language === 'fr' ? 'vues' : 'views'}</p>
//                           </div>
//                           <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-3">
//                         <Button 
//                           size="sm" 
//                           className="flex-1"
//                           onClick={() => handleWatch(video)}
//                         >
//                           <Play className="w-3 h-3 mr-1" />
//                           {content[language].actions.watch}
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="outline"
//                           onClick={() => handleView(video, 'video')}
//                         >
//                           <Eye className="w-3 h-3 mr-1" />
//                           {content[language].actions.view}
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Media Viewer Modal */}
//           {selectedMedia && (
//             <Modal
//               open={!!selectedMedia}
//               onOpenChange={(open) => !open && setSelectedMedia(null)}
//               trigger={<div />}
//               title={selectedMedia.title}
//             >
//               <div className="space-y-4">
//                 <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/30 rounded-lg flex items-center justify-center overflow-hidden">
//                   {selectedMedia.type === 'photo' && selectedMedia.image ? (
//                     <img 
//                       src={selectedMedia.image} 
//                       alt={selectedMedia.title}
//                       className="w-full h-full object-cover rounded-lg"
//                       onError={(e) => {
//                         e.currentTarget.style.display = 'none';
//                         const fallback = e.currentTarget.nextElementSibling as HTMLElement;
//                         if (fallback) fallback.style.display = 'flex';
//                       }}
//                     />
//                   ) : selectedMedia.type === 'video' && selectedMedia.youtubeId ? (
//                     <iframe
//                       width="100%"
//                       height="100%"
//                       src={`https://www.youtube.com/embed/${selectedMedia.youtubeId}`}
//                       title={selectedMedia.title}
//                       frameBorder="0"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                       allowFullScreen
//                       className="rounded-lg"
//                     ></iframe>
//                   ) : null}
//                   <div className="w-full h-full flex items-center justify-center" style={{ display: (selectedMedia.type === 'photo' && selectedMedia.image) || (selectedMedia.type === 'video' && selectedMedia.youtubeId) ? 'none' : 'flex' }}>
//                     {selectedMedia.type === 'photo' ? (
//                       <ImageIcon className="w-16 h-16 text-primary/60" />
//                     ) : (
//                       <Play className="w-16 h-16 text-primary fill-current" />
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="font-semibold mb-2">{selectedMedia.title}</h4>
//                   <p className="text-muted-foreground mb-2">{selectedMedia.description}</p>
//                   <div className="flex justify-between text-sm text-muted-foreground">
//                     <span>{selectedMedia.year || selectedMedia.duration}</span>
//                     <span>{selectedMedia.views} {language === 'fr' ? 'vues' : 'views'}</span>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-2">
//                   {selectedMedia.type === 'video' && selectedMedia.youtubeId && (
//                     <Button onClick={() => handleWatch(selectedMedia)} className="flex-1">
//                       <ExternalLink className="w-4 h-4 mr-2" />
//                       {content[language].actions.fullscreen}
//                     </Button>
//                   )}
//                   {selectedMedia.type === 'photo' && (
//                     <Button onClick={() => handleDownload(selectedMedia.title)} className="flex-1">
//                       <Download className="w-4 h-4 mr-2" />
//                       {content[language].actions.download}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Modal>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Gallery;
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Image as ImageIcon, ExternalLink, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';

// Import imagesconference-opening
import Session from '../../public/assets/session.jpg';
import Aya from '../../public/assets/Logo.png';
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
    image: string;
  };

  type VideoItem = {
    title: string;
    duration: string;
    description: string;
    views: number;
    youtubeId?: string;
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
            image: Aya
          },
          {
            title: 'Posters et démonstrations',
            year: '2023',
            description: 'Session poster interactive avec démonstrations technologiques.',
            views: 756
            //image: postersDemoImg
          },
          {
            title: 'Networking et pause café',
            year: '2023',
            description: 'Moments d\'échange et de networking entre participants.',
            views: 634
            //image: networkingImg
          },
          {
            title: 'Remise des prix',
            year: '2023',
            description: 'Cérémonie de remise des prix pour les meilleurs articles.',
            views: 543
            //image: awardsImg
          },
          {
            title: 'Gala de clôture',
            year: '2023',
            description: 'Événement festif de clôture de la conférence.',
            views: 789
            //image: closingGalaImg
          }
        ]
      },
      videos: {
        title: 'Vidéos',
        items: [
          {
            title: 'Résumé SITE 2023',
            duration: '5:30',
            description: 'Résumé vidéo des moments forts de SITE 2023.',
            views: 2340
          },
          {
            title: 'Keynote Dr. Sarah Johnson',
            duration: '45:20',
            description: 'Conférence plénière sur l\'avenir de l\'IA dans l\'industrie.',
            views: 1876
          },
          {
            title: 'Table ronde industrie 4.0',
            duration: '32:15',
            description: 'Discussion entre experts sur les défis de l\'industrie 4.0.',
            views: 1456
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
            title: 'SITE 2023 Opening Ceremony',
            year: '2023',
            description: 'Official conference opening moment with inaugural speeches.',
            views: 1250,
            image: Session
          },
          {
            title: 'Technical Sessions',
            year: '2023',
            description: 'Research presentations and technical debates between experts.',
            views: 890,
            image: Aya
          },
          {
            title: 'Posters and Demonstrations',
            year: '2023',
            description: 'Interactive poster session with technology demonstrations.',
            views: 756
            //image: postersDemoImg
          },
          {
            title: 'Networking and Coffee Break',
            year: '2023',
            description: 'Exchange and networking moments between participants.',
            views: 634
            //image: networkingImg
          },
          {
            title: 'Award Ceremony',
            year: '2023',
            description: 'Award ceremony for the best papers.',
            views: 543
            //image: awardsImg
          },
          {
            title: 'Closing Gala',
            year: '2023',
            description: 'Festive conference closing event.',
            views: 789
            //image: closingGalaImg
          }
        ]
      },
      videos: {
        title: 'Videos',
        items: [
          {
            title: 'SITE 2023 Summary',
            duration: '5:30',
            description: 'Video summary of SITE 2023 highlights.',
            views: 2340,
            youtubeId: 'dQw4w9WgXcQ',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
          },
          {
            title: 'Keynote Dr. Sarah Johnson',
            duration: '45:20',
            description: 'Plenary lecture on the future of AI in industry.',
            views: 1876
          },
          {
            title: 'Industry 4.0 Panel',
            duration: '32:15',
            description: 'Expert discussion on Industry 4.0 challenges.',
            views: 1456
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

  const handleDownload = (title: string) => {
    toast({
      title: language === 'fr' ? 'Téléchargement' : 'Download',
      description: language === 'fr' ? 'Le téléchargement va commencer...' : 'Download will start...',
    });
  };
    const handleWatch = (video: VideoItem & { youtubeId?: string }) => {
    if (video.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank');
    }
  };
 
  const handleView = (item: PhotoItem | VideoItem, type: 'photo' | 'video') => {
    setSelectedMedia({ ...item, type } as SelectedMedia);
  };

  //const handleWatch = (title: string) => {
    //toast({
     // title: language === 'fr' ? 'Vidéo' : 'Video',
      //description: language === 'fr' ? 'Redirection vers le lecteur vidéo...' : 'Redirecting to video player...',
   // });
 // };

 // const handleView = (item: PhotoItem | VideoItem, type: 'photo' | 'video') => {
   // setSelectedMedia({ ...item, type } as SelectedMedia);
 // };

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
                  <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-accent/30', 'flex', 'items-center', 'justify-center');
                            const fallbackIcon = document.createElement('div');
                            fallbackIcon.innerHTML = '<svg class="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                            e.currentTarget.parentElement!.appendChild(fallbackIcon);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
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
                           // onClick={() => handleView(photo, 'photo')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {content[language].actions.view}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleDownload(photo.title)}
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
                  <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-16 bg-gradient-to-br from-primary/20 to-accent/30 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative">
                          <Play className="w-6 h-6 text-primary fill-current" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg"></div>
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
                          onClick={() => handleWatch(video.title)}
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
                          onClick={() => handleDownload(video.title)}
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
                  ) : selectedMedia.type === 'video' && selectedMedia.youtubeId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedMedia.youtubeId}`}
                      title={selectedMedia.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center" style={{ display: (selectedMedia.type === 'photo' && selectedMedia.image) || (selectedMedia.type === 'video' && selectedMedia.youtubeId) ? 'none' : 'flex' }}>
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
                  {selectedMedia.type === 'video' && selectedMedia.youtubeId && (
                    <Button onClick={() => handleWatch(selectedMedia)} className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {content[language].actions.fullscreen}
                    </Button>
                  )}
                  {selectedMedia.type === 'photo' && (
                    <Button onClick={() => handleDownload(selectedMedia.title)} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      {content[language].actions.download}
                    </Button>)}
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