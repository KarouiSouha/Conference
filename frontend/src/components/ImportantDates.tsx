import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Download, ExternalLink, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImportantDate {
  id: number;
  event_fr: string;
  event_en: string;
  date: string;
  end_date: string | null;
  description_fr: string | null;
  description_en: string | null;
  created_at: string;
  updated_at: string;
}

interface ImportantDatesProps {
  language: 'fr' | 'en';
}

// Modal Component Mock (à remplacer par votre composant Modal réel)
const Modal = ({ trigger, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

const ImportantDates: React.FC<ImportantDatesProps> = ({ language }) => {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mock data pour la démonstration
  const mockDates: ImportantDate[] = React.useMemo(() => [
    {
      id: 1,
      event_fr: "Soumission des résumés",
      event_en: "Abstract Submission",
      date: "2024-03-15",
      end_date: null,
      description_fr: "Date limite pour soumettre vos résumés de communication",
      description_en: "Deadline for submitting your paper abstracts",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
    {
      id: 2,
      event_fr: "Notification d'acceptation",
      event_en: "Acceptance Notification",
      date: "2024-04-20",
      end_date: null,
      description_fr: "Les auteurs seront notifiés de l'acceptation de leurs soumissions",
      description_en: "Authors will be notified of their submission acceptance",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
    {
      id: 3,
      event_fr: "Inscription précoce",
      event_en: "Early Registration",
      date: "2024-05-01",
      end_date: "2024-05-31",
      description_fr: "Période d'inscription avec tarif réduit",
      description_en: "Registration period with reduced fees",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
    {
      id: 4,
      event_fr: "Article complet",
      event_en: "Full Paper Submission",
      date: "2024-06-15",
      end_date: null,
      description_fr: "Soumission des articles complets pour publication",
      description_en: "Full paper submission for publication",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
    {
      id: 5,
      event_fr: "Conférence principale",
      event_en: "Main Conference",
      date: "2024-09-15",
      end_date: "2024-09-17",
      description_fr: "Événement principal de la conférence",
      description_en: "Main conference event",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    }
  ], []);

  // Fonction pour formater la date avec support des plages de dates
  const formatDate = (startDateString: string, endDateString: string | null, lang: 'fr' | 'en'): string => {
    const startDate = new Date(startDateString);
    
    if (isNaN(startDate.getTime())) {
      return 'Date invalide';
    }
    
    if (!endDateString || endDateString === 'NULL' || endDateString.trim() === '') {
      const singleDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', singleDateOptions);
    }
    
    const endDate = new Date(endDateString);
    
    if (isNaN(endDate.getTime())) {
      const singleDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', singleDateOptions);
    }
    
    const sameMonth = startDate.getMonth() === endDate.getMonth() && 
                     startDate.getFullYear() === endDate.getFullYear();
    
    if (sameMonth) {
      if (lang === 'fr') {
        const day1 = startDate.getDate();
        const day2 = endDate.getDate();
        const month = startDate.toLocaleDateString('fr-FR', { month: 'long' });
        const year = startDate.getFullYear();
        return `${day1}-${day2} ${month} ${year}`;
      } else {
        const month = startDate.toLocaleDateString('en-US', { month: 'long' });
        const day1 = startDate.getDate();
        const day2 = endDate.getDate();
        const year = startDate.getFullYear();
        return `${month} ${day1}-${day2}, ${year}`;
      }
    } else {
      const startOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long'
      };
      const endOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      
      const startFormatted = startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', startOptions);
      const endFormatted = endDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', endOptions);
      
      return `${startFormatted} - ${endFormatted}`;
    }
  };

  // Fonction pour déterminer l'action basée sur le contenu de l'événement
  const getActionType = (eventText: string): string => {
    const lowerEvent = eventText.toLowerCase();
    
    if (lowerEvent.includes('soumission') || lowerEvent.includes('submission')) {
      return 'deadline';
    }
    if (lowerEvent.includes('notification') || lowerEvent.includes('acceptation')) {
      return 'notification';
    }
    if (lowerEvent.includes('inscription') || lowerEvent.includes('registration')) {
      return 'register';
    }
    if (lowerEvent.includes('article complet') || lowerEvent.includes('full paper')) {
      return 'final';
    }
    if (lowerEvent.includes('conférence') || lowerEvent.includes('conference')) {
      return 'conference';
    }
    
    return 'default';
  };

  // Mock toast function
  const toast = ({ title, description, variant }) => {
    console.log(`Toast: ${title} - ${description}`);
  };

  // Simulation du chargement des données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDates(mockDates);
      setLoading(false);
    }, 1000);
  }, [language, mockDates]);

  // Gestion du responsive pour le nombre d'éléments affichés
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const staticContent = {
    fr: {
      title: 'Dates Importantes',
      actions: {
        submit: 'Soumettre un résumé',
        register: 'S\'inscrire maintenant',
        download: 'Télécharger le guide',
        more: 'En savoir plus',
        viewProgram: 'Voir le programme'
      },
      loading: 'Chargement...',
      noData: 'Aucune date importante disponible',
      dateLabel: 'Date:'
    },
    en: {
      title: 'Important Dates',
      actions: {
        submit: 'Submit Abstract',
        register: 'Register Now',
        download: 'Download Guide',
        more: 'Learn More',
        viewProgram: 'View Program'
      },
      loading: 'Loading...',
      noData: 'No important dates available',
      dateLabel: 'Date:'
    }
  };

  const handleAction = (action: string) => {
    console.log("handleAction appelé avec:", action);
    switch (action) {
      case 'submit':
        window.open('https://cmt3.research.microsoft.com/User/Login?ReturnUrl=%2FConference%2FRecent', '_blank');
        break;
      case 'register': {
        const element = document.getElementById('registration');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'deadline':
      case 'notification':
      case 'final':
        toast({
          title: language === 'fr' ? 'Information' : 'Information',
          description: language === 'fr' 
            ? 'Plus d\'informations seront disponibles prochainement.' 
            : 'More information will be available soon.',
          variant: 'default',
        });
        break;
      case 'conference': {
        const programElement = document.getElementById('program');
        if (programElement) {
          programElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
    }
  };

  const downloadGuide = async () => {
    try {
      const response = await fetch('/assets/Template_SITE2023.pdf');
      if (!response.ok) throw new Error('Fichier non trouvé');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_SITE2023.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: language === 'fr' ? 'Téléchargement' : 'Download',
        description: language === 'fr' 
          ? 'Téléchargement du guide en cours...' 
          : 'Downloading the guide...',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Le guide n\'a pas pu être téléchargé.' 
          : 'The guide could not be downloaded.',
        variant: 'destructive',
      });
    }
  };

  // Navigation du carousel
  const nextSlide = () => {
    const maxIndex = Math.max(0, dates.length - itemsPerView);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < dates.length - itemsPerView;

  // Affichage du loader
  if (loading) {
    return (
      <section id="dates" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
              {staticContent[language].title}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">{staticContent[language].loading}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Affichage en cas d'erreur ou de données vides
  if (error || dates.length === 0) {
    return (
      <section id="dates" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
              {staticContent[language].title}
            </h2>
            <p className="text-muted-foreground">
              {error || staticContent[language].noData}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {staticContent[language].title}
          </h2>
          
          <div className="relative">
            {/* Boutons de navigation */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={!canGoPrev}
                className="rounded-full shadow-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={!canGoNext}
                className="rounded-full shadow-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Carousel container */}
            <div className="overflow-hidden" ref={carouselRef}>
              <div 
                className="flex transition-transform duration-300 ease-in-out gap-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  width: `${(dates.length / itemsPerView) * 100}%`
                }}
              >
                {dates.map((item) => {
                  const event = language === 'fr' ? item.event_fr : item.event_en;
                  const description = language === 'fr' ? item.description_fr : item.description_en;
                  const formattedDate = formatDate(item.date, item.end_date, language);
                  const actionType = getActionType(event);
                  
                  return (
                    <div 
                      key={item.id} 
                      className="flex-shrink-0"
                      style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                    >
                      <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                        <CardContent className="p-6 h-full flex flex-col">
                          <div className="flex items-center gap-4 mb-3">
                            <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {event}
                              </h3>
                              <p className="text-muted-foreground text-sm">{formattedDate}</p>
                            </div>
                          </div>
                          
                          {description && (
                            <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
                          )}
                          
                          <div className="flex gap-2 mt-auto">
                            {actionType === 'register' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleAction(actionType)}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {staticContent[language].actions.register}
                              </Button>
                            )}
                            
                            {actionType === 'conference' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleAction(actionType)}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {staticContent[language].actions.viewProgram}
                              </Button>
                            )}
                            
                            <Modal
                              trigger={
                                <Button variant="outline" size="sm">
                                  {staticContent[language].actions.more}
                                </Button>
                              }
                              title={event}
                            >
                              <div className="space-y-4">
                                <p><strong>{staticContent[language].dateLabel}</strong> {formattedDate}</p>
                                {description && <p>{description}</p>}
                                
                                {actionType === 'deadline' && (
                                  <div className="space-y-2">
                                    <Button onClick={() => handleAction('submit')} className="w-full">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      {staticContent[language].actions.submit}
                                    </Button>
                                    <Button variant="outline" onClick={downloadGuide} className="w-full">
                                      <Download className="w-4 h-4 mr-2" />
                                      {staticContent[language].actions.download}
                                    </Button>
                                  </div>
                                )}
                                
                                {actionType === 'register' && (
                                  <Button onClick={() => handleAction('register')} className="w-full">
                                    {staticContent[language].actions.register}
                                  </Button>
                                )}
                                
                                {actionType === 'conference' && (
                                  <Button onClick={() => handleAction('conference')} className="w-full">
                                    {staticContent[language].actions.viewProgram}
                                  </Button>
                                )}
                              </div>
                            </Modal>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Indicateurs de pagination */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(dates.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsPerView) === index 
                      ? 'bg-primary' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;