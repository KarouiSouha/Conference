
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MapPin, Users, Baby, Calendar, Info, Building, Phone, Mail } from 'lucide-react';

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
      contactInfo: 'Pour plus d\'informations, veuillez contacter les organisateurs.'
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
      contactInfo: 'For more information, please contact the organizers.'
    }
  };

  const PricingCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
        <CardTitle className="text-xl font-bold flex items-center">
          <CreditCard className="w-6 h-6 mr-3" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );

  interface PriceTableRow {
    label: string;
    tunisia: string;
    international: string;
  }

  const PriceTable = ({ data, title }: { data: PriceTableRow[]; title: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 text-lg">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-700 border-r border-gray-200"></th>
              <th className="text-center p-4 font-semibold text-blue-700 border-r border-gray-200 bg-orange-50">
                {content[language].fromTunisia}
              </th>
              <th className="text-center p-4 font-semibold text-blue-700 bg-orange-100">
                {content[language].fromOtherCountries}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: PriceTableRow, index: number) => (
              <tr key={index} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                <td className="p-4 font-medium text-gray-800 border-r border-gray-200 bg-orange-50">
                  {row.label}
                </td>
                <td className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200">
                  {row.tunisia}
                </td>
                <td className="p-4 text-center font-semibold text-gray-700">
                  {row.international}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const withAccommodationData = [
    {
      label: content[language].academic,
      tunisia: '700 TND',
      international: '450 €'
    },
    {
      label: content[language].student,
      tunisia: '650 TND',
      international: '400 €'
    },
    {
      label: content[language].professional,
      tunisia: '750 TND',
      international: '500 €'
    }
  ];

  const additionalFeesData = [
    {
      label: content[language].adultAccompanying,
      tunisia: `120 TND${content[language].perNight}`,
      international: `80 €${content[language].perNight}`
    },
    {
      label: content[language].singleSupplement,
      tunisia: `25 TND${content[language].perNight}`,
      international: `25 €${content[language].perNight}`
    }
  ];

  const childrenData = [
    {
      label: content[language].childUnder2,
      tunisia: content[language].free,
      international: content[language].free
    },
    {
      label: content[language].childrenWith2Adults,
      tunisia: content[language].discount50,
      international: content[language].discount50
    },
    {
      label: content[language].childrenSeparateRoom,
      tunisia: content[language].discount30,
      international: content[language].discount30
    }
  ];

  return (
    <div className="space-y-8 mb-12">
      {/* Registration Details */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Info className="w-7 h-7 mr-3" />
            {content[language].registrationInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-800">{content[language].checkIn}</p>
                  <p className="text-blue-600 font-medium">{content[language].checkInDate}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-800">{content[language].checkOut}</p>
                  <p className="text-blue-600 font-medium">{content[language].checkOutDate}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 leading-relaxed">
                  <strong>{content[language].withoutAccommodation}:</strong> {content[language].registrationFeeCovers}: <span className="font-bold">450 TND</span>
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>{content[language].withAccommodation}:</strong> {content[language].hotelDetails}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Note:</strong> {content[language].registerNote}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tables */}
      <div className="grid gap-8">
        <PriceTable 
          data={withAccommodationData} 
          title={content[language].withAccommodation}
        />
        
        <PriceTable 
          data={additionalFeesData} 
          title={content[language].additionalFees}
        />
        
        <PriceTable 
          data={childrenData} 
          title={content[language].children}
        />
      </div>

      {/* Additional Services */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800">{content[language].socialEvent}</h4>
            </div>
            <p className="text-sm text-gray-600">100 € / 50 TND</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800">{content[language].airportTransfer}</h4>
            </div>
            <p className="text-sm text-gray-600">{content[language].airportTransferDesc}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <PricingCard title={content[language].paymentInfo}>
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              {content[language].bankDetails}
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Banque:</strong> {content[language].bankName}</p>
                <p><strong>Adresse:</strong> {content[language].address}</p>
                <p><strong>Nom du compte:</strong> {content[language].accountName}</p>
                <p><strong>N° de compte:</strong> {content[language].accountNumber}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Objet du paiement:</strong> {content[language].paymentPurpose}</p>
                <p><strong>SWIFT:</strong> 
                  <Badge variant="outline" className="ml-2">1343117/A</Badge>
                  <a href="#" className="text-blue-600 hover:underline ml-2 text-xs">
                    ({content[language].downloadTaxId})
                  </a>
                </p>
                <p><strong>RNE:</strong>
                  <a href="#" className="text-blue-600 hover:underline ml-2 text-xs">
                    ({content[language].downloadRne})
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                <h5 className="font-semibold text-green-800">Virement bancaire</h5>
              </div>
              <p className="text-xs text-green-700">{content[language].bankTransferDesc}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center mb-2">
                <Building className="w-5 h-5 text-orange-600 mr-2" />
                <h5 className="font-semibold text-orange-800">Bon de commande</h5>
              </div>
              <p className="text-xs text-orange-700">{content[language].adminOrderDesc}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-2">
              {content[language].contactEmail}: 
              <a href="mailto:contact@site-conf.com" className="text-blue-600 hover:underline ml-1 font-medium">
                contact@site-conf.com
              </a>
            </p>
            <p className="text-xs text-gray-600">{content[language].contactInfo}</p>
          </div>
        </div>
      </PricingCard>
    </div>
  );
};

export default PricingInfo;