import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  containerStyle,
  secureTextEntry,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordField = title?.toLowerCase().includes("password");

  const getFieldIcon = () => {
    const fieldType = title?.toLowerCase().replace(/\s+/g, "") || "";
    if (fieldType.includes("email")) return "email-outline";
    if (fieldType.includes("phone")) return "phone-outline";
    if (fieldType.includes("password")) return "lock-outline";
    if (fieldType.includes("name")) return "account-outline";
    if (fieldType.includes("location")) return "map-marker-outline";
    if (fieldType.includes("price")) return "cash";
    if (fieldType.includes("description")) return "text-box-outline";
    if (fieldType.includes("title")) return "format-title";
    if (fieldType.includes("bedrooms")) return "bed-outline";
    if (fieldType.includes("bathrooms")) return "shower";
    if (fieldType.includes("area")) return "floor-plan";
    if (fieldType.includes("garage")) return "garage-outline";
    if (fieldType.includes("yearbuilt")) return "calendar-outline";
    if (fieldType.includes("floor")) return "layers-outline";
    return "pencil-box-outline"; // A generic fallback icon
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </Text>

      <View
        className={`w-full h-14 flex-row items-center pr-4 border-b-2
          ${
            isFocused
              ? "border-orange-500"
              : error
              ? "border-red-500"
              : "border-gray-200 dark:border-gray-700"
          } 
          ${containerStyle}`}
      >
        <View className="w-12 h-full flex items-center justify-center">
          <MaterialCommunityIcons
            name={getFieldIcon()}
            size={24}
            color={isFocused ? "#FF8E01" : error ? "#EF4444" : "#9CA3AF"}
          />
        </View>

        <TextInput
          className="flex-1 text-gray-900 dark:text-white font-medium text-lg h-full"
          style={{
            textAlignVertical: "center",
            paddingVertical: 0,
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A1A1AA"
          onChangeText={handleChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={isFocused ? "#FF8E01" : "#9CA3AF"}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View className="flex-row items-center space-x-2 mt-1 px-1">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color="#EF4444"
          />
          <Text className="text-red-500 text-sm font-medium">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default FormField;
