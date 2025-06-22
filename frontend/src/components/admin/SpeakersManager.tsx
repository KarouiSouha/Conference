import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Mail, Users, Award, Globe, BookOpen, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Import du composant SpeakerForm
import SpeakerForm from "./SpeakerForm";
// Import du composant DeleteConfirmationModal
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function SpeakersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [themes, setThemes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le modal de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const speakersPerPage = 5;

  // Charger les données depuis l'API
  useEffect(() => {
    fetchSpeakers();
    fetchThemes();
  }, []);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/Speakers/all');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des intervenants');
      }

      const data = await response.json();
      setSpeakers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/Theme/all');

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des thèmes");
      }

      const data = await response.json();

      const themesMap = {};
      data.data.forEach(theme => {
        themesMap[theme.id] = theme.titleFr; // Utilise "title" car c'est ce que l'API renvoie
      });

      setThemes(themesMap);
    } catch (err) {
      console.error("Erreur de récupération des thèmes :", err);
    }
  };

  // Fonctions pour gérer le formulaire
  const handleNewSpeaker = () => {
    setSelectedSpeaker(null);
    setShowForm(true);
  };

  const handleEditSpeaker = (speaker) => {
    setSelectedSpeaker(speaker);
    setShowForm(true);
  };

  // Fonction pour ouvrir le modal de suppression
  const handleDeleteSpeaker = (speaker) => {
    setSpeakerToDelete(speaker);
    setShowDeleteModal(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteSpeaker = async () => {
    if (!speakerToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/Speakers/destroy/${speakerToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSpeakers(prevSpeakers =>
          prevSpeakers.filter(speaker => speaker.id !== speakerToDelete.id)
        );
        // Fermer le modal et reset l'état
        setShowDeleteModal(false);
        setSpeakerToDelete(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
      // En cas d'erreur, on ferme quand même le modal
      setShowDeleteModal(false);
      setSpeakerToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const cancelDeleteSpeaker = () => {
    setShowDeleteModal(false);
    setSpeakerToDelete(null);
  };

  const getThemeName = (themeId) => {
    console.log("getThemeName called with themeId:", themeId,themes[themeId]);
    return themes[themeId] || "Thème inconnu";
  };

  const getThemeBadge = (themeName, isKeynote = false) => {
    const themeColors = {
      "Ingénierie et Innovation": "bg-blue-50 text-blue-700 border-blue-200",
      "Processus, Environnement et Développement Durable": "bg-green-50 text-green-700 border-green-200",
      "Pédagogie, Enseignement et Processus Socio-Humains": "bg-amber-50 text-amber-700 border-amber-200",
      "Économie, Gestion et Entrepreneuriat": "bg-indigo-50 text-indigo-700 border-indigo-200",
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

  const getCountryFlagUrl = (country) => {
    const codes = {
      "France": "fr",
      "Égypte": "eg",
      "Espagne": "es",
      "États-Unis": "us",
      "Japon": "jp",
      "Allemagne": "de",
      "Italie": "it",
      "Royaume-Uni": "gb",
      "Canada": "ca",
      "Australie": "au"
    };

    for (const name in codes) {
      if (country.toLowerCase().includes(name.toLowerCase())) {
        return `https://flagcdn.com/w40/${codes[name]}.png`; // 40px wide
      }
    }

    return `https://flagcdn.com/w40/un.png`; // 🌍 par défaut
  };

  // Filtrage des speakers
  const filteredSpeakers = speakers.filter(speaker =>
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.job_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.country_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getThemeName(speaker.theme_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSpeakers.length / speakersPerPage);
  const startIndex = (currentPage - 1) * speakersPerPage;
  const endIndex = startIndex + speakersPerPage;
  const currentSpeakers = filteredSpeakers.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats = {
    total: speakers.length,
    keynote: speakers.filter(s => s.is_keynote).length,
    countries: new Set(speakers.map(s => s.country_fr)).size,
    themes: new Set(speakers.map(s => s.theme_id)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des intervenants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            ❌
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchSpeakers} className="bg-blue-600 hover:bg-blue-700">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* En-tête élégant */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion des Intervenants
              </h1>
              <p className="text-gray-600 text-lg">Organisez et gérez vos conférenciers experts</p>
            </div>
            <Button
              onClick={handleNewSpeaker}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
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
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-gray-700 border-gray-300">
                  {filteredSpeakers.length} résultat{filteredSpeakers.length > 1 ? 's' : ''}
                </Badge>
                <div className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
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
                {currentSpeakers.map((speaker, index) => (
                  <tr
                    key={speaker.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      } ${speaker.is_keynote ? 'border-l-4 border-l-amber-400' : ''}`}
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
                            {speaker.is_keynote && (
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
                        <div className="text-sm font-medium text-gray-900">{speaker.job_fr}</div>
                        <div className="text-xs text-gray-600 italic">{speaker.job_en}</div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-2">
                        <img
                          src={getCountryFlagUrl(speaker.country_fr)}
                          alt="flag"
                          className="w-6 h-4 object-cover inline-block rounded"
                        />

                        <div>
                          <div className="text-sm font-medium text-gray-900">{speaker.country_fr}</div>
                          <div className="text-xs text-gray-600 italic">{speaker.country_en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      {getThemeBadge(getThemeName(speaker.theme_id), speaker.is_keynote)}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center space-x-2">
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
                          onClick={() => handleDeleteSpeaker(speaker)}
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

          {/* Pagination */}
          {filteredSpeakers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredSpeakers.length)} sur {filteredSpeakers.length} résultats
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="h-9 w-9 p-0"
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

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
        onSave={() => {
          fetchSpeakers();
          setShowForm(false);
          setSelectedSpeaker(null);
        }}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteSpeaker}
        onConfirm={confirmDeleteSpeaker}
        Name={speakerToDelete?.name || ''}
      />
    </div>
  );
}