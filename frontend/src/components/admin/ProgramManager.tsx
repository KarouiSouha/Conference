import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash, Clock, MapPin, Calendar, Users, Star, Filter, X } from "lucide-react";

export default function ProgramManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    jour: "",
    heure: "",
    evenementFr: "",
    evenementEn: "",
    descriptionFr: "",
    descriptionEn: "",
    intervenantFr: "",
    intervenantEn: "",
    lieuFr: "",
    lieuEn: "",
    typeEvenement: "",
    participants: "",
    duree: ""
  });

  const [programData, setProgramData] = useState([
    {
      id: 1,
      jour: "2024-06-17",
      heure: "09:00",
      evenementFr: "Cérémonie d'ouverture",
      evenementEn: "Opening Ceremony",
      descriptionFr: "Ouverture officielle de la conférence avec présentation des objectifs",
      descriptionEn: "Official conference opening with objectives presentation",
      intervenantFr: "Prof. Jean Dubois",
      intervenantEn: "Prof. Jean Dubois",
      lieuFr: "Amphithéâtre Principal",
      lieuEn: "Main Auditorium",
      typeEvenement: "ceremony",
      participants: 500,
      duree: "45 min",
    },
    {
      id: 2,
      jour: "2024-06-17",
      heure: "10:30",
      evenementFr: "Conférence Inaugurale: IA et Avenir",
      evenementEn: "Keynote: AI and Future",
      descriptionFr: "Présentation sur l'intelligence artificielle et son impact sur l'avenir",
      descriptionEn: "Presentation on artificial intelligence and its impact on the future",
      intervenantFr: "Dr. Marie Curie",
      intervenantEn: "Dr. Marie Curie",
      lieuFr: "Salle de Conférence A",
      lieuEn: "Conference Room A",
      typeEvenement: "keynote",
      participants: 300,
      duree: "60 min",
    },
    {
      id: 3,
      jour: "2024-06-17",
      heure: "12:00",
      evenementFr: "Déjeuner Networking",
      evenementEn: "Networking Lunch",
      descriptionFr: "Pause déjeuner avec opportunités de networking",
      descriptionEn: "Lunch break with networking opportunities",
      intervenantFr: null,
      intervenantEn: null,
      lieuFr: "Restaurant Principal",
      lieuEn: "Main Restaurant",
      typeEvenement: "meal",
      participants: 400,
      duree: "90 min",
    },
    {
      id: 4,
      jour: "2024-06-17",
      heure: "14:00",
      evenementFr: "Atelier: Innovation Technologique",
      evenementEn: "Workshop: Technological Innovation",
      descriptionFr: "Atelier pratique sur les dernières innovations technologiques",
      descriptionEn: "Practical workshop on latest technological innovations",
      intervenantFr: "Dr. Sophie Martin",
      intervenantEn: "Dr. Sophie Martin",
      lieuFr: "Salle Workshop B",
      lieuEn: "Workshop Room B",
      typeEvenement: "workshop",
      participants: 50,
      duree: "120 min",
    },
  ]);

  const getEventTypeBadge = (type) => {
    const badgeStyles = {
      "keynote": "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
      "session": "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
      "workshop": "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
      "panel": "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
      "break": "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg",
      "meal": "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
      "networking": "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg",
      "ceremony": "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg",
    };

    const typeLabels = {
      "keynote": "Conférence",
      "session": "Session",
      "workshop": "Atelier",
      "panel": "Panel",
      "break": "Pause",
      "meal": "Repas",
      "networking": "Networking",
      "ceremony": "Cérémonie",
    };

    return (
      <Badge className={`${badgeStyles[type] || "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"} px-3 py-1 text-xs font-medium`}>
        {typeLabels[type] || type}
      </Badge>
    );
  };

  const getEventIcon = (type) => {
    const icons = {
      "keynote": "🎤",
      "session": "💼",
      "workshop": "🔧",
      "panel": "👥",
      "break": "☕",
      "meal": "🍽️",
      "networking": "🤝",
      "ceremony": "🎭",
    };
    return icons[type] || "📅";
  };

  const handleNewProgram = () => {
    setEditingEvent(null);
    setFormData({
      jour: "",
      heure: "",
      evenementFr: "",
      evenementEn: "",
      descriptionFr: "",
      descriptionEn: "",
      intervenantFr: "",
      intervenantEn: "",
      lieuFr: "",
      lieuEn: "",
      typeEvenement: "",
      participants: "",
      duree: ""
    });
    setShowForm(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event.id);
    setFormData({
      jour: event.jour,
      heure: event.heure,
      evenementFr: event.evenementFr,
      evenementEn: event.evenementEn,
      descriptionFr: event.descriptionFr,
      descriptionEn: event.descriptionEn,
      intervenantFr: event.intervenantFr,
      intervenantEn: event.intervenantEn,
      lieuFr: event.lieuFr,
      lieuEn: event.lieuEn,
      typeEvenement: event.typeEvenement,
      participants: event.participants,
      duree: event.duree
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingEvent) {
      // Mise à jour d'un événement existant
      setProgramData(prevData =>
        prevData.map(item =>
          item.id === editingEvent
            ? { ...formData, id: editingEvent, participants: formData.participants ? Number(formData.participants) : 0 }
            : item
        )
      );
    } else {
      // Création d'un nouvel événement
      const newId = Math.max(...programData.map(item => item.id)) + 1;
      setProgramData(prevData => [
        ...prevData,
        { ...formData, id: newId, participants: formData.participants ? Number(formData.participants) : 0 }
      ]);
    }

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setProgramData(prevData => prevData.filter(item => item.id !== id));
  };

  // Grouper par jour
  const groupedByDay = programData.reduce((acc, item) => {
    const date = item.jour;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const ProgramForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(false)}
            className="text-white hover:bg-white hover:bg-opacity-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jour">Date</Label>
              <Input
                id="jour"
                name="jour"
                type="date"
                value={formData.jour}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heure">Heure</Label>
              <Input
                id="heure"
                name="heure"
                type="time"
                value={formData.heure}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evenementFr">Événement (FR)</Label>
              <Input
                id="evenementFr"
                name="evenementFr"
                value={formData.evenementFr}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evenementEn">Événement (EN)</Label>
              <Input
                id="evenementEn"
                name="evenementEn"
                value={formData.evenementEn}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeEvenement">Type d'événement</Label>
              <Select
                value={formData.typeEvenement}
                onValueChange={(value) => setFormData({ ...formData, typeEvenement: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keynote">Conférence</SelectItem>
                  <SelectItem value="session">Session</SelectItem>
                  <SelectItem value="workshop">Atelier</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="break">Pause</SelectItem>
                  <SelectItem value="meal">Repas</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="ceremony">Cérémonie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Nombre de participants</Label>
              <Input
                id="participants"
                name="participants"
                type="number"
                value={formData.participants}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="descriptionFr">Description (FR)</Label>
              <Textarea
                id="descriptionFr"
                name="descriptionFr"
                value={formData.descriptionFr}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="descriptionEn">Description (EN)</Label>
              <Textarea
                id="descriptionEn"
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intervenantFr">Intervenant (FR)</Label>
              <Input
                id="intervenantFr"
                name="intervenantFr"
                value={formData.intervenantFr}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intervenantEn">Intervenant (EN)</Label>
              <Input
                id="intervenantEn"
                name="intervenantEn"
                value={formData.intervenantEn}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieuFr">Lieu (FR)</Label>
              <Input
                id="lieuFr"
                name="lieuFr"
                value={formData.lieuFr}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieuEn">Lieu (EN)</Label>
              <Input
                id="lieuEn"
                name="lieuEn"
                value={formData.lieuEn}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duree">Durée</Label>
              <Input
                id="duree"
                name="duree"
                value={formData.duree}
                onChange={handleInputChange}
                placeholder="ex: 45 min"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowForm(false)}
              className="border-gray-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {editingEvent ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  const ProgramDay = ({ date, events }) => (
    <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg mr-3">
            <Calendar className="w-5 h-5" />
          </div>
          {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="group relative border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-l-xl"></div>

              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3 pl-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-800">{event.heure}</span>
                    </div>
                    <span className="text-2xl">{getEventIcon(event.typeEvenement)}</span>
                    {getEventTypeBadge(event.typeEvenement)}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                      {event.evenementFr}
                    </h4>
                    <p className="text-sm text-gray-500 italic font-medium">{event.evenementEn}</p>
                  </div>

                  {event.descriptionFr && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <p className="text-gray-700 text-sm leading-relaxed">{event.descriptionFr}</p>
                      <p className="text-gray-500 text-xs italic">{event.descriptionEn}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-6 text-sm">
                    {event.intervenantFr && (
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs">
                          👤
                        </div>
                        <span className="font-medium text-gray-800">{event.intervenantFr}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 bg-green-50 rounded-lg px-3 py-1">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-800">{event.lieuFr}</span>
                    </div>
                    {event.participants && (
                      <div className="flex items-center space-x-2 bg-purple-50 rounded-lg px-3 py-1">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-800">{event.participants}</span>
                      </div>
                    )}
                    {event.duree && (
                      <div className="flex items-center space-x-2 bg-orange-50 rounded-lg px-3 py-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-800">{event.duree}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 transition-all duration-200"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-all duration-200"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion du Programme
              </h1>
              <p className="text-gray-600 text-lg">Organisez et gérez votre programme d'événements</p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
              onClick={handleNewProgram}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Programme
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{programData.length}</p>
              <p className="text-sm text-gray-600 font-medium">Total Sessions</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-green-600">{programData.filter(e => e.typeEvenement === 'keynote').length}</p>
              <p className="text-sm text-gray-600 font-medium">Conférences</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{programData.filter(e => e.typeEvenement === 'workshop').length}</p>
              <p className="text-sm text-gray-600 font-medium">Ateliers</p>
            </div>
          </Card>
          <Card className="p-6 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{new Set(programData.map(e => e.jour)).size}</p>
              <p className="text-sm text-gray-600 font-medium">Jours</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-0 shadow-lg rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher dans le programme... (événement, intervenant, lieu)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-700 bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>
        </Card>

        <div className="space-y-8">
          {Object.entries(groupedByDay).map(([date, events]) => (
            <ProgramDay key={date} date={date} events={events} />
          ))}
        </div>
      </div>

      {showForm && <ProgramForm />}
    </div>
  );
}