import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = [
    'Todos',
    'Músicos',
    'DJs',
    'Fotógrafos',
    'Videomakers',
    'Técnicos de Som',
    'Iluminadores',
  ];

  const professionals = [
    {
      id: '1',
      nome: 'João Silva',
      especialidade: 'Músico',
      preco_hora: 150,
      avaliacao_media: 4.8,
      foto_perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      cidade: 'São Paulo',
      estado: 'SP',
      descricao: 'Guitarrista profissional com 10 anos de experiência em eventos corporativos e casamentos.',
    },
    {
      id: '2',
      nome: 'Maria Santos',
      especialidade: 'DJ',
      preco_hora: 200,
      avaliacao_media: 4.9,
      foto_perfil: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      descricao: 'DJ especializada em festas de casamento e eventos corporativos. Repertório diversificado.',
    },
    {
      id: '3',
      nome: 'Carlos Oliveira',
      especialidade: 'Fotógrafo',
      preco_hora: 120,
      avaliacao_media: 4.7,
      foto_perfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      descricao: 'Fotógrafo especializado em eventos sociais e corporativos. Estilo documental e artístico.',
    },
    {
      id: '4',
      nome: 'Ana Costa',
      especialidade: 'Videomaker',
      preco_hora: 180,
      avaliacao_media: 4.6,
      foto_perfil: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      cidade: 'Porto Alegre',
      estado: 'RS',
      descricao: 'Videomaker com foco em storytelling para eventos especiais e campanhas corporativas.',
    },
  ];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || prof.especialidade === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-toca-text-primary mb-4">
            Explorar Profissionais
          </h1>
          
          {/* Search */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar profissionais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-toca-card border-toca-border text-toca-input"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-toca-accent text-white'
                  : 'border-toca-border text-toca-text-secondary hover:border-toca-accent hover:text-toca-accent'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="p-6 bg-toca-card border-toca-border hover:border-toca-accent transition-colors">
              <Link to={`/profile/${professional.id}`}>
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={professional.foto_perfil}
                    alt={professional.nome}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-toca-text-primary">
                      {professional.nome}
                    </h3>
                    <p className="text-toca-accent text-sm font-medium">
                      {professional.especialidade}
                    </p>
                    <p className="text-toca-text-secondary text-sm">
                      {professional.cidade}, {professional.estado}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-toca-text-primary text-sm">
                        ⭐ {professional.avaliacao_media}
                      </span>
                      <span className="text-toca-accent font-bold text-sm">
                        R$ {professional.preco_hora}/hora
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-toca-text-secondary text-sm line-clamp-2">
                  {professional.descricao}
                </p>
              </Link>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-toca-text-secondary text-lg">
              Nenhum profissional encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;