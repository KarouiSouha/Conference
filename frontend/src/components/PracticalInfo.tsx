import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Hotel } from 'lucide-react';

interface PracticalInfoProps {
  language: 'fr' | 'en';
}

const PracticalInfo: React.FC<PracticalInfoProps> = ({ language }) => {
  const content = {
    fr: {
      title: 'Informations Pratiques',
      subtitle: 'Tout ce que vous devez savoir pour votre venue',
      venue: {
        title: 'Lieu de la conférence',
        name: 'Yasmine Hammamet',
        address: 'Zone Touristique Yasmine Hammamet, 8050 Hammamet, Tunisie',
        description: 'Station balnéaire moderne équipée de toutes les facilités nécessaires pour accueillir des événements scientifiques internationaux.',
        facilities: ['Centres de conférences climatisés', 'Wifi haut débit', 'Restauration sur place', 'Parking gratuit', 'Accès handicapés']
      },
      accommodation: {
        title: 'Hébergement',
        hotels: [
          {
            name: 'Four Seasons Tunis',
            stars: 5,
            distance: '2 km du centre de conférence',
            price: '150-250€/nuit',
            contact: '+216 70 014 000'
          },
          {
            name: 'Laico Hammamet',
            stars: 5,
            distance: '1 km du centre de conférence',
            price: '120-200€/nuit',
            contact: '+216 72 226 500'
          },
          {
            name: 'Hotel Yasmine Beach',
            stars: 4,
            distance: '500 m du centre de conférence',
            price: '80-140€/nuit',
            contact: '+216 72 227 845'
          }
        ]
      }
    },
    en: {
      title: 'Practical Information',
      subtitle: 'Everything you need to know for your visit',
      venue: {
        title: 'Conference Venue',
        name: 'Yasmine Hammamet',
        address: 'Yasmine Hammamet Tourist Zone, 8050 Hammamet, Tunisia',
        description: 'Modern resort area equipped with all necessary facilities to host international scientific events.',
        facilities: ['Air-conditioned conference centers', 'High-speed WiFi', 'On-site catering', 'Free parking', 'Wheelchair access']
      },
      accommodation: {
        title: 'Accommodation',
        hotels: [
          {
            name: 'Four Seasons Tunis',
            stars: 5,
            distance: '2 km from conference center',
            price: '150-250€/night',
            contact: '+216 70 014 000'
          },
          {
            name: 'Laico Hammamet',
            stars: 5,
            distance: '1 km from conference center',
            price: '120-200€/night',
            contact: '+216 72 226 500'
          },
          {
            name: 'Hotel Yasmine Beach',
            stars: 4,
            distance: '500 m from conference center',
            price: '80-140€/night',
            contact: '+216 72 227 845'
          }
        ]
      }
    }
  };

  return (
    <section id="practical-info" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-slate-600">
              {content[language].subtitle}
            </p>
          </div>
         
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Lieu de la conférence */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <MapPin className="w-5 h-5" />
                  {content[language].venue.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{content[language].venue.name}</h3>
                <p className="text-slate-600 mb-3">{content[language].venue.address}</p>
                <p className="text-slate-600 mb-4">{content[language].venue.description}</p>
                <div className="space-y-2 mb-4">
                  {content[language].venue.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                      {facility}
                    </div>
                  ))}
                </div>
               
                {/* Google Maps iframe */}
                <div className="mt-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25698.98557290446!2d10.5428839!3d36.375958649999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd639245c01df5%3A0x87280845697a4150!2sYasmine%20Hammamet!5e0!3m2!1sfr!2stn!4v1749844499440!5m2!1sfr!2stn"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Hotel className="w-5 h-5" />
                  {content[language].accommodation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content[language].accommodation.hotels.map((hotel, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{hotel.name}</h4>
                        <div className="flex">
                          {[...Array(hotel.stars)].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{hotel.distance}</p>
                      <p className="text-sm font-medium text-slate-700 mb-1">{hotel.price}</p>
                      <p className="text-xs text-slate-500">{hotel.contact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticalInfo;
