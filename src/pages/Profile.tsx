import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwnProfile = !id; // Se não tem ID, é o próprio perfil

  // Mock data - em produção viria do Supabase
  const professional = {
    id: id || 'own',
    nome: 'João Silva',
    especialidade: 'Músico',
    preco_hora: 150,
    avaliacao_media: 4.8,
    foto_perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=face',
    cidade: 'São Paulo',
    estado: 'SP',
    descricao: 'Guitarrista profissional com mais de 10 anos de experiência em eventos corporativos, casamentos e shows. Especializado em rock, pop e MPB. Possuo equipamento próprio de alta qualidade.',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    instagram: '@joaosilvamusico',
    youtube: 'https://youtube.com/joaosilva',
    experiencia_anos: 10,
    servicos_oferecidos: ['Música ao vivo', 'DJ', 'Sonorização', 'Iluminação básica'],
  };

  const portfolio = [
    {
      id: '1',
      titulo: 'Casamento Marina & Pedro',
      descricao: 'Show acústico durante cerimônia e festa',
      url_midia: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop',
      tipo_midia: 'imagem',
    },
    {
      id: '2',
      titulo: 'Evento Corporativo Tech Summit',
      descricao: 'Apresentação musical de abertura',
      url_midia: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
      tipo_midia: 'imagem',
    },
    {
      id: '3',
      titulo: 'Show no Bar do Rock',
      descricao: 'Apresentação solo com repertório autoral',
      url_midia: 'video',
      tipo_midia: 'video',
    },
    {
      id: '4',
      titulo: 'Festa de Aniversário',
      descricao: 'Música ambiente e animação',
      url_midia: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
      tipo_midia: 'imagem',
    },
  ];

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <img
            src={professional.foto_perfil}
            alt={professional.nome}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-toca-accent"
          />
          <h1 className="text-3xl font-bold text-toca-text-primary mb-2">
            {professional.nome}
          </h1>
          <p className="text-xl text-toca-accent mb-2">{professional.especialidade}</p>
          <p className="text-toca-text-secondary mb-4">
            {professional.cidade}, {professional.estado}
          </p>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-lg text-toca-text-primary">
              ⭐ {professional.avaliacao_media}
            </span>
            <span className="text-lg font-bold text-toca-accent">
              R$ {professional.preco_hora}/hora
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {isOwnProfile ? (
            <Button asChild className="bg-toca-accent hover:bg-toca-accent-hover">
              <Link to="/edit-profile">Editar Perfil</Link>
            </Button>
          ) : (
            <>
              <Button className="bg-toca-accent hover:bg-toca-accent-hover">
                Contratar
              </Button>
              <Button variant="outline" className="border-toca-accent text-toca-accent">
                Mensagem
              </Button>
            </>
          )}
        </div>

        {/* About */}
        <Card className="p-6 bg-toca-card border-toca-border">
          <h3 className="text-xl font-bold text-toca-text-primary mb-4">Sobre</h3>
          <p className="text-toca-text-secondary leading-relaxed">
            {professional.descricao}
          </p>
        </Card>

        {/* Info */}
        <Card className="p-6 bg-toca-card border-toca-border">
          <h3 className="text-xl font-bold text-toca-text-primary mb-4">Informações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-toca-text-secondary">Experiência:</span>
              <span className="text-toca-text-primary ml-2 font-medium">
                {professional.experiencia_anos} anos
              </span>
            </div>
            <div>
              <span className="text-toca-text-secondary">Avaliação:</span>
              <span className="text-toca-text-primary ml-2 font-medium">
                {professional.avaliacao_media}/5.0
              </span>
            </div>
          </div>
        </Card>

        {/* Services */}
        <Card className="p-6 bg-toca-card border-toca-border">
          <h3 className="text-xl font-bold text-toca-text-primary mb-4">
            Serviços Oferecidos
          </h3>
          <div className="flex flex-wrap gap-2">
            {professional.servicos_oferecidos.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-toca-background border border-toca-border rounded-full text-sm text-toca-text-primary"
              >
                {service}
              </span>
            ))}
          </div>
        </Card>

        {/* Contact */}
        {!isOwnProfile && (
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">Contato</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-toca-accent text-toca-accent">
                📞 Telefone
              </Button>
              <Button variant="outline" size="sm" className="border-toca-accent text-toca-accent">
                ✉️ Email
              </Button>
              <Button variant="outline" size="sm" className="border-toca-accent text-toca-accent">
                📱 Instagram
              </Button>
            </div>
          </Card>
        )}

        {/* Portfolio */}
        <Card className="p-6 bg-toca-card border-toca-border">
          <h3 className="text-xl font-bold text-toca-text-primary mb-4">Portfólio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.map((item) => (
              <div key={item.id} className="bg-toca-background rounded-lg overflow-hidden border border-toca-border">
                {item.tipo_midia === 'imagem' ? (
                  <img
                    src={item.url_midia}
                    alt={item.titulo}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-toca-card flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">▶️</div>
                      <div className="text-toca-text-secondary text-sm">Vídeo</div>
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-bold text-toca-text-primary text-sm mb-1">
                    {item.titulo}
                  </h4>
                  <p className="text-toca-text-secondary text-xs">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;