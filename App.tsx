import React from "react";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { setCustomText } from "react-native-global-props";
import StackNavigation from "./src/StackNavigation";
import { FrameProvider } from "./src/context/FrameContext";
import { ImgsProvider } from "./src/context/ImgsContext";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        DanjoboldRegular: require("./assets/fonts/Danjo-bold-Regular.otf"),
        DOSIyagiBoldface: require("./assets/fonts/DOSIyagiBoldface.ttf"),
        DOSGothic: require("./assets/fonts/DOSGothic.ttf"),
        DOSPilgi: require("./assets/fonts/DOSPilgi.ttf"),
        DOSMyungjo: require("./assets/fonts/DOSMyungjo.ttf"),
        DOSSaemmul: require("./assets/fonts/DOSSaemmul.ttf"),
        MiraeroNormal: require("./assets/fonts/MiraeroNormal.ttf"),
        Sam3KRFont: require("./assets/fonts/Sam3KRFont.ttf"),
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
      fontFamily:
        "DOSPilgi, DOSIyagiBoldface, DanjoboldRegular, DOSGothic, DOSMyungjo, DOSSaemmul, MiraeroNormal, Sam3KRFont",
    },
  };
  setCustomText(customTextProps);

  return (
    <FrameProvider>
      <ImgsProvider>
        <StackNavigation />
      </ImgsProvider>
    </FrameProvider>
  );
}
