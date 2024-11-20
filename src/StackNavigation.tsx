import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from "@react-navigation/stack";
import HomeScreen from "./Layout/HomeScreen";
import FrameSelectScreen from "./Layout/FrameSelectScreen";
import CameraScreen from "./Layout/CameraScreen";
import PhotoSelectScreen from "./Layout/PhotoSelectScreen";

export type RootStackParamList = {
  Home: undefined;
  FrameSelect: undefined;
  Camera: undefined;
  PhotoSelect: undefined;
};

export type HomeScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};
export type FrameScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "FrameSelect">;
};
export type CameraScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "Camera">;
};
export type PhotoSelectScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "PhotoSelect">;
};

/**
 * 앱에 대한 페이지 이동을 관리합니다.
 */
function StackNavigation(): React.JSX.Element {
  const Stack = createStackNavigator<RootStackParamList>();

  const option: StackNavigationOptions = {
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={option}>
        {/* 메인 페이지 */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* 프레임 선택 페이지 */}
        <Stack.Screen name="FrameSelect" component={FrameSelectScreen} />
        {/* 카메라 페이지 */}
        <Stack.Screen name="Camera" component={CameraScreen} />
        {/* 사진 선택 페이지 */}
        <Stack.Screen name="PhotoSelect" component={PhotoSelectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default StackNavigation;
