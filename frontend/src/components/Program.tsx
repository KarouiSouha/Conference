import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, Calendar, Coffee, Users, Presentation, Award, Loader2, AlertCircle, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

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

  // Initialize refs for each day
  useEffect(() => {
    dayRefs.current = Array(Object.keys(programData).length).fill(null);
  }, [programData]);

  // Delay function to ensure DOM rendering
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle PDF download
  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      const daysArray = getDaysArray();

      if (daysArray.length === 0) {
        throw new Error('No program data available');
      }

      // Add elegant background gradient
      pdf.setFillColor(248, 250, 252); // slate-50
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Add subtle top gradient bar
      pdf.setFillColor(30, 41, 59); // slate-800
      pdf.rect(0, 0, pageWidth, 8, 'F');

      // Add title with enhanced styling
      pdf.setFontSize(28);
      pdf.setTextColor(30, 41, 59); // slate-800
      pdf.setFont('helvetica', 'bold');
      
      const titleText = currentContent.title;
      const titleWidth = pdf.getTextWidth(titleText);
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(titleText, titleX, 30);

      // Add decorative line under title
      pdf.setDrawColor(148, 163, 184); // slate-400
      pdf.setLineWidth(0.5);
      pdf.line(margin, 35, pageWidth - margin, 35);

      // Add subtitle with elegant styling
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139); // slate-500
      const subtitleText = currentContent.subtitle;
      const subtitleWidth = pdf.getTextWidth(subtitleText);
      const subtitleX = (pageWidth - subtitleWidth) / 2;
      pdf.text(subtitleText, subtitleX, 45);

      let currentY = 60;

      // Ensure active tab is rendered
      await delay(500);

      for (let i = 0; i < daysArray.length; i++) {
        // Temporarily set active tab to ensure content is rendered
        setActiveTab(i.toString());
        await delay(200);

        const dayRef = dayRefs.current[i];
        if (!dayRef) {
          console.warn(`No ref for day ${i}`);
          continue;
        }

        // Apply PDF-specific styling
        const container = dayRef.closest('.max-w-4xl');
        const tabsList = container?.querySelector('.bg-slate-100') as HTMLElement;
        const buttonContainer = container?.querySelector('.mb-6') as HTMLElement;
        const titleElement = container?.querySelector('h2') as HTMLElement;
        
        // Hide unnecessary elements
        if (tabsList) tabsList.style.display = 'none';
        if (buttonContainer) buttonContainer.style.display = 'none';
        if (titleElement) titleElement.style.display = 'none';

        // Apply elegant PDF styling
        dayRef.style.display = 'block';
        dayRef.style.minHeight = '400px';
        dayRef.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
        dayRef.style.padding = '20px';
        dayRef.style.borderRadius = '12px';
        dayRef.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';

        // Enhance card styling for PDF
        const card = dayRef.querySelector('.shadow-sm') as HTMLElement;
        if (card) {
          card.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
          card.style.border = '1px solid #e2e8f0';
          card.style.borderRadius = '16px';
          card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
        }

        // Enhance card header
        const cardHeader = dayRef.querySelector('.bg-slate-50') as HTMLElement;
        if (cardHeader) {
          cardHeader.style.background = 'linear-gradient(135deg, #334155 0%, #475569 100%)';
          cardHeader.style.color = 'white';
          cardHeader.style.borderRadius = '16px 16px 0 0';
          cardHeader.style.padding = '16px';
        }

        // Enhance session cards
        const sessionCards = dayRef.querySelectorAll('.bg-white.p-4');
        sessionCards.forEach((sessionCard, index) => {
          const card = sessionCard as HTMLElement;
          card.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
          card.style.border = '1px solid #e2e8f0';
          card.style.borderRadius = '12px';
          card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
          card.style.transition = 'all 0.3s ease';
        });

        // Enhance timeline circles
        const timelineCircles = dayRef.querySelectorAll('[class*="rounded-full"]');
        timelineCircles.forEach((circle) => {
          const circleElement = circle as HTMLElement;
          circleElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          circleElement.style.border = '3px solid white';
        });

        // Enhance central timeline
        const timeline = dayRef.querySelector('.bg-slate-300') as HTMLElement;
        if (timeline) {
          timeline.style.background = 'linear-gradient(to bottom, #cbd5e1 0%, #94a3b8 100%)';
          timeline.style.width = '3px';
          timeline.style.borderRadius = '2px';
        }

        await delay(300);

        const canvas = await html2canvas(dayRef, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          width: dayRef.offsetWidth,
          height: dayRef.offsetHeight,
          logging: false,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.querySelector('[data-day-content]');
            if (clonedElement) {
              (clonedElement as HTMLElement).style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
              (clonedElement as HTMLElement).style.padding = '20px';
            }
          }
        });

        // Restore visibility
        if (tabsList) tabsList.style.display = '';
        if (buttonContainer) buttonContainer.style.display = '';
        if (titleElement) titleElement.style.display = '';

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Empty canvas for day ${i}`);
          continue;
        }

        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = pageWidth - 2 * margin;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if we need a new page
        if (i > 0 || currentY + imgHeight > pageHeight - margin) {
          pdf.addPage();
          
          // Add background to new page
          pdf.setFillColor(248, 250, 252);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          
          // Add top gradient bar
          pdf.setFillColor(30, 41, 59);
          pdf.rect(0, 0, pageWidth, 8, 'F');
          
          currentY = 25;
          
          // Add day title for subsequent pages
          if (i > 0) {
            pdf.setFontSize(20);
            pdf.setTextColor(30, 41, 59);
            pdf.setFont('helvetica', 'bold');
            const dayTitle = `${language === 'fr' ? 'Jour' : 'Day'} ${i + 1}`;
            const dayTitleWidth = pdf.getTextWidth(dayTitle);
            const dayTitleX = (pageWidth - dayTitleWidth) / 2;
            pdf.text(dayTitle, dayTitleX, currentY + 10);
            
            // Add decorative line
            pdf.setDrawColor(148, 163, 184);
            pdf.setLineWidth(0.5);
            pdf.line(margin, currentY + 15, pageWidth - margin, currentY + 15);
            
            currentY += 30;
          }
        }

        // Adjust height if necessary
        const availableHeight = pageHeight - currentY - margin;
        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
        }

        // Add subtle shadow behind the content
        pdf.setFillColor(0, 0, 0, 0.05);
        pdf.rect(margin + 2, currentY + 2, imgWidth, imgHeight, 'F');

        // Add the content image
        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 15;
      }

      // Add elegant footer
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.setFont('helvetica', 'normal');
      const footerText = `${currentContent.title} - ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}`;
      const footerWidth = pdf.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      pdf.text(footerText, footerX, pageHeight - 10);

      // Restore original active tab
      setActiveTab('0');

      pdf.save(`programme-conference-${language}.pdf`);
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
            <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {currentContent.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {currentContent.subtitle}
            </p>
            
            {/* Download PDF Button */}
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
                <div 
                  ref={el => dayRefs.current[dayIndex] = el} 
                  data-day-content 
                  style={{ minHeight: '400px', backgroundColor: 'white' }}
                >
                  <Card className="shadow-sm border border-slate-200 bg-white">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                      <CardTitle className="text-center text-lg font-semibold text-slate-800">
                        {formatDate(day.date)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="relative">
                        {/* Central vertical line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-slate-300 h-full"></div>

                        <div className="space-y-8">
                          {day.sessions.map((session, sessionIndex) => (
                            <div key={session.id} className="relative flex items-center">
                              {/* Alternating content left/right */}
                              {sessionIndex % 2 === 0 ? (
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

                                  {/* Central circle */}
                                  <div className={`w-10 h-10 ${getEventColor(session.type_evenement)} rounded-full flex items-center justify-center text-white shadow-md relative z-10 shrink-0`}>
                                    {getEventIcon(session.type_evenement)}
                                  </div>

                                  {/* Right spacer */}
                                  <div className="flex-1 pl-8"></div>
                                </>
                              ) : (
                                <>
                                  {/* Left spacer */}
                                  <div className="flex-1 pr-8"></div>

                                  {/* Central circle */}
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
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Program;