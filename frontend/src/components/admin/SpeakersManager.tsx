import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Mail } from "lucide-react";

export function SpeakersManager() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const speakers = [
    {
      id: 1,
      name: "Dr. Sophie Martin",
      email: "sophie.martin@research.fr",
      jobFr: "Professeure en Intelligence Artificielle",
      jobEn: "Professor in Artificial Intelligence",
      countryFr: "France",
      countryEn: "France",
      themeId: 1,
      themeName: "IA et Technologies",
    },
    {
      id: 2,
      name: "Prof. Ahmed Hassan",
      email: "a.hassan@university.eg",
      jobFr: "Directeur de Recherche",
      jobEn: "Research Director",
      countryFr: "Égypte",
      countryEn: "Egypt",
      themeId: 2,
      themeName: "Sciences Médicales",
    },
    {
      id: 3,
      name: "Dr. Maria Rodriguez",
      email: "m.rodriguez@tech.es",
      jobFr: "Chercheuse Senior",
      jobEn: "Senior Researcher",
      countryFr: "Espagne",
      countryEn: "Spain",
      themeId: 1,
      themeName: "IA et Technologies",
    },
  ];

  const getThemeBadge = (themeName) => {
    const themeColors = {
      "IA et Technologies": "bg-blue-500 text-white hover:bg-blue-500",
      "Sciences Médicales": "bg-green-500 text-white hover:bg-green-500",
      "Environnement": "bg-emerald-500 text-white hover:bg-emerald-500",
      "Énergie": "bg-yellow-500 text-white hover:bg-yellow-500",
      "Économie": "bg-purple-500 text-white hover:bg-purple-500",
    };
    
    const colorClass = themeColors[themeName] || "bg-gray-500 text-white hover:bg-gray-500";
    return <Badge className={colorClass}>{themeName}</Badge>;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.jobFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.countryFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.themeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Intervenants</h1>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Intervenant
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">89</p>
            <p className="text-sm text-gray-600">Total Intervenants</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600">Keynote Speakers</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">45</p>
            <p className="text-sm text-gray-600">Pays Représentés</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-600">Thèmes Couverts</p>
          </div>
        </Card>
      </div>

      {/* Recherche */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un intervenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Liste des intervenants */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des Intervenants</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Fonction</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Pays</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Thème</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpeakers.map((speaker) => (
                  <tr key={speaker.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {getInitials(speaker.name)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{speaker.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{speaker.email}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 hover:bg-blue-50"
                          onClick={() => window.location.href = `mailto:${speaker.email}`}
                          title="Envoyer un email"
                        >
                          <Mail className="w-3 h-3 text-blue-600" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{speaker.jobFr}</p>
                        <p className="text-gray-600 text-xs italic">{speaker.jobEn}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{speaker.countryFr}</p>
                        <p className="text-gray-600 text-xs italic">{speaker.countryEn}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getThemeBadge(speaker.themeName)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-300 hover:bg-gray-50 text-gray-600"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                          title="Supprimer"
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

          {filteredSpeakers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Aucun intervenant trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Essayez de modifier votre recherche</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}