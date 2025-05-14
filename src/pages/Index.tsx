
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { ChevronRight, Music, Camera, Disc, Film, Users, CheckCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Conecte-se com profissionais",
      description: "Encontre músicos, DJs, técnicos e outros profissionais do audiovisual para seus eventos.",
      icon: <Users className="h-10 w-10 text-toca-accent" />,
    },
    {
      title: "Gerencie seus eventos",
      description: "Crie e gerencie eventos, adicione serviços necessários e receba candidaturas de profissionais.",
      icon: <Film className="h-10 w-10 text-toca-accent" />,
    },
    {
      title: "Pagamentos seguros",
      description: "Utilize nosso sistema de pagamento seguro com Pix, cartão de crédito ou débito.",
      icon: <CheckCheck className="h-10 w-10 text-toca-accent" />,
    },
  ];

  const professionalTypes = [
    { name: "Músicos", icon: <Music size={32} className="mb-4 text-toca-accent" /> },
    { name: "DJs", icon: <Disc size={32} className="mb-4 text-toca-accent" /> },
    { name: "Fotógrafos", icon: <Camera size={32} className="mb-4 text-toca-accent" /> },
    { name: "Filmmakers", icon: <Film size={32} className="mb-4 text-toca-accent" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black to-toca-background">
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1527576539890-dfa815648363)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <Logo size="lg" withText={false} className="mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Conectando talentos do audiovisual
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto">
              A plataforma que conecta contratantes e profissionais do audiovisual 
              de forma rápida, segura e prática.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-toca-accent hover:bg-toca-accent-hover text-lg px-8 py-6"
                onClick={() => navigate("/cadastro")}
              >
                Começar agora
              </Button>
              <Button 
                variant="outline"
                className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white text-lg px-8 py-6"
                onClick={() => navigate("/explorar")}
              >
                Explorar profissionais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-toca-card to-toca-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Como o <span className="text-toca-accent">Toca Aqui</span> funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-toca-border rounded-lg bg-toca-card hover:border-toca-accent transition-all">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-toca-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">
            Profissionais para seu evento
          </h2>
          <p className="text-toca-text-secondary text-xl text-center mb-16 max-w-2xl mx-auto">
            Encontre os melhores profissionais do audiovisual para tornar seu evento inesquecível.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {professionalTypes.map((type, index) => (
              <div 
                key={index}
                className="text-center p-8 border border-toca-border rounded-lg hover:border-toca-accent transition-all cursor-pointer bg-toca-card"
                onClick={() => navigate(`/explorar?tipo=${type.name.toLowerCase()}`)}
              >
                {type.icon}
                <h3 className="text-xl font-semibold text-white">{type.name}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
              onClick={() => navigate("/explorar")}
            >
              Ver todos os profissionais <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-toca-card py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Pronto para começar?
            </h2>
            <p className="text-toca-text-secondary text-xl mb-8">
              Junte-se a milhares de profissionais e contratantes no Toca Aqui. 
              Cadastre-se gratuitamente e comece agora mesmo!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-toca-accent hover:bg-toca-accent-hover text-lg px-8 py-6"
                onClick={() => navigate("/cadastro")}
              >
                Criar minha conta
              </Button>
              <Button 
                variant="outline"
                className="border-toca-accent text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => navigate("/login")}
              >
                Já tenho uma conta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="mb-6 md:mb-0" />
            <div className="flex flex-col md:flex-row gap-6">
              <Link to="/sobre" className="text-toca-text-secondary hover:text-white transition">Sobre nós</Link>
              <Link to="/termos" className="text-toca-text-secondary hover:text-white transition">Termos de uso</Link>
              <Link to="/privacidade" className="text-toca-text-secondary hover:text-white transition">Política de privacidade</Link>
              <Link to="/contato" className="text-toca-text-secondary hover:text-white transition">Contato</Link>
            </div>
          </div>
          <div className="border-t border-toca-border mt-8 pt-8 text-center text-toca-text-secondary">
            <p>&copy; {new Date().getFullYear()} Toca Aqui. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
