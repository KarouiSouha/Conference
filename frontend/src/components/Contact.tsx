import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';

interface ContactProps {
  language: 'fr' | 'en';
}

const Contact: React.FC<ContactProps> = ({ language }) => {
  const content = {
    fr: {
      title: 'Contact & Informations Pratiques',
      venue: {
        title: 'Lieu de la conférence',
        name: 'Yasmine Hammamet',
        address: 'Station touristique Yasmine Hammamet, 8050 Hammamet, Tunisie',
        description: 'Station balnéaire moderne avec toutes les facilités nécessaires'
      },
      accommodation: {
        title: 'Hébergement',
        hotels: [
          { name: 'Four Seasons Hotel Tunis', distance: 'Dans la station' },
          { name: 'Mövenpick Resort & Marine Spa', distance: '2 km' },
          { name: 'Iberostar Averroes', distance: '3 km' }
        ]
      },
      contact: {
        title: 'Contact',
        email: 'contact@site2025.tn',
        phone: '+216 98 954 990',
        organizer: 'Comité d\'organisation SITE 2025'
      }
    },
    en: {
      title: 'Contact & Practical Information',
      venue: {
        title: 'Conference Venue',
        name: 'Yasmine Hammamet',
        address: 'Yasmine Hammamet Tourist Resort, 8050 Hammamet, Tunisia',
        description: 'Modern seaside resort with all necessary facilities'
      },
      accommodation: {
        title: 'Accommodation',
        hotels: [
          { name: 'Four Seasons Hotel Tunis', distance: 'Within the resort' },
          { name: 'Mövenpick Resort & Marine Spa', distance: '2 km' },
          { name: 'Iberostar Averroes', distance: '3 km' }
        ]
      },
      contact: {
        title: 'Contact',
        email: 'contact@site2025.tn',
        phone: '+216 98 954 990',
        organizer: 'SITE 2025 Organizing Committee'
      }
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
         
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {content[language].venue.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-primary mb-2">
                  {content[language].venue.name}
                </h4>
                <p className="text-muted-foreground mb-3">
                  {content[language].venue.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {content[language].venue.description}
                </p>
              </CardContent>
            </Card>
           
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {content[language].accommodation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content[language].accommodation.hotels.map((hotel, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-3">
                      <h4 className="font-medium text-foreground">{hotel.name}</h4>
                      <p className="text-sm text-muted-foreground">{hotel.distance}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
           
            <Card>
              <CardHeader>
                <CardTitle>{content[language].contact.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <div className="text-primary">{content[language].contact.email}</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {language === 'fr' ? 'Téléphone' : 'Phone'}
                    </div>
                    <div className="text-primary">{content[language].contact.phone}</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {language === 'fr' ? 'Organisateur' : 'Organizer'}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {content[language].contact.organizer}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;