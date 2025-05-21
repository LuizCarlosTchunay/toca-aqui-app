
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-toca-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Bem-vindo à Tocata</h1>
          <p className="text-toca-text-secondary max-w-lg mb-8">
            Conectando músicos e artistas aos melhores eventos. 
            Encontre os profissionais certos para seu evento ou ofereça seus serviços.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link to="/explorar">
              <Button variant="default" className="bg-toca-accent hover:bg-toca-accent-hover">
                Explorar Profissionais
              </Button>
            </Link>
            <Link to="/eventos">
              <Button variant="outline" className="border-toca-accent text-white hover:bg-toca-accent/10">
                Ver Eventos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
