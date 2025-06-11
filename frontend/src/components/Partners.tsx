import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PartnersProps {
  language?: 'fr' | 'en';
}

const Partners: React.FC<PartnersProps> = ({ language = 'fr' }) => {
  const partnerImages = {
    'Université Paris Nanterre': '/assets/paris-nanterre.png',
    'ENSIT': '/assets/ensit.jpeg',
    'ENIB': '/assets/enib.jpeg',
    'ESIM': '/assets/esim.png',
    'Université Mohamed Chérif': '/assets/mohamed-cherif.png',
    'LMPE - Laboratoire de Mécanique Productique et Énergétique': '/assets/lmpe.png',
    'AGROTECH 4.0 CENTER': '/assets/agrotech.png',
    'Green Engineering': '/assets/green-engineering.png',
    'TDS - Technology Development System': '/assets/tds.png',
    'RIFTSI': '/assets/riftsi.png',
    'LARATSI': '/assets/laratsi.jpeg',
    'ARK - Antenne de Recherche de Kasserine': '/assets/ark.png'
  };

  const content = {
    fr: {
      title: 'Partenaires',
      subtitle: 'Nous remercions nos partenaires pour leur soutien',
      categories: [
        {
          title: 'Partenaires Institutionnels',
          partners: ['Université Paris Nanterre', 'ENSIT', 'ENIB', 'ESIM', 'Université Mohamed Chérif']
        },
        {
          title: 'Partenaires Industriels & Technologiques',
          partners: ['LMPE - Laboratoire de Mécanique Productique et Énergétique','AGROTECH 4.0 CENTER', 'Green Engineering', 'TDS - Technology Development System']
        },
        {
          title: 'Centres de Recherche & Innovation',
          partners: ['RIFTSI', 'LARATSI','ARK - Antenne de Recherche de Kasserine']
        }
      ]
    },
    en: {
      title: 'Partners',
      subtitle: 'We thank our partners for their support',
      categories: [
        {
          title: 'Institutional Partners',
          partners: ['Université Paris Nanterre', 'ENSIT', 'ENIB', 'ESIM', 'Université Mohamed Chérif']
        },
        {
          title: 'Industry & Technology Partners',
          partners: ['LMPE - Laboratoire de Mécanique Productique et Énergétique','AGROTECH 4.0 CENTER', 'Green Engineering', 'TDS - Technology Development System']
        },
        {
          title: 'Research & Innovation Centers',
          partners: ['RIFTSI', 'LARATSI','ARK - Antenne de Recherche de Kasserine']
        }
      ]
    }
  };

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
            {content[language]?.categories?.map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold text-primary mb-4 text-center">
                  {category?.title}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {category?.partners?.map((partner, partnerIndex) => (
                    <Card key={partnerIndex} className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border border-gray-200">
                          <img 
                            src={partnerImages[partner as keyof typeof partnerImages]} 
                            alt={`Logo ${partner}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <h4 className="font-medium text-foreground text-sm">{partner}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;