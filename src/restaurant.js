const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Restaurant = db.restaurant;
const router = express.Router();

const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// Create a new restaurant
router.post("/", (req, res) => {
  debugger;
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const restaurant = new Restaurant(data);
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

// Retrieve all restaurant
// router.get("/", (req, res) => {
//   debugger;
//   const title = req.query.title;
//   var condition = title
//     ? { title: { $regex: new RegExp(title), $options: "i" } }
//     : {};

//   Restaurant.find(condition)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Restaurant.",
//       });
//     });
// });

router.get("/", (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
    Restaurant.find(condition)
    .then((data) => {
      debugger;
      var result = data.map((ele) => {
        return { id: ele._id };
      });
      res.send(result);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: err.message || "Some error occurred while retrieving Restaurant.",
        });
    });
});

// Retrieve a single restaurant with id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  Restaurant.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Restaurant with id " + id });
      else {
        res.send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Restaurant with id=" + id });
    });
});

// Update a restaurant with id
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

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

// Delete a restaurant with id
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
