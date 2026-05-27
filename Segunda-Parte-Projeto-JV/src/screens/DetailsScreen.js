import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DetailsScreen({ route, navigation }) {
  const mission = route?.params?.mission;

  if (!mission) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={52} color="#64748b" />
        <Text style={styles.emptyTitle}>Nenhuma missão selecionada</Text>
        <Text style={styles.emptyDescription}>
          Volte para o painel principal e selecione um item da lista para visualizar os detalhes.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#ffffff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: mission.image }} style={styles.image} />
        <View style={styles.imageOverlay} />

        <View style={styles.imageTextContainer}>
          <View style={styles.tag}>
            <Ionicons name="planet-outline" size={14} color="#ffffff" />
            <Text style={styles.tagText}>Registro Astronômico</Text>
          </View>

          <Text style={styles.title} numberOfLines={3}>
            {mission.title}
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Ionicons name="calendar-outline" size={22} color="#2563eb" />
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>{mission.date || 'Não informada'}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="radio-outline" size={22} color="#2563eb" />
            <Text style={styles.infoLabel}>Fonte</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {mission.source || 'NASA APOD'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={22} color="#0f172a" />
            <Text style={styles.sectionTitle}>Descrição científica</Text>
          </View>

          <Text style={styles.description}>
            {mission.description || 'Nenhuma descrição foi disponibilizada para este registro.'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={22} color="#0f172a" />
            <Text style={styles.sectionTitle}>Informações da mídia</Text>
          </View>

          <View style={styles.mediaInfoRow}>
            <Text style={styles.mediaInfoLabel}>Tipo de mídia</Text>
            <Text style={styles.mediaInfoValue}>{mission.mediaType || 'image'}</Text>
          </View>

          <View style={styles.mediaInfoRow}>
            <Text style={styles.mediaInfoLabel}>Identificador</Text>
            <Text style={styles.mediaInfoValue} numberOfLines={1}>
              {mission.id || 'Sem identificador'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={19} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Voltar ao Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingBottom: 28,
  },
  imageContainer: {
    height: 320,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#cbd5e1',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  imageTextContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
  },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 12,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 34,
  },
  detailsCard: {
    marginTop: -22,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 112,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
    lineHeight: 18,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 18,
    marginTop: 2,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '900',
  },
  description: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  mediaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  mediaInfoLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  mediaInfoValue: {
    flex: 1,
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  primaryButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 14,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginTop: 22,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});