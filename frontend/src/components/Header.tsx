import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu } from 'lucide-react';

interface HeaderProps {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = {
    fr: [
      { label: 'Accueil', id: 'home' },
      { label: 'À propos', id: 'about' },
      { label: 'Dates', id: 'dates' },
      { label: 'Thèmes', id: 'themes' },
      { label: 'Intervenants', id: 'speakers' },
      { label: 'Comité', id: 'committee' },
      { label: 'Programme', id: 'program' },
      { label: 'Inscription', id: 'registration' },
      { label: 'Actualités', id: 'news' },
      { label: 'Galerie', id: 'gallery' },
      { label: 'Archives', id: 'archives' },
      { label: 'Infos pratiques', id: 'practical-info' },
      { label: 'Partenaires', id: 'partners' },
      { label: 'Contact', id: 'contact' }
    ],
    en: [
      { label: 'Home', id: 'home' },
      { label: 'About', id: 'about' },
      { label: 'Dates', id: 'dates' },
      { label: 'Themes', id: 'themes' },
      { label: 'Speakers', id: 'speakers' },
      { label: 'Committee', id: 'committee' },
      { label: 'Program', id: 'program' },
      { label: 'Registration', id: 'registration' },
      { label: 'News', id: 'news' },
      { label: 'Gallery', id: 'gallery' },
      { label: 'Archives', id: 'archives' },
      { label: 'Practical Info', id: 'practical-info' },
      { label: 'Partners', id: 'partners' },
      { label: 'Contact', id: 'contact' }
    ]
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-slate-200 h-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div>
              <div className="text-white font-bold text-xl">
                <div className="flex flex-col items-center leading-none">
                  <img src="/assets/Logo.png" alt="Logo" className="w-40 h-40" />
                </div>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1 relative">
            {navItems[language]
              .filter(
                (item) =>
                  item.id !== 'about' &&
                  item.id !== 'practical-info' &&
                  item.id !== 'contact' &&
                  item.id !== 'partners'
              )
              .map((item, index) => {
                const isAfterHome = index === 0 && item.id === 'home';
                return (
                  <React.Fragment key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
                    >
                      {item.label}
                    </button>

                    {isAfterHome && (
                      <div className="relative group">
                        <button className="text-sm text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                          {language === 'fr' ? 'Infos' : 'Info'}
                        </button>
                        <div className="absolute left-0 top-full pt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="bg-white border border-slate-200 rounded shadow-md">
                            <button
                              onClick={() => scrollToSection('about')}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded-t-md"
                            >
                              {language === 'fr' ? 'À propos' : 'About'}
                            </button>
                            <button
                              onClick={() => scrollToSection('practical-info')}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 rounded-b-md"
                            >
                              {language === 'fr' ? 'Infos pratiques' : 'Practical Info'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

            {/* Partners */}
            <button
              onClick={() => scrollToSection('partners')}
              className="text-sm text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              {language === 'fr' ? 'Partenaires' : 'Partners'}
            </button>

            {/* Contact */}
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              {language === 'fr' ? 'Contact' : 'Contact'}
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant={language === 'fr' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('fr')}
              className={`flex items-center gap-1 ${language === 'fr'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
            >
              <Globe className="w-3 h-3" />
              FR
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1 ${language === 'en'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
            >
              <Globe className="w-3 h-3" />
              EN
            </Button>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;