const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const CarReview = db.carreview;

const app = express();
const router = express.Router();

router.post("/", (req, res) => {
  // Validate request

  debugger;

  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  var data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  // Create a CarReview
  const carreview = new CarReview(data);

  // Save CarReview in the database
  carreview
    .save(carreview)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the CarReview.",
      });
    });
});

router.get("/", (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  CarReview.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CarReview.",
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  CarReview.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found CarReview with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving CarReview with id=" + id });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  JSON.parse(Buffer.from(req.body).toString("utf8"));

  CarReview.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update CarReview with id=${id}. Maybe CarReview was not found!`,
        });
      } else res.send({ message: "CarReview was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating CarReview with id=" + id,
      });
    });
});

router.delete("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  CarReview.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update CarReview with id=${id}. Maybe CarReview was not found!`,
        });
      } else res.send({ message: "CarReview was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating CarReview with id=" + id,
      });
    });
});

app.use(`/.netlify/functions/carreview`, router);

module.exports = app;
module.exports.handler = serverless(app);
