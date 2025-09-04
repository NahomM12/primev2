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
import {
  getAllRentProperties,
  getAllSellProperties,
  getPropertiesByUse,
  buyProperty,
  getAllViews,
  changeView,
  getAllFeatured,
  getClosestProperties,
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
  const [closestLoaded, setClosestLoaded] = useState(false);
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

  useEffect(() => {
    const tryLoadClosest = async () => {
      if (!regions.length || !subregions.length || !locations.length || closestLoaded) return;
      try {
        const stored = await AsyncStorage.getItem("userLocationNames");
        console.log("Stored location names:", stored);
        if (!stored) {
          console.log("No stored location names found");
          return;
        }
        const { regionName, subregionName, locationName } = JSON.parse(stored);
        console.log("Parsed location names:", { regionName, subregionName, locationName });
        if (!regionName && !subregionName && !locationName) {
          console.log("No valid location names found");
          return;
        }

        // TEMPORARY: Override with first available region for testing
        if (regions.length > 0) {
          console.log("TEMPORARY: Using first region for testing:", regions[0].region_name);
          const testFilters = { region: regions[0]._id, limit: 10 };
          console.log("Test filters:", testFilters);
          await dispatch(getClosestProperties(testFilters));
          setClosestLoaded(true);
          return;
        }

        // Debug: show available regions
        console.log("Available regions:", regions.map(r => ({ id: r._id, name: r.region_name })));
        console.log("Available subregions:", subregions.map(sr => ({ id: sr._id, name: sr.subregion_name, region: sr.region_id })));
        console.log("Available locations:", locations.map(loc => ({ id: loc._id, name: loc.location, subregion: loc.subregion_id })));

        // Check if we have any data
        if (regions.length === 0) {
          console.log("No regions found in database");
          setClosestLoaded(true);
          return;
        }

        let regionMatch = regions.find((r) => r.region_name?.toLowerCase() === regionName?.toLowerCase());
        let subregionMatch = subregions.find((sr) => sr.subregion_name?.toLowerCase() === subregionName?.toLowerCase());
        let locationMatch = locations.find((loc) => loc.location?.toLowerCase() === locationName?.toLowerCase());

        console.log("Location matches:", { 
          regionMatch: regionMatch?._id, 
          subregionMatch: subregionMatch?._id, 
          locationMatch: locationMatch?._id 
        });

        // If no exact matches, try partial matches
        if (!regionMatch && regionName) {
          const partialRegionMatch = regions.find((r) => 
            r.region_name?.toLowerCase().includes(regionName?.toLowerCase()) ||
            regionName?.toLowerCase().includes(r.region_name?.toLowerCase())
          );
          if (partialRegionMatch) {
            console.log("Found partial region match:", partialRegionMatch.region_name);
            regionMatch = partialRegionMatch;
          }
        }

        if (!subregionMatch && subregionName) {
          const partialSubregionMatch = subregions.find((sr) => 
            sr.subregion_name?.toLowerCase().includes(subregionName?.toLowerCase()) ||
            subregionName?.toLowerCase().includes(sr.subregion_name?.toLowerCase())
          );
          if (partialSubregionMatch) {
            console.log("Found partial subregion match:", partialSubregionMatch.subregion_name);
            subregionMatch = partialSubregionMatch;
          }
        }

        if (!locationMatch && locationName) {
          const partialLocationMatch = locations.find((loc) => 
            loc.location?.toLowerCase().includes(locationName?.toLowerCase()) ||
            locationName?.toLowerCase().includes(loc.location?.toLowerCase())
          );
          if (partialLocationMatch) {
            console.log("Found partial location match:", partialLocationMatch.location);
            locationMatch = partialLocationMatch;
          }
        }

        // If still no matches, try to find any region that might be similar
        if (!regionMatch && regionName) {
          const similarRegion = regions.find((r) => 
            r.region_name?.toLowerCase().includes("state") ||
            r.region_name?.toLowerCase().includes("province") ||
            r.region_name?.toLowerCase().includes("region")
          );
          if (similarRegion) {
            console.log("Using similar region as fallback:", similarRegion.region_name);
            regionMatch = similarRegion;
          }
        }

        const filters = {
          ...(regionMatch ? { region: regionMatch._id } : {}),
          ...(subregionMatch ? { subregion: subregionMatch._id } : {}),
          ...(locationMatch ? { location: locationMatch._id } : {}),
          limit: 10,
        };
        console.log("Filters for closest properties:", filters);
        
        if (filters.region || filters.subregion || filters.location) {
          console.log("Dispatching getClosestProperties with filters:", filters);
          await dispatch(getClosestProperties(filters));
          setClosestLoaded(true);
        } else {
          console.log("No valid filters found, trying fallback with first region");
          // Fallback: try to show properties from the first available region
          if (regions.length > 0) {
            const fallbackFilters = { region: regions[0]._id, limit: 10 };
            console.log("Using fallback filters:", fallbackFilters);
            await dispatch(getClosestProperties(fallbackFilters));
            setClosestLoaded(true);
          } else {
            console.log("No regions available for fallback");
            setClosestLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error loading closest properties:", error);
      }
    };
    tryLoadClosest();
  }, [regions, subregions, locations, closestLoaded, dispatch]);

  const { propertiesByUse, views, isSuccess, featuredProperties } = useSelector(
    (state) => state.property
  );
  const { regions, subregions, locations } = useSelector((state) => state.address);
  const { propertyTypes } = useSelector((state) => state.propertyType);
  const { closestProperties } = useSelector((state) => state.property);

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
        ...(cleanedObj.propertyType ? { filterType: cleanedObj.propertyType } : {}),
        ...(cleanedObj.propertyUse ? { propertyUse: cleanedObj.propertyUse } : {}),
        ...(cleanedObj.title ? { title: cleanedObj.title } : {}),
      },
    });

    setFilterModalVisible(false);
  }, [limit, minPrice, maxPrice, location, propertyType, propertyUse, region, subregion, searchQuery]);

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
          <Text className="text-2xl font-bold dark:text-slate-300">Prime Property</Text>
          <View className="flex-row items-center">
            <View className="flex-row bg-white/90 dark:bg-gray-800/90 rounded-full mr-3 overflow-hidden">
              <TouchableOpacity onPress={() => handleLanguageChange("Eng")} className="px-3 py-1" style={{ backgroundColor: i18n.language === "Eng" ? "#FF8E01" : "transparent" }}>
                <Text className={`${i18n.language === "Eng" ? "text-white" : "text-gray-600 dark:text-gray-300"}`}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLanguageChange("Amh")} className="px-3 py-1" style={{ backgroundColor: i18n.language === "Amh" ? "#FF8E01" : "transparent" }}>
                <Text className={`${i18n.language === "Amh" ? "text-white" : "text-gray-600 dark:text-gray-300"}`}>አማ</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full" onPress={() => { router.push("/notification"); }}>
              <Ionicons name="notifications-outline" size={24} color="#6B7280" />
              <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-xs">2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} removeClippedSubviews={true} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 mt-4 mb-2">
          <SearchBarWithFilter value={searchQuery} onChangeText={setSearchQuery} onOpenFilter={() => setFilterModalVisible(true)} onSubmit={handleSearchSubmit} />
        </View>

        {/* Closest to you section - always visible */}
        <View className="mb-6">
          <SectionHeader 
            title={t("closest_to_you") || "Closest to you"} 
            onSeeAll={() => handleSeeAll("closest")} 
          />
          {closestProperties?.length > 0 ? (
            <FlatList
              data={closestProperties}
              keyExtractor={(item) => item._id}
              renderItem={useCallback(({ item }) => (
                <PropertyItem item={item} onPress={handlePress} onFavorite={handleFavourite} />
              ), [handlePress, handleFavourite])}
              horizontal
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              windowSize={5}
              initialNumToRender={3}
              contentContainerStyle={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: 8 }}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + 16}
            />
          ) : (
            <View className="flex items-center justify-center p-4">
              <Text className="text-gray-500 dark:text-gray-400" style={{ fontSize: SCREEN_WIDTH * 0.035 }}>
                {closestLoaded ? "No properties found in your area" : "Loading properties in your area..."}
              </Text>
              {closestLoaded && (
                <TouchableOpacity 
                  className="mt-2 bg-blue-500 px-4 py-2 rounded-full"
                  onPress={() => {
                    setClosestLoaded(false);
                    // Force reload
                    setTimeout(() => {
                      const tryLoadClosest = async () => {
                        try {
                          const stored = await AsyncStorage.getItem("userLocationNames");
                          console.log("Manual refresh - stored location names:", stored);
                          if (!stored) return;
                          
                          const { regionName, subregionName, locationName } = JSON.parse(stored);
                          console.log("Manual refresh - parsed location names:", { regionName, subregionName, locationName });
                          
                          // Try to find matches with more flexible logic
                          const regionMatch = regions.find((r) => 
                            r.region_name?.toLowerCase().includes(regionName?.toLowerCase()) ||
                            regionName?.toLowerCase().includes(r.region_name?.toLowerCase())
                          );
                          const subregionMatch = subregions.find((sr) => 
                            sr.subregion_name?.toLowerCase().includes(subregionName?.toLowerCase()) ||
                            subregionName?.toLowerCase().includes(sr.subregion_name?.toLowerCase())
                          );
                          const locationMatch = locations.find((loc) => 
                            loc.location?.toLowerCase().includes(locationName?.toLowerCase()) ||
                            locationName?.toLowerCase().includes(loc.location?.toLowerCase())
                          );

                          console.log("Manual refresh - location matches:", { 
                            regionMatch: regionMatch?._id, 
                            subregionMatch: subregionMatch?._id, 
                            locationMatch: locationMatch?._id 
                          });

                          const filters = {
                            ...(regionMatch ? { region: regionMatch._id } : {}),
                            ...(subregionMatch ? { subregion: subregionMatch._id } : {}),
                            ...(locationMatch ? { location: locationMatch._id } : {}),
                            limit: 10,
                          };
                          
                          if (filters.region || filters.subregion || filters.location) {
                            console.log("Manual refresh - dispatching getClosestProperties with filters:", filters);
                            dispatch(getClosestProperties(filters));
                            setClosestLoaded(true);
                          }
                        } catch (error) {
                          console.error("Manual refresh error:", error);
                        }
                      };
                      tryLoadClosest();
                    }, 100);
                  }}
                >
                  <Text className="text-white font-medium">Refresh Location</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View className="mb-6">
          <SectionHeader title={t("featured_listings")} onSeeAll={() => handleSeeAll("featured")} />
          <FlatList data={featuredProperties} keyExtractor={(item) => item._id} renderItem={useCallback(({ item }) => (<PropertyItem item={item} onPress={handlePress} onFavorite={handleFavourite} />), [handlePress, handleFavourite])} horizontal showsHorizontalScrollIndicator={false} removeClippedSubviews={true} maxToRenderPerBatch={5} windowSize={5} initialNumToRender={3} contentContainerStyle={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: 8 }} ItemSeparatorComponent={() => <View style={{ width: 16 }} />} snapToAlignment="start" decelerationRate="fast" snapToInterval={CARD_WIDTH + 16} ListEmptyComponent={() => (<View className="flex items-center justify-center p-4"><Text className="text-gray-500 dark:text-gray-400" style={{ fontSize: SCREEN_WIDTH * 0.035 }}>No featured properties available</Text></View>)} />
        </View>

        <View className="mb-6">
          <SectionHeader title={t("available_for_sell")} onSeeAll={() => handleSeeAll("sell")} />
          <FlatList data={propertiesByUse.sell} keyExtractor={(item) => item._id} renderItem={useCallback(({ item }) => (<PropertyItem item={item} onPress={handlePress} onFavorite={handleFavourite} />), [handlePress, handleFavourite])} horizontal showsHorizontalScrollIndicator={false} removeClippedSubviews={true} maxToRenderPerBatch={5} windowSize={5} initialNumToRender={3} contentContainerStyle={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: 8 }} ItemSeparatorComponent={() => <View style={{ width: 16 }} />} snapToAlignment="start" decelerationRate="fast" snapToInterval={CARD_WIDTH + 16} />
        </View>

        <View className="mb-6">
          <SectionHeader title={t("available_for_rent")} onSeeAll={() => handleSeeAll("rent")} />
          <FlatList data={propertiesByUse.rent} keyExtractor={(item) => item._id} renderItem={useCallback(({ item }) => (<PropertyItem item={item} onPress={handlePress} onFavorite={handleFavourite} />), [handlePress, handleFavourite])} horizontal showsHorizontalScrollIndicator={false} removeClippedSubviews={true} maxToRenderPerBatch={5} windowSize={5} initialNumToRender={3} contentContainerStyle={{ paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: 8 }} ItemSeparatorComponent={() => <View style={{ width: 16 }} />} snapToAlignment="start" decelerationRate="fast" snapToInterval={CARD_WIDTH + 16} />
        </View>
      </ScrollView>

      <FilterModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} filterValues={{ limit, minPrice, maxPrice, location, propertyType, propertyUse, region, subregion, regions, filteredSubRegions, filteredLocations, propertyTypes }} onChangeFilter={{ setLimit, setMinPrice, setMaxPrice, setLocation, setPropertyType, setPropertyUse, setRegion, setSubregion, setLocation }} onSubmit={handleFilterSubmit} />

      <PropertyModal visible={modalVisible} onClose={handleModalClose} property={selectedProperty} favouriteOn={favouriteOn} onFavourite={handleFavourite} onBuy={handleBuyProperty} onScheduleVisit={handleScheduleVisit} isPurchasing={isPurchasing} showPaymentOptions={showPaymentOptions} setShowPaymentOptions={setShowPaymentOptions} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
    </View>
  );
};

export default memo(Home);
