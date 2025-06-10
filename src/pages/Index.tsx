
import React, { useState } from 'react';
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
      
      {/* Admin Access Button (hidden in production) */}
      <button 
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 left-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition-colors"
      >
        Admin
      </button>
    </div>
  );
};

export default Index;
