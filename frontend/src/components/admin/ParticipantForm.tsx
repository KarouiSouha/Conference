import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Save, User, AlertCircle, Eye, EyeOff, Upload } from "lucide-react";

interface Participant {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  establishment: string;
  title: string;
  phone: string;
  participation_type: string;
  has_accompanying: string;
  accompanying_details: string;
  accommodation_type: string;
  payment_method: string;
  status: string;
  amount: number;
  is_paid: boolean;
  payment_proof?: string;
}

interface ParticipantFormProps {
  participant?: Participant;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

type ParticipantFormErrors = Partial<Record<keyof Participant, string>> & { submit?: string };

export default function ParticipantForm({ participant, onClose, onSave }: ParticipantFormProps) {
  const [formData, setFormData] = useState<Participant>({
    first_name: participant?.first_name || "",
    last_name: participant?.last_name || "",
    email: participant?.email || "",
    establishment: participant?.establishment || "",
    title: participant?.title || "",
    phone: participant?.phone || "",
    participation_type: participant?.participation_type || "without-article",
    has_accompanying: participant?.has_accompanying || "no",
    accompanying_details: participant?.accompanying_details || "",
    accommodation_type: participant?.accommodation_type || "without-accommodation",
    payment_method: participant?.payment_method || "bank-transfer",
    status: participant?.status || "pending",
    amount: participant?.amount || 0,
    is_paid: participant?.is_paid || false,
  });

  const [errors, setErrors] = useState<ParticipantFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(participant?.payment_proof ? `http://localhost:8000/storage/${participant.payment_proof}` : null);

  useEffect(() => {
    if (participant) {
      setFormData({
        first_name: participant.first_name,
        last_name: participant.last_name,
        email: participant.email,
        establishment: participant.establishment,
        title: participant.title,
        phone: participant.phone,
        participation_type: participant.participation_type,
        has_accompanying: participant.has_accompanying,
        accompanying_details: participant.accompanying_details,
        accommodation_type: participant.accommodation_type,
        payment_method: participant.payment_method,
        status: participant.status,
        amount: participant.amount,
        is_paid: participant.is_paid,
      });
      setPaymentProofPreview(participant.payment_proof ? `http://localhost:8000/storage/${participant.payment_proof}` : null);
    }
  }, [participant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Participant]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Participant]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Update amount based on accommodation type
    if (name === "accommodation_type") {
      const amount = value === "with-accommodation" ? 120.0 : 50.0;
      setFormData((prev) => ({ ...prev, amount }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({ ...prev, payment_proof: "Le fichier doit être un PDF, JPG ou PNG" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, payment_proof: "Le fichier ne doit pas dépasser 5MB" }));
        return;
      }
      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, payment_proof: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ParticipantFormErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis";
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
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("establishment", formData.establishment);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("participation_type", formData.participation_type);
      formDataToSend.append("has_accompanying", formData.has_accompanying);
      formDataToSend.append("accompanying_details", formData.accompanying_details);
      formDataToSend.append("accommodation_type", formData.accommodation_type);
      formDataToSend.append("payment_method", formData.payment_method);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("amount", formData.amount.toString());
      if (paymentProof) {
        formDataToSend.append("payment_proof", paymentProof);
      }

      await onSave(formDataToSend);
    } catch (error: unknown) {
      let errorMessage = "Une erreur est survenue lors de l'enregistrement";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response === "object" &&
        (error as { response?: { data?: { message?: string } } }).response !== null &&
        "data" in (error as { response?: { data?: { message?: string } } }).response! &&
        typeof ((error as { response?: { data?: { message?: string } } }).response as { data?: { message?: string } }).data === "object" &&
        ((error as { response?: { data?: { message?: string } } }).response as { data?: { message?: string } }).data !== null &&
        "message" in ((error as { response?: { data?: { message?: string } } }).response as { data?: { message?: string } }).data!
      ) {
        errorMessage =
          (((error as { response?: { data?: { message?: string } } }).response as { data?: { message?: string } }).data as { message?: string }).message ||
          errorMessage;
      }
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      <Label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">Prénom *</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className={`border-2 ${errors.first_name ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.first_name && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.first_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">Nom *</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Nom"
                        className={`border-2 ${errors.last_name ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                      />
                      {errors.last_name && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.last_name}</span>
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
                        className={`border-2 ${errors.email ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
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
                        className={`border-2 ${errors.phone ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
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
                        className={`border-2 ${errors.establishment ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
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
                        className={`border-2 ${errors.title ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
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
                        value={formData.participation_type}
                        onValueChange={(value) => handleSelectChange("participation_type", value)}
                      >
                        <SelectTrigger
                          className={`border-2 ${errors.participation_type ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                        >
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="with-article">Avec article</SelectItem>
                          <SelectItem value="without-article">Sans article</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.participation_type && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.participation_type}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-sm font-semibold text-gray-700">Statut</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger
                          className={`border-2 ${errors.status ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                        >
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
                        <SelectTrigger
                          className={`border-2 ${errors.has_accompanying ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                        >
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Oui</SelectItem>
                          <SelectItem value="no">Non</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.has_accompanying === "yes" && (
                        <div className="mt-4 space-y-2">
                          <Label htmlFor="accompanying_details" className="block text-sm font-semibold text-gray-700">
                            Détails accompagnant *
                          </Label>
                          <Input
                            id="accompanying_details"
                            name="accompanying_details"
                            value={formData.accompanying_details}
                            onChange={handleChange}
                            placeholder="Nom et informations de l'accompagnant"
                            className={`border-2 ${errors.accompanying_details ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
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
                        <SelectTrigger
                          className={`border-2 ${errors.payment_method ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
                        >
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
                          className={`border-2 ${errors.amount ? "border-red-300" : "border-gray-200"} focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 py-3`}
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

                {/* Payment Proof Upload */}
                <div className="space-y-3">
                  <Label className="block text-sm font-semibold text-gray-700">Justificatif de paiement</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    {paymentProofPreview ? (
                      <div className="space-y-4">
                        {paymentProofPreview.endsWith(".pdf") ? (
                          <embed src={paymentProofPreview} type="application/pdf" width="100%" height="200px" />
                        ) : (
                          <img src={paymentProofPreview} alt="Justificatif" className="w-32 h-32 object-cover rounded-lg mx-auto shadow-md" />
                        )}
                        <div className="flex justify-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPaymentProof(null);
                              setPaymentProofPreview(null);
                            }}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                          <label className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>Changer</span>
                            </Button>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Cliquez pour ajouter un justificatif</p>
                            <p className="text-sm text-gray-500">PDF, JPG, PNG jusqu'à 5MB</p>
                          </div>
                        </div>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                  {errors.payment_proof && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.payment_proof}</span>
                    </div>
                  )}
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
                        <h4 className="font-semibold text-gray-800">{`${formData.first_name || "Prénom"} ${formData.last_name || "Nom"}`}</h4>
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
                    <div className="flex items-center gap-4">{getStatusBadge()}</div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{`${formData.first_name} ${formData.last_name}`}</h3>
                      <p className="text-sm text-gray-500 font-medium italic mb-3">{formData.email}</p>
                      <p className="text-gray-700 leading-relaxed">{formData.title}, {formData.establishment}</p>
                      <p className="text-gray-700 leading-relaxed">Téléphone: {formData.phone}</p>
                      <p className="text-gray-700 leading-relaxed">
                        Type de participation: {formData.participation_type === "with-article" ? "Avec article" : "Sans article"}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Accompagnant: {formData.has_accompanying === "yes" ? `Oui (${formData.accompanying_details})` : "Non"}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Méthode de paiement: {formData.payment_method === "bank-transfer" ? "Virement bancaire" : formData.payment_method === "administrative-order" ? "Ordre administratif" : "Chèque"}
                      </p>
                      <p className="text-gray-700 leading-relaxed">Montant: {formData.amount} €</p>
                      <p className="text-gray-700 leading-relaxed">Payé: {formData.is_paid ? "Oui" : "Non"}</p>
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