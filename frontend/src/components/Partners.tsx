import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Building2, Users, Calendar, Award } from 'lucide-react';

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
  const [currentCategory, setCurrentCategory] = useState(0);

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

  // Fonction pour naviguer entre les catégories
  const nextCategory = () => {
    const availableCategories = content[language].categories.filter(cat => 
      getPartnersByType(cat.type).length > 0
    );
    setCurrentCategory((prev) => (prev + 1) % availableCategories.length);
  };

  const prevCategory = () => {
    const availableCategories = content[language].categories.filter(cat => 
      getPartnersByType(cat.type).length > 0
    );
    setCurrentCategory((prev) => prev === 0 ? availableCategories.length - 1 : prev - 1);
  };

  // Fonction pour filtrer les partenaires par type
  const getPartnersByType = (type: string): Partner[] => {
    return partners.filter(partner => partner.type === type);
  };

  // Fonction pour déterminer les classes CSS de la grille selon le nombre d'éléments
  const getGridClasses = (count: number): string => {
    if (count === 1) {
      return "flex justify-center";
    } else if (count === 2) {
      return "grid grid-cols-2 gap-6 max-w-md mx-auto";
    } else if (count === 3) {
      return "grid grid-cols-3 gap-6 max-w-3xl mx-auto";
    } else if (count === 4) {
      return "grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto";
    } else if (count === 5) {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6";
    } else {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6";
    }
  };

  // Configuration du contenu multilingue
  const content = {
    fr: {
      title: 'Nos Partenaires',
      subtitle: 'Des collaborations stratégiques qui renforcent notre écosystème d\'innovation',
      categories: [
        {
          title: 'Partenaires Institutionnels',
          type: 'Institutionnels',
          icon: Building2,
          description: 'Organismes publics et institutions gouvernementales'
        },
        {
          title: 'Partenaires Industriels & Technologiques',
          type: 'Industriels & Technologiques',
          icon: Award,
          description: 'Entreprises leaders dans l\'innovation technologique'
        },
        {
          title: 'Centres de Recherche & Innovation',
          type: 'Centres de Recherche & Innovation',
          icon: Users,
          description: 'Laboratoires et centres de recherche avancée'
        }
      ],
      loading: 'Chargement des partenaires...',
      error: 'Erreur lors du chargement des partenaires',
      retry: 'Réessayer',
      noPartners: 'Aucun partenaire trouvé.',
      stats: {
        partners: 'Partenaires de Confiance',
        categories: 'Secteurs d\'Activité',
        years: 'Années d\'Expérience',
        collaboration: 'Collaboration Active'
      }
    },
    en: {
      title: 'Our Partners',
      subtitle: 'Strategic collaborations that strengthen our innovation ecosystem',
      categories: [
        {
          title: 'Institutional Partners',
          type: 'Institutionnels',
          icon: Building2,
          description: 'Public organizations and government institutions'
        },
        {
          title: 'Industry & Technology Partners',
          type: 'Industriels & Technologiques',
          icon: Award,
          description: 'Leading companies in technological innovation'
        },
        {
          title: 'Research & Innovation Centers',
          type: 'Centres de Recherche & Innovation',
          icon: Users,
          description: 'Advanced research laboratories and centers'
        }
      ],
      loading: 'Loading partners...',
      error: 'Error loading partners',
      retry: 'Retry',
      noPartners: 'No partners found.',
      stats: {
        partners: 'Trusted Partners',
        categories: 'Business Sectors',
        years: 'Years of Experience',
        collaboration: 'Active Collaboration'
      }
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
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" id='partners'>
      <div className="container mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* En-tête de section amélioré */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
              {content[language].title}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {content[language].subtitle}
            </p>
          </div>
          
          {/* Navigation et affichage des catégories */}
          {(() => {
            const availableCategories = content[language].categories.filter(cat => 
              getPartnersByType(cat.type).length > 0
            );
            
            if (availableCategories.length === 0) {
              return (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-xl text-slate-500 font-medium">
                    {content[language].noPartners}
                  </p>
                </div>
              );
            }

            const currentCat = availableCategories[currentCategory];
            const categoryPartners = getPartnersByType(currentCat.type);
            const IconComponent = currentCat.icon;

            return (
              <div className="relative">
                {/* Contrôles de navigation améliorés */}
                <div className="flex items-center justify-between mb-16">
                  {/* Flèche gauche */}
                  <button
                    onClick={prevCategory}
                    disabled={availableCategories.length <= 1}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transform hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </button>

                  {/* Titre de catégorie et indicateurs améliorés */}
                  <div className="text-center flex-1 px-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-3xl font-bold text-slate-800 mb-2">
                            {currentCat.title}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            {currentCat.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Indicateurs de pagination améliorés */}
                      {availableCategories.length > 1 && (
                        <div className="flex justify-center space-x-3 mt-6">
                          {availableCategories.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentCategory(index)}
                              className={`transition-all duration-300 rounded-full ${
                                index === currentCategory 
                                  ? 'w-10 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg' 
                                  : 'w-3 h-3 bg-slate-300 hover:bg-slate-400 hover:scale-125'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flèche droite */}
                  <button
                    onClick={nextCategory}
                    disabled={availableCategories.length <= 1}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transform hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                  </button>
                </div>

                {/* Grille de partenaires avec animations */}
                <div className={getGridClasses(categoryPartners.length)}>
                  {categoryPartners.map((partner, partnerIndex) => (
                    <Card 
                      key={partner.id} 
                      className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden transform hover:scale-105 hover:-translate-y-2"
                      style={{ 
                        animationDelay: `${partnerIndex * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <CardContent className="p-8 text-center">
                        {/* Conteneur du logo amélioré */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                          <div className="relative w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center p-3 group-hover:shadow-xl transition-shadow duration-300">
                            <img 
                              src={`http://localhost:8000/storage/${partner.image}`}
                              alt={`Logo ${language === 'fr' ? partner.name_fr : partner.name_en}`}
                              className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/storage/images/default-partner.png';
                                target.onerror = null;
                              }}
                            />
                          </div>
                        </div>

                        {/* Nom du partenaire amélioré */}
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          {language === 'fr' ? partner.name_fr : partner.name_en}
                        </h4>
                        
                        {/* Barre de progression animée */}
                        <div className="w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full group-hover:w-full transition-all duration-500"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Section statistiques améliorée */}
          {partners.length > 0 && (
            <div className="mt-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
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
                      {content[language].categories.filter(cat => getPartnersByType(cat.type).length > 0).length}
                    </div>
                    <div className="text-slate-600 font-medium text-lg">
                      {language === 'fr' ? 'Catégories' : 'Categories'}
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Partners;