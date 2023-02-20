const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const ShoppingCart = db.shoppingcart;
const router = express.Router();

const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// Create a new shoppingcart
router.post("/", (req, res) => {
  debugger;
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const shoppingcart = new ShoppingCart(data);
  shoppingcart
    .save(shoppingcart)
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

// Retrieve all shoppingcart
// router.get("/", (req, res) => {
//   debugger;
//   const title = req.query.title;
//   var condition = title
//     ? { title: { $regex: new RegExp(title), $options: "i" } }
//     : {};

//   ShoppingCart.find(condition)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving ShoppingCart.",
//       });
//     });
// });

router.get("/", (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
    ShoppingCart.find(condition)
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
          message: err.message || "Some error occurred while retrieving ShoppingCart.",
        });
    });
});

// Retrieve a single shoppingcart with id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  ShoppingCart.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found ShoppingCart with id " + id });
      else {
        res.send(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving ShoppingCart with id=" + id });
    });
});

// Update a shoppingcart with id
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

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

// Delete a shoppingcart with id
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

app.use(`/.netlify/functions/shoppingcart`, router);

module.exports = app;
module.exports.handler = serverless(app);
