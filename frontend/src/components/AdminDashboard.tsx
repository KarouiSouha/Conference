import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, Calendar, Settings, Eye, Edit, Trash2, Plus, Send, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  language: 'fr' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  type Registration = {
    id: number;
    name: string;
    email: string;
    status: string;
    date: string;
  };

  type Submission = {
    id: number;
    title: string;
    author: string;
    theme: string;
    status: string;
  };

  type News = {
    id: number;
    title: string;
    content: string;
    status: string;
    date: string;
  };

  const [editingItem, setEditingItem] = useState<Registration | Submission | News | null>(null);
  const [editingType, setEditingType] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  
  // États pour les formulaires d'inscription
  const [showAddRegistration, setShowAddRegistration] = useState(false);
  const [newRegistration, setNewRegistration] = useState({
    name: '',
    email: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  });

  // États pour les formulaires de soumission
  const [showAddSubmission, setShowAddSubmission] = useState(false);
  const [newSubmission, setNewSubmission] = useState({
    title: '',
    author: '',
    theme: 'IA',
    status: 'under_review'
  });

  // États pour les paramètres de conférence
  const [conferenceSettings, setConferenceSettings] = useState({
    startDate: '2025-05-15',
    endDate: '2025-05-17',
    location: 'ISET Bizerte',
    contactEmail: 'contact@site-conf.com',
    submissionDeadline: '2025-02-15',
    maxFileSize: 10
  });

  const { toast } = useToast();

  // Données simulées
  const [registrations, setRegistrations] = useState([
    { id: 1, name: 'Dr. Ahmed Ben Ali', email: 'ahmed.benali@email.com', status: 'confirmed', date: '2024-12-01' },
    { id: 2, name: 'Prof. Sarah Johnson', email: 'sarah.johnson@email.com', status: 'pending', date: '2024-12-02' },
    { id: 3, name: 'Ing. Mohamed Trabelsi', email: 'mohamed.trabelsi@email.com', status: 'confirmed', date: '2024-12-03' }
  ]);

  const [submissions, setSubmissions] = useState([
    { id: 1, title: 'AI in Smart Manufacturing', author: 'Dr. Ahmed Ben Ali', status: 'under_review', theme: 'IA' },
    { id: 2, title: 'Sustainable Energy Solutions', author: 'Prof. Sarah Johnson', status: 'accepted', theme: 'Environnement' },
    { id: 3, title: 'IoT Security Framework', author: 'Ing. Mohamed Trabelsi', status: 'rejected', theme: 'IoT' }
  ]);

  const [newsItems, setNewsItems] = useState([
    { id: 1, title: 'Ouverture des soumissions', content: 'Les soumissions sont maintenant ouvertes', status: 'published', date: '2024-12-01' },
    { id: 2, title: 'Nouveau partenaire', content: 'Partenariat avec IEEE', status: 'draft', date: '2024-12-02' }
  ]);

  const content = {
    fr: {
      title: 'Administration SITE 2025',
      login: 'Connexion',
      email: 'Email',
      password: 'Mot de passe',
      signin: 'Se connecter',
      logout: 'Déconnexion',
      dashboard: 'Tableau de bord',
      registrations: 'Inscriptions',
      submissions: 'Soumissions',
      news: 'Actualités',
      settings: 'Paramètres',
      stats: {
        totalRegistrations: 'Inscriptions totales',
        totalSubmissions: 'Soumissions totales',
        pendingReviews: 'En attente de révision',
        publishedNews: 'Actualités publiées'
      },
      actions: {
        view: 'Voir',
        edit: 'Modifier',
        delete: 'Supprimer',
        add: 'Ajouter',
        save: 'Sauvegarder',
        cancel: 'Annuler',
        approve: 'Approuver',
        reject: 'Rejeter',
        publish: 'Publier'
      },
      status: {
        confirmed: 'Confirmé',
        pending: 'En attente',
        under_review: 'En révision',
        accepted: 'Accepté',
        rejected: 'Rejeté',
        published: 'Publié',
        draft: 'Brouillon'
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
      dashboard: 'Dashboard',
      registrations: 'Registrations',
      submissions: 'Submissions',
      news: 'News',
      settings: 'Settings',
      stats: {
        totalRegistrations: 'Total Registrations',
        totalSubmissions: 'Total Submissions',
        pendingReviews: 'Pending Reviews',
        publishedNews: 'Published News'
      },
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        save: 'Save',
        cancel: 'Cancel',
        approve: 'Approve',
        reject: 'Reject',
        publish: 'Publish'
      },
      status: {
        confirmed: 'Confirmed',
        pending: 'Pending',
        under_review: 'Under Review',
        accepted: 'Accepted',
        rejected: 'Rejected',
        published: 'Published',
        draft: 'Draft'
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

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:8000/api'; // Remplacez par votre URL d'API

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
    
    // Nettoyer le stockage de session
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');

    toast({
      title: language === 'fr' ? 'Déconnexion' : 'Logout',
      description: language === 'fr' ? 'Vous avez été déconnecté avec succès' : 'You have been logged out successfully',
    });
  };

  const handleView = (item: Registration | Submission | News, type: string) => {
    toast({
      title: `${content[language].actions.view} ${type}`,
      description: `Affichage des détails de: ${'name' in item ? item.name : item.title}`,
    });
  };

  const handleEdit = (item: Registration | Submission | News, type: string) => {
    setEditingItem(item);
    setEditingType(type);
    setShowEditForm(true);
    
    if (type === 'news') {
      setNewItemTitle((item as News).title);
      setNewItemContent((item as News).content);
    } else if (type === 'registration') {
      setNewRegistration({
        name: (item as Registration).name,
        email: (item as Registration).email,
        status: (item as Registration).status,
        date: (item as Registration).date
      });
    } else if (type === 'submission') {
      setNewSubmission({
        title: (item as Submission).title,
        author: (item as Submission).author,
        theme: (item as Submission).theme,
        status: (item as Submission).status
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingType === 'registration') {
      setRegistrations(registrations.map(r => 
        r.id === editingItem.id ? { ...r, ...newRegistration } : r
      ));
    } else if (editingType === 'submission') {
      setSubmissions(submissions.map(s => 
        s.id === editingItem.id ? { ...s, ...newSubmission } : s
      ));
    } else if (editingType === 'news') {
      setNewsItems(newsItems.map(n => 
        n.id === editingItem.id ? { ...n, title: newItemTitle, content: newItemContent } : n
      ));
    }
    
    setShowEditForm(false);
    setEditingItem(null);
    setNewItemTitle('');
    setNewItemContent('');
    setNewRegistration({ name: '', email: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
    setNewSubmission({ title: '', author: '', theme: 'IA', status: 'under_review' });
    
    toast({
      title: language === 'fr' ? 'Modifié' : 'Modified',
      description: language === 'fr' ? 'Élément modifié avec succès' : 'Item modified successfully',
    });
  };

  const handleDelete = (id: number, type: string) => {
    if (type === 'registration') {
      setRegistrations(registrations.filter(r => r.id !== id));
    } else if (type === 'submission') {
      setSubmissions(submissions.filter(s => s.id !== id));
    } else if (type === 'news') {
      setNewsItems(newsItems.filter(n => n.id !== id));
    }
    
    toast({
      title: language === 'fr' ? 'Supprimé' : 'Deleted',
      description: language === 'fr' ? 'L\'élément a été supprimé' : 'Item has been deleted',
    });
  };

  const handleApprove = (id: number) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'accepted' } : s
    ));
    toast({
      title: language === 'fr' ? 'Approuvé' : 'Approved',
      description: language === 'fr' ? 'Soumission approuvée' : 'Submission approved',
    });
  };

  const handleReject = (id: number) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'rejected' } : s
    ));
    toast({
      title: language === 'fr' ? 'Rejeté' : 'Rejected',
      description: language === 'fr' ? 'Soumission rejetée' : 'Submission rejected',
    });
  };

  const handlePublish = (id: number) => {
    setNewsItems(newsItems.map(n => 
      n.id === id ? { ...n, status: 'published' } : n
    ));
    toast({
      title: language === 'fr' ? 'Publié' : 'Published',
      description: language === 'fr' ? 'Actualité publiée' : 'News published',
    });
  };

  const handleAdd = (type: string) => {
    if (type === 'news') {
      if (!newItemTitle) return;
      
      const newItem = {
        id: Date.now(),
        title: newItemTitle,
        content: newItemContent,
        status: 'draft',
        date: new Date().toISOString().split('T')[0]
      };

      setNewsItems([...newsItems, newItem]);
    } else if (type === 'registration') {
      if (!newRegistration.name || !newRegistration.email) return;
      
      const newItem = {
        id: Date.now(),
        ...newRegistration
      };

      setRegistrations([...registrations, newItem]);
    } else if (type === 'submission') {
      if (!newSubmission.title || !newSubmission.author) return;
      
      const newItem = {
        id: Date.now(),
        ...newSubmission
      };

      setSubmissions([...submissions, newItem]);
    }

    setNewItemTitle('');
    setNewItemContent('');
    setNewRegistration({ name: '', email: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
    setNewSubmission({ title: '', author: '', theme: 'IA', status: 'under_review' });
    setShowAddForm(false);
    setShowAddRegistration(false);
    setShowAddSubmission(false);
    
    toast({
      title: language === 'fr' ? 'Ajouté' : 'Added',
      description: language === 'fr' ? 'Nouvel élément ajouté' : 'New item added',
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: language === 'fr' ? 'Paramètres sauvegardés' : 'Settings Saved',
      description: language === 'fr' ? 'Les paramètres ont été sauvegardés avec succès' : 'Settings have been saved successfully',
    });
  };

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

  return (
    <section id="admin" className="py-20 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">
              {content[language].dashboard}
            </h2>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              {content[language].logout}
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{registrations.length}</div>
                <div className="text-sm text-muted-foreground">
                  {content[language].stats.totalRegistrations}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{submissions.length}</div>
                <div className="text-sm text-muted-foreground">
                  {content[language].stats.totalSubmissions}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {submissions.filter(s => s.status === 'under_review').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {content[language].stats.pendingReviews}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {newsItems.filter(n => n.status === 'published').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {content[language].stats.publishedNews}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="registrations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registrations">{content[language].registrations}</TabsTrigger>
              <TabsTrigger value="submissions">{content[language].submissions}</TabsTrigger>
              <TabsTrigger value="news">{content[language].news}</TabsTrigger>
              <TabsTrigger value="settings">{content[language].settings}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="registrations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{content[language].registrations}</CardTitle>
                  <Button size="sm" onClick={() => setShowAddRegistration(!showAddRegistration)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {content[language].actions.add}
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddRegistration && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder={language === 'fr' ? 'Nom complet' : 'Full Name'}
                          value={newRegistration.name}
                          onChange={(e) => setNewRegistration({...newRegistration, name: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={newRegistration.email}
                          onChange={(e) => setNewRegistration({...newRegistration, email: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <select
                          value={newRegistration.status}
                          onChange={(e) => setNewRegistration({...newRegistration, status: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                        </select>
                        <input
                          type="date"
                          value={newRegistration.date}
                          onChange={(e) => setNewRegistration({...newRegistration, date: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAdd('registration')}>
                          {content[language].actions.save}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddRegistration(false)}>
                          {content[language].actions.cancel}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {registrations.map((registration) => (
                      <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{registration.name}</span>
                          <div className="text-sm text-muted-foreground">{registration.email}</div>
                          <div className="text-xs text-muted-foreground">
                            {content[language].status[registration.status as keyof typeof content[typeof language]['status']]} - {registration.date}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(registration, 'registration')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(registration, 'registration')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(registration.id, 'registration')}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="submissions">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{content[language].submissions}</CardTitle>
                  <Button size="sm" onClick={() => setShowAddSubmission(!showAddSubmission)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {content[language].actions.add}
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddSubmission && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder={language === 'fr' ? 'Titre de la soumission' : 'Submission Title'}
                          value={newSubmission.title}
                          onChange={(e) => setNewSubmission({...newSubmission, title: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder={language === 'fr' ? 'Nom de l\'auteur' : 'Author Name'}
                          value={newSubmission.author}
                          onChange={(e) => setNewSubmission({...newSubmission, author: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <select
                          value={newSubmission.theme}
                          onChange={(e) => setNewSubmission({...newSubmission, theme: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          <option value="IA">IA</option>
                          <option value="IoT">IoT</option>
                          <option value="Environnement">Environnement</option>
                          <option value="Industrie 4.0">Industrie 4.0</option>
                          <option value="Énergie">Énergie</option>
                        </select>
                        <select
                          value={newSubmission.status}
                          onChange={(e) => setNewSubmission({...newSubmission, status: e.target.value})}
                          className="w-full p-2 border rounded"
                        >
                          <option value="under_review">En révision</option>
                          <option value="accepted">Accepté</option>
                          <option value="rejected">Rejeté</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAdd('submission')}>
                          {content[language].actions.save}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddSubmission(false)}>
                          {content[language].actions.cancel}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{submission.title}</h4>
                          <p className="text-sm text-muted-foreground">{submission.author}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {submission.theme}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              submission.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {content[language].status[submission.status as keyof typeof content[typeof language]['status']]}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(submission, 'submission')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {submission.status === 'under_review' && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => handleApprove(submission.id)}>
                                <Check className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleReject(submission.id)}>
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(submission.id, 'submission')}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="news">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{content[language].news}</CardTitle>
                  <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {content[language].actions.add}
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddForm && (
                    <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                      <input
                        type="text"
                        placeholder="Titre de l'actualité"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                      />
                      <textarea
                        placeholder="Contenu de l'actualité"
                        value={newItemContent}
                        onChange={(e) => setNewItemContent(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAdd('news')}>
                          {content[language].actions.save}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                          {content[language].actions.cancel}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {newsItems.map((news) => (
                      <div key={news.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{news.title}</h4>
                          <p className="text-sm text-muted-foreground">{news.content}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              news.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {content[language].status[news.status as keyof typeof content[typeof language]['status']]}
                            </span>
                            <span className="text-xs text-muted-foreground">{news.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(news, 'news')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(news, 'news')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          {news.status === 'draft' && (
                            <Button size="sm" variant="ghost" onClick={() => handlePublish(news.id)}>
                              <Send className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(news.id, 'news')}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>{content[language].settings}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        {language === 'fr' ? 'Configuration de la conférence' : 'Conference Configuration'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'fr' ? 'Date de début' : 'Start Date'}
                          </label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded" 
                            value={conferenceSettings.startDate}
                            onChange={(e) => setConferenceSettings({...conferenceSettings, startDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'fr' ? 'Date de fin' : 'End Date'}
                          </label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded" 
                            value={conferenceSettings.endDate}
                            onChange={(e) => setConferenceSettings({...conferenceSettings, endDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'fr' ? 'Lieu' : 'Location'}
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            value={conferenceSettings.location}
                            onChange={(e) => setConferenceSettings({...conferenceSettings, location: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'fr' ? 'Email de contact' : 'Contact Email'}
                          </label>
                          <input 
                            type="email" 
                            className="w-full p-2 border rounded" 
                            value={conferenceSettings.contactEmail}
                            onChange={(e) => setConferenceSettings({...conferenceSettings, contactEmail: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">
                        {language === 'fr' ? 'Paramètres de soumission' : 'Submission Settings'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'fr' ? 'Date limite de soumission' : 'Submission Deadline'}
                          </label>
                          <input 
                            type="date" 
                            className="w-full p-2 border rounded" 
                            value={conferenceSettings.submissionDeadline}
                            onChange={(e) => setConferenceSettings({...conferenceSettings, submissionDeadline: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            {language === 'fr' ? 'Taille max fichier (MB)' : 'Max File Size (MB)'}
                          </label>
                          <input 
                            type="number" 
                            className="w-full p-2 border rounded" 
                            value={conferenceSettings.maxFileSize}
                            onChange={(e) => setConferenceSettings({...conferenceSettings, maxFileSize: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="mt-4" onClick={handleSaveSettings}>
                      {language === 'fr' ? 'Sauvegarder les paramètres' : 'Save Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal de modification */}
          {showEditForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'fr' ? 'Modifier' : 'Edit'} {editingType}
                </h3>
                
                {editingType === 'registration' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={language === 'fr' ? 'Nom complet' : 'Full Name'}
                      value={newRegistration.name}
                      onChange={(e) => setNewRegistration({...newRegistration, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newRegistration.email}
                      onChange={(e) => setNewRegistration({...newRegistration, email: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <select
                      value={newRegistration.status}
                      onChange={(e) => setNewRegistration({...newRegistration, status: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmé</option>
                    </select>
                  </div>
                )}

                {editingType === 'submission' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={language === 'fr' ? 'Titre de la soumission' : 'Submission Title'}
                      value={newSubmission.title}
                      onChange={(e) => setNewSubmission({...newSubmission, title: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder={language === 'fr' ? 'Nom de l\'auteur' : 'Author Name'}
                      value={newSubmission.author}
                      onChange={(e) => setNewSubmission({...newSubmission, author: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                    <select
                      value={newSubmission.theme}
                      onChange={(e) => setNewSubmission({...newSubmission, theme: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="IA">IA</option>
                      <option value="IoT">IoT</option>
                      <option value="Environnement">Environnement</option>
                      <option value="Industrie 4.0">Industrie 4.0</option>
                      <option value="Énergie">Énergie</option>
                    </select>
                    <select
                      value={newSubmission.status}
                      onChange={(e) => setNewSubmission({...newSubmission, status: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="under_review">En révision</option>
                      <option value="accepted">Accepté</option>
                      <option value="rejected">Rejeté</option>
                    </select>
                  </div>
                )}
                
                {(editingType === 'news') && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Titre"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="Contenu"
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveEdit}>
                    {content[language].actions.save}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditForm(false)}>
                    {content[language].actions.cancel}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
