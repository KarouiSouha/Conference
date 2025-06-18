import { useState, useEffect } from "react";
import { X, Save, Tag, Globe, Info, List, Palette, ChevronDown, Plus } from "lucide-react";

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

  const icons = ["📚", "🔬", "💡", "🌐", "🧪", "⚙️", "🧠", "🔍", "📊", "🤖", "🧬", "🌱", "🔒"];
  const colors = ["#6366F1", "#10B981", "#059669", "#EF4444", "#F59E0B", "#EC4899", "#14B8A6", "#3B82F6", "#F97316"];

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {theme ? "Modifier le thème" : "Nouveau thème"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="titleFr" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🇫🇷</span> Titre (Français)
              </label>
              <input
                type="text"
                id="titleFr"
                name="titleFr"
                value={formData.titleFr}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🇬🇧</span> Titre (Anglais)
              </label>
              <input
                type="text"
                id="titleEn"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="descriptionFr" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🇫🇷</span> Description (Français)
              </label>
              <textarea
                id="descriptionFr"
                name="descriptionFr"
                value={formData.descriptionFr}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🇬🇧</span> Description (Anglais)
              </label>
              <textarea
                id="descriptionEn"
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Icone et Couleur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Icône */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🎨</span> Icône
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{formData.icon}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showIconPicker ? "rotate-180" : ""}`} />
                </button>
                
                {showIconPicker && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 grid grid-cols-6 gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, icon }));
                          setShowIconPicker(false);
                        }}
                        className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🎨</span> Couleur
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-5 h-5 rounded-full mr-2 border border-gray-200"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                    <span>{formData.color}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showColorPicker ? "rotate-180" : ""}`} />
                </button>
                
                {showColorPicker && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 grid grid-cols-3 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, color }));
                          setShowColorPicker(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-200"
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
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🔢</span> Ordre d'affichage
              </label>
              <input
                type="number"
                id="order"
                name="order"
                min="1"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Statut</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">Actif</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="isActive"
                  checked={!formData.isActive}
                  onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">Inactif</span>
              </label>
            </div>
          </div>

          {/* Mots-clés */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <span className="mr-2">🏷️</span> Mots-clés
              </label>
              <button
                type="button"
                onClick={() => setShowKeywordForm(!showKeywordForm)}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un mot-clé
              </button>
            </div>

            {/* Form pour nouveau mot-clé */}
            {showKeywordForm && (
              <div className="bg-gray-50 p-4 rounded-xl mb-4 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Mot-clé (Français)"
                      value={newKeywordFr}
                      onChange={(e) => setNewKeywordFr(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Keyword (English)"
                      value={newKeywordEn}
                      onChange={(e) => setNewKeywordEn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowKeywordForm(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-3 py-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    disabled={!newKeywordFr.trim() || !newKeywordEn.trim()}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {/* Liste des mots-clés */}
            {formData.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <div 
                    key={keyword.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{ 
                      backgroundColor: formData.color + '15',
                      color: formData.color,
                      border: `1px solid ${formData.color}30`
                    }}
                  >
                    <span>{keyword.keywordFr}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword.id)}
                      className="ml-2 text-xs opacity-70 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun mot-clé ajouté</p>
            )}
          </div>

          {/* Aperçu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className="mr-2">👁️</span> Aperçu
            </label>
            <div 
              className="bg-white border border-gray-200 rounded-xl p-6 group hover:shadow-lg transition-all duration-300"
              style={{ borderLeft: `4px solid ${formData.color}` }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                  style={{ 
                    backgroundColor: formData.color + '15',
                    border: `2px solid ${formData.color}40`,
                  }}
                >
                  {formData.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{formData.titleFr}</h3>
                  <p className="text-sm text-gray-500">{formData.titleEn}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                  formData.isActive 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {formData.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{formData.descriptionFr}</p>
              <p className="text-sm text-gray-500 italic mb-4">{formData.descriptionEn}</p>
              
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.slice(0, 3).map((keyword) => (
                    <span 
                      key={keyword.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: formData.color + '15',
                        color: formData.color,
                      }}
                    >
                      {keyword.keywordFr}
                    </span>
                  ))}
                  {formData.keywords.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{formData.keywords.length - 3} autres
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              <span>{theme ? "Enregistrer les modifications" : "Créer le thème"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}