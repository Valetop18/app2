import "react-native-gesture-handler";
import React from "react";
import { useFonts } from "expo-font";
import MainNavigation from "./navigation/index";
import store from "./store";
import { Provider } from "react-redux";
import { Sedan_400Regular } from "@expo-google-fonts/sedan";
import {
  NotoSansMyanmar_100Thin,
  NotoSansMyanmar_200ExtraLight,
  NotoSansMyanmar_300Light,
  NotoSansMyanmar_400Regular,
  NotoSansMyanmar_500Medium,
  NotoSansMyanmar_600SemiBold,
  NotoSansMyanmar_700Bold,
  NotoSansMyanmar_800ExtraBold,
  NotoSansMyanmar_900Black,
} from "@expo-google-fonts/noto-sans-myanmar";
import { BuscadorProvider } from "./context/BuscadorContext";
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "./context/TooltipProvider";
import { ReaccionesProvider } from "./context/ReaccionesContext";
import { DataProvider } from "./context/DataContext";

export default function App() {
  //const [loaded] = useFonts({
  //OverBold: require('./assets/fonts/Overpass-Bold.ttf'),
  ////OverLight: require('./assets/fonts/Overpass-Light.ttf'),
  //OverMedium: require('./assets/fonts/Overpass-Medium.ttf'),
  //OverRegular: require('./assets/fonts/Overpass-Regular.ttf'),
  //OverSemiBoldItalic: require('./assets/fonts/Overpass-SemiBoldItalic.ttf'),
  //})

  //if(!loaded) return <AppLoading />

  let [fontsLoaded] = useFonts({
    Sedan_400Regular,
    NotoSansMyanmar_100Thin,
    NotoSansMyanmar_200ExtraLight,
    NotoSansMyanmar_300Light,
    NotoSansMyanmar_400Regular,
    NotoSansMyanmar_500Medium,
    NotoSansMyanmar_600SemiBold,
    NotoSansMyanmar_700Bold,
    NotoSansMyanmar_800ExtraBold,
    NotoSansMyanmar_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <BuscadorProvider>
          <TooltipProvider>
            <ReaccionesProvider>
              <DataProvider>
                <MainNavigation />
              </DataProvider>
            </ReaccionesProvider>
          </TooltipProvider>
        </BuscadorProvider>
      </Provider>
    </AuthProvider>
  );
}
