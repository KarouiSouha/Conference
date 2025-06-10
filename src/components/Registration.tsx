
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface RegistrationProps {
  language: 'fr' | 'en';
}

const Registration: React.FC<RegistrationProps> = ({ language }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    category: '',
    dietary: ''
  });

  const content = {
    fr: {
      title: 'Inscription',
      subtitle: 'Rejoignez-nous pour SITE 2025',
      form: {
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        affiliation: 'Affiliation',
        category: 'Catégorie',
        dietary: 'Restrictions alimentaires',
        submit: 'S\'inscrire'
      },
      categories: [
        { value: 'academic', label: 'Académique' },
        { value: 'industry', label: 'Industrie' },
        { value: 'student', label: 'Étudiant' }
      ],
      fees: [
        { category: 'Inscription précoce (avant 15 avril)', academic: '200€', industry: '300€', student: '100€' },
        { category: 'Inscription tardive (après 15 avril)', academic: '250€', industry: '350€', student: '120€' }
      ],
      success: 'Inscription envoyée avec succès!'
    },
    en: {
      title: 'Registration',
      subtitle: 'Join us for SITE 2025',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        affiliation: 'Affiliation',
        category: 'Category',
        dietary: 'Dietary restrictions',
        submit: 'Register'
      },
      categories: [
        { value: 'academic', label: 'Academic' },
        { value: 'industry', label: 'Industry' },
        { value: 'student', label: 'Student' }
      ],
      fees: [
        { category: 'Early registration (before April 15)', academic: '200€', industry: '300€', student: '100€' },
        { category: 'Late registration (after April 15)', academic: '250€', industry: '350€', student: '120€' }
      ],
      success: 'Registration submitted successfully!'
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration form submitted:', formData);
    toast({
      title: content[language].success,
      description: language === 'fr' ? 'Nous vous contacterons bientôt.' : 'We will contact you soon.',
    });
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      affiliation: '',
      category: '',
      dietary: ''
    });
  };

  return (
    <section id="registration" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {content[language].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content[language].subtitle}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'fr' ? 'Formulaire d\'inscription' : 'Registration Form'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{content[language].form.firstName}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{content[language].form.lastName}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{content[language].form.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="affiliation">{content[language].form.affiliation}</Label>
                    <Input
                      id="affiliation"
                      value={formData.affiliation}
                      onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>{content[language].form.category}</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'fr' ? 'Sélectionnez une catégorie' : 'Select a category'} />
                      </SelectTrigger>
                      <SelectContent>
                        {content[language].categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dietary">{content[language].form.dietary}</Label>
                    <Input
                      id="dietary"
                      value={formData.dietary}
                      onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {content[language].form.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'fr' ? 'Frais d\'inscription' : 'Registration Fees'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {content[language].fees.map((fee, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-primary mb-3">{fee.category}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{language === 'fr' ? 'Académique' : 'Academic'}</div>
                          <div className="text-2xl font-bold text-primary">{fee.academic}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{language === 'fr' ? 'Industrie' : 'Industry'}</div>
                          <div className="text-2xl font-bold text-primary">{fee.industry}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{language === 'fr' ? 'Étudiant' : 'Student'}</div>
                          <div className="text-2xl font-bold text-primary">{fee.student}</div>
                        </div>
                      </div>
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

export default Registration;
