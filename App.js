import * as React from 'react';
import { Button, View, Text, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import ProductsManager from './components/productsmanager';

// Importe a imagem da logo da Sentry Pesca
import Logo from './assets/logo.jpg';
import p01 from './assets/p01.png';
import p02 from './assets/p02.png';
import p03 from './assets/p03.png';
import p04 from './assets/p04.png';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
      <Image source={Logo} style={{ width: 150, height: 150, marginBottom: 20 }} resizeMode="contain" />

      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bem-vindo à Sentry Pesca!</Text>

      {/* Botão para navegar para a tela de produtos */}
      <Button
        onPress={() => navigation.navigate('Cadastro de Produtos')}
        title="Cadastrar Produtos"
        color="#3bc0db"
      />

      <Text style={{ fontSize: 24, marginBottom: 20 }}>_________________________</Text>

      <Button
        onPress={() => navigation.navigate('Produtos')}
        title="Ver Produtos"
        color="#3bdbc1"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <ProductsManager />
  );
}

function VProdutos({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Produtos Disponíveis</Text>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={p01} style={{ width: 100, height: 100, marginBottom: 10 }} resizeMode="contain" />
        <Text style={{ fontSize: 16 }}>Carretilha (D)</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={p02} style={{ width: 100, height: 100, marginBottom: 10 }} resizeMode="contain" />
        <Text style={{ fontSize: 16 }}>Lambari (8uni.)</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={p03} style={{ width: 100, height: 100, marginBottom: 10 }} resizeMode="contain" />
        <Text style={{ fontSize: 16 }}>Linha Multifilamento</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={p04} style={{ width: 100, height: 100, marginBottom: 10 }} resizeMode="contain" />
        <Text style={{ fontSize: 16 }}>Zig-Zarinha (Isca Artificial)</Text>
      </View>
    </View>
  );
}


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Cadastro de Produtos" component={NotificationsScreen} />
        <Drawer.Screen name="Produtos" component={VProdutos} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}