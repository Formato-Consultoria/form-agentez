import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../../config/firebase";

import ToggleNavigation from "../components/ToggleNavigation";
const iconCam = require("../../assets/icon-cam.png");
import colors from '../../colors';

const fnSigin = (email, password) => {
  if (email !== "" && password !== "") {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => console.log("Login success"))
      .catch((err) => Alert.alert("Login error", err.message));
  }
};

const fnSignup = (email, password) => {
  if (email !== '' && password !== '') {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => console.log('Signup success'))
      .catch((err) => Alert.alert("Login error", err.message));
  }
};

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(238, 238, 238, 0.5)"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          // textContentType="telephoneNumber"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(238, 238, 238, 0.5)"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.button} onPress={() => {
          isLoginActive ? fnSigin(email, password) : fnSignup(email, password)
        }}>
          <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 18 }}>
            {isLoginActive ? "Login" : "Registrar"}
          </Text>
        </TouchableOpacity>
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
    height: 160,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 25,
  },
  input: {
    backgroundColor: colors.background,
    color: '#FFF',
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FFF',
  },
  button: {
    backgroundColor: '#FFF',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
