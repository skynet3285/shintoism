/// <reference types="react-native" />

declare module "*.png" {
  import { ImageSourcePropType } from "react-native";

  const value: ImageSourcePropType;
  export default value;
}
