import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Loader2 } from 'lucide-react';

interface CommitteeProps {
  language: 'fr' | 'en';
}

interface Member {
  id: number;
  name: string;
  institute?: string;
  job?: string;
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
        if (result.success) setCommitteeData(result.data);
        else throw new Error('API returned success: false');
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
    <div key={member.id || index} className={`${isChair ? 'border-l-4 border-primary pl-4 bg-primary/5 p-4 rounded-r-lg' : 'border-l-3 border-primary/30 pl-4 py-2 hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 rounded-r-md'}`}>
      <div className="flex flex-col">
        {member.image_path && (
          <img src={member.image_path} alt={member.name} className="w-16 h-16 rounded-full mb-2 object-cover" />
        )}
        <span className={`font-semibold text-foreground ${isChair ? 'text-lg' : 'text-sm'} leading-tight`}>{member.name}</span>
        {member.institute && (
          <span className={`text-muted-foreground italic mt-1 opacity-80 ${isChair ? 'text-sm' : 'text-xs'}`}>{member.institute}</span>
        )}
        {isChair && member.job && (
          <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full inline-block mt-1 w-fit">{member.job}</span>
        )}
      </div>
    </div>
  );

  if (loading) return (
    <section id="committee" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">{content[language].loading}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section id="committee" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-500">
              <p className="text-lg">{content[language].error}</p>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (!committeeData) return null;

  return (
    <section id="committee" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">{content[language].title}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Scientific Committee */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  {content[language].scientific.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {committeeData.scientific.chair && renderMember(committeeData.scientific.chair, 0, true)}
                  {committeeData.scientific.co_chair && (
                    <div className="border-l-4 border-primary/60 pl-4 bg-primary/3 p-4 rounded-r-lg">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-lg leading-tight">{committeeData.scientific.co_chair.name}</span>
                        {committeeData.scientific.co_chair.institute && <span className="text-sm text-muted-foreground italic mt-1 opacity-80">{committeeData.scientific.co_chair.institute}</span>}
                        {committeeData.scientific.co_chair.job && <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full inline-block mt-1 w-fit">{committeeData.scientific.co_chair.job}</span>}
                      </div>
                    </div>
                  )}
                  {committeeData.scientific.members.length > 0 && (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      <h5 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">{content[language].scientific.membersTitle}</h5>
                      <div className="grid gap-3">{committeeData.scientific.members.map((member, index) => renderMember(member, index))}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizing Committee */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Users className="w-5 h-5" />
                  {content[language].organizing.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {committeeData.organizing.chair && renderMember(committeeData.organizing.chair, 0, true)}
                  {committeeData.organizing.members.length > 0 && (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      <h5 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">{content[language].organizing.membersTitle}</h5>
                      <div className="grid gap-3">{committeeData.organizing.members.map((member, index) => renderMember(member, index))}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Honorary Committee */}
            <Card className="hover:shadow-lg transition-shadow md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  {content[language].honorary.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {committeeData.honorary.members.length > 0 && (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    <h5 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">{content[language].honorary.membersTitle}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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