
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Car, Train, Plane, Hotel, FileText, Globe } from 'lucide-react';

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
        name: 'ISET Bizerte',
        address: 'Route de Tunis Km 7, 7021 Bizerte, Tunisie',
        description: 'Campus moderne équipé de toutes les facilités nécessaires pour accueillir des événements scientifiques internationaux.',
        facilities: ['Amphithéâtres climatisés', 'Wifi haut débit', 'Restauration sur place', 'Parking gratuit', 'Accès handicapés']
      },
      transport: {
        title: 'Comment s\'y rendre',
        plane: {
          title: 'Par avion',
          details: 'Aéroport Tunis-Carthage (60 km) - Liaisons quotidiennes depuis l\'Europe et l\'Afrique'
        },
        train: {
          title: 'Par train',
          details: 'Gare de Bizerte - Liaison directe depuis Tunis (1h30)'
        },
        car: {
          title: 'Par voiture',
          details: 'Autoroute A4 depuis Tunis - Parking gratuit sur le campus'
        }
      },
      accommodation: {
        title: 'Hébergement',
        hotels: [
          {
            name: 'Bizerte Resort',
            stars: 4,
            distance: '5 km du campus',
            price: '80-120€/nuit',
            contact: '+216 72 123 456'
          },
          {
            name: 'Corniche Palace',
            stars: 3,
            distance: '8 km du campus',
            price: '60-90€/nuit',
            contact: '+216 72 789 012'
          },
          {
            name: 'Villa Lassagne',
            stars: 3,
            distance: '10 km du campus',
            price: '50-75€/nuit',
            contact: '+216 72 345 678'
          }
        ]
      },
      visa: {
        title: 'Visa et formalités',
        requirements: [
          'Passeport valide (6 mois minimum)',
          'Visa requis pour certains pays - vérifiez auprès du consulat',
          'Invitation officielle disponible sur demande',
          'Assurance voyage recommandée'
        ]
      }
    },
    en: {
      title: 'Practical Information',
      subtitle: 'Everything you need to know for your visit',
      venue: {
        title: 'Conference Venue',
        name: 'ISET Bizerte',
        address: 'Route de Tunis Km 7, 7021 Bizerte, Tunisia',
        description: 'Modern campus equipped with all necessary facilities to host international scientific events.',
        facilities: ['Air-conditioned auditoriums', 'High-speed WiFi', 'On-site catering', 'Free parking', 'Wheelchair access']
      },
      transport: {
        title: 'How to get there',
        plane: {
          title: 'By plane',
          details: 'Tunis-Carthage Airport (60 km) - Daily connections from Europe and Africa'
        },
        train: {
          title: 'By train',
          details: 'Bizerte Station - Direct connection from Tunis (1h30)'
        },
        car: {
          title: 'By car',
          details: 'A4 Highway from Tunis - Free parking on campus'
        }
      },
      accommodation: {
        title: 'Accommodation',
        hotels: [
          {
            name: 'Bizerte Resort',
            stars: 4,
            distance: '5 km from campus',
            price: '80-120€/night',
            contact: '+216 72 123 456'
          },
          {
            name: 'Corniche Palace',
            stars: 3,
            distance: '8 km from campus',
            price: '60-90€/night',
            contact: '+216 72 789 012'
          },
          {
            name: 'Villa Lassagne',
            stars: 3,
            distance: '10 km from campus',
            price: '50-75€/night',
            contact: '+216 72 345 678'
          }
        ]
      },
      visa: {
        title: 'Visa and formalities',
        requirements: [
          'Valid passport (minimum 6 months)',
          'Visa required for some countries - check with consulate',
          'Official invitation available on request',
          'Travel insurance recommended'
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
                <div className="space-y-2">
                  {content[language].venue.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                      {facility}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3177.8397!2d9.8736!3d37.2744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e6f5b1e6b1d1d1%3A0x1234567890abcdef!2sISET%20Bizerte!5e0!3m2!1sen!2stn!4v1234567890"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            {/* Transport */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Car className="w-5 h-5" />
                  {content[language].transport.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">{content[language].transport.plane.title}</h4>
                    <p className="text-sm text-slate-600">{content[language].transport.plane.details}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Train className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">{content[language].transport.train.title}</h4>
                    <p className="text-sm text-slate-600">{content[language].transport.train.details}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">{content[language].transport.car.title}</h4>
                    <p className="text-sm text-slate-600">{content[language].transport.car.details}</p>
                  </div>
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

            {/* Visa et formalités */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5" />
                  {content[language].visa.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content[language].visa.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                      <p className="text-sm text-slate-600">{requirement}</p>
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
