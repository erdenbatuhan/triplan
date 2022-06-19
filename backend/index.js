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

// HelloWorld Routes
const helloWorldRoutes = require("./routes/helloWorldRoutes.js");
app.use("/hello-world", helloWorldRoutes);

// User Routes
const userRoutes = require("./routes/userRoutes.js");
app.use("/users", userRoutes);

// placeData Routes
const placeDataRoutes = require("./routes/placeDataRoutes.js");
app.use("/placeData", placeDataRoutes);
