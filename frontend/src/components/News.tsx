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
      <section id="news" className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
                {content[language].title}
              </h2>
              <p className="text-slate-600 text-lg">
                {content[language].loading}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="news" className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-8">
                {content[language].title}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {news.map((article) => (
              <Card 
                key={article.id} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 opacity-60"></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-sm">
                      {language === 'fr' ? article.type_fr : article.type_en}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.date, language)}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {language === 'fr' ? article.title_fr : article.title_en}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
                    <User className="w-3.5 h-3.5" />
                    {article.author}
                  </div>
                  
                  <p className="text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                    {language === 'fr' ? article.description_fr : article.description_en}
                  </p>
                  
                  {article.link && (
                    <Button 
                      size="sm"
                      onClick={() => handleExternalLink(article.link!)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {content[language].viewOnline}
                    </Button>
                  )}
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            ))}
          </div>
          
          {news.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {language === 'fr' ? 'Aucune actualité disponible' : 'No news available'}
              </h3>
              <p className="text-slate-500">
                {language === 'fr' ? 'Revenez bientôt pour les dernières actualités.' : 'Check back soon for the latest updates.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;