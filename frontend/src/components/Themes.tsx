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
      <section id="themes" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <span className="text-lg text-muted-foreground">{content[language].labels.loading}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="themes" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center min-h-[200px] flex items-center justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="text-red-600 dark:text-red-400">
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
      <section id="themes" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center min-h-[200px] flex items-center justify-center">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <FileText className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <p className="text-yellow-800 dark:text-yellow-200">{content[language].labels.noThemes}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="themes" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
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
                  className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Gradient de fond animé */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                          {theme.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {theme.description}
                    </p>
                    
                    {/* Bouton voir détails */}
                    <Modal
                      trigger={
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300"
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
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{theme.title}</h3>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                          <p className="text-muted-foreground leading-relaxed">{theme.description}</p>
                        </div>
                        
                        {theme.keywords && theme.keywords.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Search className="w-4 h-4" />
                              {content[language].labels.keywords}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {theme.keywords.map((keyword) => (
                                <span 
                                  key={keyword.id} 
                                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700 hover:bg-blue-500/20 transition-colors duration-200"
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
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {content[language].inscription}
                      </Button>
                      
                      <Modal
                        trigger={
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {content[language].deposit}
                          </Button>
                        }
                        title={content[language].modalTitle}
                      >
                        <div className="space-y-6">
                          <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">{content[language].modalTitle}</h3>
                          </div>
                          
                          <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="nom" className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4" />
                                  {content[language].nom}
                                </Label>
                                <Input
                                  id="nom"
                                  type="text"
                                  value={submitForm.nom}
                                  onChange={(e) => handleSubmitFormChange('nom', e.target.value)}
                                  className="focus:ring-2 focus:ring-green-500"
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="prenom" className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4" />
                                  {content[language].prenom}
                                </Label>
                                <Input
                                  id="prenom"
                                  type="text"
                                  value={submitForm.prenom}
                                  onChange={(e) => handleSubmitFormChange('prenom', e.target.value)}
                                  className="focus:ring-2 focus:ring-green-500"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4" />
                                {content[language].email}
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={submitForm.email}
                                onChange={(e) => handleSubmitFormChange('email', e.target.value)}
                                className="focus:ring-2 focus:ring-green-500"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="fichier" className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4" />
                                {content[language].fichier}
                              </Label>
                              <Input
                                id="fichier"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="focus:ring-2 focus:ring-green-500"
                                required
                              />
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {content[language].soumettre}
                            </Button>
                          </form>
                        </div>
                      </Modal>
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