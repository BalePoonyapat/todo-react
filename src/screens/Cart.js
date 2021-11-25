import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import { firebase } from '@firebase/app';
import firestore from '../../Firestore';
import '@firebase/auth';
import * as SecureStore from 'expo-secure-store';
import ProductCard from '../components/ProductCard';

export default function Cart({ navigation }) {
  const [cuser, setCuser] = useState(null);
  const [products, setProducts] = useState([]);

    useEffect(() => {
    async function CheckLogin() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCuser(user);

          let collRef = firestore
            .collection('user')
            .doc(user.uid)
            .collection('cart');

          collRef.get().then((querySnap) => {
            const tempDoc = querySnap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });
            setProducts(tempDoc);
          });
        }
      });
    }
    const unsubs = navigation.addListener('focus', () => {
      CheckLogin();
    });
    return unsubs;
  }, [navigation]);

 async function RemoveProduct(id) {
    let collRef = firestore
      .collection('user')
      .doc(cuser.uid)
      .collection('cart')
      .doc(id);

    await collRef.delete();
    alert('ลบแล้ว');
    collRef = firestore
            .collection('user')
            .doc(cuser.uid)
            .collection('cart');

          collRef.get().then((querySnap) => {
            const tempDoc = querySnap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });
            setProducts(tempDoc);
          });
  }

  async function OrderProduct(){
    let collRef = await firestore
      .collection('user')
      .doc(cuser.uid)
      .collection('cart');

    let orderRef =  await firestore.collection('orders').add({
      userid: cuser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    collRef.get().then(async (querySnap) => {
      let tempDoc = await querySnap.forEach(async (doc) =>{
        await orderRef.collection('products').add(doc.data());
        await collRef.doc(doc.id).delete();
      });
    });
    setProducts([]);
    alert('สั่งซื้อเรียบร้อยแล้ว');
  }


  return (
   <View style={styles.container}>
    <Button  title="Order" onPress={() => OrderProduct()} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
         <Text style={{fontSize:50,marginLeft:30,marginTop:15,fontWeight:'bold'}}> Cart </Text>
    </TouchableOpacity>
      <View>
      <ScrollView style={{marginTop:20,backgroundColor:'white',borderRadius: 20,width:'90%',height:'65%',marginLeft:20,marginBottom:35}}>
          {products.map((item) => (
           <TouchableOpacity style={{borderRadius:15,margin:5,marginTop:10}} onPress={() => RemoveProduct(item.id) }>
         <Text style={{color:'black',fontSize:22,marginLeft:30,marginTop:15,marginBottom:15,fontWeight:'bold'}}> {item.name}</Text>
    </TouchableOpacity> 
          ))}
        </ScrollView>
    </View>
    </View>
  );
}
const styles = StyleSheet.create({


  container: {

  },
});
