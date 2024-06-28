import React, { useState, useEffect, useRef } from "react";
import ListProd from "../components/productslist";

import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";

import { TextInput } from "react-native-paper";
import firebase from "../services/connectionFirebase";

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Importações aqui

const Separator = () => {
  return <View style={styles.separator} />;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ProductsManager() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("");
  const inputNameRef = useRef(null);
  const inputBrandRef = useRef(null);
  const inputTypeRef = useRef(null);
  const inputPriceRef = useRef(null);
  let [cad, setCad] = useState(false);

  //Notification


  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Platform.OS === 'android') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          token = (await Notifications.getExpoPushTokenAsync()).data;
        }
      } else {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus === 'granted') {
          token = (await Notifications.getExpoPushTokenAsync()).data;
        }
      }
      return token;
    };

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => {
        setChannels(value ?? []);
      });
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  async function notificationPush() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novo Produto Cadastrado!',
        body: "Venha conferir a novidade.",
      },
      trigger: null,
    });
  }

  useEffect(() => {
    async function search() {
      await firebase
        .database()
        .ref("products")
        .on("value", (snapshot) => {

          setProducts([]);
          snapshot.forEach((chilItem) => {
            let data = {
              key: chilItem.key,
              name: chilItem.val().name,
              brand: chilItem.val().brand,
              type: chilItem.val().type,
              price: chilItem.val().price,
            };
            setProducts(oldArray => [...oldArray, data].reverse());
            // Adiciona novos itens na frente da lista
          });

        });
    }
    search();
  }, []);

  async function insertUpdate() {
    if (name !== "" && brand !== "" && price !== "" && type !== "" && key !== "") {
      firebase.database().ref("products").child(key).update({
        name: name,
        brand: brand,
        type: type,
        price: price,
      });
      clearData();
    } else if (name == "" || brand == "" || price == "" || type == "") {
      alert("Preencha os campos")
    } else {
      let prods = await firebase.database().ref('products')
      let keyprod = prods.push().key;
      prods.child(keyprod).set({
        name: name,
        brand: brand,
        type: type,
        price: price
      });
      alert("Produto Salvo!");
      clearData();
    }
    Keyboard.dismiss();
    notificationPush();
    setKey("");
    setCad(false);
  }


  function clearData() {
    setName("");
    setBrand("");
    setPrice("");
    setType("");
  }

  function handleDelete(key) {


    firebase.database().ref('products').child(key).remove()
      .then(() => {
        const findProducts = products.filter(item => item.key !== key)
        setProducts(findProducts)
      })
  }



  const btnEdit = (i) =>
    Alert.alert('Editando produto', 'Quer mesmo editar?', [
      {
        text: 'Não',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Sim', onPress: () => handleEdit(i) },
    ]);

  const btnDelete = (i) =>
    Alert.alert('Deletando produto', 'Quer mesmo deletá-lo?', [
      {
        text: 'Não',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Sim', onPress: () => handleDelete(i) },
    ]);

  function handleEdit(data) {

    setKey(data.key),
      setName(data.name),
      setBrand(data.brand),
      setType(data.type),
      setPrice(data.price)

    setCad(true);
  }

  return (
    cad ?
      <View style={styles.container}>
        <Pressable onPress={() => setCad(false)} style={styles.button}>
          <Text style={styles.buttonTextStyle}>Voltar</Text>
        </Pressable>
        <TextInput
          placeholder="Produto"
          left={<TextInput.Icon icon="star-circle" />}
          maxLength={40}
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
          ref={inputNameRef}
        />

        <Separator />

        <TextInput
          placeholder="Marca"
          left={<TextInput.Icon icon="sale" />}
          style={styles.input}
          onChangeText={(text) => setBrand(text)}
          value={brand}
          ref={inputBrandRef}
        />

        <Separator />

        <TextInput
          placeholder="Tipo"
          left={<TextInput.Icon icon="salesforce" />}
          style={styles.input}
          onChangeText={(text) => setType(text)}
          value={type}
          ref={inputTypeRef}
        />

        <Separator />

        <TextInput
          placeholder="Preço"
          left={<TextInput.Icon icon="sack" />}
          style={styles.input}
          onChangeText={(text) => setPrice(text)}
          value={price}
          ref={inputPriceRef}
        />

        <Separator />

        <Pressable
          onPress={insertUpdate}
          style={styles.button}
        >
          <Text style={styles.buttonTextStyle}>Salvar</Text>
        </Pressable>

      </View>
      :
      <View style={styles.container}>

        <Pressable onPress={() => setCad(true)} style={styles.button} >
          <Text style={styles.buttonTextStyle}>Cadastrar</Text>
        </Pressable>
        <Text style={styles.listar}>Listagem de Produtos</Text>

        <FlatList
          keyExtractor={(item, index) => item.key || index.toString()}
          data={products}
          renderItem={({ item }) => (
            <ListProd
              data={item}
              deleteItem={() => btnDelete(item.key)} // Correção na passagem da função
              editItem={() => btnEdit(item)} // Correção na passagem da função
            />
          )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#121212",
    height: 40,
    fontSize: 13,
    borderRadius: 8,
  },
  separator: {
    marginVertical: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#77dbe0",
    borderWidth: 0.5,
    borderColor: "#000",
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  buttonTextStyle: {
    color: "##808080",
    fontSize: 20,
    textAlign: "center",
    flex: 1,
  },
  listar: {
    fontSize: 20,
    textAlign: "center",
  },
});