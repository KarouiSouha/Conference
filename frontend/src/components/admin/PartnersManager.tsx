import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Upload } from "lucide-react";

export function PartnersManager() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const partners = [
    {
      id: 1,
      nameFr: "Université de Technologie",
      nameEn: "Technology University",
      image: "/placeholder.svg",
      type: "Académique",
    },
    {
      id: 2,
      nameFr: "Entreprise Innovante SA",
      nameEn: "Innovative Company SA",
      image: "/placeholder.svg",
      type: "Sponsor",
    },
    {
      id: 3,
      nameFr: "Centre de Recherche",
      nameEn: "Research Center",
      image: "/placeholder.svg",
      type: "Partenaire",
    },
  ];

  const getTypeBadge = (type: string) => {
    const badgeClasses = {
      "Académique": "bg-blue-600 text-white",
      "Sponsor": "bg-green-600 text-white",
      "Partenaire": "bg-purple-600 text-white",
    };
    return <Badge className={badgeClasses[type] || "bg-orange-600 text-white"}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">Gestion des Partenaires</h1>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Partenaire
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">24</p>
            <p className="text-sm text-gray-600">Total Partenaires</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-600">Sponsors</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">16</p>
            <p className="text-sm text-gray-600">Partenaires Académiques</p>
          </div>
        </Card>
      </div>

      {/* Recherche */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Rechercher un partenaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Grille des partenaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-700">{partner.nameFr}</h3>
                <p className="text-sm text-gray-600 italic">{partner.nameEn}</p>
              </div>
              <div className="flex justify-center">
                {getTypeBadge(partner.type)}
              </div>
              <div className="flex justify-center space-x-2">
                <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-100">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 hover:bg-red-100 hover:text-red-700">
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