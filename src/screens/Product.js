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

import ProductCard from '../components/ProductCard';

export default function Product({ navigation }) {
  const [products, setProducts] = useState([]);
  var res = []; 

  async function GetProduct() {
    // let collRef = firestore.collection('products');

    // await collRef.get().then((querySnap) => {
    //   const tempDoc = querySnap.docs.map((doc) => {
    //     return { id: doc.id, ...doc.data() };
    //   });
    //   setProducts(tempDoc);
    // });
    const collRef = firestore.collection('products');
    
        const col = await collRef.get();
        col.forEach((doc) => {res= [...res,...[doc.data()]];})
       setProducts(res);
       console.log(res);
  }

  useEffect(() => {
    GetProduct();
  }, []);

  return (
    <View style={styles.container}>
      {products.map((item) => (
        <ProductCard
          name={item.name}
          price={item.price}
          stock={item.stock}
          picture={item.picture}
          id={item.id}
        />
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
