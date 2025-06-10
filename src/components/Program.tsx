
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProgramProps {
  language: 'fr' | 'en';
}

const Program: React.FC<ProgramProps> = ({ language }) => {
  const content = {
    fr: {
      title: 'Programme de la Conférence',
      days: [
        {
          day: 'Jour 1',
          date: '24 0ctobre 2025',
          sessions: [
            { time: '09:00-09:30', event: 'Accueil et enregistrement' },
            { time: '09:30-10:30', event: 'Conférence inaugurale - Dr. Sarah Johnson' },
            { time: '10:30-11:00', event: 'Pause café' },
            { time: '11:00-12:30', event: 'Session 1: Intelligence Artificielle' },
            { time: '12:30-14:00', event: 'Déjeuner' },
            { time: '14:00-15:30', event: 'Session 2: Industrie 4.0' },
            { time: '15:30-16:00', event: 'Pause' },
            { time: '16:00-17:30', event: 'Posters et démonstrations' }
          ]
        },
        {
          day: 'Jour 2',
          date: '25 Octobre 2025',
          sessions: [
            { time: '09:00-10:00', event: 'Conférence - Prof. Ahmed Benali' },
            { time: '10:00-10:30', event: 'Pause café' },
            { time: '10:30-12:00', event: 'Session 3: Technologies Durables' },
            { time: '12:00-13:30', event: 'Déjeuner' },
            { time: '13:30-15:00', event: 'Session 4: Environnement' },
            { time: '15:00-15:30', event: 'Pause' },
            { time: '15:30-17:00', event: 'Table ronde industrie' }
          ]
        },
        {
          day: 'Jour 3',
          date: '26 Octobre 2025',
          sessions: [
            { time: '09:00-10:00', event: 'Conférence - Dr. Maria Rodriguez' },
            { time: '10:00-10:30', event: 'Pause café' },
            { time: '10:30-12:00', event: 'Session 5: Robotique' },
            { time: '12:00-13:00', event: 'Session de clôture' },
            { time: '13:00-14:30', event: 'Déjeuner de clôture' }
          ]
        }
      ]
    },
    en: {
      title: 'Conference Program',
      days: [
        {
          day: 'Day 1',
          date: 'October 24, 2025',
          sessions: [
            { time: '09:00-09:30', event: 'Welcome and registration' },
            { time: '09:30-10:30', event: 'Opening keynote - Dr. Sarah Johnson' },
            { time: '10:30-11:00', event: 'Coffee break' },
            { time: '11:00-12:30', event: 'Session 1: Artificial Intelligence' },
            { time: '12:30-14:00', event: 'Lunch' },
            { time: '14:00-15:30', event: 'Session 2: Industry 4.0' },
            { time: '15:30-16:00', event: 'Break' },
            { time: '16:00-17:30', event: 'Posters and demonstrations' }
          ]
        },
        {
          day: 'Day 2',
          date: 'October 25, 2025',
          sessions: [
            { time: '09:00-10:00', event: 'Keynote - Prof. Ahmed Benali' },
            { time: '10:00-10:30', event: 'Coffee break' },
            { time: '10:30-12:00', event: 'Session 3: Sustainable Technologies' },
            { time: '12:00-13:30', event: 'Lunch' },
            { time: '13:30-15:00', event: 'Session 4: Environment' },
            { time: '15:00-15:30', event: 'Break' },
            { time: '15:30-17:00', event: 'Industry panel' }
          ]
        },
        {
          day: 'Day 3',
          date: 'October 26, 2025',
          sessions: [
            { time: '09:00-10:00', event: 'Keynote - Dr. Maria Rodriguez' },
            { time: '10:00-10:30', event: 'Coffee break' },
            { time: '10:30-12:00', event: 'Session 5: Robotics' },
            { time: '12:00-13:00', event: 'Closing session' },
            { time: '13:00-14:30', event: 'Closing lunch' }
          ]
        }
      ]
    }
  };

  return (
    <section id="program" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
          
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {content[language].days.map((day, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  {day.day}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {content[language].days.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={dayIndex.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-primary">
                      {day.day} - {day.date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.sessions.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="font-mono text-primary font-semibold min-w-[100px]">
                            {session.time}
                          </div>
                          <div className="text-muted-foreground">
                            {session.event}
                          </div>
                        </div>
                      ))}
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
