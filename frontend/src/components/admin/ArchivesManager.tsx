import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, ExternalLink, Camera, Users, FileText, Globe } from "lucide-react";

export function ArchivesManager() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const archives = [
    {
      id: 1,
      eventName: "Conférence Internationale 2023",
      subjectFr: "Intelligence Artificielle et Société",
      subjectEn: "Artificial Intelligence and Society",
      organizer: "Université Paris-Saclay",
      participants: 450,
      articles: 89,
      countries: 25,
      photoGalleryLink: "https://gallery.example.com/2023",
    },
    {
      id: 2,
      eventName: "Symposium Technologique 2022",
      subjectFr: "Innovation et Développement Durable",
      subjectEn: "Innovation and Sustainable Development",
      organizer: "Institut Polytechnique",
      participants: 320,
      articles: 67,
      countries: 18,
      photoGalleryLink: "https://gallery.example.com/2022",
    },
    {
      id: 3,
      eventName: "Forum Scientifique 2021",
      subjectFr: "Technologies Médicales Avancées",
      subjectEn: "Advanced Medical Technologies",
      organizer: "Centre de Recherche Médical",
      participants: 275,
      articles: 52,
      countries: 22,
      photoGalleryLink: "https://gallery.example.com/2021",
    },
  ];

  const filteredArchives = archives.filter(archive =>
    archive.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.subjectFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.subjectEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Archives</h1>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Archive
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">42</p>
            <p className="text-sm text-gray-600">Événements Archivés</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">12,450</p>
            <p className="text-sm text-gray-600">Total Participants</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">2,850</p>
            <p className="text-sm text-gray-600">Articles Publiés</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">85</p>
            <p className="text-sm text-gray-600">Pays Représentés</p>
          </div>
        </Card>
      </div>

      {/* Recherche */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher dans les archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Grille des archives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredArchives.map((archive) => (
          <Card key={archive.id} className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{archive.eventName}</h3>
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">{archive.subjectFr}</p>
                  <p className="text-sm text-gray-600 italic">{archive.subjectEn}</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Organisé par:</span> {archive.organizer}
                </p>
              </div>

              {/* Statistiques de l'archive */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-800">{archive.participants}</p>
                  <p className="text-xs text-gray-600">Participants</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-800">{archive.articles}</p>
                  <p className="text-xs text-gray-600">Articles</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Globe className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-800">{archive.countries}</p>
                  <p className="text-xs text-gray-600">Pays</p>
                </div>
              </div>

              {/* Galerie photo */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">Galerie Photos</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                  onClick={() => window.open(archive.photoGalleryLink, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Voir
                </Button>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
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
            </div>
          </Card>
        ))}
      </div>

      {filteredArchives.length === 0 && (
        <Card className="p-8 bg-white border border-gray-200 shadow-sm">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Aucune archive trouvée</p>
            <p className="text-gray-400 text-sm mt-1">Essayez de modifier votre recherche</p>
          </div>
        </Card>
      )}
    </div>
  );
}