import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Download, ExternalLink, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Toggle accordion item
  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Fonction pour formater la date avec support des plages de dates
  const formatDate = (startDateString: string, endDateString: string | null, lang: 'fr' | 'en'): string => {
    const startDate = new Date(startDateString);
    
    // Vérifier si startDate est valide
    if (isNaN(startDate.getTime())) {
      return 'Date invalide';
    }
    
    // Si pas de date de fin, afficher seulement la date de début
    if (!endDateString || endDateString === 'NULL' || endDateString.trim() === '') {
      const singleDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', singleDateOptions);
    }
    
    // Si il y a une date de fin
    const endDate = new Date(endDateString);
    
    // Vérifier si endDate est valide
    if (isNaN(endDate.getTime())) {
      // Si endDate est invalide, afficher seulement startDate
      const singleDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', singleDateOptions);
    }
    
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
        });
        break;
      case 'conference': {
        console.log("Case conference atteint");
        const programElement = document.getElementById('program');
        console.log("Element trouvé:", programElement);
        if (programElement) {
          console.log("Hello world");
          programElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log("Element avec id 'program' non trouvé, tentative avec délai...");
          // Essayer après un court délai
          setTimeout(() => {
            const delayedElement = document.getElementById('program');
            if (delayedElement) {
              console.log("Element trouvé après délai");
              delayedElement.scrollIntoView({ behavior: 'smooth' });
            } else {
              console.log("Element toujours non trouvé après délai");
              // Essayer d'autres IDs possibles
              const alternatives = ['programme', 'programs', 'conference-program', 'program-section'];
              for (const altId of alternatives) {
                const altElement = document.getElementById(altId);
                if (altElement) {
                  console.log(`Element trouvé avec l'ID alternatif: ${altId}`);
                  altElement.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
              }
              console.log("Aucun element programme trouvé");
            }
          }, 100);
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
          
          <div className="space-y-4">
            {dates.map((item) => {
              const event = language === 'fr' ? item.event_fr : item.event_en;
              const description = language === 'fr' ? item.description_fr : item.description_en;
              const formattedDate = formatDate(item.date, item.end_date, language);
              const actionType = getActionType(event);
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <Card 
                  key={item.id} 
                  className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* En-tête cliquable de l'accordéon */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <CardContent className="p-6 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                              {event}
                            </h3>
                            <p className="text-muted-foreground text-sm">{formattedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {isExpanded ? 'Réduire' : 'Détails'}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  
                  {/* Contenu pliable de l'accordéon */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="pl-12 space-y-4">
                        {description && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            {description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
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
                      </div>
                    </CardContent>
                  </div>
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