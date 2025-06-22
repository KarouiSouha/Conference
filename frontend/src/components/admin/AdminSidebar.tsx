import { useEffect, useState } from "react";
import {
  BarChart3, Users, Mic, Building2, Newspaper, Archive, Calendar, Tags, UserCheck,
  ChevronLeft, ChevronRight, Bell, Settings, User, LogOut, Home, Search, Menu, X,
  AlertTriangle
} from "lucide-react";

interface AdminSidebarProps {
  language?: 'fr' | 'en';
  user?: {
    name?: string;
    email?: string;
  };
  onLogout?: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function AdminSidebar({
  language = 'fr',
  user,
  onLogout,
  activeSection = '/admin',
  onSectionChange
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [counts, setCounts] = useState({
    partners: null,
    speakers: null,
    news: null,
    participants: null
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Simulation des appels API - remplacez par vos vrais appels
        const mockData = {
          partners: { data: { total_partners: 12 } },
          speakers: { data: { total_speakers: 25 } },
          news: { data: { total_news: 8 } },
          participants: { data: { total_registrations: 156 } }
        };
        
        setCounts({
          partners: mockData.partners.data.total_partners,
          speakers: mockData.speakers.data.total_speakers,
          news: mockData.news.data.total_news,
          participants: mockData.participants.data.total_registrations
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      }
    }

    fetchCounts();
  }, []);

  const content = {
    fr: {
      title: "Espace Admin",
      subtitle: "Conférence 2025",
      search: "Rechercher...",
      navigation: "Navigation",
      logout: "Déconnexion",
      confirmLogout: "Confirmer la déconnexion",
      logoutMessage: "Êtes-vous sûr de vouloir vous déconnecter ? Votre session sera fermée et vous devrez vous reconnecter pour accéder à l'espace administration.",
      cancel: "Annuler",
      confirm: "Se déconnecter",
      menuItems: [
        { title: "Tableau de bord", url: "dashboard", icon: BarChart3, badge: null, description: "Vue d'ensemble" },
        { title: "Partenaires", url: "partners", icon: Building2, badge: counts.partners?.toString() || null, description: "Gestion des partenaires" },
        { title: "Intervenants", url: "speakers", icon: Mic, badge: counts.speakers?.toString() || null, description: "Conférenciers et experts" },
        { title: "Comités", url: "comitee", icon: Users, badge: null, description: "Équipes organisatrices" },
        { title: "Actualités", url: "news", icon: Newspaper, badge: counts.news?.toString() || null, description: "Articles et annonces" },
        { title: "Archives", url: "archives", icon: Archive, badge: null, description: "Données historiques" },
        { title: "Programme", url: "program", icon: Calendar, badge: "NEW", description: "Planning des événements" },
        { title: "Thèmes", url: "themes", icon: Tags, badge: null, description: "Sujets de recherche" },
        { title: "Participants", url: "participants", icon: UserCheck, badge: counts.participants?.toString() || null, description: "Inscrits à l'événement" },
      ]
    },
    en: {
      title: "AdminSpace",
      subtitle: "Conference 2024",
      search: "Search...",
      navigation: "Navigation",
      logout: "Logout",
      confirmLogout: "Confirm logout",
      logoutMessage: "Are you sure you want to logout? Your session will be closed and you will need to log back in to access the admin area.",
      cancel: "Cancel",
      confirm: "Logout",
      menuItems: [
        { title: "Dashboard", url: "dashboard", icon: BarChart3, badge: null, description: "Overview" },
        { title: "Partners", url: "partners", icon: Building2, badge: counts.partners?.toString() || null, description: "Partners management" },
        { title: "Speakers", url: "speakers", icon: Mic, badge: counts.speakers?.toString() || null, description: "Speakers and experts" },
        { title: "Committee", url: "comitee", icon: Users, badge: null, description: "Organizing teams" },
        { title: "News", url: "news", icon: Newspaper, badge: counts.news?.toString() || null, description: "Articles and announcements" },
        { title: "Archives", url: "archives", icon: Archive, badge: null, description: "Historical data" },
        { title: "Program", url: "program", icon: Calendar, badge: "NEW", description: "Event schedule" },
        { title: "Themes", url: "themes", icon: Tags, badge: null, description: "Research topics" },
        { title: "Participants", url: "participants", icon: UserCheck, badge: counts.participants?.toString() || null, description: "Event registrants" },
      ]
    }
  };

  const menuItems = content[language].menuItems;

  const navigate = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    setMobileOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActive = (section: string) => activeSection === section;

  const filteredMenuItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal de déconnexion
  const LogoutModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 transform animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-slate-700/50">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {content[language].confirmLogout}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 leading-relaxed">
            {content[language].logoutMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-700/50">
          <button
            onClick={handleCancelLogout}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 font-medium"
          >
            {content[language].cancel}
          </button>
          <button
            onClick={handleConfirmLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25 hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>{content[language].confirm}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className={`p-6 border-b border-slate-700/50 ${collapsed ? 'px-4' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {content[language].title}
                </h2>
                <p className="text-slate-400 text-sm">{content[language].subtitle}</p>
              </div>
            )}
          </div>
          
          {/* Toggle button - Desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg items-center justify-center transition-all duration-200 hover:scale-105"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-300" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-300" />
            )}
          </button>

          {/* Close button - Mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all duration-200"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
        <div className="px-4 space-y-2">
          {!collapsed && searchTerm === "" && (
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-3 mb-4">
              {content[language].navigation}
            </div>
          )}
          
          {filteredMenuItems.map((item, index) => (
            <div
              key={item.url}
              className="relative group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => navigate(item.url)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                  isActive(item.url)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className={`flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
                  <item.icon className={`h-5 w-5 ${isActive(item.url) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                </div>
                
                {!collapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-300">
                        {item.description}
                      </div>
                    </div>
                    
                    {item.badge && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.badge === "NEW"
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                      }`}>
                        {item.badge}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.description}</div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Profile with Logout */}
      <div className={`border-t border-slate-700/50 p-4 ${collapsed ? 'px-2' : ''}`}>
        {collapsed ? (
          <div className="flex flex-col items-center space-y-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group relative">
              <User className="h-5 w-5 text-white" />
              {/* Tooltip for user info */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                <div className="font-medium text-sm">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-slate-400">{user?.email || 'admin@conference.com'}</div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick}
              className="w-10 h-10 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group relative"
              title={content[language].logout}
            >
              <LogOut className="h-4 w-4 text-white" />
              {/* Tooltip for logout */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-600">
                <div className="font-medium text-sm">{content[language].logout}</div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-slate-400 text-xs truncate">
                  {user?.email || 'admin@conference.com'}
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-red-500/25 group"
            >
              <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
              <span className="font-medium text-sm">{content[language].logout}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Styles globaux pour la scrollbar */}
      <style>{`
        /* Styles pour Webkit (Chrome, Safari, Edge) */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-track-slate-800::-webkit-scrollbar-track {
          background: rgb(30 41 59);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
          border-radius: 3px;
        }
        
        .hover\\:scrollbar-thumb-slate-500::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }
        
        /* Styles pour Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgb(71 85 105) rgb(30 41 59);
        }
        
        /* Styles supplémentaires pour une meilleure compatibilité */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgb(71 85 105) rgb(30 41 59);
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: rgb(30 41 59);
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }

        /* Animation pour la modal */
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-in {
          animation: animate-in 0.2s ease-out;
        }
        
        .fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .zoom-in {
          animation: zoom-in 0.2s ease-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
      `}</style>

      {/* Modal de déconnexion */}
      {showLogoutModal && <LogoutModal />}

      {/* Mobile Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:block fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-80'
      }`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* Content Spacer for Desktop */}
      <div className={`hidden md:block transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'}`} />
    </>
  );
}