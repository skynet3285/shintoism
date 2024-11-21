import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoSelectScreenNavigationProp } from "../StackNavigation";
import { frames } from "../../assets/frames/frames";
import { numbers } from "../../assets/selectNum/number";
import { backNumbers } from "../../assets/selectNum/number";
import { useFrameContext } from "../context/FrameContext";
import { useImgsContext } from "../context/ImgsContext";
import SelectBtn from "../component/SelectBtn";
import QRCode from "react-native-qrcode-svg";
import qrLogo from "../../assets/logo/qrLogo.png";
import HomeBtn from "../component/HomeBtn";

const getDateTime = () => {
  const now = new Date();
  const year = now.getFullYear().toString().substring(2, 4);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const dateTimeString = `${year}-${month}-${day}_${hours}${minutes}${seconds}`;

  return dateTimeString;
};

export default function PhotoSelectScreen(
  props: PhotoSelectScreenNavigationProp
) {
  const viewRef = useRef<ViewShot | null>(null);
  const { frameIndex } = useFrameContext();
  const { imgs } = useImgsContext();

  const [position1, setPosition1] = useState<string>();
  const [position2, setPosition2] = useState<string>();
  const [position3, setPosition3] = useState<string>();
  const [position4, setPosition4] = useState<string>();

  const [selectedImages, setSelectedImages] = useState<
    { index: number; order: number }[]
  >([]);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>();
  const qrServer = `${process.env.API_URL}`;

  // 이미지 토글
  const toggleImageSelection = (index: number) => {
    const isSelected = selectedImages.find((img) => img.index === index);

    if (isSelected) {
      // 이미지 선택 해제
      setSelectedImages(selectedImages.filter((img) => img.index !== index));

      switch (isSelected.order) {
        case 1:
          setPosition1(undefined);
          break;
        case 2:
          setPosition2(undefined);
          break;
        case 3:
          setPosition3(undefined);
          break;
        case 4:
          setPosition4(undefined);
          break;
      }
    } else if (selectedImages.length < 4) {
      // 이미지 선택
      const usedOrders = selectedImages.map((img) => img.order);
      const newOrder = Array.from({ length: 4 }, (_, i) => i + 1).find(
        (order) => !usedOrders.includes(order)
      )!;

      setSelectedImages([...selectedImages, { index, order: newOrder }]);
      console.log("셀렉 이미지 ", selectedImages[0]);

      switch (newOrder) {
        case 1:
          setPosition1(imgs[index]);
          break;
        case 2:
          setPosition2(imgs[index]);
          break;
        case 3:
          setPosition3(imgs[index]);
          break;
        case 4:
          setPosition4(imgs[index]);
          break;
      }
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const selectedItem = selectedImages.find((img) => img.index === index);
    console.log(selectedItem);
    console.log("------------");

    return (
      <TouchableOpacity
        className="mx-2"
        onPress={() => toggleImageSelection(index)}
      >
        <Image
          source={{ uri: item }}
          className="w-[135px] h-[180px]"
          resizeMode="contain"
        />

        {/* 선택된 이미지 배치 순서 */}
        {selectedItem && (
          <View className="absolute  w-full h-full bg-black/50 justify-center items-center">
            <Image
              source={numbers[selectedItem.order - 1]}
              className="w-[50px] h-[50px]"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const upload = async (imagePath: string) => {
    const url = `${qrServer}/v1/images/catchmeifyoucan`;

    const originalFilename = imagePath.split("/").pop();
    if (!originalFilename) {
      throw new Error("Invalid file URI");
    }

    const dateTime = getDateTime();

    const extension = originalFilename.split(".").pop();
    const filename = `${originalFilename.split(".")[0]}_${dateTime}.${
      extension || "png"
    }`;

    const formData = new FormData();
    formData.append("image", {
      uri: imagePath,
      name: filename,
      type: "image/png",
    } as any);

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);

    const hashName = response.data.hashName;
    const name = response.data.name;
    if (!hashName || typeof hashName !== "string") {
      throw new Error("Invalid response from server");
    }

    setQrCodeUrl(`${qrServer}/v1/images/${hashName}/hd.jpg`);
    console.log("QR URL 설정 완료:", qrCodeUrl);
  };

  const captureAndUpload = async (retryCount = 0) => {
    try {
      if (!viewRef.current?.capture) {
        console.error("Capture method is unavailable.");
        Alert.alert("Error", "Capture method is unavailable.");
        return;
      }

      const { status } = await MediaLibrary.getPermissionsAsync();
      console.log("현재 권한 상태: ", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access media library is required! Please enable it in the settings."
        );
        return;
      }

      const uri = await viewRef.current.capture();
      console.log("Captured URI:", uri);

      // 로컬 저장
      await MediaLibrary.saveToLibraryAsync(uri);

      await upload(uri);

      console.log("Capture and upload succeeded!");
    } catch (error) {
      console.error((error as Error).name, (error as Error).message);

      if (retryCount < 2) {
        console.log(`Retrying... (${retryCount + 1})`);
        await captureAndUpload(retryCount + 1);
      } else {
        Alert.alert("서버와 통신 오류", "!!관리자에게 문의해주세요!!");
      }
    }
  };

  // 권한 요청
  const getPermissions = async () => {
    try {
      console.log("권한 요청 중");
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("권한: ", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access media library is required! Please enable it in the settings."
        );
      } else {
        console.log("권한이 부여되었습니다.");
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to request permission.");
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <SafeAreaView className="flex-1 w-screen h-screen bg-[#19171c] justify-center items-center">
      {!qrCodeUrl && (
        <View className="absolute top-[100px] left-[-50px]">
          <HomeBtn title="" />
        </View>
      )}
      <View className="justify-center items-center">
        <ViewShot
          ref={viewRef}
          options={{ fileName: "shared", format: "png", quality: 1 }}
          style={{
            position: "absolute",
            backgroundColor: "#ffb2b2",
            width: 540,
            height: 799,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className=" w-[482px] h-[638px] top-[624px]">
            {/* position1 */}
            <View>
              {position1 === undefined ? (
                <Image
                  source={backNumbers[0]}
                  className="absolute w-[235px] h-[314px]"
                />
              ) : (
                <Image
                  source={{ uri: position1 }}
                  className="absolute w-[235px] h-[314px]"
                />
              )}
            </View>
            {/* position2 */}
            <View>
              {position2 === undefined ? (
                <Image
                  source={backNumbers[1]}
                  className="absolute w-[235px] h-[314px] left-[249px]"
                />
              ) : (
                <Image
                  source={{ uri: position2 }}
                  className="absolute w-[235px] h-[314px] left-[249px]"
                />
              )}
            </View>
            {/* position3 */}
            <View>
              {position3 === undefined ? (
                <Image
                  source={backNumbers[2]}
                  className="absolute w-[235px] h-[314px] top-[326px]"
                />
              ) : (
                <Image
                  source={{ uri: position3 }}
                  className="absolute w-[235px] h-[314px] top-[326px]"
                />
              )}
            </View>
            {/* position4 */}
            <View>
              {position4 === undefined ? (
                <Image
                  source={backNumbers[3]}
                  className="absolute  w-[235px] h-[314px] top-[326px] left-[249px]"
                />
              ) : (
                <Image
                  source={{ uri: position4 }}
                  className="absolute  w-[235px] h-[314px] top-[326px] left-[249px]"
                />
              )}
            </View>
          </View>

          <View className="bottom-[319px]">
            <Image
              source={frames[frameIndex]}
              className="w-[540px] h-auto"
              resizeMode="contain"
            />
          </View>
        </ViewShot>
        <View className="w-full h-[400px] top-[400px] items-center mt-3">
          {!qrCodeUrl ? (
            <View className="flex items-center mt-4">
              <Text
                style={{ fontFamily: "DOSMyungjo" }}
                className="text-[#fff] text-[24px]"
              >
                옆으로 넘길 수 있어요
              </Text>

              <View className="w-[800px] h-[180px] mt-3 mb-7">
                <FlatList
                  data={imgs}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              {position1 && position2 && position3 && position4 ? (
                <SelectBtn title="선택완료" onPress={captureAndUpload} />
              ) : (
                <View className="bg-[#bdbdbd] rounded-[25px] justify-center items-center w-full px-[20px] py-[20px]">
                  <Text
                    style={{ fontFamily: "DOSMyungjo" }}
                    className="text-[#222222] text-[60px] text-center"
                  >
                    사진을 선택해 주세용~~
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="items-center">
              <Text
                style={{ fontFamily: "DOSMyungjo" }}
                className="text-[#fff] text-[24px] m-4"
              >
                QR 코드 스캔하고 다운로드!!
              </Text>
              <QRCode
                value={qrCodeUrl || "Default QR Code Value"}
                size={220}
                color="#000000"
                backgroundColor="#FFFFFF"
                logo={qrLogo}
                logoSize={30}
                logoBackgroundColor="#fff"
                logoMargin={1}
                logoBorderRadius={10}
                quietZone={10}
              />
              <View className="m-3">
                <HomeBtn title="홈 화면으로" />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
