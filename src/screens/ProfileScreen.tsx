import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../lib/supabase';
import {RootStackParamList} from '../App';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface Professional {
  id: string;
  nome: string;
  especialidade: string;
  preco_hora: number;
  avaliacao_media: number;
  foto_perfil?: string;
  cidade: string;
  estado: string;
  descricao: string;
  telefone?: string;
  email?: string;
  instagram?: string;
  youtube?: string;
  experiencia_anos: number;
  servicos_oferecidos: string[];
}

interface PortfolioItem {
  id: string;
  titulo: string;
  descricao: string;
  url_midia: string;
  tipo_midia: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
  const {colors, spacing, fontSize, borderRadius} = useTheme();
  const {user} = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const profileId = route.params?.id;

  useEffect(() => {
    if (profileId) {
      fetchProfessional(profileId);
      setIsOwnProfile(false);
    } else {
      fetchOwnProfile();
      setIsOwnProfile(true);
    }
  }, [profileId]);

  const fetchProfessional = async (id: string) => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('profissionais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setProfessional(data);
      await fetchPortfolio(id);
    } catch (error) {
      console.error('Erro ao buscar profissional:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnProfile = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('profissionais')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        // Usuário não tem perfil profissional
        setProfessional(null);
        setLoading(false);
        return;
      }

      setProfessional(data);
      await fetchPortfolio(data.id);
    } catch (error) {
      console.error('Erro ao buscar perfil próprio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolio = async (professionalId: string) => {
    try {
      const {data, error} = await supabase
        .from('portfolio')
        .select('*')
        .eq('profissional_id', professionalId)
        .order('created_at', {ascending: false});

      if (error) throw error;

      setPortfolio(data || []);
    } catch (error) {
      console.error('Erro ao buscar portfólio:', error);
    }
  };

  const handleContact = (type: 'phone' | 'email' | 'instagram' | 'youtube') => {
    if (!professional) return;

    switch (type) {
      case 'phone':
        if (professional.telefone) {
          Linking.openURL(`tel:${professional.telefone}`);
        }
        break;
      case 'email':
        if (professional.email) {
          Linking.openURL(`mailto:${professional.email}`);
        }
        break;
      case 'instagram':
        if (professional.instagram) {
          Linking.openURL(`https://instagram.com/${professional.instagram}`);
        }
        break;
      case 'youtube':
        if (professional.youtube) {
          Linking.openURL(professional.youtube);
        }
        break;
    }
  };

  const renderPortfolioItem = (item: PortfolioItem) => (
    <TouchableOpacity key={item.id} style={styles.portfolioItem}>
      <Card style={styles.portfolioCard}>
        {item.tipo_midia === 'imagem' ? (
          <Image source={{uri: item.url_midia}} style={styles.portfolioImage} />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoIcon}>▶️</Text>
            <Text style={styles.videoText}>Vídeo</Text>
          </View>
        )}
        <View style={styles.portfolioInfo}>
          <Text style={styles.portfolioTitle}>{item.titulo}</Text>
          <Text style={styles.portfolioDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      paddingBottom: spacing.xl,
    },
    header: {
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: spacing.lg,
      borderWidth: 3,
      borderColor: colors.accent,
    },
    name: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    specialty: {
      fontSize: fontSize.lg,
      color: colors.accent,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    location: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    rating: {
      fontSize: fontSize.lg,
      color: colors.textPrimary,
      marginRight: spacing.md,
    },
    price: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.accent,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    actionButton: {
      flex: 1,
    },
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    description: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      lineHeight: fontSize.md * 1.5,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    infoItem: {
      flex: 1,
      minWidth: '45%',
    },
    infoLabel: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    infoValue: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    servicesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    serviceTag: {
      backgroundColor: colors.card,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.border,
    },
    serviceText: {
      fontSize: fontSize.sm,
      color: colors.textPrimary,
    },
    contactButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    contactButton: {
      flex: 1,
    },
    portfolioGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    portfolioItem: {
      width: '48%',
    },
    portfolioCard: {
      padding: 0,
      overflow: 'hidden',
    },
    portfolioImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    videoPlaceholder: {
      width: '100%',
      height: 120,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoIcon: {
      fontSize: fontSize.xxl,
      marginBottom: spacing.xs,
    },
    videoText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    portfolioInfo: {
      padding: spacing.md,
    },
    portfolioTitle: {
      fontSize: fontSize.sm,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    portfolioDescription: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.emptyText, {marginTop: spacing.md}]}>
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!professional) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {isOwnProfile
              ? 'Você ainda não criou seu perfil profissional'
              : 'Perfil não encontrado'}
          </Text>
          {isOwnProfile && (
            <Button
              title="Criar Perfil Profissional"
              onPress={() => navigation.navigate('EditProfile')}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                professional.foto_perfil ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=face',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{professional.nome}</Text>
          <Text style={styles.specialty}>{professional.especialidade}</Text>
          <Text style={styles.location}>
            {professional.cidade}, {professional.estado}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {professional.avaliacao_media || 5.0}
            </Text>
            <Text style={styles.price}>R$ {professional.preco_hora}/hora</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isOwnProfile ? (
            <Button
              title="Editar Perfil"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.actionButton}
            />
          ) : (
            <>
              <Button
                title="Contratar"
                onPress={() => {}}
                style={styles.actionButton}
              />
              <Button
                title="Mensagem"
                onPress={() => {}}
                variant="outline"
                style={styles.actionButton}
              />
            </>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Card>
            <Text style={styles.description}>
              {professional.descricao ||
                'Profissional experiente com anos de atuação no mercado audiovisual.'}
            </Text>
          </Card>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <Card>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Experiência</Text>
                <Text style={styles.infoValue}>
                  {professional.experiencia_anos || 5} anos
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Avaliação</Text>
                <Text style={styles.infoValue}>
                  {professional.avaliacao_media || 5.0}/5.0
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Services */}
        {professional.servicos_oferecidos &&
          professional.servicos_oferecidos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
              <View style={styles.servicesContainer}>
                {professional.servicos_oferecidos.map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Contact */}
        {!isOwnProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contato</Text>
            <View style={styles.contactButtons}>
              {professional.telefone && (
                <Button
                  title="📞 Telefone"
                  onPress={() => handleContact('phone')}
                  variant="outline"
                  size="sm"
                  style={styles.contactButton}
                />
              )}
              {professional.email && (
                <Button
                  title="✉️ Email"
                  onPress={() => handleContact('email')}
                  variant="outline"
                  size="sm"
                  style={styles.contactButton}
                />
              )}
            </View>
          </View>
        )}

        {/* Portfolio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfólio</Text>
          {portfolio.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>
                {isOwnProfile
                  ? 'Adicione trabalhos ao seu portfólio'
                  : 'Nenhum trabalho no portfólio'}
              </Text>
            </Card>
          ) : (
            <View style={styles.portfolioGrid}>
              {portfolio.map(renderPortfolioItem)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;