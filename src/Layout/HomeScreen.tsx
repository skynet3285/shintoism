import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreenNavigationProp } from "../StackNavigation";
import SelectBtn from "../component/SelectBtn";
import MainLogo from "../../assets/camera/MainLogo.png";

export default function HomeScreen(props: HomeScreenNavigationProp) {
  const { navigation } = props;

  return (
    <SafeAreaView className="bg-[#19171c] h-full w-full">
      <View className="flex-1 justify-center items-center">
        <Image
          source={MainLogo}
          className="w-[100%] h-auto"
          resizeMode="contain"
        />
      </View>
      <View className="btn-containner items-center pb-[100px]">
        <SelectBtn
          title="시작하기"
          onPress={() => {
            navigation.navigate("Camera");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
