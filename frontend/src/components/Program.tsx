import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Coffee, Users, Presentation, Award, Loader2, AlertCircle, Download, FileText } from 'lucide-react';

interface Session {
  id: number;
  jour: string;
  heure: string;
  evenement: string;
  description?: string;
  intervenant?: string;
  lieu?: string;
  type_evenement: string;
  created_at?: string;
  updated_at?: string;
}

interface GroupedSessions {
  [date: string]: Session[];
}

interface ProgramProps {
  language?: 'fr' | 'en';
  apiUrl?: string;
}

const Program: React.FC<ProgramProps> = ({
  language = 'fr',
  apiUrl = 'http://localhost:8000/api'
}) => {
  const [programData, setProgramData] = useState<GroupedSessions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('0');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const content = {
    fr: {
      title: 'Programme de la Conférence',
      subtitle: 'Découvrez le programme complet de notre événement',
      loading: 'Chargement du programme...',
      error: 'Erreur lors du chargement du programme',
      noData: 'Aucun programme disponible',
      speaker: 'Intervenant',
      location: 'Lieu',
      downloadPdf: 'Télécharger le programme PDF',
      downloadingPdf: 'Téléchargement en cours...',
      downloadError: 'Erreur lors du téléchargement du PDF'
    },
    en: {
      title: 'Conference Program',
      subtitle: 'Discover the complete program of our event',
      loading: 'Loading program...',
      error: 'Error loading program',
      noData: 'No program available',
      speaker: 'Speaker',
      location: 'Location',
      downloadPdf: 'Download PDF Program',
      downloadingPdf: 'Downloading...',
      downloadError: 'Error downloading PDF'
    }
  };

  const currentContent = content[language] || content.fr;

  // Fetch program data from Laravel API
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/Programme/all?lang=${language}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setProgramData(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching program data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [language, apiUrl]);

  // Handle PDF download
  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);

      const url = `${apiUrl}/Programme/download-pdf?lang=${language}`;
      console.log('Fetching PDF from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      if (!contentType?.includes('application/pdf')) {
        const responseText = await response.text();
        throw new Error(`Expected PDF, but received ${contentType}: ${responseText}`);
      }

      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }

      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `programme-conference-${language}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);

      console.log('PDF download successful');
    } catch (err) {
      console.error('PDF download error:', err);
      const errorMessage = err instanceof Error 
        ? `${currentContent.downloadError}: ${err.message}`
        : currentContent.downloadError;
      alert(errorMessage);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Convert grouped data to array format for tabs
  const getDaysArray = () => {
    return Object.entries(programData).map(([date, sessions], index) => ({
      date,
      sessions,
      index
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Convert "HH:MM:SS" to "HH:MM"
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'keynote': return <Presentation className="w-4 h-4" />;
      case 'session': return <Calendar className="w-4 h-4" />;
      case 'workshop': return <Users className="w-4 h-4" />;
      case 'panel': return <Users className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'meal': return <Coffee className="w-4 h-4" />;
      case 'networking': return <Users className="w-4 h-4" />;
      case 'ceremony': return <Award className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'bg-slate-700';
      case 'session': return 'bg-slate-600';
      case 'workshop': return 'bg-slate-600';
      case 'panel': return 'bg-slate-700';
      case 'break': return 'bg-slate-400';
      case 'meal': return 'bg-slate-500';
      case 'networking': return 'bg-slate-600';
      case 'ceremony': return 'bg-slate-800';
      default: return 'bg-slate-500';
    }
  };

  const daysArray = getDaysArray();

  if (loading) {
    return (
      <section className="py-12 bg-white" id="program">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-600" />
              <p className="text-slate-600">{currentContent.loading}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white" id="program">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2">{currentContent.error}</p>
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (daysArray.length === 0) {
    return (
      <section className="py-12 bg-white" id="program">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">{currentContent.noData}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white" id="program">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {currentContent.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {currentContent.subtitle}
            </p>
            
            {/* Bouton de téléchargement PDF */}
            <div className="mb-6">
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {currentContent.downloadingPdf}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <FileText className="w-4 h-4" />
                    {currentContent.downloadPdf}
                  </>
                )}
              </button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full mb-6 bg-slate-100 h-10 ${daysArray.length === 1 ? 'grid-cols-1' :
                daysArray.length === 2 ? 'grid-cols-2' :
                  daysArray.length === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
              }`}>
              {daysArray.map((day, index) => (
                <TabsTrigger
                  key={day.date}
                  value={index.toString()}
                  className="text-sm font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  {language === 'fr' ? `Jour ${index + 1}` : `Day ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>

            {daysArray.map((day, dayIndex) => (
              <TabsContent key={day.date} value={dayIndex.toString()}>
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                    <CardTitle className="text-center text-lg font-semibold text-slate-800">
                      {formatDate(day.date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative">
                      {/* Ligne centrale verticale */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-slate-300 h-full"></div>

                      <div className="space-y-8">
                        {day.sessions.map((session, sessionIndex) => (
                          <div key={session.id} className="relative flex items-center">
                            {/* Contenu alternant gauche/droite */}
                            {sessionIndex % 2 === 0 ? (
                              // Index pair: contenu à gauche
                              <>
                                <div className="flex-1 pr-8 text-right">
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="text-xs font-mono text-slate-600 mb-1">
                                      {formatTime(session.heure)}
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm mb-2">
                                      {session.evenement}
                                    </div>
                                    {session.description && (
                                      <div className="text-xs text-slate-600 mb-1">
                                        {session.description}
                                      </div>
                                    )}
                                    {session.intervenant && (
                                      <div className="text-xs text-slate-500">
                                        <span className="font-medium">{currentContent.speaker}:</span> {session.intervenant}
                                      </div>
                                    )}
                                    {session.lieu && (
                                      <div className="text-xs text-slate-500">
                                        <span className="font-medium">{currentContent.location}:</span> {session.lieu}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Cercle central */}
                                <div className={`w-10 h-10 ${getEventColor(session.type_evenement)} rounded-full flex items-center justify-center text-white shadow-md relative z-10 shrink-0`}>
                                  {getEventIcon(session.type_evenement)}
                                </div>

                                {/* Espace à droite */}
                                <div className="flex-1 pl-8"></div>
                              </>
                            ) : (
                              // Index impair: contenu à droite
                              <>
                                {/* Espace à gauche */}
                                <div className="flex-1 pr-8"></div>

                                {/* Cercle central */}
                                <div className={`w-10 h-10 ${getEventColor(session.type_evenement)} rounded-full flex items-center justify-center text-white shadow-md relative z-10 shrink-0`}>
                                  {getEventIcon(session.type_evenement)}
                                </div>

                                <div className="flex-1 pl-8 text-left">
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="text-xs font-mono text-slate-600 mb-1">
                                      {formatTime(session.heure)}
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm mb-2">
                                      {session.evenement}
                                    </div>
                                    {session.description && (
                                      <div className="text-xs text-slate-600 mb-1">
                                        {session.description}
                                      </div>
                                    )}
                                    {session.intervenant && (
                                      <div className="text-xs text-slate-500">
                                        <span className="font-medium">{currentContent.speaker}:</span> {session.intervenant}
                                      </div>
                                    )}
                                    {session.lieu && (
                                      <div className="text-xs text-slate-500">
                                        <span className="font-medium">{currentContent.location}:</span> {session.lieu}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Program;