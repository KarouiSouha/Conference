import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Download, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';

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

const ImportantDates: React.FC<ImportantDatesProps> = ({ language }) => {
  const { toast } = useToast();
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour formater la date avec support des plages de dates
  const formatDate = (startDateString: string, endDateString: string | null, lang: 'fr' | 'en'): string => {
    const startDate = new Date(startDateString);
    
    if (endDateString) {
      const endDate = new Date(endDateString);
      
      // Vérifier si les dates sont dans le même mois et la même année
      const sameMonth = startDate.getMonth() === endDate.getMonth() && 
                       startDate.getFullYear() === endDate.getFullYear();
      
      if (sameMonth) {
        // Format: "24-26 octobre 2025" ou "October 24-26, 2025"
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
        // Dates dans des mois différents
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
    }
    
    // Une seule date
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', options);
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

  // Appel API pour récupérer les dates
  useEffect(() => {
    const fetchImportantDates = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/dates');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ImportantDate[] = await response.json();
        setDates(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des dates importantes:', err);
        setError(language === 'fr' 
          ? 'Erreur lors du chargement des dates importantes' 
          : 'Error loading important dates'
        );
        
        toast({
          title: language === 'fr' ? 'Erreur' : 'Error',
          description: language === 'fr' 
            ? 'Impossible de charger les dates importantes' 
            : 'Unable to load important dates',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImportantDates();
  }, [language, toast]);

  const staticContent = {
    fr: {
      title: 'Dates Importantes',
      actions: {
        submit: 'Soumettre un résumé',
        register: 'S\'inscrire maintenant',
        download: 'Télécharger le guide',
        more: 'En savoir plus'
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
        more: 'Learn More'
      },
      loading: 'Loading...',
      noData: 'No important dates available',
      dateLabel: 'Date:'
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'submit':
        window.open('https://site-conf.com/call-for-papers', '_blank');
        break;
      case 'register':
        const element = document.getElementById('registration');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'deadline':
      case 'notification':
      case 'final':
        toast({
          title: language === 'fr' ? 'Information' : 'Information',
          description: language === 'fr' 
            ? 'Plus d\'informations seront disponibles prochainement.' 
            : 'More information will be available soon.',
        });
        break;
      case 'conference':
        const programElement = document.getElementById('program');
        if (programElement) {
          programElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
  };

  const downloadGuide = () => {
    toast({
      title: language === 'fr' ? 'Téléchargement' : 'Download',
      description: language === 'fr' 
        ? 'Le guide sera disponible prochainement.' 
        : 'The guide will be available soon.',
    });
  };

  // Affichage du loader
  if (loading) {
    return (
      <section id="dates" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
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
          <div className="max-w-4xl mx-auto text-center">
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {staticContent[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {dates.map((item) => {
              const event = language === 'fr' ? item.event_fr : item.event_en;
              const description = language === 'fr' ? item.description_fr : item.description_en;
              const formattedDate = formatDate(item.date, item.end_date, language);
              const actionType = getActionType(event);
              
              return (
                <Card key={item.id} className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {event}
                        </h3>
                        <p className="text-muted-foreground">{formattedDate}</p>
                      </div>
                    </div>
                    
                    {description && (
                      <p className="text-sm text-muted-foreground mb-4">{description}</p>
                    )}
                    
                    <div className="flex gap-2">
                      {(actionType === 'register' || actionType === 'conference') && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAction(actionType)}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {actionType === 'register' 
                            ? staticContent[language].actions.register 
                            : staticContent[language].actions.more}
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
                        </div>
                      </Modal>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;