import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';

interface ImportantDatesProps {
  language: 'fr' | 'en';
}

const ImportantDates: React.FC<ImportantDatesProps> = ({ language }) => {
  const { toast } = useToast();

  const content = {
    fr: {
      title: 'Dates Importantes',
      dates: [
        { 
          event: 'Date limite de soumission (Résumé étendu)', 
          date: '30 Juillet 2025',
          action: 'deadline',
          description: 'Date limite pour soumettre vos résumés étendus.'
        },
        { 
          event: 'Notification d\'acceptation', 
          date: '1er Septembre 2025',
          action: 'notification',
          description: 'Les auteurs recevront la notification d\'acceptation ou de refus de leur résumé étendu.'
        },
        { 
          event: 'Date limite d\'inscription', 
          date: '20 Septembre 2025',
          action: 'register',
          description: 'Date limite pour s\'inscrire à la conférence.'
        },
        { 
          event: 'Date limite de soumission de l\'article complet', 
          date: '1er Octobre 2025',
          action: 'final',
          description: 'Date limite pour soumettre la version complète des articles acceptés.'
        },
        { 
          event: 'La Conférence', 
          date: '24-26 Octobre 2025',
          action: 'conference',
          description: 'Trois jours de conférences, ateliers et networking.'
        }
      ],
      actions: {
        submit: 'Soumettre un résumé',
        register: 'S\'inscrire maintenant',
        download: 'Télécharger le guide',
        more: 'En savoir plus'
      }
    },
    en: {
      title: 'Important Dates',
      dates: [
        { 
          event: 'Submission Deadline (Extended abstract)', 
          date: 'July 30th, 2025',
          action: 'deadline',
          description: 'Final deadline for extended abstract submissions.'
        },
        { 
          event: 'Acceptance notification', 
          date: 'September 1st, 2025',
          action: 'notification',
          description: 'Authors will receive acceptance or rejection notification for their extended abstracts.'
        },
        { 
          event: 'Registration Deadline', 
          date: 'September 20th, 2025',
          action: 'register',
          description: 'Final deadline for conference registration.'
        },
        { 
          event: 'Full paper submission deadline', 
          date: 'October 1st, 2025',
          action: 'final',
          description: 'Deadline for submitting full papers of accepted abstracts.'
        },
        { 
          event: 'The Conference', 
          date: 'October 24-26, 2025',
          action: 'conference',
          description: 'Three days of conferences, workshops and networking.'
        }
      ],
      actions: {
        submit: 'Submit Abstract',
        register: 'Register Now',
        download: 'Download Guide',
        more: 'Learn More'
      }
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
          description: language === 'fr' ? 'Plus d\'informations seront disponibles prochainement.' : 'More information will be available soon.',
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
      description: language === 'fr' ? 'Le guide sera disponible prochainement.' : 'The guide will be available soon.',
    });
  };

  return (
    <section id="dates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {content[language].dates.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.event}
                      </h3>
                      <p className="text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="flex gap-2">
                    {(item.action === 'register' || item.action === 'conference') && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAction(item.action)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {item.action === 'register' ? content[language].actions.register : 
                         content[language].actions.more}
                      </Button>
                    )}
                    
                    <Modal
                      trigger={
                        <Button variant="outline" size="sm">
                          {content[language].actions.more}
                        </Button>
                      }
                      title={item.event}
                    >
                      <div className="space-y-4">
                        <p><strong>{language === 'fr' ? 'Date:' : 'Date:'}</strong> {item.date}</p>
                        <p>{item.description}</p>
                        
                        {item.action === 'deadline' && (
                          <div className="space-y-2">
                            <Button onClick={() => handleAction('submit')} className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {content[language].actions.submit}
                            </Button>
                            <Button variant="outline" onClick={downloadGuide} className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              {content[language].actions.download}
                            </Button>
                          </div>
                        )}
                        
                        {item.action === 'register' && (
                          <Button onClick={() => handleAction('register')} className="w-full">
                            {content[language].actions.register}
                          </Button>
                        )}
                      </div>
                    </Modal>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;