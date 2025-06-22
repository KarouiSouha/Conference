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
      title: 'Tarification SITE 2025',
      subtitle: 'Informations sur les frais d’inscription et services supplémentaires',
      registrationInfo: 'Informations d’inscription',
      registrationDetails: 'Détails de l’inscription',
      withAccommodation: 'Avec hébergement',
      withoutAccommodation: 'Sans hébergement',
      additionalFees: 'Frais supplémentaires',
      paymentInfo: 'Informations de paiement',
      bankDetails: 'Coordonnées bancaires',
      fromTunisia: 'Depuis la Tunisie',
      fromOtherCountries: 'Depuis d’autres pays',
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
      airportTransferDesc: 'Transfert aéroport (Tunis Carthage vers l’hôtel et vice versa) peut être organisé pour 50 €.',
      checkIn: 'Arrivée',
      checkOut: 'Départ',
      checkInDate: '24 octobre après 12h00',
      checkOutDate: '26 octobre avant 12h00',
      registrationFeeCovers: 'Les frais d’inscription couvrent tous les matériaux de conférence, déjeuners et pauses café.',
      hotelDetails: 'Hébergement en chambre double (partagée avec un autre participant) pendant deux nuits.',
      registerNote: 'Pour inclure un article accepté, au moins un auteur doit s’inscrire et payer avant la date limite.',
      bankName: 'Union Internationale des Banques',
      address: 'Menzel Jemil',
      accountName: 'Association du développement technologique de Bizerte',
      accountNumber: '12202000009300393395',
      paymentPurpose: 'Inscription SITE 2025',
      swift: 'SWIFT',
      taxId: 'N° d’identification fiscale',
      rne: 'Registre National des Entreprises (RNE)',
      downloadBankId: 'Télécharger l’identité bancaire',
      downloadTaxId: 'Télécharger ID fiscal',
      downloadRne: 'Télécharger RNE',
      paymentMethods: 'Méthodes de paiement disponibles',
      bankTransferDesc: 'Payer le montant total sans déduction, tous les frais bancaires à la charge du bénéficiaire. Non remboursable.',
      adminOrderDesc: 'Bon de commande (uniquement pour les universités tunisiennes)',
      contactEmail: 'Envoyez une copie scannée de l’ordre de virement à',
      contactInfo: 'Pour plus d’informations, contactez les organisateurs.',
      mainRegistration: 'Tarifs d’inscription principaux',
      bestValue: 'Meilleur rapport qualité-prix',
      mostPopular: 'Plus populaire',
      includes: 'Inclus',
      priceStartsAt: 'À partir de'
    },
    en: {
      title: 'SITE 2025 Pricing',
      subtitle: 'Information on registration fees and additional services',
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
      airportTransferDesc: 'Airport transfer (Tunis Carthage to hotel and vice versa) can be arranged for 50 €.',
      checkIn: 'Arrival',
      checkOut: 'Departure',
      checkInDate: 'October 24th after 12:00',
      checkOutDate: 'October 26th before 12:00',
      registrationFeeCovers: 'The registration fee covers all conference materials, lunches, and coffee breaks.',
      hotelDetails: 'Hotel full board in double room (shared with another participant) for two nights.',
      registerNote: 'For an accepted paper to be included, at least one author must register and pay before the deadline.',
      bankName: 'Union Internationale des Banques',
      address: 'Menzel Jemil',
      accountName: 'Association du développement technologique de Bizerte',
      accountNumber: '12202000009300393395',
      paymentPurpose: 'Registration to SITE 2025',
      swift: 'SWIFT',
      taxId: 'Tax identification number',
      rne: 'National Enterprise Register (RNE)',
      downloadBankId: 'Download bank identity',
      downloadTaxId: 'Download Tax ID',
      downloadRne: 'Download RNE',
      paymentMethods: 'Available Payment Methods',
      bankTransferDesc: 'Pay full amount without deduction, all bank charges paid by beneficiary. Non-refunded.',
      adminOrderDesc: 'Administrative Order (only for Tunisian universities)',
      contactEmail: 'Please send a scanned copy of the payment order to',
      contactInfo: 'For more information, contact the organizers.',
      mainRegistration: 'Main Registration Rates',
      bestValue: 'Best Value',
      mostPopular: 'Most Popular',
      includes: 'Includes',
      priceStartsAt: 'Starting from'
    }
  };

  const PriceDisplay = ({
    tunisiaPrice,
    internationalPrice,
    perNight,
  }: {
    tunisiaPrice: string;
    internationalPrice: string;
    perNight?: boolean;
  }) => (
    <>
      <div className="mb-3 p-3 bg-white rounded-lg border border-orange-200">
        <div className="flex items-center justify-center mb-1">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-xs font-semibold text-slate-600">{content[language].fromTunisia}</span>
        </div>
        <div className="text-xl font-bold text-orange-600">{tunisiaPrice}</div>
        {perNight && <div className="text-xs text-slate-500">{content[language].perNight}</div>}
      </div>
      <div className="p-3 bg-white rounded-lg border border-blue-200">
        <div className="flex items-center justify-center mb-1">
          <Globe className="w-3 h-3 text-blue-500 mr-2" />
          <span className="text-xs font-semibold text-slate-600">{content[language].fromOtherCountries}</span>
        </div>
        <div className="text-xl font-bold text-blue-600">{internationalPrice}</div>
        {perNight && <div className="text-xs text-slate-500">{content[language].perNight}</div>}
      </div>
    </>
  );

  const PricingCard = ({
    title,
    icon: Icon,
    tunisiaPrice,
    internationalPrice,
    isPopular = false,
    isBestValue = false,
    description,
    features = [],
  }: {
    title: string;
    icon: React.ElementType;
    tunisiaPrice: string;
    internationalPrice: string;
    isPopular?: boolean;
    isBestValue?: boolean;
    description?: string;
    features?: string[];
  }) => (
    <Card className={`relative border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isPopular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
          <Star className="w-4 h-4 inline mr-1" />
          {content[language].mostPopular}
        </div>
      )}
      {isBestValue && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1">
            {content[language].bestValue}
          </Badge>
        </div>
      )}
      <CardHeader className={`text-center pb-4 ${isPopular ? 'pt-12' : 'pt-6'} bg-slate-50`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
        {description && <p className="text-sm text-slate-600 px-2">{description}</p>}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <PriceDisplay tunisiaPrice={tunisiaPrice} internationalPrice={internationalPrice} />
          {features.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-slate-700 text-sm">{content[language].includes}:</h5>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
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
    tunisiaPrice,
    internationalPrice,
    perNight,
  }: {
    title: string;
    icon: React.ElementType;
    price?: string;
    description?: string;
    tunisiaPrice?: string;
    internationalPrice?: string;
    perNight?: boolean;
  }) => (
    <Card className="border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h4 className="font-bold text-slate-800 text-lg mb-3">{title}</h4>
        {price && <div className="text-xl font-bold text-blue-600 mb-3">{price}</div>}
        {(tunisiaPrice && internationalPrice) && (
          <PriceDisplay tunisiaPrice={tunisiaPrice} internationalPrice={internationalPrice} perNight={perNight} />
        )}
        {description && <p className="text-sm text-slate-600 leading-relaxed">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <section id="pricing-info" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-slate-600">{content[language].subtitle}</p>
          </div>

          {/* Registration and Payment Information */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Info className="w-5 h-5" />
                  {content[language].registrationInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-slate-700">{content[language].checkIn}</p>
                      <p className="text-sm text-slate-600">{content[language].checkInDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-slate-700">{content[language].checkOut}</p>
                      <p className="text-sm text-slate-600">{content[language].checkOutDate}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-700 mb-2">{content[language].withoutAccommodation}</h4>
                    <p className="text-sm text-slate-600">{content[language].registrationFeeCovers}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">450 TND</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-700 mb-2">{content[language].withAccommodation}</h4>
                    <p className="text-sm text-slate-600">{content[language].hotelDetails}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CreditCard className="w-5 h-5" />
                  {content[language].paymentInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-700 mb-2">{content[language].bankDetails}</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-semibold">Banque:</span>
                        <span>{content[language].bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Adresse:</span>
                        <span>{content[language].address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Nom du compte:</span>
                        <span>{content[language].accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">N° de compte:</span>
                        <span className="font-mono">{content[language].accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">SWIFT:</span>
                        <Badge variant="outline" className="text-xs">1343117/A</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-700 mb-2">{content[language].paymentMethods}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-slate-600">{content[language].bankTransferDesc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-slate-600">{content[language].adminOrderDesc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      {content[language].contactEmail}{' '}
                      <a href="mailto:contact@site-conf.com" className="text-blue-600 hover:underline">
                        contact@site-conf.com
                      </a>
                    </p>
                    <p className="text-sm text-slate-600 mt-2">{content[language].contactInfo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Registration Pricing */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">{content[language].mainRegistration}</h2>
              <p className="text-lg text-slate-600">{content[language].withAccommodation}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <PricingCard
                title={content[language].student}
                icon={GraduationCap}
                tunisiaPrice="650 TND"
                internationalPrice="400 €"
                isBestValue
                features={[
                  content[language].registrationFeeCovers,
                  content[language].hotelDetails,
                  language === 'fr' ? 'Accès aux sessions spéciales étudiants' : 'Access to special student sessions',
                ]}
              />
              <PricingCard
                title={content[language].academic}
                icon={UserCheck}
                tunisiaPrice="700 TND"
                internationalPrice="450 €"
                isPopular
                features={[
                  content[language].registrationFeeCovers,
                  content[language].hotelDetails,
                  language === 'fr' ? 'Accès réseau académique' : 'Access to academic networking',
                ]}
              />
              <PricingCard
                title={content[language].professional}
                icon={Briefcase}
                tunisiaPrice="750 TND"
                internationalPrice="500 €"
                features={[
                  content[language].registrationFeeCovers,
                  content[language].hotelDetails,
                  language === 'fr' ? 'Sessions networking entreprises' : 'Corporate networking sessions',
                ]}
              />
            </div>
          </div>

          {/* Additional Services */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">{content[language].additionalFees}</h2>
              <p className="text-lg text-slate-600">{language === 'fr' ? 'Services supplémentaires disponibles' : 'Additional services available'}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceCard
                title={language === 'fr' ? 'Accompagnant adulte' : 'Adult companion'}
                icon={Users}
                tunisiaPrice="120 TND"
                internationalPrice="80 €"
                perNight
              />
              <ServiceCard
                title={language === 'fr' ? 'Supplément chambre individuelle' : 'Single room supplement'}
                icon={Building}
                tunisiaPrice="25 TND"
                internationalPrice="25 €"
                perNight
              />
              <ServiceCard
                title={language === 'fr' ? 'Événement social' : 'Social Event'}
                icon={Users}
                tunisiaPrice="50 TND"
                internationalPrice="100 €"
                description={language === 'fr' ? 'Soirée de gala et networking' : 'Gala dinner and networking'}
              />
              <ServiceCard
                title={language === 'fr' ? 'Transfert aéroport' : 'Airport Transfer'}
                icon={MapPin}
                price="50 €"
                description={language === 'fr' ? 'Transfert Tunis Carthage vers hôtel' : 'Transfer from Tunis Carthage to hotel'}
              />
            </div>
          </div>

          {/* Children Pricing */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">{content[language].children}</h2>
              <p className="text-lg text-slate-600">{language === 'fr' ? 'Tarifs préférentiels pour les familles' : 'Preferential rates for families'}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <ServiceCard
                title={content[language].childUnder2}
                icon={Baby}
                price={content[language].free}
                description={language === 'fr' ? 'Aucun frais pour les tout-petits' : 'No fees for toddlers'}
              />
              <ServiceCard
                title={content[language].childrenWith2Adults}
                icon={Users}
                price={content[language].discount50}
                description={language === 'fr' ? 'Avec deux adultes inscrits' : 'With two registered adults'}
              />
              <ServiceCard
                title={content[language].childrenSeparateRoom}
                icon={UserCheck}
                price={content[language].discount30}
                description={language === 'fr' ? 'Chambre séparée ou avec un adulte' : 'Separate room or with one adult'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingInfo;