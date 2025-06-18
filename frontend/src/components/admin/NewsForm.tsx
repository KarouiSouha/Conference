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
  Globe, 
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft
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

type NewsFormErrors = Partial<Record<keyof NewsFormData, string>>;

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
    { fr: "Annonce", en: "Announcement" },
    { fr: "Actualité", en: "News" },
    { fr: "Notification", en: "Notification" },
    { fr: "Information", en: "Information" },
    { fr: "Événement", en: "Event" }
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
  }, [newsItem]);

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
    if (errors.typeFr) {
      setErrors(prev => ({ ...prev, typeFr: "" }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSave(formData);
      
      // Afficher un message de succès
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeBadge = (typeFr) => {
    const badgeStyles = {
      "Annonce": "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm",
      "Actualité": "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm",
      "Notification": "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm",
      "Information": "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-sm",
      "Événement": "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm",
    };
    return badgeStyles[typeFr] || "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold">
                  {newsItem ? "Modifier l'actualité" : "Nouvelle actualité"}
                </h2>
                <p className="text-blue-100 mt-1">
                  {newsItem ? "Modifiez les informations de votre actualité" : "Créez une nouvelle actualité pour votre site"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {!previewMode ? (
            <div className="space-y-8">
              {/* Section Type */}
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Type d'actualité</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                  {newsTypes.map((type) => (
                    <button
                      key={type.fr}
                      type="button"
                      onClick={() => handleTypeSelect(type)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.typeFr === type.fr
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        formData.typeFr === type.fr ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {type.fr}
                      </div>
                      <div className={`text-xs ${
                        formData.typeFr === type.fr ? 'text-blue-500' : 'text-gray-500'
                      }`}>
                        {type.en}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Champs personnalisés pour le type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type personnalisé (Français) *
                    </label>
                    <Input
                      value={formData.typeFr}
                      onChange={(e) => handleInputChange('typeFr', e.target.value)}
                      placeholder="Ex: Annonce importante"
                      className={`${errors.typeFr ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                    {errors.typeFr && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.typeFr}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type personnalisé (Anglais) *
                    </label>
                    <Input
                      value={formData.typeEn}
                      onChange={(e) => handleInputChange('typeEn', e.target.value)}
                      placeholder="Ex: Important Announcement"
                      className={`${errors.typeEn ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                    {errors.typeEn && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.typeEn}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Section Informations générales */}
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Informations générales</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de publication *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className={`pl-10 ${errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auteur *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="Nom de l'auteur"
                        className={`pl-10 ${errors.author ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                    </div>
                    {errors.author && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.author}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien externe (optionnel)
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      value={formData.link}
                      onChange={(e) => handleInputChange('link', e.target.value)}
                      placeholder="https://example.com"
                      className={`pl-10 ${errors.link ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                  </div>
                  {errors.link && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.link}
                    </p>
                  )}
                </div>
              </Card>

              {/* Section Contenu */}
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Contenu de l'actualité</h3>
                </div>

                <div className="space-y-6">
                  {/* Titres */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre (Français) *
                      </label>
                      <Input
                        value={formData.titleFr}
                        onChange={(e) => handleInputChange('titleFr', e.target.value)}
                        placeholder="Titre en français"
                        className={`${errors.titleFr ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                      {errors.titleFr && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.titleFr}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre (Anglais) *
                      </label>
                      <Input
                        value={formData.titleEn}
                        onChange={(e) => handleInputChange('titleEn', e.target.value)}
                        placeholder="Title in English"
                        className={`${errors.titleEn ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                      {errors.titleEn && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.titleEn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Français) *
                      </label>
                      <textarea
                        value={formData.descriptionFr}
                        onChange={(e) => handleInputChange('descriptionFr', e.target.value)}
                        placeholder="Description détaillée en français..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          errors.descriptionFr ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                      {errors.descriptionFr && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.descriptionFr}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Anglais) *
                      </label>
                      <textarea
                        value={formData.descriptionEn}
                        onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                        placeholder="Detailed description in English..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          errors.descriptionEn ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                      {errors.descriptionEn && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.descriptionEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Section Statut */}
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Statut de publication</h3>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'pending')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.status === 'pending'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      formData.status === 'pending' ? 'bg-amber-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`font-medium ${
                      formData.status === 'pending' ? 'text-amber-700' : 'text-gray-600'
                    }`}>
                      En attente
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'published')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.status === 'published'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      formData.status === 'published' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`font-medium ${
                      formData.status === 'published' ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      Publié
                    </span>
                  </button>
                </div>
              </Card>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-3"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sauvegarde...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      {newsItem ? "Modifier" : "Créer"}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Mode Aperçu */
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aperçu de l'actualité</h3>
                <p className="text-gray-600">Voici comment votre actualité apparaîtra</p>
              </div>

              <Card className="p-8 bg-white border-0 shadow-lg">
                <div className="space-y-4">
                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge className={`${getTypeBadge(formData.typeFr)} px-3 py-1 font-medium`}>
                      {formData.typeFr}
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

                  {/* Contenu */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {formData.titleFr || 'Titre en français'}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium italic mb-3">
                        {formData.titleEn || 'Titre en anglais'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-700 leading-relaxed">
                        {formData.descriptionFr || 'Description en français'}
                      </p>
                      <p className="text-sm text-gray-500 italic leading-relaxed">
                        {formData.descriptionEn || 'Description en anglais'}
                      </p>
                    </div>
                  </div>

                  {/* Lien externe */}
                  {formData.link && (
                    <div className="pt-2">
                      <a 
                        href={formData.link} 
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Link className="w-4 h-4" />
                        Voir le lien
                      </a>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={() => setPreviewMode(false)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Retour à l'édition
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}