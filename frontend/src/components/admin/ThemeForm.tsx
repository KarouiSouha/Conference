import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, X, Save, AlertCircle, Globe, Palette, ChevronDown, Plus } from "lucide-react";

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
  const [errors, setErrors] = useState<Partial<Record<keyof Theme | 'submit' | 'keywords', string>>>({});

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Theme | 'submit' | 'keywords', string>> = {};

    if (!formData.titleFr.trim()) {
      newErrors.titleFr = "Le titre en français est requis";
    }
    if (!formData.titleEn.trim()) {
      newErrors.titleEn = "Le titre en anglais est requis";
    }
    if (!formData.descriptionFr.trim()) {
      newErrors.descriptionFr = "La description en français est requise";
    }
    if (!formData.descriptionEn.trim()) {
      newErrors.descriptionEn = "La description en anglais est requise";
    }
    if (formData.order < 1) {
      newErrors.order = "L'ordre doit être un nombre positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setErrors(prev => ({ ...prev, submit: "Une erreur est survenue lors de l'enregistrement" }));
    }
  };

  const addKeyword = () => {
    if (!newKeywordFr.trim() || !newKeywordEn.trim()) {
      setErrors(prev => ({ ...prev, keywords: "Les deux mots-clés (français et anglais) sont requis" }));
      return;
    }

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
    setErrors(prev => ({ ...prev, keywords: undefined }));
  };

  const removeKeyword = (id: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    {theme ? "Modifier Thème" : "Nouveau Thème"}
                  </h2>
                  <p className="text-gray-600">
                    {theme ? "Modifiez les informations du thème" : "Ajoutez un nouveau thème"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-red-50 hover:text-red-600 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Titles */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Titres</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Titre (Français) *</label>
                  <Input
                    type="text"
                    id="titleFr"
                    name="titleFr"
                    value={formData.titleFr}
                    onChange={handleChange}
                    placeholder="Titre en français"
                    className={`border-2 ${errors.titleFr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.titleFr && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.titleFr}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Titre (Anglais) *</label>
                  <Input
                    type="text"
                    id="titleEn"
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleChange}
                    placeholder="Title in English"
                    className={`border-2 ${errors.titleEn ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.titleEn && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.titleEn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Descriptions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Description (Français) *</label>
                  <textarea
                    id="descriptionFr"
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Description en français"
                    className={`w-full px-4 py-3 border-2 ${errors.descriptionFr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200`}
                  />
                  {errors.descriptionFr && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.descriptionFr}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Description (Anglais) *</label>
                  <textarea
                    id="descriptionEn"
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Description in English"
                    className={`w-full px-4 py-3 border-2 ${errors.descriptionEn ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200`}
                  />
                  {errors.descriptionEn && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.descriptionEn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Icon, Color, Order */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Palette className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Apparence et Ordre</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Icon */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Icône</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className={`w-full px-4 py-3 border-2 ${errors.icon ? 'border-red-300' : 'border-gray-200'} rounded-xl flex items-center justify-between bg-white hover:bg-gray-50 transition-colors`}
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

                {/* Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Couleur</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={`w-full px-4 py-3 border-2 ${errors.color ? 'border-red-300' : 'border-gray-200'} rounded-xl flex items-center justify-between bg-white hover:bg-gray-50 transition-colors`}
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

                {/* Order */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ordre d'affichage *</label>
                  <Input
                    type="number"
                    id="order"
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="1"
                    className={`border-2 ${errors.order ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.order && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.order}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Statut</h3>
              </div>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Actif</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    checked={!formData.isActive}
                    onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Inactif</span>
                </label>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Mots-clés</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowKeywordForm(!showKeywordForm)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter un mot-clé
                </Button>
              </div>

              {/* New Keyword Form */}
              {showKeywordForm && (
                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Mot-clé (Français)"
                        value={newKeywordFr}
                        onChange={(e) => setNewKeywordFr(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Keyword (English)"
                        value={newKeywordEn}
                        onChange={(e) => setNewKeywordEn(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
                      />
                    </div>
                  </div>
                  {errors.keywords && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm mb-3">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.keywords}</span>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowKeywordForm(false);
                        setErrors(prev => ({ ...prev, keywords: undefined }));
                      }}
                      className="px-3 py-1.5 text-sm border-2 border-gray-200 hover:bg-gray-100"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      onClick={addKeyword}
                      className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              )}

              {/* Keywords List */}
              {formData.keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword) => (
                    <Badge
                      key={keyword.id}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: formData.color + '15',
                        color: formData.color,
                        border: `1px solid ${formData.color}30`
                      }}
                    >
                      {keyword.keywordFr}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword.id)}
                        className="ml-2 text-xs opacity-70 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Aucun mot-clé ajouté</p>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h3>
              <Card className="p-4 bg-white border-2 border-gray-200">
                <div className="text-center space-y-3">
                  <div
                    className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: formData.color + '15' }}
                  >
                    {formData.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{formData.titleFr || "Titre du thème"}</h4>
                    <p className="text-sm text-gray-500 italic">{formData.titleEn || "Theme title"}</p>
                  </div>
                  <Badge
                    className={`bg-gradient-to-r ${formData.isActive ? 'from-emerald-500 to-emerald-600' : 'from-gray-500 to-gray-600'} text-white px-3 py-1 flex items-center justify-center w-fit mx-auto`}
                  >
                    {formData.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                {theme ? "Modifier" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}