const Location = require("../models/locationModel");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Region = require("../models/regionModel");
const SubRegion = require("../models/SubRegionModel");

const addLocation = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { region_id, subregion_id, location } = req.body;

  if (!region_id || !subregion_id || !location) {
    res.status(400);
    throw new Error("Region, SubRegion, and Location name are required");
  }

  try {
    // 1. Construct a full address for better geocoding accuracy
    const subRegionDoc = await SubRegion.findById(subregion_id);
    const regionDoc = await Region.findById(region_id);

    if (!subRegionDoc || !regionDoc) {
      res.status(404);
      throw new Error("Region or SubRegion not found");
    }

    const fullAddress = `${location}, ${subRegionDoc.subregion_name}, ${regionDoc.region_name}, Ethiopia`;

    // 2. Call Nominatim API
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      fullAddress
    )}&format=json&limit=1`;

    const geoResponse = await axios.get(nominatimUrl, {
      headers: {
        // IMPORTANT: Set a custom User-Agent as required by Nominatim's policy
        "User-Agent": "Prime-Property-App/1.0 (tewereus16@gmail.com)",
      },
    });

    const newLocationData = {
      region_id,
      subregion_id,
      location,
    };

    // 3. Add coordinates if found
    if (geoResponse.data && geoResponse.data.length > 0) {
      const { lat, lon } = geoResponse.data[0];
      // MongoDB's GeoJSON format is [longitude, latitude]
      newLocationData.coords = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    } else {
      console.warn(`Could not geocode address: ${fullAddress}`);
    }

    // 4. Create and save the new location
    const createdLocation = await Location.create(newLocationData);
    res.status(201).json(createdLocation);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllLocations = asyncHandler(async (req, res) => {
  try {
    const location = await Location.find()
      .populate("region_id", "region_name")
      .populate("subregion_id", "subregion_name");
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

const editLocation = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const location = await Location.findByIdAndUpdate(addrId, req.body, {
      new: true,
    });
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteLocation = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  const { addrId } = req.params;
  try {
    const location = await Location.findByIdAndDelete(addrId);
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllLocations = asyncHandler(async (req, res) => {
  // const { id } = req.admin;
  try {
    const location = await Location.deleteMany();
    res.json(location);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addLocation,
  getAllLocations,
  editLocation,
  deleteLocation,
  deleteAllLocations,
};
