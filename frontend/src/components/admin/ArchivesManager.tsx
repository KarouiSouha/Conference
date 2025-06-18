import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, ExternalLink, Camera, Users, FileText, Globe, Archive, Calendar, MapPin, TrendingUp, X, Save, Building2, Hash, Languages } from "lucide-react";

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

type ArchiveFormErrors = Partial<Record<keyof ArchiveFormData, string | null>>;

function ArchiveForm({
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

  const handleInputChange = (field: keyof ArchiveFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
      await onSave(formData);
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
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

export default function ArchivesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentArchive, setCurrentArchive] = useState<Partial<ArchiveFormData> | null>(null);

  // Données d'exemple
  const [archives, setArchives] = useState<ArchiveFormData[]>([
    {
      id: 1,
      event_name: "Conférence Internationale 2023",
      subject_fr: "Intelligence Artificielle et Société",
      subject_en: "Artificial Intelligence and Society",
      organizer: "Université Paris-Saclay",
      participants: "450",
      articles: "89",
      countries: "25",
      photoGalleryLink: "https://gallery.example.com/2023",
      year: "2023",
      duration: "3 jours",
      location: "Paris, France",
      status: "active"
    },
    {
      id: 2,
      event_name: "Symposium Technologique 2022",
      subject_fr: "Innovation et Développement Durable",
      subject_en: "Innovation and Sustainable Development",
      organizer: "Institut Polytechnique",
      participants: "320",
      articles: "67",
      countries: "18",
      photoGalleryLink: "https://gallery.example.com/2022",
      year: "2022",
      duration: "2 jours",
      location: "Lyon, France",
      status: "archived"
    },
    {
      id: 3,
      event_name: "Forum Scientifique 2021",
      subject_fr: "Technologies Médicales Avancées",
      subject_en: "Advanced Medical Technologies",
      organizer: "Centre de Recherche Médical",
      participants: "275",
      articles: "52",
      countries: "22",
      photoGalleryLink: "https://gallery.example.com/2021",
      year: "2021",
      duration: "4 jours",
      location: "Marseille, France",
      status: "archived"
    },
  ]);

  const filteredArchives = archives.filter(archive =>
    archive.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.subject_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.subject_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm px-3 py-1">Actif</Badge>;
    }
    return <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm px-3 py-1">Archivé</Badge>;
  };

  const handleNewArchive = () => {
    setCurrentArchive(null);
    setIsFormOpen(true);
  };

  const handleEditArchive = (archive: ArchiveFormData) => {
    setCurrentArchive(archive);
    setIsFormOpen(true);
  };

  const handleSaveArchive = async (data: ArchiveFormData) => {
    if (currentArchive && currentArchive.id) {
      // Mise à jour d'une archive existante
      setArchives(archives.map(archive => 
        archive.id === currentArchive.id ? { ...data, id: currentArchive.id } : archive
      ));
    } else {
      // Création d'une nouvelle archive
      const newArchive = {
        ...data,
        id: Math.max(...archives.map(a => a.id || 0), 0) + 1,
        year: new Date().getFullYear().toString(),
        duration: "1 jour",
        location: "Non spécifié",
        status: "active"
      };
      setArchives([...archives, newArchive]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteArchive = (id: number) => {
    setArchives(archives.filter(archive => archive.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Archives</h1>
            <p className="text-gray-600">Consultez et gérez l'historique de vos événements</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
            onClick={handleNewArchive}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Archive
          </Button>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{archives.length}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Événements Archivés</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Archive className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  {archives.reduce((sum, archive) => sum + parseInt(archive.participants || "0"), 0)}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Total Participants</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  {archives.reduce((sum, archive) => sum + parseInt(archive.articles || "0"), 0)}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Articles Publiés</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  {archives.reduce((sum, archive) => sum + parseInt(archive.countries || "0"), 0)}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Pays Représentés</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 bg-white border-0 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom d'événement, sujet, organisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base rounded-lg transition-all duration-200"
            />
          </div>
        </Card>

        {/* Formulaire d'archive */}
        <ArchiveForm
          isOpen={isFormOpen}
          archiveItem={currentArchive}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveArchive}
        />

        {/* Grille des archives */}
        {filteredArchives.length === 0 ? (
          <Card className="p-12 bg-white border-0 shadow-lg text-center">
            <div className="text-gray-400 mb-4">
              <Archive className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune archive trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredArchives.map((archive) => (
              <Card key={archive.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* En-tête de la carte */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <Badge className="bg-gray-100 text-gray-700 mb-2">{archive.year}</Badge>
                        {archive.status && getStatusBadge(archive.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {archive.event_name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-800 font-semibold">{archive.subject_fr}</p>
                      <p className="text-sm text-gray-600 italic">{archive.subject_en}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{archive.location}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span>{archive.duration}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-medium">{archive.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques de l'événement */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{archive.participants}</p>
                      <p className="text-xs text-gray-600 font-medium">Participants</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{archive.articles}</p>
                      <p className="text-xs text-gray-600 font-medium">Articles</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <Globe className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{archive.countries}</p>
                      <p className="text-xs text-gray-600 font-medium">Pays</p>
                    </div>
                  </div>

                  {/* Galerie photo */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Camera className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Galerie Photos</p>
                          <p className="text-xs text-gray-600">Moments marquants de l'événement</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={() => window.open(archive.photoGalleryLink, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm"
                      title="Modifier l'archive"
                      onClick={() => handleEditArchive(archive)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm"
                      title="Supprimer l'archive"
                      onClick={() => archive.id && handleDeleteArchive(archive.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}