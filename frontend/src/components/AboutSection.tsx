
import React from 'react';

interface AboutSectionProps {
  language: 'fr' | 'en';
}

const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const content = {
    fr: {
      title: 'À propos de SITE 2025',
      description: 'La conférence SITE 2025 rassemble chercheurs, industriels et experts pour échanger sur les dernières avancées en industrie intelligente, technologie et environnement. Organisée par l\'ISET de Bizerte, cette conférence vise à promouvoir l\'innovation et la collaboration dans ces domaines cruciaux.',
      objectives: [
        'Promouvoir la recherche en industrie intelligente',
        'Favoriser les échanges entre académiques et industriels',
        'Présenter les technologies émergentes',
        'Aborder les défis environnementaux contemporains'
      ]
    },
    en: {
      title: 'About SITE 2025',
      description: 'The SITE 2025 conference brings together researchers, industry professionals and experts to exchange ideas on the latest advances in smart industry, technology and environment. Organized by ISET Bizerte, this conference aims to promote innovation and collaboration in these crucial fields.',
      objectives: [
        'Promote research in smart industry',
        'Foster exchanges between academics and industry',
        'Present emerging technologies',
        'Address contemporary environmental challenges'
      ]
    }
  };

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
            {content[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {content[language].description}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                {language === 'fr' ? 'Objectifs' : 'Objectives'}
              </h3>
              <ul className="space-y-3">
                {content[language].objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
