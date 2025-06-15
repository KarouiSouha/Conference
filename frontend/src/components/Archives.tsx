import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText, Users, Calendar, Loader2 } from 'lucide-react';

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
  const [downloadStatus, setDownloadStatus] = useState<string>('');

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
        download: 'Télécharger les actes',
        bestPapers: 'Voir les meilleurs articles',
        photos: 'Galerie photos',
        cite: 'Comment citer'
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
        download: 'Download Proceedings',
        bestPapers: 'View Best Papers',
        photos: 'Photo Gallery',
        cite: 'How to Cite'
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

  const handleDownload = (archive: Archive) => {
    const year = getYearFromDate(archive.created_at);
    setDownloadStatus(currentLanguage === 'fr'
      ? `Téléchargement des actes ${archive.event_name} en cours...`
      : `Downloading ${archive.event_name} proceedings...`);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${archive.event_name}_${year}_Proceedings.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadStatus(currentLanguage === 'fr'
        ? 'Téléchargement terminé!'
        : 'Download complete!');

      setTimeout(() => setDownloadStatus(''), 3000);
    }, 2000);
  };

  const handleViewBestPapers = (archive: Archive) => {
    const year = getYearFromDate(archive.created_at);
    setDownloadStatus(currentLanguage === 'fr'
      ? `Redirection vers les meilleurs articles de ${year}...`
      : `Redirecting to best papers from ${year}...`);

    setTimeout(() => {
      window.open(`https://site-conf.com/best-papers/${year}`, '_blank');
      setDownloadStatus('');
    }, 1000);
  };

  const handleViewPhotos = (archive: Archive) => {
    setDownloadStatus(
      currentLanguage === 'fr'
        ? `Ouverture de la galerie photos...`
        : `Opening photo gallery...`
    );

    setTimeout(() => {
      // Utiliser le lien de la galerie photos depuis la base de données
      window.open(archive.photoGalleryLink, '_blank');
      setDownloadStatus('');
    }, 500);
  };

  // Affichage du loading
  if (loading) {
    return (
      <section id="archives" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">{content[currentLanguage].loading}</span>
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
      <section id="archives" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
              <Button 
                onClick={fetchArchives}
                className="mt-4 bg-slate-800 hover:bg-slate-900 text-white"
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
    <section id="archives" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {content[currentLanguage].title}
            </h2>
            <p className="text-lg text-slate-600">
              {content[currentLanguage].subtitle}
            </p>
            {downloadStatus && (
              <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
                {downloadStatus}
              </div>
            )}
          </div>

          {archives.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">{content[currentLanguage].noData}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {archives.map((archive) => (
                <Card key={archive.id} className="border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-slate-800 text-xl mb-2">
                          {archive.event_name}
                        </CardTitle>
                        <p className="text-slate-600 font-medium">
                          {currentLanguage === 'fr' ? archive.subject_fr : archive.subject_en}
                        </p>
                        <p className="text-slate-500 text-sm">{archive.organizer}</p>
                      </div>
                      <div className="flex gap-6 mt-4 md:mt-0">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Users className="w-4 h-4" />
                            <span className="font-bold">{archive.participants}</span>
                          </div>
                          <div className="text-xs text-slate-500">{content[currentLanguage].stats.participants}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-slate-700">
                            <FileText className="w-4 h-4" />
                            <span className="font-bold">{archive.articles}</span>
                          </div>
                          <div className="text-xs text-slate-500">{content[currentLanguage].stats.papers}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Calendar className="w-4 h-4" />
                            <span className="font-bold">{archive.countries}</span>
                          </div>
                          <div className="text-xs text-slate-500">{content[currentLanguage].stats.countries}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button
                        onClick={() => handleDownload(archive)}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white"
                      >
                        <Download className="w-4 h-4" />
                        {content[currentLanguage].actions.download}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleViewBestPapers(archive)}
                        className="flex items-center gap-2 border-slate-600 text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {content[currentLanguage].actions.bestPapers}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleViewPhotos(archive)}
                        className="flex items-center gap-2 border-slate-600 text-slate-700 hover:bg-slate-50"
                      >
                        <Calendar className="w-4 h-4" />
                        {content[currentLanguage].actions.photos}
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