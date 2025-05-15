
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ChevronLeft } from "lucide-react";

const TermsOfUse = () => {
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
              <FileText className="mr-2 h-6 w-6 text-toca-accent" />
              <h1 className="text-2xl font-bold">Termos de Uso</h1>
            </div>
          </div>
          
          <Separator className="mb-6 bg-toca-border" />
          
          <div className="bg-toca-card rounded-lg border border-toca-border p-6 text-toca-text-secondary">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e utilizar a plataforma Toca Aqui, você concorda com estes Termos de Uso em sua totalidade. Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nossos serviços.
              </p>
              <p>
                Estes termos constituem um acordo vinculativo entre você e o Toca Aqui, regendo o uso da plataforma e serviços oferecidos.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">
                O Toca Aqui é uma plataforma que conecta contratantes e profissionais do audiovisual para eventos e projetos. Atuamos como intermediários facilitando esta conexão e garantindo segurança para ambas as partes.
              </p>
              <p>
                Nossa plataforma permite que contratantes encontrem e contratem profissionais qualificados, enquanto profissionais podem oferecer seus serviços e receber por eles com segurança.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">3. Taxa de Serviço</h2>
              <p className="mb-4">
                O Toca Aqui cobra uma taxa fixa de 9,98% por profissional contratado. Esta taxa cobre o serviço de intermediação entre contratantes e profissionais.
              </p>
              <p>
                A taxa é aplicada ao valor total do serviço e é paga pelo contratante no momento do pagamento. Esta taxa garante a segurança da transação, o suporte da plataforma e a garantia de recebimento para o profissional.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">4. Cadastro e Contas</h2>
              <p className="mb-4">
                Para utilizar completamente os serviços do Toca Aqui, é necessário criar uma conta. Você concorda em fornecer informações precisas, atualizadas e completas durante o processo de registro.
              </p>
              <p className="mb-4">
                Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.
              </p>
              <p>
                O Toca Aqui se reserva o direito de recusar o serviço, encerrar contas, remover ou editar conteúdo a nosso critério exclusivo.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">5. Pagamentos e Reembolsos</h2>
              <p className="mb-4">
                Todos os pagamentos são processados através da plataforma Toca Aqui. O valor é mantido em custódia até a conclusão satisfatória do serviço pelo profissional.
              </p>
              <p className="mb-4">
                Reembolsos podem ser solicitados em casos de:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cancelamento pelo profissional com mais de 72 horas de antecedência do evento;</li>
                <li>Não comparecimento do profissional sem justificativa;</li>
                <li>Serviço executado em desacordo significativo com o contratado.</li>
              </ul>
              <p>
                Casos específicos serão analisados pela equipe do Toca Aqui, que terá a decisão final sobre reembolsos contestados.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">6. Responsabilidades</h2>
              <p className="mb-4">
                O Toca Aqui não se responsabiliza diretamente pela qualidade dos serviços prestados pelos profissionais cadastrados, atuando apenas como facilitador da conexão entre as partes.
              </p>
              <p className="mb-4">
                Os profissionais são responsáveis pela qualidade de seus serviços e pela veracidade das informações apresentadas em seus perfis.
              </p>
              <p>
                Os contratantes são responsáveis por detalhar adequadamente suas necessidades e por proporcionar condições adequadas para a execução dos serviços contratados.
              </p>
            </section>
            
            <section className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-4">7. Alterações nos Termos</h2>
              <p className="mb-4">
                O Toca Aqui reserva-se o direito de modificar estes termos a qualquer momento. As mudanças entrarão em vigor imediatamente após serem publicadas na plataforma.
              </p>
              <p>
                O uso continuado dos nossos serviços após quaisquer alterações constitui sua aceitação dos novos termos.
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

export default TermsOfUse;
