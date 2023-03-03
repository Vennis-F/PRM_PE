import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "http://192.168.1.4:3000/api/v1/") //Network IPv4 Address
    : (baseURL = "http://localhost:3000/api/v1/");
}

export default baseURL;
