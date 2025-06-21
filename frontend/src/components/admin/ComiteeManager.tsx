import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash, Crown, Star, Users, UserCheck, Building2, Award } from "lucide-react";
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

export default function ComiteManager({ language = 'fr' }: ComiteManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("scientific");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    
    // Ajouter toutes les données du membre
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
      // Pour les requêtes PUT avec FormData, il faut souvent simuler avec POST + _method
      formData.append('_method', 'PUT');
      
      response = await fetch(`http://localhost:8000/api/Comite/${memberData.id}`, {
        method: 'POST', // Changé de PUT à POST
        body: formData,
        headers: {
          // Ne pas définir Content-Type, laissez le navigateur le faire automatiquement pour FormData
          'X-HTTP-Method-Override': 'PUT' // Header alternatif pour indiquer que c'est un PUT
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

  const handleDeleteMember = async (memberId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/Comite/${memberId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchComites();
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert('Erreur lors de la suppression du membre');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "chair":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md px-3 py-1 flex items-center font-medium">
            <Crown className="w-3 h-3 mr-1" />
            Président
          </Badge>
        );
      case "co-chair":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md px-3 py-1 flex items-center font-medium">
            <Star className="w-3 h-3 mr-1" />
            Vice-Président
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm px-3 py-1 flex items-center font-medium">
            <UserCheck className="w-3 h-3 mr-1" />
            Membre
          </Badge>
        );
    }
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

  const renderMember = (member: Member, index: number, isChair: boolean = false) => (
    <div
      key={member.id || index}
      className={`${isChair ? 'border-l-4 border-primary pl-4 bg-primary/5 p-4 rounded-r-lg' : 'border-l-3 border-primary/30 pl-4 py-2 hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 rounded-r-md'}`}
    >
      <div className="flex flex-col">
        {member.image_path && (
          <img
            src={`http://localhost:8000/storage/${member.image_path}`}
            alt={language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en}
            className="w-16 h-16 rounded-full mb-2 object-cover"
          />
        )}
        <span className={`font-semibold text-foreground ${isChair ? 'text-lg' : 'text-sm'} leading-tight`}>
          {language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en}
        </span>
        {(language === 'en' ? member.institute_en : member.institute_fr) && (
          <span className={`text-muted-foreground italic mt-1 opacity-80 ${isChair ? 'text-sm' : 'text-xs'}`}>
            {language === 'en' ? member.institute_en || member.institute_fr : member.institute_fr || member.institute_en}
          </span>
        )}
        {isChair && (language === 'en' ? member.job_en : member.job_fr) && (
          <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full inline-block mt-1 w-fit">
            {language === 'en' ? member.job_en || member.job_fr : member.job_fr || member.job_en}
          </span>
        )}
      </div>
    </div>
  );

  const CommitteeTable = ({ members, title, type }: { members: Member[], title: string, type: string }) => (
    <Card className="bg-white border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <Badge variant="outline" className="text-sm px-3 py-1 border-2">
            {members.length} membre{members.length > 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="space-y-4">
          {(members || []).map((member, index) => (
            <div key={member.id || index} className="flex items-center justify-between group">
              {renderMember(member, index, member.special_role === 'chair' || member.special_role === 'co-chair')}
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => handleOpenForm(member)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {(!members || members.length === 0) && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-500">Ajoutez des membres ou modifiez vos critères de recherche</p>
          </div>
        )}
      </div>
    </Card>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <Button
            className="mt-4 bg-blue-600 text-white"
            onClick={() => fetchComites()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des comités...</p>
        </div>
      </div>
    );
  }

  const filteredScientificCommittee = filterMembers(scientificCommittee);
  const filteredOrganizingCommittee = filterMembers(organizingCommittee);
  const filteredHonoraryCommittee = filterMembers(honoraryCommittee);

  const totalMembers = scientificCommittee.length + organizingCommittee.length + honoraryCommittee.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion des Comités
              </h1>
              <p className="text-gray-600 text-lg">Organisez et gérez vos comités scientifiques, d'organisation et d'honneur</p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
              onClick={() => handleOpenForm()}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau membre
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
                  {totalMembers}
                </p>
                <p className="text-gray-600 font-medium">Total Membres</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {scientificCommittee.length}
                </p>
                <p className="text-gray-600 font-medium">Comité Scientifique</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {organizingCommittee.length}
                </p>
                <p className="text-gray-600 font-medium">Comité d'Organisation</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-yellow-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                  {honoraryCommittee.length}
                </p>
                <p className="text-gray-600 font-medium">Comité d'Honneur</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full group-hover:bg-yellow-100 transition-colors">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-2 border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom, institution ou fonction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {(activeTab === 'scientific' ? filteredScientificCommittee :
                    activeTab === 'organizing' ? filteredOrganizingCommittee :
                    filteredHonoraryCommittee).length} résultat{(activeTab === 'scientific' ? filteredScientificCommittee :
                    activeTab === 'organizing' ? filteredOrganizingCommittee :
                    filteredHonoraryCommittee).length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="p-2 bg-white border-2 border-gray-100">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-lg p-1">
              <TabsTrigger
                value="scientific"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-lg py-3 font-medium"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Comité Scientifique
              </TabsTrigger>
              <TabsTrigger
                value="organizing"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-lg py-3 font-medium"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Comité d'Organisation
              </TabsTrigger>
              <TabsTrigger
                value="honorary"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-lg py-3 font-medium"
              >
                <Award className="w-5 h-5 mr-2" />
                Comité d'Honneur
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="scientific" className="space-y-6">
            <CommitteeTable
              members={filteredScientificCommittee}
              title="Membres du Comité Scientifique"
              type="scientific"
            />
          </TabsContent>

          <TabsContent value="organizing" className="space-y-6">
            <CommitteeTable
              members={filteredOrganizingCommittee}
              title="Membres du Comité d'Organisation"
              type="organizing"
            />
          </TabsContent>

          <TabsContent value="honorary" className="space-y-6">
            <CommitteeTable
              members={filteredHonoraryCommittee}
              title="Membres du Comité d'Honneur"
              type="honorary"
            />
          </TabsContent>
        </Tabs>

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