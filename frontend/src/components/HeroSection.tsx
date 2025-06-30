import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, FileText, Clock, X, Download, AlertCircle } from 'lucide-react';

interface HeroSectionProps {
  language?: 'fr' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language = 'fr' }) => {
  const [conferenceTimeLeft, setConferenceTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [submissionTimeLeft, setSubmissionTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const conferenceDate = new Date('2025-10-24T08:00:00');
    const submissionDate = new Date('2025-07-30T23:59:59');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      
      const conferenceDistance = conferenceDate.getTime() - now;
      if (conferenceDistance > 0) {
        setConferenceTimeLeft({
          days: Math.floor(conferenceDistance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((conferenceDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((conferenceDistance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((conferenceDistance % (1000 * 60)) / 1000)
        });
      }

      const submissionDistance = submissionDate.getTime() - now;
      if (submissionDistance > 0) {
        setSubmissionTimeLeft({
          days: Math.floor(submissionDistance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((submissionDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((submissionDistance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((submissionDistance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      conferenceCountdown: 'Début de la conférence',
      submissionCountdown: 'Date limite de soumission',
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
      conferenceCountdown: 'Conference Starts In',
      submissionCountdown: 'Submission Deadline',
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

  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  const AdvancedCountdownCard = ({ title, timeLeft, icon: Icon, isUrgent = false }: { 
    title: string, 
    timeLeft: TimeLeft, 
    icon: React.ElementType,
    isUrgent?: boolean 
  }) => (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${
        isUrgent ? 'from-red-600 to-red-400' : 'from-blue-600 to-purple-600'
      } rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
      
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r ${
            isUrgent ? 'from-red-400/20 to-red-600/20' : 'from-blue-400/20 to-purple-600/20'
          } rounded-full absolute -top-12 sm:-top-16 -right-12 sm:-right-16 animate-pulse`}></div>
          <div className={`w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r ${
            isUrgent ? 'from-red-600/10 to-red-400/10' : 'from-purple-400/10 to-blue-600/10'
          } rounded-full absolute -bottom-8 sm:-bottom-12 -left-8 sm:-left-12 animate-pulse`} style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${
              isUrgent ? 'from-red-500 to-red-600' : 'from-blue-500 to-purple-600'
            } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold ${
              isUrgent ? 'text-red-700' : 'text-blue-700'
            } text-center leading-tight`}>
              {title}
            </h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { value: timeLeft.days, label: content[language].days },
              { value: timeLeft.hours, label: content[language].hours },
              { value: timeLeft.minutes, label: content[language].minutes },
              { value: timeLeft.seconds, label: content[language].seconds }
            ].map((item, index) => (
              <div key={index} className="text-center group/item">
                <div className={`relative bg-gradient-to-br ${
                  isUrgent ? 'from-red-50 to-red-100' : 'from-blue-50 to-purple-100'
                } p-3 sm:p-4 rounded-xl border-2 ${
                  isUrgent ? 'border-red-200' : 'border-blue-200'
                } shadow-lg hover:shadow-xl transition-all duration-300 group-hover/item:scale-105 overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-pulse group-hover/item:translate-x-full transition-transform duration-1000"></div>
                  <div className={`relative text-xl sm:text-3xl font-bold ${
                    isUrgent ? 'text-red-600' : 'text-blue-600'
                  } mb-1 font-mono tracking-wider`}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className={`text-xs font-medium uppercase tracking-wide ${
                    isUrgent ? 'text-red-500' : 'text-blue-500'
                  } opacity-80`}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section id="home" className="relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 mt-8 sm:mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-primary text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-sm sm:text-base">{currentContent.news}</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1">
                {currentContent.newsItems.map((item, index) => (
                  <div key={index} className="opacity-90">{item}</div>
                ))}
              </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary mb-3 sm:mb-4">
                {currentContent.title}
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl text-slate-700 mb-4 sm:mb-6 font-medium">
                {currentContent.subtitle}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
                {currentContent.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-primary/20">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">{currentContent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-primary/20">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">{currentContent.location}</span>
              </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <AdvancedCountdownCard 
                title={currentContent.submissionCountdown}
                timeLeft={submissionTimeLeft}
                icon={AlertCircle}
                isUrgent={true}
              />
              <AdvancedCountdownCard 
                title={currentContent.conferenceCountdown}
                timeLeft={conferenceTimeLeft}
                icon={Calendar}
                isUrgent={false}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('registration')} 
                className="px-6 sm:px-8 shadow-lg bg-primary hover:bg-primary/90 text-white text-sm sm:text-base"
              >
                {currentContent.register}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={openCallForPapers} 
                className="px-6 sm:px-8 shadow-lg border-primary text-primary hover:bg-primary/10 text-sm sm:text-base"
              >
                <FileText className="w-4 h-4 mr-2" />
                {currentContent.callForPapers}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('program')} 
                className="px-6 sm:px-8 shadow-lg border-primary text-primary hover:bg-primary/10 text-sm sm:text-base"
              >
                {currentContent.program}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 sm:h-5/6 mx-4 flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                {currentContent.callForPapers}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPdf}
                  className="flex items-center gap-2 text-sm"
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
            <div className="flex-1 p-3 sm:p-4">
              <iframe
                src="/assets/Call-for-paper-SITE2025.pdf#toolbar=0&navpanes=0&scrollbar=0"
                className="w-full h-full border border-slate-200 rounded"
                title="Call for Papers PDF"
              >
                <p className="text-center text-slate-600 p-8">
                  {language === 'fr' 
                    ? 'Votre navigateur ne supporte pas l\'affichage des PDF.' 
                    : 'Your browser does not support PDF display.'}
                  <br />
                  <Button onClick={downloadPdf} className="mt-4 text-sm">
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