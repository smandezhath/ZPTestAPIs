const path = require("path");
const express = require("express");
const hbs = require("hbs");

const forcast = require("./utils/forcast");

const app = express();

// Define paths for express config
const publicPathDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebar engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPathDirectory));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Vimal",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Vimal K",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "This is help page",
    name: "Vimal K",
  });
});

app.get("/weather", (req, res) => {
  if (!(req.query.lat && req.query.long)) {
    return res.send({
      error: "You must provide the address!",
    });
  }

  if (req.query.lat && req.query.long) {
    forcast(req.query.lat, req.query.long, (error, data) => {
      if (error) {
        return res.send({
          error: "There is no such data",
        });
      }
      res.send({
        data,
      });
    });
  }
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    message: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    message: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
