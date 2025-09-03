import React, { memo } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchBarWithFilter = ({
  value,
  onChangeText,
  onOpenFilter,
  onSubmit,
}) => {
  return (
    <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl px-3 py-2">
      <Ionicons name="search-outline" size={20} color="#6B7280" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search properties"
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-2 text-gray-800 dark:text-gray-100"
        returnKeyType="search"
        onSubmitEditing={() => onSubmit?.(value)}
      />
      <TouchableOpacity
        onPress={onOpenFilter}
        className="ml-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-700"
      >
        <Ionicons name="options-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(SearchBarWithFilter); 