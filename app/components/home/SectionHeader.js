import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const SectionHeader = ({ title, onSeeAll }) => (
  <View className="flex-row justify-between items-center mb-3 px-5">
    <Text className="text-lg font-bold dark:text-white">{title}</Text>
    <TouchableOpacity onPress={onSeeAll}>
      <Text className="text-blue-600 dark:text-blue-400">See All</Text>
    </TouchableOpacity>
  </View>
);

export default memo(SectionHeader); 