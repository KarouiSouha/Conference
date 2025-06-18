import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Building2,
  GraduationCap,
  Handshake,
  TrendingUp,
} from "lucide-react";
import PartnerForm from "./PartnerForm";

export default function PartnersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPartner, setEditingPartner] = useState(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partners, setPartners] = useState([
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
    {
      id: 4,
      nameFr: "Institut National",
      nameEn: "National Institute",
      image: "/placeholder.svg",
      type: "Académique",
    },
    {
      id: 5,
      nameFr: "TechCorp Solutions",
      nameEn: "TechCorp Solutions",
      image: "/placeholder.svg",
      type: "Sponsor",
    },
    {
      id: 6,
      nameFr: "Laboratoire Avancé",
      nameEn: "Advanced Laboratory",
      image: "/placeholder.svg",
      type: "Partenaire",
    },
  ]);

  const handleSavePartner = (formData) => {
    if (editingPartner) {
      const updatedPartner = {
        ...editingPartner,
        nameFr: formData.name_fr,
        nameEn: formData.name_en,
        image: formData.image ? URL.createObjectURL(formData.image) : editingPartner.image,
        type: formData.type,
      };
      setPartners(prev => prev.map(p => p.id === editingPartner.id ? updatedPartner : p));
    } else {
      const newPartner = {
        id: Date.now(),
        nameFr: formData.name_fr,
        nameEn: formData.name_en,
        image: formData.image ? URL.createObjectURL(formData.image) : "/placeholder.svg",
        type: formData.type,
      };
      setPartners(prev => [...prev, newPartner]);
    }
    setShowPartnerForm(false);
    setEditingPartner(null);
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setShowPartnerForm(true);
  };

  const handleCloseForm = () => {
    setShowPartnerForm(false);
    setEditingPartner(null);
  };

  const getTypeBadge = (type) => {
    const badgeConfig = {
      "Académique": {
        className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
        icon: <GraduationCap className="w-3 h-3 mr-1" />
      },
      "Sponsor": {
        className: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md",
        icon: <TrendingUp className="w-3 h-3 mr-1" />
      },
      "Partenaire": {
        className: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md",
        icon: <Handshake className="w-3 h-3 mr-1" />
      },
      "Entreprise": {
        className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
        icon: <Building2 className="w-3 h-3 mr-1" />
      },
    };
    const config = badgeConfig[type] || {
      className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
      icon: <Building2 className="w-3 h-3 mr-1" />
    };
    return (
      <Badge className={`${config.className} px-3 py-1 flex items-center justify-center font-medium`}>
        {config.icon}
        {type}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Académique":
        return <GraduationCap className="w-10 h-10 text-blue-500" />;
      case "Sponsor":
        return <TrendingUp className="w-10 h-10 text-green-500" />;
      case "Partenaire":
        return <Handshake className="w-10 h-10 text-purple-500" />;
      case "Entreprise":
        return <Building2 className="w-10 h-10 text-orange-500" />;
      default:
        return <Building2 className="w-10 h-10 text-orange-500" />;
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: partners.length,
    sponsors: partners.filter(p => p.type === "Sponsor").length,
    academiques: partners.filter(p => p.type === "Académique").length,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion des Partenaires
              </h1>
              <p className="text-gray-600 text-lg">Gérez et organisez vos partenariats stratégiques</p>
            </div>
            <Button
              onClick={() => setShowPartnerForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Partenaire
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.total}</p>
                <p className="text-gray-600 font-medium">Total Partenaires</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.sponsors}</p>
                <p className="text-gray-600 font-medium">Sponsors</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.academiques}</p>
                <p className="text-gray-600 font-medium">Partenaires Académiques</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-2 border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom, type ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {filteredPartners.length} résultat{filteredPartners.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="group p-6 bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300 shadow-inner">
                    {getTypeIcon(partner.type)}
                  </div>
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {partner.nameFr}
                  </h3>
                  <p className="text-sm text-gray-500 italic font-medium">
                    {partner.nameEn}
                  </p>
                </div>
                <div className="flex justify-center">
                  {getTypeBadge(partner.type)}
                </div>
                <div className="flex justify-center space-x-2 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPartner(partner)}
                    className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && searchTerm && (
          <Card className="p-12 bg-white border-2 border-dashed border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun partenaire trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </Card>
        )}

        {showPartnerForm && (
          <PartnerForm
            onClose={handleCloseForm}
            onSave={handleSavePartner}
            partnerToEdit={editingPartner}
          />
        )}
      </div>
    </div>
  );
}