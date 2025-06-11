
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Users, Download } from 'lucide-react';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';

interface ThemesProps {
  language: 'fr' | 'en';
}

const Themes: React.FC<ThemesProps> = ({ language }) => {
  const { toast } = useToast();

  const content = {
    fr: {
      title: 'Thèmes de la Conférence',
      subtitle: 'Explorez nos thèmes de recherche',
      themes: [
        {
          title: 'Industrie 4.0 et IoT',
          description: 'Internet des objets, systèmes cyber-physiques, automatisation industrielle',
          details: 'Cette session couvre les dernières avancées en matière d\'Internet des objets industriel, de systèmes cyber-physiques et d\'automatisation intelligente. Nous explorerons comment ces technologies transforment les processus de production et créent de nouvelles opportunités d\'efficacité.',
          keywords: ['IoT industriel', 'Systèmes cyber-physiques', 'Automatisation', 'Industrie 4.0'],
          icon: '🏭'
        },
        {
          title: 'Intelligence Artificielle',
          description: 'Machine learning, deep learning, IA appliquée à l\'industrie',
          details: 'Découvrez les applications pratiques de l\'intelligence artificielle dans l\'industrie moderne. Des algorithmes d\'apprentissage automatique aux réseaux de neurones profonds, explorez comment l\'IA révolutionne les processus industriels.',
          keywords: ['Machine Learning', 'Deep Learning', 'IA industrielle', 'Algorithmes'],
          icon: '🤖'
        },
        {
          title: 'Technologies Durables',
          description: 'Énergies renouvelables, efficacité énergétique, technologies vertes',
          details: 'Focus sur les technologies qui contribuent à un avenir durable. Énergies renouvelables, efficacité énergétique, et innovations vertes qui façonnent l\'industrie de demain.',
          keywords: ['Énergies renouvelables', 'Efficacité énergétique', 'Technologies vertes', 'Durabilité'],
          icon: '🌱'
        },
        {
          title: 'Robotique Avancée',
          description: 'Robotique collaborative, robotique mobile, systèmes autonomes',
          details: 'Explorez l\'avenir de la robotique industrielle avec les robots collaboratifs, la robotique mobile et les systèmes autonomes qui transforment les environnements de travail.',
          keywords: ['Robotique collaborative', 'Robots mobiles', 'Systèmes autonomes', 'Cobots'],
          icon: '🦾'
        },
        {
          title: 'Environnement et Écologie',
          description: 'Gestion des déchets, pollution, développement durable',
          details: 'Abordez les défis environnementaux contemporains avec des solutions innovantes pour la gestion des déchets, la réduction de la pollution et le développement durable.',
          keywords: ['Gestion des déchets', 'Contrôle pollution', 'Développement durable', 'Écologie industrielle'],
          icon: '🌍'
        },
        {
          title: 'Smart Cities',
          description: 'Villes intelligentes, mobilité urbaine, infrastructure connectée',
          details: 'Découvrez comment les technologies intelligentes transforment nos villes avec des solutions innovantes pour la mobilité urbaine et les infrastructures connectées.',
          keywords: ['Villes intelligentes', 'Mobilité urbaine', 'Infrastructure connectée', 'IoT urbain'],
          icon: '🏙️'
        }
      ],
      actions: {
        submit: 'Soumettre dans ce thème',
        details: 'Voir les détails',
        examples: 'Voir des exemples'
      }
    },
    en: {
      title: 'Conference Themes',
      subtitle: 'Explore our research themes',
      themes: [
        {
          title: 'Industry 4.0 & IoT',
          description: 'Internet of Things, cyber-physical systems, industrial automation',
          details: 'This session covers the latest advances in industrial Internet of Things, cyber-physical systems and intelligent automation. We will explore how these technologies are transforming production processes and creating new efficiency opportunities.',
          keywords: ['Industrial IoT', 'Cyber-physical systems', 'Automation', 'Industry 4.0'],
          icon: '🏭'
        },
        {
          title: 'Artificial Intelligence',
          description: 'Machine learning, deep learning, AI applied to industry',
          details: 'Discover practical applications of artificial intelligence in modern industry. From machine learning algorithms to deep neural networks, explore how AI is revolutionizing industrial processes.',
          keywords: ['Machine Learning', 'Deep Learning', 'Industrial AI', 'Algorithms'],
          icon: '🤖'
        },
        {
          title: 'Sustainable Technologies',
          description: 'Renewable energy, energy efficiency, green technologies',
          details: 'Focus on technologies that contribute to a sustainable future. Renewable energy, energy efficiency, and green innovations shaping tomorrow\'s industry.',
          keywords: ['Renewable energy', 'Energy efficiency', 'Green technologies', 'Sustainability'],
          icon: '🌱'
        },
        {
          title: 'Advanced Robotics',
          description: 'Collaborative robotics, mobile robotics, autonomous systems',
          details: 'Explore the future of industrial robotics with collaborative robots, mobile robotics and autonomous systems transforming work environments.',
          keywords: ['Collaborative robotics', 'Mobile robots', 'Autonomous systems', 'Cobots'],
          icon: '🦾'
        },
        {
          title: 'Environment & Ecology',
          description: 'Waste management, pollution, sustainable development',
          details: 'Address contemporary environmental challenges with innovative solutions for waste management, pollution reduction and sustainable development.',
          keywords: ['Waste management', 'Pollution control', 'Sustainable development', 'Industrial ecology'],
          icon: '🌍'
        },
        {
          title: 'Smart Cities',
          description: 'Smart cities, urban mobility, connected infrastructure',
          details: 'Discover how smart technologies are transforming our cities with innovative solutions for urban mobility and connected infrastructure.',
          keywords: ['Smart cities', 'Urban mobility', 'Connected infrastructure', 'Urban IoT'],
          icon: '🏙️'
        }
      ],
      actions: {
        submit: 'Submit in this theme',
        details: 'View details',
        examples: 'View examples'
      }
    }
  };

  const handleSubmit = (theme: string) => {
    window.open('https://site-conf.com/call-for-papers', '_blank');
  };

  const showExamples = (theme: string) => {
    toast({
      title: language === 'fr' ? 'Exemples d\'articles' : 'Paper Examples',
      description: language === 'fr' 
        ? `Voici des exemples d'articles pour le thème "${theme}". Consultez notre site web pour plus de détails.`
        : `Here are paper examples for the theme "${theme}". Check our website for more details.`,
    });
    
    // Simulation d'ouverture d'une page d'exemples
    setTimeout(() => {
      window.open(`https://site-conf.com/examples/${encodeURIComponent(theme.toLowerCase())}`, '_blank');
    }, 1000);
  };

  const downloadGuide = (theme: string) => {
    toast({
      title: language === 'fr' ? 'Téléchargement du guide' : 'Guide Download',
      description: language === 'fr' 
        ? `Téléchargement du guide de soumission pour "${theme}" en cours...`
        : `Downloading submission guide for "${theme}"...`,
    });
    
    // Simulation de téléchargement
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `SITE2025_Guide_${theme.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: language === 'fr' ? 'Téléchargement terminé' : 'Download Complete',
        description: language === 'fr' ? 'Le guide a été téléchargé.' : 'The guide has been downloaded.',
      });
    }, 2000);
  };

  return (
    <section id="themes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content[language].subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content[language].themes.map((theme, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{theme.icon}</span>
                    <CardTitle className="text-lg text-primary group-hover:text-primary/80 transition-colors">
                      {theme.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {theme.description}
                  </p>
                  
                  <div className="space-y-2">
                    <Modal
                      trigger={
                        <Button variant="outline" size="sm" className="w-full">
                          {content[language].actions.details}
                        </Button>
                      }
                      title={theme.title}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-2xl">
                          <span>{theme.icon}</span>
                          <h3 className="text-xl font-semibold">{theme.title}</h3>
                        </div>
                        
                        <p className="text-muted-foreground">{theme.details}</p>
                        
                        <div>
                          <h4 className="font-semibold mb-2">
                            {language === 'fr' ? 'Mots-clés:' : 'Keywords:'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {theme.keywords.map((keyword, idx) => (
                              <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button onClick={() => handleSubmit(theme.title)} className="flex-1">
                            <FileText className="w-4 h-4 mr-2" />
                            {content[language].actions.submit}
                          </Button>
                          <Button variant="outline" onClick={() => showExamples(theme.title)} className="flex-1">
                            <Users className="w-4 h-4 mr-2" />
                            {content[language].actions.examples}
                          </Button>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => downloadGuide(theme.title)}
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {language === 'fr' ? 'Télécharger le guide' : 'Download Guide'}
                        </Button>
                      </div>
                    </Modal>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmit(theme.title)}
                      className="w-full"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      {content[language].actions.submit}
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

export default Themes;
