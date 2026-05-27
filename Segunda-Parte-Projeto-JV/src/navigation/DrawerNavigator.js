import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';

import { auth } from '../../firebaseConfig';

import DashboardScreen from '../screens/DashboardScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MenuButton({ navigation }) {
  return (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={() => navigation.getParent()?.openDrawer()}
      activeOpacity={0.7}
    >
      <Ionicons name="menu" size={26} color="#ffffff" />
    </TouchableOpacity>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '800',
        },
        contentStyle: {
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          title: 'Dashboard',
          headerLeft: () => <MenuButton navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Detalhes',
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '800',
        },
        contentStyle: {
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Perfil',
          headerLeft: () => <MenuButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const currentUser = auth.currentUser;

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="rocket" size={30} color="#ffffff" />
        </View>

        <Text style={styles.drawerTitle}>SpacePortal</Text>
        <Text style={styles.drawerSubtitle} numberOfLines={1}>
          {currentUser?.email || 'Usuário autenticado'}
        </Text>
      </View>

      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Sair"
          labelStyle={styles.logoutLabel}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#dc2626" />
          )}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#475569',
        drawerActiveBackgroundColor: '#eff6ff',
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '700',
        },
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 285,
        },
      }}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Início',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: 'Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginRight: 12,
    paddingHorizontal: 4,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 22,
  },
  avatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginBottom: 12,
  },
  drawerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  drawerSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  drawerItemsContainer: {
    paddingTop: 10,
  },
  drawerFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoutLabel: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '800',
  },
});