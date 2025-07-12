import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {supabase} from '../lib/supabase';
import {RootStackParamList} from '../App';

type ExploreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Explore'
>;

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
}

const ExploreScreen = () => {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const {colors, spacing, fontSize, borderRadius} = useTheme();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('profissionais')
        .select('*')
        .limit(20);

      if (error) throw error;

      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.nome
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' || prof.especialidade === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProfessional = ({item}: {item: Professional}) => (
    <TouchableOpacity
      style={styles.professionalCard}
      onPress={() => navigation.navigate('Profile', {id: item.id})}
      activeOpacity={0.8}>
      <Card style={styles.cardContent}>
        <View style={styles.professionalHeader}>
          <Image
            source={{
              uri:
                item.foto_perfil ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            }}
            style={styles.profileImage}
          />
          <View style={styles.professionalInfo}>
            <Text style={styles.professionalName}>{item.nome}</Text>
            <Text style={styles.professionalSpecialty}>
              {item.especialidade}
            </Text>
            <Text style={styles.professionalLocation}>
              {item.cidade}, {item.estado}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.avaliacao_media || 5.0}</Text>
              <Text style={styles.price}>R$ {item.preco_hora}/hora</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.descricao ||
            'Profissional experiente com anos de atuação no mercado audiovisual.'}
        </Text>
      </Card>
    </TouchableOpacity>
  );

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
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    searchContainer: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      padding: 0,
    },
    categoriesContainer: {
      paddingVertical: spacing.md,
    },
    categoriesScroll: {
      paddingHorizontal: spacing.lg,
    },
    categoryButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeCategoryButton: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    categoryText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    activeCategoryText: {
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    professionalCard: {
      marginBottom: spacing.md,
    },
    cardContent: {
      padding: spacing.lg,
    },
    professionalHeader: {
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: spacing.md,
    },
    professionalInfo: {
      flex: 1,
    },
    professionalName: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    professionalSpecialty: {
      fontSize: fontSize.sm,
      color: colors.accent,
      marginBottom: spacing.xs,
    },
    professionalLocation: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rating: {
      fontSize: fontSize.sm,
      color: colors.textPrimary,
    },
    price: {
      fontSize: fontSize.sm,
      fontWeight: 'bold',
      color: colors.accent,
    },
    description: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: fontSize.sm * 1.4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyText: {
      fontSize: fontSize.lg,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.emptyText, {marginTop: spacing.md}]}>
            Carregando profissionais...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Profissionais</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar profissionais..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {filteredProfessionals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum profissional encontrado
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProfessionals}
            renderItem={renderProfessional}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: spacing.lg}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExploreScreen;