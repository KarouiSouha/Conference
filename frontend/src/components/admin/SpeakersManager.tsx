import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Mail, Users, Award, Globe, BookOpen, Filter, Download, MessageSquare } from "lucide-react";

// Import du composant SpeakerForm
import SpeakerForm from "./SpeakerForm";

export default function SpeakersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  // Données d'exemple étoffées
  const [speakers, setSpeakers] = useState([
    {
      id: 1,
      name: "Dr. Sophie Martin",
      email: "sophie.martin@research.fr",
      jobFr: "Professeure en Intelligence Artificielle",
      jobEn: "Professor in Artificial Intelligence",
      countryFr: "France",
      countryEn: "France",
      themeId: 1,
      themeName: "IA et Technologies",
      isKeynote: true,
      avatar: null,
    },
    {
      id: 2,
      name: "Prof. Ahmed Hassan",
      email: "a.hassan@university.eg",
      jobFr: "Directeur de Recherche",
      jobEn: "Research Director",
      countryFr: "Égypte",
      countryEn: "Egypt",
      themeId: 2,
      themeName: "Sciences Médicales",
      isKeynote: false,
      avatar: null,
    },
    {
      id: 3,
      name: "Dr. Maria Rodriguez",
      email: "m.rodriguez@tech.es",
      jobFr: "Chercheuse Senior",
      jobEn: "Senior Researcher",
      countryFr: "Espagne",
      countryEn: "Spain",
      themeId: 1,
      themeName: "IA et Technologies",
      isKeynote: true,
      avatar: null,
    },
    {
      id: 4,
      name: "Prof. John Williams",
      email: "j.williams@mit.edu",
      jobFr: "Professeur de Robotique",
      jobEn: "Professor of Robotics",
      countryFr: "États-Unis",
      countryEn: "United States",
      themeId: 1,
      themeName: "IA et Technologies",
      isKeynote: false,
      avatar: null,
    },
    {
      id: 5,
      name: "Dr. Yuki Tanaka",
      email: "y.tanaka@tokyo.ac.jp",
      jobFr: "Spécialiste en Nanotechnologie",
      jobEn: "Nanotechnology Specialist",
      countryFr: "Japon",
      countryEn: "Japan",
      themeId: 3,
      themeName: "Nanotechnologies",
      isKeynote: false,
      avatar: null,
    },
  ]);

  // Fonctions pour gérer le formulaire
  const handleNewSpeaker = () => {
    setSelectedSpeaker(null);
    setShowForm(true);
  };

  const handleEditSpeaker = (speaker) => {
    setSelectedSpeaker(speaker);
    setShowForm(true);
  };

  const handleDeleteSpeaker = (speakerId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet intervenant ?")) {
      setSpeakers(prevSpeakers => 
        prevSpeakers.filter(speaker => speaker.id !== speakerId)
      );
    }
  };

  const handleSaveSpeaker = (speakerData) => {
    if (selectedSpeaker) {
      // Modification d'un intervenant existant
      setSpeakers(prevSpeakers =>
        prevSpeakers.map(speaker =>
          speaker.id === selectedSpeaker.id
            ? {
                ...speaker,
                name: speakerData.name,
                email: speakerData.email,
                jobFr: speakerData.job_fr,
                jobEn: speakerData.job_en,
                countryFr: speakerData.country_fr,
                countryEn: speakerData.country_en,
                themeId: parseInt(speakerData.theme_id) || null,
                themeName: getThemeName(speakerData.theme_id)
              }
            : speaker
        )
      );
    } else {
      // Création d'un nouvel intervenant
      const newSpeaker = {
        id: Date.now(), // ID temporaire
        name: speakerData.name,
        email: speakerData.email,
        jobFr: speakerData.job_fr,
        jobEn: speakerData.job_en,
        countryFr: speakerData.country_fr,
        countryEn: speakerData.country_en,
        themeId: parseInt(speakerData.theme_id) || null,
        themeName: getThemeName(speakerData.theme_id),
        isKeynote: false,
        avatar: null
      };
      setSpeakers(prevSpeakers => [...prevSpeakers, newSpeaker]);
    }
    setShowForm(false);
    setSelectedSpeaker(null);
  };

  const getThemeName = (themeId) => {
    const themes = {
      1: "IA et Technologies",
      2: "Sciences Médicales",
      3: "Nanotechnologies",
      4: "Environnement",
      5: "Énergie",
      6: "Économie"
    };
    return themes[themeId] || "";
  };

  const getThemeBadge = (themeName, isKeynote = false) => {
    const themeColors = {
      "IA et Technologies": "bg-blue-50 text-blue-700 border-blue-200",
      "Sciences Médicales": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Nanotechnologies": "bg-purple-50 text-purple-700 border-purple-200",
      "Environnement": "bg-green-50 text-green-700 border-green-200",
      "Énergie": "bg-amber-50 text-amber-700 border-amber-200",
      "Économie": "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    
    const colorClass = themeColors[themeName] || "bg-gray-50 text-gray-700 border-gray-200";
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${colorClass} font-medium hover:${colorClass.replace('50', '100')}`}>
          {themeName}
        </Badge>
        {isKeynote && (
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200 font-medium">
            <Award className="w-3 h-3 mr-1" />
            Keynote
          </Badge>
        )}
      </div>
    );
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const getCountryFlag = (country) => {
    const flags = {
      "France": "🇫🇷",
      "Égypte": "🇪🇬",
      "Espagne": "🇪🇸",
      "États-Unis": "🇺🇸",
      "Japon": "🇯🇵"
    };
    return flags[country] || "🌍";
  };

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.jobFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.countryFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.themeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: speakers.length,
    keynote: speakers.filter(s => s.isKeynote).length,
    countries: new Set(speakers.map(s => s.countryFr)).size,
    themes: new Set(speakers.map(s => s.themeName)).size
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* En-tête élégant */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Gestion des Intervenants
            </h1>
            <p className="text-lg text-gray-600">
              Organisez et gérez vos conférenciers experts
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter la Liste
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
              <Mail className="w-4 h-4 mr-2" />
              Email Groupé
            </Button>
            <Button 
              onClick={handleNewSpeaker}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Intervenant
            </Button>
          </div>
        </div>

        {/* Statistiques visuellement améliorées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600 font-medium">Total Intervenants</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.keynote}</p>
                <p className="text-sm text-gray-600 font-medium">Keynote Speakers</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.countries}</p>
                <p className="text-sm text-gray-600 font-medium">Pays Représentés</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.themes}</p>
                <p className="text-sm text-gray-600 font-medium">Thèmes Couverts</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recherche et filtres sophistiqués */}
        <Card className="p-6 border-gray-200 shadow-sm bg-gradient-to-r from-white to-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher par nom, email, fonction, pays ou thème..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
              />
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-6">
              <Filter className="w-4 h-4 mr-2" />
              Filtres Avancés
            </Button>
          </div>
        </Card>

        {/* Table moderne et élégante */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Liste des Intervenants ({filteredSpeakers.length})
              </h3>
              <Badge variant="outline" className="text-gray-700 border-gray-300">
                {filteredSpeakers.length} résultat{filteredSpeakers.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Intervenant
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fonction
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Origine
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thème & Statut
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredSpeakers.map((speaker, index) => (
                  <tr 
                    key={speaker.id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${speaker.isKeynote ? 'border-l-4 border-l-amber-400' : ''}`}
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-white shadow-lg">
                            <span className="text-white font-semibold text-sm">
                              {getInitials(speaker.name)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            {speaker.name}
                            {speaker.isKeynote && (
                              <Award className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">Dr. / Prof.</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="text-sm text-gray-900">{speaker.email}</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:bg-blue-50 transition-colors"
                          onClick={() => window.location.href = `mailto:${speaker.email}`}
                          title="Envoyer un email"
                        >
                          <Mail className="w-4 h-4 text-blue-600" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">{speaker.jobFr}</div>
                        <div className="text-xs text-gray-600 italic">{speaker.jobEn}</div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCountryFlag(speaker.countryFr)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{speaker.countryFr}</div>
                          <div className="text-xs text-gray-600 italic">{speaker.countryEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {getThemeBadge(speaker.themeName, speaker.isKeynote)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-9 w-9 p-0 border-gray-300 hover:bg-blue-50 hover:border-blue-300 text-gray-600 hover:text-blue-600 transition-colors"
                          title="Envoyer un message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditSpeaker(speaker)}
                          className="h-9 w-9 p-0 border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteSpeaker(speaker.id)}
                          className="h-9 w-9 p-0 border-red-300 hover:bg-red-50 hover:border-red-400 text-red-600 hover:text-red-700 transition-colors"
                          title="Supprimer"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSpeakers.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun intervenant trouvé</h3>
              <p className="text-gray-500 mb-6">
                Essayez de modifier vos critères de recherche ou ajoutez un nouvel intervenant
              </p>
              <Button 
                onClick={handleNewSpeaker}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Intervenant
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Composant SpeakerForm */}
      <SpeakerForm
        isOpen={showForm}
        speaker={selectedSpeaker}
        onClose={() => {
          setShowForm(false);
          setSelectedSpeaker(null);
        }}
        onSave={handleSaveSpeaker}
      />
    </div>
  );
}