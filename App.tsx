import React from "react";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { setCustomText } from "react-native-global-props";
import StackNavigation from "./src/StackNavigation";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        DanjoboldRegular: require("./assets/fonts/Danjo-bold-Regular.otf"),
        DOSGothic: require("./assets/fonts/DOSGothic.ttf"),
        DOSPilgi: require("./assets/fonts/DOSPilgi.ttf"),
        DOSMyungjo: require("./assets/fonts/DOSMyungjo.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const customTextProps = {
    style: {
      fontFamily: "DOSPilgi, DanjoboldRegular, DOSGothic, DOSMyungjo",
    },
  };
  setCustomText(customTextProps);

  return <StackNavigation />;
}
