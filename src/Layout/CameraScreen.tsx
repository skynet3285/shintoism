import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { CameraScreenNavigationProp } from "../StackNavigation";
import SelectBtn from "../component/SelectBtn";
import ShotFrame from "../../assets/camera/ShotFrame.png";

export default function CameraScreen(props: CameraScreenNavigationProp) {
  const { navigation } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isShutter, setIsShutter] = useState(false);
  const shutterCount = 3;
  const [count, setCount] = useState(shutterCount);
  const [photo, setPhoto] = useState<string | undefined>("");

  const checkPermissions = async () => {
    if (!permission) return;

    if (permission.status !== "granted") {
      if (!permission.canAskAgain) {
        Alert.alert(
          "권한 필요",
          "앱 설정에서 카메라 권한을 변경해주세요.",
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정 열기",
              onPress: () => {
                Linking.openSettings(); // 설정을 여는 기능
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // 권한을 다시 요청할 수 있을 때
        requestPermission();
      }
    }
  };

  useEffect(() => {
    checkPermissions();
  }, [permission]);

  useEffect(() => {
    if (!photo) return;

    console.log("Photo:", photo);
  }, [photo]);

  console.log(permission);

  if (permission?.status !== "granted") {
    return (
      <SafeAreaView className="bg-slate-800">
        <Text className="text-center text-gray-300 text-[50px]">
          카메라 권한을 허용해주세요.
        </Text>
      </SafeAreaView>
    );
  }

  async function takePicture() {
    if (isShutter) return;

    setIsShutter(true);
    setCount(3);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync();
          console.log("Photo taken:", photo);
          setPhoto(photo?.uri);
        } catch (error) {
          console.error("Failed to take photo:", error);
        }
      }

      setIsShutter(false);
    }, 3000);
  }

  return (
    <SafeAreaView>
      <View className="absolute bg-[#19171c] w-full justify-center items-center">
        <Image
          source={ShotFrame}
          className="bottom-[184px] w-[80%] h-auto"
          resizeMode="contain"
        />
      </View>
      <View className="TopView w-full h-[90px]"></View>
      <View className="CameraBox w-full justify-center items-center ">
        <View className="CameraBox flex w-[72%] h-[84%]">
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={"front"}
            animateShutter={true}
          >
            {isShutter && (
              <View className="w-full h-full justify-center">
                <Text
                  style={{ fontFamily: "DanjoBoldRegular" }}
                  className="text-center text-[500px] text-red-800"
                >
                  {count}
                </Text>
              </View>
            )}
          </CameraView>
        </View>
      </View>
      <View className="ShutterBox w-full items-center">
        <SelectBtn
          title="사진촬영"
          onPress={() => {
            takePicture();
          }}
        />
      </View>
      <View />
    </SafeAreaView>
  );
}
