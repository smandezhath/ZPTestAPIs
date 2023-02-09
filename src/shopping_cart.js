const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const ShoppingCart = db.shopping_cart;

const app = express();
const router = express.Router();

// Create a new Policies
router.post("/", (req, res) => {
  debugger;

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

  // Create a ShoppingCart
  const shoppingCart = new ShoppingCart(data);

  // Save ShoppingCart in the database
  shoppingCart
    .save(shoppingCart)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ShoppingCart.",
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

  ShoppingCart.find(condition)
    .then((data) => {
      var result = {};

      data.map((itm) => {
        result[itm.title] = {
          id: itm._id,
          title: itm.title,
          description: itm.description,
          detailedDescription: itm.detailedDescription,
          //image: [{ type: Blob }],
          category: itm.category,
          addToCart: itm.addToCart,
          mileage: itm.mileage,
          price: itm.mileage,
          review: itm.review,
          reviewCount: itm.reviewCount,
        };
      });

      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ShoppingCart.",
      });
    });
});

// Retrieve a single Policy with id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  ShoppingCart.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found ShoppingCart with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving ShoppingCart with id=" + id });
    });
});

// Update a Policies with id
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  var data = JSON.parse(new TextDecoder().decode(req.body));

  const id = req.params.id;

  ShoppingCart.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update ShoppingCart with id=${id}. Maybe ShoppingCart was not found!`,
        });
      } else res.send({ message: "ShoppingCart was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating ShoppingCart with id=" + id,
      });
    });
});

// Delete a Policies with id
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  ShoppingCart.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete ShoppingCart with id=${id}. Maybe ShoppingCart was not found!`,
        });
      } else {
        res.send({
          message: "ShoppingCart was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete ShoppingCart with id=" + id,
      });
    });
});

app.use(`/.netlify/functions/shopping_cart`, router);

module.exports = app;
module.exports.handler = serverless(app);
