import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, X, Save, Building2, Camera, Users, Globe, AlertCircle, Languages, Hash, Calendar } from "lucide-react";

type ArchiveFormData = {
  id?: number;
  event_name: string;
  subject_fr: string;
  subject_en: string;
  organizer: string;
  participants: string;
  articles: string;
  countries: string;
  photoGalleryLink: string;
  year?: string;
  duration?: string;
  location?: string;
  status?: string;
};

type ArchiveFormErrors = Partial<Record<keyof ArchiveFormData, string | undefined>> & {
  submit?: string;
};

function ArchiveForm({
  isOpen,
  archiveItem,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  archiveItem?: Partial<ArchiveFormData>;
  onClose: () => void;
  onSave?: () => void;
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
        id: archiveItem.id,
        event_name: archiveItem.event_name || "",
        subject_fr: archiveItem.subject_fr || "",
        subject_en: archiveItem.subject_en || "",
        organizer: archiveItem.organizer || "",
        participants: archiveItem.participants || "",
        articles: archiveItem.articles || "",
        countries: archiveItem.countries || "",
        photoGalleryLink: archiveItem.photoGalleryLink || "",
        year: archiveItem.year || "",
        duration: archiveItem.duration || "",
        location: archiveItem.location || "",
        status: archiveItem.status || "",
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
        photoGalleryLink: "",
      });
    }
  }, [archiveItem]);

  const handleInputChange = (field: keyof ArchiveFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
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

    if (
      formData.participants &&
      (isNaN(Number(formData.participants)) || parseInt(formData.participants) < 0)
    ) {
      newErrors.participants = "Le nombre de participants doit être un nombre positif";
    }

    if (formData.articles && (isNaN(Number(formData.articles)) || parseInt(formData.articles) < 0)) {
      newErrors.articles = "Le nombre d'articles doit être un nombre positif";
    }

    if (formData.countries && (isNaN(Number(formData.countries)) || parseInt(formData.countries) < 0)) {
      newErrors.countries = "Le nombre de pays doit être un nombre positif";
    }

    if (formData.photoGalleryLink && formData.photoGalleryLink.trim()) {
      try {
        new URL(formData.photoGalleryLink);
      } catch {
        newErrors.photoGalleryLink = "L'URL de la galerie photo n'est pas valide";
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
      let response;
      if (formData.id) {
        // Update existing archive
        response = await fetch(`http://localhost:8000/api/Archive/update/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new archive
        response = await fetch('http://localhost:8000/api/Archive/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      if (onSave) {
        await onSave();
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setErrors(prev => ({ ...prev, submit: "Une erreur est survenue lors de l'enregistrement" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    {archiveItem ? 'Modifier Archive' : 'Nouvelle Archive'}
                  </h2>
                  <p className="text-gray-600">
                    {archiveItem ? 'Modifiez les informations de l\'archive' : 'Ajoutez une nouvelle archive d\'événement'}
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
            {/* General Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Informations générales</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nom de l'événement *
                  </label>
                  <Input
                    value={formData.event_name}
                    onChange={(e) => handleInputChange("event_name", e.target.value)}
                    placeholder="Ex: Conférence Internationale sur l'IA"
                    className={`border-2 ${errors.event_name ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.event_name && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.event_name}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Organisateur *
                    </label>
                    <Input
                      value={formData.organizer}
                      onChange={(e) => handleInputChange("organizer", e.target.value)}
                      placeholder="Ex: Université de Tunis"
                      className={`border-2 ${errors.organizer ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                    />
                    {errors.organizer && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.organizer}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Lien Galerie Photo
                    </label>
                    <Input
                      value={formData.photoGalleryLink}
                      onChange={(e) => handleInputChange("photoGalleryLink", e.target.value)}
                      placeholder="https://example.com/gallery"
                      className={`border-2 ${errors.photoGalleryLink ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                    />
                    {errors.photoGalleryLink && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.photoGalleryLink}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Languages className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Sujets</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sujet (Français) *
                  </label>
                  <Input
                    value={formData.subject_fr}
                    onChange={(e) => handleInputChange("subject_fr", e.target.value)}
                    placeholder="Ex: Intelligence Artificielle et Société"
                    className={`border-2 ${errors.subject_fr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.subject_fr && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.subject_fr}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sujet (Anglais) *
                  </label>
                  <Input
                    value={formData.subject_en}
                    onChange={(e) => handleInputChange("subject_en", e.target.value)}
                    placeholder="Ex: Artificial Intelligence and Society"
                    className={`border-2 ${errors.subject_en ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.subject_en && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.subject_en}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Hash className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Statistiques</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Participants
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.participants}
                    onChange={(e) => handleInputChange("participants", e.target.value)}
                    placeholder="0"
                    className={`border-2 ${errors.participants ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.participants && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.participants}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Articles
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.articles}
                    onChange={(e) => handleInputChange("articles", e.target.value)}
                    placeholder="0"
                    className={`border-2 ${errors.articles ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.articles && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.articles}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pays
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.countries}
                    onChange={(e) => handleInputChange("countries", e.target.value)}
                    placeholder="0"
                    className={`border-2 ${errors.countries ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.countries && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.countries}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h3>
              <Card className="p-4 bg-white border-2 border-gray-200">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {formData.event_name || "Nom de l'événement"}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {formData.subject_en || "Event subject"}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 flex items-center justify-center w-fit mx-auto">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>Archive</span>
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
                    {archiveItem ? 'Modifier' : 'Enregistrer'}
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

export default ArchiveForm;