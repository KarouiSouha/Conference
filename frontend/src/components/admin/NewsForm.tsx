import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  X, 
  Calendar, 
  User, 
  Link, 
  FileText, 
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

type NewsFormData = {
  typeFr: string;
  typeEn: string;
  titleFr: string;
  titleEn: string;
  date: string;
  author: string;
  descriptionFr: string;
  descriptionEn: string;
  link: string;
  status: string;
};

type NewsFormErrors = Partial<Record<keyof NewsFormData | 'submit', string>>;

type NewsFormProps = {
  isOpen?: boolean;
  newsItem?: Partial<NewsFormData> | null;
  onClose?: () => void;
  onSave: (data: NewsFormData) => void;
};

export default function NewsForm({ 
  isOpen = true, 
  newsItem = null, 
  onClose = () => {}, 
  onSave
}: NewsFormProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    typeFr: "",
    typeEn: "",
    titleFr: "",
    titleEn: "",
    date: "",
    author: "",
    descriptionFr: "",
    descriptionEn: "",
    link: "",
    status: "pending"
  });

  const [errors, setErrors] = useState<NewsFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Types d'actualités prédéfinis
  const newsTypes = [
    { fr: "Annonce", en: "Announcement", color: "from-blue-500 to-blue-600" },
    { fr: "Actualité", en: "News", color: "from-emerald-500 to-emerald-600" },
    { fr: "Notification", en: "Notification", color: "from-amber-500 to-amber-600" },
    { fr: "Information", en: "Information", color: "from-gray-500 to-gray-600" },
    { fr: "Événement", en: "Event", color: "from-purple-500 to-purple-600" }
  ];

  useEffect(() => {
    if (newsItem) {
      setFormData({
        typeFr: newsItem.typeFr || "",
        typeEn: newsItem.typeEn || "",
        titleFr: newsItem.titleFr || "",
        titleEn: newsItem.titleEn || "",
        date: newsItem.date || "",
        author: newsItem.author || "",
        descriptionFr: newsItem.descriptionFr || "",
        descriptionEn: newsItem.descriptionEn || "",
        link: newsItem.link || "",
        status: newsItem.status || "pending"
      });
    } else {
      // Réinitialiser le formulaire pour une nouvelle actualité
      setFormData({
        typeFr: "",
        typeEn: "",
        titleFr: "",
        titleEn: "",
        date: new Date().toISOString().split('T')[0],
        author: "",
        descriptionFr: "",
        descriptionEn: "",
        link: "",
        status: "pending"
      });
    }
    setErrors({});
    setPreviewMode(false);
  }, [newsItem, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      typeFr: type.fr,
      typeEn: type.en
    }));
    if (errors.typeFr || errors.typeEn) {
      setErrors(prev => ({ ...prev, typeFr: "", typeEn: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: NewsFormErrors = {};
    
    if (!formData.typeFr.trim()) newErrors.typeFr = "Le type en français est requis";
    if (!formData.typeEn.trim()) newErrors.typeEn = "Le type en anglais est requis";
    if (!formData.titleFr.trim()) newErrors.titleFr = "Le titre en français est requis";
    if (!formData.titleEn.trim()) newErrors.titleEn = "Le titre en anglais est requis";
    if (!formData.date) newErrors.date = "La date est requise";
    if (!formData.author.trim()) newErrors.author = "L'auteur est requis";
    if (!formData.descriptionFr.trim()) newErrors.descriptionFr = "La description en français est requise";
    if (!formData.descriptionEn.trim()) newErrors.descriptionEn = "La description en anglais est requise";
    
    // Validation du lien si présent
    if (formData.link && formData.link.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(formData.link)) {
        newErrors.link = "Le lien doit être une URL valide";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      onClose();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: "Une erreur est survenue lors de l'enregistrement" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeConfig = () => {
    return newsTypes.find(type => type.fr === formData.typeFr) || newsTypes[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    {newsItem ? "Modifier l'actualité" : "Nouvelle actualité"}
                  </h2>
                  <p className="text-gray-600">
                    {newsItem ? "Modifiez les informations de votre actualité" : "Créez une nouvelle actualité pour votre site"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="hover:bg-blue-50 hover:text-blue-600 rounded-full p-2"
                >
                  {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
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
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {!previewMode ? (
              <>
                {/* Type d'actualité */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Type d'actualité *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {newsTypes.map((type) => (
                      <button
                        key={type.fr}
                        type="button"
                        onClick={() => handleTypeSelect(type)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${formData.typeFr === type.fr ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-gray-700">{type.fr}</span>
                          <p className="text-xs text-gray-500">{type.en}</p>
                        </div>
                        {formData.typeFr === type.fr && (
                          <Check className="w-4 h-4 text-blue-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Type personnalisé (Français) *
                      </label>
                      <Input
                        value={formData.typeFr}
                        onChange={(e) => handleInputChange('typeFr', e.target.value)}
                        placeholder="Ex: Annonce importante"
                        className={`border-2 ${errors.typeFr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.typeFr && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.typeFr}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Type personnalisé (Anglais) *
                      </label>
                      <Input
                        value={formData.typeEn}
                        onChange={(e) => handleInputChange('typeEn', e.target.value)}
                        placeholder="Ex: Important Announcement"
                        className={`border-2 ${errors.typeEn ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.typeEn && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.typeEn}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations générales */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Informations générales
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date de publication *
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          className={`border-2 ${errors.date ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3 pl-10`}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.date && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.date}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Auteur *
                      </label>
                      <div className="relative">
                        <Input
                          value={formData.author}
                          onChange={(e) => handleInputChange('author', e.target.value)}
                          placeholder="Nom de l'auteur"
                          className={`border-2 ${errors.author ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3 pl-10`}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.author && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.author}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Lien externe (optionnel)
                      </label>
                      <div className="relative">
                        <Input
                          value={formData.link}
                          onChange={(e) => handleInputChange('link', e.target.value)}
                          placeholder="https://example.com"
                          className={`border-2 ${errors.link ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3 pl-10`}
                        />
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.link && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.link}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenu de l'actualité */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Contenu de l'actualité
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Titre (Français) *
                      </label>
                      <Input
                        value={formData.titleFr}
                        onChange={(e) => handleInputChange('titleFr', e.target.value)}
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
                      <label className="block text-sm font-semibold text-gray-700">
                        Titre (Anglais) *
                      </label>
                      <Input
                        value={formData.titleEn}
                        onChange={(e) => handleInputChange('titleEn', e.target.value)}
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
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Description (Français) *
                      </label>
                      <textarea
                        value={formData.descriptionFr}
                        onChange={(e) => handleInputChange('descriptionFr', e.target.value)}
                        placeholder="Description détaillée en français..."
                        rows={4}
                        className={`w-full px-4 py-3 border-2 ${errors.descriptionFr ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all duration-200`}
                      />
                      {errors.descriptionFr && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.descriptionFr}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Description (Anglais) *
                      </label>
                      <textarea
                        value={formData.descriptionEn}
                        onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                        placeholder="Detailed description in English..."
                        rows={4}
                        className={`w-full px-4 py-3 border-2 ${errors.descriptionEn ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all duration-200`}
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

                {/* Statut de publication */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Statut de publication
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'pending')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${formData.status === 'pending' ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">En attente</span>
                      {formData.status === 'pending' && (
                        <Check className="w-4 h-4 text-amber-600 ml-auto" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'published')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${formData.status === 'published' ? 'border-green-400 bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">Publié</span>
                      {formData.status === 'published' && (
                        <Check className="w-4 h-4 text-green-600 ml-auto" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h3>
                  <Card className="p-4 bg-white border-2 border-gray-200">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge className={`bg-gradient-to-r ${getTypeConfig().color} text-white px-3 py-1 flex items-center w-fit`}>
                          <FileText className="w-3 h-3 mr-1" />
                          {formData.typeFr || "Type"}
                        </Badge>
                        <div className="flex items-center text-gray-500 text-sm gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : 'Date non définie'}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="font-medium">{formData.author || 'Auteur non défini'}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {formData.titleFr || "Titre en français"}
                        </h4>
                        <p className="text-sm text-gray-500 italic">
                          {formData.titleEn || "Titre en anglais"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">
                        {formData.descriptionFr || "Description en français"}
                      </p>
                      {formData.link && (
                        <a href={formData.link} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                          <Link className="w-4 h-4" />
                          Voir le lien
                        </a>
                      )}
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
                    disabled={isSubmitting}
                    className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {newsItem ? "Modifier" : "Enregistrer"}
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              /* Mode Aperçu */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu de l'actualité</h3>
                  <Card className="p-4 bg-white border-2 border-gray-200">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge className={`bg-gradient-to-r ${getTypeConfig().color} text-white px-3 py-1 flex items-center w-fit`}>
                          <FileText className="w-3 h-3 mr-1" />
                          {formData.typeFr || "Type"}
                        </Badge>
                        <div className="flex items-center text-gray-500 text-sm gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : 'Date non définie'}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="font-medium">{formData.author || 'Auteur non défini'}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {formData.titleFr || "Titre en français"}
                        </h4>
                        <p className="text-sm text-gray-500 italic">
                          {formData.titleEn || "Titre en anglais"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">
                        {formData.descriptionFr || "Description en français"}
                      </p>
                      <p className="text-sm text-gray-500 italic">
                        {formData.descriptionEn || "Description en anglais"}
                      </p>
                      {formData.link && (
                        <a href={formData.link} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                          <Link className="w-4 h-4" />
                          Voir le lien
                        </a>
                      )}
                    </div>
                  </Card>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewMode(false)}
                    className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50"
                  >
                    Retour à l'édition
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}