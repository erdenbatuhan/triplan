const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  Restaurant,
  TouristAttraction,
} = require("./../models/partnerLocation.js");

const googleLocationInfoController = require("./googleLocationInfoController.js");

const findDistinctCities = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      Restaurant.distinct("city", { city: { $nin : ["", null, undefined] } }),
      TouristAttraction.distinct("city", { city: { $nin : ["", null, undefined] } }),
    ]).then(([restaurantCities, touristAttractionCities]) => {
      resolve([...new Set([
        ...restaurantCities,
        ...touristAttractionCities
      ])]);
    }).catch(err => reject(err));
  });
};

const findFiltered = (filterData) => {
  return new Promise((resolve, reject) => {
    // Fetch all the locations (restaurants and tourist attractions) matching the specified filters
    Promise.all([
      Restaurant.find({
        priceLevel: { $lte: filterData["restaurantFilter"]["priceLevel"] },
        cuisines: { $in: filterData["restaurantFilter"]["cuisines"] },
        foodTypes: { $in: filterData["restaurantFilter"]["foodTypes"] },
      }).sort({ priceLevel: "asc" }),
      TouristAttraction.find({
        touristAttractionTypes: {
          $in: filterData["touristAttractionFilter"]["types"],
        },
      })
    ]).then(([
      restaurants, touristAttractions
    ]) => {
      // Sort the returned locations (restaurants and tourist attractions) by their "calculate scores"
      Promise.all([
        sortLocationsByScore(restaurants), sortLocationsByScore(touristAttractions)
      ]).then(([
        restaurantsSorted, touristAttractionsSorted 
      ]) => {
        resolve({ restaurants: restaurantsSorted, touristAttractions: touristAttractionsSorted });
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  });
};

const sortLocationsByScore = (locations) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the google location info ID, if exists, of each location
      const googleLocationInfoIds = locations.filter(location => location.googleLocationInfo).map(location => location.googleLocationInfo["_id"]);

      // Calculate the final scores
      const finalScores = await Promise.all([
        googleLocationInfoController.getRatingScores(googleLocationInfoIds),
        googleLocationInfoController.getReviewCountScores(googleLocationInfoIds)
      ]).then(([ ratingScores, reviewCountScores ]) => (
        Object.assign({}, ...googleLocationInfoIds.map(googleLocationInfoId => {
          const ratingScore = ratingScores[googleLocationInfoId];
          const reviewCountScore = reviewCountScores[googleLocationInfoId];
          const followerRatingScore = 0;

          return { [googleLocationInfoId]: ratingScore + reviewCountScore + followerRatingScore };
        }))
      )).catch(err => reject(err));

      // Sort the locations "in descending order" according to their calculated final scores
      locations.sort((location1, location2) => (
        (location2.googleLocationInfo ? (finalScores[location2.googleLocationInfo["_id"]] || 0) : 0) - 
        (location1.googleLocationInfo ? (finalScores[location1.googleLocationInfo["_id"]] || 0) : 0)
      ));

      resolve(locations);
    } catch (err) {
      reject(err)
    }
  });
};

const findByTripLocations = (tripLocationIds) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      // Fetch all restaurants associated with the given trip locations
      Restaurant.find({
        associatedTripLocations: { $in: tripLocationIds },
      }),
      // Fetch all restaurants associated with the given trip locations
      TouristAttraction.find({
        associatedTripLocations: { $in: tripLocationIds },
      }),
    ]).then(([restaurants, touristAttractions]) => {
      resolve({ restaurants, touristAttractions });
    }).catch(err => reject(err));
  });
};

const findRestaurantById = (restaurantId) => {
  return Restaurant.findById(restaurantId);
};

const saveRestaurant = (restaurant) => {
  return Restaurant.findOneAndUpdate(
    restaurant._id ? { _id: restaurant._id } : null,
    restaurant,
    { upsert: true, new: true }
  );
};

const findTouristAttractionById = (touristAttractionId) => {
  return TouristAttraction.findById(touristAttractionId);
};

const saveTouristAttraction = (touristAttraction) => {
  return TouristAttraction.findOneAndUpdate(
    touristAttraction._id ? { _id: touristAttraction._id } : null,
    touristAttraction,
    { upsert: true, new: true }
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
    const newPartnerLocation = await insertRestaurant({
      ...req.body,
      password: hash,
    });

    // return jwt
    const payload = {
      partnerLocation: {
        id: newPartnerLocation._id,
        username: newPartnerLocation.username,
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
    const newPartnerLocation = await insertTouristAttraction({
      ...req.body,
      password: hash,
    });

    // return jwt
    const payload = {
      partnerLocation: {
        id: newPartnerLocation._id,
        username: newPartnerLocation.username,
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
  console.log("username:", username);
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

const insertRestaurant = (restaurant) => {
  return Restaurant.insertMany([restaurant]);
};

const insertTouristAttraction = (touristAttraction) => {
  return TouristAttraction.insertMany([touristAttraction]);
};

module.exports = {
  findDistinctCities,
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
};
