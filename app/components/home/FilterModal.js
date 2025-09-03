import React, { memo } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FilterOption = memo(({ icon, label, children }) => (
  <View className="mb-6">
    <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex-row items-center">
      <Ionicons name={icon} size={16} color="#6B7280" style={{ marginRight: 8 }} />
      {label}
    </Text>
    {children}
  </View>
));

const FilterModal = ({ visible, onClose, filterValues, onChangeFilter, onSubmit }) => {
  const propertyUseOptions = [
    { label: "All", value: "" },
    { label: "Rent", value: "rent" },
    { label: "Sell", value: "sell" },
  ];

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/20">
        <View className="flex-1 bg-white dark:bg-gray-900 mt-24 rounded-t-3xl">
          <View className="relative border-b border-gray-200 dark:border-gray-800 p-6">
            <TouchableOpacity onPress={onClose} className="absolute right-6 top-6 z-50 p-2">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-gray-800 dark:text-white font-semibold" style={{ fontSize: SCREEN_WIDTH * 0.045 }}>
              Filter Properties
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-1" style={{ fontSize: SCREEN_WIDTH * 0.035 }}>
              Customize your search preferences
            </Text>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            <FilterOption icon="filter-outline" label="Number of Results">
              <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <TextInput
                  placeholder={`Current limit: ${filterValues.limit}`}
                  keyboardType="numeric"
                  value={filterValues.limit.toString()}
                  onChangeText={(text) => onChangeFilter.setLimit(text)}
                  className="text-gray-700 dark:text-gray-300 text-base"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </FilterOption>

            <FilterOption icon="cash-outline" label="Price Range">
              <View className="flex-row space-x-4">
                <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Min Price"
                    keyboardType="numeric"
                    value={filterValues.minPrice.toString()}
                    onChangeText={(text) => onChangeFilter.setMinPrice(text)}
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
                <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <TextInput
                    placeholder="Max Price"
                    keyboardType="numeric"
                    value={filterValues.maxPrice.toString()}
                    onChangeText={(text) => onChangeFilter.setMaxPrice(text)}
                    className="text-gray-700 dark:text-gray-300"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </View>
            </FilterOption>

            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <Text className="text-gray-800 dark:text-white font-semibold mb-4 flex-row items-center">
                <Ionicons name="location" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                Location Details
              </Text>

              <View className="mb-4">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">Region</Text>
                <View className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Picker selectedValue={filterValues.region} onValueChange={(value) => onChangeFilter.setRegion(value)} style={{ height: 50, width: "100%" }}>
                    <Picker.Item label="Select Region" value="" />
                    {filterValues.regions?.map((region) => (
                      <Picker.Item key={region._id} label={region.region_name} value={region._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">Sub Region</Text>
                <View className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${!filterValues.region ? "opacity-50" : ""}`}>
                  <Picker
                    selectedValue={filterValues.subregion}
                    onValueChange={(value) => onChangeFilter.setSubregion(value)}
                    style={{ height: 50, width: "100%" }}
                    enabled={!!filterValues.region}
                  >
                    <Picker.Item label="Select Sub Region" value="" />
                    {filterValues.filteredSubRegions?.map((subRegion) => (
                      <Picker.Item key={subRegion._id} label={subRegion.subregion_name} value={subRegion._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View>
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">Location</Text>
                <View className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 ${!filterValues.subregion ? "opacity-50" : ""}`}>
                  <Picker
                    selectedValue={filterValues.location}
                    onValueChange={(value) => onChangeFilter.setLocation(value)}
                    style={{ height: 50, width: "100%" }}
                    enabled={!!filterValues.subregion}
                  >
                    <Picker.Item label="Select Location" value="" />
                    {filterValues.filteredLocations?.map((location) => (
                      <Picker.Item key={location._id} label={location.location} value={location._id} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <Text className="text-gray-800 dark:text-white font-semibold mb-4 flex-row items-center">
                <Ionicons name="home" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                Property Details
              </Text>

              <View>
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">Property Type</Text>
                <View className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Picker selectedValue={filterValues.propertyType} onValueChange={(value) => onChangeFilter.setPropertyType(value)} style={{ height: 50, width: "100%" }}>
                    <Picker.Item label="Select Property Type" value="" />
                    {filterValues.propertyTypes?.map((type) => (
                      <Picker.Item key={type._id} label={type.name} value={type._id} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <FilterOption icon="repeat-outline" label="Property Use">
              <View className="flex-row flex-wrap gap-2">
                {propertyUseOptions?.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => onChangeFilter.setPropertyUse(option.value)}
                    className={`px-4 py-2 rounded-xl ${
                      filterValues.propertyUse === option.value
                        ? "bg-[#FF8E01] border-[#FF8E01]"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    } border`}
                  >
                    <Text className={`${filterValues.propertyUse === option.value ? "text-white" : "text-gray-700 dark:text-gray-300"} font-medium`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterOption>
          </ScrollView>

          <View className="p-6 border-t border-gray-200 dark:border-gray-800">
            <View className="flex-row space-x-4">
              <TouchableOpacity onPress={onClose} className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                <Text className="text-gray-700 dark:text-gray-300 text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSubmit} className="flex-1 bg-[#FF8E01] p-4 rounded-xl">
                <Text className="text-white text-center font-medium">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(FilterModal); 