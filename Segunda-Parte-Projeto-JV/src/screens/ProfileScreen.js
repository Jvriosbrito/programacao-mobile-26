import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '../../firebaseConfig';

export default function ProfileScreen() {
  const currentUser = auth.currentUser;

  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [missionPreference, setMissionPreference] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadProfile = useCallback(async () => {
    if (!currentUser) {
      setErrorMessage('Usuário não autenticado. Faça login novamente.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const profileRef = doc(db, 'users', currentUser.uid);
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data();

        setName(profileData.name || currentUser.displayName || '');
        setRank(profileData.rank || 'Cadete Estelar');
        setMissionPreference(profileData.missionPreference || 'Órbita Terrestre Baixa');
        setBio(profileData.bio || '');
      } else {
        const defaultProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || '',
          email: currentUser.email || '',
          rank: 'Cadete Estelar',
          missionPreference: 'Órbita Terrestre Baixa',
          bio: 'Perfil criado automaticamente no SpacePortal.',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(profileRef, defaultProfile);

        setName(defaultProfile.name);
        setRank(defaultProfile.rank);
        setMissionPreference(defaultProfile.missionPreference);
        setBio(defaultProfile.bio);
      }
    } catch (error) {
      console.log('Erro ao carregar perfil:', error);
      setErrorMessage('Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function validateProfile() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe seu nome para salvar o perfil.');
      return false;
    }

    if (name.trim().length < 3) {
      Alert.alert('Atenção', 'O nome deve ter pelo menos 3 caracteres.');
      return false;
    }

    if (!rank.trim()) {
      Alert.alert('Atenção', 'Informe sua patente ou função.');
      return false;
    }

    if (!missionPreference.trim()) {
      Alert.alert('Atenção', 'Informe sua preferência de missão.');
      return false;
    }

    return true;
  }

  async function handleSaveProfile() {
    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return;
    }

    if (!validateProfile()) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const profileRef = doc(db, 'users', currentUser.uid);

      await setDoc(
        profileRef,
        {
          uid: currentUser.uid,
          name: name.trim(),
          email: currentUser.email || '',
          rank: rank.trim(),
          missionPreference: missionPreference.trim(),
          bio: bio.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (currentUser.displayName !== name.trim()) {
        await updateProfile(currentUser, {
          displayName: name.trim(),
        });
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso no Firestore.');
    } catch (error) {
      console.log('Erro ao salvar perfil:', error);
      setErrorMessage('Não foi possível salvar as alterações do perfil.');
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingTitle}>Carregando perfil...</Text>
        <Text style={styles.loadingSubtitle}>Recuperando seus dados salvos no Firestore.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={42} color="#ffffff" />
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.overline}>Configurações</Text>
            <Text style={styles.headerTitle}>{name || 'Perfil do usuário'}</Text>
            <Text style={styles.headerSubtitle}>{currentUser?.email || 'E-mail não disponível'}</Text>
          </View>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={19} color="#dc2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={22} color="#0f172a" />
            <Text style={styles.sectionTitle}>Dados do Perfil</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#64748b" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patente ou função</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="ribbon-outline" size={20} color="#64748b" />
              <TextInput
                value={rank}
                onChangeText={setRank}
                placeholder="Ex: Cadete Estelar"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferência de missão</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="planet-outline" size={20} color="#64748b" />
              <TextInput
                value={missionPreference}
                onChangeText={setMissionPreference}
                placeholder="Ex: Marte, Lua, Europa"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biografia ou foco de pesquisa</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Ionicons name="document-text-outline" size={20} color="#64748b" style={styles.textAreaIcon} />
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Descreva seus interesses, formação ou objetivos."
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textArea]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.disabledButton]}
            onPress={handleSaveProfile}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="cloud-done-outline" size={22} color="#2563eb" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Persistência remota ativa</Text>
              <Text style={styles.infoText}>
                Os dados desta tela são recuperados e atualizados no Firebase Firestore usando o UID do usuário autenticado.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
    fontWeight: '900',
  },
  loadingSubtitle: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginRight: 14,
  },
  headerTextContainer: {
    flex: 1,
  },
  overline: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },
  headerSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 5,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    padding: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    flex: 1,
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: '#0f172a',
    fontSize: 15,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    minHeight: 118,
    paddingTop: 12,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  textArea: {
    height: 100,
    paddingTop: 0,
    lineHeight: 21,
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
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  infoText: {
    color: '#1e40af',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
});