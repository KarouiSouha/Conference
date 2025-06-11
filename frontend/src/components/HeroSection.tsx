
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, FileText, Clock } from 'lucide-react';

interface HeroSectionProps {
  language: 'fr' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const conferenceDate = new Date('2025-10-24T08:00:00');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = conferenceDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const content = {
    fr: {
      title: 'Conférence SITE 2025',
      subtitle: 'Smart Industry, Technologie et Environnement',
      description: 'Rejoignez-nous du 24 au 26 octobre 2025 à Hammamet pour explorer les dernières innovations en industrie intelligente, technologie et environnement.',
      date: '24-26 Octobre 2025',
      location: 'Hammamet, Tunisie',
      register: 'S\'inscrire maintenant',
      callForPapers: 'Appel à communication',
      program: 'Voir le programme',
      countdown: 'Compte à rebours',
      days: 'Jours',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes',
      news: 'Actualités récentes',
      newsItems: [
        'Ouverture des soumissions - Date limite: 30 Juillet 2025',
        'Confirmation des conférenciers internationaux',
        'Partenariat officiel avec IEEE Tunisia Section'
      ]
    },
    en: {
      title: 'SITE 2025 Conference',
      subtitle: 'Smart Industry, Technology and Environment',
      description: 'Join us from October 24-26, 2025 at Hammamet to explore the latest innovations in smart industry, technology and environment.',
      date: 'October 24-26, 2025',
      location: 'Hammamet, Tunisia',
      register: 'Register Now',
      callForPapers: 'Call for Papers',
      program: 'View Program',
      countdown: 'Countdown',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      news: 'Recent News',
      newsItems: [
        'Submissions now open - Deadline: July 30, 2025',
        'International keynote speakers confirmed',
        'Official partnership with IEEE Tunisia Section'
      ]
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCallForPapers = () => {
    window.open('https://site-conf.com/call-for-papers', '_blank');
  };

  return (
    <section id="home" className="relative pt-16 pb-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 mt-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Bandeau actualités */}
          <div className="bg-primary text-white p-3 rounded-lg mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{content[language].news}</span>
            </div>
            <div className="text-sm space-y-1">
              {content[language].newsItems.map((item, index) => (
                <div key={index} className="opacity-90">{item}</div>
              ))}
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
              {content[language].title}
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-700 mb-6 font-medium">
              {content[language].subtitle}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {content[language].description}
            </p>
          </div>

          {/* Informations principales */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-primary bg-primary/10 px-6 py-3 rounded-lg border border-primary/20">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">{content[language].date}</span>
            </div>
            <div className="flex items-center gap-2 text-primary bg-primary/10 px-6 py-3 rounded-lg border border-primary/20">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{content[language].location}</span>
            </div>
          </div>

          {/* Compte à rebours */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
            <h3 className="text-xl font-semibold text-primary text-center mb-4">
              {content[language].countdown}
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                <div className="text-sm text-slate-600">{content[language].days}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-sm text-slate-600">{content[language].hours}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-sm text-slate-600">{content[language].minutes}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-sm text-slate-600">{content[language].seconds}</div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('registration')} 
              className="px-8 shadow-lg bg-primary hover:bg-primary/90 text-white"
            >
              {content[language].register}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={openCallForPapers} 
              className="px-8 shadow-lg border-primary text-primary hover:bg-primary/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              {content[language].callForPapers}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => scrollToSection('program')} 
              className="px-8 shadow-lg border-primary text-primary hover:bg-primary/10"
            >
              {content[language].program}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
