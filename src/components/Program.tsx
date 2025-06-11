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
      case 'welcome': return <Users className="w-5 h-5" />;
      case 'keynote': return <Presentation className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'session': return <Calendar className="w-5 h-5" />;
      case 'meal': return <Coffee className="w-5 h-5" />;
      case 'demo': return <Award className="w-5 h-5" />;
      case 'panel': return <Users className="w-5 h-5" />;
      case 'closing': return <Award className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-blue-500';
      case 'keynote': return 'bg-purple-500';
      case 'break': return 'bg-green-500';
      case 'session': return 'bg-orange-500';
      case 'meal': return 'bg-red-500';
      case 'demo': return 'bg-yellow-500';
      case 'panel': return 'bg-pink-500';
      case 'closing': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="program" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-16">
            {currentContent.title}
          </h2>
          
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg">
              {currentContent.days.map((day, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()}
                  className="text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                >
                  {day.day}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {currentContent.days.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={dayIndex.toString()}>
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                    <CardTitle className="text-center text-2xl font-bold">
                      {day.day} - {day.date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="relative">
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 h-full rounded-full"></div>
                      
                      <div className="space-y-8">
                        {day.sessions.map((session, sessionIndex) => (
                          <div 
                            key={sessionIndex} 
                            className={`flex items-center ${sessionIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                          >
                            <div className={`flex-1 ${sessionIndex % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="font-bold text-lg text-gray-800 mb-2">
                                  {session.time}
                                </div>
                                <div className="text-gray-600 text-base leading-relaxed">
                                  {session.event}
                                </div>
                              </div>
                            </div>
                            
                            <div className={`w-12 h-12 ${getEventColor(session.type)} rounded-full flex items-center justify-center text-white shadow-lg relative z-10 shrink-0`}>
                              {getEventIcon(session.type)}
                            </div>
                            
                            <div className="flex-1"></div>
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