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
  Check,
  AlertCircle,
  Linkedin,
  Plus
} from "lucide-react";

export default function SpeakerForm({
  isOpen = true,
  speaker = null,
  onClose = () => { },
  onSave = () => { }
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
    theme_id: "",
    link: "",
    realisations: []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [themes, setThemes] = useState([]);
  const [showRealisationForm, setShowRealisationForm] = useState(false);
  const [newRealisationFr, setNewRealisationFr] = useState("");
  const [newRealisationEn, setNewRealisationEn] = useState("");

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

  // Charger les thèmes depuis l'API
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/Theme/all');
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des thèmes');
        }
        setThemes(data.data.map(theme => ({
          id: theme.id,
          name: theme.titleFr,
          color: getThemeColor(theme.id)
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
      }
    };

    fetchThemes();
  }, []);

  // Associer une couleur aux thèmes
  const getThemeColor = (id) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-teal-500 to-teal-600",
      "from-orange-500 to-orange-600",
      "from-indigo-500 to-indigo-600"
    ];
    return colors[id % colors.length] || "from-gray-500 to-gray-600";
  };

  // Charger les données de l'intervenant si modification
  useEffect(() => {
    if (speaker) {
      setFormData({
        name: speaker.name || "",
        email: speaker.email || "",
        job_fr: speaker.job_fr || "",
        job_en: speaker.job_en || "",
        country_fr: speaker.country_fr || "",
        country_en: speaker.country_en || "",
        description_fr: speaker.description_fr || "",
        description_en: speaker.description_en || "",
        theme_id: speaker.theme_id?.toString() || "",
        link: speaker.link || "",
        realisations: speaker.realisations?.map((r) => ({
          id: r.id, // ID réel depuis la base de données
          title_fr: r.title_fr,
          title_en: r.title_en
        })) || []
      });
    } else {
      setFormData({
        name: "",
        email: "",
        job_fr: "",
        job_en: "",
        country_fr: "",
        country_en: "",
        description_fr: "",
        description_en: "",
        theme_id: "",
        link: "",
        realisations: []
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
    if (errors.country_fr || errors.country_en) {
      setErrors(prev => ({
        ...prev,
        country_fr: "",
        country_en: ""
      }));
    }
  };

  const addRealisation = () => {
    if (!newRealisationFr.trim() || !newRealisationEn.trim()) return;

    setFormData(prev => ({
      ...prev,
      realisations: [
        ...prev.realisations,
        {
          id: `temp-${prev.realisations.length + 1}`, // ID temporaire pour les nouvelles réalisations
          title_fr: newRealisationFr,
          title_en: newRealisationEn
        }
      ]
    }));
    setNewRealisationFr("");
    setNewRealisationEn("");
    setShowRealisationForm(false);
  };

  const removeRealisation = async (id) => {
    if (id.toString().startsWith('temp-')) {
      // Suppression locale pour une réalisation non encore enregistrée
      setFormData(prev => ({
        ...prev,
        realisations: prev.realisations.filter(r => r.id !== id)
      }));
    } else {
      // Suppression via l'API pour une réalisation existante
      try {
        const response = await fetch(`http://localhost:8000/api/Speakers/realisation/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la réalisation');
        }

        // Mettre à jour l'état local après suppression
        setFormData(prev => ({
          ...prev,
          realisations: prev.realisations.filter(r => r.id !== id)
        }));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrors({ submit: 'Une erreur est survenue lors de la suppression de la réalisation' });
      }
    }
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

    if (!formData.theme_id) {
      newErrors.theme_id = "Le thème est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const url = speaker
        ? `http://localhost:8000/api/Speakers/update/${speaker.id}`
        : 'http://localhost:8000/api/Speakers/store';

      const method = speaker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          job_fr: formData.job_fr,
          job_en: formData.job_en,
          country_fr: formData.country_fr,
          country_en: formData.country_en,
          description_fr: formData.description_fr,
          description_en: formData.description_en,
          theme_id: parseInt(formData.theme_id),
          link: formData.link || null,
          realisations: formData.realisations.map(r => ({
            title_fr: r.title_fr,
            title_en: r.title_en
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de ${speaker ? 'la mise à jour' : "l'ajout"} de l'intervenant`);
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } catch (error) {
      console.error(`Erreur lors de ${speaker ? 'la mise à jour' : "l'ajout"}:`, error);
      setErrors({ submit: `Une erreur est survenue lors de ${speaker ? 'la mise à jour' : "l'ajout"}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getSelectedThemeConfig = () => {
    return themes.find(theme => theme.id.toString() === formData.theme_id) || themes[0] || { name: "Sélectionner un thème", color: "from-gray-500 to-gray-600" };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    {speaker ? "Modifier l'Intervenant" : "Nouvel Intervenant"}
                  </h2>
                  <p className="text-gray-600">
                    {speaker ? "Modifiez les informations de l'intervenant" : "Ajoutez un nouvel expert à votre conférence"}
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
          <div className="p-6 space-y-6">
            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">
                    Intervenant {speaker ? "modifié" : "créé"} avec succès !
                  </span>
                </div>
              </div>
            )}

            {/* Informations personnelles */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Informations Personnelles
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom complet *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Dr. Sophie Martin"
                    className={`border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email professionnel *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="sophie.martin@research.fr"
                    className={`border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    Lien LinkedIn
                  </label>
                  <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    placeholder="https://linkedin.com/in/sophie-martin"
                    className={`border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                </div>
              </div>
            </div>

            {/* Fonctions professionnelles */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Fonction Professionnelle
                </label>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1">
                  <Languages className="w-3 h-3 mr-1" />
                  Bilingue
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fonction (Français) *
                  </label>
                  <Input
                    value={formData.job_fr}
                    onChange={(e) => handleInputChange("job_fr", e.target.value)}
                    placeholder="Professeure en Intelligence Artificielle"
                    className={`border-2 ${errors.job_fr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.job_fr && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.job_fr}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fonction (Anglais) *
                  </label>
                  <Input
                    value={formData.job_en}
                    onChange={(e) => handleInputChange("job_en", e.target.value)}
                    placeholder="Professor in Artificial Intelligence"
                    className={`border-2 ${errors.job_en ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.job_en && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.job_en}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Origine géographique */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Origine Géographique
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pays (Français) *
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.country_fr}
                      onChange={(e) => handleInputChange("country_fr", e.target.value)}
                      placeholder="France"
                      className={`border-2 ${errors.country_fr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.country_fr && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.country_fr}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {countries.slice(0, 5).map((country, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountrySelect(country)}
                        className="text-xs h-7 px-2 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        {country.fr}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pays (Anglais) *
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.country_en}
                      onChange={(e) => handleInputChange("country_en", e.target.value)}
                      placeholder="France"
                      className={`border-2 ${errors.country_en ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                    />
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.country_en && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.country_en}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Réalisations */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  Réalisations ({formData.realisations.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowRealisationForm(!showRealisationForm)}
                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-xl transition-all duration-200 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
              </div>

              {showRealisationForm && (
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl mb-6 border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Réalisation (Français)"
                        value={newRealisationFr}
                        onChange={(e) => setNewRealisationFr(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Realisation (English)"
                        value={newRealisationEn}
                        onChange={(e) => setNewRealisationEn(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRealisationForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={addRealisation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      disabled={!newRealisationFr.trim() || !newRealisationEn.trim()}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}

              {formData.realisations.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {formData.realisations.map((realisation) => (
                    <div
                      key={realisation.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
                      style={{
                        backgroundColor: getSelectedThemeConfig().color + '20',
                        color: getSelectedThemeConfig().color.replace(/from-|to-/g, ''),
                        border: `2px solid ${getSelectedThemeConfig().color}40`
                      }}
                    >
                      <span>{realisation.title_fr}</span>
                      <button
                        type="button"
                        onClick={() => removeRealisation(realisation.id)}
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
                  <p className="text-sm">Aucune réalisation ajoutée</p>
                </div>
              )}
            </div>

            {/* Thème et spécialisation */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Thème de Spécialisation
              </label>
              {themes.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleInputChange('theme_id', theme.id.toString())}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${formData.theme_id === theme.id.toString()
                        ? 'border-blue-400 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.color} text-white`}>
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">{theme.name}</span>
                      {formData.theme_id === theme.id.toString() && (
                        <Check className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Chargement des thèmes...</div>
              )}
              {errors.theme_id && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.theme_id}</span>
                </div>
              )}
            </div>

            {/* Descriptions */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Descriptions (Optionnel)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description (Français)
                  </label>
                  <textarea
                    value={formData.description_fr}
                    onChange={(e) => handleInputChange("description_fr", e.target.value)}
                    placeholder="Expertise et parcours professionnel en français..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description (Anglais)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    placeholder="Professional expertise and background in English..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h3>
              <Card className="p-4 bg-white border-2 border-gray-200">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {formData.name || "Nom de l'intervenant"}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {formData.job_en || "Profession"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.country_en || "Pays"}
                    </p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${getSelectedThemeConfig().color} text-white px-3 py-1 flex items-center justify-center w-fit mx-auto`}>
                    <Tag className="w-3 h-3 mr-1" />
                    <span>{getSelectedThemeConfig().name}</span>
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
                    {speaker ? "Modifier" : "Enregistrer"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}