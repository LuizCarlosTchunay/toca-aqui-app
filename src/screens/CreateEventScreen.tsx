import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../lib/supabase';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../App';

type CreateEventScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateEvent'
>;

const CreateEventScreen = () => {
  const navigation = useNavigation<CreateEventScreenNavigationProp>();
  const {colors, spacing, fontSize} = useTheme();
  const {user} = useAuth();
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

  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    const newErrors: {[key: string]: string} = {};

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const eventData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo_evento: formData.tipo_evento,
        data_evento: formData.data_evento,
        horario_inicio: formData.horario_inicio,
        horario_fim: formData.horario_fim,
        local: formData.local,
        cidade: formData.cidade,
        estado: formData.estado,
        orcamento: Number(formData.orcamento),
        observacoes: formData.observacoes,
        contratante_id: user?.id,
        status: 'ativo',
      };

      const {error} = await supabase.from('eventos').insert([eventData]);

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Evento criado com sucesso!',
        text2: 'Seu evento já está disponível para candidaturas.',
      });

      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar evento',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: spacing.md,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    scrollContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    typeSelector: {
      marginBottom: spacing.md,
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    typeButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedType: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    typeText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    selectedTypeText: {
      color: colors.textPrimary,
    },
    submitButton: {
      marginTop: spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Voltar"
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.backButton}
        />
        <Text style={styles.title}>Criar Evento</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>

            <Input
              label="Título do Evento"
              value={formData.titulo}
              onChangeText={text => updateFormData('titulo', text)}
              error={errors.titulo}
              placeholder="Ex: Casamento João e Maria"
            />

            <Input
              label="Descrição"
              value={formData.descricao}
              onChangeText={text => updateFormData('descricao', text)}
              error={errors.descricao}
              placeholder="Descreva seu evento..."
              multiline
              numberOfLines={4}
            />

            <View style={styles.typeSelector}>
              <Text style={styles.sectionTitle}>Tipo de Evento</Text>
              <View style={styles.typeGrid}>
                {eventTypes.map(type => (
                  <Button
                    key={type}
                    title={type}
                    onPress={() => updateFormData('tipo_evento', type)}
                    variant={
                      formData.tipo_evento === type ? 'primary' : 'outline'
                    }
                    size="sm"
                  />
                ))}
              </View>
              {errors.tipo_evento && (
                <Text style={{color: colors.error, fontSize: fontSize.xs}}>
                  {errors.tipo_evento}
                </Text>
              )}
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Data e Horário</Text>

            <Input
              label="Data do Evento"
              value={formData.data_evento}
              onChangeText={text => updateFormData('data_evento', text)}
              error={errors.data_evento}
              placeholder="DD/MM/AAAA"
            />

            <View style={styles.row}>
              <Input
                label="Horário de Início"
                value={formData.horario_inicio}
                onChangeText={text => updateFormData('horario_inicio', text)}
                error={errors.horario_inicio}
                placeholder="HH:MM"
                containerStyle={styles.halfWidth}
              />

              <Input
                label="Horário de Fim"
                value={formData.horario_fim}
                onChangeText={text => updateFormData('horario_fim', text)}
                error={errors.horario_fim}
                placeholder="HH:MM"
                containerStyle={styles.halfWidth}
              />
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Local</Text>

            <Input
              label="Endereço/Local"
              value={formData.local}
              onChangeText={text => updateFormData('local', text)}
              error={errors.local}
              placeholder="Ex: Salão de Festas ABC, Rua das Flores, 123"
            />

            <View style={styles.row}>
              <Input
                label="Cidade"
                value={formData.cidade}
                onChangeText={text => updateFormData('cidade', text)}
                error={errors.cidade}
                placeholder="São Paulo"
                containerStyle={styles.halfWidth}
              />

              <Input
                label="Estado"
                value={formData.estado}
                onChangeText={text => updateFormData('estado', text)}
                error={errors.estado}
                placeholder="SP"
                containerStyle={styles.halfWidth}
              />
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Orçamento</Text>

            <Input
              label="Orçamento Total (R$)"
              value={formData.orcamento}
              onChangeText={text => updateFormData('orcamento', text)}
              error={errors.orcamento}
              placeholder="5000"
              keyboardType="numeric"
            />

            <Input
              label="Observações (Opcional)"
              value={formData.observacoes}
              onChangeText={text => updateFormData('observacoes', text)}
              placeholder="Informações adicionais sobre o evento..."
              multiline
              numberOfLines={3}
            />
          </Card>

          <Button
            title="Criar Evento"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateEventScreen;