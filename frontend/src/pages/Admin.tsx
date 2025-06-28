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
import ContactManager from "@/components/admin/ContactManager"; // Ajout de l'importation
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

interface AdminProps {
  language?: 'fr' | 'en';
}

type AdminSection = 'dashboard' | 'partners' | 'speakers' | 'comitee' | 'news' | 'archives' | 'program' | 'themes' | 'participants' | 'contacts'; // Ajout de 'contacts'

const Admin: React.FC<AdminProps> = ({ language = 'fr' }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  interface User {
    id: number;
    name: string;
    email: string;
  }
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const { toast } = useToast();

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:8000/api';

  const content = {
    fr: {
      title: 'Administration SITE 2025',
      subtitle: 'Connectez-vous à votre espace administrateur',
      login: 'Connexion',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      signin: 'Se connecter',
      logout: 'Déconnexion',
      secureLogin: 'Connexion sécurisée',
      sections: {
        dashboard: 'Tableau de bord',
        partners: 'Partenaires',
        speakers: 'Conférenciers',
        comitee: 'Comité',
        news: 'Actualités',
        archives: 'Archives',
        program: 'Programme',
        themes: 'Thèmes',
        participants: 'Participants',
        contacts: 'Contacts' // Ajout de l'entrée pour "Contacts"
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
      subtitle: 'Sign in to your admin dashboard',
      login: 'Login',
      email: 'Email address',
      password: 'Password',
      signin: 'Sign In',
      logout: 'Logout',
      secureLogin: 'Secure Login',
      sections: {
        dashboard: 'Dashboard',
        partners: 'Partners',
        speakers: 'Speakers',
        comitee: 'Committee',
        news: 'News',
        archives: 'Archives',
        program: 'Program',
        themes: 'Themes',
        participants: 'Participants',
        contacts: 'Contacts' // Ajout de l'entrée pour "Contacts"
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
        setIsLoggedIn(true);
        setAuthToken(data.access_token);
        setUser(data.user);

        toast({
          title: content[language].success.loginSuccess,
          description: content[language].success.welcomeMessage,
        });
      } else {
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
      case 'speakers':
        return <SpeakersManager />;
      case 'partners':
        return <PartnersManager />;
      case 'comitee':
        return <ComiteeManager language={language} />;
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
      case 'contacts': // Ajout du cas pour "contacts"
        return <ContactManager language={language} />; // Assurez-vous que ContactManager accepte 'language' comme prop
      default:
        return <AdminStats />;
    }
  };

  // Affichage du formulaire de connexion professionnel
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        {/* Accent subtil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]"></div>

        {/* Conteneur principal */}
        <div className="relative w-full max-w-md">
          {/* En-tête avec logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {content[language].title}
            </h1>
            <p className="text-slate-600">
              {content[language].subtitle}
            </p>
          </div>

          {/* Carte de connexion */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="pb-6 pt-8 px-8">
              <CardTitle className="text-xl font-semibold text-slate-900 text-center">
                {content[language].login}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                {/* Champ Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {content[language].email}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-colors duration-200 placeholder-slate-400 ${focusedField === 'email'
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-300 hover:border-slate-400'
                        }`}
                      disabled={isLoading}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {content[language].password}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-11 pr-12 py-3 bg-white border rounded-lg focus:outline-none transition-colors duration-200 placeholder-slate-400 ${focusedField === 'password'
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-300 hover:border-slate-400'
                        }`}
                      disabled={isLoading}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Bouton de connexion */}
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleLogin}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{language === 'fr' ? 'Connexion...' : 'Signing in...'}</span>
                      </div>
                    ) : (
                      <span>{content[language].signin}</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Informations de sécurité */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>{content[language].secureLogin}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer professionnel */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-600 font-medium mb-1">
              © 2025 SITE Conference
            </p>
            <p className="text-xs text-slate-500">
              {language === 'fr' ? 'Système d\'administration sécurisé' : 'Secure administration system'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'interface d'administration si connecté
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AdminSidebar
        language={language}
        user={user}
        onLogout={handleLogout}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main className="flex-1 p-6 overflow-y-auto md:ml-0">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default Admin;