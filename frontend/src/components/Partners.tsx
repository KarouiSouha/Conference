import React, { useState, useEffect } from 'react';
import { Users, Calendar, Building2 } from 'lucide-react';
import Organizers from './Organizers';

interface Partner {
  id: number;
  name_fr: string;
  name_en: string;
  image: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface PartnersProps {
  language?: 'fr' | 'en';
}

const Partners: React.FC<PartnersProps> = ({ language = 'fr' }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les partenaires depuis l'API
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/Partners/all');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Partenaires récupérés:', data);
      setPartners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des partenaires');
      console.error('Erreur lors du fetch des partenaires:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Configuration du contenu multilingue
  const content = {
    fr: {
      organizersTitle: 'Organisateurs',
      organizersSubtitle: 'Institutions de référence qui orchestrent l\'innovation et l\'excellence académique',
      organizersLogos: [
        {
          name: 'ISET',
          image: '/assets/iset.jpg',
          alt: 'Institut Supérieur des Études Technologiques'
        },
        {
          name: 'ADT',
          image: '/assets/ADT.jpg',
          alt: 'Agence de Développement Technologique'
        }
      ],
      title: 'Nos Partenaires',
      subtitle: 'Des collaborations stratégiques qui renforcent notre écosystème d\'innovation',
      loading: 'Chargement des partenaires...',
      error: 'Erreur lors du chargement des partenaires',
      retry: 'Réessayer',
      noPartners: 'Aucun partenaire trouvé.'
    },
    en: {
      organizersTitle: 'Organizers',
      organizersSubtitle: 'Leading institutions orchestrating innovation and academic excellence',
      organizersLogos: [
        {
          name: 'ISET',
          image: '/assets/iset.jpg',
          alt: 'Higher Institute of Technological Studies'
        },
        {
          name: 'ADT',
          image: '/assets/ADT.jpg',
          alt: 'Technology Development Agency'
        }
      ],
      title: 'Our Partners',
      subtitle: 'Strategic collaborations that strengthen our innovation ecosystem',
      loading: 'Loading partners...',
      error: 'Error loading partners',
      retry: 'Retry',
      noPartners: 'No partners found.'
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" id='partners'>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-b-blue-400 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
              <p className="text-xl text-slate-600 font-medium">
                {content[language].loading}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-red-50 to-pink-50" id='partners'>
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center bg-white rounded-2xl shadow-xl p-12">
              <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {content[language].error}
              </h3>
              <p className="text-slate-600 mb-8">{error}</p>
              <button 
                onClick={fetchPartners}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {content[language].retry}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Section Organisateurs */}
      <Organizers language={language} variant="full" />

      {/* Section Partenaires avec défilement automatique */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" id='partners'>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
                {content[language].title}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                {content[language].subtitle}
              </p>
              
              {/* Statistique simple */}
              {partners.length > 0 && (
                <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-lg font-semibold text-blue-600 shadow-lg">
                  <Users className="w-5 h-5 mr-2" />
                  {partners.length} {language === 'fr' ? 'partenaires de confiance' : 'trusted partners'}
                </div>
              )}
            </div>
            
            {/* Défilement automatique des logos */}
            {partners.length > 0 ? (
              <div className="relative mb-16">
                {/* Conteneur principal du défilement */}
                <div className="overflow-hidden">
                  <div className="sliding-logos-container">
                    {/* Premier set de logos */}
                    <div className="sliding-logos-track">
                      {partners.map((partner, index) => (
                        <div 
                          key={`first-${partner.id}`}
                          className="sliding-logo-item group"
                        >
                          
                          {/* Conteneur du logo */}
                          <div className=" transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500 w-40 h-32 flex items-center justify-center">

                            
                            <img 
                              src={`http://localhost:8000/storage/${partner.image}`}
                              alt={`Logo ${language === 'fr' ? partner.name_fr : partner.name_en}`}
                              className="max-w-full max-h-full object-contain filter group-hover:brightness-110 group-hover:saturate-110 transition-all duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/storage/images/default-partner.png';
                                target.onerror = null;
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Deuxième set de logos (duplication pour le défilement continu) */}
                    <div className="sliding-logos-track">
                      {partners.map((partner, index) => (
                        <div 
                          key={`second-${partner.id}`}
                          className="sliding-logo-item group"
                        >
                    
                          
                          {/* Conteneur du logo */}
                          <div className=" transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500 w-40 h-32 flex items-center justify-center">

                            <img 
                              src={`http://localhost:8000/storage/${partner.image}`}
                              alt={`Logo ${language === 'fr' ? partner.name_fr : partner.name_en}`}
                              className="max-w-full max-h-full object-contain filter group-hover:brightness-110 group-hover:saturate-110 transition-all duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/storage/images/default-partner.png';
                                target.onerror = null;
                              }}
                            />

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
        
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-xl text-slate-500 font-medium">
                  {content[language].noPartners}
                </p>
              </div>
            )}

            {/* Section statistiques */}
            {partners.length > 0 && (
              <div className="mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                      {partners.length}+
                    </div>
                    <div className="text-slate-600 font-medium text-lg">
                      {language === 'fr' ? 'Partenaires' : 'Partners'}
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                      5+
                    </div>
                    <div className="text-slate-600 font-medium text-lg">
                      {language === 'fr' ? 'Secteurs' : 'Sectors'}
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                      15+
                    </div>
                    <div className="text-slate-600 font-medium text-lg">
                      {language === 'fr' ? 'Années d\'expérience' : 'Years of experience'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) skew(-12deg);
          }
          100% {
            transform: translateX(200%) skew(-12deg);
          }
        }
        
        .sliding-logos-container {
          display: flex;
          animation: slideLeft 30s linear infinite;
          width: fit-content;
        }
        
        .sliding-logos-track {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .sliding-logo-item {
          position: relative;
          flex-shrink: 0;
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out;
        }
        
        /* Pause l'animation au hover */
        .sliding-logos-container:hover {
          animation-play-state: paused;
        }
        
        /* Animation plus fluide pour les mobiles */
        @media (max-width: 768px) {
          .sliding-logos-container {
            animation-duration: 20s;
          }
        }
      `}</style>
    </>
  );
};

export default Partners;