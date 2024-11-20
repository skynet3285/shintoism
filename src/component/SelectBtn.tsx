import { TouchableOpacity, Text } from "react-native";

export default function SelectBtn(props: {
  title: string;
  onPress: () => void;
}) {
  const { title, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-black rounded-[25px] justify-center items-center w-[300px] px-[20px] py-[20px]"
    >
      <Text
        style={{ fontFamily: "DOSMyungjo" }}
        className="text-[#BDBDBD] text-[60px] text-center"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
