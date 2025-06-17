import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash, Crown, Star } from "lucide-react";

export function ComiteeManager() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const scientificCommittee = [
    {
      id: 1,
      nameFr: "Prof. Jean Dubois",
      nameEn: "Prof. Jean Dubois",
      instituteFr: "Université Sorbonne",
      instituteEn: "Sorbonne University",
      jobFr: "Président",
      jobEn: "Chairman",
      specialRole: "chair",
      order: 1,
    },
    {
      id: 2,
      nameFr: "Dr. Marie Curie",
      nameEn: "Dr. Marie Curie",
      instituteFr: "Institut Curie",
      instituteEn: "Curie Institute",
      jobFr: "Vice-Présidente",
      jobEn: "Vice-Chairman",
      specialRole: "co-chair",
      order: 2,
    },
    {
      id: 3,
      nameFr: "Prof. Ahmed Zayani",
      nameEn: "Prof. Ahmed Zayani",
      instituteFr: "Université de Tunis",
      instituteEn: "University of Tunis",
      jobFr: "Membre",
      jobEn: "Member",
      specialRole: "member",
      order: 3,
    },
  ];

  const organizingCommittee = [
    {
      id: 4,
      nameFr: "Dr. Sarah Johnson",
      nameEn: "Dr. Sarah Johnson",
      instituteFr: "MIT",
      instituteEn: "MIT",
      jobFr: "Coordinatrice Générale",
      jobEn: "General Coordinator",
      specialRole: "chair",
      order: 1,
    },
    {
      id: 5,
      nameFr: "M. Pierre Martin",
      nameEn: "Mr. Pierre Martin",
      instituteFr: "Université Paris-Saclay",
      instituteEn: "Paris-Saclay University",
      jobFr: "Responsable Logistique",
      jobEn: "Logistics Manager",
      specialRole: "member",
      order: 2,
    },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case "chair":
        return (
          <Badge className="bg-blue-600 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Président
          </Badge>
        );
      case "co-chair":
        return (
          <Badge className="bg-purple-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Vice-Président
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-blue-600">Membre</Badge>;
    }
  };

  const CommitteeTable = ({ members, title }) => (
    <Card className="bg-white border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Nom</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Institut</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Fonction</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Rôle</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {member.nameFr.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.nameFr}</p>
                        <p className="text-sm text-gray-500 italic">{member.nameEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-900 text-sm">{member.instituteFr}</p>
                      <p className="text-gray-500 text-xs italic">{member.instituteEn}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-900 text-sm">{member.jobFr}</p>
                      <p className="text-gray-500 text-xs italic">{member.jobEn}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getRoleBadge(member.specialRole)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 hover:bg-red-50 hover:text-red-600">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Comités</h1>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau membre
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">Total Membres</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">12</p>
            <p className="text-sm text-gray-500">Comité Scientifique</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500">Comité d'Organisation</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-500">Pays Représentés</p>
          </div>
        </Card>
      </div>

      {/* Recherche */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-600"
          />
        </div>
      </Card>

      {/* Onglets pour les comités */}
      <Tabs defaultValue="scientific" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="scientific" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Comité Scientifique
          </TabsTrigger>
          <TabsTrigger value="organizing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Comité d'Organisation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scientific">
          <CommitteeTable members={scientificCommittee} title="Membres du Comité Scientifique" />
        </TabsContent>
        
        <TabsContent value="organizing">
          <CommitteeTable members={organizingCommittee} title="Membres du Comité d'Organisation" />
        </TabsContent>
      </Tabs>
    </div>
  );
}