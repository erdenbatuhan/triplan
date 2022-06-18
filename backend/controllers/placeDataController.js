const { PlaceData } = require("./../models/placeData.js");

const findAll = (req, res) => {
  const filters = req.query;
  const filteredPlaceData = PlaceData.filter(data => {
    let isValid = true;
    for (key in filters) {
      console.log(key, data[key], filters[key]);
      isValid = isValid && data[key] == filters[key];
    }
    return isValid;
  })
  .then((result) => {
    res.status(200).send(filteredPlaceData);
  })
  .catch((err) => {
    res
      .status(400)
      .send(
        `An error occurred while getting all the records from User collection`
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

module.exports = { findAll, createPlaceData };
