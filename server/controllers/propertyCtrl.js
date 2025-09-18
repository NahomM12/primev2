const asyncHandler = require("express-async-handler");
const {
  Property,
  createPropertyDiscriminator,
} = require("../models/propertyModel");
const { PropertyType } = require("../models/propertyTypeModel");
const Transaction = require("../models/transactionModel");
const formidable = require("formidable").formidable;
const SearchHistory = require("../models/searchHistoryModel");
const obsService = require("../services/obsService");
const path = require("path");
const User = require("../models/userModel");
const Location = require("../models/locationModel");
const {
  createNotification,
  sendInAppNotification,
} = require("./notificationController");

const createProperty = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit per file
  });

  try {
    const [fields, files] = await form.parse(req);
    const { id } = req.user;

    // Get property type and create discriminator
    const propertyType = await PropertyType.findById(fields.propertyType[0]);
    if (!propertyType) {
      return res.status(404).json({
        message: "Property type not found",
      });
    }

    // Get location and coordinates
    const location = await Location.findById(fields.location[0]);
    if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    // Upload images to OBS
    const imageUrls = [];
    if (files.images) {
      // Handle both single and multiple files
      const imageFiles = Array.isArray(files.images)
        ? files.images
        : [files.images];

      for (const image of imageFiles) {
        try {
          const fileName = path.basename(
            image.originalFilename || image.name || "image.jpg"
          );
          const result = await obsService.uploadImage(
            image.filepath,
            fileName,
            {
              folder: "images",
              metadata: {
                "x-obs-meta-upload-source": "image-upload",
                "x-obs-meta-uploader": req.user._id.toString(),
              },
            }
          );
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue with other images if one fails
        }
      }
    }

    // Parse typeSpecificFields if it exists
    let typeSpecificFields = {};
    if (fields.typeSpecificFields && fields.typeSpecificFields[0]) {
      try {
        typeSpecificFields = JSON.parse(fields.typeSpecificFields[0]);
      } catch (error) {
        console.error("Error parsing typeSpecificFields:", error);
      }
    }
    console.log(fields);
    // Create property instance with base fields
    const propertyData = {
      title: fields.title[0],
      description: fields.description[0],
      price: parseFloat(fields.price[0]),
      address: {
        region: fields.region[0],
        subregion: fields.subregion[0],
        location: fields.location[0],
      },
      coords: location.coords,
      propertyType: fields.propertyType[0],
      property_use: fields.property_use[0],
      images: imageUrls,
      owner: id,
      status: "pending",
      typeSpecificFields,
    };

    const property = new Property(propertyData);
    await property.save();

    // Populate references before sending response
    const populatedProperty = await Property.findById(property._id)
      .populate("propertyType")
      .populate("owner", "firstname lastname");

    res.status(201).json(populatedProperty);
  } catch (error) {
    console.error("Property creation error:", error);
    res.status(500).json({
      message: error.message || "Error creating property",
    });
  }
});

const getAllProperties = asyncHandler(async (req, res) => {
  try {
    console.log("--- getAllProperties: Received query ---", req.query);
    const queryObj = { ...req.query };
    const excludeFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "role",
      "search",
      "searchField",
      "property_type",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Title search via regex (case-insensitive)
    if (req.query.search && typeof req.query.search === "string") {
      queryObj.title = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.title && typeof req.query.title === "string") {
      queryObj.title = { $regex: req.query.title, $options: "i" };
    }

    if (req.query.region) {
      queryObj["address.region"] = req.query.region;
    }

    if (req.query.subregion) {
      queryObj["address.subregion"] = req.query.subregion;
    }

    if (req.query.location) {
      queryObj["address.location"] = req.query.location;
    }

    if (req.query.propertyType) {
      const propertyType = await PropertyType.findOne({
        name: req.query.propertyType,
      });

      if (propertyType) {
        queryObj.propertyType = propertyType._id;
      }
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Property.find(JSON.parse(queryStr));

    query = query
      .populate("propertyType")
      .populate("owner")
      .populate("address.subregion")
      .populate("address.location");

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const usersCount = await Property.countDocuments();
      if (skip >= usersCount) throw new Error("This Page does not exist");
    }
    const totalUsers = await Property.countDocuments();
    const properties = await query;
    res.json({ properties, totalUsers });
  } catch (error) {
    throw new Error(error);
  }
});

const getProperty = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  // try {
  //   const property = await Property.findById(id)
  //     .populate("propertyType")
  //     .populate("owner", "firstname lastname");
  //   if (!property) {
  //     return res.status(404).json({
  //       message: "Property not found",
  //     });
  //   }
  //   res.json(property);
  // } catch (error) {
  //   throw new Error(error);
  // }
});

const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit per file
  });

  try {
    // Parse the form data using formidable
    const [fields, files] = await form.parse(req);
    console.log("Received fields:", fields);
    console.log("Received files:", files);

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const existingImages = fields.existingImages
      ? Array.isArray(fields.existingImages)
        ? fields.existingImages
        : [fields.existingImages]
      : [];

    // Handle image deletion from OBS
    if (property.images && property.images.length > 0) {
      const imagesToDelete = property.images.filter(
        (imageUrl) => !existingImages.includes(imageUrl)
      );

      for (const imageUrl of imagesToDelete) {
        try {
          await obsService.deleteImageByUrl(imageUrl);
        } catch (error) {
          console.error(`Failed to delete image ${imageUrl}:`, error);
        }
      }
    }

    // Parse the form data
    const updateData = {
      title: fields.title?.[0],
      description: fields.description?.[0],
      price: fields.price?.[0],
      propertyType: fields.propertyType?.[0],
      property_use: fields.property_use?.[0],
    };

    // Handle address
    if (fields.address?.[0]) {
      updateData.address = JSON.parse(fields.address[0]);
    }

    // Handle typeSpecificFields
    if (fields.typeSpecificFields?.[0]) {
      const typeFields = JSON.parse(fields.typeSpecificFields[0]);
      property.typeSpecificFields = new Map(Object.entries(typeFields));
    }

    // Handle images
    const newImages = [];
    if (files.images) {
      // Handle new uploaded images
      const imageFiles = Array.isArray(files.images)
        ? files.images
        : [files.images];
      for (const image of imageFiles) {
        try {
          const fileName = path.basename(
            image.originalFilename || image.name || "image.jpg"
          );
          const result = await obsService.uploadImage(
            image.filepath,
            fileName,
            {
              folder: "images",
              metadata: {
                "x-obs-meta-upload-source": "image-upload",
                "x-obs-meta-uploader": req.user._id.toString(),
              },
            }
          );
          newImages.push(result.secure_url);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue with other images if one fails
        }
      }
    }

    // Combine with existing images
    updateData.images = [...existingImages, ...newImages];

    // Update the property
    Object.assign(property, updateData);
    await property.save();

    // Populate necessary fields before sending response
    const updatedProperty = await Property.findById(id)
      .populate("propertyType")
      .populate("address.region")
      .populate("address.subregion")
      .populate("address.location");

    res.json(updatedProperty);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
});

const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Delete images from OBS
    if (property.images && property.images.length > 0) {
      for (const imageUrl of property.images) {
        try {
          await obsService.deleteImageByUrl(imageUrl);
        } catch (error) {
          console.error(`Failed to delete image ${imageUrl} from OBS:`, error);
        }
      }
    }

    await Property.findByIdAndDelete(id);

    res.json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserProperties = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    // const properties = await Property.find({ owner: id });
    const properties = await Property.find({ owner: id })
      .populate("propertyType")
      .populate({
        path: "address.region",
        select: "region region_name",
      })
      .populate({
        path: "address.subregion",
        select: "subregion subregion_name",
      })
      .populate({
        path: "address.location",
        select: "location",
      });

    const totalProperties = properties.length;

    // Calculate total views across all user properties
    const totalViews = properties.reduce((sum, property) => {
      return sum + (property.views?.count || 0);
    }, 0);

    // Calculate active properties (those with status "available")
    const activeProperties = properties.filter(
      (prop) => prop.status === "available"
    ).length;

    // Get all users to check their wishlists
    const users = await User.find({}, "wishlist");

    // Calculate total favorites across all properties
    const totalFavorites = users.reduce((sum, user) => {
      return (
        sum +
        user.wishlist.filter((wishlistId) =>
          properties.some(
            (prop) => prop._id.toString() === wishlistId.toString()
          )
        ).length
      );
    }, 0);

    res.json({
      properties,
      totalProperties,
      totalViews,
      activeProperties,
      totalFavorites,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getPropertiesByType = asyncHandler(async (req, res) => {
  const { typeId } = req.params;
  try {
    const properties = await Property.find({ propertyType: typeId })
      .populate("propertyType")
      .populate("owner", "firstname lastname");
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const getPropertiesByUse = asyncHandler(async (req, res) => {
  const { use } = req.params; // 'sell' or 'rent'
  try {
    const properties = await Property.find({
      property_use: use,
      status: "available",
    })
      .populate("propertyType")
      .populate("owner")
      .populate("address.region address.subregion address.location");
    res.json(properties);
  } catch (error) {
    throw new Error(error);
  }
});

const buyProperty = asyncHandler(async (req, res) => {
  const { propertyId, paymentMethod } = req.body;
  const { id } = req.user;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.status !== "available") {
      return res.status(400).json({
        message: "Property is not available for purchase",
      });
    }

    if (property.owner.toString() === id) {
      return res.status(400).json({
        message: "You cannot buy your own property",
      });
    }
    console.log("first");
    // Create transaction
    const transaction = await Transaction.create({
      property: propertyId,
      buyer: id,
      seller: property.owner,
      amount: property.price,
      paymentMethod,
      transactionType: property.property_use === "rent" ? "rent" : "purchase",
      transactionDetails: {
        paymentDate: new Date(),
        receiptNumber: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });
    console.log("second");

    // Update property status
    property.status = property.property_use === "rent" ? "rented" : "sold";
    await property.save();
    console.log("third");

    // Populate the transaction with property and user details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("property")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    console.log("fourth");

    res.json({
      message: `Property ${
        property.property_use === "rent" ? "rental" : "purchase"
      } initiated successfully`,
      property,
      transaction: populatedTransaction,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const changeViewCount = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.user;
  const { propertyId } = req.body;
  console.log(propertyId);
  try {
    // const id = "676433bc7ee7a80845d39dc9";
    const user = await User.findById(id);
    console.log(user);
    if (!user) throw new Error("user not found");
    const property = await Property.findById(propertyId);
    console.log(property);
    const alreadyExists = property.views.user.includes(id);
    if (alreadyExists) {
      res.json("user already exists in property");
      return;
    }

    const count = await Property.findByIdAndUpdate(
      propertyId,
      {
        $push: { "views.user": id },
        $inc: { "views.count": 1 },
      },
      {
        new: true,
      }
    );
    res.json(count);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllViews = asyncHandler(async (req, res) => {
  // const { id } = req.user;
  // const { propertyId } = req.body;
  try {
    const property = await Property.find().select("views.count -_id");

    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const changeFeatured = asyncHandler(async (req, res) => {
  const { propId } = req.params;
  console.log(req.params);
  try {
    const prop = await Property.findById(propId);
    console.log("prop", prop);
    const property = await Property.findByIdAndUpdate(
      propId,
      {
        isFeatured: true,
      },
      { new: true }
    );

    // Create featured notification
    await sendInAppNotification({
      title: "Property Featured!",
      body: `Your property '${property.title}' has been featured!`,
      recipient: property.owner.toString(),
      messageType: "featured",
      relatedProperty: property._id.toString(),
    });

    res.json(property);
  } catch (error) {
    throw new Error(error);
  }
});

const changePropertyStatus = asyncHandler(async (req, res) => {
  const { propId } = req.params;
  const { status, message } = req.body;
  console.log(req.params);
  try {
    const prop = await Property.findById(propId);
    console.log("property", prop);
    if (status === "available") {
      const property = await Property.findByIdAndUpdate(
        propId,
        {
          status,
          is_rejected: "",
        },
        { new: true }
      );

      // Create approval notification
      await sendInAppNotification({
        title: "Property Approved!",
        body: `Your property '${property.title}' has been approved and is now available.`,
        recipient: property.owner.toString(),
        messageType: "approval",
        relatedProperty: property._id.toString(),
      });

      res.json(property);
    } else if (status === "rejected") {
      const property = await Property.findByIdAndUpdate(
        propId,
        {
          status,
          is_rejected: message,
        },
        { new: true }
      );

      // Create rejection notification
      await sendInAppNotification({
        title: "Property Rejected",
        body: `Your property '${property.title}' was rejected. Reason: ${message}`,
        recipient: property.owner.toString(),
        messageType: "rejection",
        relatedProperty: property._id.toString(),
      });

      res.json(property);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllFeatured = asyncHandler(async (req, res) => {
  try {
    const featuredProperties = await Property.find({ isFeatured: true })
      .populate("propertyType")
      .populate("owner", "firstname lastname")
      .populate("address.region address.subregion address.location");

    res.json(featuredProperties);
  } catch (error) {
    throw new Error(error);
  }
});

const getNearbyProperties = asyncHandler(async (req, res) => {
  const { longitude, latitude } = req.query;
  console.log(
    "--- getNearbyProperties: Received coordinates ---",
    `Longitude: ${longitude}, Latitude: ${latitude}`
  );

  if (!longitude || !latitude) {
    console.log("-> Missing longitude or latitude query parameters.");
    return res
      .status(400)
      .json({ message: "Longitude and latitude are required." });
  }

  const parsedLongitude = parseFloat(longitude);
  const parsedLatitude = parseFloat(latitude);

  if (isNaN(parsedLongitude) || isNaN(parsedLatitude)) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  try {
    const properties = await Property.find({
      coords: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parsedLongitude, parsedLatitude],
          },
          $maxDistance: 5000, // 5 kilometers
        },
      },
      status: "available",
    })
      .populate("propertyType")
      .populate("owner", "firstname lastname")
      .populate("address.region address.subregion address.location");

    console.log(`Found ${properties.length} nearby properties.`);
    res.json(properties);
  } catch (error) {
    console.error("--- getNearbyProperties: Error ---", error);
    res.status(500).json({ message: "Error fetching nearby properties." });
  }
});

const saveSearchHistory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const { query } = req.body;
    const MAX_SEARCH_HISTORY = 10;

    console.log(
      `--- saveSearchHistory: Saving search for user ${id} ---`,
      query
    );

    if (!query || Object.keys(query).length === 0) {
      // Don't save empty searches
      return res.status(200).json({ message: "Empty query, not saved." });
    }

    // Create and save the new search entry
    const newSearch = new SearchHistory({
      user: id,
      query: query,
    });
    await newSearch.save();

    // Check if the user has more than 10 search histories
    const count = await SearchHistory.countDocuments({ user: id });

    if (count > MAX_SEARCH_HISTORY) {
      // If so, find the oldest ones and delete them
      const oldestSearches = await SearchHistory.find({ user: id })
        .sort({ createdAt: 1 })
        .limit(count - MAX_SEARCH_HISTORY);

      const idsToDelete = oldestSearches.map((doc) => doc._id);
      await SearchHistory.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(201).json({ message: "Search history saved." });
  } catch (error) {
    throw new Error(error);
  }
});

const getRecommendedProperties = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    console.log(`\n--- getRecommendedProperties: Starting for user ${id} ---`);

    if (!user) {
      console.log("-> User not found. Aborting.");
      return res.json([]); // No user, no recommendations
    }

    // 1. Get user activity: viewed properties, wishlisted properties, and recent searches
    const viewedProperties = await Property.find({ "views.user": id });
    const wishlistedProperties = await Property.find({
      _id: { $in: user.wishlist },
    });

    const userActivityProperties = [
      ...viewedProperties,
      ...wishlistedProperties,
    ];
    const recentSearches = await SearchHistory.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10);

    console.log("1. User Activity Profile:");
    console.log(`   - Viewed Properties: ${viewedProperties.length}`);
    console.log(`   - Wishlisted Properties: ${wishlistedProperties.length}`);
    console.log(`   - Recent Searches: ${recentSearches.length}`);

    const userInteractedPropertyIds = new Set(
      userActivityProperties.map((p) => p._id.toString())
    );

    // Fallback to featured properties if the user has no activity at all
    if (userActivityProperties.length === 0 && recentSearches.length === 0) {
      console.log(
        "-> No user activity found. Falling back to featured properties."
      );
      const featured = await Property.find({
        isFeatured: true,
        status: "available",
      })
        .limit(10)
        .populate("propertyType owner");
      return res.json(featured);
    }

    console.log("2. Extracting User Preferences...");

    // 2. Extract user preferences from all activities
    const propertyTypes = new Set(
      userActivityProperties
        .map((p) => p.propertyType?.toString())
        .filter(Boolean)
    );
    const subregions = new Set(
      userActivityProperties
        .map((p) => p.address?.subregion?.toString())
        .filter(Boolean)
    );
    const regions = new Set(
      userActivityProperties
        .map((p) => p.address?.region?.toString())
        .filter(Boolean)
    );
    let minPrice = Infinity,
      maxPrice = 0;

    userActivityProperties.forEach((prop) => {
      if (prop.price) {
        minPrice = Math.min(minPrice, prop.price);
        maxPrice = Math.max(maxPrice, prop.price);
      }
    });

    console.log("   - Preferences from Views/Wishlist:");
    console.log("     - Property Types:", Array.from(propertyTypes));
    console.log("     - Regions:", Array.from(regions));
    console.log("     - Subregions:", Array.from(subregions));
    console.log(
      `     - Price Range: ${minPrice === Infinity ? "N/A" : minPrice} - ${
        maxPrice === 0 ? "N/A" : maxPrice
      }`
    );
    // Add preferences from search history
    for (const search of recentSearches) {
      const { query } = search;
      if (query.propertyType) propertyTypes.add(query.propertyType.toString());
      if (query.subregion) subregions.add(query.subregion.toString());
      if (query.region) regions.add(query.region.toString());
      if (query.minPrice) minPrice = Math.min(minPrice, Number(query.minPrice));
      if (query.maxPrice) maxPrice = Math.max(maxPrice, Number(query.maxPrice));
    }

    console.log("   - Preferences after including Searches:");
    console.log("     - Property Types:", Array.from(propertyTypes));
    console.log("     - Regions:", Array.from(regions));
    console.log("     - Subregions:", Array.from(subregions));
    console.log(
      `     - Price Range: ${minPrice === Infinity ? "N/A" : minPrice} - ${
        maxPrice === 0 ? "N/A" : maxPrice
      }`
    );

    const hasPriceRange = minPrice !== Infinity && maxPrice !== 0;

    console.log("3. Building Recommendation Query...");

    // 3. Build a query for recommended properties based on extracted preferences
    const orConditions = [];
    if (propertyTypes.size > 0)
      orConditions.push({ propertyType: { $in: Array.from(propertyTypes) } });
    if (subregions.size > 0)
      orConditions.push({
        "address.subregion": { $in: Array.from(subregions) },
      });
    if (regions.size > 0)
      orConditions.push({ "address.region": { $in: Array.from(regions) } });
    if (hasPriceRange) {
      // Give a 20% buffer on the price range
      orConditions.push({
        price: { $gte: minPrice * 0.8, $lte: maxPrice * 1.2 },
      });
    }

    // If there are no conditions, we can't make a recommendation. Fallback to featured.
    if (orConditions.length === 0) {
      console.log(
        "-> No valid preferences to build a query. Falling back to featured properties."
      );
      const featured = await Property.find({
        isFeatured: true,
        status: "available",
      })
        .limit(10)
        .populate("propertyType owner");
      return res.json(featured);
    }

    const query = {
      _id: { $nin: Array.from(userInteractedPropertyIds) }, // Exclude already seen/liked properties
      status: "available",
      $or: orConditions,
    };

    console.log("   - Final Query Object:", JSON.stringify(query, null, 2));

    // 4. Fetch recommendations
    const recommendations = await Property.find(query)
      .limit(10) // Limit to 10 recommendations
      .populate(
        "propertyType owner address.region address.subregion address.location"
      );

    console.log(`4. Found ${recommendations.length} recommendations.`);
    console.log("--- getRecommendedProperties: Finished ---\n");

    res.json(recommendations);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getPropertiesByType,
  getPropertiesByUse,
  buyProperty,
  changeViewCount,
  getAllViews,
  changeFeatured,
  getAllFeatured,
  changePropertyStatus,
  getNearbyProperties,
  getRecommendedProperties,
  saveSearchHistory,
};
