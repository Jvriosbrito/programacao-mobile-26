# SpacePortal

**SpacePortal** é um aplicativo mobile desenvolvido com **React Native**, **Expo**, **React Navigation**, **Firebase Authentication**, **Cloud Firestore** e consumo de **API pública da NASA**. O objetivo do projeto é demonstrar a construção de uma aplicação funcional com autenticação real, persistência remota, navegação entre telas, menu lateral e carregamento de dados externos.

> Este projeto foi desenvolvido como parte de uma atividade acadêmica de programação mobile, atendendo aos requisitos de uso de hooks, navegação, API pública, Firebase e organização em pastas.

## Sumário

- [Descrição do Projeto](#descrição-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Requisitos Técnicos Atendidos](#requisitos-técnicos-atendidos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração do Firebase](#configuração-do-firebase)
- [Instalação do Projeto](#instalação-do-projeto)
- [Como Executar](#como-executar)
- [Como Usar o Aplicativo](#como-usar-o-aplicativo)
- [Regras do Firestore](#regras-do-firestore)
- [Possíveis Problemas e Soluções](#possíveis-problemas-e-soluções)
- [Autor](#autor)
- [Referências](#referências)

## Descrição do Projeto

O **SpacePortal** é um aplicativo com tema espacial que permite ao usuário criar uma conta, fazer login, visualizar informações obtidas de uma API pública, acessar detalhes de cada item e editar informações de perfil. A aplicação utiliza autenticação por e-mail e senha com Firebase Authentication e armazena dados do usuário no Cloud Firestore.

A proposta central é simular um portal de missões espaciais, no qual o usuário autenticado pode navegar por diferentes áreas do sistema por meio de uma navegação estruturada com **Stack Navigation** e **Drawer Navigation**. O uso do Expo facilita a execução do projeto em ambiente mobile e também no navegador durante o desenvolvimento.[1]

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Login | Permite que o usuário acesse o app com e-mail e senha cadastrados. |
| Registro | Permite criar uma nova conta usando Firebase Authentication. |
| Dashboard | Exibe uma lista de conteúdos espaciais carregados a partir da API pública da NASA. |
| Detalhes | Mostra informações detalhadas do item selecionado no Dashboard. |
| Perfil | Permite visualizar e atualizar dados do usuário salvos no Firestore. |
| Drawer Navigation | Disponibiliza um menu lateral com acesso às principais áreas do app. |
| Logout | Permite sair da conta autenticada. |
| Loading | Exibe indicador de carregamento enquanto dados são buscados. |
| Persistência remota | Mantém os dados do usuário no Firebase Firestore. |

## Requisitos Técnicos Atendidos

| Requisito | Implementação no Projeto | Status |
|---|---|---|
| Uso de `useState` | Utilizado nas telas para controlar campos, erros, carregamento e dados. | Atendido |
| Uso de `useEffect` | Utilizado para observar autenticação e carregar dados da API/Firebase. | Atendido |
| Hook customizado | Implementado no carregamento dos dados espaciais, como `useSpaceApi`. | Atendido |
| Componentes funcionais | Todas as telas e componentes são baseados em funções. | Atendido |
| React Navigation | Utilizado para gerenciar o fluxo entre telas. | Atendido |
| Stack Navigation | Utilizado para login, registro e detalhes. | Atendido |
| Drawer Navigation | Utilizado para navegação lateral entre Dashboard, Perfil e Sair. | Atendido |
| Tela de Login/Registro | Implementada com Firebase Authentication. | Atendido |
| Tela Principal | Implementada como Dashboard. | Atendido |
| Tela de Detalhes | Implementada para exibir informações do item selecionado. | Atendido |
| Tela de Perfil/Configurações | Implementada com leitura e gravação no Firestore. | Atendido |
| Consumo de API pública | Utiliza a API APOD da NASA. | Atendido |
| Lista de dados | Exibe os dados em uma lista usando interface mobile. | Atendido |
| Interação do usuário | Permite visualizar detalhes, atualizar perfil e sair da conta. | Atendido |
| Firebase Authentication | Usado para cadastro, login e logout. | Atendido |
| Firebase Firestore | Usado para armazenar e recuperar dados do perfil. | Atendido |

## Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| React Native | Desenvolvimento da interface mobile. |
| Expo | Execução e empacotamento do projeto React Native. |
| React Navigation | Controle de navegação por Stack e Drawer. |
| Firebase Authentication | Autenticação de usuários por e-mail e senha. |
| Cloud Firestore | Banco de dados remoto para persistência dos dados do usuário. |
| NASA APOD API | Fonte pública de dados espaciais exibidos no Dashboard. |
| JavaScript | Linguagem principal do projeto. |

O React Navigation é usado para implementar padrões comuns de navegação em aplicativos React Native, como pilhas de telas e menus laterais.[2] O Firebase Authentication oferece mecanismos prontos para cadastro e login de usuários, enquanto o Cloud Firestore permite armazenar documentos em nuvem de forma flexível.[3] [4]

## Estrutura de Pastas

A estrutura esperada do projeto é a seguinte:

```txt
seu-projeto/
  App.js
  firebaseConfig.js
  package.json
  package-lock.json
  /src
    /components
      Loading.js
      MissionCard.js
    /navigation
      AppNavigator.js
      DrawerNavigator.js
    /screens
      DashboardScreen.js
      DetailsScreen.js
      LoginScreen.js
      ProfileScreen.js
      RegisterScreen.js
    /services
      api.js
      firebaseService.js
```

Essa organização separa as responsabilidades do projeto. Os componentes reutilizáveis ficam em `components`, as telas principais ficam em `screens`, os arquivos de navegação ficam em `navigation`, e as integrações externas ficam em `services`.

## Configuração do Firebase

Antes de executar o projeto, é necessário criar e configurar um projeto no Firebase Console.

Acesse o site oficial do Firebase Console:

[https://console.firebase.google.com](https://console.firebase.google.com)

Dentro do Firebase Console, crie um projeto ou utilize um projeto existente. Depois, registre um aplicativo Web e copie as informações do SDK para o arquivo `firebaseConfig.js`, localizado na raiz do projeto.

O arquivo deve seguir este formato:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_PROJETO.firebaseapp.com',
  projectId: 'SEU_PROJECT_ID',
  storageBucket: 'SEU_PROJETO.firebasestorage.app',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId: 'SEU_APP_ID',
  measurementId: 'SEU_MEASUREMENT_ID',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

No Firebase Console, também é necessário ativar os seguintes serviços:

| Serviço | Caminho no Firebase Console |
|---|---|
| Authentication | Authentication → Sign-in method → E-mail/senha → Ativar |
| Firestore Database | Firestore Database → Criar banco de dados |

## Instalação do Projeto

Primeiro, clone o repositório do GitHub:

```bash
git clone LINK_DO_REPOSITORIO
```

Depois, acesse a pasta do projeto:

```bash
cd NOME_DA_PASTA_DO_PROJETO
```

Instale as dependências:

```bash
npm install
```

Caso esteja criando o projeto do zero ou precise reinstalar dependências importantes do Expo e da navegação, utilize:

```bash
npm install firebase
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/drawer
npm install @expo/vector-icons
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-web react-dom @expo/metro-runtime
```

## Como Executar

Para iniciar o projeto com cache limpo, execute:

```bash
npx expo start -c
```

Depois, escolha a plataforma desejada:

| Plataforma | Ação |
|---|---|
| Web | Pressione `w` no terminal do Expo. |
| Android | Pressione `a`, se houver emulador Android configurado. |
| Celular físico | Escaneie o QR Code usando o aplicativo Expo Go. |

Se preferir iniciar diretamente no navegador, use:

```bash
npx expo start --web
```

## Como Usar o Aplicativo

Ao abrir o app, o usuário verá a tela de login. Caso ainda não tenha conta, deve acessar a tela de registro, informar nome, e-mail e senha, e criar uma nova conta. Após o cadastro, o aplicativo autentica o usuário e direciona para o Dashboard.

No Dashboard, os dados são carregados a partir da API pública da NASA e exibidos em uma lista. O usuário pode selecionar um item para abrir a tela de detalhes. Pelo menu lateral, é possível acessar a tela de perfil, atualizar informações pessoais e sair da conta.

| Etapa | Resultado esperado |
|---|---|
| Criar conta | Usuário aparece no Firebase Authentication. |
| Entrar no app | Dashboard é exibido após autenticação. |
| Abrir item | Tela de detalhes mostra dados completos. |
| Editar perfil | Dados são atualizados no Cloud Firestore. |
| Sair | Usuário retorna para a tela de login. |

## Regras do Firestore

Para testes acadêmicos, recomenda-se usar regras que permitam que cada usuário leia e altere apenas o seu próprio documento. No Firebase Console, acesse **Firestore Database → Regras** e publique a configuração abaixo:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Essas regras são mais adequadas do que deixar o banco totalmente aberto, pois restringem o acesso aos documentos do próprio usuário autenticado.

## Possíveis Problemas e Soluções

| Problema | Possível causa | Solução |
|---|---|---|
| Página branca no navegador | Dependências incompletas ou erro JavaScript em tempo de execução. | Verifique o console do navegador com `F12` e rode `npx expo start -c`. |
| Erro `Unable to resolve react-native-web` | Dependências Web do Expo ausentes. | Rode `npx expo install react-native-web react-dom @expo/metro-runtime`. |
| Erro de login | Authentication não ativado. | Ative o método E-mail/senha no Firebase Console. |
| Erro de permissão no Firestore | Regras do banco bloqueando leitura ou escrita. | Configure as regras indicadas neste README. |
| Erro de importação | Arquivo fora da pasta correta. | Confira se a estrutura de pastas está igual à seção correspondente. |
| Drawer não abre corretamente | Dependências de gesture/reanimated ausentes. | Instale `react-native-gesture-handler` e `react-native-reanimated` pelo Expo. |

## Scripts Disponíveis

Dependendo do `package.json`, os scripts podem ser executados desta forma:

```bash
npm start
```

```bash
npm run web
```

```bash
npm run android
```

Caso os scripts não existam, utilize diretamente:

```bash
npx expo start
```

## Conclusão

O projeto **SpacePortal** atende aos requisitos principais de uma aplicação mobile moderna em React Native. Ele utiliza hooks, navegação real com Stack e Drawer, autenticação com Firebase, persistência no Firestore e consumo de API pública. Além disso, a estrutura de pastas facilita a manutenção e separa as responsabilidades do código.

Como melhoria futura, o projeto pode incluir uma chave própria da NASA API em vez da chave demonstrativa, filtros avançados no Dashboard, favoritos salvos no Firestore e uma interface visual mais personalizada.

## Autor

Desenvolvido por **João Victor**.

## Referências

[1]: https://docs.expo.dev/ "Expo Documentation"
[2]: https://reactnavigation.org/docs/getting-started/ "React Navigation - Getting Started"
[3]: https://firebase.google.com/docs/auth "Firebase Authentication Documentation"
[4]: https://firebase.google.com/docs/firestore "Cloud Firestore Documentation"
[5]: https://api.nasa.gov/ "NASA Open APIs"
