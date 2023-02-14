const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Restaurant = db.restaurant;

const app = express();
const router = express.Router();

const fs = require("file-system");

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

router.post("/", upload.single("myImage"), (req, res) => {
  // Validate request

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
    image: Buffer.from(encode_image, "base64"),
  };

  const restaurant = new Restaurant({
    title: req.body.title,
    description: req.body.description,
    image: finalImg,
    category: req.body.category,
    company: req.body.company,
    model: req.body.model,
    yom: req.body.yom,
    mileage: req.body.mileage,
    price: req.body.price,
    review: req.body.review,
    reviewCount: req.body.reviewCount,
  });

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
          image: itm.image,
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
    image: Buffer.from(encode_image, "base64"),
  };

  const id = req.params.id;

  Restaurant.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      image: finalImg,
      category: req.body.category,
      company: req.body.company,
      model: req.body.model,
      yom: req.body.yom,
      mileage: req.body.mileage,
      price: req.body.price,
      review: req.body.review,
      reviewCount: req.body.reviewCount,
    },
    { useFindAndModify: false }
  )
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
