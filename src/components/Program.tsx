import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Coffee, Users, Presentation, Award, MapPin, Star } from 'lucide-react';

interface ProgramProps {
  language?: 'fr' | 'en';
}

const Program: React.FC<ProgramProps> = ({ language = 'fr' }) => {
  const content = {
    fr: {
      title: 'Programme de la Conférence',
      subtitle: 'Trois jours d\'innovation et de découvertes technologiques',
      days: [
        {
          day: 'Jour 1',
          date: '24 Octobre 2025',
          theme: 'Intelligence & Innovation',
          color: 'slate',
          sessions: [
            { time: '09:00-09:30', event: 'Accueil et enregistrement', type: 'welcome', location: 'Hall principal' },
            { time: '09:30-10:30', event: 'Conférence inaugurale - Dr. Sarah Johnson', type: 'keynote', location: 'Auditorium A' },
            { time: '10:30-11:00', event: 'Pause café networking', type: 'break', location: 'Espace détente' },
            { time: '11:00-12:30', event: 'Session 1: Intelligence Artificielle', type: 'session', location: 'Salle 101' },
            { time: '12:30-14:00', event: 'Déjeuner gastronomique', type: 'meal', location: 'Restaurant' },
            { time: '14:00-15:30', event: 'Session 2: Industrie 4.0', type: 'session', location: 'Salle 102' },
            { time: '15:30-16:00', event: 'Pause énergisante', type: 'break', location: 'Terrasse' },
            { time: '16:00-17:30', event: 'Posters et démonstrations', type: 'demo', location: 'Hall expo' }
          ]
        },
        {
          day: 'Jour 2',
          date: '25 Octobre 2025',
          theme: 'Durabilité & Environnement',
          color: 'gray',
          sessions: [
            { time: '09:00-10:00', event: 'Conférence - Prof. Ahmed Benali', type: 'keynote', location: 'Auditorium A' },
            { time: '10:00-10:30', event: 'Pause café bio', type: 'break', location: 'Espace détente' },
            { time: '10:30-12:00', event: 'Session 3: Technologies Durables', type: 'session', location: 'Salle 201' },
            { time: '12:00-13:30', event: 'Déjeuner éco-responsable', type: 'meal', location: 'Restaurant' },
            { time: '13:30-15:00', event: 'Session 4: Environnement', type: 'session', location: 'Salle 202' },
            { time: '15:00-15:30', event: 'Pause détente', type: 'break', location: 'Jardin' },
            { time: '15:30-17:00', event: 'Table ronde industrie', type: 'panel', location: 'Salle des débats' }
          ]
        },
        {
          day: 'Jour 3',
          date: '26 Octobre 2025',
          theme: 'Robotique & Futur',
          color: 'stone',
          sessions: [
            { time: '09:00-10:00', event: 'Conférence - Dr. Maria Rodriguez', type: 'keynote', location: 'Auditorium A' },
            { time: '10:00-10:30', event: 'Dernière pause café', type: 'break', location: 'Espace détente' },
            { time: '10:30-12:00', event: 'Session 5: Robotique avancée', type: 'session', location: 'Lab robotique' },
            { time: '12:00-13:00', event: 'Session de clôture & remise prix', type: 'closing', location: 'Auditorium A' },
            { time: '13:00-14:30', event: 'Déjeuner de clôture & au revoir', type: 'meal', location: 'Restaurant' }
          ]
        }
      ]
    },
    en: {
      title: 'Conference Program',
      subtitle: 'Three days of innovation and technological discoveries',
      days: [
        {
          day: 'Day 1',
          date: 'October 24, 2025',
          theme: 'Intelligence & Innovation',
          color: 'slate',
          sessions: [
            { time: '09:00-09:30', event: 'Welcome and registration', type: 'welcome', location: 'Main Hall' },
            { time: '09:30-10:30', event: 'Opening keynote - Dr. Sarah Johnson', type: 'keynote', location: 'Auditorium A' },
            { time: '10:30-11:00', event: 'Coffee networking break', type: 'break', location: 'Lounge Area' },
            { time: '11:00-12:30', event: 'Session 1: Artificial Intelligence', type: 'session', location: 'Room 101' },
            { time: '12:30-14:00', event: 'Gourmet lunch', type: 'meal', location: 'Restaurant' },
            { time: '14:00-15:30', event: 'Session 2: Industry 4.0', type: 'session', location: 'Room 102' },
            { time: '15:30-16:00', event: 'Energizing break', type: 'break', location: 'Terrace' },
            { time: '16:00-17:30', event: 'Posters and demonstrations', type: 'demo', location: 'Expo Hall' }
          ]
        },
        {
          day: 'Day 2',
          date: 'October 25, 2025',
          theme: 'Sustainability & Environment',
          color: 'gray',
          sessions: [
            { time: '09:00-10:00', event: 'Keynote - Prof. Ahmed Benali', type: 'keynote', location: 'Auditorium A' },
            { time: '10:00-10:30', event: 'Organic coffee break', type: 'break', location: 'Lounge Area' },
            { time: '10:30-12:00', event: 'Session 3: Sustainable Technologies', type: 'session', location: 'Room 201' },
            { time: '12:00-13:30', event: 'Eco-friendly lunch', type: 'meal', location: 'Restaurant' },
            { time: '13:30-15:00', event: 'Session 4: Environment', type: 'session', location: 'Room 202' },
            { time: '15:00-15:30', event: 'Relaxing break', type: 'break', location: 'Garden' },
            { time: '15:30-17:00', event: 'Industry panel', type: 'panel', location: 'Debate Room' }
          ]
        },
        {
          day: 'Day 3',
          date: 'October 26, 2025',
          theme: 'Robotics & Future',
          color: 'stone',
          sessions: [
            { time: '09:00-10:00', event: 'Keynote - Dr. Maria Rodriguez', type: 'keynote', location: 'Auditorium A' },
            { time: '10:00-10:30', event: 'Final coffee break', type: 'break', location: 'Lounge Area' },
            { time: '10:30-12:00', event: 'Session 5: Advanced Robotics', type: 'session', location: 'Robotics Lab' },
            { time: '12:00-13:00', event: 'Closing session & awards', type: 'closing', location: 'Auditorium A' },
            { time: '13:00-14:30', event: 'Closing lunch & farewell', type: 'meal', location: 'Restaurant' }
          ]
        }
      ]
    }
  };

  const currentContent = content[language] || content.fr;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Users className="w-3 h-3" />;
      case 'keynote': return <Presentation className="w-3 h-3" />;
      case 'break': return <Coffee className="w-3 h-3" />;
      case 'session': return <Calendar className="w-3 h-3" />;
      case 'meal': return <Coffee className="w-3 h-3" />;
      case 'demo': return <Award className="w-3 h-3" />;
      case 'panel': return <Users className="w-3 h-3" />;
      case 'closing': return <Star className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'welcome': return { bg: 'from-slate-500 to-slate-600', icon: 'bg-slate-50 text-slate-600 border-slate-200' };
      case 'keynote': return { bg: 'from-gray-600 to-gray-700', icon: 'bg-gray-50 text-gray-600 border-gray-200' };
      case 'break': return { bg: 'from-stone-500 to-stone-600', icon: 'bg-stone-50 text-stone-600 border-stone-200' };
      case 'session': return { bg: 'from-zinc-500 to-zinc-600', icon: 'bg-zinc-50 text-zinc-600 border-zinc-200' };
      case 'meal': return { bg: 'from-neutral-500 to-neutral-600', icon: 'bg-neutral-50 text-neutral-600 border-neutral-200' };
      case 'demo': return { bg: 'from-slate-600 to-gray-600', icon: 'bg-slate-50 text-slate-600 border-slate-200' };
      case 'panel': return { bg: 'from-gray-500 to-stone-600', icon: 'bg-gray-50 text-gray-600 border-gray-200' };
      case 'closing': return { bg: 'from-stone-600 to-zinc-600', icon: 'bg-stone-50 text-stone-600 border-stone-200' };
      default: return { bg: 'from-gray-500 to-slate-600', icon: 'bg-gray-50 text-gray-600 border-gray-200' };
    }
  };

  const getDayColors = (color: string) => {
    switch (color) {
      case 'slate': return {
        gradient: 'from-slate-700 via-slate-600 to-gray-700',
        tab: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-gray-600',
        timeline: 'from-slate-300 via-slate-400 to-gray-400'
      };
      case 'gray': return {
        gradient: 'from-gray-700 via-gray-600 to-stone-700',
        tab: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-stone-600',
        timeline: 'from-gray-300 via-gray-400 to-stone-400'
      };
      case 'stone': return {
        gradient: 'from-stone-700 via-stone-600 to-zinc-700',
        tab: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-stone-600 data-[state=active]:to-zinc-600',
        timeline: 'from-stone-300 via-stone-400 to-zinc-400'
      };
      default: return {
        gradient: 'from-slate-700 via-gray-700 to-zinc-700',
        tab: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-gray-600',
        timeline: 'from-slate-300 via-gray-300 to-zinc-300'
      };
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50 py-6">
      <div className="container mx-auto px-3">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-slate-700 via-gray-700 to-stone-700 bg-clip-text text-transparent">
              {currentContent.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-light max-w-2xl mx-auto">
              {currentContent.subtitle}
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-slate-400 via-gray-400 to-stone-400 mx-auto mt-3 rounded-full"></div>
          </div>
          
          <Tabs defaultValue="0" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-2 border border-gray-200/50 gap-1">
              {currentContent.days.map((day, index) => {
                const dayColors = getDayColors(day.color);
                return (
                  <TabsTrigger 
                    key={index} 
                    value={index.toString()}
                    className={`text-xs font-medium py-3 px-2 rounded-md transition-all duration-300 ${dayColors.tab} data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 min-h-[60px] flex-1`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 w-full">
                      <span className="text-sm font-semibold whitespace-nowrap">{day.day}</span>
                      <span className="text-xs opacity-75 font-normal text-center leading-tight">{day.theme}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {currentContent.days.map((day, dayIndex) => {
              const dayColors = getDayColors(day.color);
              return (
                <TabsContent key={dayIndex} value={dayIndex.toString()}>
                  <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-100">
                    <CardHeader className={`bg-gradient-to-r ${dayColors.gradient} text-white py-6`}>
                      <div className="text-center">
                        <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                          {day.day}
                        </CardTitle>
                        <div className="text-lg font-light opacity-90 mb-3">
                          {day.date}
                        </div>
                        <div className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/30">
                          {day.theme}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 md:p-8">
                      <div className="relative">
                        {/* Timeline */}
                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b ${dayColors.timeline} h-full rounded-full opacity-30`}></div>
                        
                        <div className="space-y-5">
                          {day.sessions.map((session, sessionIndex) => {
                            const eventColor = getEventColor(session.type);
                            return (
                              <div 
                                key={sessionIndex} 
                                className={`flex items-center ${sessionIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-4 md:gap-5`}
                              >
                                {/* Session Card */}
                                <div className={`flex-1 max-w-xs ${sessionIndex % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                  <div className="bg-white/80 backdrop-blur-sm rounded-md p-3 shadow-sm border border-gray-100/60 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-6 h-6 ${eventColor.icon} border rounded-md flex items-center justify-center`}>
                                        <Clock className="w-3 h-3" />
                                      </div>
                                      <div className="font-semibold text-gray-800 text-xs">
                                        {session.time}
                                      </div>
                                    </div>
                                    
                                    <div className="text-gray-700 font-medium mb-2 leading-snug text-xs">
                                      {session.event}
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                                      <MapPin className="w-2.5 h-2.5" />
                                      <span>{session.location}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Icon */}
                                <div className={`w-8 h-8 bg-gradient-to-r ${eventColor.bg} rounded-md flex items-center justify-center text-white shadow-sm relative z-10 shrink-0 hover:scale-105 transition-all duration-200`}>
                                  {getEventIcon(session.type)}
                                </div>
                                
                                <div className="flex-1 max-w-xs"></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Program;