import { View, Image, TouchableOpacity, ScrollView, Text } from "react-native";
import React, { memo } from "react";
import FormField from "./FormField";
import * as ImagePicker from "expo-image-picker";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const BooleanToggle = memo(({ title, value, onChange }) => {
  return (
    <View className="mb-8">
      <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </Text>
      <View className="flex-row space-x-3">
        <TouchableOpacity
          onPress={() => onChange(true)}
          className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center border-2 ${
            value === true
              ? "bg-orange-500 border-orange-500"
              : "bg-transparent border-gray-200 dark:border-gray-700"
          }`}
        >
          <Feather
            name="check"
            size={20}
            color={value === true ? "#FFFFFF" : "#6B7280"}
            style={{ marginRight: 8 }}
          />
          <Text
            className={`font-semibold text-base ${
              value === true ? "text-white" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(false)}
          className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center border-2 ${
            value === false
              ? "bg-gray-600 border-gray-600"
              : "bg-transparent border-gray-200 dark:border-gray-700"
          }`}
        >
          <Feather
            name="x"
            size={20}
            color={value === false ? "#FFFFFF" : "#6B7280"}
            style={{ marginRight: 8 }}
          />
          <Text
            className={`font-semibold text-base ${
              value === false
                ? "text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const PropertyForm = ({ formData, setFormData, propertyType }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((image) => ({
        uri: image.uri,
        type: "image/jpeg",
        fileName: image.uri.split("/").pop(),
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const renderField = (field) => {
    const value = formData.typeSpecificFields?.[field.name] || "";

    if (field.type === "Boolean") {
      return (
        <BooleanToggle
          key={field.name}
          title={
            field.name.charAt(0).toUpperCase() +
            field.name.slice(1).replace(/([A-Z])/g, " $1")
          }
          value={value}
          onChange={(newValue) => {
            setFormData({
              ...formData,
              typeSpecificFields: {
                ...formData.typeSpecificFields,
                [field.name]: newValue,
              },
            });
          }}
        />
      );
    }

    return (
      <FormField
        key={field.name}
        title={
          field.name.charAt(0).toUpperCase() +
          field.name.slice(1).replace(/([A-Z])/g, " $1")
        }
        value={value.toString()}
        placeholder={`Enter ${field.name}`}
        handleChangeText={(e) => {
          let parsedValue;
          switch (field.type) {
            case "Number":
              parsedValue = parseInt(e);
              break;
            case "Date":
              parsedValue = new Date(e);
              break;
            default:
              parsedValue = e;
          }
          setFormData({
            ...formData,
            typeSpecificFields: {
              ...formData.typeSpecificFields,
              [field.name]: parsedValue,
            },
          });
        }}
        keyboardType={field.type === "Number" ? "numeric" : "default"}
        otherStyles="mb-8"
      />
    );
  };

  return (
    <View className="space-y-6">
      <FormField
        title="Title"
        value={formData.title}
        handleChangeText={(e) => setFormData({ ...formData, title: e })}
        otherStyles="mb-2"
      />
      <FormField
        title="Price"
        value={formData.price?.toString()}
        handleChangeText={(e) =>
          setFormData({ ...formData, price: parseFloat(e) })
        }
        otherStyles="mb-2"
        keyboardType="numeric"
      />
      <FormField
        title="Description"
        value={formData.description}
        handleChangeText={(e) => setFormData({ ...formData, description: e })}
        otherStyles="mb-2"
        multiline
        numberOfLines={5}
        containerStyle={{ height: 140, alignItems: 'flex-start', paddingTop: 16, paddingBottom: 16, borderBottomWidth: 2, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderRadius: 12 }}
      />
      
      {propertyType?.fields?.length > 0 && (
        <View className="mt-4">
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Property Details</Text>
            {propertyType?.fields?.map(renderField)}
        </View>
      )}

      {/* Image Upload Section */}
      <View className="mt-4">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Property Images</Text>
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex-col items-center justify-center space-y-3"
        >
          <View className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
            <Feather name="upload-cloud" size={32} color="#FF8E01" />
          </View>
          <Text className="text-orange-500 font-bold text-lg">
            Upload Images
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Tap to add up to 10 images
          </Text>
        </TouchableOpacity>

        {/* Image Preview */}
        {formData.images && formData.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-6"
          >
            {formData.images.map((image, index) => (
              <View key={index} className="mr-4 relative shadow-md">
                <Image
                  source={{ uri: typeof image === 'string' ? image : image.uri }}
                  className="w-36 h-36 rounded-2xl"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 rounded-full p-2 shadow-lg border-2 border-white dark:border-gray-800"
                >
                  <Feather name="x" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default PropertyForm;
