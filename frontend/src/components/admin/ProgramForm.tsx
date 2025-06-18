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
  ChevronDown,
  Star,
  Users,
  Mic,
  Coffee,
  Utensils,
  Handshake,
  Settings,
  Trophy
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
    { value: "keynote", label: "Conférence Principale", icon: Mic, color: "blue" },
    { value: "session", label: "Session", icon: Users, color: "gray" },
    { value: "workshop", label: "Atelier", icon: Settings, color: "purple" },
    { value: "panel", label: "Panel", icon: Users, color: "green" },
    { value: "break", label: "Pause", icon: Coffee, color: "orange" },
    { value: "meal", label: "Repas", icon: Utensils, color: "yellow" },
    { value: "networking", label: "Networking", icon: Handshake, color: "pink" },
    { value: "ceremony", label: "Cérémonie", icon: Trophy, color: "indigo" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventTypeIcon = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    const IconComponent = eventType?.icon || Users;
    return <IconComponent className="w-5 h-5" />;
  };

  const getEventTypeColor = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType?.color || "gray";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">
                  {editData ? "Modifier le Programme" : "Nouveau Programme"}
                </h2>
                <p className="text-blue-100 text-lg">
                  {editData ? "Mettez à jour les informations du programme" : "Créez un nouvel événement pour votre programme"}
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Informations de base */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Informations de base</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Date de l'événement
                  </label>
                  <Input
                    type="date"
                    value={formData.jour}
                    onChange={(e) => handleInputChange("jour", e.target.value)}
                    className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                      errors.jour 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.jour && <p className="text-red-500 text-sm mt-1">{errors.jour}</p>}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    Heure
                  </label>
                  <Input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => handleInputChange("heure", e.target.value)}
                    className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                      errors.heure 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.heure && <p className="text-red-500 text-sm mt-1">{errors.heure}</p>}
                </div>
              </div>

              {/* Type d'événement */}
              <div className="space-y-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4 mr-2 text-blue-600" />
                  Type d'événement
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {eventTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("type_evenement", type.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        formData.type_evenement === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData.type_evenement === type.value
                            ? `bg-gradient-to-r from-${type.color}-500 to-${type.color}-600 text-white`
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          <type.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-medium ${
                          formData.type_evenement === type.value
                            ? `text-${type.color}-700`
                            : "text-gray-600"
                        }`}>
                          {type.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu bilingue */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Contenu bilingue</h3>
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
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        Titre de l'événement (Français)
                      </label>
                      <Input
                        value={formData.evenement_fr}
                        onChange={(e) => handleInputChange("evenement_fr", e.target.value)}
                        placeholder="Ex: Conférence inaugurale sur l'intelligence artificielle"
                        className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                          errors.evenement_fr 
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      {errors.evenement_fr && <p className="text-red-500 text-sm mt-1">{errors.evenement_fr}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-green-500" />
                        Description (Français)
                      </label>
                      <textarea
                        value={formData.description_fr}
                        onChange={(e) => handleInputChange("description_fr", e.target.value)}
                        placeholder="Description détaillée de l'événement en français..."
                        rows={4}
                        className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 mr-2 text-purple-500" />
                          Intervenant (Français)
                        </label>
                        <Input
                          value={formData.intervenant_fr}
                          onChange={(e) => handleInputChange("intervenant_fr", e.target.value)}
                          placeholder="Ex: Prof. Jean Dupont"
                          className="rounded-xl border-2 border-gray-200 p-4 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          Lieu (Français)
                        </label>
                        <Input
                          value={formData.lieu_fr}
                          onChange={(e) => handleInputChange("lieu_fr", e.target.value)}
                          placeholder="Ex: Amphithéâtre principal"
                          className="rounded-xl border-2 border-gray-200 p-4 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="english" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        Event Title (English)
                      </label>
                      <Input
                        value={formData.evenement_en}
                        onChange={(e) => handleInputChange("evenement_en", e.target.value)}
                        placeholder="Ex: Keynote on Artificial Intelligence"
                        className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                          errors.evenement_en 
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      />
                      {errors.evenement_en && <p className="text-red-500 text-sm mt-1">{errors.evenement_en}</p>}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 mr-2 text-green-500" />
                        Description (English)
                      </label>
                      <textarea
                        value={formData.description_en}
                        onChange={(e) => handleInputChange("description_en", e.target.value)}
                        placeholder="Detailed event description in English..."
                        rows={4}
                        className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 mr-2 text-purple-500" />
                          Speaker (English)
                        </label>
                        <Input
                          value={formData.intervenant_en}
                          onChange={(e) => handleInputChange("intervenant_en", e.target.value)}
                          placeholder="Ex: Prof. John Smith"
                          className="rounded-xl border-2 border-gray-200 p-4 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          Location (English)
                        </label>
                        <Input
                          value={formData.lieu_en}
                          onChange={(e) => handleInputChange("lieu_en", e.target.value)}
                          placeholder="Ex: Main Auditorium"
                          className="rounded-xl border-2 border-gray-200 p-4 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="px-8 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sauvegarde...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{editData ? "Mettre à jour" : "Créer le programme"}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}