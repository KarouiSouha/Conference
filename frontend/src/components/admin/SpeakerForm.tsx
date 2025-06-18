import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Briefcase, 
  Globe, 
  FileText, 
  Tag,
  Languages,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function SpeakerForm({ 
  isOpen = true, 
  speaker = null, 
  onClose = () => {}, 
  onSave = () => {} 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job_fr: "",
    job_en: "",
    country_fr: "",
    country_en: "",
    description_fr: "",
    description_en: "",
    theme_id: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Thèmes disponibles (normalement récupérés depuis l'API)
  const themes = [
    { id: 1, name: "IA et Technologies" },
    { id: 2, name: "Sciences Médicales" },
    { id: 3, name: "Nanotechnologies" },
    { id: 4, name: "Environnement" },
    { id: 5, name: "Énergie" },
    { id: 6, name: "Économie" }
  ];

  // Pays populaires pour l'auto-complétion
  const countries = [
    { fr: "France", en: "France" },
    { fr: "États-Unis", en: "United States" },
    { fr: "Royaume-Uni", en: "United Kingdom" },
    { fr: "Allemagne", en: "Germany" },
    { fr: "Espagne", en: "Spain" },
    { fr: "Italie", en: "Italy" },
    { fr: "Canada", en: "Canada" },
    { fr: "Japon", en: "Japan" },
    { fr: "Chine", en: "China" },
    { fr: "Inde", en: "India" }
  ];

  // Charger les données de l'intervenant si modification
  useEffect(() => {
    if (speaker) {
      setFormData({
        name: speaker.name || "",
        email: speaker.email || "",
        job_fr: speaker.jobFr || "",
        job_en: speaker.jobEn || "",
        country_fr: speaker.countryFr || "",
        country_en: speaker.countryEn || "",
        description_fr: speaker.descriptionFr || "",
        description_en: speaker.descriptionEn || "",
        theme_id: speaker.themeId?.toString() || ""
      });
    } else {
      // Reset pour nouveau speaker
      setFormData({
        name: "",
        email: "",
        job_fr: "",
        job_en: "",
        country_fr: "",
        country_en: "",
        description_fr: "",
        description_en: "",
        theme_id: ""
      });
    }
    setErrors({});
    setShowSuccess(false);
  }, [speaker, isOpen]);

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

  const handleCountrySelect = (country) => {
    setFormData(prev => ({
      ...prev,
      country_fr: country.fr,
      country_en: country.en
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.job_fr.trim()) {
      newErrors.job_fr = "La fonction en français est obligatoire";
    }

    if (!formData.job_en.trim()) {
      newErrors.job_en = "La fonction en anglais est obligatoire";
    }

    if (!formData.country_fr.trim()) {
      newErrors.country_fr = "Le pays en français est obligatoire";
    }

    if (!formData.country_en.trim()) {
      newErrors.country_en = "Le pays en anglais est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl bg-white">
          {/* En-tête élégant */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {speaker ? "Modifier l'Intervenant" : "Nouvel Intervenant"}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {speaker ? "Mettez à jour les informations" : "Ajoutez un nouvel expert à votre conférence"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 h-10 w-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Message de succès */}
          {showSuccess && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Intervenant {speaker ? "modifié" : "créé"} avec succès !
              </span>
            </div>
          )}

          <div className="p-6 space-y-8">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Informations Personnelles</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom complet *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Dr. Sophie Martin"
                    className={`h-12 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email professionnel *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="sophie.martin@research.fr"
                    className={`h-12 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fonctions professionnelles */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Fonction Professionnelle</h3>
                <Badge variant="outline" className="text-xs">
                  <Languages className="w-3 h-3 mr-1" />
                  Bilingue
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Fonction (Français) *
                  </label>
                  <Input
                    value={formData.job_fr}
                    onChange={(e) => handleInputChange("job_fr", e.target.value)}
                    placeholder="Professeure en Intelligence Artificielle"
                    className={`h-12 ${errors.job_fr ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.job_fr && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.job_fr}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Fonction (Anglais) *
                  </label>
                  <Input
                    value={formData.job_en}
                    onChange={(e) => handleInputChange("job_en", e.target.value)}
                    placeholder="Professor in Artificial Intelligence"
                    className={`h-12 ${errors.job_en ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.job_en && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.job_en}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Origine géographique */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Origine Géographique</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Pays (Français) *
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.country_fr}
                      onChange={(e) => handleInputChange("country_fr", e.target.value)}
                      placeholder="France"
                      className={`h-12 ${errors.country_fr ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.country_fr && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.country_fr}</span>
                    </div>
                  )}
                  
                  {/* Suggestions de pays */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {countries.slice(0, 5).map((country, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountrySelect(country)}
                        className="text-xs h-7 px-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        {country.fr}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Pays (Anglais) *
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.country_en}
                      onChange={(e) => handleInputChange("country_en", e.target.value)}
                      placeholder="France"
                      className={`h-12 ${errors.country_en ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.country_en && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.country_en}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thème et spécialisation */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Tag className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thème de Spécialisation</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Thème principal
                </label>
                <select
                  value={formData.theme_id}
                  onChange={(e) => handleInputChange("theme_id", e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Sélectionner un thème</option>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Descriptions (Optionnel)</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Description (Français)
                  </label>
                  <textarea
                    value={formData.description_fr}
                    onChange={(e) => handleInputChange("description_fr", e.target.value)}
                    placeholder="Expertise et parcours professionnel en français..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Description (Anglais)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    placeholder="Professional expertise and background in English..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{speaker ? "Modifier" : "Créer"} l'Intervenant</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}