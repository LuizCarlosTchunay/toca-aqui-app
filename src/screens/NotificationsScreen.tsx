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
import {useTheme} from '../contexts/ThemeContext';
import {Card} from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import {useAuth} from '../hooks/useAuth';
import {supabase} from '../lib/supabase';

interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  created_at: string;
  data_relacionada?: any;
}

const NotificationsScreen = () => {
  const {colors, spacing, fontSize, borderRadius} = useTheme();
  const {user} = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', {ascending: false})
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const {error} = await supabase
        .from('notifications')
        .update({lida: true})
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? {...notif, lida: true} : notif,
        ),
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const {error} = await supabase
        .from('notifications')
        .update({lida: true})
        .eq('user_id', user?.id)
        .eq('lida', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({...notif, lida: true})),
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'candidatura':
        return '👤';
      case 'evento':
        return '🎉';
      case 'pagamento':
        return '💰';
      case 'mensagem':
        return '💬';
      case 'avaliacao':
        return '⭐';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' ? true : !notif.lida,
  );

  const unreadCount = notifications.filter(notif => !notif.lida).length;

  const renderNotification = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => !item.lida && markAsRead(item.id)}
      activeOpacity={0.8}>
      <Card style={[styles.notificationCard, !item.lida && styles.unreadCard]}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            <Text style={styles.iconText}>{getNotificationIcon(item.tipo)}</Text>
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.titulo}</Text>
            <Text style={styles.notificationTime}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          {!item.lida && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.mensagem}</Text>
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
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    unreadBadge: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    unreadText: {
      fontSize: fontSize.xs,
      color: colors.textPrimary,
      fontWeight: 'bold',
    },
    filterContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      padding: 4,
    },
    filterButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    activeFilter: {
      backgroundColor: colors.accent,
    },
    filterText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    activeFilterText: {
      color: colors.textPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationItem: {
      marginBottom: spacing.md,
    },
    notificationCard: {
      padding: spacing.lg,
    },
    unreadCard: {
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    iconText: {
      fontSize: fontSize.lg,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: fontSize.md,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    notificationTime: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
      marginLeft: spacing.sm,
    },
    notificationMessage: {
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
            Carregando notificações...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount} não lidas</Text>
            </View>
          )}
          
          {unreadCount > 0 && (
            <Button
              title="Marcar todas como lidas"
              onPress={markAllAsRead}
              variant="ghost"
              size="sm"
            />
          )}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilter,
            ]}
            onPress={() => setFilter('all')}>
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.activeFilterText,
              ]}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'unread' && styles.activeFilter,
            ]}
            onPress={() => setFilter('unread')}>
            <Text
              style={[
                styles.filterText,
                filter === 'unread' && styles.activeFilterText,
              ]}>
              Não lidas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Você não tem notificações'
                : 'Todas as notificações foram lidas'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotifications}
            renderItem={renderNotification}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: spacing.lg}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;