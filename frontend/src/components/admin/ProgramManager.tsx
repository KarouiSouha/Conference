import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
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
  Trophy
} from "lucide-react";
import ProgramForm from "./ProgramForm";

interface Program {
  id: number;
  jour: string;
  heure: string;
  evenement_fr: string;
  evenement_en: string;
  description_fr: string;
  description_en: string;
  intervenant_fr: string;
  intervenant_en: string;
  lieu_fr: string;
  lieu_en: string;
  type_evenement: string;
}

export default function ProgramManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      jour: "2025-06-20",
      heure: "09:00",
      evenement_fr: "Conférence inaugurale",
      evenement_en: "Opening Keynote",
      description_fr: "Introduction à la conférence sur l'IA",
      description_en: "Introduction to the AI conference",
      intervenant_fr: "Prof. Jean Dupont",
      intervenant_en: "Prof. John Smith",
      lieu_fr: "Amphithéâtre principal",
      lieu_en: "Main Auditorium",
      type_evenement: "keynote",
    },
    {
      id: 2,
      jour: "2025-06-20",
      heure: "10:30",
      evenement_fr: "Pause café",
      evenement_en: "Coffee Break",
      description_fr: "Moment de networking",
      description_en: "Networking moment",
      intervenant_fr: "",
      intervenant_en: "",
      lieu_fr: "Hall central",
      lieu_en: "Central Hall",
      type_evenement: "break",
    },
    {
      id: 3,
      jour: "2025-06-20",
      heure: "11:00",
      evenement_fr: "Atelier IA pratique",
      evenement_en: "Practical AI Workshop",
      description_fr: "Atelier interactif sur les outils d'IA",
      description_en: "Interactive workshop on AI tools",
      intervenant_fr: "Dr. Marie Curie",
      intervenant_en: "Dr. Marie Curie",
      lieu_fr: "Salle A",
      lieu_en: "Room A",
      type_evenement: "workshop",
    },
  ]);

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

  const handleSaveProgram = async (data: Program) => {
    if (editingProgram) {
      // Update existing program
      setPrograms(prev =>
        prev.map(p => (p.id === editingProgram.id ? { ...p, ...data } : p))
      );
    } else {
      // Add new program
      setPrograms(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingProgram(null);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleDeleteProgram = (id: number) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  const filteredPrograms = programs.filter(program =>
    program.evenement_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.evenement_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.lieu_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.lieu_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPrograms = filteredPrograms.reduce((acc, program) => {
    const date = program.jour;
    if (!acc[date]) acc[date] = [];
    acc[date].push(program);
    return acc;
  }, {} as Record<string, Program[]>);

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
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel Événement
            </Button>
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
                  {filteredPrograms.length} résultat{filteredPrograms.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Timeline View */}
        {Object.keys(groupedPrograms).length === 0 && searchTerm ? (
          <Card className="p-12 bg-white border-2 border-dashed border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </Card>
        ) : (
          Object.keys(groupedPrograms)
            .sort()
            .map(date => (
              <div key={date} className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h2>
                </div>
                <div className="space-y-4">
                  {groupedPrograms[date]
                    .sort((a, b) => a.heure.localeCompare(b.heure))
                    .map(program => {
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
                                    {program.evenement_fr}
                                  </h3>
                                  <p className="text-sm text-gray-500 italic">{program.evenement_en}</p>
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
                                    onClick={() => handleDeleteProgram(program.id)}
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
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{program.lieu_fr || program.lieu_en}</span>
                                </div>
                                {program.intervenant_fr && (
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{program.intervenant_fr}</span>
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
                              {program.description_fr && (
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                  {program.description_fr}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))
        )}

        {/* Form Modal */}
        {showForm && (
          <ProgramForm
            isOpen={showForm}
            onClose={handleCloseForm}
            editData={editingProgram}
            onSave={handleSaveProgram}
          />
        )}
      </div>
    </div>
  );
}