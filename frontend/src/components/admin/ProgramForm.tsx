import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Save, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Tag,
  Globe,
  Star,
  Users,
  Mic,
  Coffee,
  Utensils,
  Handshake,
  Settings,
  Trophy,
  AlertCircle,
  Check
} from "lucide-react";

interface ProgramFormData {
  jour: string;
  heure: string;
  evenement_fr: string;
  evenement_en: string;
  description_fr: string;
  description_en: string;
  intervenant_fr: string;
  intervenant_en: string;
  lieu_fr: string;
  lieu_en: string;
  type_evenement: string;
}

interface ProgramFormErrors {
  jour?: string;
  heure?: string;
  evenement_fr?: string;
  evenement_en?: string;
  [key: string]: string | undefined;
}

export default function ProgramForm({
  isOpen,
  onClose,
  editData = null,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  editData?: ProgramFormData | null;
  onSave: (data: ProgramFormData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<ProgramFormData>({
    jour: editData?.jour || "",
    heure: editData?.heure || "",
    evenement_fr: editData?.evenement_fr || "",
    evenement_en: editData?.evenement_en || "",
    description_fr: editData?.description_fr || "",
    description_en: editData?.description_en || "",
    intervenant_fr: editData?.intervenant_fr || "",
    intervenant_en: editData?.intervenant_en || "",
    lieu_fr: editData?.lieu_fr || "",
    lieu_en: editData?.lieu_en || "",
    type_evenement: editData?.type_evenement || "session",
  });

  const [errors, setErrors] = useState<ProgramFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventTypes = [
    { value: "keynote", label: "Conférence Principale", icon: Mic, color: "from-blue-500 to-blue-600" },
    { value: "session", label: "Session", icon: Users, color: "from-gray-500 to-gray-600" },
    { value: "workshop", label: "Atelier", icon: Settings, color: "from-purple-500 to-purple-600" },
    { value: "panel", label: "Panel", icon: Users, color: "from-green-500 to-green-600" },
    { value: "break", label: "Pause", icon: Coffee, color: "from-orange-500 to-orange-600" },
    { value: "meal", label: "Repas", icon: Utensils, color: "from-yellow-500 to-yellow-600" },
    { value: "networking", label: "Networking", icon: Handshake, color: "from-pink-500 to-pink-600" },
    { value: "ceremony", label: "Cérémonie", icon: Trophy, color: "from-indigo-500 to-indigo-600" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ProgramFormErrors = {};
    
    if (!formData.jour) newErrors.jour = "La date est requise";
    if (!formData.heure) newErrors.heure = "L'heure est requise";
    if (!formData.evenement_fr) newErrors.evenement_fr = "L'événement (FR) est requis";
    if (!formData.evenement_en) newErrors.evenement_en = "L'événement (EN) est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setErrors(prev => ({ ...prev, submit: "Une erreur est survenue lors de l'enregistrement" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedTypeConfig = () => {
    return eventTypes.find(type => type.value === formData.type_evenement) || eventTypes[1];
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
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    {editData ? 'Modifier Programme' : 'Nouveau Programme'}
                  </h2>
                  <p className="text-gray-600">
                    {editData ? 'Modifiez les informations du programme' : 'Ajoutez un nouvel événement à votre programme'}
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
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Informations de base</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date de l'événement *
                  </label>
                  <Input
                    type="date"
                    value={formData.jour}
                    onChange={(e) => handleInputChange("jour", e.target.value)}
                    className={`border-2 ${errors.jour ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.jour && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.jour}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Heure *
                  </label>
                  <Input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => handleInputChange("heure", e.target.value)}
                    className={`border-2 ${errors.heure ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.heure && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.heure}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Type d'événement *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {eventTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("type_evenement", type.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                        formData.type_evenement === type.value
                          ? 'border-blue-400 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                        <type.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">{type.label}</span>
                      {formData.type_evenement === type.value && (
                        <Check className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bilingual Content */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Contenu bilingue</h3>
              </div>

              <Tabs defaultValue="french" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                  <TabsTrigger value="french" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🇫🇷 Français
                  </TabsTrigger>
                  <TabsTrigger value="english" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🇬🇧 English
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="french" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Titre de l'événement (Français) *
                      </label>
                      <Input
                        value={formData.evenement_fr}
                        onChange={(e) => handleInputChange("evenement_fr", e.target.value)}
                        placeholder="Ex: Conférence inaugurale sur l'intelligence artificielle"
                        className={`border-2 ${errors.evenement_fr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.evenement_fr && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.evenement_fr}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Description (Français)
                      </label>
                      <textarea
                        value={formData.description_fr}
                        onChange={(e) => handleInputChange("description_fr", e.target.value)}
                        placeholder="Description détaillée de l'événement en français..."
                        rows={4}
                        className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Intervenant (Français)
                        </label>
                        <Input
                          value={formData.intervenant_fr}
                          onChange={(e) => handleInputChange("intervenant_fr", e.target.value)}
                          placeholder="Ex: Prof. Jean Dupont"
                          className="border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Lieu (Français)
                        </label>
                        <Input
                          value={formData.lieu_fr}
                          onChange={(e) => handleInputChange("lieu_fr", e.target.value)}
                          placeholder="Ex: Amphithéâtre principal"
                          className="border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="english" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Event Title (English) *
                      </label>
                      <Input
                        value={formData.evenement_en}
                        onChange={(e) => handleInputChange("evenement_en", e.target.value)}
                        placeholder="Ex: Keynote on Artificial Intelligence"
                        className={`border-2 ${errors.evenement_en ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.evenement_en && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.evenement_en}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Description (English)
                      </label>
                      <textarea
                        value={formData.description_en}
                        onChange={(e) => handleInputChange("description_en", e.target.value)}
                        placeholder="Detailed event description in English..."
                        rows={4}
                        className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Speaker (English)
                        </label>
                        <Input
                          value={formData.intervenant_en}
                          onChange={(e) => handleInputChange("intervenant_en", e.target.value)}
                          placeholder="Ex: Prof. John Smith"
                          className="border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Location (English)
                        </label>
                        <Input
                          value={formData.lieu_en}
                          onChange={(e) => handleInputChange("lieu_en", e.target.value)}
                          placeholder="Ex: Main Auditorium"
                          className="border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h3>
              <Card className="p-4 bg-white border-2 border-gray-200">
                <div className="text-center space-y-3">
                  {(() => {
                    const Icon = getSelectedTypeConfig().icon;
                    return (
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        {Icon && <Icon className="w-6 h-6 text-gray-600" />}
                      </div>
                    );
                  })()}
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {formData.evenement_fr || "Titre de l'événement"}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {formData.evenement_en || "Event title"}
                    </p>
                  </div>
                  {(() => {
                    const Icon = getSelectedTypeConfig().icon;
                    return (
                      <Badge className={`bg-gradient-to-r ${getSelectedTypeConfig().color} text-white px-3 py-1 flex items-center justify-center w-fit mx-auto`}>
                        {Icon && <Icon className="w-4 h-4 mr-1" />}
                        <span>{getSelectedTypeConfig().label}</span>
                      </Badge>
                    );
                  })()}
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
                    {editData ? 'Modifier' : 'Enregistrer'}
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