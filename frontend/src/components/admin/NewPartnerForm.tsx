import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Save, 
  Upload, 
  Building2, 
  GraduationCap, 
  Handshake, 
  TrendingUp,
  ImageIcon,
  Check,
  AlertCircle
} from "lucide-react";

export default function NewPartnerForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name_fr: "",
    name_en: "",
    image: null,
    type: "Partenaire"
  });

  type Errors = {
    name_fr?: string;
    name_en?: string;
    image?: string;
    submit?: string;
  };
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const partnerTypes = [
    { 
      value: "Académique", 
      label: "Académique", 
      icon: <GraduationCap className="w-4 h-4" />,
      color: "from-blue-500 to-blue-600"
    },
    { 
      value: "Sponsor", 
      label: "Sponsor", 
      icon: <TrendingUp className="w-4 h-4" />,
      color: "from-green-500 to-green-600"
    },
    { 
      value: "Partenaire", 
      label: "Partenaire", 
      icon: <Handshake className="w-4 h-4" />,
      color: "from-purple-500 to-purple-600"
    },
    { 
      value: "Entreprise", 
      label: "Entreprise", 
      icon: <Building2 className="w-4 h-4" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Veuillez sélectionner un fichier image valide" }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "La taille du fichier ne doit pas dépasser 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    
    if (!formData.name_fr.trim()) {
      newErrors.name_fr = "Le nom en français est requis";
    }
    
    if (!formData.name_en.trim()) {
      newErrors.name_en = "Le nom en anglais est requis";
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call onSave with form data
      if (onSave) {
        onSave(formData);
      }
      
      // Close form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      setErrors({ submit: "Une erreur est survenue lors de l'enregistrement" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedTypeConfig = () => {
    return partnerTypes.find(type => type.value === formData.type) || partnerTypes[2];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white shadow-2xl border-0 rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    Nouveau Partenaire
                  </h2>
                  <p className="text-gray-600">Ajoutez un nouveau partenaire à votre réseau</p>
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
            {/* Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Type de Partenaire *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {partnerTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                      formData.type === type.value
                        ? 'border-blue-400 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                      {type.icon}
                    </div>
                    <span className="font-medium text-gray-700">{type.label}</span>
                    {formData.type === type.value && (
                      <Check className="w-4 h-4 text-blue-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nom (Français) *
                </label>
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
                <label className="block text-sm font-semibold text-gray-700">
                  Nom (Anglais) *
                </label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="Partner name in English"
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

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Logo / Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
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

            {/* Preview Card */}
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
                      {formData.name_en || "Partner name"}
                    </p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${getSelectedTypeConfig().color} text-white px-3 py-1 flex items-center justify-center w-fit mx-auto`}>
                    {getSelectedTypeConfig().icon}
                    <span className="ml-1">{formData.type}</span>
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
                type="submit"
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
                    Enregistrer
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