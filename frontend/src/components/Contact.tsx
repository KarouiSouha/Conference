import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Mail, Phone, Users, Eye, X } from 'lucide-react';

interface ContactProps {
  language: 'fr' | 'en';
}

const VirtualTour: React.FC<{ language: 'fr' | 'en'; onClose: () => void }> = ({ language, onClose }) => {
  const [currentView, setCurrentView] = useState(0);
  
  const views = {
    fr: [
      {
        title: 'Hall d\'entrée principal',
        description: 'Vue panoramique de l\'entrée de Yasmine Hammamet avec ses jardins luxuriants',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'
      },
      {
        title: 'Salle de conférence principale',
        description: 'Espace moderne équipé des dernières technologies pour les présentations',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
      },
      {
        title: 'Espace de networking',
        description: 'Zone dédiée aux échanges et pauses café avec vue sur la mer',
        image: 'https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800&h=600&fit=crop'
      },
      {
        title: 'Terrasse panoramique',
        description: 'Vue spectaculaire sur la baie de Hammamet et la Méditerranée',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      }
    ],
    en: [
      {
        title: 'Main Entrance Hall',
        description: 'Panoramic view of Yasmine Hammamet entrance with lush gardens',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'
      },
      {
        title: 'Main Conference Room',
        description: 'Modern space equipped with latest technology for presentations',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
      },
      {
        title: 'Networking Area',
        description: 'Dedicated space for exchanges and coffee breaks with sea view',
        image: 'https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800&h=600&fit=crop'
      },
      {
        title: 'Panoramic Terrace',
        description: 'Spectacular view over Hammamet Bay and the Mediterranean',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-bold text-slate-800">
            {language === 'fr' ? 'Visite Virtuelle 360°' : '360° Virtual Tour'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-6">
            <img
              src={views[language][currentView].image}
              alt={views[language][currentView].title}
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-xl font-bold mb-1">{views[language][currentView].title}</h4>
              <p className="text-sm opacity-90">{views[language][currentView].description}</p>
            </div>
            
            {/* Navigation dots */}
            <div className="absolute top-4 right-4 flex gap-2">
              {views[language].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentView(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentView === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {views[language].map((view, index) => (
              <button
                key={index}
                onClick={() => setCurrentView(index)}
                className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                  currentView === index 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'hover:scale-105'
                }`}
              >
                <img
                  src={view.image}
                  alt={view.title}
                  className="w-full h-20 object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-1 left-1 right-1">
                  <p className="text-white text-xs font-medium truncate">
                    {view.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact: React.FC<ContactProps> = ({ language }) => {
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  const content = {
    fr: {
      title: 'Contact & Informations Pratiques',
      venue: {
        title: 'Lieu de la conférence',
        name: 'Yasmine Hammamet',
        address: 'Station touristique Yasmine Hammamet, 8050 Hammamet, Tunisie',
        description: 'Station balnéaire moderne avec toutes les facilités nécessaires',
        virtualTour: 'Visite virtuelle 360°'
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
        description: 'Modern seaside resort with all necessary facilities',
        virtualTour: '360° Virtual Tour'
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
    <>
      <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              {content[language].title}
            </h2>
           
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Card Lieu avec Visite Virtuelle */}
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
                    <p className="text-sm text-slate-500 italic mb-4">
                      {content[language].venue.description}
                    </p>
                    
                    {/* Bouton Visite Virtuelle */}
                    <button
                      onClick={() => setShowVirtualTour(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{content[language].venue.virtualTour}</span>
                    </button>
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
      
      {/* Modal Visite Virtuelle */}
      {showVirtualTour && (
        <VirtualTour 
          language={language} 
          onClose={() => setShowVirtualTour(false)} 
        />
      )}
    </>
  );
};

export default Contact;