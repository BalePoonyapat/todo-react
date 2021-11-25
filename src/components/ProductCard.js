import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Button,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import firestore from '../../Firestore';
import { firebase } from '@firebase/app';
import '@firebase/auth';

import * as SecureStore from 'expo-secure-store';

export default function App(props) {
  const [cuser, setCuser] = useState(null);

  async function Order(id, name) {
    alert('เพิ่มสำเร็จ');
    console.log(id);
    let docRef = firestore.collection('user').doc(cuser.uid).collection('cart');

    docRef.add({
name: name,
prodid: id
    });
  }

  useEffect(() => {
    async function CheckLogin() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCuser(user);
        }
      });
    }
    CheckLogin();
  }, []);

  return (
    <TouchableOpacity onPress={() => Order(props.id, props.name)}>
      <View
        style={{
          flexDirection: 'row',
          margin: 10,
          backgroundColor: 'aqua',
          padding: 10,
        }}>
        <Image
          source={{ uri: props.picture }}
          style={{ width: 75, height: 75, borderRadius: 75 / 2 }}
        />
        <View style={{ margin: 10 }}>
          <Text style={{fontWeight: 'bold'}}>{props.name}</Text>
          <Text>ราคา ${props.price}</Text>
          <Text>จำนวนสินค้า {props.stock}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
