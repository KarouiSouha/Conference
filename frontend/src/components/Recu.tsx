import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, FileText, Home, CreditCard, Mail, Globe, Upload, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface RecuProps {
  language: 'fr' | 'en';
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  totalAmount: number;
  accommodationType: string;
  participationType: string;
  paymentMethod: string;
  accompanyingPersons: { name: string; age: number; discount?: number }[];
  onNewRegistration: () => void;
}

const Recu: React.FC<RecuProps> = ({
  language,
  firstName,
  lastName,
  email,
  country,
  totalAmount,
  accommodationType,
  participationType,
  paymentMethod,
  accompanyingPersons,
  onNewRegistration,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const content = {
    fr: {
      title: 'Reçu d\'Inscription SITE 2025',
      issued: 'Émis le',
      participant: 'Participant',
      email: 'Email',
      nationality: 'Nationalité',
      participationType: 'Type de participation',
      accommodation: 'Hébergement',
      paymentMethod: 'Mode de paiement',
      totalAmount: 'Montant total',
      accompanyingPersons: 'Personnes accompagnantes',
      noAccompanying: 'Aucune',
      withArticle: 'Avec article',
      withoutArticle: 'Sans article',
      withAccommodation: 'Avec hébergement (2 nuits)',
      withoutAccommodation: 'Sans hébergement',
      bankTransfer: 'Virement bancaire',
      administrativeOrder: 'Mandat administratif',
      checkPayment: 'Paiement par chèque',
      currency: country === 'Tunisia' ? 'TND' : 'TND',
      discounts: 'Réductions appliquées',
      noDiscounts: 'Aucune réduction',
      newRegistration: 'Nouvelle inscription',
      downloadPDF: 'Télécharger le reçu (PDF)',
      thankYou: 'Merci pour votre inscription !',
      confirmation: 'Votre inscription a été enregistrée avec succès. Vous recevrez une confirmation par e-mail sous peu.',
      organization: 'SITE 2025 - Conférence Internationale',
      contact: 'Contact : contact@site2025.org',
      form: {
        countryOptions: {
          tunisia: 'Tunisie',
          international: 'International'
        }
      }
    },
    en: {
      title: 'SITE 2025 Registration Receipt',
      issued: 'Issued on',
      participant: 'Participant',
      email: 'Email',
      nationality: 'Nationality',
      participationType: 'Participation Type',
      accommodation: 'Accommodation',
      paymentMethod: 'Payment Method',
      totalAmount: 'Total Amount',
      accompanyingPersons: 'Accompanying Persons',
      noAccompanying: 'None',
      withArticle: 'With article',
      withoutArticle: 'Without article',
      withAccommodation: 'With accommodation (2 nights)',
      withoutAccommodation: 'Without accommodation',
      bankTransfer: 'Bank Transfer',
      administrativeOrder: 'Administrative Order',
      checkPayment: 'Check Payment',
      currency: country === 'Tunisia' ? 'TND' : 'TND',
      discounts: 'Applied Discounts',
      noDiscounts: 'No discounts',
      newRegistration: 'New Registration',
      downloadPDF: 'Download Receipt (PDF)',
      thankYou: 'Thank you for your registration!',
      confirmation: 'Your registration has been successfully recorded. You will receive a confirmation email shortly.',
      organization: 'SITE 2025 - International Conference',
      contact: 'Contact: contact@site2025.org',
      form: {
        countryOptions: {
          tunisia: 'Tunisia',
          international: 'International'
        }
      }
    },
  };

  const totalDiscount = accompanyingPersons.reduce((sum, person) => {
    return person.discount ? sum + person.discount : sum;
  }, 0);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank-transfer':
        return content[language].bankTransfer;
      case 'administrative-order':
        return content[language].administrativeOrder;
      case 'check':
        return content[language].checkPayment;
      default:
        return method;
    }
  };

  const currentDate = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    // Hide buttons before capturing
    const buttonContainer = receiptRef.current.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.classList.add('hidden');
    }

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images (e.g., logo)
    });

    // Restore buttons after capturing
    if (buttonContainer) {
      buttonContainer.classList.remove('hidden');
    }

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF, handling multi-page content if necessary
    let heightLeft = imgHeight;
    let position = 10; // Top margin

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight + 10;
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    pdf.save(`SITE2025_Receipt_${firstName}_${lastName}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 font-sans">
      <Card className="border-none shadow-none" ref={receiptRef}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{content[language].title}</h1>
            <p className="text-sm text-gray-600">{content[language].organization}</p>
            <p className="text-sm text-gray-600">{content[language].contact}</p>
          </div>
          <div className="w-24 h-24">
            <img src="/asset/images/Logo.png" alt="SITE 2025 Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Receipt Details */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{content[language].thankYou}</h2>
            <p className="text-sm text-gray-600">
              {content[language].issued}: {currentDate}
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-6">{content[language].confirmation}</p>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-900">{content[language].participant}: </span>
                    <span>{`${firstName} ${lastName}`}</span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-900">{content[language].email}: </span>
                    <span>{email}</span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Globe className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-900">{content[language].nationality}: </span>
                    <span>{country === 'Tunisia' ? content[language].form.countryOptions.tunisia : content[language].form.countryOptions.international}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-900">{content[language].participationType}: </span>
                    <span>{participationType === 'with-article' ? content[language].withArticle : content[language].withoutArticle}</span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Home className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-900">{content[language].accommodation}: </span>
                    <span>{accommodationType === 'with-accommodation' ? content[language].withAccommodation : content[language].withoutAccommodation}</span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="font-semibold text-gray-900">{content[language].paymentMethod}: </span>
                    <span>{getPaymentMethodLabel(paymentMethod)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accompanying Persons */}
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-semibold text-gray-900">{content[language].accompanyingPersons}: </span>
              </div>
              {accompanyingPersons.length > 0 ? (
                <div className="border-t border-gray-200 pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-semibold text-gray-700">Nom</th>
                        <th className="text-left py-2 font-semibold text-gray-700">Âge</th>
                        <th className="text-right py-2 font-semibold text-gray-700">Réduction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accompanyingPersons.map((person, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2">{person.name}</td>
                          <td className="py-2">{person.age} {language === 'fr' ? 'ans' : 'years'}</td>
                          <td className="text-right py-2">
                            {person.discount ? `${person.discount.toFixed(2)} ${content[language].currency}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-600">{content[language].noAccompanying}</p>
              )}
            </div>

            {/* Discounts and Total */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              {totalDiscount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">{content[language].discounts}:</span>
                  <span>{`${totalDiscount.toFixed(2)} ${content[language].currency}`}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>{content[language].totalAmount}:</span>
                <span>{`${totalAmount.toFixed(2)} ${content[language].currency}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-4 text-center">
          <p className="text-xs text-gray-500 mb-4">
            {language === 'fr'
              ? 'Ce reçu est généré automatiquement. Veuillez conserver une copie pour vos archives.'
              : 'This receipt is generated automatically. Please keep a copy for your records.'}
          </p>
          <div className="flex justify-center gap-4 button-container">
            <Button
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {content[language].downloadPDF}
            </Button>
            <Button
              onClick={onNewRegistration}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {content[language].newRegistration}
            </Button>
          </div>
        </div>
      </Card>
      <style jsx>{`
        .hidden {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Recu;