import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, FileText, Clock, X, Download, AlertCircle, Zap, Network, Cpu } from 'lucide-react';

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
  const particlesRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Gestion du modal
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

  // Suivi de la souris pour les effets 3D
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      closeModal: 'Fermer',
      timeline: {
        submission: 'Soumission des papiers',
        review: 'Période de révision',
        notification: 'Notification d\'acceptation',
        conference: 'Conférence SITE 2025',
        dates: {
          submission: '30 Juillet 2025',
          review: 'Août - Septembre 2025',
          notification: '15 Septembre 2025',
          conference: '24-26 Octobre 2025'
        }
      }
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
      closeModal: 'Close',
      timeline: {
        submission: 'Paper Submissions',
        review: 'Review Period',
        notification: 'Acceptance Notification',
        conference: 'SITE 2025 Conference',
        dates: {
          submission: 'July 30, 2025',
          review: 'August - September 2025',
          notification: 'September 15, 2025',
          conference: 'October 24-26, 2025'
        }
      }
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

  // Particules connectées animées
  const ParticleNetwork = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      direction: Math.random() * 360
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full">
          {/* Connexions entre particules */}
          {particles.map((particle, i) => 
            particles.slice(i + 1).map((otherParticle, j) => {
              const distance = Math.sqrt(
                Math.pow(particle.x - otherParticle.x, 2) + 
                Math.pow(particle.y - otherParticle.y, 2)
              );
              if (distance < 25) {
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={`${particle.x}%`}
                    y1={`${particle.y}%`}
                    x2={`${otherParticle.x}%`}
                    y2={`${otherParticle.y}%`}
                    stroke="url(#connectionGradient)"
                    strokeWidth="0.5"
                    opacity={0.6}
                    className="animate-pulse"
                  />
                );
              }
              return null;
            })
          )}
          
          {/* Particules */}
          {particles.map(particle => (
            <circle
              key={particle.id}
              cx={`${particle.x}%`}
              cy={`${particle.y}%`}
              r={particle.size}
              fill="url(#particleGradient)"
              className="animate-pulse"
              style={{
                animationDelay: `${particle.id * 0.1}s`,
                animationDuration: `${2 + particle.speed}s`
              }}
            />
          ))}
          
          <defs>
            <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };



  // Compteur avec effets visuels avancés
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
      {/* Effet de glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${
        isUrgent ? 'from-red-600 to-red-400' : 'from-blue-600 to-purple-600'
      } rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200`}></div>
      
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Particules de fond */}
        <div className="absolute inset-0">
          <div className={`w-32 h-32 bg-gradient-to-r ${
            isUrgent ? 'from-red-400/20 to-red-600/20' : 'from-blue-400/20 to-purple-600/20'
          } rounded-full absolute -top-16 -right-16 animate-pulse`}></div>
          <div className={`w-24 h-24 bg-gradient-to-r ${
            isUrgent ? 'from-red-600/10 to-red-400/10' : 'from-purple-400/10 to-blue-600/10'
          } rounded-full absolute -bottom-12 -left-12 animate-pulse`} style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Contenu */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${
              isUrgent ? 'from-red-500 to-red-600' : 'from-blue-500 to-purple-600'
            } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${
              isUrgent ? 'text-red-700' : 'text-blue-700'
            } text-center leading-tight`}>
              {title}
            </h3>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { value: timeLeft.days, label: content[language].days },
              { value: timeLeft.hours, label: content[language].hours },
              { value: timeLeft.minutes, label: content[language].minutes },
              { value: timeLeft.seconds, label: content[language].seconds }
            ].map((item, index) => (
              <div key={index} className="text-center group/item">
                <div className={`relative bg-gradient-to-br ${
                  isUrgent ? 'from-red-50 to-red-100' : 'from-blue-50 to-purple-100'
                } p-4 rounded-xl border-2 ${
                  isUrgent ? 'border-red-200' : 'border-blue-200'
                } shadow-lg hover:shadow-xl transition-all duration-300 group-hover/item:scale-105 overflow-hidden`}>
                  
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-pulse group-hover/item:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className={`relative text-3xl font-bold ${
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
      <section id="home" className="relative pt-16 pb-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 mt-12 overflow-hidden">
        {/* Fond avec particules animées */}
        <ParticleNetwork />
        
        {/* Overlay avec dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-slate-900/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Bandeau actualités modernisé */}
            <div className="bg-white/10 backdrop-blur-md text-white p-4 rounded-xl mb-8 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="animate-pulse">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="font-bold text-lg">{currentContent.news}</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {currentContent.newsItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm opacity-90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Titre principal avec animation 3D */}
            <div className="text-center mb-12">
              <div 
                className="transform-gpu transition-transform duration-300"
                style={{
                  transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight/2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth/2) * 0.01}deg)`
                }}
              >
                <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 mb-6 animate-pulse">
                  {currentContent.title}
                </h1>
                <h2 className="text-2xl md:text-3xl text-blue-100 mb-8 font-medium">
                  {currentContent.subtitle}
                </h2>
              </div>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed mb-8">
                {currentContent.description}
              </p>
            </div>

            {/* Informations principales avec icônes animées */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 text-white bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl border border-white/20 shadow-xl hover:scale-105 transition-all duration-300 group">
                <Calendar className="w-6 h-6 text-blue-400 group-hover:animate-spin" />
                <span className="font-bold text-lg">{currentContent.date}</span>
              </div>
              <div className="flex items-center gap-3 text-white bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl border border-white/20 shadow-xl hover:scale-105 transition-all duration-300 group">
                <MapPin className="w-6 h-6 text-purple-400 group-hover:animate-bounce" />
                <span className="font-bold text-lg">{currentContent.location}</span>
              </div>
            </div>



            {/* Comptes à rebours avancés */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
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

            {/* Boutons d'action modernisés */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('registration')} 
                className="px-10 py-4 text-lg shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <Cpu className="w-5 h-5 mr-2" />
                {currentContent.register}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={openCallForPapers} 
                className="px-10 py-4 text-lg shadow-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-2" />
                {currentContent.callForPapers}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('program')} 
                className="px-10 py-4 text-lg shadow-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <Network className="w-5 h-5 mr-2" />
                {currentContent.program}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal PDF amélioré */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-5/6 mx-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-bold text-slate-800">
                {currentContent.callForPapers}
              </h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPdf}
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                  {content[language].downloadPdf}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="p-2 hover:scale-105 transition-transform"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <iframe
                src="/assets/Call-for-paper-SITE2025.pdf#toolbar=0&navpanes=0&scrollbar=0"
                className="w-full h-full border border-slate-200 rounded-xl shadow-inner"
                title="Call for Papers PDF"
              >
                <div className="text-center text-slate-600 p-8 bg-slate-50 rounded-xl">
                  <p className="mb-4">Votre navigateur ne supporte pas l'affichage des PDF.</p>
                  <Button onClick={downloadPdf} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {currentContent.downloadPdf}
                  </Button>
                </div>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;