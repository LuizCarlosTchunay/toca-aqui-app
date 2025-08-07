
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="p-lg border-b border-border">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xxl font-bold text-accent">Toca Aqui</h1>
          <div className="flex gap-sm">
            <Link to="/auth">
              <Button variant="outline" title="Entrar" />
            </Link>
            <Link to="/auth?mode=register">
              <Button title="Cadastrar" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-xxl px-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xxxl font-bold mb-lg">
            Conectando talentos do <span className="text-accent">audiovisual</span>
          </h2>
          <p className="text-lg text-text-secondary mb-xl max-w-2xl mx-auto">
            A plataforma que conecta contratantes e profissionais do audiovisual. 
            Encontre o talento perfeito para seu evento ou mostre seu trabalho para o mundo.
          </p>
          <div className="flex gap-md justify-center">
            <Link to="/auth?mode=register">
              <Button size="lg" title="Começar Agora" />
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="lg" title="Explorar Talentos" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-xl px-lg bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xxl font-bold text-center mb-xl">Como funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <Card>
              <div className="text-center">
                <div className="text-xxxl mb-md">🎬</div>
                <h4 className="text-lg font-bold mb-sm">Para Contratantes</h4>
                <p className="text-text-secondary">
                  Crie eventos, encontre profissionais qualificados e gerencie suas contratações.
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-xxxl mb-md">🎥</div>
                <h4 className="text-lg font-bold mb-sm">Para Profissionais</h4>
                <p className="text-text-secondary">
                  Mostre seu portfólio, candidate-se a eventos e conecte-se com clientes.
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-xxxl mb-md">⭐</div>
                <h4 className="text-lg font-bold mb-sm">Avaliações</h4>
                <p className="text-text-secondary">
                  Sistema de avaliações para garantir qualidade e confiabilidade.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xxl px-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xxl font-bold mb-md">Pronto para começar?</h3>
          <p className="text-lg text-text-secondary mb-lg">
            Junte-se à comunidade de profissionais do audiovisual mais ativa do Brasil.
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" title="Criar Conta Gratuita" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border p-lg">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-text-secondary">
            © 2024 Toca Aqui. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
