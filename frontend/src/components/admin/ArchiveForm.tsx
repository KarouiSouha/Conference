import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Save, 
  Calendar, 
  Users, 
  FileText, 
  Globe, 
  Camera,
  Building2,
  Hash,
  Languages
} from "lucide-react";

type ArchiveFormData = {
  event_name: string;
  subject_fr: string;
  subject_en: string;
  organizer: string;
  participants: string;
  articles: string;
  countries: string;
  photoGalleryLink: string;
};

type ArchiveFormErrors = Partial<Record<keyof ArchiveFormData, string | null>>;

export default function ArchiveForm({
  isOpen,
  archiveItem,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  archiveItem?: Partial<ArchiveFormData>;
  onClose: () => void;
  onSave: (data: ArchiveFormData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<ArchiveFormData>({
    event_name: "",
    subject_fr: "",
    subject_en: "",
    organizer: "",
    participants: "",
    articles: "",
    countries: "",
    photoGalleryLink: "",
  });

  const [errors, setErrors] = useState<ArchiveFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (archiveItem) {
      setFormData({
        event_name: archiveItem.event_name || "",
        subject_fr: archiveItem.subject_fr || "",
        subject_en: archiveItem.subject_en || "",
        organizer: archiveItem.organizer || "",
        participants: archiveItem.participants?.toString() || "",
        articles: archiveItem.articles?.toString() || "",
        countries: archiveItem.countries?.toString() || "",
        photoGalleryLink: archiveItem.photoGalleryLink || ""
      });
    } else {
      setFormData({
        event_name: "",
        subject_fr: "",
        subject_en: "",
        organizer: "",
        participants: "",
        articles: "",
        countries: "",
        photoGalleryLink: ""
      });
    }
    setErrors({});
  }, [archiveItem, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors: ArchiveFormErrors = {};

    if (!formData.event_name.trim()) {
      newErrors.event_name = "Le nom de l'événement est requis";
    }

    if (!formData.subject_fr.trim()) {
      newErrors.subject_fr = "Le sujet en français est requis";
    }

    if (!formData.subject_en.trim()) {
      newErrors.subject_en = "Le sujet en anglais est requis";
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = "L'organisateur est requis";
    }

    // Validation des nombres
    if (formData.participants && (isNaN(Number(formData.participants)) || parseInt(formData.participants) < 0)) {
      newErrors.participants = "Le nombre de participants doit être un nombre positif";
    }

    if (formData.articles && (isNaN(Number(formData.articles)) || parseInt(formData.articles) < 0)) {
      newErrors.articles = "Le nombre d'articles doit être un nombre positif";
    }

    if (formData.countries && (isNaN(Number(formData.countries)) || parseInt(formData.countries) < 0)) {
      newErrors.countries = "Le nombre de pays doit être un nombre positif";
    }

    // Validation URL
    if (formData.photoGalleryLink && formData.photoGalleryLink.trim()) {
      try {
        new URL(formData.photoGalleryLink);
      } catch {
        newErrors.photoGalleryLink = "L'URL de la galerie photo n'est pas valide";
      }
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...formData
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {archiveItem ? "Modifier l'Archive" : "Nouvelle Archive"}
                </h2>
                <p className="text-blue-100 mt-1">
                  {archiveItem ? "Modifiez les informations de l'archive" : "Créez une nouvelle archive d'événement"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Informations générales */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de l'événement *
                  </label>
                  <Input
                    value={formData.event_name}
                    onChange={(e) => handleInputChange("event_name", e.target.value)}
                    placeholder="Ex: Conférence Internationale sur l'IA"
                    className={`border-2 transition-all duration-200 ${
                      errors.event_name 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.event_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.event_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Organisateur *
                    </div>
                  </label>
                  <Input
                    value={formData.organizer}
                    onChange={(e) => handleInputChange("organizer", e.target.value)}
                    placeholder="Ex: Université de Tunis"
                    className={`border-2 transition-all duration-200 ${
                      errors.organizer 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.organizer && (
                    <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Lien Galerie Photo
                    </div>
                  </label>
                  <Input
                    value={formData.photoGalleryLink}
                    onChange={(e) => handleInputChange("photoGalleryLink", e.target.value)}
                    placeholder="https://example.com/gallery"
                    className={`border-2 transition-all duration-200 ${
                      errors.photoGalleryLink 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.photoGalleryLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.photoGalleryLink}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sujets multilingues */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Languages className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Sujets</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sujet (Français) *
                  </label>
                  <Input
                    value={formData.subject_fr}
                    onChange={(e) => handleInputChange("subject_fr", e.target.value)}
                    placeholder="Ex: Intelligence Artificielle et Société"
                    className={`border-2 transition-all duration-200 ${
                      errors.subject_fr 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.subject_fr && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject_fr}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sujet (Anglais) *
                  </label>
                  <Input
                    value={formData.subject_en}
                    onChange={(e) => handleInputChange("subject_en", e.target.value)}
                    placeholder="Ex: Artificial Intelligence and Society"
                    className={`border-2 transition-all duration-200 ${
                      errors.subject_en 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.subject_en && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject_en}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Hash className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Participants
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.participants}
                    onChange={(e) => handleInputChange("participants", e.target.value)}
                    placeholder="0"
                    className={`border-2 transition-all duration-200 ${
                      errors.participants 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.participants && (
                    <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Articles
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.articles}
                    onChange={(e) => handleInputChange("articles", e.target.value)}
                    placeholder="0"
                    className={`border-2 transition-all duration-200 ${
                      errors.articles 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.articles && (
                    <p className="text-red-500 text-sm mt-1">{errors.articles}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Pays
                    </div>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.countries}
                    onChange={(e) => handleInputChange("countries", e.target.value)}
                    placeholder="0"
                    className={`border-2 transition-all duration-200 ${
                      errors.countries 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-purple-500"
                    }`}
                  />
                  {errors.countries && (
                    <p className="text-red-500 text-sm mt-1">{errors.countries}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sauvegarde...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {archiveItem ? "Mettre à jour" : "Créer l'archive"}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}