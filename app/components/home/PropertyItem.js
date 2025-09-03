import React, { memo, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const PropertyItem = ({ item, onPress, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite(item);
  };

  const locationString = [
    item.address?.subregion?.subregion_name,
    item.address?.location?.location,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mx-2"
      style={{ width: CARD_WIDTH }}
    >
      <View className="relative">
        {!item.images || item.images.length === 0 ? (
          <View
            style={{ height: CARD_WIDTH * 0.66 }}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 justify-center items-center"
          >
            <Ionicons name="image-outline" size={SCREEN_WIDTH * 0.08} color="#9CA3AF" />
          </View>
        ) : (
          <View
            style={{ height: CARD_WIDTH * 0.66 }}
            className="relative rounded-xl mb-4 overflow-hidden"
          >
            <Image source={{ uri: item.images[0] }} className="w-full h-full" resizeMode="cover" />
            <View className="absolute top-2 left-2 bg-black/60 px-3 py-1.5 rounded-full">
              <Text className="text-white font-bold">ETB {item.price?.toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#EF4444" : "#6B7280"} />
            </TouchableOpacity>
            <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-full flex-row items-center">
              <Ionicons name="eye-outline" size={14} color="white" />
              <Text className="text-white text-xs ml-1">{item.views?.count || 0}</Text>
            </View>
          </View>
        )}
      </View>

      <View>
        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-2" numberOfLines={1}>
          {item.title}
        </Text>
        <View className="flex-row items-start">
          <Ionicons name="location-outline" size={14} color="#6B7280" className="mt-1" />
          <Text className="text-gray-500 dark:text-gray-400 ml-1 flex-1" numberOfLines={2}>
            {locationString}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(PropertyItem); 