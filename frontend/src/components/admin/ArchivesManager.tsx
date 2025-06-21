import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, ExternalLink, Camera, Users, FileText, Globe, Archive, Calendar, MapPin, Loader2 } from "lucide-react";
import ArchiveForm from "./ArchiveForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

type ArchiveFormData = {
  id?: number;
  event_name: string;
  subject_fr: string;
  subject_en: string;
  organizer: string;
  participants: string;
  articles: string;
  countries: string;
  photoGalleryLink: string;
  year?: string;
  duration?: string;
  location?: string;
  status?: string;
};

export default function ArchivesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentArchive, setCurrentArchive] = useState<Partial<ArchiveFormData> | null>(null);
  const [archives, setArchives] = useState<ArchiveFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [archiveToDelete, setArchiveToDelete] = useState(null);

  // Fonction pour récupérer les archives depuis l'API
  const fetchArchives = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/Archive/all');

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setArchives(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des archives');
      console.error('Erreur lors du chargement des archives:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les archives au montage du composant
  useEffect(() => {
    fetchArchives();
  }, []);

  const filteredArchives = archives.filter(archive =>
    archive.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.subject_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.subject_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm px-3 py-1">Actif</Badge>;
    }
    return <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm px-3 py-1">Archivé</Badge>;
  };

  const handleNewArchive = () => {
    setCurrentArchive(null);
    setIsFormOpen(true);
  };

  const handleEditArchive = (archive: ArchiveFormData) => {
    setCurrentArchive(archive);
    setIsFormOpen(true);
  };

  // const handleDeleteArchive = async (id: number) => {
  //   if (!confirm('Êtes-vous sûr de vouloir supprimer cette archive ?')) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:8000/api/Archive/destroy/${id}`, {
  //       method: 'DELETE',
  //     });

  //     if (!response.ok) {
  //       throw new Error('Erreur lors de la suppression');
  //     }

  //     await fetchArchives();
  //   } catch (err) {
  //     console.error('Erreur lors de la suppression:', err);
  //     alert('Erreur lors de la suppression de l\'archive');
  //   }
  // };
  const handleDeleteArchive = (archive) => {
    setArchiveToDelete(archive);
    setShowDeleteModal(true);
  };

  const confirmDeleteArchive = async () => {
    if (!archiveToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/Archive/destroy/${archiveToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setArchives(prevArchive =>
          prevArchive.filter(archive => archive.id !== archiveToDelete.id)
        );
        // Fermer le modal et reset l'état
        setShowDeleteModal(false);
        setArchiveToDelete(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
      // En cas d'erreur, on ferme quand même le modal
      setShowDeleteModal(false);
      setArchiveToDelete(null);
    }
  };

  const cancelDeleteArchive = () => {
    setShowDeleteModal(false);
    setArchiveToDelete(null);
  };

  // Calcul des statistiques
  const totalParticipants = archives.reduce((sum, archive) => sum + parseInt(archive.participants || "0"), 0);
  const totalArticles = archives.reduce((sum, archive) => sum + parseInt(archive.articles || "0"), 0);
  const totalCountries = archives.reduce((sum, archive) => sum + parseInt(archive.countries || "0"), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">Chargement des archives...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 bg-white border-0 shadow-lg text-center">
            <div className="text-red-400 mb-4">
              <Archive className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur de chargement</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              onClick={fetchArchives}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Réessayer
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                Gestion des Archives
              </h1>
              <p className="text-gray-600 text-lg">Consultez et gérez l'historique de vos événements</p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
              onClick={handleNewArchive}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Archive
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{archives.length}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Événements Archivés</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Archive className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  {totalParticipants}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Total Participants</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  {totalArticles}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Articles Publiés</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  {totalCountries}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Pays Représentés</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 bg-white border-0 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom d'événement, sujet, organisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base rounded-lg transition-all duration-200"
            />
          </div>
        </Card>

        {/* Formulaire d'archive */}
        <ArchiveForm
          isOpen={isFormOpen}
          archiveItem={currentArchive}
          onClose={() => setIsFormOpen(false)}
          onSave={() => fetchArchives()}
        />

        {/* Grille des archives */}
        {filteredArchives.length === 0 ? (
          <Card className="p-12 bg-white border-0 shadow-lg text-center">
            <div className="text-gray-400 mb-4">
              <Archive className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune archive trouvée</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Aucune archive disponible'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredArchives.map((archive) => (
              <Card key={archive.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* En-tête de la carte */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        {archive.year && <Badge className="bg-gray-100 text-gray-700 mb-2">{archive.year}</Badge>}
                        {archive.status && getStatusBadge(archive.status)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {archive.event_name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-800 font-semibold">{archive.subject_fr}</p>
                      <p className="text-sm text-gray-600 italic">{archive.subject_en}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {archive.location && (
                        <>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{archive.location}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                        </>
                      )}
                      {archive.duration && (
                        <>
                          <span>{archive.duration}</span>
                          <span className="text-gray-300">•</span>
                        </>
                      )}
                      <span className="font-medium">{archive.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques de l'événement */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{archive.participants || '0'}</p>
                      <p className="text-xs text-gray-600 font-medium">Participants</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{archive.articles || '0'}</p>
                      <p className="text-xs text-gray-600 font-medium">Articles</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <Globe className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900">{archive.countries || '0'}</p>
                      <p className="text-xs text-gray-600 font-medium">Pays</p>
                    </div>
                  </div>

                  {/* Galerie photo */}
                  {archive.photoGalleryLink && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Camera className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Galerie Photos</p>
                            <p className="text-xs text-gray-600">Moments marquants de l'événement</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => window.open(archive.photoGalleryLink, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm"
                      title="Modifier l'archive"
                      onClick={() => handleEditArchive(archive)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm"
                      title="Supprimer l'archive"
                      onClick={() => handleDeleteArchive(archive)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteArchive}
        onConfirm={confirmDeleteArchive}
        Name={archiveToDelete?.event_name || ''}
      />
    </div>
  );
}