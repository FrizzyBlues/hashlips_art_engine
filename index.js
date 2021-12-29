const basePath = process.cwd();
const sha1 = require(`${basePath}/node_modules/sha1`);
const { startCreating, buildSetup, getElements, getRandomLayers, createRandomArt, createDna, buildSetupV2, isNewDnaUnique, addToExistingDnaList } = require(`${basePath}/src/main.js`);
const { uploadMedia, uploadMetadata } = require(`${basePath}/src/upload.js`);

// const express = require('express');
// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');


// (() => {
//   buildSetup();
//   startCreating();
// })();

const cleanup = () => {
  buildSetup();
}

const generateOne = () => {
  buildSetupV2();
  const layers = getRandomLayers();
  const newDnaRaw = createDna(layers);
  createRandomArt(newDnaRaw, layers);
  const newDna = sha1(newDnaRaw);
  return newDna;
}

// const createReadStream = () => {
//   let r = null;
//   try {
//     r = fs.createReadStream('./build/images/0.png') // or any other way to get a readable stream
//   } catch (e) {
//     console.log('too soon to view');
//   }
//   return r;
// }

const express = require("express");
const fs = require('fs')
const stream = require('stream');

const app = express();

app.get("/", (req, res) => {
    res.send("The Adorable");
});

app.get("/generate", (req, res) => {
    const dna = generateOne();
    res.send(`${dna}`);
});

app.get("/cleanup", (req, res) => {
  cleanup();
  res.send("Cleanup successful");
});

app.get('/image/:uniqueDna',(req, res) => {
  var uniqueDna = req.params['uniqueDna']
  const r = fs.createReadStream(`./build/images/${uniqueDna}.png`) // or any other way to get a readable stream
  const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
  stream.pipeline(
   r,
   ps, // <---- this makes a trick with stream error handling
   (err) => {
    if (err) {
      console.log(err) // No such file or any other kind of error
      return res.sendStatus(400); 
    }
  })
  ps.pipe(res) // <---- this makes a trick with stream error handling
})

app.get('/save/:uniqueDna',(req, res) => {
  var uniqueDna = req.params['uniqueDna'];
  if (isNewDnaUnique(uniqueDna)) {
    uploadMedia(uniqueDna, `./build/images/${uniqueDna}.png`);
    uploadMetadata(uniqueDna, `./build/json/${uniqueDna}.json`);
    addToExistingDnaList(uniqueDna);
    res.send(`Saved! New DNA ${uniqueDna}`);
  } else {
    res.send(`Failed! Existing DNA ${uniqueDna}`);
  }
  
});

app.listen(3000, () => console.log('Server listening at port 3000'));
