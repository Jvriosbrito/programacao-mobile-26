import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '../../firebaseConfig';

export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function getFirebaseAuthErrorMessage(errorCode) {
  const messages = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'O e-mail informado é inválido.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/user-disabled': 'Este usuário foi desativado.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
    'auth/wrong-password': 'Senha incorreta.',
  };

  return messages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
}

export async function loginWithEmail(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  return signInWithEmailAndPassword(auth, normalizedEmail, password);
}

export async function registerWithEmail({ name, email, password }) {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );

  const createdUser = userCredential.user;

  await updateProfile(createdUser, {
    displayName: normalizedName,
  });

  await createUserProfile(createdUser.uid, {
    name: normalizedName,
    email: normalizedEmail,
  });

  return createdUser;
}

export async function logoutUser() {
  return signOut(auth);
}

export function getUserProfileRef(uid) {
  return doc(db, 'users', uid);
}

export async function createUserProfile(uid, profileData = {}) {
  const profileRef = getUserProfileRef(uid);

  const defaultProfile = {
    uid,
    name: profileData.name || '',
    email: profileData.email || '',
    rank: profileData.rank || 'Cadete Estelar',
    missionPreference: profileData.missionPreference || 'Órbita Terrestre Baixa',
    bio: profileData.bio || 'Novo usuário cadastrado no SpacePortal.',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(profileRef, defaultProfile, { merge: true });

  return defaultProfile;
}

export async function getUserProfile(uid) {
  const profileRef = getUserProfileRef(uid);
  const profileSnapshot = await getDoc(profileRef);

  if (!profileSnapshot.exists()) {
    const currentUser = getCurrentUser();

    return createUserProfile(uid, {
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
    });
  }

  return {
    id: profileSnapshot.id,
    ...profileSnapshot.data(),
  };
}

export async function updateUserProfile(uid, profileData) {
  const currentUser = getCurrentUser();
  const profileRef = getUserProfileRef(uid);

  const updatedProfile = {
    uid,
    name: profileData.name?.trim() || '',
    email: currentUser?.email || profileData.email || '',
    rank: profileData.rank?.trim() || 'Cadete Estelar',
    missionPreference:
      profileData.missionPreference?.trim() || 'Órbita Terrestre Baixa',
    bio: profileData.bio?.trim() || '',
    updatedAt: serverTimestamp(),
  };

  await setDoc(profileRef, updatedProfile, { merge: true });

  if (currentUser && currentUser.displayName !== updatedProfile.name) {
    await updateProfile(currentUser, {
      displayName: updatedProfile.name,
    });
  }

  return updatedProfile;
}

export async function saveUserFavorite(uid, mission) {
  const favoriteRef = doc(db, 'users', uid, 'favorites', mission.id);

  const favoriteData = {
    id: mission.id,
    title: mission.title || '',
    description: mission.description || '',
    date: mission.date || '',
    image: mission.image || '',
    source: mission.source || 'NASA APOD',
    mediaType: mission.mediaType || 'image',
    savedAt: serverTimestamp(),
  };

  await setDoc(favoriteRef, favoriteData, { merge: true });

  return favoriteData;
}