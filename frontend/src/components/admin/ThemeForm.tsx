import { useState, useEffect } from "react";
import { X, Save, Tag, Globe, Info, List, Palette, ChevronDown, Plus, Eye, Sparkles, Edit } from "lucide-react";

interface Keyword {
  id: number;
  keywordFr: string;
  keywordEn: string;
}

interface Theme {
  id?: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  keywords: Keyword[];
}

interface ThemeFormProps {
  theme?: Theme | null;
  onSave: (theme: Theme) => void;
  onClose: () => void;
  nextOrder: number;
}

export default function ThemeForm({ theme, onSave, onClose, nextOrder }: ThemeFormProps) {
  const [formData, setFormData] = useState<Theme>({
    titleFr: "",
    titleEn: "",
    descriptionFr: "",
    descriptionEn: "",
    icon: "📚",
    color: "#6366F1",
    order: nextOrder,
    isActive: true,
    keywords: [],
    ...theme
  });

  const [newKeywordFr, setNewKeywordFr] = useState("");
  const [newKeywordEn, setNewKeywordEn] = useState("");
  const [showKeywordForm, setShowKeywordForm] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const icons = ["📚", "🔬", "💡", "🌐", "🧪", "⚙️", "🧠", "🔍", "📊", "🤖", "🧬", "🌱", "🔒", "🎨", "🚀", "💻"];
  const colors = [
    "#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B", 
    "#10B981", "#06B6D4", "#3B82F6", "#F97316", "#84CC16",
    "#6B7280", "#1F2937"
  ];

  // Détermine si c'est un mode édition ou création
  const isEditMode = Boolean(theme && theme.id);

  useEffect(() => {
    if (theme) {
      setFormData(theme);
    } else {
      setFormData(prev => ({
        ...prev,
        order: nextOrder
      }));
    }
  }, [theme, nextOrder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addKeyword = () => {
    if (newKeywordFr.trim() && newKeywordEn.trim()) {
      const newKeyword = {
        id: Date.now(),
        keywordFr: newKeywordFr.trim(),
        keywordEn: newKeywordEn.trim()
      };
      
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword]
      }));
      
      setNewKeywordFr("");
      setNewKeywordEn("");
      setShowKeywordForm(false);
    }
  };

  const removeKeyword = (id: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                {isEditMode ? (
                  <Edit className="w-7 h-7 text-white" />
                ) : (
                  <Sparkles className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditMode ? "Modifier le thème" : "Nouveau thème"}
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  {isEditMode ? "Modifiez les informations de votre thème" : "Créez et personnalisez vos thèmes avec style"}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 flex items-center justify-center border border-white/20 hover:border-white/40"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form avec scrolling */}
        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Section Informations générales */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-600" />
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="titleFr" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🇫🇷</span> Titre (Français)
                    </label>
                    <input
                      type="text"
                      id="titleFr"
                      name="titleFr"
                      value={formData.titleFr}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Entrez le titre en français..."
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="descriptionFr" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🇫🇷</span> Description (Français)
                    </label>
                    <textarea
                      id="descriptionFr"
                      name="descriptionFr"
                      value={formData.descriptionFr}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Décrivez le thème en français..."
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="titleEn" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🇬🇧</span> Titre (Anglais)
                    </label>
                    <input
                      type="text"
                      id="titleEn"
                      name="titleEn"
                      value={formData.titleEn}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter title in English..."
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="descriptionEn" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🇬🇧</span> Description (Anglais)
                    </label>
                    <textarea
                      id="descriptionEn"
                      name="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Describe the theme in English..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Apparence */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-600" />
                Apparence et style
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Icône */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🎭</span> Icône
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl flex items-center justify-between bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:border-purple-300 hover:shadow-lg"
                    >
                      <span className="text-3xl">{formData.icon}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showIconPicker ? "rotate-180" : ""}`} />
                    </button>
                    
                    {showIconPicker && (
                      <div className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-md border-2 border-gray-200 rounded-2xl shadow-2xl p-4 grid grid-cols-4 gap-3 animate-in fade-in zoom-in-95 duration-200">
                        {icons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, icon }));
                              setShowIconPicker(false);
                            }}
                            className="text-2xl p-3 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:scale-110"
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Couleur */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🎨</span> Couleur
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl flex items-center justify-between bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:border-purple-300 hover:shadow-lg"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-7 h-7 rounded-full mr-3 border-2 border-white shadow-lg"
                          style={{ backgroundColor: formData.color }}
                        ></div>
                        <span className="font-mono text-sm">{formData.color}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showColorPicker ? "rotate-180" : ""}`} />
                    </button>
                    
                    {showColorPicker && (
                      <div className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-md border-2 border-gray-200 rounded-2xl shadow-2xl p-4 grid grid-cols-4 gap-3 animate-in fade-in zoom-in-95 duration-200">
                        {colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, color }));
                              setShowColorPicker(false);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
                          >
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: color }}
                            ></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordre */}
                <div>
                  <label htmlFor="order" className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🔢</span> Ordre
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Statut */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 mb-4">Statut du thème</label>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      Actif
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={!formData.isActive}
                      onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                      className="h-5 w-5 text-gray-600 focus:ring-gray-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-800 font-medium flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Inactif
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section Mots-clés */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  Mots-clés ({formData.keywords.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowKeywordForm(!showKeywordForm)}
                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-xl transition-all duration-200 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
              </div>

              {/* Form pour nouveau mot-clé */}
              {showKeywordForm && (
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Mot-clé (Français)"
                        value={newKeywordFr}
                        onChange={(e) => setNewKeywordFr(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Keyword (English)"
                        value={newKeywordEn}
                        onChange={(e) => setNewKeywordEn(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowKeywordForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      disabled={!newKeywordFr.trim() || !newKeywordEn.trim()}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}

              {/* Liste des mots-clés */}
              {formData.keywords.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {formData.keywords.map((keyword) => (
                    <div 
                      key={keyword.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
                      style={{ 
                        backgroundColor: formData.color + '20',
                        color: formData.color,
                        border: `2px solid ${formData.color}40`
                      }}
                    >
                      <span>{keyword.keywordFr}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword.id)}
                        className="ml-2 hover:bg-white/50 rounded-full p-1 transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucun mot-clé ajouté</p>
                </div>
              )}
            </div>

            {/* Aperçu */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-emerald-600" />
                Aperçu du thème
              </h3>
              <div 
                className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8 group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                style={{ borderLeft: `6px solid ${formData.color}` }}
              >
                <div className="flex items-start space-x-6 mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl border-2"
                    style={{ 
                      backgroundColor: formData.color + '20',
                      borderColor: formData.color + '40',
                    }}
                  >
                    {formData.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{formData.titleFr || "Titre du thème"}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        formData.isActive 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {formData.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{formData.titleEn || "Theme title"}</p>
                    <p className="text-gray-700 mb-2">{formData.descriptionFr || "Description du thème..."}</p>
                    <p className="text-sm text-gray-500 italic">{formData.descriptionEn || "Theme description..."}</p>
                  </div>
                </div>
                
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.slice(0, 4).map((keyword) => (
                      <span 
                        key={keyword.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: formData.color + '15',
                          color: formData.color,
                        }}
                      >
                        {keyword.keywordFr}
                      </span>
                    ))}
                    {formData.keywords.length > 4 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{formData.keywords.length - 4} autres
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions fixées en bas - Boutons améliorés */}
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
            {/* Bouton Annuler */}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-2xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Annuler</span>
            </button>

            {/* Bouton Enregistrer/Modifier */}
            <button
              type="submit"
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-8 py-3 text-white rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold ${
                isEditMode 
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600' 
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700'
              }`}
            >
              {isEditMode ? (
                <>
                  <Edit className="w-5 h-5" />
                  <span>Modifier le thème</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Enregistrer le thème</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}