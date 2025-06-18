import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash, Calendar, ExternalLink, Eye, TrendingUp } from "lucide-react";
import NewsForm from "./NewsForm"; // Assurez-vous que le chemin est correct

export default function NewsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  // Données d'exemple
  const [news, setNews] = useState([
    {
      id: 1,
      typeFr: "Annonce",
      typeEn: "Announcement",
      titleFr: "Ouverture des inscriptions",
      titleEn: "Registration is now open",
      date: "2024-03-15",
      author: "Comité d'Organisation",
      descriptionFr: "Les inscriptions pour la conférence sont maintenant ouvertes. Profitez des tarifs préférentiels jusqu'au 30 mars.",
      descriptionEn: "Registration for the conference is now open. Take advantage of preferential rates until March 30th.",
      link: "https://example.com/register",
      views: 1245,
      status: "published"
    },
    {
      id: 2,
      typeFr: "Actualité",
      typeEn: "News",
      titleFr: "Programme préliminaire disponible",
      titleEn: "Preliminary program available",
      date: "2024-03-20",
      author: "Comité Scientifique",
      descriptionFr: "Le programme préliminaire de la conférence est maintenant disponible avec plus de 50 sessions.",
      descriptionEn: "The preliminary conference program is now available with over 50 sessions.",
      link: null,
      views: 892,
      status: "published"
    },
    {
      id: 3,
      typeFr: "Notification",
      typeEn: "Notification",
      titleFr: "Date limite extension",
      titleEn: "Deadline extension",
      date: "2024-03-25",
      author: "Secrétariat",
      descriptionFr: "La date limite de soumission a été prolongée jusqu'au 15 avril pour permettre plus de contributions.",
      descriptionEn: "The submission deadline has been extended to April 15th to allow for more contributions.",
      link: null,
      views: 654,
      status: "pending"
    },
  ]);

  const getTypeBadge = (typeFr) => {
    const badgeStyles = {
      "Annonce": "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm",
      "Actualité": "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm",
      "Notification": "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm",
      "Information": "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-sm",
    };
    return <Badge className={`${badgeStyles[typeFr] || "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm"} px-3 py-1 font-medium`}>{typeFr}</Badge>;
  };

  const getStatusIndicator = (status) => {
    if (status === "published") {
      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    }
    return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>;
  };

  const filteredNews = news.filter(item => 
    item.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descriptionFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.typeFr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (newsItem = null) => {
    setCurrentNews(newsItem);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentNews(null);
  };

  const handleSaveNews = (data) => {
    if (currentNews) {
      // Mise à jour d'une actualité existante
      setNews(news.map(item => item.id === currentNews.id ? { ...item, ...data } : item));
    } else {
      // Création d'une nouvelle actualité
      const newId = Math.max(...news.map(item => item.id), 0) + 1;
      setNews([...news, { ...data, id: newId, views: 0 }]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteNews = (id) => {
    setNews(news.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Actualités</h1>
            <p className="text-gray-600">Gérez et publiez vos actualités en toute simplicité</p>
          </div>
          <Button 
            onClick={() => handleOpenForm()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle actualité
          </Button>
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{news.length}</p>
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
                  {news.filter(item => item.status === "published" && new Date(item.date).getMonth() === new Date().getMonth()).length}
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
                  {news.filter(item => item.status === "pending").length}
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
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </Card>
          ) : (
            filteredNews.map((item) => (
              <Card key={item.id} className="p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
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
                          <span className="font-medium">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
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
                      onClick={() => handleDeleteNews(item.id)}
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