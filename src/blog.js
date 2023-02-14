const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Blog = db.blog;

const router = express.Router();

const cors = require("cors");

const app = express();

app.options("*", cors());
app.use(cors());

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

// Create a new blog
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

  const blog = new Blog({
    title: req.body.title,
    category: req.body.category,
    image: finalImg,
    content: req.body.content,
    signature: req.body.signature,
    reviewed: req.body.reviewed,
    approved: req.body.approved,
  });

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
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Blog.find(condition)
    .then((data) => {
      var result = {};

      data.map((itm) => {
        result[itm.title] = {
          id: itm._id,
          title: itm.title,
          category: itm.category,
          image: itm.image,
          content: itm.content,
          signature: itm.signature,
          reviewed: itm.reviewed,
          approved: itm.approved,
        };
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
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Blog with id " + id });
      else res.send(data);
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

  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString("base64");

  var finalImg = {
    contentType: req.file.mimetype,
    image: Buffer.from(encode_image, "base64"),
  };

  let data = {
    title: req.body.title,
    category: req.body.category,
    image: req.body.image,
    content: req.body.content,
    signature: req.body.signature,
    reviewed: req.body.reviewed,
    approved: req.body.approved,
  };

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
