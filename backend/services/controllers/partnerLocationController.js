const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  MIN_COUNT_FOR_VISIBILITY_RESTAURANT,
  MIN_COUNT_FOR_VISIBILITY_TOURIST_ATTRACTION,
  Restaurant,
  TouristAttraction,
} = require("./../models/partnerLocation.js");
const { Wallet } = require("./../models/wallet.js");

const { PARTNER_TYPES } = require("./../utils/enums.js");

const findDistinctCitiesWithEnoughPlaces = () => {
  return Promise.all([
    Restaurant.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }]),
    TouristAttraction.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }])
  ]).then(([ restaurantCityCounts, touristAttractionCityCounts ]) => {
    return [...new Set(
      restaurantCityCounts
        .filter(({ count }) => count >= MIN_COUNT_FOR_VISIBILITY_RESTAURANT)
        .map(({ _id }) => _id),
      touristAttractionCityCounts
        .filter(({ count }) => count >= MIN_COUNT_FOR_VISIBILITY_TOURIST_ATTRACTION)
        .map(({ _id }) => _id)
    )];
  });
};

const findFiltered = (filterData) => {
  // Fetch all the locations (restaurants and tourist attractions) matching the specified filters
  return Promise.all([
    Restaurant.find({
      city: filterData["city"],
      priceLevel: { $in: filterData["restaurantFilter"]["priceLevels"] },
      cuisines: { $in: filterData["restaurantFilter"]["cuisines"] },
      foodTypes: { $in: filterData["restaurantFilter"]["foodTypes"] },
    }).sort({ priceLevel: "asc" }),
    TouristAttraction.find({
      city: filterData["city"],
      touristAttractionTypes: {
        $in: filterData["touristAttractionFilter"]["types"][1], // TODO: Do we need 1 here?
      },
    }),
  ]).then(([restaurants, touristAttractions]) => ({
    restaurants,
    touristAttractions,
  }));
};

const findByTripLocations = (tripLocationIds) => {
  return Promise.all([
    // Fetch all restaurants associated with the given trip locations
    Restaurant.find({
      associatedTripLocations: { $in: tripLocationIds },
    }),
    // Fetch all restaurants associated with the given trip locations
    TouristAttraction.find({
      associatedTripLocations: { $in: tripLocationIds },
    }),
  ]).then(([restaurants, touristAttractions]) => ({
    restaurants,
    touristAttractions,
  }));
};

const findRestaurantById = (restaurantId) => {
  return Restaurant.findById(restaurantId);
};

const saveRestaurant = (restaurant) => {
  return Restaurant.findOneAndUpdate(
    restaurant._id ? { _id: restaurant._id } : null,
    restaurant,
    { upsert: true, new: true, runValidators: true }
  );
};

const findTouristAttractionById = (touristAttractionId) => {
  return TouristAttraction.findById(touristAttractionId);
};

const saveTouristAttraction = (touristAttraction) => {
  return TouristAttraction.findOneAndUpdate(
    touristAttraction._id ? { _id: touristAttraction._id } : null,
    touristAttraction,
    { upsert: true, new: true, runValidators: true }
  );
};

/**
 * Creates a partner location or updates an existing one
 */

const signUpRestaurant = async (req, res) => {
  const { username, email, password, partnerLocationType } = req.body;
  try {
    // check if the partner location already exists
    RestaurantByUsername = await findRestaurantByUsername(username);
    RestaurantByEmail = await findRestaurantByEmail(email);

    if (RestaurantByUsername.length !== 0 || RestaurantByEmail.length !== 0) {
      return res.status(400).json({ msg: "Partner Location already exists" });
    }
    // hash partner location password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const wallet = await Wallet.create(new Wallet()); // Create an empty wallet

    const newPartnerLocation = await createRestaurant({
      ...req.body,
      wallet,
      password: hash,
    });

    // return jwt
    const payload = {
      partnerLocation: {
        id: newPartnerLocation[0]._id,
        username: newPartnerLocation[0].username,
        partnerType: newPartnerLocation[0].partnerType,
      },
    };

    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const signUpTouristAttraction = async (req, res) => {
  const { username, email, password, partnerLocationType } = req.body;
  try {
    // check if the partner location already exists

    TouristAttractionByUsername = await findTouristAttractionByUsername(
      username
    );
    TouristAttractionByEmail = await findTouristAttractionByEmail(email);

    if (
      TouristAttractionByUsername.length !== 0 ||
      TouristAttractionByEmail.length !== 0
    ) {
      return res.status(400).json({ msg: "Partner Location already exists" });
    }
    // hash partner location password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const wallet = await Wallet.create(new Wallet()); // Create an empty wallet

    const newPartnerLocation = await createTouristAttraction({
      ...req.body,
      wallet,
      password: hash,
    });

    // return jwt
    const payload = {
      partnerLocation: {
        id: newPartnerLocation[0]._id,
        username: newPartnerLocation[0].username,
        partnerType: newPartnerLocation[0].partnerType,
      },
    };

    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "7 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Checks credentials
 */
const loginRestaurant = async (req, res) => {
  const { username, password, partnerLocationType } = req.body;
  try {
    // check if the user exists
    let restaurant = await findRestaurantByUsername(username);

    if (restaurant.length === 0) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // check is the encrypted password matches
    const isMatch = await bcrypt.compare(password, restaurant[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    const payload = {
      partnerLocation: {
        id: restaurant[0]._id,
        username,
        partnerType: restaurant[0].partnerType,
      },
    };
    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "30 days" },
      (err, token) => {
        if (err) throw err;
        jwt.verify(token, process.env["JWT_SECRET"], (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: "Token is not valid" });
          } else {
            return res.status(200).json({
              success: true,
              token: token,
              message: decoded,
            });
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const loginTouristAttraction = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if the user exists
    let touristAttraction = await findTouristAttractionByUsername(username);
    // let touristAttraction = await findTouristAttractionByUsername(username);
    // let loginObject = null

    if (touristAttraction.length === 0) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    // check is the encrypted password matches
    const isMatch = await bcrypt.compare(
      password,
      touristAttraction[0].password
    );

    if (!isMatch) {
      return res.status(400).json({ msg: "Username or password incorrect" });
    }

    const payload = {
      partnerLocation: {
        id: touristAttraction[0]._id,
        username,
        partnerType: touristAttraction[0].partnerType,
      },
    };
    jwt.sign(
      payload,
      process.env["JWT_SECRET"],
      { expiresIn: "30 days" },
      (err, token) => {
        if (err) throw err;
        jwt.verify(token, process.env["JWT_SECRET"], (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: "Token is not valid" });
          } else {
            return res.status(200).json({
              success: true,
              token: token,
              message: decoded,
            });
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const findRestaurantByUsername = (username) => {
  return Restaurant.find({ username: { $eq: username } });
};

const findRestaurantByEmail = (email) => {
  return Restaurant.find({ email: { $eq: email } });
};

const findTouristAttractionByUsername = (username) => {
  return TouristAttraction.find({ username: { $eq: username } });
};

const findTouristAttractionByEmail = (email) => {
  return TouristAttraction.find({ email: { $eq: email } });
};

const createRestaurant = (restaurant) => {
  return Restaurant.create(restaurant);
};

const createTouristAttraction = (touristAttraction) => {
  return TouristAttraction.create(touristAttraction);
};

const updatePartnerLocation = async (id, fields, { session }) => {
  const { partnerType } = await findPartnerLocationById(id);
  const partnerLocation = partnerType === PARTNER_TYPES[0] ? Restaurant : TouristAttraction;

  return partnerLocation.findOneAndUpdate(
    { _id: id },
    fields,
    { new: true, runValidators: true, session }
  );
};

const findPartnerLocationById = (partnerLocationId) => {
  return Promise.all([
    findRestaurantById(partnerLocationId), findTouristAttractionById(partnerLocationId)
  ]).then(([
    restaurant, touristAttraction
  ]) => restaurant || touristAttraction || null);
};

const addTripLocationToRestaurant = (restaurantId, tripLocation, { session }) => {
  return Restaurant.findOneAndUpdate(
    { _id: restaurantId },
    { $push: { associatedTripLocations: tripLocation } },
    { new: true, runValidators: true, session }
  );
};

const addTripLocationToTouristAttraction = (touristAttractionId, tripLocation, { session }) => {
  return TouristAttraction.findOneAndUpdate(
    { _id: touristAttractionId },
    { $push: { associatedTripLocations: tripLocation } },
    { new: true, runValidators: true, session }
  );
};

const findRestaurantWalletsByWalletIds = (walletIds) => {
  return Restaurant.find({ wallet: { $in: walletIds } }).select("name wallet");
};

const findTouristAttractionWalletsByWalletIds = (walletIds) => {
  return TouristAttraction.find({ wallet: { $in: walletIds } }).select(
    "name wallet"
  );
};

module.exports = {
  findDistinctCitiesWithEnoughPlaces,
  findFiltered,
  findByTripLocations,
  findRestaurantById,
  saveRestaurant,
  findTouristAttractionById,
  saveTouristAttraction,
  signUpRestaurant,
  signUpTouristAttraction,
  loginRestaurant,
  loginTouristAttraction,
  updatePartnerLocation,
  findPartnerLocationById,
  addTripLocationToRestaurant,
  addTripLocationToTouristAttraction,
  findRestaurantWalletsByWalletIds,
  findTouristAttractionWalletsByWalletIds,
};
