import 'react-native-gesture-handler';
import React from "react";
import { StyleSheet, View, Text, Platform, Pressable} from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@react-native-vector-icons/ionicons'; 
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector} from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../../constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import SelectDistrito from "../../screens/selectDistrito";
import { Presentacion } from "../../screens/presentacion";

import NaveCamaras from '../NaveCamaras';
import NaveDiputados from "../NaveDiputados";
import NaveSenadores from "../NaveSenadores";

import { logout } from '../../store/actions/login.actions';
import { changeDistrit } from '../../store/actions/diputado.action';
import AsyncStorage from '@react-native-async-storage/async-storage'

const BottomsTabs = createBottomTabNavigator()
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator(); 

function CustomDrawerContent(props) {

const dispatch = useDispatch();

const submit = async () => {
    dispatch(logout())
    dispatch( changeDistrit())
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('pass');
    console.log('logout')
}

const cambioDistrito = () => {
    dispatch(changeDistrit())
  }

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem 
            icon={({ focused, color, size }) => <FontAwesome name="exchange" size={22} color={COLORS.greenM} /> }
            label='Cambia de distrito'
            onPress={cambioDistrito} />
        <DrawerItem 
            icon={({ focused, color, size }) => <AntDesign name="logout" size={22} color={COLORS.greenM} /> }
            label='Cerrar Sesión'
            onPress={submit} />
      </DrawerContentScrollView>
    );
  }

  /*const distrito = useSelector(state => state.selectDiputado.distrito);

  function Title() {
    return (
      <Text style={{ width: 50, height: 50 }}>
        {distrito}
      </Text>
        
    );
  }*/

const MyDrawer = () => {

    const filteredDiputados = useSelector(state => state.selectDiputado.filteredDiputados);
    const distritoID = useSelector(state => state.selectDiputado.distrito);

    console.log(distritoID)

    return (
        <>
            {filteredDiputados != 0 ? (
            <Drawer.Navigator 
                useLegacyImplementation
                screenOptions={({navigation})=>({
                    headerTintColor: COLORS.greenM,
                    headerTitleStyle:{fontFamily: 'NotoSansMyanmar_700Bold', fontSize: 25, letterSpacing: 2},
                    drawerPosition: 'right',
                    headerRight: () => {
                        return (
                        <>
                            <Pressable onPress={() => navigation.openDrawer()}>
                            <MaterialIcons
                                name="workspaces-outline"
                                size={26}
                                color={COLORS.greenM}
                                style={{ marginRight: '10%' }}
                            />
                            </Pressable>
                        </>
                        );
                    },
                    headerLeftContainerStyle: {width: '5%'},
                    headerLeft: false,
                    headerStyle:{backgroundColor: COLORS.back, elevation: 0},
                    drawerStyle: {
                        backgroundColor: COLORS.back,
                        width: 240,
                        height: 400,
                        marginTop: 30,
                        borderRadius: 10,
                    }
                })}
                drawerContent={(props) => <CustomDrawerContent {...props} />}  
            >
                <Drawer.Screen name='Principal' options={{
                    headerTitle: `Distrito ${distritoID}`,//props => <Title {...props} /> ,
                    drawerIcon: ({focused, size}) => (
                        <MaterialCommunityIcons 
                            name="chart-donut-variant"
                            size={size}
                            color={focused ? COLORS.greenM : COLORS.grey}
                            style={styles.icon}
                        />
                    ),
                    }}>
                {() => (
                <BottomsTabs.Navigator 
                screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: Platform.OS === 'android' ? COLORS.greenM : COLORS.grey,
                    },
                    headerTintColor: Platform.OS === 'android' ? COLORS.greenM : COLORS.grey,
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontFamily: 'NotoSansMyanmar_400Regular',
                        color: COLORS.black
                        },
                    tabBarIconStyle: {
                        width: 40,
                        height: 40
                    },
                }} >
                <BottomsTabs.Screen 
                    name='Diputados'
                    component={NaveDiputados}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.item}>
                                <Ionicons name="people-circle" size={40} color={focused ? COLORS.greenM : COLORS.grey} />
                            </View>
                        )
                    }}
                />
                <BottomsTabs.Screen
                    name='Senadores'
                    component={NaveSenadores}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.item}>
                                <Ionicons name="people-circle-outline" size={40} color={focused ? COLORS.greenM : COLORS.grey} />
                            </View>
                        )
                    }}
                />
                <BottomsTabs.Screen
                    name='Camaras'
                    component={NaveCamaras}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.item}>
                                <MaterialCommunityIcons name="chart-donut-variant" size={40} color={focused ? COLORS.greenM : COLORS.grey} />
                            </View>
                        )
                    }}
                />
            </BottomsTabs.Navigator>
            )}
                </Drawer.Screen>
                <Drawer.Screen name='Presentación' component={Presentacion} options={{
                    title: 'Presentación',
                    drawerIcon: ({focused, size}) => (
                        <FontAwesome 
                            name="eye" 
                            size={size}
                            color={focused ? COLORS.greenM : COLORS.grey}
                        />
                    ),
                    }}/>
            </Drawer.Navigator>    
            ) : (
                <Stack.Navigator 
                    name='SelectDistrito'
                    screenOptions={{
                    headerShown: false,
                }}>
                    <Stack.Screen name='SelectDistrito' component={SelectDistrito} options={{headerBackVisible: false}} />
                </Stack.Navigator>
            )}
        </>
    )
    
}

const styles = StyleSheet.create({
  tabBar: {
    height: '10%',
    justifyContent: 'center',
    backgroundColor: COLORS.back,
    width: '100%',
    elevation: 0,
    shadowColor: 'transparent',
    borderTopWidth: 0
  },
  item: {


  },
  label: {
    fontFamily: 'NotoSansMyanmar_400Regular',
    color: COLORS.black,
    fontSize: 12,
  },
  icon: {

  }
})

export default MyDrawer