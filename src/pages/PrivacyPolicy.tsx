
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, ChevronLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-toca-text-secondary mr-4"
            >
              <Link to="/"><ChevronLeft size={16} /> Voltar</Link>
            </Button>
            
            <div className="flex items-center text-white">
              <Shield className="mr-2 h-6 w-6 text-toca-accent" />
              <h1 className="text-2xl font-bold">Política de Privacidade</h1>
            </div>
          </div>
          
          <Separator className="mb-6 bg-toca-border" />
          
          <div className="bg-toca-card rounded-lg border border-toca-border p-6 text-toca-text-secondary">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">1. Introdução</h2>
              <p className="mb-4">
                A plataforma Toca Aqui está comprometida com a proteção de sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais quando você utiliza nossos serviços.
              </p>
              <p>
                Ao utilizar o Toca Aqui, você concorda com a coleta e uso de informações de acordo com esta política. Recomendamos a leitura cuidadosa deste documento.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">2. Informações que Coletamos</h2>
              <h3 className="text-lg font-medium text-white mt-4 mb-2">Informações de Cadastro</h3>
              <p className="mb-4">
                Quando você se cadastra na plataforma Toca Aqui, coletamos informações como nome, e-mail, número de telefone, CPF ou CNPJ e dados para pagamento.
              </p>
              
              <h3 className="text-lg font-medium text-white mt-4 mb-2">Informações de Perfil</h3>
              <p className="mb-4">
                Para profissionais, coletamos informações adicionais como especialidade, portfólio, experiência e valores de serviços. Para contratantes, coletamos informações sobre eventos e necessidades específicas.
              </p>
              
              <h3 className="text-lg font-medium text-white mt-4 mb-2">Informações de Uso</h3>
              <p className="mb-4">
                Coletamos dados sobre como você interage com nossa plataforma, incluindo páginas visitadas, serviços pesquisados, tempo de uso e interações com outros usuários.
              </p>
              
              <h3 className="text-lg font-medium text-white mt-4 mb-2">Informações de Dispositivo</h3>
              <p>
                Coletamos informações sobre o dispositivo usado para acessar nossa plataforma, como modelo, sistema operacional, endereço IP e identificadores únicos do dispositivo.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">3. Como Usamos Suas Informações</h2>
              <p className="mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Facilitar conexões entre contratantes e profissionais;</li>
                <li>Processar pagamentos e transferências;</li>
                <li>Melhorar nossos serviços e desenvolver novos recursos;</li>
                <li>Enviar comunicações relevantes sobre serviços, atualizações ou eventos;</li>
                <li>Garantir a segurança da plataforma e prevenir fraudes;</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">4. Compartilhamento de Informações</h2>
              <p className="mb-4">
                Compartilhamos suas informações nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Entre contratantes e profissionais quando há uma contratação ou proposta de serviço;</li>
                <li>Com nossos prestadores de serviços e parceiros de processamento de pagamento;</li>
                <li>Para cumprir com obrigações legais ou responder a requisições legais;</li>
                <li>Para proteger os direitos, propriedade ou segurança do Toca Aqui, de nossos usuários ou do público.</li>
              </ul>
              <p>
                Não vendemos ou alugamos suas informações pessoais para terceiros para fins de marketing.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">5. Segurança das Informações</h2>
              <p className="mb-4">
                Implementamos medidas técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
              <p>
                Apesar de nossos esforços, nenhum sistema de segurança é impenetrável. Não podemos garantir a segurança absoluta de suas informações, mas nos esforçamos continuamente para manter as melhores práticas do setor.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">6. Seus Direitos</h2>
              <p className="mb-4">
                De acordo com as leis de proteção de dados aplicáveis, você tem direitos relacionados às suas informações pessoais, incluindo:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Acesso às suas informações pessoais;</li>
                <li>Correção de informações imprecisas ou incompletas;</li>
                <li>Exclusão de suas informações em determinadas circunstâncias;</li>
                <li>Restrição ou objeção ao processamento de suas informações;</li>
                <li>Portabilidade de dados;</li>
                <li>Retirada de consentimento a qualquer momento.</li>
              </ul>
              <p>
                Para exercer estes direitos, entre em contato conosco através do e-mail disponível na seção de contato.
              </p>
            </section>
            
            <section className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-4">7. Alterações na Política de Privacidade</h2>
              <p className="mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nosso site.
              </p>
              <p>
                Recomendamos que você revise esta política regularmente para estar informado sobre como estamos protegendo suas informações.
              </p>
            </section>
            
            <div className="text-sm mt-8 pt-4 border-t border-toca-border">
              <p>
                Última atualização: 15 de maio de 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
