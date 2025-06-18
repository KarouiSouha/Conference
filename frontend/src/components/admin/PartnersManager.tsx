import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Upload,
  Building2,
  GraduationCap,
  Handshake,
  TrendingUp,
  X,
  Save,
  ImageIcon,
  Check,
  AlertCircle
} from "lucide-react";

// Composant du formulaire de nouveau partenaire
function NewPartnerForm({ onClose, onSave, partnerToEdit = null }) {
  const [formData, setFormData] = useState({
    name_fr: partnerToEdit?.nameFr || "",
    name_en: partnerToEdit?.nameEn || "",
    image: null,
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Veuillez sélectionner un fichier image valide" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "La taille du fichier ne doit pas dépasser 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
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

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onSave) onSave(formData);
      if (onClose) onClose();
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
                    {partnerToEdit ? 'Modifier Partenaire' : 'Nouveau Partenaire'}
                  </h2>
                  <p className="text-gray-600">
                    {partnerToEdit ? 'Modifiez les informations du partenaire' : 'Ajoutez un nouveau partenaire à votre réseau'}
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
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${formData.type === type.value
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

// Composant principal du gestionnaire de partenaires
export default function PartnersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPartner, setEditingPartner] = useState(null);
  const [showNewPartnerForm, setShowNewPartnerForm] = useState(false);
  const [partners, setPartners] = useState([
    {
      id: 1,
      nameFr: "Université de Technologie",
      nameEn: "Technology University",
      image: "/placeholder.svg",
      type: "Académique",
    },
    {
      id: 2,
      nameFr: "Entreprise Innovante SA",
      nameEn: "Innovative Company SA",
      image: "/placeholder.svg",
      type: "Sponsor",
    },
    {
      id: 3,
      nameFr: "Centre de Recherche",
      nameEn: "Research Center",
      image: "/placeholder.svg",
      type: "Partenaire",
    },
    {
      id: 4,
      nameFr: "Institut National",
      nameEn: "National Institute",
      image: "/placeholder.svg",
      type: "Académique",
    },
    {
      id: 5,
      nameFr: "TechCorp Solutions",
      nameEn: "TechCorp Solutions",
      image: "/placeholder.svg",
      type: "Sponsor",
    },
    {
      id: 6,
      nameFr: "Laboratoire Avancé",
      nameEn: "Advanced Laboratory",
      image: "/placeholder.svg",
      type: "Partenaire",
    },
  ]);

  const handleSavePartner = (formData) => {
    if (editingPartner) {
      // Mode édition
      const updatedPartner = {
        ...editingPartner,
        nameFr: formData.name_fr,
        nameEn: formData.name_en,
        image: formData.image ? URL.createObjectURL(formData.image) : editingPartner.image,
        type: formData.type,
      };

      setPartners(prev => prev.map(p => p.id === editingPartner.id ? updatedPartner : p));
    } else {
      // Mode ajout (code existant)
      const newPartner = {
        id: Date.now(),
        nameFr: formData.name_fr,
        nameEn: formData.name_en,
        image: formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg",
        type: formData.type,
      };

      setPartners(prev => [...prev, newPartner]);
    }

    setShowNewPartnerForm(false);
    setEditingPartner(null);
  };
  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setShowNewPartnerForm(true);
  };
  const handleCloseForm = () => {
    setShowNewPartnerForm(false);
    setEditingPartner(null);
  };

  const getTypeBadge = (type) => {
    const badgeConfig = {
      "Académique": {
        className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
        icon: <GraduationCap className="w-3 h-3 mr-1" />
      },
      "Sponsor": {
        className: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md",
        icon: <TrendingUp className="w-3 h-3 mr-1" />
      },
      "Partenaire": {
        className: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md",
        icon: <Handshake className="w-3 h-3 mr-1" />
      },
      "Entreprise": {
        className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
        icon: <Building2 className="w-3 h-3 mr-1" />
      },
    };

    const config = badgeConfig[type] || {
      className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
      icon: <Building2 className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${config.className} px-3 py-1 flex items-center justify-center font-medium`}>
        {config.icon}
        {type}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Académique":
        return <GraduationCap className="w-10 h-10 text-blue-500" />;
      case "Sponsor":
        return <TrendingUp className="w-10 h-10 text-green-500" />;
      case "Partenaire":
        return <Handshake className="w-10 h-10 text-purple-500" />;
      case "Entreprise":
        return <Building2 className="w-10 h-10 text-orange-500" />;
      default:
        return <Building2 className="w-10 h-10 text-orange-500" />;
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques dynamiques
  const stats = {
    total: partners.length,
    sponsors: partners.filter(p => p.type === "Sponsor").length,
    academiques: partners.filter(p => p.type === "Académique").length,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* En-tête avec dégradé subtil */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion des Partenaires
              </h1>
              <p className="text-gray-600 text-lg">Gérez et organisez vos partenariats stratégiques</p>
            </div>
            <Button
              onClick={() => setShowNewPartnerForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Partenaire
            </Button>
          </div>
        </div>

        {/* Statistiques dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.total}</p>
                <p className="text-gray-600 font-medium">Total Partenaires</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.sponsors}</p>
                <p className="text-gray-600 font-medium">Sponsors</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.academiques}</p>
                <p className="text-gray-600 font-medium">Partenaires Académiques</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 bg-white border-2 border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom, type ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {filteredPartners.length} résultat{filteredPartners.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Grille des partenaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="group p-6 bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300 shadow-inner">
                    {getTypeIcon(partner.type)}
                  </div>
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {partner.nameFr}
                  </h3>
                  <p className="text-sm text-gray-500 italic font-medium">
                    {partner.nameEn}
                  </p>
                </div>

                <div className="flex justify-center">
                  {getTypeBadge(partner.type)}
                </div>

                <div className="flex justify-center space-x-2 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPartner(partner)}
                    className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredPartners.length === 0 && searchTerm && (
          <Card className="p-12 bg-white border-2 border-dashed border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun partenaire trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </Card>
        )}
      </div>

      {/* Modal du formulaire */}
      {showNewPartnerForm && (
        <NewPartnerForm
          onClose={handleCloseForm}
          onSave={handleSavePartner}
          partnerToEdit={editingPartner}
        />
      )}
    </div>
  );
}