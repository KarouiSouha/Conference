import React, { useState, useEffect } from "react";
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
  Eye,
  Star,
  Calendar,
  Users,
} from "lucide-react";
import PartnerForm from "./PartnerForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function PartnersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPartner, setEditingPartner] = useState(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [imageErrors, setImageErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" ou "list"

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
          nameEn: partner.name_en,
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
      setShowDeleteModal(false);
      setPartnerToDelete(null);
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const handleOpenDeleteModal = (partner) => {
    setPartnerToDelete(partner);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPartnerToDelete(null);
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
        className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
        icon: <Building2 className="w-3 h-3 mr-1" />,
      },
      "Industriels & Technologiques": {
        className: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm",
        icon: <Cpu className="w-3 h-3 mr-1" />,
      },
      "Centres de Recherche & Innovation": {
        className: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm",
        icon: <Microscope className="w-3 h-3 mr-1" />,
      },
    };
    const config = badgeConfig[type] || {
      className: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm",
      icon: <Building2 className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge className={`${config.className} px-3 py-1 flex items-center justify-center font-medium text-xs rounded-full border-0`}>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {stats.institutionnels}
                </p>
                <p className="text-gray-600 font-medium">Institutionnels</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  {stats.industriels}
                </p>
                <p className="text-gray-600 font-medium">Industriels & Tech.</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                <Cpu className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {stats.recherche}
                </p>
                <p className="text-gray-600 font-medium">Centres de Recherche</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Microscope className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-0 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 shadow-inner"
            />
            {searchTerm && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full">
                  {filteredPartners.length} résultat{filteredPartners.length > 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Partners Grid - Design Amélioré */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Nos Partenaires</h2>
            <div className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              {filteredPartners.length} partenaire{filteredPartners.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPartners.map((partner) => (
              <Card
                key={partner.id}
                className="group relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden transform hover:-translate-y-2"
              >
                {/* Decorative Top Border */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>

                {/* Logo Section */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-white p-8 flex items-center justify-center">
                  {getImageUrl(partner) ? (
                    <img
                      src={getImageUrl(partner)}
                      alt={partner.nameFr}
                      className="max-w-full max-h-full object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(partner.id)}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                        <Image className="w-12 h-12" strokeWidth={1} />
                      </div>
                      <span className="text-sm text-gray-400 font-medium">Logo non disponible</span>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-sm animate-pulse"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  {/* Partner Name */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {partner.nameFr}
                    </h3>
                    {partner.nameEn && partner.nameEn !== partner.nameFr && (
                      <p className="text-sm text-gray-500 italic">{partner.nameEn}</p>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div className="flex justify-center">
                    {getTypeBadge(partner.type)}
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Partenaire</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      <span>Actif</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-3 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="sm"
                      onClick={() => handleEditPartner(partner)}
                      className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenDeleteModal(partner)}
                      className="h-9 px-4 bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
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
                    className={`border-2 ${
                      currentPage === page
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    } min-w-[40px]`}
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

        {/* Empty State */}
        {filteredPartners.length === 0 && searchTerm && (
          <Card className="p-16 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center rounded-3xl">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600">Aucun partenaire trouvé</h3>
              <p className="text-gray-500 max-w-md mx-auto">Aucun partenaire ne correspond à vos critères de recherche. Essayez de modifier vos termes de recherche.</p>
              <Button
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl border-0"
              >
                Réinitialiser la recherche
              </Button>
            </div>
          </Card>
        )}

        {/* Modals */}
        {showPartnerForm && (
          <PartnerForm
            onClose={handleCloseForm}
            onSubmit={handleSavePartner}
            partnerToEdit={editingPartner}
          />
        )}

        {showDeleteModal && partnerToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={() => handleDeletePartner(partnerToDelete.id)}
            Name={partnerToDelete.nameFr}
          />
        )}
      </div>
    </div>
  );
}