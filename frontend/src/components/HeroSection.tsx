import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, FileText, Clock, X, Download } from 'lucide-react';

interface HeroSectionProps {
  language?: 'fr' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language = 'fr' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Gérer l'ouverture/fermeture du modal avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
      ],
      downloadPdf: 'Télécharger le PDF',
      closeModal: 'Fermer'
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
      ],
      downloadPdf: 'Download PDF',
      closeModal: 'Close'
    }
  };

  const currentContent = content[language] || content.fr;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCallForPapers = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = '/assets/Call-for-paper-SITE2025.pdf';
    link.download = 'call-for-papers-site-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <section id="home" className="relative pt-16 pb-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Bandeau actualités */}
            <div className="bg-primary text-white p-3 rounded-lg mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{currentContent.news}</span>
              </div>
              <div className="text-sm space-y-1">
                {currentContent.newsItems.map((item, index) => (
                  <div key={index} className="opacity-90">{item}</div>
                ))}
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
                {currentContent.title}
              </h1>
              <h2 className="text-xl md:text-2xl text-slate-700 mb-6 font-medium">
                {currentContent.subtitle}
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                {currentContent.description}
              </p>
            </div>

            {/* Informations principales */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-6 py-3 rounded-lg border border-primary/20">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{currentContent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-6 py-3 rounded-lg border border-primary/20">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">{currentContent.location}</span>
              </div>
            </div>

            {/* Compte à rebours */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
              <h3 className="text-xl font-semibold text-primary text-center mb-4">
                {currentContent.countdown}
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
                {currentContent.register}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={openCallForPapers} 
                className="px-8 shadow-lg border-primary text-primary hover:bg-primary/10"
              >
                <FileText className="w-4 h-4 mr-2" />
                {currentContent.callForPapers}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('program')} 
                className="px-8 shadow-lg border-primary text-primary hover:bg-primary/10"
              >
                {currentContent.program}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal PDF */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 mx-4 flex flex-col">
            {/* En-tête du modal */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">
                {currentContent.callForPapers}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPdf}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {content[language].downloadPdf}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Contenu du PDF - Masquer la barre d'outils */}
            <div className="flex-1 p-4">
              <iframe
                src="/assets/Call-for-paper-SITE2025.pdf#toolbar=0&navpanes=0&scrollbar=0"
                className="w-full h-full border border-slate-200 rounded"
                title="Call for Papers PDF"
              >
                <p className="text-center text-slate-600 p-8">
                  Votre navigateur ne supporte pas l'affichage des PDF. 
                  <br />
                  <Button onClick={downloadPdf} className="mt-4">
                    {currentContent.downloadPdf}
                  </Button>
                </p>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;