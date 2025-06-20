import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Calendar, Award, Star } from 'lucide-react';

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

  // Fonction pour filtrer les partenaires par type
  const getPartnersByType = (type: string): Partner[] => {
    return partners.filter(partner => partner.type === type);
  };

  // Fonction pour déterminer les classes CSS de la grille selon le nombre d'éléments
  const getGridClasses = (count: number): string => {
    if (count === 1) {
      return "flex justify-center";
    } else if (count === 2) {
      return "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto";
    } else if (count === 3) {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto";
    } else if (count === 4) {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto";
    } else if (count <= 6) {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
    } else {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
    }
  };

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
      categories: [
        {
          title: 'Partenaires Institutionnels',
          type: 'Institutionnels',
          icon: Building2,
          description: 'Organismes publics et institutions gouvernementales',
          gradient: 'from-blue-500 to-cyan-600',
          bgGradient: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600'
        },
        {
          title: 'Partenaires Industriels & Technologiques',
          type: 'Industriels & Technologiques',
          icon: Award,
          description: 'Entreprises leaders dans l\'innovation technologique',
          gradient: 'from-emerald-500 to-teal-600',
          bgGradient: 'from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600'
        },
        {
          title: 'Centres de Recherche & Innovation',
          type: 'Centres de Recherche & Innovation',
          icon: Users,
          description: 'Laboratoires et centres de recherche avancée',
          gradient: 'from-purple-500 to-pink-600',
          bgGradient: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600'
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
      categories: [
        {
          title: 'Institutional Partners',
          type: 'Institutionnels',
          icon: Building2,
          description: 'Public organizations and government institutions',
          gradient: 'from-blue-500 to-cyan-600',
          bgGradient: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600'
        },
        {
          title: 'Industry & Technology Partners',
          type: 'Industriels & Technologiques',
          icon: Award,
          description: 'Leading companies in technological innovation',
          gradient: 'from-emerald-500 to-teal-600',
          bgGradient: 'from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600'
        },
        {
          title: 'Research & Innovation Centers',
          type: 'Centres de Recherche & Innovation',
          icon: Users,
          description: 'Advanced research laboratories and centers',
          gradient: 'from-purple-500 to-pink-600',
          bgGradient: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          accentColor: 'text-purple-600'
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
    <>
      {/* Section Organisateurs */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50" id='organizers'>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* En-tête de section Organisateurs */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
                {content[language].organizersTitle}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {content[language].organizersSubtitle}
              </p>
            </div>

            {/* Logos des organisateurs */}
            <div className="flex justify-center items-center gap-16 mb-16">
              {content[language].organizersLogos.map((organizer, index) => (
                <div 
                  key={index}
                  className="group relative"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  {/* Effet de fond décoratif */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                  
                  {/* Conteneur principal */}
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500">
                    {/* Décoration d'angle */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    {/* Conteneur du logo */}
                    <div className="relative w-48 h-32 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                      <div className="relative w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center p-6 group-hover:shadow-2xl transition-shadow duration-300">
                        <img 
                          src={organizer.image}
                          alt={organizer.alt}
                          className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Nom de l'organisme */}
                    <h3 className="text-2xl font-bold text-slate-800 text-center mt-8 group-hover:text-purple-600 transition-colors duration-300">
                      {organizer.name}
                    </h3>
                    
                    {/* Barre de progression animée */}
                    <div className="w-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-4 rounded-full group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Séparateur décoratif */}
            <div className="flex justify-center items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <div className="mx-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Partenaires - Affichage groupé */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" id='partners'>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* En-tête de section */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
                {content[language].title}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {content[language].subtitle}
              </p>
            </div>
            
            {/* Affichage des catégories */}
            <div className="space-y-20">
              {content[language].categories.map((category, categoryIndex) => {
                const categoryPartners = getPartnersByType(category.type);
                const IconComponent = category.icon;
                
                // Ne pas afficher la catégorie si elle n'a pas de partenaires
                if (categoryPartners.length === 0) return null;

                return (
                  <div 
                    key={category.type}
                    className="relative"
                    style={{ 
                      animationDelay: `${categoryIndex * 300}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    {/* En-tête de catégorie */}
                    <div className={`bg-gradient-to-r ${category.bgGradient} rounded-3xl p-8 mb-12 border ${category.borderColor} shadow-lg`}>
                      <div className="flex items-center justify-center mb-6">
                        <div className={`w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mr-6 shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                          <h3 className={`text-3xl md:text-4xl font-bold ${category.accentColor} mb-2`}>
                            {category.title}
                          </h3>
                          <p className="text-slate-600 text-lg max-w-2xl">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Compteur de partenaires */}
                      <div className="text-center">
                        <span className={`inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-lg font-semibold ${category.accentColor} shadow-md`}>
                          <Star className="w-5 h-5 mr-2" />
                          {categoryPartners.length} {language === 'fr' ? 'partenaire(s)' : 'partner(s)'}
                        </span>
                      </div>
                    </div>

                    {/* Grille de partenaires */}
                    <div className={getGridClasses(categoryPartners.length)}>
                      {categoryPartners.map((partner, partnerIndex) => (
                        <Card 
                          key={partner.id} 
                          className={`group bg-white/90 backdrop-blur-sm border-2 ${category.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden transform hover:scale-105 hover:-translate-y-2`}
                          style={{ 
                            animationDelay: `${(categoryIndex * 300) + (partnerIndex * 100)}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          <CardContent className="p-8 text-center relative">
                            {/* Accent décoratif */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} rounded-t-2xl`}></div>
                            
                            {/* Conteneur du logo */}
                            <div className="relative w-24 h-24 mx-auto mb-6">
                              <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300`}></div>
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

                            {/* Nom du partenaire */}
                            <h4 className={`font-bold text-slate-800 text-lg group-hover:${category.accentColor} transition-colors duration-300 leading-tight`}>
                              {language === 'fr' ? partner.name_fr : partner.name_en}
                            </h4>
                            
                            {/* Barre de progression animée avec couleur de catégorie */}
                            <div className={`w-0 h-1 bg-gradient-to-r ${category.gradient} mx-auto mt-4 rounded-full group-hover:w-full transition-all duration-500`}></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Séparateur entre catégories (sauf pour la dernière) */}
                    {categoryIndex < content[language].categories.filter(cat => getPartnersByType(cat.type).length > 0).length - 1 && (
                      <div className="flex justify-center items-center mt-16">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                        <div className={`mx-8 w-8 h-8 bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Vérification si aucune catégorie n'a de partenaires */}
            {content[language].categories.every(cat => getPartnersByType(cat.type).length === 0) && (
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
      `}</style>
    </>
  );
};

export default Partners;