import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash, Crown, Star, Users, Globe, UserCheck, Building2 } from "lucide-react";
import ComiteForm from "./ComiteForm"; // Assurez-vous que le chemin est correct

export default function ComiteeManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("scientific");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  // Données d'exemple étendues
  const scientificCommittee = [
    {
      id: 1,
      name_fr: "Prof. Jean Dubois",
      name_en: "Prof. Jean Dubois",
      institute_fr: "Université Sorbonne",
      institute_en: "Sorbonne University",
      job_fr: "Président",
      job_en: "Chairman",
      special_role: "chair",
      committee_type: "scientific",
      order: 1,
      country: "France",
      email: "jean.dubois@sorbonne.fr"
    },
    {
      id: 2,
      name_fr: "Dr. Marie Curie",
      name_en: "Dr. Marie Curie",
      institute_fr: "Institut Curie",
      institute_en: "Curie Institute",
      job_fr: "Vice-Présidente",
      job_en: "Vice-Chairman",
      special_role: "co-chair",
      committee_type: "scientific",
      order: 2,
      country: "France",
      email: "marie.curie@curie.fr"
    },
    {
      id: 3,
      name_fr: "Prof. Ahmed Zayani",
      name_en: "Prof. Ahmed Zayani",
      institute_fr: "Université de Tunis",
      institute_en: "University of Tunis",
      job_fr: "Membre",
      job_en: "Member",
      special_role: "member",
      committee_type: "scientific",
      order: 3,
      country: "Tunisie",
      email: "ahmed.zayani@utunis.tn"
    },
    {
      id: 4,
      name_fr: "Dr. Emily Chen",
      name_en: "Dr. Emily Chen",
      institute_fr: "Université de Cambridge",
      institute_en: "Cambridge University",
      job_fr: "Membre",
      job_en: "Member",
      special_role: "member",
      committee_type: "scientific",
      order: 4,
      country: "Royaume-Uni",
      email: "emily.chen@cam.ac.uk"
    }
  ];

  const organizingCommittee = [
    {
      id: 5,
      name_fr: "Dr. Sarah Johnson",
      name_en: "Dr. Sarah Johnson",
      institute_fr: "MIT",
      institute_en: "MIT",
      job_fr: "Coordinatrice Générale",
      job_en: "General Coordinator",
      special_role: "chair",
      committee_type: "organizing",
      order: 1,
      country: "États-Unis",
      email: "sarah.johnson@mit.edu"
    },
    {
      id: 6,
      name_fr: "M. Pierre Martin",
      name_en: "Mr. Pierre Martin",
      institute_fr: "Université Paris-Saclay",
      institute_en: "Paris-Saclay University",
      job_fr: "Responsable Logistique",
      job_en: "Logistics Manager",
      special_role: "member",
      committee_type: "organizing",
      order: 2,
      country: "France",
      email: "pierre.martin@u-psud.fr"
    },
    {
      id: 7,
      name_fr: "Dr. Lisa Wang",
      name_en: "Dr. Lisa Wang",
      institute_fr: "Université de Tokyo",
      institute_en: "University of Tokyo",
      job_fr: "Responsable Communication",
      job_en: "Communication Manager",
      special_role: "member",
      committee_type: "organizing",
      order: 3,
      country: "Japon",
      email: "lisa.wang@u-tokyo.ac.jp"
    }
  ];

  const handleOpenForm = (member = null) => {
    setCurrentMember(member);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentMember(null);
  };

  const handleSaveMember = (memberData) => {
    console.log("Membre sauvegardé:", memberData);
    // Ici vous devriez ajouter la logique pour sauvegarder dans votre état ou API
    handleCloseForm();
  };

  const getRoleBadge = (role) => {
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-teal-500 to-teal-600'
    ];
    return colors[id % colors.length];
  };

  const filteredScientificCommittee = scientificCommittee.filter(member =>
    member.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.institute_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.institute_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrganizingCommittee = organizingCommittee.filter(member =>
    member.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.institute_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.institute_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CommitteeTable = ({ members, title, type }) => (
    <Card className="bg-white border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <Badge variant="outline" className="text-sm px-3 py-1 border-2">
            {members.length} membre{members.length > 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="space-y-4">
          {members.map((member, index) => (
            <Card key={member.id} className="p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar amélioré */}
                  <div className={`w-16 h-16 ${getAvatarColor(member.id)} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">
                      {getInitials(member.name_fr)}
                    </span>
                  </div>
                  
                  {/* Informations du membre */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                        {member.name_fr}
                      </h4>
                      {getRoleBadge(member.special_role)}
                    </div>
                    
                    <p className="text-sm text-gray-500 italic mb-1">{member.name_en}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-700 font-medium">{member.institute_fr}</p>
                        <p className="text-gray-500 italic text-xs">{member.institute_en}</p>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">{member.job_fr}</p>
                        <p className="text-gray-500 italic text-xs">{member.job_en}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>{member.country}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Boutons d'action */}
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
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {members.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-500">Ajoutez des membres ou modifiez vos critères de recherche</p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* En-tête avec dégradé */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion des Comités
              </h1>
              <p className="text-gray-600 text-lg">Organisez et gérez vos comités scientifiques et d'organisation</p>
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

        {/* Statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
                  {scientificCommittee.length + organizingCommittee.length}
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
          
          <Card className="p-6 bg-white border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">8</p>
                <p className="text-gray-600 font-medium">Pays Représentés</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche améliorée */}
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
                  {(activeTab === 'scientific' ? filteredScientificCommittee : filteredOrganizingCommittee).length} résultat{(activeTab === 'scientific' ? filteredScientificCommittee : filteredOrganizingCommittee).length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Onglets améliorés */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card className="p-2 bg-white border-2 border-gray-100">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-lg p-1">
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
        </Tabs>

        {/* Formulaire de membre */}
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