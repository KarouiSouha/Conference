'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Globe, Award, Loader2, QrCode, Linkedin, User, MapPin, Briefcase, Star } from 'lucide-react';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QRCode from 'qrcode';

interface Realisation {
  id: number;
  title_fr: string;
  title_en: string;
  pivot?: {
    title_fr: string;
  };
}

interface Theme {
  id: number;
  name_fr: string;
  name_en: string;
}

interface Speaker {
  id: number;
  name: string;
  job_fr: string;
  job_en: string;
  country_fr: string;
  country_en: string;
  description_fr: string;
  description_en: string;
  theme_id: number;
  theme?: Theme;
  realisations: Realisation[];
  email?: string;
  link?: string;
  image_path?: string;
}

interface SpeakersProps {
  language: 'fr' | 'en';
  apiBaseUrl?: string;
}

const Speakers: React.FC<SpeakersProps> = ({ 
  language, 
  apiBaseUrl = 'http://localhost:8000/api' 
}) => {
  const { toast } = useToast();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<{ [key: number]: string }>({});
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'snap',
    slides: {
      perView: 1,
      spacing: 12,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 16 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 20 },
      },
    },
  });

  const generateQRCode = async (speaker: Speaker) => {
    try {
      const url = speaker.link || "https://site-conf.com/";
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: isMobile ? 150 : 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      return qrDataUrl;
    } catch (error) {
      console.error('Erreur génération QR code:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/Speakers/all');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des speakers');
        }
        const data = await response.json();
        setSpeakers(data);

        const qrPromises = data.map(async (speaker: Speaker) => {
          const qrCode = await generateQRCode(speaker);
          return { id: speaker.id, qrCode };
        });

        const qrResults = await Promise.all(qrPromises);
        const qrCodesMap: { [key: number]: string } = {};
        qrResults.forEach(({ id, qrCode }) => {
          if (qrCode) {
            qrCodesMap[id] = qrCode;
          }
        });
        setQrCodes(qrCodesMap);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        toast({
          title: "Erreur",
          description: "Impossible de charger les speakers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, [apiBaseUrl, toast, isMobile]);

  const content = {
    fr: {
      title: 'Conférenciers Invités',
      subtitle: 'Des experts reconnus internationalement',
      actions: {
        contact: 'Contacter',
        qrCode: 'LinkedIn',
        bio: 'Biographie complète'
      },
      labels: {
        biography: 'Biographie',
        achievements: 'Réalisations',
        talk: 'Domaine d\'expertise',
        loading: 'Chargement des speakers...',
        error: 'Erreur lors du chargement',
        qrCodeTitle: 'Profil LinkedIn',
        qrCodeDesc: 'Scannez le QR code pour accéder au profil LinkedIn',
        qrCodeInstruction: 'Connectez-vous sur LinkedIn'
      }
    },
    en: {
      title: 'Keynote Speakers',
      subtitle: 'Internationally recognized experts',
      actions: {
        contact: 'Contact',
        qrCode: 'LinkedIn',
        bio: 'Full Biography'
      },
      labels: {
        biography: 'Biography',
        achievements: 'Achievements',
        talk: 'Area of Expertise',
        loading: 'Loading speakers...',
        error: 'Error loading speakers',
        qrCodeTitle: 'LinkedIn Profile',
        qrCodeDesc: 'Scan the QR code to access the LinkedIn profile',
        qrCodeInstruction: 'Connect on LinkedIn'
      }
    }
  };

  const handleContact = (speaker: Speaker) => {
    if (speaker.email) {
      window.location.href = `mailto:${speaker.email}`;
    } else {
      toast({
        title: "Information",
        description: "Email non disponible pour ce speaker",
        variant: "default",
      });
    }
  };

  const handleQRCodeClick = (speaker: Speaker) => {
    const url = speaker.link || `https://site-conf.com/`;
    window.open(url, '_blank');
  };

  const getSpeakerJob = (speaker: Speaker) => {
    return language === 'fr' ? speaker.job_fr : speaker.job_en;
  };

  const getSpeakerCountry = (speaker: Speaker) => {
    return language === 'fr' ? speaker.country_fr : speaker.country_en;
  };

  const getSpeakerDescription = (speaker: Speaker) => {
    return language === 'fr' ? speaker.description_fr : speaker.description_en;
  };

  const getSpeakerTheme = (speaker: Speaker) => {
    if (!speaker.theme) return '';
    return language === 'fr' ? speaker.theme.name_fr : speaker.theme.name_en;
  };

  const getRealisationTitle = (realisation: Realisation) => {
    if (realisation.pivot?.title_fr && language === 'fr') {
      return realisation.pivot.title_fr;
    }
    return language === 'fr' ? realisation.title_fr : realisation.title_en;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  if (loading) {
    return (
      <section id="speakers" className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin mr-2 text-primary" />
            <span className="text-base md:text-lg text-gray-600">{content[language].labels.loading}</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="speakers" className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <p className="text-base md:text-lg font-medium">{content[language].labels.error}: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (speakers.length === 0) {
    return (
      <section id="speakers" className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <p className="text-base md:text-lg text-gray-600">Aucun speaker disponible pour le moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="speakers" className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4 tracking-tight">
              {content[language].title}
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {content[language].subtitle}
            </p>
          </div>
          
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="keen-slider__slide">
                  <Card className="group relative mx-1 md:mx-2 overflow-hidden bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl md:rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-4 md:p-6 flex flex-col relative z-10">
                      {/* Image or Initials - Mobile optimized */}
                      <div className="relative w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6">
                        {speaker.image_path ? (
                          <img
                            src={`http://localhost:8000/storage/${speaker.image_path}`}
                            alt={speaker.name}
                            className="w-full h-full object-cover rounded-full border-2 md:border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                            <span className="text-lg md:text-3xl font-bold text-white">
                              {getInitials(speaker.name)}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-10 md:h-10 bg-green-500 rounded-full border-2 md:border-4 border-white flex items-center justify-center shadow-sm">
                          <Star className="w-2 h-2 md:w-4 md:h-4 text-white" fill="currentColor" />
                        </div>
                      </div>

                      <h3 className="font-bold text-base md:text-xl text-gray-900 mb-1 md:mb-2 tracking-tight text-center">
                        {speaker.name}
                      </h3>
                      <p className="text-primary font-semibold text-sm md:text-base mb-1 md:mb-2 text-center">
                        {getSpeakerJob(speaker)}
                      </p>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        {getSpeakerCountry(speaker)}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 italic mb-4 md:mb-6 text-center">
                        {getSpeakerTheme(speaker)}
                      </p>

                      <div className="space-y-2 md:space-y-3 mt-auto">
                        <Modal
                          trigger={
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-300 text-xs md:text-sm py-2 md:py-2.5"
                            >
                              {content[language].actions.bio}
                            </Button>
                          }
                          title=""
                        >
                          <div className="max-w-full">
                            {/* Header mobile optimized */}
                            <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-t-xl p-4 md:p-8 mb-4 md:mb-6 overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-primary/5 rounded-full transform translate-x-8 md:translate-x-16 -translate-y-8 md:-translate-y-16"></div>
                              
                              <div className="relative z-10 flex flex-col items-center gap-3 md:gap-6 text-center">
                                <div className="relative">
                                  {speaker.image_path ? (
                                    <img
                                      src={`http://localhost:8000/storage/${speaker.image_path}`}
                                      alt={speaker.name}
                                      className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl md:rounded-2xl border-2 md:border-4 border-white shadow-lg"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary to-primary/80 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                                      <span className="text-lg md:text-2xl font-bold text-white">
                                        {getInitials(speaker.name)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-2 md:border-4 border-white flex items-center justify-center">
                                    <Star className="w-2 h-2 md:w-3 md:h-3 text-white" fill="currentColor" />
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                                    {speaker.name}
                                  </h3>
                                  <div className="flex flex-col gap-2 mb-3 md:mb-4">
                                    <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm md:text-base">
                                      <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                                      <span>{getSpeakerJob(speaker)}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                      <span>{getSpeakerCountry(speaker)}</span>
                                    </div>
                                  </div>
                                  {getSpeakerTheme(speaker) && (
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
                                      <Globe className="w-3 h-3 md:w-4 md:h-4" />
                                      {getSpeakerTheme(speaker)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Content mobile optimized */}
                            <div className="px-4 md:px-8 pb-4 md:pb-8 space-y-4 md:space-y-8">
                              {getSpeakerDescription(speaker) && (
                                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm">
                                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-semibold text-gray-900">
                                      {content[language].labels.biography}
                                    </h4>
                                  </div>
                                  <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                      {getSpeakerDescription(speaker)}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {speaker.realisations && speaker.realisations.length > 0 && (
                                <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm">
                                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                      <Award className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-semibold text-gray-900">
                                      {content[language].labels.achievements}
                                    </h4>
                                  </div>
                                  <div className="grid gap-2 md:gap-3">
                                    {speaker.realisations.slice(0, isMobile ? 3 : undefined).map((realisation, index) => (
                                      <div 
                                        key={realisation.id} 
                                        className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border-l-4 border-primary hover:shadow-sm transition-shadow"
                                      >
                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <span className="text-primary font-bold text-xs md:text-sm">
                                            {index + 1}
                                          </span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-800 font-medium leading-relaxed text-sm md:text-base">
                                            {getRealisationTitle(realisation)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {isMobile && speaker.realisations.length > 3 && (
                                      <p className="text-xs text-gray-500 text-center mt-2">
                                        +{speaker.realisations.length - 3} autres réalisations
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {getSpeakerTheme(speaker) && (
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg md:rounded-xl p-4 md:p-6 border border-primary/20">
                                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-semibold text-gray-900">
                                      {content[language].labels.talk}
                                    </h4>
                                  </div>
                                  <p className="text-primary font-medium text-base md:text-lg italic pl-2 border-l-4 border-primary/30">
                                    {getSpeakerTheme(speaker)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Modal>

                        <div className="flex gap-1.5 md:gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact(speaker)}
                            className="flex-1 rounded-full border-gray-300 text-gray-900 hover:bg-gray-100 transition-all duration-300 text-xs md:text-sm py-2"
                            disabled={!speaker.email}
                          >
                            <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            {isMobile ? 'Email' : content[language].actions.contact}
                          </Button>
                          
                          <Modal
                            trigger={
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 transition-all duration-300 text-xs md:text-sm py-2"
                                disabled={!speaker.link}
                              >
                                <Linkedin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                {isMobile ? 'QR' : content[language].actions.qrCode}
                              </Button>
                            }
                            title=""
                          >
                            <div className="text-center space-y-4 md:space-y-6 py-2">
                              <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                  <Linkedin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="text-left">
                                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                                    {content[language].labels.qrCodeTitle}
                                  </h3>
                                  <p className="text-xs md:text-sm text-gray-600">{speaker.name}</p>
                                </div>
                              </div>

                              <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                                <p className="text-xs md:text-sm text-blue-800">
                                  {content[language].labels.qrCodeDesc}
                                </p>
                              </div>

                              <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-gray-100 shadow-sm">
                                {qrCodes[speaker.id] ? (
                                  <div className="flex flex-col items-center space-y-3 md:space-y-4">
                                    <img 
                                      src={qrCodes[speaker.id]} 
                                      alt={`QR Code LinkedIn pour ${speaker.name}`}
                                      className={`${isMobile ? 'w-32 h-32' : 'w-48 h-48'} cursor-pointer hover:scale-105 transition-transform duration-200 rounded-lg`}
                                      onClick={() => handleQRCodeClick(speaker)}
                                    />
                                    <div className="flex items-center space-x-2 text-blue-600">
                                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                                      <span className="text-xs md:text-sm font-medium">
                                        {content[language].labels.qrCodeInstruction}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`${isMobile ? 'w-32 h-32' : 'w-48 h-48'} bg-gray-50 flex items-center justify-center mx-auto rounded-lg`}>
                                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-600" />
                                  </div>
                                )}
                              </div>

                              {speaker.link && (
                                <div className="pt-2 border-t border-gray-100">
                                  <a 
                                    href={speaker.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium transition-colors"
                                  >
                                    <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>Ouvrir le profil LinkedIn</span>
                                    <ExternalLink className="w-2 h-2 md:w-3 md:h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </Modal>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {speakers.length > 1 && (
              <>
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-4 z-10 bg-white shadow-lg p-2 md:p-3 rounded-full hover:bg-gray-100 transition-all duration-300"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                </button>

                <button
                  onClick={() => instanceRef.current?.next()}
                  className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-4 z-10 bg-white shadow-lg p-2 md:p-3 rounded-full hover:bg-gray-100 transition-all duration-300"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;