import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, changePassword } from "../store/auth/authSlice";
import Toast from "react-native-toast-message";

import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileManagement = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveChanges = useCallback(() => {
    const data = {
      name: formData.name,
      email: formData.email,
    };

    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully",
        });
        router.back();
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to update profile");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to update profile",
        });
      });
  }, [formData, dispatch, router]);

  const handlePasswordChange = useCallback(() => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "New passwords do not match.",
      });
      return;
    }
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      passwordData.newPassword.length < 6
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "Please fill all password fields. New password must be at least 6 characters.",
      });
      return;
    }
    setIsSubmitting(true);
    dispatch(changePassword(passwordData))
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Password updated successfully.",
        });
        setPasswordModalVisible(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to update password.",
        });
      })
      .finally(() => setIsSubmitting(false));
  }, [passwordData, dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Profile Management
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View className="items-center mb-6">
          <View className="bg-orange-100 dark:bg-orange-700 w-24 h-24 rounded-full items-center justify-center mb-2">
            <Text className="text-orange-600 dark:text-orange-400 text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
            <Text className="text-white">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 dark:text-gray-300 mb-1 text-base font-medium">
              Full Name
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-gray-600 dark:text-gray-300 mb-1 text-base font-medium">
              Email Address
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={() => setPasswordModalVisible(true)}
            className="mt-2 bg-white dark:bg-gray-800 p-4 rounded-xl flex-row justify-between items-center border border-gray-200 dark:border-gray-700"
          >
            <Text className="text-gray-800 dark:text-white font-medium">
              Change Password
            </Text>
            <Ionicons name="key-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          onPress={saveChanges}
          className="bg-blue-500 p-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => {
          setPasswordModalVisible(!isPasswordModalVisible);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800 dark:text-white">
                Change Password
              </Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TextInput
                placeholder="Current Password"
                secureTextEntry
                value={passwordData.currentPassword}
                onChangeText={(text) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: text,
                  }))
                }
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-gray-800 dark:text-gray-200"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="New Password"
                secureTextEntry
                value={passwordData.newPassword}
                onChangeText={(text) =>
                  setPasswordData((prev) => ({ ...prev, newPassword: text }))
                }
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-gray-800 dark:text-gray-200"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Confirm New Password"
                secureTextEntry
                value={passwordData.confirmPassword}
                onChangeText={(text) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: text,
                  }))
                }
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-gray-800 dark:text-gray-200"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              onPress={handlePasswordChange}
              disabled={isSubmitting}
              className={`mt-6 p-4 rounded-xl ${
                isSubmitting ? "bg-blue-300" : "bg-blue-500"
              }`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isSubmitting ? "Saving..." : "Save Password"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileManagement;
