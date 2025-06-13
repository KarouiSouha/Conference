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
      error: 'Erreur lors du chargement des partenaires'
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
      error: 'Error loading partners'
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <section className="py-20 bg-background" id='partners'>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
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
      <section className="py-20 bg-background" id='partners'>
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
    <section className="py-20 bg-background" id='partners'>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content[language].subtitle}
            </p>
          </div>
          
          <div className="space-y-8">
            {content[language].categories.map((category, index) => {
              const categoryPartners = getPartnersByType(category.type);
              
              // Ne pas afficher la catégorie si elle est vide
              if (categoryPartners.length === 0) {
                return null;
              }

              return (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-primary mb-4 text-center">
                    {category.title}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {categoryPartners.map((partner) => (
                      <Card key={partner.id} className="text-center hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border border-gray-200">
                            <img 
                              src={`http://localhost:8000/storage/${partner.image}`}
                              alt={`Logo ${language === 'fr' ? partner.name_fr : partner.name_en}`}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                // Fallback en cas d'erreur de chargement d'image
                                const target = e.target as HTMLImageElement;
                                target.src = '/storage/images/default-partner.png';
                                target.onerror = null; // Éviter la boucle infinie
                              }}
                            />
                          </div>
                          <h4 className="font-medium text-foreground text-sm">
                            {language === 'fr' ? partner.name_fr : partner.name_en}
                          </h4>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message si aucun partenaire n'est trouvé */}
          {partners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {language === 'fr' ? 'Aucun partenaire trouvé.' : 'No partners found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Partners;