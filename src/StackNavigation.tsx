import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack";
import HomeScreen from "./Layout/HomeScreen";
import CameraScreen from "./Layout/CameraScreen";
import FrameSelectScreen from "./Layout/FrameSelectScreen";

type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  FrameSelect: undefined;
};

export type HomeScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};
export type CameraScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "Camera">;
};
export type FrameSelectScreenNavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, "FrameSelect">;
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
        {/* 카메라 페이지 */}
        <Stack.Screen name="Camera" component={CameraScreen} />
        {/* 프레임 선택 페이지 */}
        <Stack.Screen name="FrameSelect" component={FrameSelectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default StackNavigation;
