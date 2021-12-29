const basePath = process.cwd();
const sha1 = require(`${basePath}/node_modules/sha1`);
const { startCreating, buildSetup, getElements, getRandomLayers, createRandomArt, createDna, buildSetupV2, isNewDnaUnique, addToExistingDnaList } = require(`${basePath}/src/main.js`);
const { uploadMedia, uploadMetadata } = require(`${basePath}/src/upload.js`);
const express = require("express");
const fs = require('fs')
const stream = require('stream');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const generateRouter = require('./router/generateRouter');

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

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/generate', generateRouter);

// app.get("/generate", (req, res) => {
//     const dna = generateOne();
//     res.json({"dna": `${dna}`});
// });

// app.get("/cleanup", (req, res) => {
//   cleanup();
//   res.json({"message": "Cleanup successful"});
// });

// app.get('/image/:uniqueDna',(req, res) => {
//   var uniqueDna = req.params['uniqueDna']
//   const r = fs.createReadStream(`./build/images/${uniqueDna}.png`) // or any other way to get a readable stream
//   const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
//   stream.pipeline(
//    r,
//    ps, // <---- this makes a trick with stream error handling
//    (err) => {
//     if (err) {
//       console.log(err) // No such file or any other kind of error
//       return res.sendStatus(400); 
//     }
//   })
//   ps.pipe(res) // <---- this makes a trick with stream error handling
// })

// app.get('/save/:uniqueDna',(req, res) => {
//   var uniqueDna = req.params['uniqueDna'];
//   if (isNewDnaUnique(uniqueDna)) {
//     uploadMedia(uniqueDna, `./build/images/${uniqueDna}.png`);
//     uploadMetadata(uniqueDna, `./build/json/${uniqueDna}.json`);
//     addToExistingDnaList(uniqueDna);
//     res.json({"message": `Saved! New DNA ${uniqueDna}`});
//   } else {
//     res.json({"message": `Failed! Existing DNA ${uniqueDna}`});
//   }
  
// });

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
