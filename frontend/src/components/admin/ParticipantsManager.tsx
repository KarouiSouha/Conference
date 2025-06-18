import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash, Download, Filter, Users, CheckCircle, Clock, DollarSign } from "lucide-react";
import ParticipantForm from "./ParticipantForm";

export default function ParticipantsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);

  // Données d'exemple
  const participants = [
    {
      id: 1,
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@example.com",
      establishment: "Université Paris-Saclay",
      title: "Professeure",
      phone: "+33 1 23 45 67 89",
      participationType: "with-article",
      has_accompanying: "no",
      accompanying_details: "",
      accommodation_type: "with-accommodation",
      payment_method: "bank-transfer",
      status: "confirmed",
      amount: 350.00,
      isPaid: true,
    },
    {
      id: 2,
      firstName: "Ahmed",
      lastName: "Ben Ali",
      email: "ahmed.benali@example.com",
      establishment: "Institut Polytechnique",
      title: "Docteur",
      phone: "+33 6 12 34 56 78",
      participationType: "without-article",
      has_accompanying: "yes",
      accompanying_details: "Fatima Ben Ali",
      accommodation_type: "without-accommodation",
      payment_method: "administrative-order",
      status: "pending",
      amount: 250.00,
      isPaid: false,
    },
    {
      id: 3,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "s.johnson@university.edu",
      establishment: "MIT",
      title: "Chercheuse",
      phone: "+1 555 123 4567",
      participationType: "with-article",
      has_accompanying: "no",
      accompanying_details: "",
      accommodation_type: "with-accommodation",
      payment_method: "check",
      status: "confirmed",
      amount: 350.00,
      isPaid: true,
    },
  ];

  const handleOpenForm = (participant = null) => {
    setCurrentParticipant(participant);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentParticipant(null);
  };

  const handleSaveParticipant = (data) => {
    // Ici vous devrez implémenter la logique pour sauvegarder dans votre API
    console.log("Participant à sauvegarder:", data);

    // Exemple de mise à jour locale (à remplacer par un appel API)
    if (data.id) {
      // Mise à jour d'un participant existant
      const updatedParticipants = participants.map(p =>
        p.id === data.id ? { ...p, ...data } : p
      );
      // Dans une vraie application, vous mettriez à jour l'état ici
    } else {
      // Création d'un nouveau participant
      const newParticipant = {
        ...data,
        id: Math.max(...participants.map(p => p.id)) + 1
      };
      // Dans une vraie application, vous ajouteriez au state ici
    }

    handleCloseForm();
  };

  const handleDeleteParticipant = (id) => {
    // Implémentez la suppression ici
    console.log("Supprimer participant avec id:", id);
    // Dans une vraie application, vous filtreriez le state ici
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 font-medium">Confirmé</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 font-medium">En attente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-medium">Annulé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 font-medium">{status}</Badge>;
    }
  };

  const getPaymentBadge = (isPaid) => {
    return isPaid
      ? <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 font-medium">Payé</Badge>
      : <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-medium">Non payé</Badge>;
  };

  const getTypeBadge = (participationType) => {
    return participationType === 'with-article'
      ? <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 font-medium">Avec article</Badge>
      : <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200 font-medium">Sans article</Badge>;
  };

  const filteredParticipants = participants.filter(participant =>
    participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.establishment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                  Gestion des Participants
                </h1>
                <p className="text-gray-600 text-lg">Gérez et suivez tous vos participants à la conférence</p>
              </div>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
                onClick={() => handleOpenForm()}
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouveau Participant
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'confirmed').length}
                </p>
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  €{participants.reduce((sum, p) => sum + (p.isPaid ? p.amount : 0), 0).toFixed(2)}
                </p>
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher par nom, email ou établissement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium h-11 px-6">
                <Filter className="w-4 h-4 mr-2" />
                Filtres Avancés
              </Button>
            </div>
          </div>
        </Card>

        {/* Liste des participants */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Liste des Participants</h3>
            <p className="text-sm text-gray-600 mt-1">{filteredParticipants.length} participant(s) trouvé(s)</p>
          </div>

          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Participant</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Établissement</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Paiement</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {participant.firstName[0]}{participant.lastName[0]}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-900">{participant.firstName} {participant.lastName}</p>
                            <p className="text-sm text-gray-600">{participant.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-gray-900 font-medium">{participant.email}</p>
                          <p className="text-sm text-gray-600">{participant.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-900 font-medium">{participant.establishment}</p>
                      </td>
                      <td className="py-4 px-6">
                        {getTypeBadge(participant.participationType)}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(participant.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {getPaymentBadge(participant.isPaid)}
                          <p className="text-sm font-semibold text-gray-900">€{participant.amount.toFixed(2)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 w-8 p-0"
                            onClick={() => handleOpenForm(participant)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            onClick={() => handleDeleteParticipant(participant.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredParticipants.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Aucun participant trouvé</p>
                <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Formulaire modal */}
      {isFormOpen && (
        <ParticipantForm
          participant={currentParticipant}
          onClose={handleCloseForm}
          onSave={handleSaveParticipant}
        />
      )}
    </div>
  );
}