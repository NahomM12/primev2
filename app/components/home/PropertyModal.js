import React, { memo, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Dimensions, Linking, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PaymentMethodSelector = memo(({ paymentMethod, setPaymentMethod }) => (
  <View className="mb-4">
    <Text className="text-gray-800 dark:text-white font-semibold mb-2">Select Payment Method</Text>
    {["cash", "bank_transfer", "mortgage"].map((method) => (
      <TouchableOpacity
        key={method}
        onPress={() => setPaymentMethod(method)}
        className={`flex-row items-center p-4 rounded-xl mb-2 ${
          paymentMethod === method ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <Ionicons
          name={
            method === "cash"
              ? "cash-outline"
              : method === "bank_transfer"
              ? "card-outline"
              : "business-outline"
          }
          size={24}
          color={paymentMethod === method ? "#3B82F6" : "#6B7280"}
        />
        <Text
          className={`ml-3 capitalize ${
            paymentMethod === method ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {method.replace("_", " ")}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
));

const PropertyModal = ({
  visible,
  onClose,
  property,
  favouriteOn,
  onFavourite,
  onBuy,
  isPurchasing,
  showPaymentOptions,
  setShowPaymentOptions,
  paymentMethod,
  setPaymentMethod,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!visible || !property) return null;

  const locationString = [
    property?.address?.region?.region_name,
    property?.address?.subregion?.subregion_name,
    property?.address?.location?.location_name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden">
          <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full">
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <ScrollView className="flex-1">
            <View className="relative" style={{ height: SCREEN_HEIGHT * 0.4 }}>
              {property.images && property.images.length > 0 ? (
                <>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                      const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                      setActiveImageIndex(newIndex);
                    }}
                  >
                    {property.images.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.4 }}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                  <View className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs">{activeImageIndex + 1}/{property.images.length}</Text>
                  </View>
                </>
              ) : (
                <View className="w-full h-72 bg-gray-200 dark:bg-gray-700 items-center justify-center">
                  <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View className="p-6">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{property.title}</Text>
                  <Text className="text-xl font-bold text-[#FF8E01]">ETB {property.price?.toLocaleString()}</Text>
                </View>
                <TouchableOpacity onPress={onFavourite} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                  <Ionicons name={favouriteOn ? "heart" : "heart-outline"} size={24} color={favouriteOn ? "#EF4444" : "#6B7280"} />
                </TouchableOpacity>
              </View>

              {locationString && (
                <View className="flex-row items-start mb-4">
                  <Ionicons name="location-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2 flex-1">{locationString}</Text>
                </View>
              )}

              {(property.propertyType?.name || property.status || Object.keys(property.typeSpecificFields || {}).length > 0) && (
                <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Property Details</Text>
                  <View className="flex-row flex-wrap">
                    {property.propertyType?.name && (
                      <View className="w-1/2 mb-3">
                        <Text className="text-gray-500 dark:text-gray-400">Type</Text>
                        <Text className="text-gray-800 dark:text-white font-medium">{property.propertyType.name}</Text>
                      </View>
                    )}
                    {property.status && (
                      <View className="w-1/2 mb-3">
                        <Text className="text-gray-500 dark:text-gray-400">Status</Text>
                        <Text className="text-gray-800 dark:text-white font-medium capitalize">{property.status}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {property.description && (
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</Text>
                  <Text className="text-gray-600 dark:text-gray-300">{property.description}</Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View className="p-5 border-t border-gray-200 dark:border-gray-800">
            {property?.property_use === "rent" ? (
              <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <Text className="text-gray-800 dark:text-white font-semibold mb-2">Contact Owner</Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="call-outline" size={20} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-300 ml-2">
                      {property?.owner?.phone || "Phone not available"}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${property?.owner?.phone}`)} className="bg-[#FF8E01] px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium">Call Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : showPaymentOptions ? (
              <View>
                <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                <TouchableOpacity onPress={onBuy} disabled={isPurchasing} className={`${isPurchasing ? "bg-gray-400" : "bg-[#FF8E01]"} rounded-xl py-4 px-6`}>
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-base">Confirm Purchase</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setShowPaymentOptions(true)} className="bg-[#FF8E01] rounded-xl py-4 px-6">
                <Text className="text-white text-center font-semibold text-base">Buy Property</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(PropertyModal); 