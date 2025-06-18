import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Save, 
  User, 
  Building2, 
  Crown, 
  Star, 
  UserCheck, 
  ArrowUpDown,
  Globe,
  Mail,
  Briefcase,
  Languages
} from "lucide-react";

export default function ComiteForm({ isOpen, onClose, member = null, onSave }) {
  const [formData, setFormData] = useState({
    name_fr: '',
    name_en: '',
    institute_fr: '',
    institute_en: '',
    job_fr: 'Membre',
    job_en: 'Member',
    committee_type: 'scientific',
    special_role: 'member',
    order: 0,
    email: '',
    country: ''
  });

  type Errors = {
    name_fr?: string;
    name_en?: string;
    email?: string;
    [key: string]: string | undefined;
  };
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Initialiser le formulaire avec les données du membre si en mode édition
  useEffect(() => {
    if (member) {
      setFormData({
        name_fr: member.name_fr || '',
        name_en: member.name_en || '',
        institute_fr: member.institute_fr || '',
        institute_en: member.institute_en || '',
        job_fr: member.job_fr || 'Membre',
        job_en: member.job_en || 'Member',
        committee_type: member.committee_type || 'scientific',
        special_role: member.special_role || 'member',
        order: member.order || 0,
        email: member.email || '',
        country: member.country || ''
      });
    } else {
      // Reset form for new member
      setFormData({
        name_fr: '',
        name_en: '',
        institute_fr: '',
        institute_en: '',
        job_fr: 'Membre',
        job_en: 'Member',
        committee_type: 'scientific',
        special_role: 'member',
        order: 0,
        email: '',
        country: ''
      });
    }
    setErrors({});
  }, [member, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    
    if (!formData.name_fr.trim()) {
      newErrors.name_fr = 'Le nom en français est requis';
    }
    
    if (!formData.name_en.trim()) {
      newErrors.name_en = 'Le nom en anglais est requis';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'chair': return <Crown className="w-4 h-4" />;
      case 'co-chair': return <Star className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'chair': return 'Président';
      case 'co-chair': return 'Vice-Président';
      default: return 'Membre';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {member ? 'Modifier le membre' : 'Nouveau membre'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {member ? 'Modifiez les informations du membre' : 'Ajoutez un nouveau membre au comité'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="w-4 h-4 mr-2" />
                  Informations de base
                </TabsTrigger>
                <TabsTrigger value="languages" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Languages className="w-4 h-4 mr-2" />
                  Langues
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Paramètres
                </TabsTrigger>
              </TabsList>

              {/* Onglet Informations de base */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom complet */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Nom complet (Français) *
                    </label>
                    <Input
                      value={formData.name_fr}
                      onChange={(e) => handleInputChange('name_fr', e.target.value)}
                      placeholder="Ex: Prof. Jean Dubois"
                      className={`${errors.name_fr ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-colors`}
                    />
                    {errors.name_fr && (
                      <p className="text-red-500 text-xs mt-1">{errors.name_fr}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                      className={`${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Institution (Français) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Institution (Français)
                    </label>
                    <Input
                      value={formData.institute_fr}
                      onChange={(e) => handleInputChange('institute_fr', e.target.value)}
                      placeholder="Ex: Université Sorbonne"
                      className="border-gray-300 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Pays */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Pays
                    </label>
                    <Input
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Ex: France"
                      className="border-gray-300 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Fonction (Français) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Fonction/Poste (Français)
                    </label>
                    <Input
                      value={formData.job_fr}
                      onChange={(e) => handleInputChange('job_fr', e.target.value)}
                      placeholder="Ex: Professeur, Directeur de recherche..."
                      className="border-gray-300 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Langues */}
              <TabsContent value="languages" className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Languages className="w-5 h-5" />
                    <span className="font-medium">Versions multilingues</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Fournissez les informations en français et en anglais pour une meilleure accessibilité
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom (Anglais) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nom complet (Anglais) *
                    </label>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => handleInputChange('name_en', e.target.value)}
                      placeholder="Ex: Prof. Jean Dubois"
                      className={`${errors.name_en ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-colors`}
                    />
                    {errors.name_en && (
                      <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>
                    )}
                  </div>

                  {/* Institution (Anglais) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Institution (Anglais)
                    </label>
                    <Input
                      value={formData.institute_en}
                      onChange={(e) => handleInputChange('institute_en', e.target.value)}
                      placeholder="Ex: Sorbonne University"
                      className="border-gray-300 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Fonction (Anglais) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Fonction/Poste (Anglais)
                    </label>
                    <Input
                      value={formData.job_en}
                      onChange={(e) => handleInputChange('job_en', e.target.value)}
                      placeholder="Ex: Professor, Research Director..."
                      className="border-gray-300 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Paramètres */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type de comité */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Type de comité
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('committee_type', 'scientific')}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.committee_type === 'scientific'
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Scientifique</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('committee_type', 'organizing')}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.committee_type === 'organizing'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <UserCheck className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Organisation</span>
                      </button>
                    </div>
                  </div>

                  {/* Rôle spécial */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Rôle dans le comité
                    </label>
                    <div className="space-y-2">
                      {['chair', 'co-chair', 'member'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleInputChange('special_role', role)}
                          className={`w-full p-3 rounded-lg border-2 transition-all flex items-center ${
                            formData.special_role === role
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {getRoleIcon(role)}
                          <span className="ml-3 font-medium">{getRoleLabel(role)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ordre d'affichage */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Ordre d'affichage
                    </label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                        className="w-24 border-gray-300 focus:border-blue-500"
                        min="0"
                      />
                      <span className="text-sm text-gray-500">
                        Plus le nombre est petit, plus le membre apparaîtra en haut
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Badge variant="outline" className="capitalize">
                {formData.committee_type === 'scientific' ? 'Scientifique' : 'Organisation'}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {getRoleLabel(formData.special_role)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6"
              >
                Annuler
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enregistrement...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    {member ? 'Modifier' : 'Ajouter'}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}