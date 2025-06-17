import { useState } from "react";
import { Search, Plus, Edit, Trash, Tag, Eye, EyeOff, Settings, ArrowUpDown, Filter, MoreVertical, Star, Users, Calendar, TrendingUp } from "lucide-react";

export function ThemesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [sortBy, setSortBy] = useState("order");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  const [themes, setThemes] = useState([
    {
      id: 1,
      titleFr: "Intelligence Artificielle",
      titleEn: "Artificial Intelligence",
      descriptionFr: "Recherches et applications en IA",
      descriptionEn: "AI research and applications",
      icon: "🤖",
      color: "#8B5CF6",
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

  const toggleTheme = (id) => {
    setThemes(themes.map(theme => 
      theme.id === id ? { ...theme, isActive: !theme.isActive } : theme
    ));
  };

  const deleteTheme = (id) => {
    setThemes(themes.filter(theme => theme.id !== id));
  };

  const toggleSelectTheme = (id) => {
    setSelectedThemes(prev => 
      prev.includes(id) 
        ? prev.filter(themeId => themeId !== id)
        : [...prev, id]
    );
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header avec animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Gestionnaire de Thèmes
          </h1>
          <p className="text-gray-600 text-lg">Organisez et gérez vos thèmes de recherche</p>
        </div>

        {/* Statistiques avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Thèmes", value: stats.total, icon: Tag, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
            { label: "Thèmes Actifs", value: stats.active, icon: Eye, color: "from-green-500 to-green-600", bg: "bg-green-50" },
            { label: "Mots-clés", value: stats.keywords, icon: Star, color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
            { label: "Sessions", value: stats.sessions, icon: Users, color: "from-orange-500 to-orange-600", bg: "bg-orange-50" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Barre d'outils */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un thème..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="order">Ordre</option>
                <option value="name">Nom</option>
                <option value="popularity">Popularité</option>
                <option value="sessions">Sessions</option>
                <option value="updated">Mis à jour</option>
              </select>

              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4" />
                <span>Nouveau Thème</span>
              </button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {["all", "active", "inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      filterStatus === status
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === "all" ? "Tous" : status === "active" ? "Actifs" : "Inactifs"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions groupées */}
        {selectedThemes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedThemes.length} thème(s) sélectionné(s)
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Activer
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Désactiver
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des thèmes */}
        <div className="space-y-4">
          {sortedThemes.map((theme, index) => (
            <div
              key={theme.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Sélection */}
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme.id)}
                        onChange={() => toggleSelectTheme(theme.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Icône et indicateur de couleur */}
                    <div className="relative">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                        style={{ backgroundColor: theme.color + '20', border: `2px solid ${theme.color}` }}
                      >
                        {theme.icon}
                      </div>
                      <div 
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: theme.color }}
                      ></div>
                    </div>

                    {/* Contenu principal */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{theme.titleFr}</h3>
                          <p className="text-gray-500 italic">{theme.titleEn}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* Switch avec animation */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleTheme(theme.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                theme.isActive ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                  theme.isActive ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                              theme.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {theme.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{theme.isActive ? 'Actif' : 'Inactif'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-700">{theme.descriptionFr}</p>
                        <p className="text-sm text-gray-500 italic">{theme.descriptionEn}</p>
                      </div>

                      {/* Métriques */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{theme.sessions} sessions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Mis à jour le {new Date(theme.lastUpdated).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Popularité: {theme.popularity}%</span>
                        </div>
                      </div>

                      {/* Mots-clés */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          Mots-clés
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {theme.keywords.map((keyword) => (
                            <div key={keyword.id} className="group relative">
                              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                                {keyword.keywordFr}
                              </span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {keyword.keywordEn}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center space-y-3 ml-6">
                    <div className="flex space-x-2">
                      <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteTheme(theme.id)}
                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Ordre</p>
                      <p className="text-lg font-bold text-gray-800 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">
                        {theme.order}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de popularité */}
              <div className="h-1 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${theme.popularity}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Message vide */}
        {sortedThemes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun thème trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}