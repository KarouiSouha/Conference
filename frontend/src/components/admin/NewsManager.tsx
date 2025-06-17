import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Calendar, ExternalLink } from "lucide-react";

export function NewsManager() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const news = [
    {
      id: 1,
      typeFr: "Annonce",
      typeEn: "Announcement",
      titleFr: "Ouverture des inscriptions",
      titleEn: "Registration is now open",
      date: "2024-03-15",
      author: "Comité d'Organisation",
      descriptionFr: "Les inscriptions pour la conférence sont maintenant ouvertes.",
      descriptionEn: "Registration for the conference is now open.",
      link: "https://example.com/register",
    },
    {
      id: 2,
      typeFr: "Actualité",
      typeEn: "News",
      titleFr: "Programme préliminaire disponible",
      titleEn: "Preliminary program available",
      date: "2024-03-20",
      author: "Comité Scientifique",
      descriptionFr: "Le programme préliminaire de la conférence est maintenant disponible.",
      descriptionEn: "The preliminary conference program is now available.",
      link: null,
    },
    {
      id: 3,
      typeFr: "Notification",
      typeEn: "Notification",
      titleFr: "Date limite extension",
      titleEn: "Deadline extension",
      date: "2024-03-25",
      author: "Secrétariat",
      descriptionFr: "La date limite de soumission a été prolongée jusqu'au 15 avril.",
      descriptionEn: "The submission deadline has been extended to April 15th.",
      link: null,
    },
  ];

  const getTypeBadge = (typeFr) => {
    const badgeClasses = {
      "Annonce": "bg-blue-600 text-white",
      "Actualité": "bg-green-600 text-white",
      "Notification": "bg-yellow-600 text-white",
      "Information": "bg-gray-600 text-white",
    };
    return <Badge className={badgeClasses[typeFr] || "bg-purple-600 text-white"}>{typeFr}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Actualités</h1>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau annonce
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">15</p>
            <p className="text-sm text-gray-500">Total Actualités</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-500">Publiées ce mois</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">3</p>
            <p className="text-sm text-gray-500">En attente</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">2,450</p>
            <p className="text-sm text-gray-500">Vues totales</p>
          </div>
        </Card>
      </div>

      {/* Recherche */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une actualité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-600"
          />
        </div>
      </Card>

      {/* Liste des actualités */}
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id} className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  {getTypeBadge(item.typeFr)}
                  <div className="flex items-center text-gray-500 text-sm space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>{item.author}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.titleFr}</h3>
                  <p className="text-sm text-gray-500 italic mb-2">{item.titleEn}</p>
                  <p className="text-gray-600">{item.descriptionFr}</p>
                  <p className="text-sm text-gray-400 italic">{item.descriptionEn}</p>
                </div>

                {item.link && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <a href={item.link} className="text-blue-600 hover:underline text-sm">
                      Voir le lien
                    </a>
                  </div>
                )}
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
          </Card>
        ))}
      </div>
    </div>
  );
}