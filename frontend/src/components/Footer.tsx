
import React from 'react';

interface FooterProps {
  language: 'fr' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const content = {
    fr: {
      copyright: '© 2024 SITE 2025. Tous droits réservés.',
      organizedBy: 'Organisé par ISET Bizerte',
      links: [
        { label: 'Politique de confidentialité', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    en: {
      copyright: '© 2024 SITE 2025. All rights reserved.',
      organizedBy: 'Organized by ISET Bizerte',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Legal Notice', href: '#' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">S</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">SITE 2025</h3>
                  <p className="text-sm opacity-80">Smart Industry, Technology & Environment</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                {content[language].organizedBy}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">
                {language === 'fr' ? 'Liens rapides' : 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                {content[language].links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">
                {language === 'fr' ? 'Dates importantes' : 'Important Dates'}
              </h4>
              <div className="space-y-2 text-sm opacity-80">
                <div>{language === 'fr' ? 'Soumission: 15 Février' : 'Submission: February 15'}</div>
                <div>{language === 'fr' ? 'Conférence: 15-17 Mai' : 'Conference: May 15-17'}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-sm opacity-80">
              {content[language].copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
