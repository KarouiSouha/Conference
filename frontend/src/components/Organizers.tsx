import React from 'react';

interface OrganizersProps {
  language?: 'fr' | 'en';
  variant?: 'full' | 'compact' | 'inline';
  showTitle?: boolean;
}

const Organizers: React.FC<OrganizersProps> = ({ 
  language = 'fr', 
  variant = 'full',
  showTitle = true 
}) => {
  // Configuration du contenu multilingue
  const content = {
    fr: {
      title: 'Organisateurs',
      subtitle: 'Cet événement est organisé par',
      organizers: [
        {
          name: 'ISETB',
          fullName: 'Institut Supérieur des Études Technologiques de Bizerte',
          description: 'Institution d\'enseignement supérieur spécialisée dans les technologies',
          image: '/asset/images/iset.jpg',
          website: 'https://www.isetb.tn'
        },
        {
          name: 'ADT',
          fullName: 'Association de Développement Technologique',
          description: 'Association dédiée au développement et à l\'innovation technologique',
          image: '/asset/images/ADT.jpg',
          website: 'https://www.adt.tn'
        }
      ]
    },
    en: {
      title: 'Organizers',
      subtitle: 'This event is organized by',
      organizers: [
        {
          name: 'ISETB',
          fullName: 'Higher Institute of Technological Studies of Bizerte',
          description: 'Higher education institution specialized in technology',
          image: '/assets/iset.jpg',
          website: 'https://www.isetb.tn'
        },
        {
          name: 'ADT',
          fullName: 'Technological Development Association',
          description: 'Association dedicated to technological development and innovation',
          image: '/assets/ADT.jpg',
          website: 'https://www.adt.tn'
        }
      ]
    }
  };

  // Variante complète (section autonome)
  if (variant === 'full') {
    return (
      <section className="py-16 bg-white" id='organizers'>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {showTitle && (
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                  {content[language].title}
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  {content[language].subtitle}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {content[language].organizers.map((organizer, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-lg border border-slate-200 p-8 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                >
                  {/* Logo */}
                  <div className="w-full h-24 mb-6 flex items-center justify-center">
                    <img 
                      src={organizer.image}
                      alt={organizer.fullName}
                      className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Nom complet */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
                    {organizer.fullName}
                  </h3>
                  
                  {/* Acronyme */}
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {organizer.name}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-slate-600 text-center leading-relaxed">
                    {organizer.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Variante compacte (pour Header ou Footer)
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center space-x-8">
        {content[language].organizers.map((organizer, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-12 mb-2 flex items-center justify-center">
              <img 
                src={organizer.image}
                alt={organizer.name}
                className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600">
              {organizer.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Variante inline (pour texte courant)
  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center space-x-4">
        <span className="text-slate-600">{content[language].subtitle}</span>
        <div className="flex items-center space-x-3">
          {content[language].organizers.map((organizer, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-6 flex items-center justify-center">
                  <img 
                    src={organizer.image}
                    alt={organizer.name}
                    className="max-w-full max-h-full object-contain opacity-90"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-semibold text-slate-800 text-sm">
                  {organizer.name}
                </span>
              </div>
              {index < content[language].organizers.length - 1 && (
                <span className="text-slate-400">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Organizers;