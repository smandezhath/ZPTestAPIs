// module.exports = (app) => {

const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Movierating = db.movierating;

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

  var data = JSON.parse(new TextDecoder().decode(req.body));

  if (!data.title) {
    res.status(400).send({ message: "title cannot be empty!" });
    return;
  }

  // Create a Movierating
  const movierating = new Movierating(data);

  // Save Movierating in the database
  movierating
    .save(movierating)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Movierating.",
      });
    });
});

// Retrieve all car review
router.get("/", (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Movierating.find(condition)
    .then((data) => {
      var result = {};

      data.map((itm) => {
        result[itm.title] = {
          id: itm._id,
          title: itm.title,
          star_rating: itm.star_rating,
          rating_count: itm.rating_count,
          // Image
          description: itm.description,
          category: itm.Category,
        };
      });

      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Movierating.",
      });
    });
});

// Retrieve a single car review with id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Movierating.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found Movierating with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Movierating with id=" + id });
    });
});

// Update a car review with id
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  var data = JSON.parse(new TextDecoder().decode(req.body));

  Movierating.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Movierating with id=${id}. Maybe Movierating was not found!`,
        });
      } else res.send({ message: "Movierating was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Movierating with id=" + id,
      });
    });
});

// Delete a car review with id
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Movierating.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Movierating with id=${id}. Maybe Movierating was not found!`,
        });
      } else {
        res.send({
          message: "Movierating was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Movierating with id=" + id,
      });
    });
});

app.use(`/.netlify/functions/movierating`, router);

module.exports = app;
module.exports.handler = serverless(app);
