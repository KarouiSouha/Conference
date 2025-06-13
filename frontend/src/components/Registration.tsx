import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building, Mail, Phone, FileText, CreditCard, Upload, CheckCircle } from 'lucide-react';

interface RegistrationProps {
  language: 'fr' | 'en';
}

// Composants définis en dehors pour éviter la re-création
const FormSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  icon?: React.ElementType;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type = "text", icon: Icon, required = false, value, onChange, ...props }) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-400" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="h-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
      required={required}
      {...props}
    />
  </div>
);

interface RadioOptionProps {
  value: string;
  id: string;
  label: string;
  description?: string;
  isSelected: boolean;
}

const RadioOption: React.FC<RadioOptionProps> = ({ value, id, label, description, isSelected }) => (
  <div className="relative">
    <div className={`
      border rounded-lg p-3 cursor-pointer transition-colors
      ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
    `}>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value={value} id={id} />
        <div>
          <Label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Registration: React.FC<RegistrationProps> = ({ language = 'fr' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    establishment: '',
    title: '',
    email: '',
    phone: '',
    participationType: '',
    hasAccompanying: '',
    accompanyingDetails: '',
    accommodationType: '',
    paymentMethod: '',
    paymentProof: null as File | null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const content = {
    fr: {
      title: 'Inscription SITE 2025',
      subtitle: 'Rejoignez la communauté scientifique internationale',
      personalInfo: 'Informations personnelles',
      participation: 'Type de participation',
      payment: 'Paiement & Hébergement',
      steps: ['Informations', 'Participation', 'Paiement'],
      form: {
        lastName: 'Nom de famille',
        firstName: 'Prénom',
        establishment: 'Établissement / Organisation',
        title: 'Fonction / Titre',
        email: 'Adresse e-mail',
        phone: 'Numéro de téléphone',
        participationWithoutArticle: 'Participation sans soumission d\'article',
        participationWithArticle: 'Participation avec soumission d\'article',
        withAccompanying: 'Avec personne accompagnante',
        yes: 'Oui',
        no: 'Non',
        accompanyingDetails: 'Détails des accompagnateurs (noms et âges)',
        registrationFees: 'Frais d\'inscription',
        withoutAccommodation: 'Sans hébergement : 50€',
        withAccommodation: 'Avec hébergement : 120€ (2 nuits incluses)',
        bankTransfer: 'Virement bancaire',
        administrativeOrder: 'Mandat administratif',
        checkPayment: 'Paiement par chèque',
        paymentProof: 'Justificatif de paiement',
        submit: 'Finaliser l\'inscription',
        next: 'Suivant',
        previous: 'Précédent'
      },
      success: 'Inscription envoyée avec succès!',
      successMessage: 'Votre inscription a été enregistrée. Nous vous contacterons prochainement.'
    },
    en: {
      title: 'SITE 2025 Registration',
      subtitle: 'Join the international scientific community',
      personalInfo: 'Personal Information',
      participation: 'Participation Type',
      payment: 'Payment & Accommodation',
      steps: ['Information', 'Participation', 'Payment'],
      form: {
        lastName: 'Last Name',
        firstName: 'First Name',
        establishment: 'Institution / Organization',
        title: 'Position / Title',
        email: 'Email Address',
        phone: 'Phone Number',
        participationWithoutArticle: 'Participation without article submission',
        participationWithArticle: 'Participation with article submission',
        withAccompanying: 'With accompanying person',
        yes: 'Yes',
        no: 'No',
        accompanyingDetails: 'Accompanying persons details (names and ages)',
        registrationFees: 'Registration Fees',
        withoutAccommodation: 'Without accommodation: 50€',
        withAccommodation: 'With accommodation: 120€ (2 nights included)',
        bankTransfer: 'Bank Transfer',
        administrativeOrder: 'Administrative Order',
        checkPayment: 'Check Payment',
        paymentProof: 'Payment Proof',
        submit: 'Complete Registration',
        next: 'Next',
        previous: 'Previous'
      },
      success: 'Registration submitted successfully!',
      successMessage: 'Your registration has been recorded. We will contact you soon.'
    }
  };

  // Fonctions de mise à jour mémorisées
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('Registration form submitted:', formData);
    setIsSubmitted(true);
  }, [formData]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, paymentProof: file }));
  }, []);

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {content[language].success}
              </h2>
              <p className="text-gray-600 mb-6">
                {content[language].successMessage}
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Nouvelle inscription
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {content[language].steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
            ${currentStep > index + 1 
              ? 'bg-green-500 text-white' 
              : currentStep === index + 1 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-500'
            }
          `}>
            {currentStep > index + 1 ? '✓' : index + 1}
          </div>
          <span className={`ml-2 text-sm font-medium ${currentStep === index + 1 ? 'text-blue-600' : 'text-gray-500'}`}>
            {step}
          </span>
          {index < content[language].steps.length - 1 && (
            <div className={`w-12 h-px mx-4 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {content[language].title}
            </h1>
            <p className="text-sm text-gray-600">
              {content[language].subtitle}
            </p>
          </div>

          <StepIndicator />

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <FormSection icon={User} title={content[language].personalInfo}>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    id="lastName"
                    label={content[language].form.lastName}
                    icon={User}
                    required
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('lastName', e.target.value)}
                  />
                  <InputField
                    id="firstName"
                    label={content[language].form.firstName}
                    icon={User}
                    required
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('firstName', e.target.value)}
                  />
                </div>
                
                <InputField
                  id="establishment"
                  label={content[language].form.establishment}
                  icon={Building}
                  required
                  value={formData.establishment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('establishment', e.target.value)}
                />
                
                <InputField
                  id="title"
                  label={content[language].form.title}
                  icon={FileText}
                  required
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('title', e.target.value)}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    id="email"
                    label={content[language].form.email}
                    type="email"
                    icon={Mail}
                    required
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('email', e.target.value)}
                  />
                  <InputField
                    id="phone"
                    label={content[language].form.phone}
                    type="tel"
                    icon={Phone}
                    required
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  {content[language].form.next}
                </Button>
              </div>
            </FormSection>
          )}

          {/* Step 2: Participation */}
          {currentStep === 2 && (
            <FormSection icon={FileText} title={content[language].participation}>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">
                    Type de participation
                  </Label>
                  <RadioGroup 
                    value={formData.participationType} 
                    onValueChange={(value) => updateFormData('participationType', value)}
                    className="space-y-2"
                  >
                    <RadioOption
                      value="without-article"
                      id="without-article"
                      label={content[language].form.participationWithoutArticle}
                      isSelected={formData.participationType === 'without-article'}
                    />
                    <RadioOption
                      value="with-article"
                      id="with-article"
                      label={content[language].form.participationWithArticle}
                      isSelected={formData.participationType === 'with-article'}
                    />
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">
                    {content[language].form.withAccompanying}
                  </Label>
                  <RadioGroup 
                    value={formData.hasAccompanying} 
                    onValueChange={(value) => updateFormData('hasAccompanying', value)}
                    className="space-y-2"
                  >
                    <RadioOption
                      value="yes"
                      id="accompanying-yes"
                      label={content[language].form.yes}
                      isSelected={formData.hasAccompanying === 'yes'}
                    />
                    <RadioOption
                      value="no"
                      id="accompanying-no"
                      label={content[language].form.no}
                      isSelected={formData.hasAccompanying === 'no'}
                    />
                  </RadioGroup>
                </div>

                {formData.hasAccompanying === 'yes' && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label htmlFor="accompanyingDetails" className="text-sm font-medium text-gray-700 mb-2 block">
                      {content[language].form.accompanyingDetails}
                    </Label>
                    <Textarea
                      id="accompanyingDetails"
                      value={formData.accompanyingDetails}
                      onChange={(e) => updateFormData('accompanyingDetails', e.target.value)}
                      placeholder={language === 'fr' ? 'Ex: Marie Dupont (35 ans), Jean Dupont (8 ans)' : 'Ex: Marie Dupont (35 years), Jean Dupont (8 years)'}
                      rows={3}
                      className="border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                >
                  {content[language].form.previous}
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  {content[language].form.next}
                </Button>
              </div>
            </FormSection>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <FormSection icon={CreditCard} title={content[language].payment}>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">
                    {content[language].form.registrationFees}
                  </Label>
                  <RadioGroup 
                    value={formData.accommodationType} 
                    onValueChange={(value) => updateFormData('accommodationType', value)}
                    className="space-y-2"
                  >
                    <RadioOption
                      value="without-accommodation"
                      id="without-accommodation"
                      label={content[language].form.withoutAccommodation}
                      isSelected={formData.accommodationType === 'without-accommodation'}
                    />
                    <RadioOption
                      value="with-accommodation"
                      id="with-accommodation"
                      label={content[language].form.withAccommodation}
                      isSelected={formData.accommodationType === 'with-accommodation'}
                    />
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">
                    Mode de paiement
                  </Label>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => updateFormData('paymentMethod', value)}
                    className="space-y-2"
                  >
                    <RadioOption
                      value="bank-transfer"
                      id="bank-transfer"
                      label={content[language].form.bankTransfer}
                      isSelected={formData.paymentMethod === 'bank-transfer'}
                    />
                    <RadioOption
                      value="administrative-order"
                      id="administrative-order"
                      label={content[language].form.administrativeOrder}
                      isSelected={formData.paymentMethod === 'administrative-order'}
                    />
                    <RadioOption
                      value="check"
                      id="check"
                      label={content[language].form.checkPayment}
                      isSelected={formData.paymentMethod === 'check'}
                    />
                  </RadioGroup>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <Label htmlFor="paymentProof" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    {content[language].form.paymentProof}
                  </Label>
                  <Input
                    id="paymentProof"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {language === 'fr' 
                      ? 'Formats acceptés: PDF, JPG, PNG (max 5MB)' 
                      : 'Accepted formats: PDF, JPG, PNG (max 5MB)'
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                >
                  {content[language].form.previous}
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  {content[language].form.submit}
                </Button>
              </div>
            </FormSection>
          )}
        </div>
      </div>
    </section>
  );
};

export default Registration;