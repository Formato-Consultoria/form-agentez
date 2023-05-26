import React, { useState } from "react";
import { StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert
} from "react-native";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import {
  saveUserSessionToDatabaseInRealTime,
  handleGoogleSigin
} from "../functions/auth.function";

import ToggleNavigation from "../components/ToggleNavigation";
const iconCam = require("../../assets/icon-cam.png");
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import colors from '../../colors';

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const fnSigin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          saveUserSessionToDatabaseInRealTime(user.uid,  { name: user.displayName, email: email });
      }).catch((err) => {
        console.error(err.message);
        Alert.alert("Error:", "Error ao fazer o login");
      });
    }
  };
  
  const fnSignup = () => {
    if (email !== '' && password !== '') {
      createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          saveUserSessionToDatabaseInRealTime(user.uid,  { name: name, email: email });
      }).catch((err) => {
        console.error(err.message);
        Alert.alert("Error:", "Error ao fazer o registro");
      });
    }
  };

  const [isLoginActive, setIsLoginActive] = useState(true);

  const handleToggle = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <View style={styles.container}>
      <ToggleNavigation
        isToggle={isLoginActive}
        handleFn={handleToggle}
      />

      <SafeAreaView style={styles.form}>
        <Image source={iconCam} style={styles.iconCam} />

        {!isLoginActive &&
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(238, 238, 238, 0.5)"
          placeholder="Nome"
          autoCapitalize="none"
          keyboardType="name-phone-pad"
          textContentType="name"
          autoFocus={true}
          value={name}
          onChangeText={(text) => setName(text)}
        />}
        
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(238, 238, 238, 0.5)"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(238, 238, 238, 0.5)"
          placeholder="Senha"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.button} onPress={isLoginActive ? fnSigin : fnSignup}>
          <Text style={{ fontWeight: '500', color: '#000', fontSize: 15 }}>
            {isLoginActive ? "Login" : "Registrar"}
          </Text>
        </TouchableOpacity>

        {isLoginActive && <View>
        <MaterialCommunityIcons style={{ marginBottom: 10, alignSelf: 'center' }} name="music-note-whole-dotted" size={24} color="#FFF" />
        <TouchableOpacity style={[
            styles.button,
            { display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }
          ]}
          onPress={handleGoogleSigin}
        >
          <EvilIcons name="sc-google-plus" size={24} color="black" />
          <Text style={{ fontWeight: '500', color: '#000', fontSize: 15 }}>
            Login com Google
          </Text>
        </TouchableOpacity></View>}
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  iconCam: {
    width: "100%",
    height: 125,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 25,
  },
  input: {
    backgroundColor: colors.background,
    color: '#FFF',
    height: 48,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FFF',
  },
  button: {
    backgroundColor: '#FFF',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
