const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const ShoppingCart = db.shopping_cart;

const fs = require("file-system");

const app = express();
const router = express.Router();

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

// Create a new Policies

router.post("/", upload.single("myImage"), (req, res) => {
  debugger;

  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString("base64");
  // Define a JSONobject for the image attributes for saving to database

  var finalImg = {
    contentType: req.file.mimetype,
    data: Buffer.from(encode_image, "base64"),
  };

  const shoppingCart = new ShoppingCart({
    title: req.body.title,
    description: req.body.description,
    detailedDescription: req.body.detailedDescription,
    image: finalImg,
    category: req.body.category,
    addToCart: req.body.addToCart,
    mileage: req.body.mileage,
    price: req.body.mileage,
    review: req.body.review,
    reviewCount: req.body.reviewCount,
  });

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
router.put("/:id", upload.single("myImage"), (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString("base64");

  var finalImg = {
    contentType: req.file.mimetype,
    data: Buffer.from(encode_image, "base64"),
  };

  const id = req.params.id;

  var data = {
    title: req.body.title,
    description: req.body.description,
    detailedDescription: req.body.detailedDescription,
    image: finalImg,
    category: req.body.category,
    addToCart: req.body.addToCart,
    mileage: req.body.mileage,
    price: req.body.mileage,
    review: req.body.review,
    reviewCount: req.body.reviewCount,
  };

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
