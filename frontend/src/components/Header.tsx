import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';

interface HeaderProps {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu on selection
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
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-slate-200 h-20 lg:h-20">
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between w-full h-20">
          <div className="flex items-center">
            <img src="/assets/Logo.png" alt="Logo" className="w-24 sm:w-32 h-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-2">
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
                      className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
                    >
                      {item.label}
                    </button>

                    {isAfterHome && (
                      <div className="relative group">
                        <button className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                          {language === 'fr' ? 'Infos' : 'Info'}
                        </button>
                        <div className="absolute left-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg">
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

            <button
              onClick={() => scrollToSection('partners')}
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              {language === 'fr' ? 'Partenaires' : 'Partners'}
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
            >
              {language === 'fr' ? 'Contact' : 'Contact'}
            </button>
          </nav>

          {/* Desktop Language Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={language === 'fr' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setLanguage('fr');
              }}
              className={`flex items-center gap-1 text-xs sm:text-sm ${language === 'fr'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
            >
              <Globe className="w-4 h-4" />
              FR
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setLanguage('en');
              }}
              className={`flex items-center gap-1 text-xs sm:text-sm ${language === 'en'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
            >
              <Globe className="w-4 h-4" />
              EN
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden flex-col items-center justify-center w-full h-20 py-2">
          {/* Logo Row */}
          <div className="flex items-center mb-1">
            <img src="/assets/Logo.png" alt="Logo" className="w-16 h-auto" />
          </div>
          
          {/* Controls Row - Centered */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant={language === 'fr' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setLanguage('fr');
              }}
              className={`flex items-center gap-1 text-xs ${language === 'fr'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
            >
              <Globe className="w-3 h-3" />
              FR
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setLanguage('en');
              }}
              className={`flex items-center gap-1 text-xs ${language === 'en'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
            >
              <Globe className="w-3 h-3" />
              EN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ease-in-out transform z-[100] ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <nav className="flex flex-col py-4 px-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {navItems[language].map((item, index) => {
              const isAfterHome = index === 0 && item.id === 'home';
              return (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-4 py-4 text-base font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-md"
                  >
                    {item.label}
                  </button>
                  {isAfterHome && (
                    <div className="w-full pl-6">
                      <div className="px-4 py-2 text-sm font-semibold text-slate-700 bg-blue-50 rounded-md">
                        {language === 'fr' ? 'Infos' : 'Info'}
                      </div>
                      <div className="pl-4">
                        <button
                          onClick={() => scrollToSection('about')}
                          className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-md"
                        >
                          {language === 'fr' ? 'À propos' : 'About'}
                        </button>
                        <button
                          onClick={() => scrollToSection('practical-info')}
                          className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-md"
                        >
                          {language === 'fr' ? 'Infos pratiques' : 'Practical Info'}
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;