import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

// ---------------- DADOS ----------------
const MISSIONS = [
  {
    id: 1,
    name: "Projeto Apollo 11",
    description: "A histórica missão que pousou os primeiros humanos na Lua. Este esforço monumental da NASA não só cumpriu o desafio do presidente John F. Kennedy, mas também expandiu os horizontes da tecnologia humana.",
    budget: "25.4 Bilhões USD",
    vote: "9.9/10",
    duration: "195 horas",
    launch: "1969-07-16",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
    crew: [
      {
        id: 'a1',
        name: 'Neil Armstrong',
        role: 'Comandante',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaw3hj0J28KpfgQABfhUvZjzWMDukgSiYMlVejCH2-HtKaJI0L57mgGPBvqbNCYRKRXRNGHnnTpJNI-qDGPch81MObAhd_UfDxsK2Yrw-p&s=10',
        bio: 'Primeiro homem a pisar na Lua. Demonstrou coragem e controle extremo durante a missão Apollo 11, sendo referência histórica na exploração espacial.'
      },
      {
        id: 'a2',
        name: 'Buzz Aldrin',
        role: 'Piloto do Módulo Lunar',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYG73Cqa1HZNJLbjA6flDxPfOlbFMcaAP78188zfuTK3_Aba5DiW1-ZoPWBWa9cv6q8yz2KyIA8mhjxfItbwEnPSLBJAcCI8vcNzY1F21F&s=10',
        bio: 'Segundo homem na Lua. Especialista em mecânica orbital, contribuiu significativamente para o sucesso das missões espaciais.'
      }
    ]
  },
  {
    id: 2,
    name: "Mars Curiosity Rover",
    description: "Missão robótica em Marte que investiga condições habitáveis.",
    budget: "2.5 Bilhões USD",
    vote: "9.5/10",
    duration: "4200+ Sol",
    launch: "2011-11-26",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9",
    crew: [
      {
        id: 'a3',
        name: 'Steve Squyres',
        role: 'Investigador Principal',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbJArTNyY4KZ8IYi02RkNX0h6fpBcSua-4G4KB_xrPc_Eh_2xKrcVyQB-xUqfSyqwLPgcRPp4pHtL37CLVkyhc2djpa6haD7Np1ATdyXg3&s=10',
        bio: 'Geólogo planetário que ajudou a descobrir evidências de água em Marte.'
      }
    ]
  }
];

// ---------------- TELA LISTA ----------------
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exploração Espacial</Text>

      {MISSIONS.map(mission => (
        <View key={mission.id} style={styles.card}>
          <Image source={{ uri: mission.image }} style={styles.image} />

          <Text style={styles.cardTitle}>{mission.name}</Text>
          <Text style={styles.desc}>{mission.description}</Text>

          <View style={styles.infoBox}>
            <Text>Orçamento: {mission.budget}</Text>
            <Text>Voto: {mission.vote}</Text>
            <Text>Duração: {mission.duration}</Text>
          </View>

          <Text style={styles.subtitle}>Astronautas</Text>

          {mission.crew.map(person => (
            <TouchableOpacity
              key={person.id}
              style={styles.person}
              onPress={() => navigation.navigate("Details", { mission })}
            >
              <Image source={{ uri: person.image }} style={styles.avatar} />
              <View>
                <Text style={styles.personTitle}>{person.role}</Text>
                <Text>{person.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Form")}
      >
        <Text style={styles.buttonText}>Candidatar-se</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- DETALHES ----------------
function DetailsScreen({ route, navigation }) {
  const { mission } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: mission.image }} style={styles.image} />

      <Text style={styles.title}>{mission.name}</Text>
      <Text>{mission.description}</Text>

      <Text style={styles.subtitle}>Tripulação</Text>

      {mission.crew.map(person => (
        <TouchableOpacity
          key={person.id}
          onPress={() => navigation.navigate("Crew", { person })}
          style={styles.person}
        >
          <Ionicons name="rocket" size={24} color="blue" />
          <Text>{person.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ---------------- CREW ----------------
function CrewScreen({ route }) {
  const { person } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: person.image }} style={styles.profileImage} />

      <Text style={styles.title}>{person.name}</Text>
      <Text>{person.role}</Text>
      <Text style={styles.desc}>{person.bio}</Text>
    </ScrollView>
  );
}

// ---------------- FORM ----------------
function FormScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [region, setRegion] = useState('br');
  const [education, setEducation] = useState('grad');

  const [fitness, setFitness] = useState(50);
  const [gforce, setGforce] = useState(10);

  const [colonize, setColonize] = useState(false);
  const [medical, setMedical] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Formulário</Text>

      {/* INPUTS */}
      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Idade" style={styles.input} value={age} onChangeText={setAge} />
      <TextInput placeholder="Especialidade" style={styles.input} value={specialty} onChangeText={setSpecialty} />

      {/* PICKERS */}
      <Text>Região</Text>
      <Picker selectedValue={region} onValueChange={setRegion}>
        <Picker.Item label="Brasil" value="br" />
        <Picker.Item label="EUA" value="us" />
      </Picker>

      <Text>Escolaridade</Text>
      <Picker selectedValue={education} onValueChange={setEducation}>
        <Picker.Item label="Graduação" value="grad" />
        <Picker.Item label="Mestrado" value="master" />
      </Picker>

      {/* SLIDERS */}
      <Text>Fitness: {fitness}</Text>
      <Slider minimumValue={0} maximumValue={100} value={fitness} onValueChange={setFitness} />

      <Text>G-Force: {gforce}</Text>
      <Slider minimumValue={0} maximumValue={20} value={gforce} onValueChange={setGforce} />

      {/* SWITCHES */}
      <View style={styles.switchRow}>
        <Text>Colonizar Marte? {colonize ? "✅ Sim" : "❌ Não"}</Text>
        <Switch value={colonize} onValueChange={setColonize} trackColor={{ false: "#ccc", true: "#2563eb" }} />
      </View>

      <View style={styles.switchRow}>
        <Text>Exame Médico {medical ? "✅ Aprovado" : "❌ Reprovado"}</Text>
        <Switch value={medical} onValueChange={setMedical} trackColor={{ false: "#ccc", true: "#2563eb" }} />
      </View>

      {/* BOTÕES */}
      <TouchableOpacity style={styles.mainButton}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton}>
        <Text>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------- NAVIGATION ----------------
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Crew" component={CrewScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Explorar"
          component={StackScreens}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="compass" size={20} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Formulário"
          component={FormScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="create" size={20} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ---------------- STYLE ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10
  },
  desc: {
    color: "#555",
    marginVertical: 8
  },
  infoBox: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 8
  },
  subtitle: {
    marginTop: 10,
    fontWeight: "bold"
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8
  },
  personTitle: {
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10
  },
  avatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10
  },

  profileImage: {
  width: "100%",
  height: 250,
  borderRadius: 12,
  marginBottom: 10
  }
});