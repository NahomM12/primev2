import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
} from "react-native";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../store/notification/notificationSlice";
import {
  getAllRentProperties,
  getAllSellProperties,
  getPropertiesByUse,
  buyProperty,
  getAllViews,
  changeView,
  getAllFeatured,
} from "../../store/property/propertySlice";
import {
  addToWishlist,
  changeLanguage,
  changeLanguageMode,
} from "../../store/auth/authSlice";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  getAllRegions,
  getAllSubRegions,
  getAllLocations,
} from "../../store/address/addressSlice";
import { Picker } from "@react-native-picker/picker";
import { getAllPropertyTypes } from "../../store/propertyType/propertyTypeSlice";
import SearchBarWithFilter from "../../components/home/SearchBarWithFilter";
import SectionHeader from "../../components/home/SectionHeader";
import PropertyItem from "../../components/home/PropertyItem";
import PropertyModal from "../../components/home/PropertyModal";
import FilterModal from "../../components/home/FilterModal";
import { useFocusEffect } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_ASPECT_RATIO = 0.8;
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = CARD_WIDTH * CARD_ASPECT_RATIO;
const CATEGORY_ICON_SIZE = SCREEN_WIDTH * 0.09;

// Update the existing cardHeight constant to use the new responsive values
const cardHeight = CARD_HEIGHT;

const Home = () => {
  const dispatch = useDispatch();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favouriteOn, setFavouriteOn] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const router = useRouter();

  // New: search and filter modal states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [limit, setLimit] = useState(5);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [subregion, setSubregion] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUse, setPropertyUse] = useState("");
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  const loadColorScheme = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      if (userData && userData.preference) {
        const storedMode = userData.preference.mode;
        setColorScheme(storedMode);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getNotifications());
    }, [dispatch])
  );

  useEffect(() => {
    loadColorScheme();
    dispatch(getPropertiesByUse("sell"));
    dispatch(getPropertiesByUse("rent"));
    dispatch(getAllViews());
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
    dispatch(getAllFeatured());
    // New: property types for filter
    dispatch(getAllPropertyTypes());
  }, []);

  const { propertiesByUse, views, isSuccess, featuredProperties } = useSelector(
    (state) => state.property
  );
  const { regions, subregions, locations } = useSelector(
    (state) => state.address
  );
  const { propertyTypes } = useSelector((state) => state.propertyType);
  const { unreadCount } = useSelector((state) => state.notification);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (region) {
      const regionSubRegions = subregions.filter(
        (sr) => sr.region_id?._id === region
      );
      setFilteredSubRegions(regionSubRegions);
      setFilteredLocations([]);
      setSubregion("");
      setLocation("");
    }
  }, [region, subregions]);

  useEffect(() => {
    if (subregion) {
      const subRegionLocations = locations.filter(
        (loc) => loc?.subregion_id?._id === subregion
      );
      setFilteredLocations(subRegionLocations);
      setLocation("");
    }
  }, [subregion, locations]);

  const handleFavourite = useCallback(
    async (prop) => {
      try {
        setFavouriteOn(!favouriteOn);
        const data = {
          prodId: prop._id,
        };
        await dispatch(addToWishlist(data)).unwrap();
      } catch (error) {
        console.error("Error updating favorite:", error);
        setFavouriteOn(favouriteOn);
      }
    },
    [favouriteOn, dispatch]
  );

  const handlePress = useCallback(
    async (prop) => {
      try {
        const data = {
          propertyId: prop._id,
        };
        setSelectedProperty(prop);
        setFavouriteOn(prop.isFavorite);
        setModalVisible(true);
        setShowPaymentOptions(false);

        await dispatch(changeView(data)).unwrap();
      } catch (error) {
        console.log("Error updating view:", error);
      }
    },
    [dispatch]
  );

  const handleLanguageChange = (lng) => {
    const data = {
      preference: {
        language: lng,
      },
    };
    i18n.changeLanguage(lng);
    dispatch(changeLanguageMode(data));
  };

  const handleBuyProperty = async () => {
    if (!selectedProperty?._id) return;

    setIsPurchasing(true);
    try {
      const result = await dispatch(
        buyProperty({
          propertyId: selectedProperty._id,
          paymentMethod: paymentMethod,
        })
      ).unwrap();

      Alert.alert(
        "Success",
        "Property purchase initiated successfully! Check your transactions for details.",
        [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setShowPaymentOptions(false);
              setPaymentMethod("cash");
              dispatch(getPropertiesByUse(selectedProperty.property_use));
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error || "Failed to initiate property purchase. Please try again later."
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleScheduleVisit = () => {
    setIsSchedulingVisit(true);
    Alert.alert(
      "Schedule Visit",
      "Our agent will contact you shortly to arrange a visit.",
      [
        {
          text: "OK",
          onPress: () => setIsSchedulingVisit(false),
        },
      ]
    );
  };

  const handleFilterSubmit = useCallback(() => {
    const obj = {
      limit: parseInt(limit),
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location,
      propertyType,
      propertyUse,
      region,
      subregion,
      title: searchQuery || undefined,
    };

    const cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    router.push({
      pathname: "/(tabs)/explore",
      params: {
        ...(cleanedObj.propertyType
          ? { filterType: cleanedObj.propertyType }
          : {}),
        ...(cleanedObj.propertyUse
          ? { propertyUse: cleanedObj.propertyUse }
          : {}),
        ...(cleanedObj.title ? { title: cleanedObj.title } : {}),
      },
    });

    setFilterModalVisible(false);
  }, [
    limit,
    minPrice,
    maxPrice,
    location,
    propertyType,
    propertyUse,
    region,
    subregion,
    searchQuery,
  ]);

  const handleSearchSubmit = useCallback(
    (text) => {
      const q = typeof text === "string" ? text : searchQuery;
      router.push({ pathname: "/(tabs)/explore", params: { title: q } });
    },
    [searchQuery]
  );

  useEffect(() => {
    if (!modalVisible) {
      setSelectedProperty(null);
      setShowPaymentOptions(false);
      setPaymentMethod("cash");
    }
  }, [modalVisible]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedProperty(null);
    setShowPaymentOptions(false);
    setPaymentMethod("cash");
  }, []);

  const handleSeeAll = (propertyUse) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { propertyUse },
    });
  };

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] flex-1">
      <View className="px-5 pt-5">
        {/* Header */}
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold dark:text-slate-300">
            Prime Property
          </Text>
          <View className="flex-row items-center">
            <View className="flex-row bg-white/90 dark:bg-gray-800/90 rounded-full mr-3 overflow-hidden">
              <TouchableOpacity
                onPress={() => handleLanguageChange("Eng")}
                className="px-3 py-1"
                style={{
                  backgroundColor:
                    i18n.language === "Eng" ? "#FF8E01" : "transparent",
                }}
              >
                <Text
                  className={`${
                    i18n.language === "Eng"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLanguageChange("Amh")}
                className="px-3 py-1"
                style={{
                  backgroundColor:
                    i18n.language === "Amh" ? "#FF8E01" : "transparent",
                }}
              >
                <Text
                  className={`${
                    i18n.language === "Amh"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  አማ
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full"
              onPress={() => {
                router.push("/notification");
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6B7280"
              />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                  <Text className="text-white text-xs">{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-5 mt-4 mb-2">
          <SearchBarWithFilter
            value={searchQuery}
            onChangeText={setSearchQuery}
            onOpenFilter={() => setFilterModalVisible(true)}
            onSubmit={handleSearchSubmit}
          />
        </View>

        <View className="mb-6">
          <SectionHeader
            title={t("featured_listings")}
            onSeeAll={() => handleSeeAll("featured")}
          />
          <FlatList
            data={featuredProperties}
            keyExtractor={(item) => item._id}
            renderItem={useCallback(
              ({ item }) => (
                <PropertyItem
                  item={item}
                  onPress={handlePress}
                  onFavorite={handleFavourite}
                />
              ),
              [handlePress, handleFavourite]
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={3}
            contentContainerStyle={{
              paddingHorizontal: SCREEN_WIDTH * 0.04,
              paddingVertical: 8,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
            ListEmptyComponent={() => (
              <View className="flex items-center justify-center p-4">
                <Text
                  className="text-gray-500 dark:text-gray-400"
                  style={{ fontSize: SCREEN_WIDTH * 0.035 }}
                >
                  No featured properties available
                </Text>
              </View>
            )}
          />
        </View>

        <View className="mb-6">
          <SectionHeader
            title={t("available_for_sell")}
            onSeeAll={() => handleSeeAll("sell")}
          />
          <FlatList
            data={propertiesByUse.sell}
            keyExtractor={(item) => item._id}
            renderItem={useCallback(
              ({ item }) => (
                <PropertyItem
                  item={item}
                  onPress={handlePress}
                  onFavorite={handleFavourite}
                />
              ),
              [handlePress, handleFavourite]
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={3}
            contentContainerStyle={{
              paddingHorizontal: SCREEN_WIDTH * 0.04,
              paddingVertical: 8,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
          />
        </View>

        <View className="mb-6">
          <SectionHeader
            title={t("available_for_rent")}
            onSeeAll={() => handleSeeAll("rent")}
          />
          <FlatList
            data={propertiesByUse.rent}
            keyExtractor={(item) => item._id}
            renderItem={useCallback(
              ({ item }) => (
                <PropertyItem
                  item={item}
                  onPress={handlePress}
                  onFavorite={handleFavourite}
                />
              ),
              [handlePress, handleFavourite]
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={3}
            contentContainerStyle={{
              paddingHorizontal: SCREEN_WIDTH * 0.04,
              paddingVertical: 8,
            }}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
          />
        </View>
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterValues={{
          limit,
          minPrice,
          maxPrice,
          location,
          propertyType,
          propertyUse,
          region,
          subregion,
          regions,
          filteredSubRegions,
          filteredLocations,
          propertyTypes,
        }}
        onChangeFilter={{
          setLimit,
          setMinPrice,
          setMaxPrice,
          setLocation,
          setPropertyType,
          setPropertyUse,
          setRegion,
          setSubregion,
          setLocation,
        }}
        onSubmit={handleFilterSubmit}
      />

      <PropertyModal
        visible={modalVisible}
        onClose={handleModalClose}
        property={selectedProperty}
        favouriteOn={favouriteOn}
        onFavourite={handleFavourite}
        onBuy={handleBuyProperty}
        onScheduleVisit={handleScheduleVisit}
        isPurchasing={isPurchasing}
        showPaymentOptions={showPaymentOptions}
        setShowPaymentOptions={setShowPaymentOptions}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </View>
  );
};

export default memo(Home);
