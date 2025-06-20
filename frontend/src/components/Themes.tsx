'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  FileText,
  Users,
  Download,
  Upload,
  Loader2,
  BookOpen,
  Brain,
  Lightbulb,
  Globe,
  Zap,
  Target,
  Search,
  Award,
  Microscope,
  Computer,
  Heart,
  Shield,
  Leaf,
  Building,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Eye,
  Code,
  Database,
  Cloud,
  Smartphone,
  Lock
} from 'lucide-react';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Keyword {
  id: number;
  keyword: string;
  order: number;
}

interface Theme {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  icon_url: string;
  is_icon_class: boolean;
  order: number;
  keywords: Keyword[];
}

interface ThemesProps {
  language: 'fr' | 'en';
  apiBaseUrl?: string;
}

// Mapping des icônes FontAwesome vers Lucide React
const fontAwesomeToLucideMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  'fa-code': Code,
  'fa-laptop-code': Computer,
  'fa-html5': Code,
  'fa-css3': Code,
  'fa-js': Code,
  'fa-react': Code,
  'fa-vue': Code,
  'fa-angular': Code,
  'fa-brain': Brain,
  'fa-robot': Brain,
  'fa-neural-network': Brain,
  'fa-microchip': Microscope,
  'fa-database': Database,
  'fa-server': Database,
  'fa-hdd': Database,
  'fa-shield': Shield,
  'fa-shield-alt': Shield,
  'fa-lock': Lock,
  'fa-key': Lock,
  'fa-fingerprint': Shield,
  'fa-cloud': Cloud,
  'fa-docker': Cloud,
  'fa-aws': Cloud,
  'fa-digital-ocean': Cloud,
  'fa-mobile': Smartphone,
  'fa-mobile-alt': Smartphone,
  'fa-tablet': Smartphone,
  'fa-android': Smartphone,
  'fa-apple': Smartphone,
  'fa-lightbulb': Lightbulb,
  'fa-globe': Globe,
  'fa-search': Search,
  'fa-target': Target,
  'fa-award': Award,
  'fa-building': Building,
  'fa-heart': Heart,
  'fa-leaf': Leaf,
  'fa-book': BookOpen,
  'fa-file-text': FileText,
  'fa-zap': Zap,
  'fa-users': Users,
  'fa-cog': Target,
  'fa-chart-line': Award,
  'fa-graduation-cap': BookOpen,
  'fa-industry': Building,
  'fa-stethoscope': Heart,
  'fa-seedling': Leaf,
  'fa-recycle': Leaf,
  'fa-solar-panel': Zap,
  'fa-wind': Zap,
  'fa-atom': Microscope,
  'fa-dna': Microscope,
  'fa-microscope': Microscope,
  'fa-flask': Microscope,
  'fa-calculator': Computer,
  'fa-wifi': Globe,
  'fa-network-wired': Globe,
  'fa-ethernet': Globe,
  'fa-satellite': Globe
};

// Fonction pour obtenir l'icône appropriée
const getIconComponent = (theme: Theme, language: 'fr' | 'en'): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
  if (theme.is_icon_class && theme.icon) {
    const mappedIcon = fontAwesomeToLucideMap[theme.icon];
    if (mappedIcon) {
      return mappedIcon;
    }
  }

  const title = (language === 'fr' ? theme.titleFr : theme.titleEn)?.toLowerCase() || '';

  if (title.includes('web') || title.includes('technolog') || title.includes('informatique') || title.includes('digital')) {
    return Computer;
  } else if (title.includes('intelligence') || title.includes('ai') || title.includes('ia') || title.includes('machine learning')) {
    return Brain;
  } else if (title.includes('base') || title.includes('données') || title.includes('database') || title.includes('sql')) {
    return Database;
  } else if (title.includes('sécurité') || title.includes('security') || title.includes('cyber')) {
    return Shield;
  } else if (title.includes('cloud') || title.includes('devops') || title.includes('docker') || title.includes('kubernetes')) {
    return Cloud;
  } else if (title.includes('mobile') || title.includes('android') || title.includes('ios') || title.includes('app')) {
    return Smartphone;
  } else if (title.includes('santé') || title.includes('health') || title.includes('médical') || title.includes('medical')) {
    return Heart;
  } else if (title.includes('environnement') || title.includes('environment') || title.includes('écolog') || title.includes('vert')) {
    return Leaf;
  } else if (title.includes('recherche') || title.includes('research') || title.includes('science')) {
    return Microscope;
  } else if (title.includes('innovation') || title.includes('créativ') || title.includes('idée')) {
    return Lightbulb;
  } else if (title.includes('business') || title.includes('entreprise') || title.includes('économie') || title.includes('finance')) {
    return Building;
  } else if (title.includes('éducation') || title.includes('education') || title.includes('formation') || title.includes('apprentissage')) {
    return BookOpen;
  } else if (title.includes('réseau') || title.includes('network') || title.includes('internet') || title.includes('web')) {
    return Globe;
  }

  return FileText;
};

// Fonction pour afficher l'icône
const IconDisplay: React.FC<{ theme: Theme; language: 'fr' | 'en'; className?: string }> = ({ theme, language, className = "w-7 h-7" }) => {
  const IconComponent = getIconComponent(theme, language);

  if (!theme.is_icon_class && theme.icon_url) {
    return (
      <img
        src={theme.icon_url}
        alt={language === 'fr' ? theme.titleFr : theme.titleEn}
        className={className}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.fallback-icon')) {
            const fallbackIcon = document.createElement('div');
            fallbackIcon.className = 'fallback-icon';
            parent.appendChild(fallbackIcon);
            const iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            iconElement.className = className;
            parent.replaceChild(iconElement, fallbackIcon);
          }
        }}
      />
    );
  }

  return <IconComponent className={className} />;
};

// Fonction pour extraire la première phrase
const getFirstSentence = (text: string): string => {
  if (!text) return '';

  const match = text.match(/^[^.!?]*[.!?](?:\s|$)/);
  if (match) {
    return match[0].trim();
  }

  if (text.length > 100) {
    return text.substring(0, 97) + '...';
  }

  return text;
};

const Themes: React.FC<ThemesProps> = ({
  language,
  apiBaseUrl = 'http://localhost:8000/api'
}) => {
  const { toast } = useToast();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitForm, setSubmitForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    fichier: null as File | null
  });

  const carouselRef = useRef<HTMLDivElement>(null);

  const getVisibleItems = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [visibleItems, setVisibleItems] = useState(getVisibleItems());

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/Theme/all?lang=${language}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des thèmes');
        }
        const data = await response.json();
        if (data.success) {
          setThemes(data.data || []);
        } else {
          throw new Error('Erreur dans la réponse de l\'API');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        toast({
          title: "Erreur",
          description: "Impossible de charger les thèmes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [apiBaseUrl, language, toast]);

  const handleSubmitFormChange = (field: string, value: string | File | null) => {
    setSubmitForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleSubmitFormChange('fichier', file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis:', submitForm);
    setIsModalOpen(false);
    setSubmitForm({ nom: '', prenom: '', email: '', fichier: null });

    toast({
      title: language === 'fr' ? 'Soumission envoyée' : 'Submission sent',
      description: language === 'fr' ? 'Votre soumission a été envoyée avec succès.' : 'Your submission has been sent successfully.',
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const canGoNext = currentIndex < themes.length - visibleItems;
  const canGoPrev = currentIndex > 0;

  const goNext = React.useCallback(() => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canGoNext]);

  const goPrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (canGoNext) {
        goNext();
      } else {
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, canGoNext, goNext]);

  const content = {
    fr: {
      title: 'Thèmes de la Conférence',
      subtitle: 'Explorez nos thèmes de recherche et découvrez les domaines d\'innovation qui façonnent l\'avenir',
      inscription: 'Inscription',
      deposit: 'Déposer',
      modalTitle: 'Déposer votre soumission',
      nom: 'Nom',
      prenom: 'Prénom',
      email: 'Email',
      fichier: 'Fichier',
      soumettre: 'Soumettre',
      navigation: {
        previous: 'Précédent',
        next: 'Suivant'
      },
      actions: {
        details: 'Voir les détails'
      },
      labels: {
        keywords: 'Mots-clés:',
        loading: 'Chargement des thèmes...',
        error: 'Erreur lors du chargement',
        noThemes: 'Aucun thème disponible pour le moment.'
      }
    },
    en: {
      title: 'Conference Themes',
      subtitle: 'Explore our research themes and discover the innovation domains shaping the future',
      inscription: 'Registration',
      deposit: 'Submit',
      modalTitle: 'Submit your paper',
      nom: 'Last Name',
      prenom: 'First Name',
      email: 'Email',
      fichier: 'File',
      soumettre: 'Submit',
      navigation: {
        previous: 'Previous',
        next: 'Next'
      },
      actions: {
        details: 'View details'
      },
      labels: {
        keywords: 'Keywords:',
        loading: 'Loading themes...',
        error: 'Error loading themes',
        noThemes: 'No themes available at the moment.'
      }
    }
  };

  if (loading) {
    return (
      <section id="themes" className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <span className="text-lg text-muted-foreground">{content[language].labels.loading}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="themes" className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center min-h-[200px] flex items-center justify-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <div className="text-destructive">
                <p className="font-semibold">{content[language].labels.error}</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (themes.length === 0) {
    return (
      <section id="themes" className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center min-h-[200px] flex items-center justify-center">
            <div className="bg-secondary/50 border border-border rounded-lg p-6">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{content[language].labels.noThemes}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="themes" className="py-20 bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-1 h-1 bg-primary/60 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {content[language].subtitle}
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-10">
              <Button
                variant="secondary"
                size="icon"
                onClick={goPrev}
                disabled={!canGoPrev}
                className={`pointer-events-auto -ml-6 w-12 h-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:shadow-xl transition-all duration-300 ${
                  !canGoPrev ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                title={content[language].navigation.previous}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                onClick={goNext}
                disabled={!canGoNext}
                className={`pointer-events-auto -mr-6 w-12 h-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:shadow-xl transition-all duration-300 ${
                  !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                title={content[language].navigation.next}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-hidden" ref={carouselRef}>
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                }}
              >
                {themes.map((theme) => (
                  <div 
                    key={theme.id}
                    className="flex-shrink-0"
                    style={{
                      width: `calc(${100 / visibleItems}% - ${(visibleItems - 1) * 24 / visibleItems}px)`
                    }}
                  >
                    <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border bg-card/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardHeader className="relative">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <IconDisplay theme={theme} language={language} className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                              {language === 'fr' ? theme.titleFr : theme.titleEn}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="relative space-y-6 flex flex-col">
                        <p className="text-muted-foreground leading-relaxed text-sm flex-1">
                          {getFirstSentence(language === 'fr' ? theme.descriptionFr : theme.descriptionEn)}
                        </p>

                        <Modal
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-between group/btn hover:bg-primary/10 border border-border hover:border-primary/50 transition-colors duration-300"
                            >
                              <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {content[language].actions.details}
                              </span>
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                            </Button>
                          }
                          title={language === 'fr' ? theme.titleFr : theme.titleEn}
                        >
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <IconDisplay theme={theme} language={language} className="w-8 h-8 text-primary-foreground" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-foreground">{language === 'fr' ? theme.titleFr : theme.titleEn}</h3>
                              </div>
                            </div>

                            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                              <p className="text-muted-foreground leading-relaxed">{language === 'fr' ? theme.descriptionFr : theme.descriptionEn}</p>
                            </div>

                            {theme.keywords && theme.keywords.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                                  <Search className="w-4 h-4" />
                                  {content[language].labels.keywords}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {theme.keywords.map((keyword) => (
                                    <span
                                      key={keyword.id}
                                      className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                                    >
                                      {keyword.keyword}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Modal>

                        <div className="flex gap-3 pt-2">
                          <Button
                            size="sm"
                            onClick={() => scrollToSection('registration')}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            {content[language].inscription}
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.location.href = 'https://cmt3.research.microsoft.com/User/Login?ReturnUrl=%2FConference%2FRecent'}
                            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {content[language].deposit}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: Math.ceil(themes.length / visibleItems) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * visibleItems)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / visibleItems) === index
                      ? 'bg-primary scale-125'
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Themes;