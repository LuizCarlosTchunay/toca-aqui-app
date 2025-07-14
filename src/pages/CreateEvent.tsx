import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo_evento: '',
    data_evento: '',
    horario_inicio: '',
    horario_fim: '',
    local: '',
    cidade: '',
    estado: '',
    orcamento: '',
    observacoes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const eventTypes = [
    'Casamento',
    'Festa de Aniversário',
    'Evento Corporativo',
    'Show Musical',
    'Festival',
    'Formatura',
    'Festa Infantil',
    'Evento Religioso',
    'Outro',
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.tipo_evento.trim()) {
      newErrors.tipo_evento = 'Tipo de evento é obrigatório';
    }

    if (!formData.data_evento.trim()) {
      newErrors.data_evento = 'Data do evento é obrigatória';
    }

    if (!formData.horario_inicio.trim()) {
      newErrors.horario_inicio = 'Horário de início é obrigatório';
    }

    if (!formData.horario_fim.trim()) {
      newErrors.horario_fim = 'Horário de fim é obrigatório';
    }

    if (!formData.local.trim()) {
      newErrors.local = 'Local é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.orcamento.trim()) {
      newErrors.orcamento = 'Orçamento é obrigatório';
    } else if (isNaN(Number(formData.orcamento))) {
      newErrors.orcamento = 'Orçamento deve ser um número válido';
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
      navigate('/events');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
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
          <h1 className="text-3xl font-bold text-toca-text-primary">Criar Evento</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">
              Informações Básicas
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Título do Evento
                </label>
                <Input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => updateFormData('titulo', e.target.value)}
                  placeholder="Ex: Casamento João e Maria"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.titulo && (
                  <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Descrição
                </label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => updateFormData('descricao', e.target.value)}
                  placeholder="Descreva seu evento..."
                  rows={4}
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.descricao && (
                  <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-2">
                  Tipo de Evento
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {eventTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.tipo_evento === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFormData('tipo_evento', type)}
                      className={
                        formData.tipo_evento === type
                          ? 'bg-toca-accent text-white'
                          : 'border-toca-border text-toca-text-secondary hover:border-toca-accent'
                      }
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                {errors.tipo_evento && (
                  <p className="text-red-500 text-xs mt-1">{errors.tipo_evento}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Date and Time */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">
              Data e Horário
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Data do Evento
                </label>
                <Input
                  type="date"
                  value={formData.data_evento}
                  onChange={(e) => updateFormData('data_evento', e.target.value)}
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.data_evento && (
                  <p className="text-red-500 text-xs mt-1">{errors.data_evento}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-toca-text-primary mb-1">
                    Horário de Início
                  </label>
                  <Input
                    type="time"
                    value={formData.horario_inicio}
                    onChange={(e) => updateFormData('horario_inicio', e.target.value)}
                    className="bg-toca-card border-toca-border text-toca-input"
                  />
                  {errors.horario_inicio && (
                    <p className="text-red-500 text-xs mt-1">{errors.horario_inicio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-toca-text-primary mb-1">
                    Horário de Fim
                  </label>
                  <Input
                    type="time"
                    value={formData.horario_fim}
                    onChange={(e) => updateFormData('horario_fim', e.target.value)}
                    className="bg-toca-card border-toca-border text-toca-input"
                  />
                  {errors.horario_fim && (
                    <p className="text-red-500 text-xs mt-1">{errors.horario_fim}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">Local</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Endereço/Local
                </label>
                <Input
                  type="text"
                  value={formData.local}
                  onChange={(e) => updateFormData('local', e.target.value)}
                  placeholder="Ex: Salão de Festas ABC, Rua das Flores, 123"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.local && (
                  <p className="text-red-500 text-xs mt-1">{errors.local}</p>
                )}
              </div>

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
              </div>
            </div>
          </Card>

          {/* Budget */}
          <Card className="p-6 bg-toca-card border-toca-border">
            <h3 className="text-xl font-bold text-toca-text-primary mb-4">Orçamento</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Orçamento Total (R$)
                </label>
                <Input
                  type="number"
                  value={formData.orcamento}
                  onChange={(e) => updateFormData('orcamento', e.target.value)}
                  placeholder="5000"
                  className="bg-toca-card border-toca-border text-toca-input"
                />
                {errors.orcamento && (
                  <p className="text-red-500 text-xs mt-1">{errors.orcamento}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-toca-text-primary mb-1">
                  Observações (Opcional)
                </label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => updateFormData('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre o evento..."
                  rows={3}
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
            {loading ? 'Criando...' : 'Criar Evento'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;