import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Save,
  FlaskConical,
  Building2,
  GraduationCap,
  Handshake,
  TrendingUp,
  ImageIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Label } from "recharts";

interface PartnerFormProps {
  onClose: () => void;
  onSubmit: (data: { id?: string; name_fr: string; name_en: string; image: File | string | null; type: string }) => void;
  partnerToEdit?: { id?: string; nameFr?: string; nameEn?: string; image?: string; type?: string } | null;
}

export default function PartnerForm({ onClose, onSubmit, partnerToEdit = null }: PartnerFormProps) {
  const [formData, setFormData] = useState({
    id: partnerToEdit?.id || "",
    name_fr: partnerToEdit?.nameFr || "",
    name_en: partnerToEdit?.nameEn || "", // Ensure nameEn is initialized
    image: partnerToEdit?.image || null,
    type: partnerToEdit?.type || "Partenaire"
  });

  type FormErrors = {
    name_fr?: string;
    name_en?: string;
    image?: string;
    submit?: string;
  };
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(partnerToEdit?.image ? `http://localhost:8000/storage/${partnerToEdit.image}` : null);

  const partnerTypes = [
    {
      value: "Institutionnels",
      label: "Institutionnels",
      icon: <GraduationCap className="w-4 h-4" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      value: "Industriels & Technologiques",
      label: "Industriels & Technologiques",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      value: "Centres de Recherche & Innovation",
      label: "Centres de Recherche & Innovation",
      icon: <FlaskConical className="w-4 h-4" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Veuillez sélectionner un fichier image valide" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "La taille de l'image ne doit pas dépasser 5MB" }));
        return;
      }
      console.log("Image file selected:", file);

      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result as string);
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name_fr.trim()) {
      newErrors.name_fr = "Le nom en français est requis";
    }

    if (!formData.name_en.trim()) {
      newErrors.name_en = "Le nom en anglais est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting form data:", formData);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name_fr', formData.name_fr);
      formDataToSend.append('name_en', formData.name_en);
      formDataToSend.append('type', formData.type);
      if (
        formData.image &&
        typeof formData.image !== "string" &&
        (formData.image as any) instanceof File
      ) {
        formDataToSend.append('image', formData.image);
      }

      const isEditing = !!partnerToEdit;
      const url = isEditing
        ? `http://localhost:8000/api/Partners/update/${partnerToEdit.id}`
        : 'http://localhost:8000/api/Partners/store';

      const response = await fetch(url, {
        method: isEditing ? 'POST' : 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de ${isEditing ? 'la mise à jour' : 'l\'enregistrement'} du partenaire`);
      }

      const result = await response.json();
      console.log('Réponse de l\'API:', result);

      onSubmit({
        id: result.partner.id,
        name_fr: formData.name_fr,
        name_en: formData.name_en,
        type: formData.type,
        image: result.partner.image,
      });

      onClose();
    } catch (error) {
      console.error(`Erreur lors de ${partnerToEdit ? 'la mise à jour' : 'l\'enregistrement'} du partenaire:`, error);
      setErrors((prev) => ({ ...prev, submit: `Une erreur est survenue lors de ${partnerToEdit ? 'la mise à jour' : 'l\'enregistrement'}` }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedTypeConfig = () => {
    return partnerTypes.find(type => type.value === formData.type) || partnerTypes[2];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    {partnerToEdit ? 'Modifier Partenaire' : 'Nouveau Partenaire'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {partnerToEdit ? 'Modifiez les informations du partenaire' : 'Ajoutez un nouveau partenaire à votre réseau'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-red-100 hover:text-red-600 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <Label className="block text-sm font-semibold text-gray-900">
                Type de Partenaire *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {partnerTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${formData.type === type.value
                      ? 'border-blue-400 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      {type.icon}
                    </div>
                    <span className="font-medium text-gray-700">{type.label}</span>
                    {formData.type === type.value && (
                      <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-gray-900">
                  Nom (Français) *
                </Label>
                <Input
                  value={formData.name_fr}
                  onChange={(e) => handleInputChange('name_fr', e.target.value)}
                  placeholder="Nom du partenaire en français"
                  className={`border-2 ${errors.name_fr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                />
                {errors.name_fr && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name_fr}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-gray-900">
                  Nom (Anglais) *
                </Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="Nom du partenaire en anglais"
                  className={`border-2 ${errors.name_en ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                />
                {errors.name_en && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name_en}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="block text-sm font-semibold text-gray-900">
                Logo / Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-32 h-32 object-cover rounded-lg mx-auto shadow-md"
                    />
                    <div className="flex justify-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                      <label className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Changer</span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Cliquez pour ajouter une image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {errors.image && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.image}</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Aperçu</h3>
              <Card className="p-4 bg-white border-2 border-gray-200">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    {getSelectedTypeConfig().icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {formData.name_fr || "Nom du partenaire"}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {formData.name_en || "Nom du partenaire"}
                    </p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${getSelectedTypeConfig().color} text-white px-3 py-1 flex items-center justify-center w-fit mx-auto`}>
                    {getSelectedTypeConfig().icon}
                    <span className="ml-1">{formData.type}</span>
                  </Badge>
                </div>
              </Card>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{errors.submit}</span>
                </div>
              </div>
            )}

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
                    {partnerToEdit ? 'Modifier' : 'Enregistrer'}
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