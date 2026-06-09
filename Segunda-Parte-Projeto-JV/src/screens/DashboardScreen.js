import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getSpaceMissionsWithFallback } from '../services/api';

function useSpaceApi() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMissions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const result = await getSpaceMissionsWithFallback(10);

      setMissions(result.data);

      if (result.fromFallback) {
        setError(
          `A API pública da NASA não respondeu corretamente. Exibindo dados locais. Detalhe: ${result.error}`
        );
      }
    } catch (unexpectedError) {
      setError(`Erro inesperado ao carregar dados: ${unexpectedError.message}`);
      setMissions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return {
    missions,
    loading,
    refreshing,
    error,
    refetch: fetchMissions,
  };
}

function MissionCard({ mission, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: mission.image }} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="planet-outline" size={14} color="#2563eb" />
            <Text style={styles.badgeText}>{mission.source}</Text>
          </View>

          <Text style={styles.dateText}>{mission.date}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {mission.title}
        </Text>

        <Text style={styles.cardDescription} numberOfLines={3}>
          {mission.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.detailsText}>Visualizar detalhes</Text>
          <Ionicons name="chevron-forward" size={18} color="#2563eb" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ navigation }) {
  const { missions, loading, refreshing, error, refetch } = useSpaceApi();

  function handleOpenDetails(mission) {
    navigation.navigate('Details', { mission });
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingTitle}>Carregando missões...</Text>
        <Text style={styles.loadingSubtitle}>Buscando dados científicos na API pública da NASA.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refetch(true)}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="rocket" size={30} color="#ffffff" />
            </View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerOverline}>Dashboard</Text>
              <Text style={styles.headerTitle}>Exploração Espacial</Text>
              <Text style={styles.headerDescription}>
                Acompanhe registros astronômicos carregados de uma API pública e toque em um item para ver mais informações.
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={<View style={styles.footerSpacing} />}
        renderItem={({ item }) => (
          <MissionCard mission={item} onPress={() => handleOpenDetails(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={42} color="#64748b" />
            <Text style={styles.emptyTitle}>Nenhum dado encontrado</Text>
            <Text style={styles.emptyText}>Tente atualizar a lista para carregar novas informações.</Text>
          </View>
        }
      />

      {error ? (
        <View style={styles.errorToast}>
          <Ionicons name="warning-outline" size={18} color="#92400e" />
          <Text style={styles.errorToastText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#f8fafc',
  },
  loadingTitle: {
    marginTop: 16,
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  loadingSubtitle: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  headerIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginRight: 14,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerOverline: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  headerDescription: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#cbd5e1',
  },
  cardContent: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '65%',
  },
  badgeText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 5,
  },
  dateText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 24,
  },
  cardDescription: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 14,
    paddingTop: 14,
  },
  detailsText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '800',
  },
  errorToast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 14,
    padding: 12,
  },
  errorToastText: {
    flex: 1,
    color: '#92400e',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  footerSpacing: {
    height: 8,
  },
});
