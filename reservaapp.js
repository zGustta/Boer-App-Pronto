import * as React from 'react';
import { Button, View, Text, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import ProductsManager from './components/productsmanager';

// Importe a imagem da logo da Sentry Pesca
import Logo from './assets/logo.jpg'; // Certifique-se de importar o caminho correto da sua imagem

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      {/* Incluir a logo acima da frase de boas-vindas */}
      <Image source={Logo} style={{ width: 150, height: 150, marginBottom: 20 }} resizeMode="contain" />

      {/* Frase de boas-vindas */}
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bem-vindo à Sentry Pesca!</Text>

      {/* Botão para navegar para a tela de produtos */}
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Cadastrar Produto."
        color="#1dd6cb"
      />

      <Text style={{ fontSize: 24, marginBottom: 20 }}>________________________</Text>

      <Button
        onPress={() => navigation.navigate('VerProducts')}
        title="Ver Produtos."
        color="#1dd6cb"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <ProductsManager />
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}