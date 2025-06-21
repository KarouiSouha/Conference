import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Users, Calendar, Loader2, Award, Camera } from 'lucide-react';

interface Archive {
  id: number;
  event_name: string;
  subject_fr: string;
  subject_en: string;
  organizer: string;
  participants: number;
  articles: number;
  countries: number;
  photoGalleryLink: string;
  created_at: string;
  updated_at: string;
}

interface ArchivesProps {
  language?: 'fr' | 'en';
}

const Archives: React.FC<ArchivesProps> = ({ language = 'fr' }) => {
  const currentLanguage = language || 'fr';
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [actionStatus, setActionStatus] = useState<string>('');

  const content = {
    fr: {
      title: 'Archives & Publications Précédentes',
      subtitle: 'Consultez les actes et publications des éditions passées',
      stats: {
        participants: 'Participants',
        papers: 'Articles',
        countries: 'Pays'
      },
      actions: {
        bestPapers: 'Meilleurs Articles',
        photos: 'Galerie Photos'
      },
      loading: 'Chargement des archives...',
      error: 'Erreur lors du chargement des archives',
      noData: 'Aucune archive disponible'
    },
    en: {
      title: 'Archives & Previous Publications',
      subtitle: 'Browse proceedings and publications from past editions',
      stats: {
        participants: 'Participants',
        papers: 'Papers',
        countries: 'Countries'
      },
      actions: {
        bestPapers: 'Best Papers',
        photos: 'Photo Gallery'
      },
      loading: 'Loading archives...',
      error: 'Error loading archives',
      noData: 'No archives available'
    }
  };

  // Fonction pour récupérer les archives depuis l'API
  const fetchArchives = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8000/api/Archive/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Archive[] = await response.json();
      setArchives(data);
    } catch (err) {
      console.error('Error fetching archives:', err);
      setError(content[currentLanguage].error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les archives au montage du composant
  useEffect(() => {
    fetchArchives();
  }, []);

  // Extraire l'année de la date created_at
  const getYearFromDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  const handleViewBestPapers = (archive: Archive) => {
    const year = getYearFromDate(archive.created_at);
    setActionStatus(currentLanguage === 'fr'
      ? `Redirection vers les meilleurs articles de ${year}...`
      : `Redirecting to best papers from ${year}...`);

    setTimeout(() => {
      window.open(`https://site-conf.com/best-papers/${year}`, '_blank');
      setActionStatus('');
    }, 1000);
  };

  const handleViewPhotos = (archive: Archive) => {
    setActionStatus(
      currentLanguage === 'fr'
        ? `Ouverture de la galerie photos...`
        : `Opening photo gallery...`
    );

    setTimeout(() => {
      window.open(archive.photoGalleryLink, '_blank');
      setActionStatus('');
    }, 500);
  };

  // Affichage du loading
  if (loading) {
    return (
      <section id="archives" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-xl font-medium">{content[currentLanguage].loading}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <section id="archives" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 shadow-sm">
                <div className="text-lg font-medium">{error}</div>
              </div>
              <Button 
                onClick={fetchArchives}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Réessayer / Retry
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="archives" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {content[currentLanguage].title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content[currentLanguage].subtitle}
            </p>
            {actionStatus && (
              <div className="mt-6 p-4 bg-blue-100 text-blue-700 rounded-xl border border-blue-200 inline-block shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {actionStatus}
                </div>
              </div>
            )}
          </div>

          {archives.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-100">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-xl font-medium">{content[currentLanguage].noData}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {archives.map((archive) => (
                <Card key={archive.id} className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 bg-white rounded-2xl overflow-hidden group hover:scale-[1.02]">
                  <CardHeader className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-b border-gray-200 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors">
                          {archive.event_name}
                        </CardTitle>
                        <p className="text-gray-700 font-medium text-lg mb-2">
                          {currentLanguage === 'fr' ? archive.subject_fr : archive.subject_en}
                        </p>
                        <p className="text-gray-600 text-sm font-medium">{archive.organizer}</p>
                      </div>
                      
                      <div className="flex gap-8 mt-6 lg:mt-0 lg:ml-8">
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                            <Users className="w-5 h-5" />
                            <span className="font-bold text-2xl">{archive.participants}</span>
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            {content[currentLanguage].stats.participants}
                          </div>
                        </div>
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                            <FileText className="w-5 h-5" />
                            <span className="font-bold text-2xl">{archive.articles}</span>
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            {content[currentLanguage].stats.papers}
                          </div>
                        </div>
                        <div className="text-center group-hover:scale-110 transition-transform duration-300">
                          <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                            <Calendar className="w-5 h-5" />
                            <span className="font-bold text-2xl">{archive.countries}</span>
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            {content[currentLanguage].stats.countries}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Button
                        onClick={() => handleViewBestPapers(archive)}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Award className="w-5 h-5" />
                        {content[currentLanguage].actions.bestPapers}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                      
                      <Button
                        onClick={() => handleViewPhotos(archive)}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Camera className="w-5 h-5" />
                        {content[currentLanguage].actions.photos}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Archives;