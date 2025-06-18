import { useState } from "react";
import { Search, Plus, Edit, Trash, Tag, Eye, EyeOff, Settings, ArrowUpDown, Filter, MoreVertical, Star, Users, Calendar, TrendingUp, ChevronDown, Zap, Target, Activity } from "lucide-react";
import ThemeForm from "./ThemeForm";

interface Keyword {
  id: number;
  keywordFr: string;
  keywordEn: string;
}

interface Theme {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  sessions: number;
  lastUpdated: string;
  popularity: number;
  keywords: Keyword[];
}

export default function ThemesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("order");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  const [themes, setThemes] = useState<Theme[]>([
    {
      id: 1,
      titleFr: "Intelligence Artificielle",
      titleEn: "Artificial Intelligence",
      descriptionFr: "Recherches et applications en IA",
      descriptionEn: "AI research and applications",
      icon: "🤖",
      color: "#6366F1",
      order: 1,
      isActive: true,
      sessions: 23,
      lastUpdated: "2024-01-15",
      popularity: 95,
      keywords: [
        { id: 1, keywordFr: "apprentissage automatique", keywordEn: "machine learning" },
        { id: 2, keywordFr: "réseaux de neurones", keywordEn: "neural networks" },
        { id: 3, keywordFr: "traitement du langage", keywordEn: "natural language processing" },
      ],
    },
    {
      id: 2,
      titleFr: "Biotechnologies",
      titleEn: "Biotechnology",
      descriptionFr: "Innovations en biotechnologie moderne",
      descriptionEn: "Modern biotechnology innovations",
      icon: "🧬",
      color: "#10B981",
      order: 2,
      isActive: true,
      sessions: 18,
      lastUpdated: "2024-01-12",
      popularity: 78,
      keywords: [
        { id: 4, keywordFr: "génie génétique", keywordEn: "genetic engineering" },
        { id: 5, keywordFr: "thérapie génique", keywordEn: "gene therapy" },
      ],
    },
    {
      id: 3,
      titleFr: "Développement Durable",
      titleEn: "Sustainable Development",
      descriptionFr: "Solutions pour un avenir durable",
      descriptionEn: "Solutions for a sustainable future",
      icon: "🌱",
      color: "#059669",
      order: 3,
      isActive: false,
      sessions: 12,
      lastUpdated: "2024-01-08",
      popularity: 65,
      keywords: [
        { id: 6, keywordFr: "énergies renouvelables", keywordEn: "renewable energy" },
        { id: 7, keywordFr: "économie circulaire", keywordEn: "circular economy" },
      ],
    },
    {
      id: 4,
      titleFr: "Cybersécurité",
      titleEn: "Cybersecurity",
      descriptionFr: "Protection et sécurité numérique",
      descriptionEn: "Digital protection and security",
      icon: "🔒",
      color: "#EF4444",
      order: 4,
      isActive: true,
      sessions: 31,
      lastUpdated: "2024-01-16",
      popularity: 88,
      keywords: [
        { id: 8, keywordFr: "sécurité informatique", keywordEn: "computer security" },
        { id: 9, keywordFr: "cryptographie", keywordEn: "cryptography" },
      ],
    },
  ]);

  const toggleTheme = (id: number) => {
    setThemes(themes.map(theme => 
      theme.id === id ? { ...theme, isActive: !theme.isActive } : theme
    ));
  };

  const deleteTheme = (id: number) => {
    setThemes(themes.filter(theme => theme.id !== id));
    setSelectedThemes(selectedThemes.filter(themeId => themeId !== id));
  };

  const deleteSelectedThemes = () => {
    setThemes(themes.filter(theme => !selectedThemes.includes(theme.id)));
    setSelectedThemes([]);
  };

  const toggleSelectTheme = (id: number) => {
    setSelectedThemes(prev => 
      prev.includes(id) 
        ? prev.filter(themeId => themeId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedThemes.length === filteredThemes.length) {
      setSelectedThemes([]);
    } else {
      setSelectedThemes(filteredThemes.map(theme => theme.id));
    }
  };

  const handleOpenForm = (theme: Theme | null = null) => {
    setCurrentTheme(theme);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentTheme(null);
  };

  const handleSaveTheme = (themeData: Theme) => {
    if (themeData.id) {
      // Update existing theme
      setThemes(themes.map(t => t.id === themeData.id ? themeData : t));
    } else {
      // Create new theme
      const newTheme = {
        ...themeData,
        id: Math.max(...themes.map(t => t.id), 0) + 1,
        sessions: 0,
        popularity: 50,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setThemes([...themes, newTheme]);
    }
    handleCloseForm();
  };

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.keywords.some(k => 
                           k.keywordFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           k.keywordEn.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && theme.isActive) ||
                         (filterStatus === "inactive" && !theme.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const sortedThemes = [...filteredThemes].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.titleFr.localeCompare(b.titleFr);
      case "popularity": return b.popularity - a.popularity;
      case "sessions": return b.sessions - a.sessions;
      case "updated": return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default: return a.order - b.order;
    }
  });

  const stats = {
    total: themes.length,
    active: themes.filter(t => t.isActive).length,
    keywords: themes.reduce((acc, t) => acc + t.keywords.length, 0),
    sessions: themes.reduce((acc, t) => acc + t.sessions, 0),
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header moderne */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Tag className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Gestionnaire de Thèmes
                </h1>
                <p className="text-gray-600">Organisez et gérez vos thèmes de recherche</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              <button 
                onClick={() => handleOpenForm()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Thème</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques élégantes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: "Total Thèmes", 
              value: stats.total, 
              icon: Target, 
              gradient: "from-indigo-500 to-indigo-600",
              iconBg: "bg-indigo-100",
              iconColor: "text-indigo-600",
              change: "+2 ce mois"
            },
            { 
              label: "Thèmes Actifs", 
              value: stats.active, 
              icon: Activity, 
              gradient: "from-emerald-500 to-emerald-600",
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600",
              change: "+1 cette semaine"
            },
            { 
              label: "Mots-clés", 
              value: stats.keywords, 
              icon: Star, 
              gradient: "from-amber-500 to-amber-600",
              iconBg: "bg-amber-100",
              iconColor: "text-amber-600",
              change: "+5 nouveaux"
            },
            { 
              label: "Sessions", 
              value: stats.sessions, 
              icon: Zap, 
              gradient: "from-rose-500 to-rose-600",
              iconBg: "bg-rose-100",
              iconColor: "text-rose-600",
              change: "+12 aujourd'hui"
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.change}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`} 
                     style={{ width: `${(stat.value / Math.max(...[stats.total, stats.active, stats.keywords, stats.sessions])) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Barre d'outils raffinée */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un thème ou mot-clé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${
                  showFilters 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                >
                  <option value="order">Trier par ordre</option>
                  <option value="name">Trier par nom</option>
                  <option value="popularity">Trier par popularité</option>
                  <option value="sessions">Trier par sessions</option>
                  <option value="updated">Trier par date</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filtres avancés avec animation */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "all", label: "Tous les thèmes", count: themes.length },
                  { key: "active", label: "Actifs", count: themes.filter(t => t.isActive).length },
                  { key: "inactive", label: "Inactifs", count: themes.filter(t => !t.isActive).length }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterStatus(filter.key)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      filterStatus === filter.key
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      filterStatus === filter.key
                        ? 'bg-indigo-200 text-indigo-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions groupées */}
        {selectedThemes.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">{selectedThemes.length}</span>
                </div>
                <span className="text-indigo-800 font-medium">
                  {selectedThemes.length} thème{selectedThemes.length > 1 ? 's' : ''} sélectionné{selectedThemes.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setThemes(themes.map(t => 
                      selectedThemes.includes(t.id) ? { ...t, isActive: true } : t
                    ));
                    setSelectedThemes([]);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Activer
                </button>
                <button 
                  onClick={() => {
                    setThemes(themes.map(t => 
                      selectedThemes.includes(t.id) ? { ...t, isActive: false } : t
                    ));
                    setSelectedThemes([]);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Désactiver
                </button>
                <button 
                  onClick={deleteSelectedThemes}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des thèmes redesignée */}
        <div className="space-y-6">
          {sortedThemes.map((theme, index) => (
            <div
              key={theme.id}
              className="group bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-5 flex-1">
                    {/* Checkbox */}
                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme.id)}
                        onChange={() => toggleSelectTheme(theme.id)}
                        className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                    </div>
                    
                    {/* Icône améliorée */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        style={{ 
                          backgroundColor: theme.color + '15', 
                          border: `2px solid ${theme.color}40`,
                        }}
                      >
                        {theme.icon}
                      </div>
                      <div 
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: theme.color }}
                      >
                        {theme.order}
                      </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{theme.titleFr}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                              theme.isActive 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              {theme.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{theme.isActive ? 'Actif' : 'Inactif'}</span>
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mb-1">{theme.titleEn}</p>
                          <p className="text-gray-700 mb-2">{theme.descriptionFr}</p>
                          <p className="text-sm text-gray-500 italic">{theme.descriptionEn}</p>
                        </div>
                        
                        {/* Toggle switch */}
                        <div className="flex items-center ml-4">
                          <button
                            onClick={() => toggleTheme(theme.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              theme.isActive ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-lg ${
                                theme.isActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Métriques redesignées */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span><span className="font-semibold">{theme.sessions}</span> sessions</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-green-600" />
                          </div>
                          <span>{new Date(theme.lastUpdated).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                          </div>
                          <span><span className="font-semibold">{theme.popularity}%</span> popularité</span>
                        </div>
                      </div>

                      {/* Mots-clés redesignés */}
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-3 h-3 text-gray-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">Mots-clés</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {theme.keywords.map((keyword) => (
                            <div key={keyword.id} className="group relative">
                              <span 
                                className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                                style={{ 
                                  backgroundColor: theme.color + '15',
                                  color: theme.color,
                                  border: `1px solid ${theme.color}30`
                                }}
                              >
                                {keyword.keywordFr}
                              </span>
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                {keyword.keywordEn}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center space-y-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleOpenForm(theme)}
                        className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center hover:scale-110 duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteTheme(theme.id)}
                        className="w-9 h-9 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center hover:scale-110 duration-200"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center hover:scale-110 duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de popularité */}
              <div className="h-1 bg-gray-100">
                <div 
                  className="h-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${theme.popularity}%`,
                    backgroundColor: theme.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Message vide amélioré */}
        {sortedThemes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun thème trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche ou créez un nouveau thème</p>
            <button 
              onClick={() => handleOpenForm()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Créer un nouveau thème
            </button>
          </div>
        )}
      </div>

      {/* Formulaire de thème */}
      {isFormOpen && (
        <ThemeForm
          theme={currentTheme}
          onSave={handleSaveTheme}
          onClose={handleCloseForm}
          nextOrder={Math.max(...themes.map(t => t.order), 0) + 1}
        />
      )}
    </div>
  );
}