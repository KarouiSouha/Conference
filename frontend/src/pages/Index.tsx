import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Partners from '@/components/Partners';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ImportantDates from '@/components/ImportantDates';
import Themes from '@/components/Themes';
import Speakers from '@/components/Speakers';
import Committee from '@/components/Committee';
import Program from '@/components/Program';
import Registration from '@/components/Registration';
import News from '@/components/News';
import Gallery from '@/components/Gallery';
import Archives from '@/components/Archives';
import PracticalInfo from '@/components/PracticalInfo';
import Contact from '@/components/Contact';
import AdminDashboard from '@/components/AdminDashboard';
import Footer from '@/components/Footer';

const Index = () => {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [showAdmin, setShowAdmin] = useState(false);
  const [keySequence, setKeySequence] = useState('');

  // Effet pour détecter la séquence de touches secrète
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = keySequence + event.key.toLowerCase();
      
      // Séquence secrète : "admin123"
      if (newSequence.includes('admin')) {
        setShowAdmin(true);
        setKeySequence('');
        console.log('Mode admin activé'); // Pour debug (à retirer en production)
      } else if (newSequence.length > 10) {
        // Reset si trop long
        setKeySequence('');
      } else {
        setKeySequence(newSequence);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  // Affichage de l'interface admin
  if (showAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Header language={language} setLanguage={setLanguage} />
        <AdminDashboard language={language} />
        <button 
          onClick={() => setShowAdmin(false)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          {language === 'fr' ? 'Retour au site' : 'Back to site'}
        </button>
      </div>
    );
  }

  // Affichage normal du site
  return (
    <div className="min-h-screen bg-white">
      <Header language={language} setLanguage={setLanguage} />
      <HeroSection language={language} />
      <AboutSection language={language} />
      <ImportantDates language={language} />
      <Themes language={language} />
      <Speakers language={language} />
      <Committee language={language} />
      <Program language={language} />
      <Registration language={language} />
      <News language={language} />
      <Gallery language={language} />
      <Archives language={language} />
      <PracticalInfo language={language} />
      <Partners language={language} />
      <Contact language={language} />
      <Footer language={language} />
      
      {/* Plus de bouton admin visible ! */}
    </div>
  );
};

export default Index;