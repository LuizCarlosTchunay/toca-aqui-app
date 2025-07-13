import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music, Camera, Mic, Users, Shield, CreditCard } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-toca-accent" />,
      title: 'Conecte-se com profissionais',
      description: 'Encontre músicos, DJs, técnicos e outros profissionais do audiovisual para seus eventos.',
    },
    {
      icon: <Camera className="w-8 h-8 text-toca-accent" />,
      title: 'Gerencie seus eventos',
      description: 'Crie e gerencie eventos, adicione serviços necessários e receba candidaturas de profissionais.',
    },
    {
      icon: <Shield className="w-8 h-8 text-toca-accent" />,
      title: 'Pagamentos seguros',
      description: 'Utilize nosso sistema de pagamento seguro com Pix, cartão de crédito ou débito.',
    },
  ];

  const professionalTypes = [
    { name: 'Músicos', icon: <Music className="w-8 h-8" /> },
    { name: 'DJs', icon: <Mic className="w-8 h-8" /> },
    { name: 'Fotógrafos', icon: <Camera className="w-8 h-8" /> },
    { name: 'Filmmakers', icon: <Camera className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen bg-toca-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Conectando talentos do{' '}
            <span className="text-toca-accent">audiovisual</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            A plataforma que conecta contratantes e profissionais do audiovisual 
            de forma rápida, segura e prática.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-toca-accent hover:bg-toca-accent-hover">
              <Link to="/auth?mode=register">Começar agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/explore">Explorar profissionais</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-toca-text-primary mb-4">
              Como o <span className="text-toca-accent">Toca Aqui</span> funciona
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center card-hover">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-toca-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-toca-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Types Section */}
      <section className="py-20 px-4 bg-toca-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-toca-text-primary mb-4">
              Profissionais para seu evento
            </h2>
            <p className="text-xl text-toca-text-secondary max-w-2xl mx-auto">
              Encontre os melhores profissionais do audiovisual para tornar seu evento inesquecível.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {professionalTypes.map((type, index) => (
              <Card key={index} className="p-8 text-center card-hover">
                <div className="flex justify-center mb-4 text-toca-accent">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-toca-text-primary">
                  {type.name}
                </h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-toca-text-primary mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-toca-text-secondary mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais e contratantes no Toca Aqui. 
            Cadastre-se gratuitamente e comece agora mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-toca-accent hover:bg-toca-accent-hover">
              <Link to="/auth?mode=register">Criar minha conta</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Já tenho uma conta</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;