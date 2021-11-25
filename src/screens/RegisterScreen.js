import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import { firebase } from '@firebase/app';
import firestore from '../../Firestore';
import '@firebase/auth';

export default function RegisterScreen({ navigation }) {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function onSignUpPressed() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        let collRef = firestore.collection('user').doc(user.user.uid);

        collRef.set({
          name: name,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'MyTabs' }],
        });
      })
      .catch((errror) => {
        alert('ไม่สำเร็จ');
        console.log(errror)
      });
  }

  return (
    <Background>
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        onChangeText={setName}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={setEmail}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}>
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
