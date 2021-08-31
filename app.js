const express = require("express");
const fileUpload = require("express-fileupload");
const faceApiService = require("./faceapiService.js");

const app = express();

app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", async (req, res) => {
  const { file } = req.files;
  const result = await faceApiService.detect(file.data, file.name);

  if (result) {
    res.json({
      detectedFaces: result.length,
      url: `http://localhost:3000/out/${file.name}`,
    });
  } else res.send("Fail file upload");
});

app.use("/out", express.static("out"));

module.exports = app;
