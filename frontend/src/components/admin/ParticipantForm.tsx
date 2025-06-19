import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Save, User, AlertCircle, Eye, EyeOff } from "lucide-react";

interface Participant {
  firstName: string;
  lastName: string;
  email: string;
  establishment: string;
  title: string;
  phone: string;
  participationType: string;
  has_accompanying: string;
  accompanying_details: string;
  accommodation_type: string;
  payment_method: string;
  status: string;
  amount: number;
  isPaid: boolean;
}

interface ParticipantFormProps {
  participant?: Participant;
  onClose: () => void;
  onSave: (data: Participant) => void;
}

type ParticipantFormErrors = Partial<Record<keyof Participant, string>> & { submit?: string };

export default function ParticipantForm({ participant, onClose, onSave }: ParticipantFormProps) {
  const [formData, setFormData] = useState<Participant>(participant || {
    firstName: "",
    lastName: "",
    email: "",
    establishment: "",
    title: "",
    phone: "",
    participationType: "without-article",
    has_accompanying: "no",
    accompanying_details: "",
    accommodation_type: "without-accommodation",
    payment_method: "bank-transfer",
    status: "pending",
    amount: 0,
    isPaid: false,
  });

  const [errors, setErrors] = useState<ParticipantFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (participant) {
      setFormData(participant);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        establishment: "",
        title: "",
        phone: "",
        participationType: "without-article",
        has_accompanying: "no",
        accompanying_details: "",
        accommodation_type: "without-accommodation",
        payment_method: "bank-transfer",
        status: "pending",
        amount: 0,
        isPaid: false,
      });
    }
  }, [participant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Participant]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Participant]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ParticipantFormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "L'email doit être valide";
    if (!formData.establishment.trim()) newErrors.establishment = "L'établissement est requis";
    if (!formData.title.trim()) newErrors.title = "La fonction/titre est requis";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (formData.amount < 0) newErrors.amount = "Le montant ne peut pas être négatif";

    if (formData.has_accompanying === "yes" && !formData.accompanying_details.trim()) {
      newErrors.accompanying_details = "Les détails de l'accompagnant sont requis";
    }

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors(prev => ({ ...prev, submit: "Une erreur est survenue lors de l'enregistrement" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!participant && !formData) return null;

  const getStatusBadge = () => {
    if (formData.status === "confirmed") {
      return <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1">Confirmé</Badge>;
    } else if (formData.status === "cancelled") {
      return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1">Annulé</Badge>;
    }
    return <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1">En attente</Badge>;
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
                    {participant ? "Modifier Participant" : "Nouveau Participant"}
                  </h2>
                  <p className="text-gray-600">
                    {participant ? "Modifiez les informations du participant" : "Ajoutez un nouveau participant à l'événement"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2"
                >
                  {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
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
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {!previewMode ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Informations personnelles</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">Prénom *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className={`border-2 ${errors.firstName ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.firstName && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.firstName}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Nom *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Nom"
                        className={`border-2 ${errors.lastName ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.lastName && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.lastName}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@exemple.com"
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
                      <Label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Téléphone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 123 456 789"
                        className={`border-2 ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.phone && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Informations professionnelles</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="establishment" className="block text-sm font-semibold text-gray-700">Établissement *</Label>
                      <Input
                        id="establishment"
                        name="establishment"
                        value={formData.establishment}
                        onChange={handleChange}
                        placeholder="Nom de l'établissement"
                        className={`border-2 ${errors.establishment ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.establishment && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.establishment}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="block text-sm font-semibold text-gray-700">Fonction/Titre *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Fonction ou titre"
                        className={`border-2 ${errors.title ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.title && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.title}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-sm font-semibold text-gray-700">Type de participation</Label>
                      <Select
                        value={formData.participationType}
                        onValueChange={(value) => handleSelectChange("participationType", value)}
                      >
                        <SelectTrigger className={`border-2 ${errors.participationType ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="with-article">Avec article</SelectItem>
                          <SelectItem value="without-article">Sans article</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.participationType && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.participationType}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-sm font-semibold text-gray-700">Statut</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger className={`border-2 ${errors.status ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Informations supplémentaires</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="block text-sm font-semibold text-gray-700">Accompagnant</Label>
                      <Select
                        value={formData.has_accompanying}
                        onValueChange={(value) => handleSelectChange("has_accompanying", value)}
                      >
                        <SelectTrigger className={`border-2 ${errors.has_accompanying ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Oui</SelectItem>
                          <SelectItem value="no">Non</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.has_accompanying === "yes" && (
                        <div className="mt-4 space-y-2">
                          <Label htmlFor="accompanying_details" className="block text-sm font-semibold text-gray-700">Détails accompagnant *</Label>
                          <Input
                            id="accompanying_details"
                            name="accompanying_details"
                            value={formData.accompanying_details}
                            onChange={handleChange}
                            placeholder="Nom et informations de l'accompagnant"
                            className={`border-2 ${errors.accompanying_details ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                          />
                          {errors.accompanying_details && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.accompanying_details}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-sm font-semibold text-gray-700">Méthode de paiement</Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value) => handleSelectChange("payment_method", value)}
                      >
                        <SelectTrigger className={`border-2 ${errors.payment_method ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank-transfer">Virement bancaire</SelectItem>
                          <SelectItem value="administrative-order">Ordre administratif</SelectItem>
                          <SelectItem value="check">Chèque</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="amount" className="block text-sm font-semibold text-gray-700">Montant (€) *</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="0"
                          className={`border-2 ${errors.amount ? 'border-red-300' : 'border-gray-200'} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                        />
                        {errors.amount && (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.amount}</span>
                          </div>
                        )}
                      </div>
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
                        <h4 className="font-semibold text-gray-800">{`${formData.firstName || "Prénom"} ${formData.lastName || "Nom"}`}</h4>
                        <p className="text-sm text-gray-500 italic">{formData.email || "email@exemple.com"}</p>
                      </div>
                      {getStatusBadge()}
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

                {/* Action Buttons */}
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
                        {participant ? "Modifier" : "Enregistrer"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* Preview Mode */
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Aperçu du participant</h3>
                  <p className="text-gray-600">Voici comment les informations du participant apparaîtront</p>
                </div>
                <Card className="p-8 bg-white border-2 border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {getStatusBadge()}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{`${formData.firstName} ${formData.lastName}`}</h3>
                      <p className="text-sm text-gray-500 font-medium italic mb-3">{formData.email}</p>
                      <p className="text-gray-700 leading-relaxed">{formData.title}, {formData.establishment}</p>
                      <p className="text-gray-700 leading-relaxed">Téléphone: {formData.phone}</p>
                      <p className="text-gray-700 leading-relaxed">
                        Type de participation: {formData.participationType === "with-article" ? "Avec article" : "Sans article"}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Accompagnant: {formData.has_accompanying === "yes" ? `Oui (${formData.accompanying_details})` : "Non"}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Méthode de paiement: {formData.payment_method === "bank-transfer" ? "Virement bancaire" : formData.payment_method === "administrative-order" ? "Ordre administratif" : "Chèque"}
                      </p>
                      <p className="text-gray-700 leading-relaxed">Montant: {formData.amount} €</p>
                      <p className="text-gray-700 leading-relaxed">Payé: {formData.isPaid ? "Oui" : "Non"}</p>
                    </div>
                  </div>
                </Card>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setPreviewMode(false)}
                    variant="outline"
                    className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50"
                  >
                    Retour à l'édition
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}