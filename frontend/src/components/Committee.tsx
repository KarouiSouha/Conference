import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Loader2, MapPin, Briefcase } from 'lucide-react';

interface CommitteeProps {
  language: 'fr' | 'en';
}

interface Member {
  id: number;
  name_fr: string;
  name_en: string;
  institute_fr?: string;
  institute_en?: string;
  job_fr?: string;
  job_en?: string;
  special_role: 'chair' | 'co-chair' | 'member';
  order: number;
  image_path?: string;
}

interface CommitteeData {
  scientific: { chair: Member | null; co_chair: Member | null; members: Member[] };
  organizing: { chair: Member | null; members: Member[] };
  honorary: { members: Member[] };
}

interface ApiResponse {
  success: boolean;
  language: string;
  data: CommitteeData;
}

const Committee: React.FC<CommitteeProps> = ({ language }) => {
  const [committeeData, setCommitteeData] = useState<CommitteeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    fr: {
      title: 'Comité Scientifique & Organisation',
      scientific: { title: 'Comité Scientifique', chairRole: 'Président Scientifique', coChairRole: 'Co-Président Scientifique', membersTitle: 'Membres' },
      organizing: { title: 'Comité d\'Organisation', chairRole: 'Président Général', membersTitle: 'Membres' },
      honorary: { title: 'Comité d\'Honneur', membersTitle: 'Membres' },
      loading: 'Chargement...',
      error: 'Erreur lors du chargement des données'
    },
    en: {
      title: 'Scientific & Organizing Committee',
      scientific: { title: 'Scientific Committee', chairRole: 'Scientific Chair', coChairRole: 'Scientific Co-Chair', membersTitle: 'Members' },
      organizing: { title: 'Organizing Committee', chairRole: 'General Chair', membersTitle: 'Members' },
      honorary: { title: 'Honorary Committee', membersTitle: 'Members' },
      loading: 'Loading...',
      error: 'Error loading data'
    }
  };

  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/api/Comite/all?lang=${language}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result: ApiResponse = await response.json();
        if (result.success) {
          setCommitteeData(result.data);
          console.log('Committee data fetched successfully:', result.data);
        } else {
          throw new Error('API returned success: false');
        }
      } catch (err) {
        console.error('Error fetching committee data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchCommitteeData();
  }, [language]);

  const renderMember = (member: Member, index: number, isChair: boolean = false) => (
    <div
      key={member.id || index}
      className={`group transition-all duration-300 ${
        isChair 
          ? 'border-l-4 border-blue-500 pl-6 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 p-6 rounded-r-xl shadow-sm hover:shadow-md' 
          : 'border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-3 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 rounded-r-lg hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        {member.image_path && (
          <div className="flex-shrink-0">
            <img
              src={`http://localhost:8000/storage/${member.image_path}`}
              alt={language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en}
              className={`${
                isChair ? 'w-20 h-20' : 'w-14 h-14'
              } rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md group-hover:shadow-lg transition-shadow`}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className={`font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
              isChair ? 'text-lg' : 'text-sm'
            }`}>
              {language === 'en' ? member.name_en || member.name_fr : member.name_fr || member.name_en}
            </h4>
            {isChair && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                <Award className="w-3 h-3 mr-1" />
                {member.special_role === 'chair' ? content[language].scientific.chairRole.split(' ')[0] : 'Co-Chair'}
              </span>
            )}
          </div>
          
          {(language === 'en' ? member.institute_en : member.institute_fr) && (
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className={`text-gray-600 dark:text-gray-400 italic leading-relaxed ${
                isChair ? 'text-sm' : 'text-xs'
              }`}>
                {language === 'en' ? member.institute_en || member.institute_fr : member.institute_fr || member.institute_en}
              </span>
            </div>
          )}
          
          {isChair && (language === 'en' ? member.job_en : member.job_fr) && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-blue-500 flex-shrink-0" />
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                {language === 'en' ? member.job_en || member.job_fr : member.job_fr || member.job_en}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <section id="committee" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{content[language].loading}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section id="committee" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center bg-red-50 dark:bg-red-950/30 p-8 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
              <p className="text-lg font-medium text-red-700 dark:text-red-300">{content[language].error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (!committeeData) return null;

  return (
    <section id="committee" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {content[language].title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Scientific Committee */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  {content[language].scientific.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {committeeData.scientific.chair && renderMember(committeeData.scientific.chair, 0, true)}
                  {committeeData.scientific.co_chair && (
                    <div className="border-l-4 border-indigo-400 pl-6 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/20 p-6 rounded-r-xl shadow-sm">
                      <div className="flex items-start gap-4">
                        {committeeData.scientific.co_chair.image_path && (
                          <img
                            src={`http://localhost:8000/storage/${committeeData.scientific.co_chair.image_path}`}
                            alt={language === 'en' ? committeeData.scientific.co_chair.name_en || committeeData.scientific.co_chair.name_fr : committeeData.scientific.co_chair.name_fr || committeeData.scientific.co_chair.name_en}
                            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                              {language === 'en' ? committeeData.scientific.co_chair.name_en || committeeData.scientific.co_chair.name_fr : committeeData.scientific.co_chair.name_fr || committeeData.scientific.co_chair.name_en}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                              <Award className="w-3 h-3 mr-1" />
                              Co-Chair
                            </span>
                          </div>
                          {(language === 'en' ? committeeData.scientific.co_chair.institute_en : committeeData.scientific.co_chair.institute_fr) && (
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                                {language === 'en' ? committeeData.scientific.co_chair.institute_en || committeeData.scientific.co_chair.institute_fr : committeeData.scientific.co_chair.institute_fr || committeeData.scientific.co_chair.institute_en}
                              </span>
                            </div>
                          )}
                          {(language === 'en' ? committeeData.scientific.co_chair.job_en : committeeData.scientific.co_chair.job_fr) && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-indigo-500" />
                              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
                                {language === 'en' ? committeeData.scientific.co_chair.job_en || committeeData.scientific.co_chair.job_fr : committeeData.scientific.co_chair.job_fr || committeeData.scientific.co_chair.job_en}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {committeeData.scientific.members.length > 0 && (
                    <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      <h5 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {content[language].scientific.membersTitle}
                      </h5>
                      <div className="space-y-2">{committeeData.scientific.members.map((member, index) => renderMember(member, index))}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizing Committee */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  {content[language].organizing.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {committeeData.organizing.chair && renderMember(committeeData.organizing.chair, 0, true)}
                  {committeeData.organizing.members.length > 0 && (
                    <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      <h5 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {content[language].organizing.membersTitle}
                      </h5>
                      <div className="space-y-2">{committeeData.organizing.members.map((member, index) => renderMember(member, index))}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Honorary Committee */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  {content[language].honorary.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {committeeData.honorary.members.length > 0 && (
                  <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <h5 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {content[language].honorary.membersTitle}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {committeeData.honorary.members.map((member, index) => renderMember(member, index))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Committee;