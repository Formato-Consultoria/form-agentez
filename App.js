import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import {
  migrateMessageInDatabaseFirestore,
  fetchAllLastSentMessages
} from './src/functions/chat-message.function';

import LoginRegister from './src/screens/LoginRegister';
import Chat from './src/screens/Chat';

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  async function loadData() {
    const messages = fetchAllLastSentMessages();
    migrateMessageInDatabaseFirestore(messages);
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Agentez'
        component={Chat}
        options={{
          headerLeft: () => (
            <Image
              source={require('./assets/icon-cam.png')}
              style={{ width: 30, height: 30, marginLeft: 15 }}
            />
          ),
          // headerRight: () => (
          //   <TouchableOpacity
          //       style={{ width: 30, height: 30, marginRight: 20 }}
          //       onPress={loadData}
          //       activeOpacity={0.8}
          //   >
          //     <MaterialCommunityIcons name="database-export" size={27} color="#FFF" />
          //   </TouchableOpacity>
          // ),
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            height: 42,
            backgroundColor: 'rgb(13,17,23)',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='LoginRegistro' component={LoginRegister} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {

  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}