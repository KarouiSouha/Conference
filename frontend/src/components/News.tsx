
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';

interface NewsProps {
  language: 'fr' | 'en';
}

const News: React.FC<NewsProps> = ({ language }) => {
  const { toast } = useToast();

  const content = {
    fr: {
      title: 'Actualités & Annonces',
      news: [
        {
          title: 'Ouverture des soumissions pour SITE 2025',
          date: '1 Décembre 2024',
          author: 'Comité d\'organisation',
          excerpt: 'Les soumissions d\'articles sont maintenant ouvertes. Date limite : 15 février 2025.',
          content: 'Nous sommes ravis d\'annoncer l\'ouverture officielle des soumissions pour SITE 2025. Cette année, nous acceptons des articles dans tous nos thèmes de recherche. Les auteurs peuvent soumettre leurs travaux via notre plateforme en ligne. Consultez notre guide de soumission pour plus de détails sur les formats acceptés et les critères d\'évaluation.',
          category: 'Annonce',
          hasDownload: true,
          hasExternalLink: true
        },
        {
          title: 'Confirmation des conférenciers invités',
          date: '15 Novembre 2024',
          author: 'Comité scientifique',
          excerpt: 'Nous sommes ravis de confirmer la participation de nos experts internationaux.',
          content: 'Le comité scientifique a finalisé la liste des conférenciers invités pour SITE 2025. Nous accueillerons des experts de renommée mondiale dans les domaines de l\'IA, des technologies durables et de l\'Industrie 4.0. Chaque conférencier présentera les dernières avancées dans son domaine d\'expertise.',
          category: 'Speakers',
          hasDownload: false,
          hasExternalLink: false
        },
        {
          title: 'Partenariat avec IEEE',
          date: '1 Novembre 2024',
          author: 'Direction',
          excerpt: 'SITE 2025 est maintenant officiellement sponsorisée par IEEE Tunisia Section.',
          content: 'Nous sommes fiers d\'annoncer notre partenariat officiel avec IEEE Tunisia Section. Cette collaboration apporte un soutien technique et une reconnaissance internationale à notre conférence. Les articles sélectionnés pourront être publiés dans les proceedings IEEE.',
          category: 'Partenariat',
          hasDownload: false,
          hasExternalLink: true
        },
        {
          title: 'Publication des actes de SITE 2023',
          date: '20 Octobre 2024',
          author: 'Comité éditorial',
          excerpt: 'Les actes de la conférence SITE 2023 sont maintenant disponibles en ligne.',
          content: 'Les actes complets de SITE 2023 sont maintenant disponibles en téléchargement gratuit. Cette publication contient 45 articles sélectionnés couvrant tous les thèmes de la conférence. Un excellent aperçu des recherches actuelles dans nos domaines d\'intérêt.',
          category: 'Publication',
          hasDownload: true,
          hasExternalLink: true
        }
      ],
      readMore: 'Lire plus',
      download: 'Télécharger',
      viewOnline: 'Voir en ligne'
    },
    en: {
      title: 'News & Announcements',
      news: [
        {
          title: 'SITE 2025 Submissions Now Open',
          date: 'December 1, 2024',
          author: 'Organizing Committee',
          excerpt: 'Paper submissions are now open. Deadline: February 15, 2025.',
          content: 'We are pleased to announce the official opening of submissions for SITE 2025. This year, we accept papers in all our research themes. Authors can submit their work through our online platform. Check our submission guide for more details on accepted formats and evaluation criteria.',
          category: 'Announcement',
          hasDownload: true,
          hasExternalLink: true
        },
        {
          title: 'Keynote Speakers Confirmed',
          date: 'November 15, 2024',
          author: 'Scientific Committee',
          excerpt: 'We are delighted to confirm the participation of our international experts.',
          content: 'The scientific committee has finalized the list of keynote speakers for SITE 2025. We will welcome world-renowned experts in AI, sustainable technologies and Industry 4.0. Each speaker will present the latest advances in their field of expertise.',
          category: 'Speakers',
          hasDownload: false,
          hasExternalLink: false
        },
        {
          title: 'Partnership with IEEE',
          date: 'November 1, 2024',
          author: 'Management',
          excerpt: 'SITE 2025 is now officially sponsored by IEEE Tunisia Section.',
          content: 'We are proud to announce our official partnership with IEEE Tunisia Section. This collaboration brings technical support and international recognition to our conference. Selected papers may be published in IEEE proceedings.',
          category: 'Partnership',
          hasDownload: false,
          hasExternalLink: true
        },
        {
          title: 'SITE 2023 Proceedings Published',
          date: 'October 20, 2024',
          author: 'Editorial Committee',
          excerpt: 'The proceedings of SITE 2023 conference are now available online.',
          content: 'The complete proceedings of SITE 2023 are now available for free download. This publication contains 45 selected papers covering all conference themes. An excellent overview of current research in our areas of interest.',
          category: 'Publication',
          hasDownload: true,
          hasExternalLink: true
        }
      ],
      readMore: 'Read more',
      download: 'Download',
      viewOnline: 'View online'
    }
  };

  const handleDownload = (title: string) => {
    toast({
      title: language === 'fr' ? 'Téléchargement' : 'Download',
      description: language === 'fr' ? 'Téléchargement en cours...' : 'Download in progress...',
    });

    // Simulation de téléchargement réel
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: language === 'fr' ? 'Téléchargement terminé' : 'Download Complete',
        description: language === 'fr' ? 'Le document a été téléchargé.' : 'The document has been downloaded.',
      });
    }, 2000);
  };

  const handleExternalLink = (title: string) => {
    toast({
      title: language === 'fr' ? 'Redirection' : 'Redirecting',
      description: language === 'fr' ? 'Ouverture du lien...' : 'Opening link...',
    });

    setTimeout(() => {
      if (title.includes('soumission') || title.includes('Submission')) {
        window.open('https://site-conf.com/call-for-papers', '_blank');
      } else if (title.includes('IEEE') || title.includes('Partenariat')) {
        window.open('https://ieee.tn/', '_blank');
      } else if (title.includes('actes') || title.includes('Proceedings')) {
        window.open('https://site-conf.com/proceedings', '_blank');
      } else {
        window.open('https://site-conf.com/news', '_blank');
      }
    }, 1000);
  };

  return (
    <section id="news" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {content[language].news.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Modal
                      trigger={
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                          {content[language].readMore}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      }
                      title={article.title}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {article.author}
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">{article.content}</p>
                        
                        <div className="flex gap-2 pt-4">
                          {article.hasDownload && (
                            <Button onClick={() => handleDownload(article.title)} variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              {content[language].download}
                            </Button>
                          )}
                          {article.hasExternalLink && (
                            <Button onClick={() => handleExternalLink(article.title)} className="flex-1">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {content[language].viewOnline}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Modal>
                    
                    {article.hasDownload && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(article.title)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {content[language].download}
                      </Button>
                    )}
                    
                    {article.hasExternalLink && (
                      <Button 
                        size="sm"
                        onClick={() => handleExternalLink(article.title)}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {content[language].viewOnline}
                      </Button>
                    )}
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

export default News;
