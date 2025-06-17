import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash, Download } from "lucide-react";

export function ParticipantsManager() {
  const [searchTerm, setSearchTerm] = useState("");

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
      status: "confirmed",
      amount: 350.00,
      isPaid: true,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 text-white hover:bg-green-500">Confirmé</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-500">En attente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 text-white hover:bg-red-500">Annulé</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-500">{status}</Badge>;
    }
  };

  const getPaymentBadge = (isPaid) => {
    return isPaid 
      ? <Badge className="bg-green-500 text-white hover:bg-green-500">Payé</Badge>
      : <Badge className="bg-red-500 text-white hover:bg-red-500">Non payé</Badge>;
  };

  const getTypeBadge = (participationType) => {
    return participationType === 'with-article' 
      ? <Badge className="bg-blue-500 text-white hover:bg-blue-500">Avec article</Badge>
      : <Badge className="bg-gray-600 text-white hover:bg-gray-600">Sans article</Badge>;
  };

  const filteredParticipants = participants.filter(participant =>
    participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.establishment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Participants</h1>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Participant
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">1,234</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">987</p>
            <p className="text-sm text-gray-600">Confirmés</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">156</p>
            <p className="text-sm text-gray-600">En attente</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">€285,650</p>
            <p className="text-sm text-gray-600">Revenus</p>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un participant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
            Filtres
          </Button>
        </div>
      </Card>

      {/* Liste des participants */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des Participants</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Établissement</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Statut</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Paiement</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{participant.firstName} {participant.lastName}</p>
                        <p className="text-sm text-gray-600">{participant.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{participant.email}</td>
                    <td className="py-4 px-4 text-gray-700">{participant.establishment}</td>
                    <td className="py-4 px-4">
                      {getTypeBadge(participant.participationType)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(participant.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        {getPaymentBadge(participant.isPaid)}
                        <p className="text-sm text-gray-600 mt-1">€{participant.amount.toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700">
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
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun participant trouvé</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}