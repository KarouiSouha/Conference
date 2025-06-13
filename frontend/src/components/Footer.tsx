import React from 'react';
import { Facebook, Linkedin, Calendar, MapPin } from 'lucide-react';

interface FooterProps {
  language: 'fr' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const content = {
    fr: {
      copyright: '© 2024 SITE 2025. Tous droits réservés.',
      organizedBy: 'Organisé par ISET Bizerte',
      followUs: 'Suivez-nous',
      links: [
        { label: 'Politique de confidentialité', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    en: {
      copyright: '© 2024 SITE 2025. All rights reserved.',
      organizedBy: 'Organized by ISET Bizerte',
      followUs: 'Follow Us',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Legal Notice', href: '#' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  };

  return (
    <footer className="relative bg-primary text-primary-foreground py-10 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary to-primary/90"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main content grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-foreground rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-primary font-bold text-lg">S</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-foreground/30 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">SITE 2025</h3>
                  <p className="text-sm opacity-90 font-medium">Smart Industry, Technology & Environment</p>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-sm opacity-90">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{content[language].organizedBy}</span>
              </div>
            </div>
            
            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-base relative">
                {language === 'fr' ? 'Liens rapides' : 'Quick Links'}
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-foreground/50 rounded-full"></div>
              </h4>
              <ul className="space-y-2">
                {content[language].links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all duration-200 inline-block relative group"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <div className="absolute inset-0 bg-primary-foreground/10 rounded-md scale-0 group-hover:scale-100 transition-transform duration-200 -z-0"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Important dates */}
            <div className="space-y-4">
              <h4 className="font-semibold text-base relative flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Dates importantes' : 'Important Dates'}
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-foreground/50 rounded-full"></div>
              </h4>
              <div className="space-y-3">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 border-l-2 border-primary-foreground/30">
                  <div className="text-xs font-medium opacity-80 uppercase tracking-wide">
                    {language === 'fr' ? 'Soumission' : 'Submission'}
                  </div>
                  <div className="text-sm font-semibold">
                    {language ==='fr' ? '30 Juillet 2025' : 'July 30, 2025'}
                  </div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 border-l-2 border-primary-foreground/30">
                  <div className="text-xs font-medium opacity-80 uppercase tracking-wide">
                    {language === 'fr' ? 'Conférence' : 'Conference'}
                  </div>
                  <div className="text-sm font-semibold">
                    {language === 'fr' ? '24-26 Mai 2025' : 'May 24-26, 2025'}
                  </div>
                </div>
              </div>
            </div>

            {/* Social media */}
            <div className="space-y-4">
              <h4 className="font-semibold text-base relative">
                {content[language].followUs}
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary-foreground/50 rounded-full"></div>
              </h4>
              <div className="space-y-3">
                <p className="text-sm opacity-90">
                  {language === 'fr' 
                    ? 'Restez informés des dernières actualités' 
                    : 'Stay updated with the latest news'
                  }
                </p>
                <div className="flex space-x-3">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100090234982911"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 bg-primary-foreground/15 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-primary-foreground/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-foreground/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/smart-industry-technology-and-environment/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 bg-primary-foreground/15 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-primary-foreground/25 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-foreground/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"></div>
            <div className="pt-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p className="text-sm opacity-90">
                {content[language].copyright}
              </p>
              <div className="flex items-center space-x-2 text-sm opacity-75">
                <span>Made with ❤️</span>
                <span>for iset Bizerte</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;