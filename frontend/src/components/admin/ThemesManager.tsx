import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash, Tag, ArrowUpDown, Filter, MoreVertical, Star, Users, Calendar, ChevronDown, Target } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faCode, faRecycle, faChartLine, faChalkboardTeacher, faBook, faRobot, faLeaf, faBookOpen, faFlask, faLightbulb, faGlobe, faVial, faBrain, faSearch, faChartBar, faLock, faPaintBrush, faRocket, faLaptopCode, faDna } from "@fortawesome/free-solid-svg-icons";
import ThemeForm from "./ThemeForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useToast } from "../../hooks/use-toast";

interface Keyword {
  id: number;
  keywordFr: string;
  keywordEn: string;
  order: number;
}

interface Theme {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  color: string | null;
  order: number;
  sessions: number;
  lastUpdated: string;
  keywords: Keyword[];
}

const fontAwesomeIcons = {
  'fa-cogs': faCogs,
  'fa-code': faCode,
  'fa-book': faBook,
  'fa-robot': faRobot,
  'fa-leaf': faLeaf,
  'fa-book-open': faBookOpen,
  'fa-flask': faFlask,
  'fa-lightbulb': faLightbulb,
  'fa-globe': faGlobe,
  'fa-vial': faVial,
  'fa-brain': faBrain,
  'fa-search': faSearch,
  'fa-chart-bar': faChartBar,
  'fa-lock': faLock,
  'fa-paint-brush': faPaintBrush,
  'fa-rocket': faRocket,
  'fa-laptop-code': faLaptopCode,
  'fa-dna': faDna,
  'fa-recycle': faRecycle,
  'fa-chart-line': faChartLine,
  'fa-chalkboard-teacher': faChalkboardTeacher,
};

export default function ThemesManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("order");
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<number | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/Theme/all?lang=fr');
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
  }, [toast]);

  const handleDeleteTheme = (id: number) => {
    setThemeToDelete(id);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSelectedThemes = () => {
    if (selectedThemes.length > 0) {
      setIsBulkDelete(true);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (isBulkDelete) {
      try {
        const deletePromises = selectedThemes.map(id =>
          fetch(`http://localhost:8000/api/Theme/${id}`, {
            method: 'DELETE',
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Erreur lors de la suppression du thème ${id}`);
            }
            return response.json();
          })
        );
        await Promise.all(deletePromises);
        setThemes(themes.filter(theme => !selectedThemes.includes(theme.id)));
        setSelectedThemes([]);
        toast({
          title: "Succès",
          description: "Thèmes sélectionnés supprimés avec succès",
          variant: "default",
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : 'Erreur inconnue',
          variant: "destructive",
        });
      }
    } else if (themeToDelete !== null) {
      try {
        const response = await fetch(`http://localhost:8000/api/Theme/${themeToDelete}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du thème');
        }
        const data = await response.json();
        if (data.success) {
          setThemes(themes.filter(theme => theme.id !== themeToDelete));
          setSelectedThemes(selectedThemes.filter(themeId => themeId !== themeToDelete));
          toast({
            title: "Succès",
            description: "Thème supprimé avec succès",
            variant: "default",
          });
        } else {
          throw new Error(data.message || 'Erreur lors de la suppression');
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : 'Erreur inconnue',
          variant: "destructive",
        });
      }
    }
    setIsDeleteModalOpen(false);
    setThemeToDelete(null);
    setIsBulkDelete(false);
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

  const handleSaveTheme = async (themeData: Theme) => {
    try {
      const payload = {
        titleFr: themeData.titleFr,
        titleEn: themeData.titleEn,
        descriptionFr: themeData.descriptionFr,
        descriptionEn: themeData.descriptionEn,
        icon: themeData.icon,
        color: themeData.color,
        order: themeData.order,
        sessions: themeData.sessions || 0,
        keywords: themeData.keywords.map(kw => ({
          id: Number.isInteger(kw.id) && kw.id < 1000000 ? kw.id : undefined,
          keyword_fr: kw.keywordFr,
          keyword_en: kw.keywordEn,
          order: kw.order,
        })),
      };
      console.log("Payload sent to API:", JSON.stringify(payload, null, 2));

      let response;
      if (themeData.id) {
        response = await fetch(`http://localhost:8000/api/Theme/${themeData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('http://localhost:8000/api/Theme/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur lors de ${themeData.id ? 'la mise à jour' : 'la création'} du thème: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        const updatedTheme = {
          id: data.data.id,
          titleFr: data.data.title_fr,
          titleEn: data.data.title_en,
          descriptionFr: data.data.description_fr,
          descriptionEn: data.data.description_en,
          icon: data.data.icon,
          color: data.data.color,
          order: data.data.order,
          sessions: data.data.sessions,
          lastUpdated: data.data.updated_at,
          keywords: data.data.mots_cles.map((kw: any) => ({
            id: kw.id,
            keywordFr: kw.keyword_fr,
            keywordEn: kw.keyword_en,
            order: kw.order,
          })),
        };

        if (themeData.id) {
          setThemes(themes.map(t => t.id === themeData.id ? updatedTheme : t));
        } else {
          setThemes([...themes, updatedTheme]);
        }

        toast({
          title: "Succès",
          description: `Thème ${themeData.id ? 'mis à jour' : 'créé'} avec succès`,
          variant: "default",
        });
        handleCloseForm();
      } else {
        throw new Error(data.message || 'Erreur dans la réponse de l\'API');
      }
    } catch (err) {
      console.error("Error in handleSaveTheme:", err);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: "destructive",
      });
    }
  };

  const filteredThemes = themes.filter(theme => {
    return theme.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.keywords.some(k =>
        k.keywordFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.keywordEn.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });

  const sortedThemes = [...filteredThemes].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.titleFr.localeCompare(b.titleFr);
      case "sessions": return b.sessions - a.sessions;
      case "updated": return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default: return a.order - b.order;
    }
  });

  const stats = {
    total: themes.length,
    keywords: themes.reduce((acc, t) => acc + t.keywords.length, 0),
    sessions: themes.reduce((acc, t) => acc + t.sessions, 0),
  };

  const isFontAwesomeIcon = (icon: string) => icon && Object.keys(fontAwesomeIcons).includes(icon);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Chargement des thèmes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Erreur</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                  Gestionnaire de Thèmes
                </h1>
                <p className="text-gray-600 text-lg">Organisez et gérez vos thèmes de recherche</p>
              </div>
              <button
                onClick={() => handleOpenForm()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nouveau Thème</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              icon: Calendar,
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
                  style={{ width: `${(stat.value / Math.max(...[stats.total, stats.keywords, stats.sessions])) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>

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
                className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${showFilters
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
                  <option value="sessions">Trier par sessions</option>
                  <option value="updated">Trier par date</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

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
                  onClick={handleDeleteSelectedThemes}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

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
                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme.id)}
                        onChange={() => toggleSelectTheme(theme.id)}
                        className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                    </div>

                    <div className="relative flex-shrink-0">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        style={{
                          backgroundColor: theme.color ? `${theme.color}15` : '#e5e7eb',
                          border: theme.color ? `2px solid ${theme.color}40` : '2px solid #d1d5db',
                        }}
                      >
                        {isFontAwesomeIcon(theme.icon) ? (
                          <FontAwesomeIcon icon={fontAwesomeIcons[theme.icon]} className="w-8 h-8 text-gray-700" />
                        ) : (
                          <span className="text-2xl">{theme.icon}</span>
                        )}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: theme.color ?? '#6b7280' }}
                      >
                        {theme.order}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{theme.titleFr}</h3>
                          </div>
                          <p className="text-gray-500 text-sm mb-1">{theme.titleEn}</p>
                          <p className="text-gray-700 mb-2">{theme.descriptionFr}</p>
                          <p className="text-sm text-gray-500 italic">{theme.descriptionEn}</p>
                        </div>
                      </div>

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
                      </div>

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
                                  backgroundColor: theme.color ? `${theme.color}15` : '#e5e7eb',
                                  color: theme.color ?? '#6b7280',
                                  border: theme.color ? `1px solid ${theme.color}30` : '1px solid #d1d5db'
                                }}
                              >
                                {keyword.keywordFr}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenForm(theme)}
                        className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center hover:scale-110 duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTheme(theme.id)}
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
            </div>
          ))}
        </div>

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

        {isFormOpen && (
          <ThemeForm
            theme={currentTheme}
            onSave={handleSaveTheme}
            onClose={handleCloseForm}
            nextOrder={Math.max(...themes.map(t => t.order), 0) + 1}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setThemeToDelete(null);
              setIsBulkDelete(false);
            }}
            onConfirm={confirmDelete}
            Name={isBulkDelete ? `${selectedThemes.length} thèmes sélectionnés` : themes.find(t => t.id === themeToDelete)?.titleFr || 'ce thème'}
          />
        )}
      </div>
    </div>
  );
}