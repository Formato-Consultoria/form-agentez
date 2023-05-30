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

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from "react-hook-form";

import { ref, set } from 'firebase/database';
import { auth, realtimeDatabase } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import ToggleNavigation from "../components/ToggleNavigation";
const iconCam = require("../../assets/icon-cam.png");
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../colors';

export function saveUserSessionToDatabaseInRealTime(uid, userData) {
  set(ref(realtimeDatabase, '/sessions/'+uid), userData);
}

const schemaLoginAndRegister = yup.object({
  name: yup.string(),
  email: yup.string().required("Insira o email!").email("Insira um email válido!"),
  password: yup.string().required("Insira a senha!"),
})

export default function LoginRegister() {
  const { control, handleSubmit, formState: { errors }, setError} = useForm({
    resolver: yupResolver(schemaLoginAndRegister)
  })

  const handleSigin = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("login successfully");
    }).catch((err) => {
      Alert.alert("Erro ao fazer login:", err.message);
    });
  };
  
  const handleSignup = ({ name, email, password }) => {
    if (!name) {
      setError('name', {
        type: 'manual',
        message: 'Insira o nome!'
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        saveUserSessionToDatabaseInRealTime(user.uid,  { name: name, email: email });
    }).catch((err) => {
      Alert.alert("Erro ao fazer o registro:", err.message);
    });
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
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) => (
            <TextInput
                style={[
                  styles.input, {
                    borderWidth: 1,
                    borderColor: errors.name ? '#FF375B' : '#FFF',
                  }
                ]}
                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                placeholder="Nome"
                autoCapitalize="none"
                keyboardType="name-phone-pad"
                textContentType="name"
                autoFocus={true}
                value={value}
                onChangeText={onChange}
            />
          )}
        />}
        {errors.name && !isLoginActive && <Text style={styles.labelError}>{`* ${errors.name?.message}`}</Text>}

        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, value } }) => (
            <TextInput
                style={[
                  styles.input, {
                    borderWidth: 1,
                    borderColor: errors.email ? '#FF375B' : '#FFF',
                  }
                ]}
                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={value}
                onChangeText={onChange}
            />
          )}
        />
        {errors.email && <Text style={styles.labelError}>{`* ${errors.email?.message}`}</Text>}

        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, value } }) => (
            <TextInput
                style={[
                  styles.input, {
                    borderWidth: 1,
                    borderColor: errors.password ? '#FF375B' : '#FFF',
                  }
                ]}
                placeholderTextColor="rgba(238, 238, 238, 0.5)"
                placeholder="Senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                value={value}
                onChangeText={onChange}
            />
          )}
        />
        {errors.password && <Text style={styles.labelError}>{`* ${errors.password?.message}`}</Text>}

        <TouchableOpacity style={styles.button} onPress={isLoginActive ? handleSubmit(handleSigin) : handleSubmit(handleSignup)}>
          <Text style={{ fontWeight: '500', color: '#000', fontSize: 15 }}>
            {isLoginActive ? "Login" : "Registrar"}
          </Text>
        </TouchableOpacity>

        {/* {isLoginActive && <View>
        <MaterialCommunityIcons style={{ marginBottom: 10, alignSelf: 'center' }} name="music-note-whole-dotted" size={24} color="#FFF" />
        <TouchableOpacity style={[
            styles.button,
            { display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }
          ]}
          onPress={() => {}}
        >
          <EvilIcons name="sc-google-plus" size={24} color="black" />
          <Text style={{ fontWeight: '500', color: '#000', fontSize: 15 }}>
            Login com Google
          </Text>
        </TouchableOpacity></View>} */}
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
  labelError: {
    alignItems: 'flex-start',
    color: '#ff375b',
    marginBottom: 8,
    marginLeft: 5,
    fontSize: 11
  },
  button: {
    backgroundColor: '#FFF',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
