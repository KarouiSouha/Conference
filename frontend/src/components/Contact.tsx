import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Mail, Phone, Users } from 'lucide-react';

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
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
         
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card Lieu */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-slate-800">{content[language].venue.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-xl text-blue-900 mb-2">
                    {content[language].venue.name}
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    {content[language].venue.address}
                  </p>
                  <p className="text-sm text-slate-500 italic">
                    {content[language].venue.description}
                  </p>
                </div>
              </CardContent>
            </Card>
           
            {/* Card Hébergement */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-slate-800">{content[language].accommodation.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content[language].accommodation.hotels.map((hotel, index) => (
                    <div key={index} className="group/item hover:bg-slate-50 p-3 rounded-lg transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-slate-800 group-hover/item:text-emerald-700 transition-colors duration-200">
                            {hotel.name}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">{hotel.distance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
           
            {/* Card Contact */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-slate-800">{content[language].contact.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="group/contact hover:bg-slate-50 p-3 rounded-lg transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Email</span>
                    </div>
                    <a href={`mailto:${content[language].contact.email}`} 
                       className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 text-sm">
                      {content[language].contact.email}
                    </a>
                  </div>
                  
                  <div className="group/contact hover:bg-slate-50 p-3 rounded-lg transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {language === 'fr' ? 'Téléphone' : 'Phone'}
                      </span>
                    </div>
                    <a href={`tel:${content[language].contact.phone}`}
                       className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 text-sm">
                      {content[language].contact.phone}
                    </a>
                  </div>
                  
                  <div className="group/contact hover:bg-slate-50 p-3 rounded-lg transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {language === 'fr' ? 'Organisateur' : 'Organizer'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {content[language].contact.organizer}
                    </p>
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