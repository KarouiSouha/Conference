import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Calendar, ExternalLink, Eye, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import NewsForm from "./NewsForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

// Define interfaces for type safety
interface NewsItem {
  id: number;
  typeFr: string;
  typeEn: string;
  titleFr: string;
  titleEn: string;
  date: string;
  author: string;
  descriptionFr: string;
  descriptionEn: string;
  link?: string;
  views: number;
  status: string;
}

export default function NewsManager() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);

  // Fonction pour récupérer les données depuis l'API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/News/all');

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Transformation des données pour correspondre au format attendu
      const transformedData: NewsItem[] = data.map((item: any) => ({
        id: item.id,
        typeFr: item.type_fr,
        typeEn: item.type_en,
        titleFr: item.title_fr,
        titleEn: item.title_en,
        date: item.date,
        author: item.author,
        descriptionFr: item.description_fr,
        descriptionEn: item.description_en,
        link: item.link,
        views: Math.floor(Math.random() * 2000), // Simulation des vues
        status: "published", // Statut par défaut
      }));

      setNews(transformedData);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des actualités:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Récupération des données au montage du composant
  useEffect(() => {
    fetchNews();
  }, []);

  const getTypeBadge = (typeFr: string) => {
    const badgeStyles: { [key: string]: string } = {
      Annonce: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm",
      Actualité: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm",
      Notification: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm",
      Information: "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-sm",
    };
    return (
      <Badge
        className={`${
          badgeStyles[typeFr] || "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm"
        } px-3 py-1 font-medium`}
      >
        {typeFr}
      </Badge>
    );
  };

  const getStatusIndicator = (status: string) => {
    if (status === "published") {
      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    }
    return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>;
  };

  const filteredNews = news.filter(
    (item) =>
      item.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.typeFr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (newsItem: NewsItem | null = null) => {
    setCurrentNews(newsItem);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentNews(null);
  };

  const handleSaveNews = async (data: NewsItem) => {
    try {
      // Transformer les données pour correspondre aux noms de champs attendus par l'API
      const transformedData = {
        type_fr: data.typeFr,
        type_en: data.typeEn,
        title_fr: data.titleFr,
        title_en: data.titleEn,
        date: data.date,
        author: data.author,
        description_fr: data.descriptionFr,
        description_en: data.descriptionEn,
        link: data.link,
        status: data.status,
      };

      let response;
      if (currentNews) {
        // Mise à jour d'une actualité existante
        response = await fetch(`http://localhost:8000/api/News/update/${currentNews.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        // Mise à jour locale
        setNews(news.map((item) => (item.id === currentNews.id ? { ...item, ...data } : item)));
      } else {
        // Création d'une nouvelle actualité
        response = await fetch('http://localhost:8000/api/News/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        const newNews = await response.json();
        // Ajout local avec l'ID retourné par l'API
        setNews([...news, { ...data, id: newNews.news.id, views: 0 }]);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
      throw err;
    }
  };

  const handleOpenDeleteModal = (newsItem: NewsItem) => {
    setNewsToDelete(newsItem);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setNewsToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (newsToDelete) {
      try {
        const response = await fetch(`http://localhost:8000/api/News/destroy/${newsToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        setNews(news.filter((item) => item.id !== newsToDelete.id));
      } catch (err: any) {
        console.error('Erreur lors de la suppression:', err);
        setError(err.message || 'Erreur lors de la suppression');
      } finally {
        handleCloseDeleteModal();
      }
    }
  };

  const handleRefresh = () => {
    fetchNews();
  };

  // Composant de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Chargement des actualités...</h2>
          <p className="text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  // Composant d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="p-8 max-w-md bg-white border-0 shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Erreur de chargement</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </Card>
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
                Gestion des Actualités
              </h1>
              <p className="text-gray-600 text-lg">Gérez et publiez vos actualités en toute simplicité</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Actualiser
              </Button>
              <Button
                onClick={() => handleOpenForm()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle actualité
              </Button>
            </div>
          </div>
        </div>

        {/* Formulaire (conditionnel) */}
        {isFormOpen && (
          <NewsForm
            isOpen={isFormOpen}
            newsItem={currentNews}
            onClose={handleCloseForm}
            onSave={handleSaveNews}
          />
        )}

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          partnerName={newsToDelete?.titleFr || ""}
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {news.length}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Total Actualités</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  {news.filter((item) => item.status === "published" && new Date(item.date).getMonth() === new Date().getMonth())
                    .length}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Publiées ce mois</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                  {news.filter((item) => item.status === "pending").length}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">En attente</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <div className="w-6 h-6 bg-amber-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                  {news.reduce((sum, item) => sum + item.views, 0)}
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1">Vues totales</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 bg-white border-0 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher une actualité par titre, description ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base rounded-lg transition-all duration-200"
            />
          </div>
        </Card>

        {/* Liste des actualités */}
        <div className="space-y-6">
          {filteredNews.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-lg text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune actualité trouvée</h3>
              <p className="text-gray-500">
                {news.length === 0
                  ? "Aucune actualité disponible pour le moment"
                  : "Essayez de modifier vos critères de recherche"}
              </p>
            </Card>
          ) : (
            filteredNews.map((item) => (
              <Card
                key={item.id}
                className="p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Statut et métadonnées */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(item.status)}
                        {getTypeBadge(item.typeFr)}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium">{item.author}</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {item.titleFr}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium italic mb-3">{item.titleEn}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-700 leading-relaxed">{item.descriptionFr}</p>
                        <p className="text-sm text-gray-500 italic leading-relaxed">{item.descriptionEn}</p>
                      </div>
                    </div>

                    {/* Lien externe */}
                    {item.link && (
                      <div className="pt-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group/link"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          <span className="border-b border-transparent group-hover/link:border-blue-600 transition-colors">
                            Voir le lien
                          </span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3 lg:ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenForm(item)}
                      className="border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDeleteModal(item)}
                      className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}