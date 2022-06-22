const { PlaceData } = require("./../models/placeData.js");

const getAllPlaces = (req, res) => {
  PlaceData.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res
        .status(400)
        .send(
          `An error occurred while getting all the records from Place Data collection`
        );
    });
};

const createPlaceData = (req, res) => {
  const newPlaceData = new PlaceData(req.body);
  newPlaceData
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { getAllPlaces, createPlaceData };
