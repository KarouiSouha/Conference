import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
      return "grid grid-cols-2 gap-4 max-w-md mx-auto";
    } else if (count === 3) {
      return "grid grid-cols-3 gap-4 max-w-2xl mx-auto";
    } else if (count === 4) {
      return "grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto";
    } else if (count === 5) {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4";
    } else {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  // Configuration du contenu multilingue
  const content = {
    fr: {
      title: 'Partenaires',
      subtitle: 'Nous remercions nos partenaires pour leur soutien',
      categories: [
        {
          title: 'Partenaires Institutionnels',
          type: 'Institutionnels'
        },
        {
          title: 'Partenaires Industriels & Technologiques',
          type: 'Industriels & Technologiques'
        },
        {
          title: 'Centres de Recherche & Innovation',
          type: 'Centres de Recherche & Innovation'
        }
      ],
      loading: 'Chargement des partenaires...',
      error: 'Erreur lors du chargement des partenaires',
      stats: {
        partners: 'Partenaires de Confiance',
        categories: 'Secteurs d\'Activité',
        years: 'Années d\'Expérience',
        collaboration: 'Collaboration Active'
      }
    },
    en: {
      title: 'Partners',
      subtitle: 'We thank our partners for their support',
      categories: [
        {
          title: 'Institutional Partners',
          type: 'Institutionnels'
        },
        {
          title: 'Industry & Technology Partners',
          type: 'Industriels & Technologiques'
        },
        {
          title: 'Research & Innovation Centers',
          type: 'Centres de Recherche & Innovation'
        }
      ],
      loading: 'Loading partners...',
      error: 'Error loading partners',
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
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white" id='partners'>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">
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
      <section className="py-16 bg-background" id='partners'>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {content[language].error}
              </p>
              <button 
                onClick={fetchPartners}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background" id='partners'>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* En-tête de section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
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
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    {language === 'fr' ? 'Aucun partenaire trouvé.' : 'No partners found.'}
                  </p>
                </div>
              );
            }

            const currentCat = availableCategories[currentCategory];
            const categoryPartners = getPartnersByType(currentCat.type);

            return (
              <div className="relative">
                {/* Contrôles de navigation */}
                <div className="flex items-center justify-between mb-8">
                  {/* Flèche gauche */}
                  <button
                    onClick={prevCategory}
                    className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border"
                    disabled={availableCategories.length <= 1}
                  >
                    <svg 
                      className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Titre de catégorie et indicateurs */}
                  <div className="text-center flex-1">
                    <h3 className="text-2xl font-semibold text-primary mb-2">
                      {currentCat.title}
                    </h3>
                    <div className="w-16 h-0.5 bg-blue-500 mx-auto rounded-full"></div>
                    
                    {/* Indicateurs de pagination */}
                    {availableCategories.length > 1 && (
                      <div className="flex justify-center space-x-2 mt-4">
                        {availableCategories.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentCategory(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentCategory 
                                ? 'bg-blue-600' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Flèche droite */}
                  <button
                    onClick={nextCategory}
                    className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border"
                    disabled={availableCategories.length <= 1}
                  >
                    <svg 
                      className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Grille de partenaires adaptative */}
                <div className={getGridClasses(categoryPartners.length)}>
                  {categoryPartners.map((partner, partnerIndex) => (
                    <Card 
                      key={partner.id} 
                      className="text-center hover:shadow-md transition-shadow bg-white"
                    >
                      <CardContent className="p-4">
                        {/* Conteneur du logo */}
                        <div className="w-16 h-16 bg-gray-50 rounded-lg mx-auto mb-3 flex items-center justify-center border">
                          <img 
                            src={`http://localhost:8000/storage/${partner.image}`}
                            alt={`Logo ${language === 'fr' ? partner.name_fr : partner.name_en}`}
                            className="max-w-12 max-h-12 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/storage/images/default-partner.png';
                              target.onerror = null;
                            }}
                          />
                        </div>

                        {/* Nom du partenaire */}
                        <h4 className="font-medium text-foreground text-sm">
                          {language === 'fr' ? partner.name_fr : partner.name_en}
                        </h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Section statistiques */}
          {partners.length > 0 && (
            <div className="mt-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {partners.length}
                  </div>
                  <div className="text-muted-foreground">
                    {language === 'fr' ? 'Partenaires' : 'Partners'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {content[language].categories.filter(cat => getPartnersByType(cat.type).length > 0).length}
                  </div>
                  <div className="text-muted-foreground">
                    {language === 'fr' ? 'Catégories' : 'Categories'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    15+
                  </div>
                  <div className="text-muted-foreground">
                    {language === 'fr' ? 'Années d\'expérience' : 'Years of experience'}
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