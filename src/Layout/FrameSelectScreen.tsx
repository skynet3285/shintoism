import React, { useState } from "react";
import { Text, Image, TouchableOpacity, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FrameScreenNavigationProp } from "../StackNavigation";
import { shadowFrames } from "../../assets/frames/frames";
import SelectBtn from "../component/SelectBtn";
import { useFrameContext } from "../context/FrameContext";
import HomeBtn from "../component/HomeBtn";

export default function FrameSelectScreen(props: FrameScreenNavigationProp) {
  const { navigation } = props;

  const { frameIndex, setFrameIndex } = useFrameContext();
  const selectedFrame = shadowFrames[frameIndex];

  const renderItem = ({ item, index }: { item: number; index: number }) => (
    <TouchableOpacity
      className="mx-2 justify-center items-center"
      onPress={() => {
        setFrameIndex(index);
        console.log("selectFrameIndex: ", index);
      }}
    >
      <Image
        source={item}
        className="w-[120px] h-[120px]"
        resizeMode="contain"
      />
      {frameIndex === index && (
        <View className="absolute w-[82px] h-[120px] justify-center items-center">
          <View className="absolute w-[82px] h-[120px] bg-black opacity-60 "></View>
          <Text className=" text-[28px]">✅</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-[#19171c] justify-center items-center">
      <View className="absolute top-[100px] left-[-50px]">
        <HomeBtn title="" />
      </View>
      <View className="top-96">
        <Text
          style={{ fontFamily: "DOSMyungjo" }}
          className="text-[#fff] text-[40px] text-center "
        >
          프레임을 선택해 보아요
        </Text>
      </View>

      {/* 선택된 프레임 */}
      <View className="flex justify-center items-center top-[180px]">
        {selectedFrame ? (
          <Image
            source={selectedFrame}
            className="w-[450px] h-auto"
            resizeMode="contain"
          />
        ) : (
          <Text className="text-gray-400 text-lg">프레임을 선택하세요</Text>
        )}
      </View>

      <View className="w-full bottom-7">
        <Text
          style={{ fontFamily: "DOSMyungjo" }}
          className="text-[#fff] text-[24px] text-center"
        >
          옆으로 넘길 수 있어요
        </Text>
      </View>

      <View className="w-[750px] h-[120px] mb-2 ">
        <FlatList
          data={shadowFrames}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View className="btn-containner items-center pb-[100px] mt-5 mb-64">
        <SelectBtn
          title="선택"
          onPress={() => {
            navigation.navigate("Camera");
            console.log("selectFrameIndexContext: ", frameIndex);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
