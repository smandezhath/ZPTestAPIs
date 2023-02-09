const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Restaurant = db.restaurant;

const app = express();
const router = express.Router();

router.post("/", (req, res) => {
  // Validate request

  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  var data = JSON.parse(new TextDecoder().decode(req.body));

  if (!data.title) {
    res.status(400).send({ message: "title cannot be empty!" });
    return;
  }

  // Create a Restaurant
  const restaurant = new Restaurant(data);

  // Save Restaurant in the database
  restaurant
    .save(restaurant)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Restaurant.",
      });
    });
});

// Retrieve all Policies
router.get("/", (req, res) => {
  debugger;
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Restaurant.find(condition)
    .then((data) => {
      var result = {};

      data.map((itm) => {
        result[itm.title] = {
          id: itm._id,
          title: itm.title,
          description: itmdescription,
          //image: itm.image,
          category: itm.category,
          company: itm.company,
          model: itm.model,
          yom: itm.yom,
          mileage: itm.mileage,
          price: itm.price,
          review: itm.review,
          reviewCount: itm.reviewCount,
        };
      });

      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Restaurant.",
      });
    });
});

// Retrieve a single Policy with id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Restaurant.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Restaurant with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Restaurant with id=" + id });
    });
});

// Update a Policies with id
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  var data = JSON.parse(new TextDecoder().decode(req.body));

  Restaurant.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found!`,
        });
      } else res.send({ message: "Restaurant was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Restaurant with id=" + id,
      });
    });
});

// Delete a Policies with id
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Restaurant.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Restaurant with id=${id}. Maybe Restaurant was not found!`,
        });
      } else {
        res.send({
          message: "Restaurant was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Restaurant with id=" + id,
      });
    });
});

app.use(`/.netlify/functions/restaurant`, router);

module.exports = app;
module.exports.handler = serverless(app);
