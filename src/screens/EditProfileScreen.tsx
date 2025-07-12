import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
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

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const {colors, spacing, fontSize, borderRadius} = useTheme();
  const {user, currentRole} = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    descricao: '',
    preco_hora: '',
    cidade: '',
    estado: '',
    telefone: '',
    instagram: '',
    youtube: '',
    experiencia_anos: '',
    foto_perfil: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  useEffect(() => {
    if (currentRole === 'profissional') {
      fetchProfile();
    }
  }, [currentRole]);

  const fetchProfile = async () => {
    try {
      const {data, error} = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Perfil não existe
          setHasProfile(false);
          return;
        }
        throw error;
      }

      setHasProfile(true);
      setFormData({
        nome: data.nome || '',
        especialidade: data.especialidade || '',
        descricao: data.descricao || '',
        preco_hora: data.preco_hora?.toString() || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        telefone: data.telefone || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        experiencia_anos: data.experiencia_anos?.toString() || '',
        foto_perfil: data.foto_perfil || '',
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

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

    if (formData.experiencia_anos && isNaN(Number(formData.experiencia_anos))) {
      newErrors.experiencia_anos = 'Anos de experiência deve ser um número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const profileData = {
        user_id: user?.id,
        nome: formData.nome,
        especialidade: formData.especialidade,
        descricao: formData.descricao,
        preco_hora: Number(formData.preco_hora),
        cidade: formData.cidade,
        estado: formData.estado,
        telefone: formData.telefone || null,
        instagram: formData.instagram || null,
        youtube: formData.youtube || null,
        experiencia_anos: formData.experiencia_anos
          ? Number(formData.experiencia_anos)
          : null,
        foto_perfil: formData.foto_perfil || null,
      };

      let error;

      if (hasProfile) {
        // Atualizar perfil existente
        const result = await supabase
          .from('profissionais')
          .update(profileData)
          .eq('user_id', user?.id);
        error = result.error;
      } else {
        // Criar novo perfil
        const result = await supabase
          .from('profissionais')
          .insert([profileData]);
        error = result.error;
      }

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: hasProfile
          ? 'Perfil atualizado com sucesso!'
          : 'Perfil criado com sucesso!',
      });

      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar perfil',
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

  const handleImagePicker = () => {
    Alert.alert('Funcionalidade em desenvolvimento', 'Upload de imagens será implementado em breve');
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
    imageSection: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      marginBottom: spacing.md,
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    imagePlaceholderText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    specialtySelector: {
      marginBottom: spacing.md,
    },
    specialtyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    specialtyButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedSpecialty: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    specialtyText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    selectedSpecialtyText: {
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
        <Text style={styles.title}>
          {hasProfile ? 'Editar Perfil' : 'Criar Perfil Profissional'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={handleImagePicker}>
              {formData.foto_perfil ? (
                <Image
                  source={{uri: formData.foto_perfil}}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>
                    Toque para{'\n'}adicionar foto
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>

            <Input
              label="Nome Profissional"
              value={formData.nome}
              onChangeText={text => updateFormData('nome', text)}
              error={errors.nome}
              placeholder="Seu nome como profissional"
            />

            <View style={styles.specialtySelector}>
              <Text style={styles.sectionTitle}>Especialidade</Text>
              <View style={styles.specialtyGrid}>
                {specialties.map(specialty => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.specialtyButton,
                      formData.especialidade === specialty &&
                        styles.selectedSpecialty,
                    ]}
                    onPress={() => updateFormData('especialidade', specialty)}>
                    <Text
                      style={[
                        styles.specialtyText,
                        formData.especialidade === specialty &&
                          styles.selectedSpecialtyText,
                      ]}>
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.especialidade && (
                <Text style={{color: colors.error, fontSize: fontSize.xs}}>
                  {errors.especialidade}
                </Text>
              )}
            </View>

            <Input
              label="Descrição"
              value={formData.descricao}
              onChangeText={text => updateFormData('descricao', text)}
              error={errors.descricao}
              placeholder="Conte sobre sua experiência e estilo..."
              multiline
              numberOfLines={4}
            />
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Localização e Preços</Text>

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

            <View style={styles.row}>
              <Input
                label="Preço por Hora (R$)"
                value={formData.preco_hora}
                onChangeText={text => updateFormData('preco_hora', text)}
                error={errors.preco_hora}
                placeholder="150"
                keyboardType="numeric"
                containerStyle={styles.halfWidth}
              />

              <Input
                label="Anos de Experiência"
                value={formData.experiencia_anos}
                onChangeText={text => updateFormData('experiencia_anos', text)}
                error={errors.experiencia_anos}
                placeholder="5"
                keyboardType="numeric"
                containerStyle={styles.halfWidth}
              />
            </View>
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Contato e Redes Sociais</Text>

            <Input
              label="Telefone"
              value={formData.telefone}
              onChangeText={text => updateFormData('telefone', text)}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />

            <Input
              label="Instagram (opcional)"
              value={formData.instagram}
              onChangeText={text => updateFormData('instagram', text)}
              placeholder="@seuusuario"
            />

            <Input
              label="YouTube (opcional)"
              value={formData.youtube}
              onChangeText={text => updateFormData('youtube', text)}
              placeholder="https://youtube.com/seucanal"
            />
          </Card>

          <Button
            title={hasProfile ? 'Atualizar Perfil' : 'Criar Perfil'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;