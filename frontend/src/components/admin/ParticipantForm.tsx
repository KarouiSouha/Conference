// components/admin/ParticipantForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X, Save, User } from "lucide-react";

// Define the Participant interface if not already imported
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

export default function ParticipantForm({ participant, onClose, onSave }: ParticipantFormProps) {
  const [formData, setFormData] = useState(participant || {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {participant ? "Modifier Participant" : "Nouveau Participant"}
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="establishment">Établissement</Label>
                <Input
                  id="establishment"
                  name="establishment"
                  value={formData.establishment}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Fonction/Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Type de participation</Label>
                <Select
                  value={formData.participationType}
                  onValueChange={(value) => handleSelectChange("participationType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with-article">Avec article</SelectItem>
                    <SelectItem value="without-article">Sans article</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section supplémentaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Accompagnant</Label>
              <Select
                value={formData.has_accompanying}
                onValueChange={(value) => handleSelectChange("has_accompanying", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
              {formData.has_accompanying === "yes" && (
                <div className="mt-4">
                  <Label>Détails accompagnant</Label>
                  <Input
                    name="accompanying_details"
                    value={formData.accompanying_details}
                    onChange={handleChange}
                    placeholder="Nom et informations de l'accompagnant"
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Méthode de paiement</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleSelectChange("payment_method", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Virement bancaire</SelectItem>
                  <SelectItem value="administrative-order">Ordre administratif</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-4">
                <Label>Montant (€)</Label>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}