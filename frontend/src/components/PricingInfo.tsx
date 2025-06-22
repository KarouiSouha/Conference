import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MapPin, Users, Baby, Calendar, Info, Building, Phone, Mail, CheckCircle, Star, Globe, GraduationCap, Briefcase, UserCheck } from 'lucide-react';

interface PricingInfoProps {
  language: 'fr' | 'en';
}

const PricingInfo: React.FC<PricingInfoProps> = ({ language = 'fr' }) => {
  const content = {
    fr: {
      registrationInfo: 'Informations d\'inscription',
      registrationDetails: 'Détails de l\'inscription',
      withAccommodation: 'Avec hébergement',
      withoutAccommodation: 'Sans hébergement',
      additionalFees: 'Frais supplémentaires',
      paymentInfo: 'Informations de paiement',
      bankDetails: 'Coordonnées bancaires',
      fromTunisia: 'Depuis la Tunisie',
      fromOtherCountries: 'Depuis d\'autres pays',
      academic: 'Académique',
      student: 'Étudiant',
      professional: 'Professionnel',
      adultAccompanying: 'Personne accompagnante adulte',
      singleSupplement: 'Supplément chambre individuelle',
      children: 'Enfants',
      childUnder2: 'Enfant < 2 ans',
      childrenWith2Adults: 'Enfants < 12 ans avec 2 adultes',
      childrenSeparateRoom: 'Enfants < 12 ans en chambre séparée ou avec 1 adulte',
      free: 'Gratuit',
      discount50: '50% de réduction',
      discount30: '30% de réduction',
      perNight: '/nuit',
      socialEvent: 'Événement social',
      airportTransfer: 'Transfert aéroport',
      airportTransferDesc: 'Transfert aéroport (Tunis Carthage vers l\'hôtel et vice versa) peut être organisé par les organisateurs pour 50 €.',
      checkIn: 'Arrivée (check-in)',
      checkOut: 'Départ (check-out)',
      checkInDate: '24 octobre après 12h00',
      checkOutDate: '26 octobre avant 12h00',
      registrationFeeCovers: 'Les frais d\'inscription couvrent tous les matériaux de conférence, déjeuners et pauses café',
      hotelDetails: 'Hébergement en chambre double (partagée avec un autre participant) pendant deux nuits.',
      registerNote: 'Pour l\'inclusion d\'un article accepté dans la conférence, au moins un auteur de l\'article doit s\'inscrire au congrès et payer les frais avant la date limite.',
      bankName: 'Union Internationale des Banques',
      address: 'Menzel Jemil',
      accountName: 'Association du développement technologique de Bizerte',
      accountNumber: '12202000009300393395',
      paymentPurpose: 'Registration to SITE 2025',
      swift: 'SWIFT',
      taxId: 'N° d\'identification fiscale',
      rne: 'Registre National des Entreprises (RNE)',
      downloadBankId: 'télécharger l\'identité bancaire',
      downloadTaxId: 'télécharger ID fiscal',
      downloadRne: 'télécharger RNE',
      paymentMethods: 'Méthodes de paiement disponibles',
      bankTransferDesc: 'Payer le montant total sans déduction, tous les frais bancaires payés par le bénéficiaire. Le paiement ne peut pas être remboursé.',
      adminOrderDesc: 'Bon de commande (uniquement pour les universités tunisiennes)',
      contactEmail: 'Veuillez envoyer une copie scannée de l\'ordre de virement bancaire à',
      contactInfo: 'Pour plus d\'informations, veuillez contacter les organisateurs.',
      mainRegistration: 'Tarifs d\'inscription principaux',
      bestValue: 'Meilleur choix',
      mostPopular: 'Plus populaire',
      includes: 'Inclus',
      priceStartsAt: 'À partir de'
    },
    en: {
      registrationInfo: 'Registration Information',
      registrationDetails: 'Registration Details',
      withAccommodation: 'With Accommodation',
      withoutAccommodation: 'Without Accommodation',
      additionalFees: 'Additional Fees',
      paymentInfo: 'Payment Information',
      bankDetails: 'Bank Details',
      fromTunisia: 'From Tunisia',
      fromOtherCountries: 'From other countries',
      academic: 'Academic',
      student: 'Student',
      professional: 'Professional',
      adultAccompanying: 'Adult accompanying person',
      singleSupplement: 'Single supplement',
      children: 'Children',
      childUnder2: 'Child < 2 years',
      childrenWith2Adults: 'Children < 12 years with 2 adults',
      childrenSeparateRoom: 'Children < 12 years in a separate room or with a single adult',
      free: 'Free',
      discount50: '50% discount',
      discount30: '30% discount',
      perNight: '/night',
      socialEvent: 'Social Event',
      airportTransfer: 'Airport Transfer',
      airportTransferDesc: 'Airport transfer (Tunis Carthage Airport to hotel and vice versa) can be arranged by the organizers for a fee of 50 €.',
      checkIn: 'Arrival (check-in)',
      checkOut: 'Departure (check-out)',
      checkInDate: 'October 24th after 12:00',
      checkOutDate: 'October 26th before 12:00',
      registrationFeeCovers: 'The registration fee covers all conference materials, lunches and coffee breaks',
      hotelDetails: 'Hotel full boarding in double room (shared with another participant) during two nights.',
      registerNote: 'For the inclusion of an accepted paper in the conference, at least one author of the paper must register for the congress and pay the fee before the deadline.',
      bankName: 'Union Internationale des Banques',
      address: 'Menzel Jemil',
      accountName: 'Association du développement technologique de Bizerte',
      accountNumber: '12202000009300393395',
      paymentPurpose: 'Registration to SITE 2025',
      swift: 'SWIFT',
      taxId: 'Tax identification number',
      rne: 'National Enterprise Register (RNE)',
      downloadBankId: 'download bank identity',
      downloadTaxId: 'download Tax ID',
      downloadRne: 'download RNE',
      paymentMethods: 'Available Payment Methods',
      bankTransferDesc: 'Pay full amount without any deduction and all bank charge paid by beneficiary. Payment can\'t be refunded.',
      adminOrderDesc: 'Administrative Order (Only for Tunisia Universities)',
      contactEmail: 'Please send a scanned copy of the payment Banking Transfer Order to',
      contactInfo: 'For more information, please contact the organizers.',
      mainRegistration: 'Main Registration Rates',
      bestValue: 'Best Value',
      mostPopular: 'Most Popular',
      includes: 'Includes',
      priceStartsAt: 'Starting from'
    }
  };

  const PricingCard = ({ 
    title, 
    icon: Icon, 
    tunisiaPrice, 
    internationalPrice, 
    isPopular = false,
    isBestValue = false,
    className = "",
    description,
    features = []
  }: { 
    title: string; 
    icon: React.ElementType;
    tunisiaPrice: string;
    internationalPrice: string;
    isPopular?: boolean;
    isBestValue?: boolean;
    className?: string;
    description?: string;
    features?: string[];
  }) => (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${className} ${
      isPopular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'shadow-lg'
    }`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
            <Star className="w-4 h-4 inline mr-1" />
            {content[language].mostPopular}
          </div>
        </div>
      )}
      {isBestValue && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1">
            {content[language].bestValue}
          </Badge>
        </div>
      )}
      
      <CardHeader className={`text-center pb-4 ${isPopular ? 'pt-12' : 'pt-6'} bg-gradient-to-br from-slate-50 to-gray-100`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 mb-2">{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-600 px-2">{description}</p>
        )}
      </CardHeader>
      
      <CardContent className="p-6 bg-white">
        <div className="space-y-6">
          {/* Tunisia Price */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 mr-2"></div>
              <span className="font-semibold text-gray-700">{content[language].fromTunisia}</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{tunisiaPrice}</div>
          </div>
          
          {/* International Price */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Globe className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-semibold text-gray-700">{content[language].fromOtherCountries}</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{internationalPrice}</div>
          </div>
          
          {/* Features */}
          {features.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-700 text-sm">{content[language].includes}:</h5>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ServiceCard = ({ 
    title, 
    icon: Icon, 
    price, 
    description, 
    gradient = "from-purple-50 to-pink-50",
    iconColor = "text-purple-600",
    iconBg = "bg-purple-100"
  }: { 
    title: string; 
    icon: React.ElementType;
    price: string;
    description: string;
    gradient?: string;
    iconColor?: string;
    iconBg?: string;
  }) => (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${gradient} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-lg mb-2">{title}</h4>
            <div className="text-2xl font-bold text-gray-900 mb-2">{price}</div>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-12 mb-12 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          SITE 2025 - {content[language].registrationInfo}
        </h1>
        <p className="text-gray-600 text-lg">
          {content[language].registerNote}
        </p>
      </div>

      {/* Registration Details and Payment Information */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Registration Information */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Info className="w-8 h-8 mr-4" />
              {content[language].registrationInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <Calendar className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{content[language].checkIn}</p>
                    <p className="text-blue-600 font-semibold">{content[language].checkInDate}</p>
                  </div>
                </div>
                <div className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <Calendar className="w-8 h-8 text-purple-600 mr-4" />
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{content[language].checkOut}</p>
                    <p className="text-purple-600 font-semibold">{content[language].checkOutDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2 text-lg">{content[language].withoutAccommodation}</h4>
                  <p className="text-green-700 leading-relaxed">
                    {content[language].registrationFeeCovers}
                  </p>
                  <div className="mt-3 text-2xl font-bold text-green-600">450 TND</div>
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2 text-lg">{content[language].withAccommodation}</h4>
                  <p className="text-blue-700 leading-relaxed">
                    {content[language].hotelDetails}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8">
            <CardTitle className="text-2xl font-bold flex items-center">
              <CreditCard className="w-8 h-8 mr-4" />
              {content[language].paymentInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                  <Building className="w-6 h-6 mr-3" />
                  {content[language].bankDetails}
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Banque:</span>
                    <span className="text-gray-600">{content[language].bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Adresse:</span>
                    <span className="text-gray-600">{content[language].address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Nom du compte:</span>
                    <span className="text-gray-600">{content[language].accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">N° de compte:</span>
                    <span className="text-gray-600 font-mono">{content[language].accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">SWIFT:</span>
                    <Badge variant="outline" className="text-xs">1343117/A</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                    <h5 className="font-bold text-green-800">Virement bancaire</h5>
                  </div>
                  <p className="text-sm text-green-700 leading-relaxed">{content[language].bankTransferDesc}</p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-3">
                    <Building className="w-6 h-6 text-orange-600 mr-3" />
                    <h5 className="font-bold text-orange-800">Bon de commande</h5>
                  </div>
                  <p className="text-sm text-orange-700 leading-relaxed">{content[language].adminOrderDesc}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-6 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-700 mb-2">
                  {content[language].contactEmail}: 
                  <a href="mailto:contact@site-conf.com" className="text-blue-600 hover:underline ml-1 font-semibold">
                    contact@site-conf.com
                  </a>
                </p>
                <p className="text-sm text-gray-600">{content[language].contactInfo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Registration Pricing */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{content[language].mainRegistration}</h2>
          <p className="text-gray-600 text-lg">{content[language].withAccommodation}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Student Card */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg border-0 bg-white">
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1">
                {content[language].bestValue}
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-slate-50 to-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">{content[language].student}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                {/* Tunisia Price */}
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-semibold text-gray-700 text-sm">{content[language].fromTunisia}</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">650 TND</div>
                </div>
                
                {/* International Price */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="font-semibold text-gray-700 text-sm">{content[language].fromOtherCountries}</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">400 €</div>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-700 text-sm">{content[language].includes}:</h5>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{content[language].registrationFeeCovers}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{content[language].hotelDetails}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Accès aux sessions spéciales étudiants</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Card */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg border-0 bg-white ring-2 ring-blue-500 shadow-xl scale-105">
            <div className="absolute top-0 left-0 right-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                <Star className="w-4 h-4 inline mr-1" />
                {content[language].mostPopular}
              </div>
            </div>
            
            <CardHeader className="text-center pb-4 pt-12 bg-gradient-to-br from-slate-50 to-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">{content[language].academic}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                {/* Tunisia Price */}
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-semibold text-gray-700 text-sm">{content[language].fromTunisia}</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">700 TND</div>
                </div>
                
                {/* International Price */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="font-semibold text-gray-700 text-sm">{content[language].fromOtherCountries}</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">450 €</div>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-700 text-sm">{content[language].includes}:</h5>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{content[language].registrationFeeCovers}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{content[language].hotelDetails}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Accès réseau académique</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Card */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg border-0 bg-white">
            <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-slate-50 to-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">{content[language].professional}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                {/* Tunisia Price */}
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-semibold text-gray-700 text-sm">{content[language].fromTunisia}</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">750 TND</div>
                </div>
                
                {/* International Price */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="font-semibold text-gray-700 text-sm">{content[language].fromOtherCountries}</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">500 €</div>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-700 text-sm">{content[language].includes}:</h5>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{content[language].registrationFeeCovers}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{content[language].hotelDetails}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Sessions networking entreprises</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Services */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{content[language].additionalFees}</h2>
          <p className="text-gray-600 text-lg">Services supplémentaires disponibles</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Adult Accompanying */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-3">{content[language].adultAccompanying}</h4>
                
                {/* Tunisia Price */}
                <div className="mb-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-xs font-semibold text-gray-600">Tunisie</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">120 TND</div>
                  <div className="text-xs text-gray-500">{content[language].perNight}</div>
                </div>
                
                {/* International Price */}
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-1">
                    <Globe className="w-3 h-3 text-blue-500 mr-2" />
                    <span className="text-xs font-semibold text-gray-600">International</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">80 €</div>
                  <div className="text-xs text-gray-500">{content[language].perNight}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Single Supplement */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-3">{content[language].singleSupplement}</h4>
                
                {/* Tunisia Price */}
                <div className="mb-3 p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-xs font-semibold text-gray-600">Tunisie</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">25 TND</div>
                  <div className="text-xs text-gray-500">{content[language].perNight}</div>
                </div>
                
                {/* International Price */}
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center justify-center mb-1">
                    <Globe className="w-3 h-3 text-blue-500 mr-2" />
                    <span className="text-xs font-semibold text-gray-600">International</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">25 €</div>
                  <div className="text-xs text-gray-500">{content[language].perNight}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Social Event */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-3">{content[language].socialEvent}</h4>
                
                {/* Tunisia Price */}
                <div className="mb-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-xs font-semibold text-gray-600">Tunisie</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">50 TND</div>
                </div>
                
                {/* International Price */}
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-1">
                    <Globe className="w-3 h-3 text-blue-500 mr-2" />
                    <span className="text-xs font-semibold text-gray-600">International</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">100 €</div>
                </div>
                
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">Soirée de gala et networking</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Airport Transfer */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-3">{content[language].airportTransfer}</h4>
                
                {/* Unified Price */}
                <div className="p-4 bg-white rounded-lg border border-orange-200 mb-3">
                  <div className="text-2xl font-bold text-orange-600">50 €</div>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed">
                  Transfert aéroport (Tunis Carthage vers l'hôtel et vice versa) peut être organisé par les organisateurs pour 50 €.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Children Pricing */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{content[language].children}</h2>
          <p className="text-gray-600 text-lg">Tarifs préférentiels pour les familles</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Baby className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">{content[language].childUnder2}</h4>
              <div className="text-3xl font-bold text-green-600 mb-2">{content[language].free}</div>
              <p className="text-sm text-gray-600">Aucun frais pour les tout-petits</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">{content[language].childrenWith2Adults}</h4>
              <div className="text-3xl font-bold text-blue-600 mb-2">{content[language].discount50}</div>
              <p className="text-sm text-gray-600">Avec deux adultes inscrits</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">{content[language].childrenSeparateRoom}</h4>
              <div className="text-3xl font-bold text-purple-600 mb-2">{content[language].discount30}</div>
              <p className="text-sm text-gray-600">Chambre séparée ou avec un adulte</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingInfo;