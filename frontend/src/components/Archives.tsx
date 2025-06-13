import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText, Users, Calendar } from 'lucide-react';

interface ArchivesProps {
  language?: 'fr' | 'en';
}

const Archives: React.FC<ArchivesProps> = ({ language = 'fr' }) => {
  const currentLanguage = language || 'fr';
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  const content = {
    fr: {
      title: 'Archives & Publications Précédentes',
      subtitle: 'Consultez les actes et publications des éditions passées',
      editions: [
        {
          year: '2024',
          theme: 'Intelligence Artificielle et Technologies Émergentes',
          location: 'ISET Bizerte',
          participants: 200,
          papers: 58,
          countries: 14,
        },
        {
          year: '2023',
          theme: 'Innovation Numérique et Développement Durable',
          location: 'ISET Bizerte',
          participants: 180,
          papers: 45,
          countries: 12,
        }
      ],
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
      }
    },
    en: {
      title: 'Archives & Previous Publications',
      subtitle: 'Browse proceedings and publications from past editions',
      editions: [
        {
          year: '2024',
          theme: 'Artificial Intelligence and Emerging Technologies',
          location: 'ISET Bizerte',
          participants: 200,
          papers: 58,
          countries: 14,
        },
        {
          year: '2023',
          theme: 'Digital Innovation and Sustainable Development',
          location: 'ISET Bizerte',
          participants: 180,
          papers: 45,
          countries: 12,
        }
      ],
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
      }
    }
  };

  const handleDownload = (year: string) => {
    setDownloadStatus(currentLanguage === 'fr' 
      ? `Téléchargement des actes SITE ${year} en cours...` 
      : `Downloading SITE ${year} proceedings...`);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `SITE_${year}_Proceedings.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus(currentLanguage === 'fr' 
        ? 'Téléchargement terminé!' 
        : 'Download complete!');

      setTimeout(() => setDownloadStatus(''), 3000);
    }, 2000);
  };

  const handleViewBestPapers = (year: string) => {
    setDownloadStatus(currentLanguage === 'fr' 
      ? `Redirection vers les meilleurs articles de ${year}...`
      : `Redirecting to best papers from ${year}...`);
    
    setTimeout(() => {
      window.open(`https://site-conf.com/best-papers/${year}`, '_blank');
      setDownloadStatus('');
    }, 1000);
  };

  const handleViewPhotos = (year: string) => {
    setDownloadStatus(currentLanguage === 'fr' 
      ? `Ouverture de la galerie photos ${year}...`
      : `Opening photo gallery ${year}...`);
    
    setTimeout(() => {
      window.open(`https://site-conf.com/gallery/${year}`, '_blank');
      setDownloadStatus('');
    }, 500);
  };

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
          
          <div className="space-y-6">
            {content[currentLanguage].editions.map((edition, index) => (
              <Card key={index} className="border border-slate-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-slate-800 text-xl mb-2">
                        SITE {edition.year}
                      </CardTitle>
                      <p className="text-slate-600 font-medium">{edition.theme}</p>
                      <p className="text-slate-500 text-sm">{edition.location}</p>
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Users className="w-4 h-4" />
                          <span className="font-bold">{edition.participants}</span>
                        </div>
                        <div className="text-xs text-slate-500">{content[currentLanguage].stats.participants}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-700">
                          <FileText className="w-4 h-4" />
                          <span className="font-bold">{edition.papers}</span>
                        </div>
                        <div className="text-xs text-slate-500">{content[currentLanguage].stats.papers}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-4 h-4" />
                          <span className="font-bold">{edition.countries}</span>
                        </div>
                        <div className="text-xs text-slate-500">{content[currentLanguage].stats.countries}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => handleDownload(edition.year)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white"
                    >
                      <Download className="w-4 h-4" />
                      {content[currentLanguage].actions.download}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewBestPapers(edition.year)}
                      className="flex items-center gap-2 border-slate-600 text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {content[currentLanguage].actions.bestPapers}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewPhotos(edition.year)}
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
        </div>
      </div>
    </section>
  );
};

export default Archives;