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

// Route: User
const userRoutes = require("./routes/userRoutes.js");
app.use("/user", userRoutes);

// Route: Following Relationship
const followingRelationshipRoutes = require("./routes/followingRelationshipRoutes.js");
app.use("/following-relationship", followingRelationshipRoutes);

// Route: Google Location Info
const googleLocationInfoRoutes = require("./routes/googleLocationInfoRoutes.js");
app.use("/google-location-info", googleLocationInfoRoutes);

// Route: Partner Location
const partnerLocationRoutes = require("./routes/partnerLocationRoutes.js");
app.use("/partner-location", partnerLocationRoutes);

// Route: Wallet
const walletRoutes = require("./routes/walletRoutes.js");
app.use("/wallet", walletRoutes);

