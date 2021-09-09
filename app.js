const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const Artist = require("./models/ArtistModel");
const Art = require("./models/ArtModel");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dyxcvljjx",
  api_key: "941793265835338",
  api_secret: "2coqq_fjfxafETW33ilQ20iFIYI",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(
    "mongodb+srv://agent-alpha:Area51Lab@khawlaunityindiversity.hbjfj.mongodb.net/KhawlaUID?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Successfully Connected.");
  })
  .catch((e) => {
    console.log(e);
  });

const PORT = process.env.PORT || 8080;

//  ARTIST
app.get("/api/artists/all", (req, res) => {
  Artist.find({}, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Artists not found");
      }
    }
  }).sort({ artist_name: 1 });
});

app.get("/api/artists/single", (req, res) => {
  const { artist_id } = req.query;
  Artist.findById({ _id: artist_id }, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
      console.log(err);
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Artist not found");
      }
    }
  }).populate("artist_arts");
});

app.post("/api/artists/create", async (req, res) => {
  const {
    artist_name,
    artist_description,
    artist_name_ar,
    artist_description_ar,
    artist_image,
  } = req.body;
  Artist.create(
    {
      artist_name,
      artist_description,
      artist_name_ar,
      artist_description_ar,
      artist_image,
    },
    (err, result) => {
      if (err) {
        res.status(400).send("Something went wrong");
      } else {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(400).send("Cannot create artist");
        }
      }
    }
  );
});

app.put("/api/artists/edit", (req, res) => {
  const { artist_id } = req.query;
  Artist.updateOne({ _id: artist_id }, { $set: req.body }, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Cannot edit artist");
      }
    }
  });
});

app.delete("/api/artists/delete", (req, res) => {
  const { artist_id } = req.query;
  Artist.deleteOne({ _id: artist_id }, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Cannot delete artist");
      }
    }
  });
});

// ART
app.get("/api/arts/all", (req, res) => {
  Art.find({}, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Arts not found");
      }
    }
  })
    .populate("artist", "artist_name artist_description artist_image")
    .sort({ artist_name: -1 });
});

app.get("/api/arts/single", (req, res) => {
  const { art_id } = req.query;
  Art.findById(art_id, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Art not found");
      }
    }
  }).populate("artist", "artist_name artist_description artist_image");
});

app.post("/api/arts/create", (req, res) => {
  const {
    art_name,
    art_description,
    art_year,
    art_medium,
    art_dimensions,
    art_origin,
    art_image,
    artist,
  } = req.body;
  Art.create(
    {
      art_name,
      art_description,
      art_year,
      art_medium,
      art_dimensions,
      art_origin,
      art_image,
      artist,
    },
    (err, result) => {
      if (err) {
        res.status(400).send("Something went wrong");
      } else {
        if (result) {
          Artist.findByIdAndUpdate(
            artist,
            { $push: { artist_arts: result._id } },
            (err2, result2) => {
              if (err2) {
                res.status(400).send(err2);
              } else {
                if (result2) {
                  res.status(200).send({ res1: result, res2: result2 });
                } else {
                  res.status(400).send("ERROR");
                }
              }
            }
          );
        } else {
          res.status(400).send("Cannot create art");
        }
      }
    }
  );
});

app.put("/api/arts/edit", (req, res) => {
  const { art_id } = req.query;
  Art.updateOne({ _id: art_id }, { $set: req.body }, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Cannot edit art");
      }
    }
  });
});

app.delete("/api/arts/delete", (req, res) => {
  const { art_id } = req.query;
  Art.deleteOne({ _id: art_id }, (err, result) => {
    if (err) {
      res.status(400).send("Something went wrong");
    } else {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Cannot delete art");
      }
    }
  });
});

// MAIN WEBSITE
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
