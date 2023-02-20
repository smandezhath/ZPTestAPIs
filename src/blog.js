const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Blog = db.blog;
const router = express.Router();

const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// Create a new blog
router.post("/", (req, res) => {
  debugger;
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const blog = new Blog(data);
  blog
    .save(blog)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Blog.",
      });
    });
});

// Retrieve all blog
router.get("/", (req, res) => {
  debugger;
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  Blog.find(condition)
    .then((data) => {
      debugger;
      var result = data.map((ele) => {
        return { id: ele._id };
      });
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Blog.",
      });
    });
});

// Retrieve a single blog with id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Blog with id " + id });
      else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Blog with id=" + id });
    });
});

// Update a blog with id
router.put("/:id", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  Blog.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Blog with id=${id}. Maybe Blog was not found!`,
        });
      } else res.send({ message: "Blog was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Blog with id=" + id,
      });
    });
});

// Delete a blog with id
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Blog with id=${id}. Maybe Blog was not found!`,
        });
      } else {
        res.send({
          message: "Blog was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Blog with id=" + id,
      });
    });
});

app.use(`/.netlify/functions/blog`, router);

module.exports = app;
module.exports.handler = serverless(app);
