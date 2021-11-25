import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Image, Platform,Alert } from 'react-native';
import Constants from 'expo-constants';
import { firebase } from '@firebase/app';
import firestore from '../../Firestore';
import '@firebase/auth';
import '@firebase/storage';
import button from '../components/Button'
import * as ImagePicker from 'expo-image-picker';

export default function App({ navigation }) {
  const [cuser, setCuser] = useState('');
  const [name, setName] =  useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    async function CheckLogin() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCuser(user);

          const docRef = firestore.collection('user').doc(user.uid);

          docRef.get().then((doc) => {
            setName(doc.data().name);
          });

          let storageRef = firebase.storage().ref();
          let picRef = storageRef.child(user.uid + '.jpg').getDownloadURL();

          picRef.then((url) => setImage(url));
           
        }
      });
    }
    CheckLogin();
  }, []);

  useEffect(() =>{
    async function AskPer(){
      if(Platform.OS !== 'web'){
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted'){
          alert('Need permission');
        }
      }
    }
    AskPer();
  }, []);

  async function UploadPic(){
    let result = await ImagePicker.launchImageLibraryAsync();

    if(!result.cancelled){
      let response = await fetch(result.uri);
      let blob = await response.blob();

      let storageRef = firebase.storage().ref();
      let picRef = storageRef.child(cuser.uid + '.jpg');

      picRef.put(blob).then((pic) => {
        alert('Uploaded!!!');
        setImage(result.uri);
      });

    }
  }
  function Confirmbox() {
    Alert.alert('Confirm', 'Are you sure you want to Logout?', [
      { text: 'NO', style: 'cancel' },
      {
        text: 'YES',
        onPress: () => {
          console.log('signed out');
          firebase
            .auth()
            .signOut()
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            })
            .catch((error) => console.log(error.message));
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Image source={image == '' ? require('../assets/Profile.jpg') : {uri:image}} style={{width:150, height: 150}} />
      <Text>{ name }</Text> 
      <Button title='Change Pic' onPress={() => UploadPic()} />
      
      <Button onPress={Confirmbox} title="Logout" />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
