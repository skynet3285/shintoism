import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreenNavigationProp } from "../StackNavigation";
import SelectBtn from "../component/SelectBtn";
import MainLogo from "../../assets/camera/MainLogo.png";
import { shadowFrames } from "../../assets/frames/frames";
import { useFrameContext } from "../context/FrameContext";
import { useImgsContext } from "../context/ImgsContext";

export default function HomeScreen(props: HomeScreenNavigationProp) {
  const { navigation } = props;
  const { frameIndex, setFrameIndex } = useFrameContext();
  const { imgs, setImgs } = useImgsContext();

  const hanldeResetContext = () => {
    setFrameIndex(0);
    setImgs([]);
  };

  return (
    <SafeAreaView className="bg-[#19171c] h-full w-full">
      <View className="flex-1 justify-center items-center mb-[60px]">
        <Image
          source={MainLogo}
          className="w-[100%] h-auto"
          resizeMode="contain"
        />
      </View>
      <View className="btn-containner items-center bottom-[280px]">
        <SelectBtn
          title="시작하기"
          onPress={() => {
            console.log(shadowFrames);
            hanldeResetContext();
            navigation.navigate("FrameSelect");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
