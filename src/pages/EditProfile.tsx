import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: 'João Silva',
    especialidade: 'Músico',
    descricao: 'Guitarrista profissional com mais de 10 anos de experiência...',
    preco_hora: '150',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '(11) 99999-9999',
    instagram: '@joaosilvamusico',
    youtube: 'https://youtube.com/joaosilva',
    experiencia_anos: '10',
    foto_perfil: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const specialties = [
    'Músico',
    'DJ',
    'Fotógrafo',
    'Videomaker',
    'Técnico de Som',
    'Iluminador',
    'Produtor Musical',
    'Cinegrafista',
    'Editor de Vídeo',
    'Outro',
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.especialidade.trim()) {
      newErrors.especialidade = 'Especialidade é obrigatória';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.preco_hora.trim()) {
      newErrors.preco_hora = 'Preço por hora é obrigatório';
    } else if (isNaN(Number(formData.preco_hora))) {
      newErrors.preco_hora = 'Preço deve ser um número válido';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      // Aqui seria a chamada para o Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular loading
      navigate('/profile');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-toca-text-secondary hover:text-toca-accent"
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold text-toca-text-primary">
            Editar Perfil Profissional
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-toca-border rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-toca-text-secondary text-sm">
                    Toque para
                    <br />
                    adicionar foto
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">
              Informações Básicas
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Nome Profissional
                </label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  placeholder="Seu nome como profissional"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-2">
                  Especialidade
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specialties.map((specialty) => (
                    <Button
                      key={specialty}
                      type="button"
                      variant={formData.especialidade === specialty ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFormData('especialidade', specialty)}
                      className={
                        formData.especialidade === specialty
                          ? 'bg-toca-accent text-white'
                          : 'border-toca-border text-toca-text-secondary hover:border-toca-accent'
                      }
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
                {errors.especialidade && (
                  <p className="text-red-500 text-xs mt-1">{errors.especialidade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Descrição
                </label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => updateFormData('descricao', e.target.value)}
                  placeholder="Conte sobre sua experiência e estilo..."
                  rows={4}
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.descricao && (
                  <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Location and Pricing */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">
              Localização e Preços
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Cidade
                </label>
                <Input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => updateFormData('cidade', e.target.value)}
                  placeholder="São Paulo"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.cidade && (
                  <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Estado
                </label>
                <Input
                  type="text"
                  value={formData.estado}
                  onChange={(e) => updateFormData('estado', e.target.value)}
                  placeholder="SP"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.estado && (
                  <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Preço por Hora (R$)
                </label>
                <Input
                  type="number"
                  value={formData.preco_hora}
                  onChange={(e) => updateFormData('preco_hora', e.target.value)}
                  placeholder="150"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.preco_hora && (
                  <p className="text-red-500 text-xs mt-1">{errors.preco_hora}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Anos de Experiência
                </label>
                <Input
                  type="number"
                  value={formData.experiencia_anos}
                  onChange={(e) => updateFormData('experiencia_anos', e.target.value)}
                  placeholder="5"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
              </div>
            </div>
          </Card>

          {/* Contact and Social */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">
              Contato e Redes Sociais
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Telefone
                </label>
                <Input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => updateFormData('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Instagram (opcional)
                </label>
                <Input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  placeholder="@seuusuario"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  YouTube (opcional)
                </label>
                <Input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => updateFormData('youtube', e.target.value)}
                  placeholder="https://youtube.com/seucanal"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-toca-accent hover:bg-toca-accent-hover text-white"
          >
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;