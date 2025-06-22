'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Globe, Award, Loader2, QrCode } from 'lucide-react';
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
  website?: string;
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

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'snap',
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 16 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
  });

  // Générer le QR code pour un speaker
  const generateQRCode = async (speakerId: number) => {
    try {
      const url = "https://site-conf.com/";
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
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

  // Charger les speakers depuis l'API Laravel
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/Speakers/all');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des speakers');
        }
        const data = await response.json();
        setSpeakers(data);

        // Générer les QR codes pour tous les speakers
        const qrPromises = data.map(async (speaker: Speaker) => {
          const qrCode = await generateQRCode(speaker.id);
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
  }, [apiBaseUrl, toast]);

  const content = {
    fr: {
      title: 'Conférenciers Invités',
      subtitle: 'Des experts reconnus internationalement',
      actions: {
        contact: 'Contacter',
        qrCode: 'QR Code',
        bio: 'Biographie complète'
      },
      labels: {
        biography: 'Biographie',
        achievements: 'Réalisations',
        talk: 'Domaine d\'expertise',
        loading: 'Chargement des speakers...',
        error: 'Erreur lors du chargement',
        qrCodeTitle: 'Accès aux publications',
        qrCodeDesc: 'Scannez pour accéder aux publications de ce conférencier'
      }
    },
    en: {
      title: 'Keynote Speakers',
      subtitle: 'Internationally recognized experts',
      actions: {
        contact: 'Contact',
        qrCode: 'QR Code',
        bio: 'Full Biography'
      },
      labels: {
        biography: 'Biography',
        achievements: 'Achievements',
        talk: 'Area of Expertise',
        loading: 'Loading speakers...',
        error: 'Error loading speakers',
        qrCodeTitle: 'Access to Publications',
        qrCodeDesc: 'Scan to access this speaker\'s publications'
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

  const handleQRCodeClick = (speakerId: number) => {
    const url = `https://site-conf.com/`;
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

  if (loading) {
    return (
      <section id="speakers" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>{content[language].labels.loading}</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="speakers" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>{content[language].labels.error}: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (speakers.length === 0) {
    return (
      <section id="speakers" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Aucun speaker disponible pour le moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="speakers" className="py-20 bg-muted/30">
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
          
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {speakers.map((speaker, index) => (
                <div key={speaker.id} className="keen-slider__slide">
                  <Card className="text-center h-full mx-2">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {speaker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {speaker.name}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {getSpeakerJob(speaker)}
                      </p>
                      <p className="text-muted-foreground text-sm mb-2">
                        {getSpeakerCountry(speaker)}
                      </p>
                      <p className="text-sm text-muted-foreground italic mb-4">
                        {getSpeakerTheme(speaker)}
                      </p>

                      <div className="space-y-2 mt-auto">
                        <Modal
                          trigger={
                            <Button variant="outline" size="sm" className="w-full">
                              {content[language].actions.bio}
                            </Button>
                          }
                          title={speaker.name}
                        >
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">
                                  {speaker.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <h3 className="text-xl font-semibold">{speaker.name}</h3>
                              <p className="text-primary">{getSpeakerJob(speaker)}</p>
                              <p className="text-muted-foreground">{getSpeakerCountry(speaker)}</p>
                            </div>

                            {getSpeakerDescription(speaker) && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  {content[language].labels.biography}
                                </h4>
                                <p className="text-muted-foreground">{getSpeakerDescription(speaker)}</p>
                              </div>
                            )}

                            {speaker.realisations && speaker.realisations.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  {content[language].labels.achievements}
                                </h4>
                                <ul className="space-y-1">
                                  {speaker.realisations.map((realisation) => (
                                    <li key={realisation.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <Award className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                      {getRealisationTitle(realisation)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {getSpeakerTheme(speaker) && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  {content[language].labels.talk}
                                </h4>
                                <p className="text-muted-foreground italic">{getSpeakerTheme(speaker)}</p>
                              </div>
                            )}

                          
                          </div>
                        </Modal>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact(speaker)}
                            className="flex-1"
                            disabled={!speaker.email}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            {content[language].actions.contact}
                          </Button>
                          
                          {/* Modal QR Code compacte */}
                          <Modal
                            trigger={
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <QrCode className="w-3 h-3 mr-1" />
                                {content[language].actions.qrCode}
                              </Button>
                            }
                            title={content[language].labels.qrCodeTitle}
                          >
                            <div className="text-center space-y-4">
                              <p className="text-sm text-muted-foreground">
                                {content[language].labels.qrCodeDesc}
                              </p>
                              {qrCodes[speaker.id] ? (
                                <div className="flex justify-center">
                                  <img 
                                    src={qrCodes[speaker.id]} 
                                    alt={`QR Code pour ${speaker.name}`}
                                    className="w-48 h-48 border rounded cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => handleQRCodeClick(speaker.id)}
                                  />
                                </div>
                              ) : (
                                <div className="w-48 h-48 bg-muted flex items-center justify-center mx-auto">
                                  <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Cliquez sur le QR code pour ouvrir le lien
                              </p>
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
                  className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>

                <button
                  onClick={() => instanceRef.current?.next()}
                  className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
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