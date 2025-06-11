
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArchivesProps {
  language: 'fr' | 'en';
}

const Archives: React.FC<ArchivesProps> = ({ language }) => {
  const { toast } = useToast();

  const content = {
    fr: {
      title: 'Archives & Publications Précédentes',
      subtitle: 'Consultez les actes et publications des éditions passées',
      editions: [
        {
          year: '2023',
          theme: 'Innovation Numérique et Développement Durable',
          location: 'ISET Bizerte',
          participants: 180,
          papers: 45,
          countries: 12,
          proceedings: 'Actes SITE 2023',
          bestPapers: 'Meilleurs articles SITE 2023',
          photos: 'Photos de l\'événement'
        },
        {
          year: '2021',
          theme: 'Technologies Émergentes pour l\'Industrie',
          location: 'En ligne (COVID-19)',
          participants: 220,
          papers: 52,
          countries: 15,
          proceedings: 'Actes SITE 2021',
          bestPapers: 'Meilleurs articles SITE 2021',
          photos: 'Captures virtuelles'
        },
        {
          year: '2019',
          theme: 'Smart Manufacturing et IoT',
          location: 'ISET Bizerte',
          participants: 160,
          papers: 38,
          countries: 10,
          proceedings: 'Actes SITE 2019',
          bestPapers: 'Meilleurs articles SITE 2019',
          photos: 'Galerie SITE 2019'
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
          year: '2023',
          theme: 'Digital Innovation and Sustainable Development',
          location: 'ISET Bizerte',
          participants: 180,
          papers: 45,
          countries: 12,
          proceedings: 'SITE 2023 Proceedings',
          bestPapers: 'SITE 2023 Best Papers',
          photos: 'Event Photos'
        },
        {
          year: '2021',
          theme: 'Emerging Technologies for Industry',
          location: 'Online (COVID-19)',
          participants: 220,
          papers: 52,
          countries: 15,
          proceedings: 'SITE 2021 Proceedings',
          bestPapers: 'SITE 2021 Best Papers',
          photos: 'Virtual Captures'
        },
        {
          year: '2019',
          theme: 'Smart Manufacturing and IoT',
          location: 'ISET Bizerte',
          participants: 160,
          papers: 38,
          countries: 10,
          proceedings: 'SITE 2019 Proceedings',
          bestPapers: 'SITE 2019 Best Papers',
          photos: 'SITE 2019 Gallery'
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

  const handleDownload = (year: string, type: string) => {
    toast({
      title: language === 'fr' ? 'Téléchargement' : 'Download',
      description: language === 'fr' 
        ? `Téléchargement des ${type} ${year} en cours...` 
        : `Downloading ${type} ${year}...`,
    });

    // Simulation de téléchargement réel
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `SITE_${year}_${type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: language === 'fr' ? 'Téléchargement terminé' : 'Download Complete',
        description: language === 'fr' ? 'Le fichier a été téléchargé.' : 'The file has been downloaded.',
      });
    }, 2000);
  };

  const handleViewBestPapers = (year: string) => {
    toast({
      title: language === 'fr' ? 'Meilleurs articles' : 'Best Papers',
      description: language === 'fr' 
        ? `Redirection vers les meilleurs articles de ${year}...`
        : `Redirecting to best papers from ${year}...`,
    });
    
    setTimeout(() => {
      window.open(`https://site-conf.com/best-papers/${year}`, '_blank');
    }, 1000);
  };

  const handleViewPhotos = (year: string) => {
    toast({
      title: language === 'fr' ? 'Galerie photos' : 'Photo Gallery',
      description: language === 'fr' 
        ? `Ouverture de la galerie photos ${year}...`
        : `Opening photo gallery ${year}...`,
    });
    
    setTimeout(() => {
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        galleryElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(`https://site-conf.com/gallery/${year}`, '_blank');
      }
    }, 500);
  };

  return (
    <section id="archives" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-slate-600">
              {content[language].subtitle}
            </p>
          </div>
          
          <div className="space-y-6">
            {content[language].editions.map((edition, index) => (
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
                        <div className="text-xs text-slate-500">{content[language].stats.participants}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-700">
                          <FileText className="w-4 h-4" />
                          <span className="font-bold">{edition.papers}</span>
                        </div>
                        <div className="text-xs text-slate-500">{content[language].stats.papers}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-4 h-4" />
                          <span className="font-bold">{edition.countries}</span>
                        </div>
                        <div className="text-xs text-slate-500">{content[language].stats.countries}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => handleDownload(edition.year, 'proceedings')}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white"
                    >
                      <Download className="w-4 h-4" />
                      {content[language].actions.download}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewBestPapers(edition.year)}
                      className="flex items-center gap-2 border-slate-600 text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {content[language].actions.bestPapers}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewPhotos(edition.year)}
                      className="flex items-center gap-2 border-slate-600 text-slate-700 hover:bg-slate-50"
                    >
                      <Calendar className="w-4 h-4" />
                      {content[language].actions.photos}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section citation */}
          <Card className="mt-8 border border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">
                {content[language].actions.cite}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                {language === 'fr' ? (
                  <>
                    Author, A. (Year). "Titre de l'article". In <em>Actes de la Conférence SITE {new Date().getFullYear()}</em>, 
                    pp. XX-XX, ISET Bizerte, Tunisie.
                  </>
                ) : (
                  <>
                    Author, A. (Year). "Paper Title". In <em>Proceedings of SITE {new Date().getFullYear()} Conference</em>, 
                    pp. XX-XX, ISET Bizerte, Tunisia.
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Archives;
