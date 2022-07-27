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
app.use(bodyParser.json({ limit: "50mb" })); // Parses the text as JSON and exposes the resulting object on req.body

app.listen(appProps["port"], () =>
  console.log(`Server Running on port: http://localhost:${appProps["port"]}`)
);

// Routes: Health Check
const healthCheckRoutes = require("./routes/healthCheckRoutes.js");
app.use("/", healthCheckRoutes);

// Routes: Authentication
const authenticationRoutes = require("./routes/authenticationRoutes.js");
app.use("/auth", authenticationRoutes);

// Routes: City Info
const cityInfoRoutes = require("./routes/cityInfoRoutes.js");
app.use("/city-info", cityInfoRoutes);

// Routes: User
const userRoutes = require("./routes/userRoutes.js");
app.use("/user", userRoutes);

// Routes: Following Relationship
const followingRelationshipRoutes = require("./routes/followingRelationshipRoutes.js");
app.use("/following-relationship", followingRelationshipRoutes);

// Routes: Google Location Info
const googleLocationInfoRoutes = require("./routes/googleLocationInfoRoutes.js");
app.use("/google-location-info", googleLocationInfoRoutes);

// Routes: Partner Location
const partnerLocationRoutes = require("./routes/partnerLocationRoutes.js");
app.use("/partner-location", partnerLocationRoutes);

// Routes: Trip Plan
const tripPlanRoutes = require("./routes/tripPlanRoutes.js");
app.use("/trip-plan", tripPlanRoutes);

// Routes: Trip Location
const tripLocationRoutes = require("./routes/tripLocationRoutes.js");
app.use("/trip-location", tripLocationRoutes);

// Routes: Wallet
const walletRoutes = require("./routes/walletRoutes.js");
app.use("/wallet", walletRoutes);

// Routes: Transaction
const transactionRoutes = require("./routes/transactionRoutes.js");
app.use("/transaction", transactionRoutes);

// Routes: Buyable Item
const buyableItemRoutes = require("./routes/buyableItemRoutes.js");
app.use("/buyable-item", buyableItemRoutes);

// Routes: Item Bought
const itemBoughtRoutes = require("./routes/itemBoughtRoutes.js");
app.use("/item-bought", itemBoughtRoutes);

// Routes: Withdraw Request
const withdrawRequestRoutes = require("./routes/withdrawRequestRoutes.js");
app.use("/withdraw-request", withdrawRequestRoutes);

// Routes: Admin
const adminRoutes = require("./routes/adminRoutes.js");
app.use("/admin", adminRoutes);

// Routes: Coupon
const couponRoutes = require("./routes/couponRoutes.js");
app.use("/coupon", couponRoutes);

// Routes: Partner Signup Request
const partnerSignupRequestRoutes = require("./routes/partnerSignupRequestRoutes.js");
app.use("/partner-signup-request", partnerSignupRequestRoutes);

// Routes: CMS (Another Service)
const cmsRoutes = require("./routes/cmsRoutes.js");
app.use("/out/cms", cmsRoutes);
