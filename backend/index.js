const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const appProps = require("./application-properties.json");
const app = express();

mongoose
  .connect(appProps["mongo"]["dbURI"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((err) => console.log(err));

app.use(cors()); // CORS
app.use(bodyParser.json()); // Parses the text as JSON and exposes the resulting object on req.body

app.get("/", (req, res) => res.send("Please specify the whole URI!"));
app.listen(appProps["port"], () =>
  console.log(`Server Running on port: http://localhost:${appProps["port"]}`)
);

// User Routes
const userRoutes = require("./routes/userRoutes.js");
app.use("/user", userRoutes);

// Following Relationship Routes
const followingRelationshipRoutes = require("./routes/followingRelationshipRoutes.js");
app.use("/following-relationship", followingRelationshipRoutes);

// Place Data Routes
const placeDataRoutes = require("./routes/placeDataRoutes.js");
app.use("/place-data", placeDataRoutes);

// Restaurant Data Routes
const restaurantRoutes = require("./routes/restaurantRoutes.js");
app.use("/restaurant", restaurantRoutes);

// Partner Location Routes
const partnerLocationRoutes = require("./routes/partnerLocationRoutes.js");
app.use("/partner-location", partnerLocationRoutes);

