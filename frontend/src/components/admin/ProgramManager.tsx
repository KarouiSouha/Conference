import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash, Clock, MapPin, Calendar } from "lucide-react";

export function ProgramManager() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const programData = [
    {
      id: 1,
      jour: "2024-06-17",
      heure: "09:00",
      evenementFr: "Cérémonie d'ouverture",
      evenementEn: "Opening Ceremony",
      descriptionFr: "Ouverture officielle de la conférence",
      descriptionEn: "Official conference opening",
      intervenantFr: "Prof. Jean Dubois",
      intervenantEn: "Prof. Jean Dubois",
      lieuFr: "Amphithéâtre Principal",
      lieuEn: "Main Auditorium",
      typeEvenement: "ceremony",
    },
    {
      id: 2,
      jour: "2024-06-17",
      heure: "10:30",
      evenementFr: "Conférence Inaugurale: IA et Avenir",
      evenementEn: "Keynote: AI and Future",
      descriptionFr: "Présentation sur l'intelligence artificielle",
      descriptionEn: "Presentation on artificial intelligence",
      intervenantFr: "Dr. Marie Curie",
      intervenantEn: "Dr. Marie Curie",
      lieuFr: "Salle de Conférence A",
      lieuEn: "Conference Room A",
      typeEvenement: "keynote",
    },
    {
      id: 3,
      jour: "2024-06-17",
      heure: "12:00",
      evenementFr: "Déjeuner",
      evenementEn: "Lunch",
      descriptionFr: "Pause déjeuner",
      descriptionEn: "Lunch break",
      intervenantFr: null,
      intervenantEn: null,
      lieuFr: "Restaurant Principal",
      lieuEn: "Main Restaurant",
      typeEvenement: "meal",
    },
  ];

  const getEventTypeBadge = (type) => {
    const badgeClasses = {
      "keynote": "bg-blue-600 text-white",
      "session": "bg-gray-600 text-white",
      "workshop": "bg-purple-100 text-purple-700",
      "panel": "bg-green-600 text-white",
      "break": "bg-gray-100 text-gray-700",
      "meal": "bg-yellow-600 text-white",
      "networking": "bg-gray-600 text-white",
      "ceremony": "bg-blue-600 text-white",
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
      <Badge className={badgeClasses[type] || "bg-purple-100 text-purple-700"}>
        {typeLabels[type] || type}
      </Badge>
    );
  };

  // Grouper par jour
  const groupedByDay = programData.reduce((acc, item) => {
    const date = item.jour;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const ProgramDay = ({ date, events }) => (
    <Card className="bg-white border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{event.heure}</span>
                    </div>
                    {getEventTypeBadge(event.typeEvenement)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">{event.evenementFr}</h4>
                    <p className="text-sm text-gray-500 italic">{event.evenementEn}</p>
                  </div>

                  {event.descriptionFr && (
                    <div>
                      <p className="text-gray-600 text-sm">{event.descriptionFr}</p>
                      <p className="text-gray-500 text-xs italic">{event.descriptionEn}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {event.intervenantFr && (
                      <div className="flex items-center space-x-1">
                        <span>👤</span>
                        <span>{event.intervenantFr}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.lieuFr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-300 hover:bg-red-50 hover:text-red-600">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion du Programme</h1>
       <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Programme
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-500">Total Sessions</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">24</p>
            <p className="text-sm text-gray-500">Conférences</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">32</p>
            <p className="text-sm text-gray-500">Ateliers</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">5</p>
            <p className="text-sm text-gray-500">Jours</p>
          </div>
        </Card>
      </div>

      {/* Recherche */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher dans le programme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-600"
          />
        </div>
      </Card>

      {/* Programme par jour */}
      <div className="space-y-6">
        {Object.entries(groupedByDay).map(([date, events]) => (
          <ProgramDay key={date} date={date} events={events} />
        ))}
      </div>
    </div>
  );
}