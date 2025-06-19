import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: number;
  type_en: string;
  type_fr: string;
  title_en: string;
  title_fr: string;
  date: string;
  author: string;
  description_en: string;
  description_fr: string;
  link?: string;
}

interface NewsProps {
  language: 'fr' | 'en';
}

const News: React.FC<NewsProps> = ({ language }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    fr: {
      title: 'Actualités & Annonces',
      loading: 'Chargement...',
      error: 'Erreur lors du chargement des actualités',
      viewOnline: 'Voir en ligne'
    },
    en: {
      title: 'News & Announcements',
      loading: 'Loading...',
      error: 'Error loading news',
      viewOnline: 'View online'
    }
  };

  // Fonction pour formater la date selon la langue
  const formatDate = (dateString: string, lang: 'fr' | 'en'): string => {
    const date = new Date(dateString);
    
    if (lang === 'fr') {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Fonction pour ouvrir le lien externe
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/News/published');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: NewsItem[] = await response.json();
      setNews(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(content[language].error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section id="news" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              {content[language].title}
            </h2>
            <div className="text-center text-muted-foreground">
              {content[language].loading}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="news" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              {content[language].title}
            </h2>
            <div className="text-center text-red-500">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {news.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {language === 'fr' ? article.type_fr : article.type_en}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date, language)}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                    {language === 'fr' ? article.title_fr : article.title_en}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {language === 'fr' ? article.description_fr : article.description_en}
                  </p>
                  
                  {article.link && (
                    <Button 
                      size="sm"
                      onClick={() => handleExternalLink(article.link!)}
                      className="w-full"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      {content[language].viewOnline}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {news.length === 0 && !loading && !error && (
            <div className="text-center text-muted-foreground">
              {language === 'fr' ? 'Aucune actualité disponible' : 'No news available'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;