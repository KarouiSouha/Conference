import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Save, User, AlertCircle, Crown, Star, UserCheck, Upload, ImageIcon } from "lucide-react";

interface Member {
  id?: number;
  name_fr: string;
  name_en: string;
  institute_fr: string;
  institute_en: string;
  job_fr: string;
  job_en: string;
  special_role: string;
  committee_type: string;
  order: number;
  image_path?: string;
}

interface ComiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member, imageFile?: File) => void;
  member?: Member | null;
}

type FormErrors = Partial<Record<keyof Member | 'submit' | 'image', string>>;

export default function ComiteForm({ isOpen, onClose, onSave, member }: ComiteFormProps) {
  const [formData, setFormData] = useState<Member>({
    name_fr: "",
    name_en: "",
    institute_fr: "",
    institute_en: "",
    job_fr: "Membre",
    job_en: "Member",
    special_role: "member",
    committee_type: "scientific",
    order: 0,
    image_path: "",
    ...member
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

useEffect(() => {
  console.log('Membre reçu:', member); // Vérifie les données brutes
  if (member) {
    const newFormData = {
      id: member.id,
      name_fr: member.name_fr || '',
      name_en: member.name_en || '',
      institute_fr: member.institute_fr || '',
      institute_en: member.institute_en || '',
      job_fr: member.job_fr || 'Membre',
      job_en: member.job_en || 'Member',
      special_role: member.special_role || 'member',
      committee_type: member.committee_type || 'scientific',
      order: member.order || 0,
      image_path: member.image_path || ''
    };
    setFormData(newFormData);
    console.log('FormData défini:', newFormData); // Vérifie les données normalisées
    if (member.image_path) {
      setImagePreview(`http://localhost:8000/storage/${member.image_path}`);
    }
  } else {
    const defaultFormData = {
      name_fr: "",
      name_en: "",
      institute_fr: "",
      institute_en: "",
      job_fr: "Membre",
      job_en: "Member",
      special_role: "member",
      committee_type: "scientific",
      order: 0,
      image_path: ""
    };
    setFormData(defaultFormData);
    setImagePreview("");
  }
  setImageFile(null);
}, [member]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "order" ? parseInt(value) : value }));
    if (errors[name as keyof Member]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Member]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Veuillez sélectionner un fichier image valide" }));
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({ ...prev, image: "L'image ne doit pas dépasser 2MB" }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: undefined }));

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image_path: "" }));
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name_fr.trim()) newErrors.name_fr = "Le nom en français est requis";
    if (!formData.name_en.trim()) newErrors.name_en = "Le nom en anglais est requis";
    if (!formData.institute_fr.trim()) newErrors.institute_fr = "L'institut en français est requis";
    if (!formData.institute_en.trim()) newErrors.institute_en = "L'institut en anglais est requis";
    if (!formData.job_fr.trim()) newErrors.job_fr = "La fonction en français est requise";
    if (!formData.job_en.trim()) newErrors.job_en = "La fonction en anglais est requise";
    if (formData.order < 0) newErrors.order = "L'ordre doit être un nombre positif ou zéro";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData, imageFile || undefined);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setErrors(prev => ({ ...prev, submit: "Une erreur est survenue lors de l'enregistrement" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = () => {
    switch (formData.special_role) {
      case "chair":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 flex items-center">
            <Crown className="w-3 h-3 mr-1" />
            Président
          </Badge>
        );
      case "co-chair":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Vice-Président
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 flex items-center">
            <UserCheck className="w-3 h-3 mr-1" />
            Membre
          </Badge>
        );
    }
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
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    {member ? "Modifier Membre" : "Nouveau Membre"}
                  </h2>
                  <p className="text-gray-600">
                    {member ? "Modifiez les informations du membre" : "Ajoutez un nouveau membre au comité"}
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
            {/* Image Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Photo du membre</h3>
              </div>
              
              <div className="flex items-start space-x-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-xs text-gray-500">Aucune image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700 mb-2">
                      Télécharger une image
                    </Label>
                    <div className="flex space-x-3">
                      <label className="cursor-pointer">
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="inline-flex items-center px-4 py-2 border-2 border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir une image
                        </div>
                      </label>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Formats acceptés: JPG, PNG, GIF (max. 2MB)
                    </p>
                  </div>
                  {errors.image && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.image}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Informations personnelles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name_fr" className="block text-sm font-semibold text-gray-700">Nom (Français) *</Label>
                  <Input
                    id="name_fr"
                    name="name_fr"
                    value={formData.name_fr}
                    onChange={handleChange}
                    placeholder="Nom en français"
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
                  <Label htmlFor="name_en" className="block text-sm font-semibold text-gray-700">Nom (Anglais) *</Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="Name in English"
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
            </div>

            {/* Institute Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Informations sur l'institut</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institute_fr" className="block text-sm font-semibold text-gray-700">Institut (Français) *</Label>
                  <Input
                    id="institute_fr"
                    name="institute_fr"
                    value={formData.institute_fr}
                    onChange={handleChange}
                    placeholder="Institut en français"
                    className={`border-2 ${errors.institute_fr ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.institute_fr && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.institute_fr}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institute_en" className="block text-sm font-semibold text-gray-700">Institut (Anglais) *</Label>
                  <Input
                    id="institute_en"
                    name="institute_en"
                    value={formData.institute_en}
                    onChange={handleChange}
                    placeholder="Institute in English"
                    className={`border-2 ${errors.institute_en ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.institute_en && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.institute_en}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Fonction</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="job_fr" className="block text-sm font-semibold text-gray-700">Fonction (Français) *</Label>
                  <Input
                    id="job_fr"
                    name="job_fr"
                    value={formData.job_fr}
                    onChange={handleChange}
                    placeholder="Fonction en français"
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
                  <Label htmlFor="job_en" className="block text-sm font-semibold text-gray-700">Fonction (Anglais) *</Label>
                  <Input
                    id="job_en"
                    name="job_en"
                    value={formData.job_en}
                    onChange={handleChange}
                    placeholder="Job in English"
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

            {/* Committee Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Détails du comité</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="block text-sm font-semibold text-gray-700">Rôle spécial *</Label>
                  <Select
                    value={formData.special_role}
                    onValueChange={(value) => handleSelectChange("special_role", value)}
                  >
                    <SelectTrigger className={`border-2 ${errors.special_role ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general chair">Président général</SelectItem>
                      <SelectItem value="chair">Président</SelectItem>
                      <SelectItem value="co-chair">Vice-Président</SelectItem>
                      <SelectItem value="member">Membre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.special_role && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.special_role}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="block text-sm font-semibold text-gray-700">Type de comité *</Label>
                  <Select
                    value={formData.committee_type}
                    onValueChange={(value) => handleSelectChange("committee_type", value)}
                  >
                    <SelectTrigger className={`border-2 ${errors.committee_type ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proceeding">Comité de procédure</SelectItem>
                      <SelectItem value="scientific">Comité Scientifique</SelectItem>
                      <SelectItem value="organizing">Comité d'Organisation</SelectItem>
                      <SelectItem value="honorary">Comité d'Honneur</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.committee_type && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.committee_type}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order" className="block text-sm font-semibold text-gray-700">Ordre d'affichage *</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="0"
                    className={`border-2 ${errors.order ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                  />
                  {errors.order && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.order}</span>
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
                  <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{formData.name_fr || "Nom du membre"}</h4>
                    <p className="text-sm text-gray-500 italic">{formData.name_en || "Member name"}</p>
                    <p className="text-xs text-gray-400 mt-1">{formData.institute_fr || "Institut"}</p>
                  </div>
                  {getRoleBadge()}
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
                    {member ? "Modifier" : "Enregistrer"}
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