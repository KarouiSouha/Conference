import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building, Mail, Phone, FileText, CreditCard, Upload, CheckCircle, AlertCircle, Loader2, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegistrationProps {
  language: 'fr' | 'en';
  apiBaseUrl?: string;
}

// Configuration de l'API
const API_CONFIG = {
  baseUrl: 'http://localhost:8000/api',
  endpoints: {
    registration: '/Registration'
  }
};

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

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
    <div>
      <p className="text-red-800 text-sm">{message}</p>
    </div>
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
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id, label, type = "text", icon: Icon, required = false, value, onChange, error, ...props
}) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-blue-500" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`h-10 border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
      required={required}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

interface SelectFieldProps {
  id: string;
  label: string;
  icon?: React.ElementType;
  required?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  id, label, icon: Icon, required = false, value, onValueChange, error, placeholder, options
}) => {
  const getIconForOption = (optionValue: string) => {
    switch(optionValue) {
      case 'student': return <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">E</div>;
      case 'teacher': return <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>;
      case 'engineer': return <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">I</div>;
      case 'other': return <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>;
      case 'Tunisia': return <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-white rounded-full flex items-center justify-center text-white text-xs font-bold">TN</div>;
      case 'International': return <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-white rounded-full flex items-center justify-center text-white text-xs font-bold">INT</div>;
      default: return <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">?</div>;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-800 flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 text-blue-500" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`h-12 border-2 rounded-xl transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gradient-to-r from-white to-gray-50 ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300'
        } ${value ? 'bg-blue-50/30' : ''}`}>
          <SelectValue
            placeholder={
              <span className="text-gray-500 font-medium">
                {placeholder}
              </span>
            }
            className="font-medium"
          />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-xl backdrop-blur-sm">
          <div className="p-1">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50 cursor-pointer hover:scale-[1.02] focus:scale-[1.02] my-1"
              >
                <div className="flex items-center group">
                  <div className="mr-3 group-hover:scale-110 transition-transform duration-200">
                    {getIconForOption(option.value)}
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {option.label}
                  </span>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      {error && (
        <div className="flex items-center mt-2">
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">!</div>
          <p className="text-red-500 text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

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

const Registration: React.FC<RegistrationProps> = ({ language = 'fr', apiBaseUrl }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    establishment: '',
    title: '',
    email: '',
    phone: '',
    country: '',
    participationType: '',
    hasAccompanying: '',
    accompanyingDetails: '',
    accommodationType: '',
    paymentMethod: '',
    paymentProof: null as File | null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const baseUrl = apiBaseUrl || API_CONFIG.baseUrl;

  const content = React.useMemo(() => ({
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
        titleOptions: {
          student: 'Étudiant',
          teacher: 'Enseignant',
          engineer: 'Ingénieur',
          other: 'Autre'
        },
        email: 'Adresse e-mail',
        phone: 'Numéro de téléphone',
        country: 'Pays',
        countryOptions: {
          tunisia: 'Tunisie',
          international: 'International'
        },
        participationWithoutArticle: 'Participation sans soumission d\'article',
        participationWithArticle: 'Participation avec soumission d\'article',
        withAccompanying: 'Avec personne accompagnante',
        yes: 'Oui',
        no: 'Non',
        accompanyingDetails: 'Détails des accompagnateurs (noms et âges)',
        registrationFees: 'Frais d\'inscription',
        withoutAccommodation: 'Sans hébergement',
        withAccommodation: 'Avec hébergement (2 nuits incluses)',
        bankTransfer: 'Virement bancaire',
        administrativeOrder: 'Mandat administratif',
        checkPayment: 'Paiement par chèque',
        paymentProof: 'Justificatif de paiement',
        submit: 'Finaliser l\'inscription',
        next: 'Suivant',
        previous: 'Précédent',
        submitting: 'Inscription en cours...'
      },
      success: 'Inscription envoyée avec succès!',
      successMessage: 'Votre inscription a été enregistrée. Nous vous contacterons prochainement.',
      errors: {
        submitError: 'Erreur lors de l\'inscription. Veuillez réessayer.',
        networkError: 'Erreur de connexion. Vérifiez votre connexion internet.',
        validationError: 'Veuillez corriger les erreurs dans le formulaire.',
        emailExists: 'Cette adresse e-mail est déjà utilisée.',
        countryRequired: 'Pays requis'
      }
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
        titleOptions: {
          student: 'Student',
          teacher: 'Teacher',
          engineer: 'Engineer',
          other: 'Other'
        },
        email: 'Email Address',
        phone: 'Phone Number',
        country: 'Country',
        countryOptions: {
          tunisia: 'Tunisia',
          international: 'International'
        },
        participationWithoutArticle: 'Participation without article submission',
        participationWithArticle: 'Participation with article submission',
        withAccompanying: 'With accompanying person',
        yes: 'Yes',
        no: 'No',
        accompanyingDetails: 'Accompanying persons details (names and ages)',
        registrationFees: 'Registration Fees',
        withoutAccommodation: 'Without accommodation',
        withAccommodation: 'With accommodation (2 nights included)',
        bankTransfer: 'Bank Transfer',
        administrativeOrder: 'Administrative Order',
        checkPayment: 'Check Payment',
        paymentProof: 'Payment Proof',
        submit: 'Complete Registration',
        next: 'Next',
        previous: 'Previous',
        submitting: 'Submitting...'
      },
      success: 'Registration submitted successfully!',
      successMessage: 'Your registration has been recorded. We will contact you soon.',
      errors: {
        submitError: 'Error during registration. Please try again.',
        networkError: 'Connection error. Check your internet connection.',
        validationError: 'Please correct the errors in the form.',
        emailExists: 'This email address is already in use.',
        countryRequired: 'Country required'
      }
    }
  }), []);

  // Pricing data from PricingInfo
  const getRegistrationFees = () => {
    const participantType = formData.title === 'student' ? 'student' :
                           formData.title === 'teacher' ? 'academic' :
                           'professional';
    const isTunisia = formData.country === 'Tunisia';

    const fees = {
      withAccommodation: {
        academic: isTunisia ? '700 TND' : '450 €',
        student: isTunisia ? '650 TND' : '400 €',
        professional: isTunisia ? '750 TND' : '500 €'
      },
      withoutAccommodation: isTunisia ? '450 TND' : '150 €'
    };

    return {
      withAccommodation: fees.withAccommodation[participantType],
      withoutAccommodation: fees.withoutAccommodation
    };
  };

  const fees = getRegistrationFees();

  // Fonctions de mise à jour mémorisées
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, paymentProof: file }));
    if (errors.paymentProof) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentProof;
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = React.useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = content[language].form.firstName + ' requis';
      if (!formData.lastName.trim()) newErrors.lastName = content[language].form.lastName + ' requis';
      if (!formData.establishment.trim()) newErrors.establishment = content[language].form.establishment + ' requis';
      if (!formData.title.trim()) newErrors.title = content[language].form.title + ' requis';
      if (!formData.email.trim()) newErrors.email = content[language].form.email + ' requis';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
      if (!formData.phone.trim()) newErrors.phone = content[language].form.phone + ' requis';
      if (!formData.country.trim()) newErrors.country = content[language].errors.countryRequired;
    } else if (step === 2) {
      if (!formData.participationType) newErrors.participationType = 'Type de participation requis';
      if (!formData.hasAccompanying) newErrors.hasAccompanying = 'Réponse requise';
      if (formData.hasAccompanying === 'yes' && !formData.accompanyingDetails.trim()) {
        newErrors.accompanyingDetails = 'Détails des accompagnateurs requis';
      }
    } else if (step === 3) {
      if (!formData.accommodationType) newErrors.accommodationType = 'Type d\'hébergement requis';
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Mode de paiement requis';
      if (!formData.paymentProof && formData.paymentMethod !== 'administrative-order') {
        newErrors.paymentProof = content[language].form.paymentProof + ' requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, content, language]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName); // Use 'first_name' if server expects snake_case
      submitData.append('lastName', formData.lastName); // Use 'last_name'
      submitData.append('establishment', formData.establishment);
      submitData.append('title', formData.title);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('country', formData.country);
      submitData.append('participationType', formData.participationType); // Use 'participation_type'
      submitData.append('hasAccompanying', formData.hasAccompanying); // Use 'has_accompanying'
      submitData.append('accompanyingDetails', formData.accompanyingDetails || ''); // Use 'accompanying_details'
      submitData.append('accommodationType', formData.accommodationType); // Use 'accommodation_type'
      submitData.append('paymentMethod', formData.paymentMethod); // Use 'payment_method'
      submitData.append('language', language);
      if (formData.paymentProof) {
        submitData.append('paymentProof', formData.paymentProof); // Use 'payment_proof'
      }

      console.log('Submitting data:', Object.fromEntries(submitData));

      const response = await fetch(`${baseUrl}${API_CONFIG.endpoints.registration}`, {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Server error:', response.status, data);
        if (response.status === 422) {
          const validationErrors: Record<string, string> = {};
          if (data.errors) {
            Object.keys(data.errors).forEach(key => {
              validationErrors[key] = data.errors[key][0];
            });
          }
          setErrors(validationErrors);
          setSubmitError(content[language].errors.validationError);
        } else if (data.message?.includes('email')) {
          setSubmitError(content[language].errors.emailExists);
        } else {
          setSubmitError(data.message || content[language].errors.submitError);
        }
        return;
      }

      console.log('Registration successful:', data);
      setIsSubmitted(true);

    } catch (error) {
      console.error('Error submitting registration:', error);
      setSubmitError(content[language].errors.networkError);
    } finally {
      setIsLoading(false);
    }
  }, [formData, baseUrl, language, content, validateStep]);

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

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
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    establishment: '',
                    title: '',
                    email: '',
                    phone: '',
                    country: '',
                    participationType: '',
                    hasAccompanying: '',
                    accompanyingDetails: '',
                    accommodationType: '',
                    paymentMethod: '',
                    paymentProof: null
                  });
                  setErrors({});
                  setSubmitError('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {language === 'fr' ? 'Nouvelle inscription' : 'New Registration'}
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
    <section className="min-h-screen bg-white py-12" id="registration">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content[language].subtitle}
            </p>
          </div>

          <StepIndicator />

          {/* Error global */}
          {submitError && <ErrorAlert message={submitError} />}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <FormSection icon={User} title={content[language].personalInfo}>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <InputField
                    id="lastName"
                    label={content[language].form.lastName}
                    icon={User}
                    required
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    error={errors.lastName}
                  />
                  <InputField
                    id="firstName"
                    label={content[language].form.firstName}
                    icon={User}
                    required
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    error={errors.firstName}
                  />
                </div>

                <InputField
                  id="establishment"
                  label={content[language].form.establishment}
                  icon={Building}
                  required
                  value={formData.establishment}
                  onChange={(e) => updateFormData('establishment', e.target.value)}
                  error={errors.establishment}
                />

                <div className="grid md:grid-cols-2 gap-3">
                  <SelectField
                    id="title"
                    label={content[language].form.title}
                    icon={FileText}
                    required
                    value={formData.title}
                    onValueChange={(value) => updateFormData('title', value)}
                    error={errors.title}
                    placeholder={language === 'fr' ? 'Sélectionnez votre fonction' : 'Select your position'}
                    options={[
                      { value: 'student', label: content[language].form.titleOptions.student },
                      { value: 'teacher', label: content[language].form.titleOptions.teacher },
                      { value: 'engineer', label: content[language].form.titleOptions.engineer },
                      { value: 'other', label: content[language].form.titleOptions.other }
                    ]}
                  />
                  <SelectField
                    id="country"
                    label={content[language].form.country}
                    icon={Globe}
                    required
                    value={formData.country}
                    onValueChange={(value) => updateFormData('country', value)}
                    error={errors.country}
                    placeholder={language === 'fr' ? 'Sélectionnez votre pays' : 'Select your country'}
                    options={[
                      { value: 'Tunisia', label: content[language].form.countryOptions.tunisia },
                      { value: 'International', label: content[language].form.countryOptions.international }
                    ]}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <InputField
                    id="email"
                    label={content[language].form.email}
                    type="email"
                    icon={Mail}
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    error={errors.email}
                  />
                  <InputField
                    id="phone"
                    label={content[language].form.phone}
                    type="tel"
                    icon={Phone}
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    error={errors.phone}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={nextStep}
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
                    Type de participation {errors.participationType && <span className="text-red-500 text-sm">*</span>}
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
                  {errors.participationType && <p className="text-red-500 text-xs mt-1">{errors.participationType}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">
                    {content[language].form.withAccompanying} {errors.hasAccompanying && <span className="text-red-500 text-sm">*</span>}
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
                  {errors.hasAccompanying && <p className="text-red-500 text-xs mt-1">{errors.hasAccompanying}</p>}
                </div>

                {formData.hasAccompanying === 'yes' && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label htmlFor="accompanyingDetails" className="text-sm font-medium text-gray-700 mb-2 block">
                      {content[language].form.accompanyingDetails}
                      {errors.accompanyingDetails && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Textarea
                      id="accompanyingDetails"
                      value={formData.accompanyingDetails}
                      onChange={(e) => updateFormData('accompanyingDetails', e.target.value)}
                      placeholder={language === 'fr' ? 'Ex: Marie Dupont (35 ans), Jean Dupont (8 ans)' : 'Ex: Marie Dupont (35 years), Jean Dupont (8 years)'}
                      rows={3}
                      className={`border rounded-lg ${errors.accompanyingDetails ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      {language === 'fr'
                        ? 'Frais supplémentaires: 120 TND/80 € par nuit par adulte accompagnant.'
                        : 'Additional fees: 120 TND/80 € per night per accompanying adult.'}
                    </p>
                    {errors.accompanyingDetails && <p className="text-red-500 text-xs mt-1">{errors.accompanyingDetails}</p>}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                >
                  {content[language].form.previous}
                </Button>
                <Button
                  onClick={nextStep}
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
                    {content[language].form.registrationFees} {errors.accommodationType && <span className="text-red-500 text-sm">*</span>}
                  </Label>
                  <RadioGroup
                    value={formData.accommodationType}
                    onValueChange={(value) => updateFormData('accommodationType', value)}
                    className="space-y-2"
                  >
                    <RadioOption
                      value="without-accommodation"
                      id="without-accommodation"
                      label={`${content[language].form.withoutAccommodation}: ${fees.withoutAccommodation}`}
                      isSelected={formData.accommodationType === 'without-accommodation'}
                    />
                    <RadioOption
                      value="with-accommodation"
                      id="with-accommodation"
                      label={`${content[language].form.withAccommodation}: ${fees.withAccommodation}`}
                      isSelected={formData.accommodationType === 'with-accommodation'}
                    />
                  </RadioGroup>
                  {errors.accommodationType && <p className="text-red-500 text-xs mt-1">{errors.accommodationType}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">
                    Mode de paiement {errors.paymentMethod && <span className="text-red-500 text-sm">*</span>}
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
                  {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <Label htmlFor="paymentProof" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-blue-600" />
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
                      : 'Accepted formats: PDF, JPG, PNG (max 5MB)'}
                  </p>
                  {formData.paymentProof && (
                    <p className="text-green-600 text-xs mt-1">
                      Fichier sélectionné: {formData.paymentProof.name}
                    </p>
                  )}
                  {errors.paymentProof && <p className="text-red-500 text-xs mt-1">{errors.paymentProof}</p>}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                  disabled={isLoading}
                >
                  {content[language].form.previous}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || isSubmitted}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isLoading ? content[language].form.submitting : content[language].form.submit}
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