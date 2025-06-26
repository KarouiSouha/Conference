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
      title: 'Archives & Publications',
      subtitle: 'Consultez les actes et publications des éditions passées',
      stats: {
        participants: 'Participants',
        papers: 'Articles',
        countries: 'Pays'
      },
      actions: {
        bestPapers: 'Meilleur Article',
        photos: 'Galerie Photos'
      },
      loading: 'Chargement des archives...',
      error: 'Erreur lors du chargement des archives',
      noData: 'Aucune archive disponible'
    },
    en: {
      title: 'Archives & Publications',
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

  // Fonction pour ouvrir le PDF
  const handleViewBestPapers = (archive: Archive) => {
    setActionStatus('Ouverture du PDF des meilleurs articles...');

    setTimeout(() => {
      // Chemin vers le fichier PDF dans le dossier public
      const pdfPath = '/asset/images/gallery/32182.pd.pdf';
      window.open(pdfPath, '_blank'); // Ouvre le PDF dans un nouvel onglet
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
      <section id="archives" className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-lg font-medium">{content[currentLanguage].loading}</span>
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
      <section id="archives" className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-100">
                <div className="text-lg font-medium">{error}</div>
              </div>
              <Button 
                onClick={fetchArchives}
                className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
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
    <section id="archives" className="py-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {content[currentLanguage].title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {content[currentLanguage].subtitle}
            </p>
            {actionStatus && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{actionStatus}</span>
              </div>
            )}
          </div>

          {archives.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto border border-slate-200">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">{content[currentLanguage].noData}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {archives.map((archive) => (
                <Card key={archive.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white rounded-lg overflow-hidden">
                  <CardHeader className="bg-white border-b border-slate-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl font-bold mb-2 text-slate-900">
                          {archive.event_name}
                        </CardTitle>
                        <p className="text-slate-700 mb-1 text-base">
                          {currentLanguage === 'fr' ? archive.subject_fr : archive.subject_en}
                        </p>
                        <p className="text-slate-500 text-sm">{archive.organizer}</p>
                      </div>
                      
                      <div className="flex gap-8 lg:gap-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold text-lg">{archive.participants}</span>
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">
                            {content[currentLanguage].stats.participants}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                            <FileText className="w-4 h-4" />
                            <span className="font-semibold text-lg">{archive.articles}</span>
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">
                            {content[currentLanguage].stats.papers}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold text-lg">{archive.countries}</span>
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">
                            {content[currentLanguage].stats.countries}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 bg-slate-50/50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleViewBestPapers(archive)}
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                      >
                        <Award className="w-4 h-4" />
                        {content[currentLanguage].actions.bestPapers}
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        onClick={() => handleViewPhotos(archive)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        {content[currentLanguage].actions.photos}
                        <ExternalLink className="w-3 h-3" />
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