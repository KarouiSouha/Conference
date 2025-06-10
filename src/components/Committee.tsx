import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award } from 'lucide-react';

interface CommitteeProps {
  language: 'fr' | 'en';
}

const Committee: React.FC<CommitteeProps> = ({ language }) => {
  const content = {
    fr: {
      title: 'Comité Scientifique & Organisation',
      scientific: {
        title: 'Comité Scientifique',
        chair: { name: 'Hassene SEDDIK', affiliation: 'ENSIT, Tunisia', role: 'Président Scientifique' },
        coChair: { name: 'Mohamed Ali REZGUI', affiliation: 'ENSIT, Tunisia', role: 'Co-Président Scientifique' },
        members: [
          'Abdallah NASSOUR (Rostock University, Germany)',
          'Abdelaziz SAHBANI (FSB, Tunisia)',
          'Adel BECHIKH (ISET Rades, Tunisia)',
          'Afef ABDELKRIM (ENICarthage, Tunisia)',
          'Ali TRABELSI (ENSIT, Tunisia)',
          'Anis HAMROUNI (UVT, Tunisia)',
          'Atef BOULILA (INSAT, Tunisia)',
          'Basma LAMOUCHI (ENSIT, Tunisia)',
          'Bechir ALLOUCH (UVT, Tunisia)',
          'Besma BEN SALAH (ISET Sousse, Tunisia)',
          'Chiraz GHARBI (ISET Bizerte, Tunisia)',
          'Faouzi BACHA (ENSIT, Tunisia)',
          'Faouzi BOUANI (ENIT, Tunisia)',
          'Ferid KOURDA (ENIT, Tunisia)',
          'Foued LANDOLSI (ISET Nabeul, Tunisia)',
          'Habib SMEI (ISET Rades, Tunisia)',
          'Hassen KHARROUBI (ESIM, Tunisia)',
          'Hechmi KHATERCHI (UVT, Tunisia)',
          'Houria GHODBANE (Souk Ahras University, Algeria)',
          'Houyem ABDERRAZEK (INRAP, Tunisia)',
          'Jamel BELHADJ (ENSIT, Tunisia)',
          'Jamel MEJRI (ESIM, Tunisia)',
          'Jihed ZGHAL (IUT Paris Nanterre, France)',
          'Jihen ARBI ZIANI (ParisTech, France)',
          'Kamel BEN SAAD (ENIT, Tunisia)',
          'Kamel MESSAOUDI (Souk Ahras University, Algeria)',
          'Karem DHOUIB (ENSIT, Tunisia)',
          'Khaled BOUGHZALA (ISET Ksar Hellal, Tunisia)',
          'Khaled EL MOUEDDEB (ENSIM, Tunisia)',
          'Kaouther GHOZZI (ISET Radès, Tunisia)',
          'Kerstin KUCHTA (TUHH, Germany)',
          'Latifa RABAI (ISG, Tunisia)',
          'Malek KHADRAOUI (ISET Kasserine, Tunisia)',
          'Mahfoudh AYADI (ENIB, Tunisia)',
          'Mehdi TURKI (ESIM, Tunisia)',
          'Mehrez ROMDHANE (ENIG, Tunisia)',
          'Mohamed Fadhel SAAD (ISET Gafsa, Tunisia)',
          'Mohamed Habib SELLAMI (ESIM, Tunisia)',
          'Mohamed Toumi NASRI (ENIB, Tunisia)',
          'Monia GUIZA (ENIG, Tunisia)',
          'Mounir BEN MUSTAPHA (ISET Bizerte, Tunisia)',
          'Mounir FRIJA (ISSAT Sousse, Tunisia)',
          'Moktar HAMDI (INSAT, Tunisia)',
          'Noureddine BEN YAHYA (ENSIT, Tunisia)',
          'Noureddine HAJJAJI (ENIG, Tunisia)',
          'Rached GHARBI (ENSIT, Tunisia)',
          'Rachid NASRI (ENIT, Tunisia)',
          'Rainer STEGMANN (TUHH, Germany)',
          'Riad TOUFOUTI (Souk Ahras University, Algeria)',
          'Ridha AZIZI (ISET Sousse, Tunisia)',
          'Ridha KHEDRI (McMaster University, Canada)',
          'Rima ABBASSI (ISETCom, Tunisia)',
          'Sabri MESAOUDI (Qassim University, KSA)',
          'Salah BEJAOUI (ISET Bizerte, Tunisia)',
          'Sami BELLALAH (ISET Nabeul, Tunisia)',
          'Samira BOUMOUS (Souk Ahras University, Algeria)',
          'Sana BENKHLIFA (ESIM, Tunisia)',
          'Sawssen EL EUCH (ISET Rades, Tunisia)',
          'Sherien EL AGROUDY (Ain Shems University, Egypt)',
          'Sina OUERIMI (ISET Gabès, Tunisia)',
          'Skander REJEB (ENIG Gabès, Tunisia)',
          'Slaheddine KHELIFI (ISET Bizerte, Tunisia)',
          'Taoufik MHAMDI (ISET Kasserine, Tunisia)',
          'Tarek HAMROUNI (ISAMM, Tunisia)',
          'Toufik THELLAIDJIA (Souk Ahras University, Algeria)',
          'Walid BARHOUMI (ENICarthage, Tunisia)',
          'Yacine SAHRAOUI (University Soukahras, Algeria)',
          'Yahia KOURD (University Soukahras, Algeria)',
          'Youssef AGUERBI ZORGANI (ISET Sfax, Tunisia)',
          'Zouhir BOUMOUS (Souk Ahras University, Algeria)'
        ]
      },
      organizing: {
        title: 'Comité d\'Organisation',
        chair: { name: 'Manel KHATERCHI', affiliation: 'ISET Bizerte', role: 'Président Général' },
        members: [
          'Ali BEJAOUI',
          'Aymen ELAMRAOUI',
          'Bilel ZEMZEM',
          'Boudour BARATLI',
          'Dalila AMARA',
          'Faten SAIDANE',
          'Hajer BEN HAMMOUDA',
          'Hmaied HMIDA',
          'Houda KHATERCHI',
          'Imen FARHAT',
          'Jihen BOKRI',
          'Kamel KAROUI',
          'Khaled HAMROUNI',
          'Ltaief LAMMARI',
          'Malek KHADHRAOUI',
          'Mohamed Ali REZGUI',
          'Mohamed GHARBI',
          'Mohamed Toumi NASRI',
          'Mounir BEN MUSTAPHA',
          'Naoufel FARES',
          'Nourallah AOUINA',
          'Ramzi BEN CHEHIDA',
          'Salah BEJAOUI',
          'Samira BOUMOUS',
          'Sana DILOU',
          'Souhaib AMDOUNI',
          'Yamna BEN JEMAA',
          'Yosr Zina ABDELKRIM',
          'Zouhir BOUMOUS'
        ]
      }
    },
    en: {
      title: 'Scientific & Organizing Committee',
      scientific: {
        title: 'Scientific Committee',
        chair: { name: 'Hassene SEDDIK', affiliation: 'ENSIT, Tunisia', role: 'Scientific Chair' },
        coChair: { name: 'Mohamed Ali REZGUI', affiliation: 'ENSIT, Tunisia', role: 'Scientific Co-Chair' },
        members: [
          'Abdallah NASSOUR (Rostock University, Germany)',
          'Abdelaziz SAHBANI (FSB, Tunisia)',
          'Adel BECHIKH (ISET Rades, Tunisia)',
          'Afef ABDELKRIM (ENICarthage, Tunisia)',
          'Ali TRABELSI (ENSIT, Tunisia)',
          'Anis HAMROUNI (UVT, Tunisia)',
          'Atef BOULILA (INSAT, Tunisia)',
          'Basma LAMOUCHI (ENSIT, Tunisia)',
          'Bechir ALLOUCH (UVT, Tunisia)',
          'Besma BEN SALAH (ISET Sousse, Tunisia)',
          'Chiraz GHARBI (ISET Bizerte, Tunisia)',
          'Faouzi BACHA (ENSIT, Tunisia)',
          'Faouzi BOUANI (ENIT, Tunisia)',
          'Ferid KOURDA (ENIT, Tunisia)',
          'Foued LANDOLSI (ISET Nabeul, Tunisia)',
          'Habib SMEI (ISET Rades, Tunisia)',
          'Hassen KHARROUBI (ESIM, Tunisia)',
          'Hechmi KHATERCHI (UVT, Tunisia)',
          'Houria GHODBANE (Souk Ahras University, Algeria)',
          'Houyem ABDERRAZEK (INRAP, Tunisia)',
          'Jamel BELHADJ (ENSIT, Tunisia)',
          'Jamel MEJRI (ESIM, Tunisia)',
          'Jihed ZGHAL (IUT Paris Nanterre, France)',
          'Jihen ARBI ZIANI (ParisTech, France)',
          'Kamel BEN SAAD (ENIT, Tunisia)',
          'Kamel MESSAOUDI (Souk Ahras University, Algeria)',
          'Karem DHOUIB (ENSIT, Tunisia)',
          'Khaled BOUGHZALA (ISET Ksar Hellal, Tunisia)',
          'Khaled EL MOUEDDEB (ENSIM, Tunisia)',
          'Kaouther GHOZZI (ISET Radès, Tunisia)',
          'Kerstin KUCHTA (TUHH, Germany)',
          'Latifa RABAI (ISG, Tunisia)',
          'Malek KHADRAOUI (ISET Kasserine, Tunisia)',
          'Mahfoudh AYADI (ENIB, Tunisia)',
          'Mehdi TURKI (ESIM, Tunisia)',
          'Mehrez ROMDHANE (ENIG, Tunisia)',
          'Mohamed Fadhel SAAD (ISET Gafsa, Tunisia)',
          'Mohamed Habib SELLAMI (ESIM, Tunisia)',
          'Mohamed Toumi NASRI (ENIB, Tunisia)',
          'Monia GUIZA (ENIG, Tunisia)',
          'Mounir BEN MUSTAPHA (ISET Bizerte, Tunisia)',
          'Mounir FRIJA (ISSAT Sousse, Tunisia)',
          'Moktar HAMDI (INSAT, Tunisia)',
          'Noureddine BEN YAHYA (ENSIT, Tunisia)',
          'Noureddine HAJJAJI (ENIG, Tunisia)',
          'Rached GHARBI (ENSIT, Tunisia)',
          'Rachid NASRI (ENIT, Tunisia)',
          'Rainer STEGMANN (TUHH, Germany)',
          'Riad TOUFOUTI (Souk Ahras University, Algeria)',
          'Ridha AZIZI (ISET Sousse, Tunisia)',
          'Ridha KHEDRI (McMaster University, Canada)',
          'Rima ABBASSI (ISETCom, Tunisia)',
          'Sabri MESAOUDI (Qassim University, KSA)',
          'Salah BEJAOUI (ISET Bizerte, Tunisia)',
          'Sami BELLALAH (ISET Nabeul, Tunisia)',
          'Samira BOUMOUS (Souk Ahras University, Algeria)',
          'Sana BENKHLIFA (ESIM, Tunisia)',
          'Sawssen EL EUCH (ISET Rades, Tunisia)',
          'Sherien EL AGROUDY (Ain Shems University, Egypt)',
          'Sina OUERIMI (ISET Gabès, Tunisia)',
          'Skander REJEB (ENIG Gabès, Tunisia)',
          'Slaheddine KHELIFI (ISET Bizerte, Tunisia)',
          'Taoufik MHAMDI (ISET Kasserine, Tunisia)',
          'Tarek HAMROUNI (ISAMM, Tunisia)',
          'Toufik THELLAIDJIA (Souk Ahras University, Algeria)',
          'Walid BARHOUMI (ENICarthage, Tunisia)',
          'Yacine SAHRAOUI (University Soukahras, Algeria)',
          'Yahia KOURD (University Soukahras, Algeria)',
          'Youssef AGUERBI ZORGANI (ISET Sfax, Tunisia)',
          'Zouhir BOUMOUS (Souk Ahras University, Algeria)'
        ]
      },
      organizing: {
        title: 'Organizing Committee',
        chair: { name: 'Manel KHATERCHI', affiliation: 'ISET Bizerte', role: 'General Chair' },
        members: [
          'Ali BEJAOUI',
          'Aymen ELAMRAOUI',
          'Bilel ZEMZEM',
          'Boudour BARATLI',
          'Dalila AMARA',
          'Faten SAIDANE',
          'Hajer BEN HAMMOUDA',
          'Hmaied HMIDA',
          'Houda KHATERCHI',
          'Imen FARHAT',
          'Jihen BOKRI',
          'Kamel KAROUI',
          'Khaled HAMROUNI',
          'Ltaief LAMMARI',
          'Malek KHADHRAOUI',
          'Mohamed Ali REZGUI',
          'Mohamed GHARBI',
          'Mohamed Toumi NASRI',
          'Mounir BEN MUSTAPHA',
          'Naoufel FARES',
          'Nourallah AOUINA',
          'Ramzi BEN CHEHIDA',
          'Salah BEJAOUI',
          'Samira BOUMOUS',
          'Sana DILOU',
          'Souhaib AMDOUNI',
          'Yamna BEN JEMAA',
          'Yosr Zina ABDELKRIM',
          'Zouhir BOUMOUS'
        ]
      }
    }
  };

  return (
    <section id="committee" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            {content[language].title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  {content[language].scientific.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Chair */}
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-foreground">{content[language].scientific.chair.name}</h4>
                    <p className="text-sm text-muted-foreground">{content[language].scientific.chair.affiliation}</p>
                    <p className="text-xs text-primary font-medium">{content[language].scientific.chair.role}</p>
                  </div>
                  
                  {/* Co-Chair */}
                  <div className="border-l-4 border-primary/60 pl-4">
                    <h4 className="font-bold text-foreground">{content[language].scientific.coChair.name}</h4>
                    <p className="text-sm text-muted-foreground">{content[language].scientific.coChair.affiliation}</p>
                    <p className="text-xs text-primary font-medium">{content[language].scientific.coChair.role}</p>
                  </div>
                  
                  {/* Members */}
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    <h5 className="font-semibold text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Membres:' : 'Members:'}</h5>
                    {content[language].scientific.members.map((member, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-3">
                        <p className="text-sm text-foreground">{member}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Users className="w-5 h-5" />
                  {content[language].organizing.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Chair */}
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-foreground">{content[language].organizing.chair.name}</h4>
                    <p className="text-sm text-muted-foreground">{content[language].organizing.chair.affiliation}</p>
                    <p className="text-xs text-primary font-medium">{content[language].organizing.chair.role}</p>
                  </div>
                  
                  {/* Members */}
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    <h5 className="font-semibold text-sm text-muted-foreground mb-2">{language === 'fr' ? 'Membres:' : 'Members:'}</h5>
                    {content[language].organizing.members.map((member, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-3">
                        <p className="text-sm text-foreground">{member}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Committee;