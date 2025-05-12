
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={false} />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          
          <Card className="bg-toca-card border-toca-border mb-6">
            <CardHeader>
              <CardTitle>Sobre o Toca Aqui</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-toca-text-primary">
                Toca Aqui é uma plataforma que conecta contratantes a profissionais do audiovisual, 
                facilitando o processo de contratação e gerenciamento de eventos.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-4">Nossa Missão</h3>
              <p className="text-toca-text-primary">
                Conectar talentos do audiovisual com oportunidades de trabalho, simplificando 
                a forma como contratantes encontram e gerenciam profissionais para seus eventos.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-4">Profissionais</h3>
              <p className="text-toca-text-primary">
                Nossa plataforma conecta diversos tipos de profissionais:
              </p>
              <ul className="list-disc list-inside space-y-1 text-toca-text-primary pl-4">
                <li>Músicos (solo, duo, trio, banda)</li>
                <li>DJs</li>
                <li>Técnicos de som e luz</li>
                <li>Roadies</li>
                <li>Filmmakers</li>
                <li>Fotógrafos</li>
                <li>Empresas de estrutura de eventos</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mt-4">Como Funciona</h3>
              <p className="text-toca-text-primary">
                Para contratantes: Crie sua conta, explore profissionais, monte seu carrinho 
                e realize o pagamento com Pix ou cartão. Após o evento, avalie o serviço prestado.
              </p>
              <p className="text-toca-text-primary">
                Para profissionais: Ative seu perfil profissional, receba candidaturas ou reservas, 
                aceite ou recuse via painel e visualize seus eventos confirmados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
