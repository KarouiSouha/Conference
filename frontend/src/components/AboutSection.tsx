import React from 'react';

interface AboutSectionProps {
  language: 'fr' | 'en';
}

const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const content = {
    fr: {
      title: 'À propos de SITE 2025',
      description: 'La conférence SITE 2025 rassemble chercheurs, industriels et experts pour échanger sur les dernières avancées en industrie intelligente, technologie et environnement. Organisée par l\'ISET de Bizerte en association avec ADT, cette conférence vise à promouvoir l\'innovation et la collaboration dans ces domaines cruciaux.',
      objectives: [
        'Promouvoir la recherche en industrie intelligente',
        'Favoriser les échanges entre académiques et industriels',
        'Présenter les technologies émergentes',
        'Aborder les défis environnementaux contemporains'
      ],
      videoPath: 'asset/videos/vidFR'
    },
    en: {
      title: 'About SITE 2025',
      description: 'The SITE 2025 conference brings together researchers, industry professionals and experts to exchange ideas on the latest advances in smart industry, technology and environment. Organized by ISET Bizerte in association with ADT, this conference aims to promote innovation and collaboration in these crucial fields.',
      objectives: [
        'Promote research in smart industry',
        'Foster exchanges between academics and industry',
        'Present emerging technologies',
        'Address contemporary environmental challenges'
      ],
      videoPath: 'asset/videos/vidEN'
    }
  };

  return (
    <section id="about" className="py-8 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-primary mb-8 md:mb-12">
            {content[language].title}
          </h2>

          {/* Video Section */}
          <div className="mb-8 md:mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-1">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  key={language}
                  className="w-full h-auto max-h-[200px] md:max-h-[400px] object-cover"
                  controls
                  preload="metadata"
                  poster={`${content[language].videoPath}-poster.jpg`}
                >
                  <source src={`${content[language].videoPath}.mp4`} type="video/mp4" />
                  <source src={`${content[language].videoPath}.webm`} type="video/webm" />
                  {language === 'fr'
                    ? 'Votre navigateur ne supporte pas la lecture de vidéos.'
                    : 'Your browser does not support video playback.'
                  }
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-12 items-start">
            {/* Description */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-8">
                  {content[language].description}
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 pt-4 md:pt-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="text-xl md:text-2xl font-bold text-primary mb-1">2025</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Édition' : 'Edition'}
                  </div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="text-xl md:text-2xl font-bold text-primary mb-1">ISET</div>
                  <div className="text-sm text-muted-foreground">Bizerte & ADT</div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-primary">
                  {language === 'fr' ? 'Objectifs' : 'Objectives'}
                </h3>
              </div>

              <div className="space-y-4">
                {content[language].objectives.map((objective, index) => (
                  <div key={index} className="group flex items-start gap-4 p-4 rounded-lg bg-card hover:bg-primary/5 transition-colors duration-200 border border-transparent hover:border-primary/20">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-primary/10 group-hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-200">
                        <div className="w-2 h-2 bg-primary group-hover:bg-white rounded-full transition-colors duration-200"></div>
                      </div>
                    </div>
                    <span className="text-base md:text-muted-foreground group-hover:text-foreground transition-colors duration-200 leading-relaxed">
                      {objective}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;