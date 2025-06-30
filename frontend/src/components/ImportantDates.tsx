import React, { useState, useEffect } from 'react';
import { Calendar, Download, ExternalLink, Loader2, Clock, CheckCircle, AlertCircle, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface ImportantDate {
  id: number;
  event_fr: string;
  event_en: string;
  date: string;
  end_date: string | null;
  description_fr: string | null;
  description_en: string | null;
  created_at: string;
  updated_at: string;
}

interface TimelineProps {
  language: 'fr' | 'en';
}

const Timeline: React.FC<TimelineProps> = ({ language }) => {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ImportantDate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(true);

  const formatDate = (startDateString: string, endDateString: string | null, lang: 'fr' | 'en'): string => {
    const startDate = new Date(startDateString);
    if (isNaN(startDate.getTime())) {
      return lang === 'fr' ? 'Date invalide' : 'Invalid date';
    }
    if (!endDateString || endDateString === 'NULL' || endDateString.trim() === '') {
      const singleDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', singleDateOptions);
    }
    const endDate = new Date(endDateString);
    if (isNaN(endDate.getTime())) {
      const singleDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', singleDateOptions);
    }
    const sameMonth = startDate.getMonth() === endDate.getMonth() && 
                     startDate.getFullYear() === endDate.getFullYear();
    if (sameMonth) {
      if (lang === 'fr') {
        const day1 = startDate.getDate();
        const day2 = endDate.getDate();
        const month = startDate.toLocaleDateString('fr-FR', { month: 'long' });
        const year = startDate.getFullYear();
        return `${day1}-${day2} ${month} ${year}`;
      } else {
        const month = startDate.toLocaleDateString('en-US', { month: 'long' });
        const day1 = startDate.getDate();
        const day2 = endDate.getDate();
        const year = startDate.getFullYear();
        return `${month} ${day1}-${day2}, ${year}`;
      }
    } else {
      const startOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long'
      };
      const endOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      const startFormatted = startDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', startOptions);
      const endFormatted = endDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', endOptions);
      return `${startFormatted} - ${endFormatted}`;
    }
  };

  const extractTime = (dateString: string): string | null => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    const timeString = dateString.includes('T') ? dateString.split('T')[1] : null;
    if (timeString && timeString !== '00:00:00') {
      const time = timeString.split(':');
      return `${time[0]}:${time[1]}`;
    }
    return null;
  };

  const getEventStyle = (eventText: string, index: number) => {
    const lowerEvent = eventText.toLowerCase();
    const colorPalette = [
      { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-500', text: 'text-blue-700' },
      { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500', text: 'text-emerald-700' },
      { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'bg-amber-500', text: 'text-amber-700' },
      { bg: 'bg-rose-50', border: 'border-rose-200', accent: 'bg-rose-500', text: 'text-rose-700' },
      { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-500', text: 'text-purple-700' },
      { bg: 'bg-indigo-50', border: 'border-indigo-200', accent: 'bg-indigo-500', text: 'text-indigo-700' },
      { bg: 'bg-teal-50', border: 'border-teal-200', accent: 'bg-teal-500', text: 'text-teal-700' },
      { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-500', text: 'text-orange-700' }
    ];
    let icon = Calendar;
    if (lowerEvent.includes('soumission') || lowerEvent.includes('submission')) {
      icon = AlertCircle;
    } else if (lowerEvent.includes('notification') || lowerEvent.includes('acceptation')) {
      icon = CheckCircle;
    } else if (lowerEvent.includes('inscription') || lowerEvent.includes('registration')) {
      icon = Clock;
    }
    return { ...colorPalette[index % colorPalette.length], icon };
  };

  const getEventStatus = (dateString: string, endDateString: string | null): 'past' | 'current' | 'future' => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const endDate = endDateString ? new Date(endDateString) : eventDate;
    if (now > endDate) return 'past';
    if (now >= eventDate && now <= endDate) return 'current';
    return 'future';
  };

  const openModal = (event: ImportantDate) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const isConferenceEvent = (event: ImportantDate): boolean => {
    const eventText = language === 'fr' ? event.event_fr : event.event_en;
    return eventText.toLowerCase().includes('conférence') || eventText.toLowerCase().includes('conference');
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'submit':
        window.open('https://cmt3.research.microsoft.com/User/Login?ReturnUrl-%2FConference%2FRecent', '_blank');
        break;
      case 'register': {
        const element = document.getElementById('registration');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'conference':
      case 'program': {
        const programElement = document.getElementById('program');
        if (programElement) {
          programElement.scrollIntoView({ behavior: 'smooth' });
        }
        closeModal();
        break;
      }
    }
  };

  useEffect(() => {
    const fetchImportantDates = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/dates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ImportantDate[] = await response.json();
        const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setDates(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching important dates:', err);
        setError(language === 'fr' 
          ? 'Erreur lors du chargement des dates importantes' 
          : 'Error loading important dates'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchImportantDates();
  }, [language]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  const staticContent = {
    fr: {
      title: 'Timeline des Événements',
      loading: 'Chargement...',
      noData: 'Aucune date importante disponible',
      viewDetails: 'Voir les détails',
      register: 'S\'inscrire',
      submit: 'Soumettre',
      viewProgram: 'Voir le programme',
      closeModal: 'Fermer',
      eventDetails: 'Détails de l\'événement',
      toggleTimeline: 'Afficher/Masquer la Timeline'
    },
    en: {
      title: 'Events Timeline',
      loading: 'Loading...',
      noData: 'No important dates available',
      viewDetails: 'View Details',
      register: 'Register',
      submit: 'Submit',
      viewProgram: 'View Program',
      closeModal: 'Close',
      eventDetails: 'Event Details',
      toggleTimeline: 'Show/Hide Timeline'
    }
  };

  if (loading) {
    return (
      <section id="dates" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-8 sm:mb-12">
              {staticContent[language].title}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-blue-600" />
              <span className="text-slate-600 text-sm sm:text-base">{staticContent[language].loading}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || dates.length === 0) {
    return (
      <section id="dates" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-8 sm:mb-12">
              {staticContent[language].title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {error || staticContent[language].noData}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="dates" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 text-center">
                {staticContent[language].title}
              </h2>
              <div className="flex justify-end mt-2 sm:mt-4">
                <button
                  className="sm:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                  onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                >
                  {isTimelineOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {staticContent[language].toggleTimeline}
                </button>
              </div>
            </div>
            
            <div className={`relative ${isTimelineOpen ? 'block' : 'hidden sm:block'}`}>
              <div className="hidden sm:block absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-teal-200"></div>
              
              <div className="space-y-6 sm:space-y-8">
                {dates.map((item, index) => {
                  const event = language === 'fr' ? item.event_fr : item.event_en;
                  const description = language === 'fr' ? item.description_fr : item.description_en;
                  const formattedDate = formatDate(item.date, item.end_date, language);
                  const time = extractTime(item.date);
                  const eventStyle = getEventStyle(event, index);
                  const eventStatus = getEventStatus(item.date, item.end_date);
                  const IconComponent = eventStyle.icon;
                  
                  return (
                    <div key={item.id} className="relative flex items-start gap-4 sm:gap-6">
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`
                          w-10 h-10 sm:w-12 sm:h-12 rounded-full ${eventStyle.bg} ${eventStyle.border} border-2 
                          flex items-center justify-center shadow-md
                          ${eventStatus === 'current' ? 'ring-2 ring-blue-200 animate-pulse' : ''}
                          ${eventStatus === 'past' ? 'opacity-75' : ''}
                        `}>
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${eventStyle.accent} flex items-center justify-center text-white shadow-sm`}>
                            <span className="text-xs sm:text-sm font-bold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm flex items-center justify-center ${eventStyle.text}`}>
                            <IconComponent className="w-3 h-3 sm:w-3 sm:h-3" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`
                          ${eventStyle.bg} ${eventStyle.border} border-l-4 rounded-lg shadow-md
                          hover:shadow-lg transition-all duration-300 
                          ${eventStatus === 'current' ? 'shadow-md' : ''}
                          ${eventStatus === 'past' ? 'opacity-90' : ''}
                        `}>
                          <div className="p-4 sm:p-6">
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className={`text-base sm:text-lg font-semibold ${eventStyle.text} mb-2`}>
                                  {event}
                                </h3>
                                
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{formattedDate}</span>
                                  </div>
                                  {time && (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                      <span>{time}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {description && (
                                  <p className="text-xs sm:text-sm text-slate-700 mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-4">
                                    {description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                  <button 
                                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md border ${eventStyle.text} hover:${eventStyle.bg} transition-colors bg-white flex items-center gap-1`}
                                    onClick={() => openModal(item)}
                                  >
                                    <Eye className="w-3 h-3 sm:w-3 sm:h-3" />
                                    {staticContent[language].viewDetails}
                                  </button>
                                  
                                  {isConferenceEvent(item) && (
                                    <button 
                                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md ${eventStyle.accent} hover:opacity-90 text-white flex items-center gap-1`}
                                      onClick={() => handleAction('program')}
                                    >
                                      <Calendar className="w-3 h-3 sm:w-3 sm:h-3" />
                                      {staticContent[language].viewProgram}
                                    </button>
                                  )}
                                  
                                  {(event.toLowerCase().includes('inscription') || event.toLowerCase().includes('registration')) && (
                                    <button 
                                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md ${eventStyle.accent} hover:opacity-90 text-white flex items-center gap-1`}
                                      onClick={() => handleAction('register')}
                                    >
                                      <ExternalLink className="w-3 h-3 sm:w-3 sm:h-3" />
                                      {staticContent[language].register}
                                    </button>
                                  )}
                                  
                                  {(event.toLowerCase().includes('soumission') || event.toLowerCase().includes('submission')) && (
                                    <button 
                                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md ${eventStyle.accent} hover:opacity-90 text-white flex items-center gap-1`}
                                      onClick={() => handleAction('submit')}
                                    >
                                      <ExternalLink className="w-3 h-3 sm:w-3 sm:h-3" />
                                      {staticContent[language].submit}
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${eventStatus === 'past' ? 'bg-gray-100 text-gray-600' : ''}
                                ${eventStatus === 'current' ? 'bg-green-100 text-green-700' : ''}
                                ${eventStatus === 'future' ? 'bg-blue-100 text-blue-700' : ''}
                              `}>
                                {eventStatus === 'past' && (language === 'fr' ? 'Terminé' : 'Past')}
                                {eventStatus === 'current' && (language === 'fr' ? 'En cours' : 'Current')}
                                {eventStatus === 'future' && (language === 'fr' ? 'À venir' : 'Upcoming')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-start sm:justify-center p-3 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`
            bg-white rounded-xl shadow-2xl w-full max-w-[75vw] sm:max-w-sm max-h-[80vh] overflow-y-auto
            transition-all duration-300 ease-in-out transform
            ${isModalOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
            ml-3 sm:ml-0
          `}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between rounded-t-xl">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {staticContent[language].eventDetails}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-3 sm:p-4">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-1 sm:mb-2">
                  {language === 'fr' ? selectedEvent.event_fr : selectedEvent.event_en}
                </h4>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatDate(selectedEvent.date, selectedEvent.end_date, language)}</span>
                  </div>
                  {extractTime(selectedEvent.date) && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{extractTime(selectedEvent.date)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {(language === 'fr' ? selectedEvent.description_fr : selectedEvent.description_en) && (
                <div className="mb-3 sm:mb-4">
                  <h5 className="text-sm sm:text-base font-semibold text-slate-700 mb-1">Description</h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {language === 'fr' ? selectedEvent.description_fr : selectedEvent.description_en}
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-200">
                {isConferenceEvent(selectedEvent) && (
                  <button 
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 transition-colors"
                    onClick={() => handleAction('program')}
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {staticContent[language].viewProgram}
                  </button>
                )}
                
                {(selectedEvent.event_fr.toLowerCase().includes('inscription') || 
                  selectedEvent.event_en.toLowerCase().includes('registration')) && (
                  <button 
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 transition-colors"
                    onClick={() => handleAction('register')}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    {staticContent[language].register}
                  </button>
                )}
                
                {(selectedEvent.event_fr.toLowerCase().includes('soumission') || 
                  selectedEvent.event_en.toLowerCase().includes('submission')) && (
                  <button 
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 transition-colors"
                    onClick={() => handleAction('submit')}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    {staticContent[language].submit}
                  </button>
                )}
                
                <button 
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  onClick={closeModal}
                >
                  {staticContent[language].closeModal}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timeline;