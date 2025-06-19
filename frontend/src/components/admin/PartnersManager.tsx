import { useState, useEffect } from "react";
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
  Cpu,
  Microscope,
  ChevronLeft,
  ChevronRight,
  Image,
} from "lucide-react";
import PartnerForm from "./PartnerForm";

export default function PartnersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPartner, setEditingPartner] = useState(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [imageErrors, setImageErrors] = useState({});

  // Fetch partners from API
  useEffect(() => {
    fetch("http://localhost:8000/api/Partners/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched partners:", data);
        // Map API data to match expected structure
        const formattedPartners = data.map((partner) => ({
          id: partner.id,
          nameFr: partner.name_fr,
          nameEn: partner.name_en, // Include nameEn
          image: partner.image,
          type: partner.type || "Institutionnels",
        }));
        setPartners(formattedPartners);
      })
      .catch((error) => console.error("Error fetching partners:", error));
  }, []);

  const handleSavePartner = (formData) => {
    if (editingPartner) {
      const updatedPartner = {
        ...editingPartner,
        id: formData.id,
        nameFr: formData.name_fr,
        nameEn: formData.name_en,
        image: formData.image,
        type: formData.type,
      };
      setPartners((prev) => prev.map((p) => (p.id === editingPartner.id ? updatedPartner : p)));
    } else {
      const newPartner = {
        id: formData.id,
        nameFr: formData.name_fr,
        nameEn: formData.name_en,
        image: formData.image || '/placeholder.svg',
        type: formData.type,
      };
      setPartners((prev) => [...prev, newPartner]);
    }
    setShowPartnerForm(false);
    setEditingPartner(null);
  };

  const handleDeletePartner = async (partnerId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/Partners/destroy/${partnerId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete partner");
      }

      setPartners((prev) => prev.filter((partner) => partner.id !== partnerId));
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setShowPartnerForm(true);
  };

  const handleCloseForm = () => {
    setShowPartnerForm(false);
    setEditingPartner(null);
  };

  const handleImageError = (partnerId) => {
    setImageErrors(prev => ({ ...prev, [partnerId]: true }));
  };

  const getImageUrl = (partner) => {
    if (imageErrors[partner.id] || !partner.image) {
      return null;
    }
    return `http://localhost:8000/storage/${partner.image}`;
  };

  const getTypeBadge = (type) => {
    const badgeConfig = {
      Institutionnels: {
        className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
        icon: <Building2 className="w-3 h-3 mr-1" />,
      },
      "Industriels & Technologiques": {
        className: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md",
        icon: <Cpu className="w-3 h-3 mr-1" />,
      },
      "Centres de Recherche & Innovation": {
        className: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md",
        icon: <Microscope className="w-3 h-3 mr-1" />,
      },
    };
    const config = badgeConfig[type] || {
      className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
      icon: <Building2 className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge className={`${config.className} px-3 py-1 flex items-center justify-center font-medium`}>
        {config.icon}
        {type}
      </Badge>
    );
  };

  const filteredPartners = partners.filter((partner) =>
    partner.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPartners = filteredPartners.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats = {
    institutionnels: partners.filter((p) => p.type === "Institutionnels").length,
    industriels: partners.filter((p) => p.type === "Industriels & Technologiques").length,
    recherche: partners.filter((p) => p.type === "Centres de Recherche & Innovation").length,
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.institutionnels}
                </p>
                <p className="text-gray-600 font-medium">Institutionnels</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {stats.industriels}
                </p>
                <p className="text-gray-600 font-medium">Industriels & Technologiques</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                <Cpu className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {stats.recherche}
                </p>
                <p className="text-gray-600 font-medium">Centres de Recherche</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                <Microscope className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-2 border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {filteredPartners.length} résultat{filteredPartners.length > 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPartners.map((partner) => (
            <Card
              key={partner.id}
              className="group p-0 bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300">
                  {getImageUrl(partner) ? (
                    <img
                      src={getImageUrl(partner)}
                      alt={partner.nameFr}
                      className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(partner.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <Image className="w-12 h-12 mb-2" />
                        <span className="text-sm">Image non disponible</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3 text-center">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                      {partner.nameFr}
                    </h3>
                    <div className="flex justify-center">
                      {getTypeBadge(partner.type)}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
                      onClick={() => handleDeletePartner(partner.id)}
                      className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <Card className="p-6 bg-white border-2 border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredPartners.length)} sur {filteredPartners.length} partenaires
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={`border-2 ${currentPage === page ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"} min-w-[40px]`}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

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
            onSubmit={handleSavePartner}
            partnerToEdit={editingPartner}
          />
        )}
      </div>
    </div>
  );
}