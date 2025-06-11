import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Coffee, Users, Presentation, Award } from 'lucide-react';

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
          sessions: [
            { time: '09:00-09:30', event: 'Accueil et enregistrement', type: 'welcome' },
            { time: '09:30-10:30', event: 'Conférence inaugurale - Dr. Sarah Johnson', type: 'keynote' },
            { time: '10:30-11:00', event: 'Pause café', type: 'break' },
            { time: '11:00-12:30', event: 'Session 1: Intelligence Artificielle', type: 'session' },
            { time: '12:30-14:00', event: 'Déjeuner', type: 'meal' },
            { time: '14:00-15:30', event: 'Session 2: Industrie 4.0', type: 'session' },
            { time: '15:30-16:00', event: 'Pause', type: 'break' },
            { time: '16:00-17:30', event: 'Posters et démonstrations', type: 'demo' }
          ]
        },
        {
          day: 'Jour 2',
          date: '25 Octobre 2025',
          theme: 'Durabilité & Environnement',
          color: 'gray',
          sessions: [
            { time: '09:00-10:00', event: 'Conférence - Prof. Ahmed Benali', type: 'keynote' },
            { time: '10:00-10:30', event: 'Pause café', type: 'break' },
            { time: '10:30-12:00', event: 'Session 3: Technologies Durables', type: 'session' },
            { time: '12:00-13:30', event: 'Déjeuner', type: 'meal' },
            { time: '13:30-15:00', event: 'Session 4: Environnement', type: 'session' },
            { time: '15:00-15:30', event: 'Pause', type: 'break' },
            { time: '15:30-17:00', event: 'Table ronde industrie', type: 'panel' }
          ]
        },
        {
          day: 'Jour 3',
          date: '26 Octobre 2025',
          theme: 'Robotique & Futur',
          color: 'stone',
          sessions: [
            { time: '09:00-10:00', event: 'Conférence - Dr. Maria Rodriguez', type: 'keynote' },
            { time: '10:00-10:30', event: 'Pause café', type: 'break' },
            { time: '10:30-12:00', event: 'Session 5: Robotique', type: 'session' },
            { time: '12:00-13:00', event: 'Session de clôture', type: 'closing' },
            { time: '13:00-14:30', event: 'Déjeuner de clôture', type: 'meal' }
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
            { time: '09:00-09:30', event: 'Welcome and registration', type: 'welcome' },
            { time: '09:30-10:30', event: 'Opening keynote - Dr. Sarah Johnson', type: 'keynote' },
            { time: '10:30-11:00', event: 'Coffee break', type: 'break' },
            { time: '11:00-12:30', event: 'Session 1: Artificial Intelligence', type: 'session' },
            { time: '12:30-14:00', event: 'Lunch', type: 'meal' },
            { time: '14:00-15:30', event: 'Session 2: Industry 4.0', type: 'session' },
            { time: '15:30-16:00', event: 'Break', type: 'break' },
            { time: '16:00-17:30', event: 'Posters and demonstrations', type: 'demo' }
          ]
        },
        {
          day: 'Day 2',
          date: 'October 25, 2025',
          theme: 'Sustainability & Environment',
          color: 'gray',
          sessions: [
            { time: '09:00-10:00', event: 'Keynote - Prof. Ahmed Benali', type: 'keynote' },
            { time: '10:00-10:30', event: 'Coffee break', type: 'break' },
            { time: '10:30-12:00', event: 'Session 3: Sustainable Technologies', type: 'session' },
            { time: '12:00-13:30', event: 'Lunch', type: 'meal' },
            { time: '13:30-15:00', event: 'Session 4: Environment', type: 'session' },
            { time: '15:00-15:30', event: 'Break', type: 'break' },
            { time: '15:30-17:00', event: 'Industry panel', type: 'panel' }
          ]
        },
        {
          day: 'Day 3',
          date: 'October 26, 2025',
          theme: 'Robotics & Future',
          color: 'stone',
          sessions: [
            { time: '09:00-10:00', event: 'Keynote - Dr. Maria Rodriguez', type: 'keynote' },
            { time: '10:00-10:30', event: 'Coffee break', type: 'break' },
            { time: '10:30-12:00', event: 'Session 5: Robotics', type: 'session' },
            { time: '12:00-13:00', event: 'Closing session', type: 'closing' },
            { time: '13:00-14:30', event: 'Closing lunch', type: 'meal' }
          ]
        }
      ]
    }
  };

  const currentContent = content[language] || content.fr;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Users className="w-4 h-4" />;
      case 'keynote': return <Presentation className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'session': return <Calendar className="w-4 h-4" />;
      case 'meal': return <Coffee className="w-4 h-4" />;
      case 'demo': return <Award className="w-4 h-4" />;
      case 'panel': return <Users className="w-4 h-4" />;
      case 'closing': return <Award className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-slate-600';
      case 'keynote': return 'bg-slate-700';
      case 'break': return 'bg-slate-400';
      case 'session': return 'bg-slate-600';
      case 'meal': return 'bg-slate-500';
      case 'demo': return 'bg-slate-600';
      case 'panel': return 'bg-slate-700';
      case 'closing': return 'bg-slate-800';
      default: return 'bg-slate-500';
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {currentContent.title}
            </h2>
            <p className="text-slate-600 text-sm">
              {currentContent.subtitle}
            </p>
          </div>
          
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 h-10">
              {currentContent.days.map((day, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()}
                  className="text-sm font-medium text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  {day.day}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {currentContent.days.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={dayIndex.toString()}>
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                    <CardTitle className="text-center text-lg font-semibold text-slate-800">
                      {day.day} - {day.date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative">
                      {/* Ligne centrale verticale */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-slate-300 h-full"></div>
                      
                      <div className="space-y-8">
                        {day.sessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="relative flex items-center">
                            {/* Contenu alternant gauche/droite */}
                            {sessionIndex % 2 === 0 ? (
                              // Index pair: contenu à gauche
                              <>
                                <div className="flex-1 pr-8 text-right">
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="text-xs font-mono text-slate-600 mb-1">
                                      {session.time}
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm">
                                      {session.event}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Cercle central */}
                                <div className={`w-10 h-10 ${getEventColor(session.type)} rounded-full flex items-center justify-center text-white shadow-md relative z-10 shrink-0`}>
                                  {getEventIcon(session.type)}
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
                                <div className={`w-10 h-10 ${getEventColor(session.type)} rounded-full flex items-center justify-center text-white shadow-md relative z-10 shrink-0`}>
                                  {getEventIcon(session.type)}
                                </div>
                                
                                <div className="flex-1 pl-8 text-left">
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="text-xs font-mono text-slate-600 mb-1">
                                      {session.time}
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm">
                                      {session.event}
                                    </div>
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