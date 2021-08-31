require("@tensorflow/tfjs-node");

const save = require("./utils/saveFile");

const path = require("path");

const canvas = require("canvas");

const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");

const modelPathRoot = "./models";

let optionsSSDMobileNet;

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// async function image(file) {
//   const decoded = tf.node.decodeImage(file);
//   const casted = decoded.toFloat();
//   const result = casted.expandDims(0);
//   decoded.dispose();
//   casted.dispose();
//   return result;
// }

async function detect(tensor) {
  const detections = await faceapi
    .detectAllFaces(
      tensor,
      new faceapi.SsdMobilenetv1Options({ inputSize: 512, scoreThreshold: 0.4 })
    )
    .withFaceLandmarks();

  return detections;
}

const modelPath = path.join(__dirname, modelPathRoot);
faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);

console.log("FaceAPI models loaded");

async function main(file, filename) {
  // const tensor = await image(file);
  const canvasImg = await canvas.loadImage(file);

  const result = await detect(canvasImg);

  console.log("Detected faces:", result.length);

  const out = await faceapi.createCanvasFromMedia(canvasImg);
  faceapi.draw.drawDetections(out, result);
  save.saveFile(filename, out.toBuffer("image/jpeg"));
  console.log(`done, saved results to ${filename}`);

  // tensor.dispose();

  return result;
}

module.exports = {
  detect: main,
};
