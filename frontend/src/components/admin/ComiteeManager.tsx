import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash, Users, Award, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ComiteForm from "./ComiteForm";

interface Member {
  id: number;
  name_fr: string;
  name_en: string;
  institute_fr?: string;
  institute_en?: string;
  job_fr?: string;
  job_en?: string;
  special_role: 'chair' | 'co-chair' | 'member';
  committee_type?: 'scientific' | 'organizing' | 'honorary';
  order: number;
  image_path?: string;
}

interface ComiteManagerProps {
  language: 'fr' | 'en';
}

// Modal de confirmation de suppression
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, partnerName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 bg-white border-2 border-gray-100 shadow-xl rounded-2xl transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-3 bg-red-50 rounded-full">
            <Trash className="w-8 h-8 text-red-600" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-800">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{partnerName}</span> ?
              Cette action est irréversible.
            </p>
          </div>

          <div className="flex justify-center space-x-4 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 transition-all duration-200"
            >
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ComiteManager({ language = 'fr' }: ComiteManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("scientific");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  // États pour le modal de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const [scientificCommittee, setScientificCommittee] = useState<Member[]>([]);
  const [organizingCommittee, setOrganizingCommittee] = useState<Member[]>([]);
  const [honoraryCommittee, setHonoraryCommittee] = useState<Member[]>([]);

  const fetchComites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/api/Comite/all?lang=${language}`);
      const data = await response.json();

      if (data.success) {
        const { scientific, organizing, honorary } = data.data;

        const normalizeMember = (member: any): Member | null => {
          if (!member || (!member.name_fr && !member.name_en)) {
            console.warn('Membre invalide ignoré:', member);
            return null;
          }
          return {
            id: member.id || 0,
            name_fr: member.name_fr || '',
            name_en: member.name_en || '',
            institute_fr: member.institute_fr || '',
            institute_en: member.institute_en || '',
            job_fr: member.job_fr || 'Membre',
            job_en: member.job_en || 'Member',
            special_role: member.special_role || 'member',
            committee_type: member.committee_type || 'scientific',
            order: member.order || 0,
            image_path: member.image_path || ''
          };
        };

        const scientificMembers: Member[] = [];
        if (scientific.chair) {
          const chair = normalizeMember(scientific.chair);
          if (chair) scientificMembers.push(chair);
        }
        if (scientific.co_chair) {
          const coChair = normalizeMember(scientific.co_chair);
          if (coChair) scientificMembers.push(coChair);
        }
        scientificMembers.push(
          ...(scientific.members || []).map(normalizeMember).filter((member): member is Member => member !== null)
        );

        const organizingMembers: Member[] = [];
        if (organizing.chair) {
          const chair = normalizeMember(organizing.chair);
          if (chair) organizingMembers.push(chair);
        }
        organizingMembers.push(
          ...(organizing.members || []).map(normalizeMember).filter((member): member is Member => member !== null)
        );

        const honoraryMembers: Member[] = (honorary.members || [])
          .map(normalizeMember)
          .filter((member): member is Member => member !== null);

        setScientificCommittee(scientificMembers);
        setOrganizingCommittee(organizingMembers);
        setHonoraryCommittee(honoraryMembers);
      } else {
        throw new Error(data.message || 'Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des comités:', error);
      setError((error as Error).message || 'Une erreur est survenue lors du chargement des comités.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComites();
  }, [language]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleOpenForm = (member: Member | null = null) => {
    setCurrentMember(member ? { ...member } : null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentMember(null);
  };

  const handleSaveMember = async (memberData: Partial<Member>, imageFile: File | null) => {
    try {
      const formData = new FormData();
      
      Object.entries(memberData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (memberData.id) {
        formData.append('_method', 'PUT');
        response = await fetch(`http://localhost:8000/api/Comite/${memberData.id}`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-HTTP-Method-Override': 'PUT'
          }
        });
      } else {
        response = await fetch('http://localhost:8000/api/Comite', {
          method: 'POST',
          body: formData
        });
      }

      const result = await response.json();
      if (result.success) {
        await fetchComites();
        handleCloseForm();
      } else {
        throw new Error(result.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      throw error;
    }
  };

  // Fonctions pour la suppression avec modal
  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/Comite/${memberToDelete.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchComites();
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
        
        // Ajuster la page courante si nécessaire
        const currentMembers = getCurrentMembers();
        const newTotalPages = Math.ceil((currentMembers.length - 1) / membersPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert('Erreur lors de la suppression du membre');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setMemberToDelete(null);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      chair: {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        text: "Président",
        icon: "👑"
      },
      "co-chair": {
        bg: "bg-gradient-to-r from-purple-500 to-purple-600",
        text: "Vice-Président",
        icon: "⭐"
      },
      member: {
        bg: "bg-gradient-to-r from-gray-400 to-gray-500",
        text: "Membre",
        icon: "👤"
      }
    };
    
    const badge = badges[role] || badges.member;
    
    return (
      <span className={`${badge.bg} text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1`}>
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const filterMembers = (members: Member[]) => {
    if (!members || !Array.isArray(members)) return [];
    return members.filter(member => {
      if (!member) return false;
      const name = language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en;
      const institute = language === 'en' ? member.institute_en || member.institute_fr : member.institute_fr || member.institute_en;
      const job = language === 'en' ? member.job_en || member.job_fr : member.job_fr || member.job_en;
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (institute || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'scientific': return <Globe className="w-4 h-4" />;
      case 'organizing': return <Users className="w-4 h-4" />;
      case 'honorary': return <Award className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTabStats = (tab: string) => {
    switch (tab) {
      case 'scientific': return scientificCommittee.length;
      case 'organizing': return organizingCommittee.length;
      case 'honorary': return honoraryCommittee.length;
      default: return 0;
    }
  };

  // Fonctions de pagination
  const getCurrentMembers = () => {
    const filteredScientificCommittee = filterMembers(scientificCommittee);
    const filteredOrganizingCommittee = filterMembers(organizingCommittee);
    const filteredHonoraryCommittee = filterMembers(honoraryCommittee);

    switch (activeTab) {
      case 'scientific': return filteredScientificCommittee;
      case 'organizing': return filteredOrganizingCommittee;
      case 'honorary': return filteredHonoraryCommittee;
      default: return [];
    }
  };

  const currentMembers = getCurrentMembers();
  const totalPages = Math.ceil(currentMembers.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const paginatedMembers = currentMembers.slice(indexOfFirstMember, indexOfLastMember);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4 border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            onClick={() => fetchComites()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="text-gray-700 mt-4 font-medium">Chargement des comités...</p>
        </div>
      </div>
    );
  }

  const totalMembers = scientificCommittee.length + organizingCommittee.length + honoraryCommittee.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gestion des Comités
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                Organisez et gérez vos comités scientifiques, d'organisation et d'honneur
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full w-fit">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">{totalMembers} membres au total</span>
              </div>
            </div>
            <button
              className="mt-6 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 font-medium"
              onClick={() => handleOpenForm()}
            >
              <Plus className="w-5 h-5" />
              Nouveau membre
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, institution ou fonction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all font-medium ${
                activeTab === 'scientific'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('scientific')}
            >
              {getTabIcon('scientific')}
              Comité Scientifique
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === 'scientific' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getTabStats('scientific')}
              </span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all font-medium ${
                activeTab === 'organizing'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('organizing')}
            >
              {getTabIcon('organizing')}
              Comité d'Organisation
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === 'organizing' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getTabStats('organizing')}
              </span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all font-medium ${
                activeTab === 'honorary'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('honorary')}
            >
              {getTabIcon('honorary')}
              Comité d'Honneur
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === 'honorary' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getTabStats('honorary')}
              </span>
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Institution</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fonction</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rôle</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedMembers.map((member, index) => (
                  <tr key={member.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.image_path ? (
                          <img
                            src={`http://localhost:8000/storage/${member.image_path}`}
                            alt={language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en}
                            className="w-12 h-12 rounded-full object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {(language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en).charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {language === 'en' ? member.institute_en || member.institute_fr : member.institute_fr || member.institute_en}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {language === 'en' ? member.job_en || member.job_fr : member.job_fr || member.job_en}
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(member.special_role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
                          onClick={() => handleOpenForm(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-md"
                          onClick={() => handleDeleteClick(member)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* État vide */}
          {paginatedMembers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun membre trouvé</h3>
              <p className="text-gray-600 mb-6">Ajoutez des membres ou modifiez vos critères de recherche</p>
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                onClick={() => handleOpenForm()}
              >
                Ajouter le premier membre
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg mt-6">
            <div className="text-sm text-gray-600">
              Affichage de {indexOfFirstMember + 1} à {Math.min(indexOfLastMember, currentMembers.length)} sur {currentMembers.length} membres
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(index + 1)}
                  className={currentPage === index + 1 ? "bg-blue-600 text-white" : ""}
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          partnerName={memberToDelete ? (language === 'en' ? memberToDelete.name_en || memberToDelete.name_fr : memberToDelete.name_fr || memberToDelete.name_en) : ''}
        />

        <ComiteForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          member={currentMember}
          onSave={handleSaveMember}
        />
      </div>
    </div>
  );
}