import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import home from "../../assets/logo/home.png";
import { RootStackParamList } from "../StackNavigation";
import { useFrameContext } from "../context/FrameContext";
import { useImgsContext } from "../context/ImgsContext";

interface HomeBtnProps {
  title: string;
}

export default function HomeBtn({ title }: HomeBtnProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setFrameIndex } = useFrameContext();
  const { setImgs } = useImgsContext();

  const goHome = () => {
    setFrameIndex(0);
    setImgs([]);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <TouchableOpacity
      onPress={goHome}
      className="bg-[#19171c] rounded-[25px] flex-row justify-center items-center w-[260px] px-[30px] py-[20px]"
    >
      <Image
        source={home}
        className="w-[40px] h-[40px] mr-2"
        resizeMode="contain"
      />
      {title && (
        <Text
          style={{ fontFamily: "DOSMyungjo" }}
          className="text-[#BDBDBD] text-[40px] text-center"
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
