import { Card } from "@/components/ui/card";
import { Users, Mic, Calendar, TrendingUp, Building2, Newspaper, Archive, Tags } from "lucide-react";

export function AdminStats() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">Tableau de Bord</h1>
        <p className="text-gray-600">Vue d'ensemble des activités</p>
      </div>

      {/* Section des cartes statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white transform hover:scale-105 transition-all duration-200 shadow-lg border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Participants</p>
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-white/70 text-xs mt-1">+12% ce mois</p>
            </div>
            <Users className="h-8 w-8 text-white/80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-500 text-white transform hover:scale-105 transition-all duration-200 shadow-lg border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Intervenants</p>
              <p className="text-3xl font-bold">89</p>
              <p className="text-white/70 text-xs mt-1">+5% ce mois</p>
            </div>
            <Mic className="h-8 w-8 text-white/80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white transform hover:scale-105 transition-all duration-200 shadow-lg border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Sessions</p>
              <p className="text-3xl font-bold">156</p>
              <p className="text-white/70 text-xs mt-1">24 cette semaine</p>
            </div>
            <Calendar className="h-8 w-8 text-white/80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-600 to-green-500 text-white transform hover:scale-105 transition-all duration-200 shadow-lg border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Revenus</p>
              <p className="text-3xl font-bold">€84,560</p>
              <p className="text-white/70 text-xs mt-1">+18% ce mois</p>
            </div>
            <TrendingUp className="h-8 w-8 text-white/80" />
          </div>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Activité Récente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Nouveau participant inscrit</span>
              </div>
              <span className="text-xs text-gray-500">Il y a 5 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Session ajoutée au programme</span>
              </div>
              <span className="text-xs text-gray-500">Il y a 12 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Paiement en attente</span>
              </div>
              <span className="text-xs text-gray-500">Il y a 23 min</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Statut Global</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Partenaires</p>
              <p className="text-xl font-bold text-blue-700">24</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Tags className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Thèmes</p>
              <p className="text-xl font-bold text-blue-700">8</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Newspaper className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Actualités</p>
              <p className="text-xl font-bold text-blue-700">15</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Archive className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Archives</p>
              <p className="text-xl font-bold text-blue-700">42</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}