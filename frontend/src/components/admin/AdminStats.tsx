import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Users, Mic, Calendar, TrendingUp, Building2, Newspaper, Archive, Tags, ArrowUpRight, Activity, MoreVertical, Bell, Settings, Search, Filter, ChevronDown, Zap, Target, Clock, DollarSign } from "lucide-react";

interface Stats {
  participants: { count: number; previousMonth: number };
  speakers: { count: number; activeThisMonth: number };
  sessions: { count: number; thisWeek: number };
  revenue: { total: number; thisMonth: number };
  performance: { satisfaction: number };
  goals: { achieved: number };
  growth: { percentage: number };
  partners: { count: number; thisMonth: number };
  themes: { count: number };
  news: { count: number; thisWeek: number };
  archives: { count: number };
  activities: Array<{ type: string; description: string; time: string }>;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    participants: { count: 0, previousMonth: 0 },
    speakers: { count: 0, activeThisMonth: 0 },
    sessions: { count: 0, thisWeek: 0 },
    revenue: { total: 0, thisMonth: 0 },
    performance: { satisfaction: 94 },
    goals: { achieved: 87 },
    growth: { percentage: 24 },
    partners: { count: 0, thisMonth: 0 },
    themes: { count: 0 },
    news: { count: 0, thisWeek: 0 },
    archives: { count: 0 },
    activities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [
          registrationStatsRes,
          speakersStatsRes,
          programmeRes,
          partnersRes,
          themesRes,
          newsRes,
          archivesRes,
        ] = await Promise.all([
          axios.get("/api/Registration/statistics"),
          axios.get("/api/Speakers/statistics"),
          axios.get("/api/Programme/all"),
          axios.get("/api/Partners/count"),
          axios.get("/api/Theme/all"),
          axios.get("/api/News/all"),
          axios.get("/api/Archive/all"),
        ]);

        // Extraire les données
        const participantsCount = registrationStatsRes.data.data.total || 0;
        const revenueTotal = registrationStatsRes.data.data.total_amount || 0;
        const speakersCount = speakersStatsRes.data.data.total || 0;
        const speakersActiveThisMonth = speakersStatsRes.data.data.active_this_month || 0;
        const sessionsCount = programmeRes.data.length || 0;
        const partnersCount = partnersRes.data.total_partners || 0; // Changé de count à total_partners
        const themesCount = themesRes.data.data.length || 0;
        const newsCount = newsRes.data.length || 0;
        const archivesCount = archivesRes.data.length || 0;

        // Définir un type pour les objets news
        type NewsItem = { title_fr?: string; title_en?: string };
        // Simuler des données pour les activités
        const activities = newsRes.data.slice(0, 4).map((news: NewsItem) => ({
          type: "Actualité",
          description: news.title_fr || news.title_en,
          time: `${Math.floor(Math.random() * 60)} min`,
        }));

        setStats({
          participants: { count: participantsCount, previousMonth: Math.round(participantsCount * 0.88) }, // Simuler +12%
          speakers: { count: speakersCount, activeThisMonth: speakersActiveThisMonth },
          sessions: { count: sessionsCount, thisWeek: Math.round(sessionsCount * 0.15) }, // Simuler 15%
          revenue: { total: revenueTotal, thisMonth: Math.round(revenueTotal * 0.82) }, // Simuler +18%
          performance: { satisfaction: 94 }, // Statique
          goals: { achieved: 87 }, // Statique
          growth: { percentage: 24 }, // Statique
          partners: { count: partnersCount, thisMonth: 2 }, // Simuler +2
          themes: { count: themesCount },
          news: { count: newsCount, thisWeek: 5 }, // Simuler +5
          archives: { count: archivesCount },
          activities,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white p-6">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="text-slate-600 text-lg">Votre centre de contrôle intelligent</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-800">Live</span>
            </div>
            <button className="p-3 bg-slate-100 rounded-2xl border border-slate-200 hover:bg-slate-200 transition-all duration-300">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
            <button className="p-3 bg-slate-100 rounded-2xl border border-slate-200 hover:bg-slate-200 transition-all duration-300">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all duration-300">
              <Filter className="h-4 w-4 text-slate-600" />
              <span className="text-slate-600 text-sm">Filtrer</span>
              <ChevronDown className="h-4 w-4 text-slate-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xs text-slate-500">Dernière mise à jour</p>
              <p className="text-sm text-slate-800 font-medium">Il y a 2 minutes</p>
            </div>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-blue-700 text-xs font-semibold tracking-wider uppercase">Participants</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-slate-800">{stats.participants.count}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-emerald-100 px-3 py-1 rounded-full">
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-600">+12%</span>
                      </div>
                      <span className="text-xs text-slate-500">vs mois dernier</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl border border-blue-200">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <p className="text-purple-700 text-xs font-semibold tracking-wider uppercase">Intervenants</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-slate-800">{stats.speakers.count}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-emerald-100 px-3 py-1 rounded-full">
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-600">{stats.speakers.activeThisMonth} actifs ce mois</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-100 rounded-2xl border border-purple-200">
                  <Mic className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 hover:border-indigo-300 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <p className="text-indigo-700 text-xs font-semibold tracking-wider uppercase">Sessions</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-slate-800">{stats.sessions.count}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-indigo-100 px-3 py-1 rounded-full">
                        <Clock className="h-3 w-3 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-600">{stats.sessions.thisWeek} cette semaine</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-indigo-100 rounded-2xl border border-indigo-200">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-emerald-700 text-xs font-semibold tracking-wider uppercase">Revenus</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-slate-800">{stats.revenue.total.toLocaleString()} DT</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-emerald-100 px-3 py-1 rounded-full">
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-600">+18%</span>
                      </div>
                      <span className="text-xs text-slate-500">ce mois-ci</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-200">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Performance</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{stats.performance.satisfaction}%</p>
                  <p className="text-xs text-slate-500">Satisfaction</p>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: `${stats.performance.satisfaction}%` }}></div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Objectifs</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">{stats.goals.achieved}%</p>
                  <p className="text-xs text-slate-500">Atteints</p>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full" style={{ width: `${stats.goals.achieved}%` }}></div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Croissance</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">+{stats.growth.percentage}%</p>
                  <p className="text-xs text-slate-500">Ce trimestre</p>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full" style={{ width: `${stats.growth.percentage}%` }}></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Activité en Temps Réel</h3>
                    <p className="text-slate-500 text-sm mt-1">Flux d'activité de votre plateforme</p>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <MoreVertical className="h-5 w-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {stats.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="text-slate-800 font-medium">{activity.type}</span>
                            <p className="text-slate-500 text-sm">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Resource Overview */}
          <div>
            <Card className="bg-white border border-slate-200 shadow-sm">
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Ressources</h3>
                  <p className="text-slate-500 text-sm mt-1">Vue d'ensemble de vos assets</p>
                </div>

                <div className="space-y-4">
                  <div className="group hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Partenaires</p>
                          <p className="text-sm text-slate-500">Entreprises actives</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{stats.partners.count}</p>
                        <div className="flex items-center space-x-1">
                          <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                          <p className="text-xs text-emerald-600">+{stats.partners.thisMonth} ce mois</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                          <Tags className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Thèmes</p>
                          <p className="text-sm text-slate-500">Catégories disponibles</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{stats.themes.count}</p>
                        <p className="text-xs text-slate-500">Actifs</p>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                          <Newspaper className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Actualités</p>
                          <p className="text-sm text-slate-500">Articles publiés</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{stats.news.count}</p>
                        <div className="flex items-center space-x-1">
                          <ArrowUpRight className="h-3 w-3 text-blue-500" />
                          <p className="text-xs text-blue-600">{stats.news.thisWeek} cette semaine</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
                          <Archive className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Archives</p>
                          <p className="text-sm text-slate-500">Contenus archivés</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{stats.archives.count}</p>
                        <p className="text-xs text-slate-500">Disponibles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}