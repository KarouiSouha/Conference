import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import PartnersManager from "@/components/admin/PartnersManager";
import SpeakersManager from "@/components/admin/SpeakersManager";
import ComiteeManager from "@/components/admin/ComiteeManager";
import NewsManager from "@/components/admin/NewsManager";
import ArchivesManager from "@/components/admin/ArchivesManager";
import ProgramManager from "@/components/admin/ProgramManager";
import ThemesManager from "@/components/admin/ThemesManager";
import ParticipantsManager from "@/components/admin/ParticipantsManager";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminProps {
  language?: 'fr' | 'en';
}

type AdminSection = 'dashboard' | 'partners' | 'speakers' | 'comitee' | 'news' | 'archives' | 'program' | 'themes' | 'participants';

const Admin: React.FC<AdminProps> = ({ language = 'fr' }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState('');
  interface User {
    id: number;
    name: string;
    email: string;
    // Add other user properties as needed
  }
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const { toast } = useToast();

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:8000/api'; // Remplacez par votre URL d'API

  const content = {
    fr: {
      title: 'Administration SITE 2025',
      login: 'Connexion',
      email: 'Email',
      password: 'Mot de passe',
      signin: 'Se connecter',
      logout: 'Déconnexion',
      sections: {
        dashboard: 'Tableau de bord',
        partners: 'Partenaires',
        speakers: 'Conférenciers',
        comitee: 'Comité',
        news: 'Actualités',
        archives: 'Archives',
        program: 'Programme',
        themes: 'Thèmes',
        participants: 'Participants'
      },
      errors: {
        loginFailed: 'Erreur de connexion',
        invalidCredentials: 'Email ou mot de passe incorrect',
        networkError: 'Erreur réseau. Vérifiez votre connexion.',
        requiredFields: 'Tous les champs sont requis'
      },
      success: {
        loginSuccess: 'Connexion réussie',
        welcomeMessage: 'Bienvenue dans l\'administration'
      }
    },
    en: {
      title: 'SITE 2025 Administration',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      signin: 'Sign In',
      logout: 'Logout',
      sections: {
        dashboard: 'Dashboard',
        partners: 'Partners',
        speakers: 'Speakers',
        comitee: 'Committee',
        news: 'News',
        archives: 'Archives',
        program: 'Program',
        themes: 'Themes',
        participants: 'Participants'
      },
      errors: {
        loginFailed: 'Login Failed',
        invalidCredentials: 'Invalid email or password',
        networkError: 'Network error. Please check your connection.',
        requiredFields: 'All fields are required'
      },
      success: {
        loginSuccess: 'Login Successful',
        welcomeMessage: 'Welcome to the administration panel'
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs
    if (!email || !password) {
      toast({
        title: content[language].errors.loginFailed,
        description: content[language].errors.requiredFields,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion réussie
        setIsLoggedIn(true);
        setAuthToken(data.access_token);
        setUser(data.user);
        
        // Stocker le token pour les requêtes futures (optionnel, en mémoire seulement)
        sessionStorage.setItem('auth_token', data.access_token);
        sessionStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: content[language].success.loginSuccess,
          description: content[language].success.welcomeMessage,
        });
      } else {
        // Erreur de connexion
        toast({
          title: content[language].errors.loginFailed,
          description: data.message || content[language].errors.invalidCredentials,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: content[language].errors.loginFailed,
        description: content[language].errors.networkError,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthToken('');
    setUser(null);
    setEmail('');
    setPassword('');
    setActiveSection('dashboard');
    
    // Nettoyer le stockage de session
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');

    toast({
      title: language === 'fr' ? 'Déconnexion' : 'Logout',
      description: language === 'fr' ? 'Vous avez été déconnecté avec succès' : 'You have been logged out successfully',
    });
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section as AdminSection);
  };

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminStats />;
      case 'partners':
        return <PartnersManager />;
      case 'speakers':
        return <SpeakersManager />;
      case 'comitee':
        return <ComiteeManager />;
      case 'news':
        return <NewsManager />;
      case 'archives':
        return <ArchivesManager />;
      case 'program':
        return <ProgramManager />;
      case 'themes':
        return <ThemesManager />;
      case 'participants':
        return <ParticipantsManager />;
      default:
        return <AdminStats />;
    }
  };

  // Affichage du formulaire de connexion si non connecté
  if (!isLoggedIn) {
    return (
      <section id="admin" className="py-20 bg-muted/30 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-primary">
                  {content[language].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {content[language].email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={isLoading}
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {content[language].password}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {language === 'fr' ? 'Connexion...' : 'Signing in...'}
                      </div>
                    ) : (
                      content[language].signin
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Affichage de l'interface d'administration si connecté
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Sidebar avec fonctionnalité de déconnexion intégrée */}
      <AdminSidebar
        language={language}
        user={user}
        onLogout={handleLogout}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-y-auto md:ml-0">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default Admin;