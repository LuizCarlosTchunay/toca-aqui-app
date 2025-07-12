import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../lib/supabase';
import {RootStackParamList} from '../App';

type EventsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Events'
>;

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  horario_inicio: string;
  horario_fim: string;
  local: string;
  cidade: string;
  estado: string;
  orcamento: number;
  status: string;
  tipo_evento: string;
  created_at: string;
}

const EventsScreen = () => {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const {colors, spacing, fontSize, borderRadius} = useTheme();
  const {user, currentRole} = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'my-events'>(
    currentRole === 'contratante' ? 'my-events' : 'available',
  );

  useEffect(() => {
    fetchEvents();
  }, [activeTab, currentRole]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase.from('eventos').select('*');

      if (activeTab === 'my-events' && currentRole === 'contratante') {
        query = query.eq('contratante_id', user?.id);
      } else {
        query = query.eq('status', 'ativo').limit(20);
      }

      const {data, error} = await query.order('data_evento', {
        ascending: true,
      });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return colors.success;
      case 'cancelado':
        return colors.error;
      case 'concluido':
        return colors.textSecondary;
      default:
        return colors.accent;
    }
  };

  const renderEvent = ({item}: {item: Event}) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.8}>
      <Card style={styles.cardContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{item.titulo}</Text>
            <Text style={styles.eventType}>{item.tipo_evento}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status)},
            ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.descricao}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Data:</Text>
            <Text style={styles.detailValue}>{formatDate(item.data_evento)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ Horário:</Text>
            <Text style={styles.detailValue}>
              {formatTime(item.horario_inicio)} - {formatTime(item.horario_fim)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Local:</Text>
            <Text style={styles.detailValue}>
              {item.local}, {item.cidade}/{item.estado}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💰 Orçamento:</Text>
            <Text style={styles.detailValue}>
              R$ {item.orcamento.toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>

        <View style={styles.eventActions}>
          {currentRole === 'profissional' && activeTab === 'available' && (
            <Button
              title="Candidatar-se"
              onPress={() => {}}
              size="sm"
              style={styles.actionButton}
            />
          )}
          {currentRole === 'contratante' && activeTab === 'my-events' && (
            <Button
              title="Ver Candidaturas"
              onPress={() => {}}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
          )}
          <Button
            title="Ver Detalhes"
            onPress={() => {}}
            variant="ghost"
            size="sm"
          />
        </View>
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
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    activeTab: {
      backgroundColor: colors.accent,
    },
    tabText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    activeTabText: {
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    createButton: {
      marginBottom: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventCard: {
      marginBottom: spacing.md,
    },
    cardContent: {
      padding: spacing.lg,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    eventInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    eventTitle: {
      fontSize: fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    eventType: {
      fontSize: fontSize.sm,
      color: colors.accent,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    statusText: {
      fontSize: fontSize.xs,
      color: colors.textPrimary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    eventDescription: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: fontSize.sm * 1.4,
      marginBottom: spacing.md,
    },
    eventDetails: {
      marginBottom: spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    detailLabel: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      flex: 1,
    },
    detailValue: {
      fontSize: fontSize.sm,
      color: colors.textPrimary,
      flex: 2,
      textAlign: 'right',
    },
    eventActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      flex: 1,
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
            Carregando eventos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'available' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('available')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'available' && styles.activeTabText,
              ]}>
              {currentRole === 'profissional' ? 'Disponíveis' : 'Explorar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'my-events' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('my-events')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'my-events' && styles.activeTabText,
              ]}>
              {currentRole === 'contratante' ? 'Meus Eventos' : 'Candidaturas'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {currentRole === 'contratante' && activeTab === 'my-events' && (
          <Button
            title="Criar Novo Evento"
            onPress={() => navigation.navigate('CreateEvent')}
            style={styles.createButton}
          />
        )}

        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'available'
                ? 'Nenhum evento disponível no momento'
                : 'Você ainda não tem eventos'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: spacing.lg}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventsScreen;