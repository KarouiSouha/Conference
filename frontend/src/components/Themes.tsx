'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar,
  MapPin,
  Eye
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
  title: string;
  description: string;
  icon: string;
  order: number;
  keywords: Keyword[];
  is_active: boolean;
}

interface ThemesProps {
  language: 'fr' | 'en';
  apiBaseUrl?: string;
}

// Mapping des icônes basé sur le titre ou l'icône emoji
const getIconComponent = (iconString: string, title: string) => {
  const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    '📋': FileText,
    '🧠': Brain,
    '💡': Lightbulb,
    '🌍': Globe,
    '⚡': Zap,
    '🎯': Target,
    '🔍': Search,
    '🏆': Award,
    '🔬': Microscope,
    '💻': Computer,
    '❤️': Heart,
    '🛡️': Shield,
    '🌱': Leaf,
    '🏢': Building,
    '📖': BookOpen,
  };

  // Si l'icône existe dans le mapping, l'utiliser
  if (iconMap[iconString]) {
    return iconMap[iconString];
  }

  // Sinon, essayer de deviner l'icône basée sur le titre (en minuscules)
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('technolog') || lowerTitle.includes('informatique') || lowerTitle.includes('digital')) {
    return Computer;
  } else if (lowerTitle.includes('santé') || lowerTitle.includes('health') || lowerTitle.includes('médical')) {
    return Heart;
  } else if (lowerTitle.includes('environnement') || lowerTitle.includes('environment') || lowerTitle.includes('écolog')) {
    return Leaf;
  } else if (lowerTitle.includes('recherche') || lowerTitle.includes('research') || lowerTitle.includes('science')) {
    return Microscope;
  } else if (lowerTitle.includes('innovation') || lowerTitle.includes('créativ')) {
    return Lightbulb;
  } else if (lowerTitle.includes('sécurité') || lowerTitle.includes('security')) {
    return Shield;
  } else if (lowerTitle.includes('business') || lowerTitle.includes('entreprise') || lowerTitle.includes('économie')) {
    return Building;
  } else if (lowerTitle.includes('éducation') || lowerTitle.includes('education') || lowerTitle.includes('formation')) {
    return BookOpen;
  }

  // Icône par défaut
  return FileText;
};

// Fonction pour extraire la première phrase
const getFirstSentence = (text: string): string => {
  if (!text) return '';
  
  // Chercher le premier point suivi d'un espace ou fin de chaîne
  const match = text.match(/^[^.!?]*[.!?](?:\s|$)/);
  if (match) {
    return match[0].trim();
  }
  
  // Si pas de ponctuation trouvée, limiter à 100 caractères avec "..."
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
  const [submitForm, setSubmitForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    fichier: null as File | null
  });

  // Charger les thèmes depuis l'API Laravel
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/Theme/all?lang=${language}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des thèmes');
        }
        const data = await response.json();

        if (data.success) {
          setThemes(data.data);
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
    // Ici vous pouvez ajouter la logique de soumission vers votre API
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
          {/* En-tête de section */}
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

          {/* Grille des thèmes */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => {
              const IconComponent = getIconComponent(theme.icon, theme.title);

              return (
                <Card
                  key={theme.id}
                  className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border bg-card/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Gradient de fond animé */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardHeader className="relative">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                          {theme.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {getFirstSentence(theme.description)}
                    </p>

                    {/* Bouton voir détails */}
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
                      title={theme.title}
                    >
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                            <IconComponent className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">{theme.title}</h3>
                          </div>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                          <p className="text-muted-foreground leading-relaxed">{theme.description}</p>
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

                    {/* Boutons d'action */}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Themes;