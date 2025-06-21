import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  Plus,
  Edit,
  Trash,
  Mic,
  Users,
  Coffee,
  Utensils,
  Handshake,
  Settings,
  Trophy,
} from "lucide-react";
import ProgramForm from "./ProgramForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import axios from "axios";

interface Program {
  id: number;
  jour: string;
  heure: string;
  evenement: string;
  description: string | null;
  lieu: string | null;
  type_evenement: string;
  speaker: { id: number; name: string; job: string; country: string } | null;
  evenement_fr?: string;
  evenement_en?: string;
  description_fr?: string;
  description_en?: string;
  lieu_fr?: string;
  lieu_en?: string;
  speaker_id?: string;
}

export default function ProgramManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedDate, setSelectedDate] = useState("2024-10-02");
  const [lang, setLang] = useState("fr");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const eventTypes = {
    keynote: { label: "Conférence Principale", icon: Mic, color: "from-blue-500 to-blue-600" },
    session: { label: "Session", icon: Users, color: "from-gray-500 to-gray-600" },
    workshop: { label: "Atelier", icon: Settings, color: "from-purple-500 to-purple-600" },
    panel: { label: "Panel", icon: Users, color: "from-green-500 to-green-600" },
    break: { label: "Pause", icon: Coffee, color: "from-orange-500 to-orange-600" },
    meal: { label: "Repas", icon: Utensils, color: "from-yellow-500 to-yellow-600" },
    networking: { label: "Networking", icon: Handshake, color: "from-pink-500 to-pink-600" },
    ceremony: { label: "Cérémonie", icon: Trophy, color: "from-indigo-500 to-indigo-600" },
  };

  const fetchPrograms = async (date: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/Programme/daily`, {
        params: { date, lang },
      });
      setPrograms(response.data.programmes || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des programmes :", error);
    }
  };

  useEffect(() => {
    fetchPrograms(selectedDate);
  }, [selectedDate, lang]);

  const handleSaveProgram = async (data: any) => {
    try {
      const payload = {
        jour: data.jour,
        heure: data.heure,
        evenement_fr: data.evenement_fr,
        evenement_en: data.evenement_en,
        description_fr: data.description_fr,
        description_en: data.description_en,
        lieu_fr: data.lieu_fr,
        lieu_en: data.lieu_en,
        type_evenement: data.type_evenement,
        speaker_id: data.speaker_id || null,
      };

      if (editingProgram) {
        await axios.put(`http://localhost:8000/api/Programme/${editingProgram.id}`, payload);
      } else {
        await axios.post(`http://localhost:8000/api/Programme`, payload);
      }
      fetchPrograms(selectedDate);
      setShowForm(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du programme :", error);
      throw error;
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram({
      ...program,
      evenement_fr: program.evenement || "",
      evenement_en: program.evenement || "",
      description_fr: program.description || "",
      description_en: program.description || "",
      lieu_fr: program.lieu || "",
      lieu_en: program.lieu || "",
      speaker_id: program.speaker?.id?.toString() || "",
    });
    setShowForm(true);
  };

  const handleOpenDeleteModal = (program: Program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  const handleDeleteProgram = async () => {
    if (programToDelete) {
      try {
        await axios.delete(`http://localhost:8000/api/Programme/${programToDelete.id}`);
        fetchPrograms(selectedDate);
        setShowDeleteModal(false);
        setProgramToDelete(null);
      } catch (error) {
        console.error("Erreur lors de la suppression du programme :", error);
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProgramToDelete(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.evenement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.lieu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.speaker?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion du Programme
              </h1>
              <p className="text-gray-600 text-lg">Organisez et gérez votre calendrier d'événements</p>
            </div>
            <div className="flex space-x-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl"
              />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-2"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvel Événement
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="p-6 bg-white border-2 border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par titre, lieu ou intervenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {filteredPrograms.length} résultat{filteredPrograms.length > 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Timeline View */}
        {filteredPrograms.length === 0 && searchTerm ? (
          <Card className="p-12 bg-white border-2 border-dashed border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {new Date(selectedDate).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>
            <div className="space-y-4">
              {filteredPrograms
                .sort((a, b) => a.heure.localeCompare(b.heure))
                .map((program) => {
                  const typeConfig = eventTypes[program.type_evenement as keyof typeof eventTypes] || eventTypes.session;
                  const Icon = typeConfig.icon;
                  return (
                    <Card
                      key={program.id}
                      className="p-6 bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300">
                            <Icon className="w-6 h-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                                {program.evenement}
                              </h3>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProgram(program)}
                                className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDeleteModal(program)}
                                className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{program.heure}</span>
                            </div>
                            {program.lieu && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{program.lieu}</span>
                              </div>
                            )}
                            {program.speaker && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{program.speaker.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <Badge
                              className={`bg-gradient-to-r ${typeConfig.color} text-white px-3 py-1 flex items-center space-x-1`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{typeConfig.label}</span>
                            </Badge>
                          </div>
                          {program.description && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{program.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <ProgramForm
            isOpen={showForm}
            onClose={handleCloseForm}
            editData={editingProgram ? {
              ...editingProgram,
              evenement_fr: editingProgram.evenement_fr ?? "",
              evenement_en: editingProgram.evenement_en ?? "",
              description_fr: editingProgram.description_fr ?? "",
              description_en: editingProgram.description_en ?? "",
              lieu_fr: editingProgram.lieu_fr ?? "",
              lieu_en: editingProgram.lieu_en ?? "",
              speaker_id: editingProgram.speaker_id ?? "",
            } : undefined}
            onSave={handleSaveProgram}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && programToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteProgram}
            Name={programToDelete.evenement}
          />
        )}
      </div>
    </div>
  );
}