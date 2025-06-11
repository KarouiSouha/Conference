'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Globe, Award } from 'lucide-react';
import Modal from './Modal';
import { useToast } from '@/hooks/use-toast';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';



interface SpeakersProps {
  language: 'fr' | 'en';
}

const Speakers: React.FC<SpeakersProps> = ({ language }) => {
  const { toast } = useToast();
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'snap',
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 16 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
  });


  const content = {
    fr: {
      title: 'Conférenciers Invités',
      subtitle: 'Des experts reconnus internationalement',
      speakers: [
        {
          name: 'Dr. Sarah Johnson',
          title: 'Professeure en IA',
          affiliation: 'MIT, États-Unis',
          specialty: 'Intelligence artificielle appliquée',
          bio: 'Dr. Sarah Johnson est une pionnière dans le domaine de l\'intelligence artificielle appliquée à l\'industrie. Avec plus de 15 ans d\'expérience, elle a dirigé de nombreux projets révolutionnaires au MIT.',
          achievements: ['Prix IEEE pour l\'Innovation en IA (2022)', 'Plus de 150 publications scientifiques', 'Conseillère pour Fortune 500'],
          talk: 'L\'avenir de l\'IA dans l\'industrie moderne',
          email: 'sarah.johnson@mit.edu',
          website: 'https://ai.mit.edu/sarah-johnson'
        },
        {
          name: 'Dr. Sarah Johnson',
          title: 'Professeure en IA',
          affiliation: 'MIT, États-Unis',
          specialty: 'Intelligence artificielle appliquée',
          bio: 'Dr. Sarah Johnson est une pionnière dans le domaine de l\'intelligence artificielle appliquée à l\'industrie. Avec plus de 15 ans d\'expérience, elle a dirigé de nombreux projets révolutionnaires au MIT.',
          achievements: ['Prix IEEE pour l\'Innovation en IA (2022)', 'Plus de 150 publications scientifiques', 'Conseillère pour Fortune 500'],
          talk: 'L\'avenir de l\'IA dans l\'industrie moderne',
          email: 'sarah.johnson@mit.edu',
          website: 'https://ai.mit.edu/sarah-johnson'
        },
        {
          name: 'Dr. Sarah Johnson',
          title: 'Professeure en IA',
          affiliation: 'MIT, États-Unis',
          specialty: 'Intelligence artificielle appliquée',
          bio: 'Dr. Sarah Johnson est une pionnière dans le domaine de l\'intelligence artificielle appliquée à l\'industrie. Avec plus de 15 ans d\'expérience, elle a dirigé de nombreux projets révolutionnaires au MIT.',
          achievements: ['Prix IEEE pour l\'Innovation en IA (2022)', 'Plus de 150 publications scientifiques', 'Conseillère pour Fortune 500'],
          talk: 'L\'avenir de l\'IA dans l\'industrie moderne',
          email: 'sarah.johnson@mit.edu',
          website: 'https://ai.mit.edu/sarah-johnson'
        },
        {
          name: 'Prof. Ahmed Benali',
          title: 'Directeur de recherche',
          affiliation: 'CNRS, France',
          specialty: 'Technologies durables',
          bio: 'Prof. Ahmed Benali est un expert reconnu en technologies durables et énergies renouvelables. Il dirige l\'équipe de recherche sur les technologies vertes au CNRS.',
          achievements: ['Médaille d\'argent CNRS (2021)', 'Expert consultant pour l\'UE', '80+ brevets internationaux'],
          talk: 'Innovation verte: Technologies pour un avenir durable',
          email: 'ahmed.benali@cnrs.fr',
          website: 'https://cnrs.fr/ahmed-benali'
        },
        {
          name: 'Dr. Maria Rodriguez',
          title: 'Ingénieure en chef',
          affiliation: 'Siemens, Allemagne',
          specialty: 'Industrie 4.0',
          bio: 'Dr. Maria Rodriguez dirige l\'innovation en Industrie 4.0 chez Siemens. Elle est responsable du développement de solutions IoT industrielles de nouvelle génération.',
          achievements: ['Innovation Award Siemens (2023)', 'Leader en transformation digitale', '120+ projets industriels'],
          talk: 'Transformation digitale: De l\'IoT à l\'usine intelligente',
          email: 'maria.rodriguez@siemens.com',
          website: 'https://siemens.com/maria-rodriguez'
        }
      ],
      actions: {
        contact: 'Contacter',
        website: 'Site web',
        bio: 'Biographie complète'
      }
    },
    en: {
      title: 'Keynote Speakers',
      subtitle: 'Internationally recognized experts',
      speakers: [
        {
          name: 'Dr. Sarah Johnson',
          title: 'Professor in AI',
          affiliation: 'MIT, USA',
          specialty: 'Applied artificial intelligence',
          bio: 'Dr. Sarah Johnson is a pioneer in the field of artificial intelligence applied to industry. With over 15 years of experience, she has led numerous groundbreaking projects at MIT.',
          achievements: ['IEEE Innovation in AI Award (2022)', 'Over 150 scientific publications', 'Fortune 500 Advisor'],
          talk: 'The Future of AI in Modern Industry',
          email: 'sarah.johnson@mit.edu',
          website: 'https://ai.mit.edu/sarah-johnson'
        },
        {
          name: 'Prof. Ahmed Benali',
          title: 'Research Director',
          affiliation: 'CNRS, France',
          specialty: 'Sustainable technologies',
          bio: 'Prof. Ahmed Benali is a recognized expert in sustainable technologies and renewable energy. He leads the green technology research team at CNRS.',
          achievements: ['CNRS Silver Medal (2021)', 'EU Expert Consultant', '80+ international patents'],
          talk: 'Green Innovation: Technologies for a Sustainable Future',
          email: 'ahmed.benali@cnrs.fr',
          website: 'https://cnrs.fr/ahmed-benali'
        },
        {
          name: 'Dr. Maria Rodriguez',
          title: 'Chief Engineer',
          affiliation: 'Siemens, Germany',
          specialty: 'Industry 4.0',
          bio: 'Dr. Maria Rodriguez leads Industry 4.0 innovation at Siemens. She is responsible for developing next-generation industrial IoT solutions.',
          achievements: ['Siemens Innovation Award (2023)', 'Digital transformation leader', '120+ industrial projects'],
          talk: 'Digital Transformation: From IoT to Smart Factory',
          email: 'maria.rodriguez@siemens.com',
          website: 'https://siemens.com/maria-rodriguez'
        }
      ],
      actions: {
        contact: 'Contact',
        website: 'Website',
        bio: 'Full Biography'
      }
    }
  };

  const handleContact = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWebsite = (website: string) => {
    window.open(website, '_blank');
  };

  return (
    <section id="speakers" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content[language].subtitle}
            </p>

          </div>
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">

              {content[language].speakers.map((speaker, index) => (
                <div key={index} className="keen-slider__slide">
                  <Card className="text-center h-full mx-2">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {speaker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {speaker.name}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {speaker.title}
                      </p>
                      <p className="text-muted-foreground text-sm mb-2">
                        {speaker.affiliation}
                      </p>
                      <p className="text-sm text-muted-foreground italic mb-4">
                        {speaker.specialty}
                      </p>

                      <div className="space-y-2 mt-auto">
                        <Modal
                          trigger={
                            <Button variant="outline" size="sm" className="w-full">
                              {content[language].actions.bio}
                            </Button>
                          }
                          title={speaker.name}
                        >
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">
                                  {speaker.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <h3 className="text-xl font-semibold">{speaker.name}</h3>
                              <p className="text-primary">{speaker.title}</p>
                              <p className="text-muted-foreground">{speaker.affiliation}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">
                                {language === 'fr' ? 'Biographie' : 'Biography'}
                              </h4>
                              <p className="text-muted-foreground">{speaker.bio}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">
                                {language === 'fr' ? 'Réalisations' : 'Achievements'}
                              </h4>
                              <ul className="space-y-1">
                                {speaker.achievements.map((achievement, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Award className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">
                                {language === 'fr' ? 'Conférence' : 'Talk'}
                              </h4>
                              <p className="text-muted-foreground italic">{speaker.talk}</p>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button onClick={() => handleContact(speaker.email)} className="flex-1">
                                <Mail className="w-4 h-4 mr-2" />
                                {content[language].actions.contact}
                              </Button>
                              <Button variant="outline" onClick={() => handleWebsite(speaker.website)} className="flex-1">
                                <Globe className="w-4 h-4 mr-2" />
                                {content[language].actions.website}
                              </Button>
                            </div>
                          </div>
                        </Modal>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact(speaker.email)}
                            className="flex-1"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            {content[language].actions.contact}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWebsite(speaker.website)}
                            className="flex-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {content[language].actions.website}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>

            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
