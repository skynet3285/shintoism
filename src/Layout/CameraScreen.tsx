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
import { useImgsContext } from "../context/ImgsContext";
import * as ImageManipulator from "expo-image-manipulator";
import HomeBtn from "../component/HomeBtn";

export default function CameraScreen(props: CameraScreenNavigationProp) {
  const { navigation } = props;
  const { imgs, setImgs } = useImgsContext();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isShutter, setIsShutter] = useState(false);
  const shutterCount = 3;
  const [count, setCount] = useState(shutterCount);
  const [photo, setPhoto] = useState<string | undefined>("");
  const [imgCount, setImgCount] = useState(0);

  const maxPhotos = 6;

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
    if (photo) {
      setImgs((prevImgs) => [...prevImgs, photo]);
      setImgCount((prevCount) => prevCount + 1);
    }
  }, [photo]);

  useEffect(() => {
    if (imgCount === maxPhotos) {
      setTimeout(() => {
        navigation.navigate("PhotoSelect");
      }, 500);
    }
  }, [imgCount]);

  useEffect(() => {
    if (!photo) return;

    console.log("Photo:", photo);
  }, [photo]);

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
    if (isShutter || imgCount >= maxPhotos) return;

    setIsShutter(true);
    setCount(shutterCount);

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
          const photoResult = await cameraRef.current.takePictureAsync();

          if (photoResult?.uri) {
            // 좌우 반전 처리
            const manipulatedPhoto = await ImageManipulator.manipulateAsync(
              photoResult.uri,
              [{ flip: ImageManipulator.FlipType.Horizontal }],
              {
                compress: 1,
                format: ImageManipulator.SaveFormat.JPEG,
              }
            );

            setPhoto(manipulatedPhoto.uri);
          } else {
            console.error("사진 촬영에 실패했습니다.");
          }
        } catch (error) {
          console.error("사진 촬영 및 반전 실패:", error);
        }
      }

      setIsShutter(false);
    }, 3000);
  }

  return (
    <SafeAreaView className="flex-1 w-screen h-screen bg-[#19171c] justify-center items-center">
      <View className="absolute top-[100px] left-[-50px]">
        <HomeBtn title="" />
      </View>

      <View className="flex-1 w-full justify-center items-center ">
        <Image
          source={ShotFrame}
          className="top-[420px] w-[720px] h-auto"
          resizeMode="contain"
        />

        <View className="CameraBox flex w-[650px] h-[866px] bottom-[816px]">
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
                  className="text-center text-[400px] text-red-800"
                >
                  {count}
                </Text>
              </View>
            )}
          </CameraView>
        </View>
      </View>

      <View className="w-full bottom-[70px] items-center ">
        <Text
          style={{ fontFamily: "DOSMyungjo" }}
          className="text-[#fff] text-[50px] text-center mb-3"
        >
          {imgCount} | {maxPhotos}
        </Text>
        <SelectBtn
          title="사진촬영"
          onPress={() => {
            takePicture();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
