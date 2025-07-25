import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Download, Filter, Users, CheckCircle, Clock, DollarSign, ChevronLeft, ChevronRight, Eye, FileText, Image } from "lucide-react";
import ParticipantForm from "./ParticipantForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  establishment: string;
  title: string;
  phone: string;
  participation_type: string;
  has_accompanying: string;
  accommodation_type: string;
  payment_method: string;
  status: string;
  amount: number;
  is_paid: boolean;
  nationality: string;
  accompanying_details: { name: string; age: number }[];
  payment_proof?: string;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  paid_amount: number;
}

export default function ParticipantsManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    paid_amount: 0,
  });

  // États pour le modal de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);

  // État pour la prévisualisation de l'image
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch participants and statistics from API
  useEffect(() => {
    fetchParticipants();
    fetchStatistics();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/Registration/all");
      // Parse accompanying_details and ensure amount is a number
      const parsedParticipants = response.data.data.map((participant: any) => {
        let parsedAccompanyingDetails: { name: string; age: number }[] = [];
        if (typeof participant.accompanying_details === "string" && participant.accompanying_details) {
          try {
            parsedAccompanyingDetails = JSON.parse(participant.accompanying_details);
          } catch (e) {
            console.error(`Error parsing accompanying_details for participant ${participant.id}:`, e);
            parsedAccompanyingDetails = [];
          }
        } else if (Array.isArray(participant.accompanying_details)) {
          parsedAccompanyingDetails = participant.accompanying_details;
        }
        return {
          ...participant,
          amount: parseFloat(participant.amount as unknown as string) || 0,
          accompanying_details: parsedAccompanyingDetails,
        };
      });
      setParticipants(parsedParticipants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/Registration/statistics");
      // Ensure paid_amount is a number
      setStats({
        ...response.data.data,
        paid_amount: parseFloat(response.data.data.paid_amount) || 0,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleOpenForm = (participant: Participant | null = null) => {
    setCurrentParticipant(participant);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentParticipant(null);
  };

  const handleSaveParticipant = async (data: FormData) => {
    try {
      const isEditing = !!currentParticipant;
      const url = isEditing
        ? `http://localhost:8000/api/Registration/update/${currentParticipant.id}`
        : 'http://localhost:8000/api/Registration/store';

      const response = await fetch(url, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de ${isEditing ? 'la mise à jour' : 'l\'enregistrement'} du participant`);
      }

      const result = await response.json();
      console.log('Réponse de l\'API:', result);

      // Refresh participants list
      await fetchParticipants();
      await fetchStatistics(); // Mettre à jour les statistiques
      handleCloseForm();
    } catch (error) {
      console.error(`Erreur lors de ${currentParticipant ? 'la mise à jour' : 'l\'enregistrement'} du participant:`, error);
      throw error; // Let ParticipantForm handle the error
    }
  };

  // Ouvrir le modal de confirmation de suppression
  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant);
    setIsDeleteModalOpen(true);
  };

  // Fermer le modal de suppression
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setParticipantToDelete(null);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!participantToDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/Registration/${participantToDelete.id}`);
      setParticipants((prev) => prev.filter((p) => p.id !== participantToDelete.id));
      await fetchStatistics(); // Mettre à jour les statistiques
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await axios.patch(`http://localhost:8000/api/Registration/${id}/mark-as-paid`);
      await fetchParticipants();
      await fetchStatistics();
      // Show success toast
      toast({
        title: "Succès",
        description: "Paiement marqué comme effectué avec succès !",
        variant: "default",
        duration: 3000,
        className: "bg-green-50 text-green-800 border-green-200 shadow-md rounded-lg",
      });
    } catch (error) {
      console.error("Error marking as paid:", error);
      // Show error toast
      toast({
        title: "Erreur",
        description: "Erreur lors du marquage du paiement.",
        variant: "destructive",
        duration: 3000,
        className: "bg-red-50 text-red-800 border-red-200 shadow-md rounded-lg",
      });
    }
  };

  // Fonction pour visualiser la preuve de paiement
  const handleViewPaymentProof = (paymentProof: string) => {
    const imageUrl = `http://localhost:8000/storage/${paymentProof}`;
    setImagePreview(imageUrl);
  };

  // Fonction pour télécharger la preuve de paiement
  const handleDownloadPaymentProof = async (paymentProof: string, participantName: string) => {
    try {
      const fileName = `preuve_paiement_${participantName.replace(/\s+/g, '_')}.${paymentProof.split('.').pop()}`;

      // Utiliser la route API au lieu d'accéder directement au storage
      const downloadUrl = `http://localhost:8000/api/download-payment-proof/${paymentProof}`;

      // Créer un lien direct pour le téléchargement
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank'; // Ouvrir dans un nouvel onglet si nécessaire
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Succès",
        description: "Preuve de paiement téléchargée avec succès !",
        variant: "default",
        duration: 3000,
        className: "bg-green-50 text-green-800 border-green-200 shadow-md rounded-lg",
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de la preuve de paiement.",
        variant: "destructive",
        duration: 3000,
        className: "bg-red-50 text-red-800 border-red-200 shadow-md rounded-lg",
      });
    }
  };

  const getStatusBadge = (status: string) => {
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

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid
      ? <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 font-medium">Payé</Badge>
      : <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-medium">Non payé</Badge>;
  };

  const getTypeBadge = (participationType: string) => {
    return participationType === "with-article"
      ? <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 font-medium">Avec article</Badge>
      : <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200 font-medium">Sans article</Badge>;
  };

  // Fonction pour obtenir l'icône selon le type de fichier
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const filteredParticipants = participants.filter((participant) =>
    participant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.establishment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredParticipants.length / itemsPerPage)); // Au minimum 1 page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.paid_amount.toFixed(2)} DT</p>
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
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Preuve Paiement</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {participant.first_name[0]}{participant.last_name[0]}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-900">{participant.first_name} {participant.last_name}</p>
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
                        {getTypeBadge(participant.participation_type)}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(participant.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {getPaymentBadge(participant.is_paid)}
                          <p className="text-sm font-semibold text-gray-900">
                            {(typeof participant.amount === 'number' ? participant.amount : parseFloat(participant.amount) || 0).toFixed(2)} DT
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {participant.payment_proof ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                              onClick={() => handleViewPaymentProof(participant.payment_proof!)}
                              title="Visualiser la preuve"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                              onClick={() => handleDownloadPaymentProof(participant.payment_proof!, `${participant.first_name}_${participant.last_name}`)}
                              title="Télécharger la preuve"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center text-xs text-gray-500">
                              {getFileIcon(participant.payment_proof)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-gray-400">
                            <FileText className="w-4 h-4 mr-1" />
                            <span>Aucune preuve</span>
                          </div>
                        )}
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
                            onClick={() => handleDeleteClick(participant)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                          {!participant.is_paid && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                              onClick={() => handleMarkAsPaid(participant.id)}
                            >
                              <DollarSign className="w-4 h-4" />
                            </Button>
                          )}
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

        {/* Pagination - Maintenant toujours visible */}
        <Card className="mt-6 p-6 bg-white border-2 border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredParticipants.length > 0 ? (
                <>Affichage de {startIndex + 1} à {Math.min(endIndex, filteredParticipants.length)} sur {filteredParticipants.length} participants</>
              ) : (
                <>Aucun participant à afficher</>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || filteredParticipants.length === 0}
                className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  disabled={filteredParticipants.length === 0}
                  className={`border-2 ${currentPage === page
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    } min-w-[40px] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || filteredParticipants.length === 0}
                className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de prévisualisation d'image */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-600 hover:text-gray-800 shadow-lg z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imagePreview}
              alt="Preuve de paiement"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Formulaire modal */}
      {isFormOpen && (
        <ParticipantForm
          participant={currentParticipant}
          onClose={handleCloseForm}
          onSave={handleSaveParticipant}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        Name={participantToDelete ? `${participantToDelete.first_name} ${participantToDelete.last_name}` : ""}
      />
    </div>
  );
}