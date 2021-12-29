const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const sha1 = require(`${basePath}/node_modules/sha1`);
const { startCreating, buildSetup, getElements, getRandomLayers, createRandomArt, createDna, buildSetupV2, isNewDnaUnique, addToExistingDnaList } = require(`${basePath}/src/main.js`);
const fs = require('fs')
const stream = require('stream');
const { uploadMedia, uploadMetadata } = require(`${basePath}/src/upload.js`);

router.get('/generate', async function(req, res, next) { 
    try { 
        const layers = await getRandomLayers(); 
        const newDnaRaw = await createDna(layers); 
        await createRandomArt(newDnaRaw, layers); 
        res.json({"dna": sha1(newDnaRaw)}); 
    } catch (err) { 
      console.error(`Error while getting programming languages`, err.message); 
      next(err); 
    } 
}); 

router.get('/cleanup', async function(req, res, next) { 
    try { 
        await buildSetup(); 
        res.json({"message": "Completed cleanup"}); 
    } catch (err) { 
      console.error(`Error while getting programming languages`, err.message); 
      next(err); 
    } 
});

router.get('/image/:uniqueDna', (req, res) => {
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
});

router.get('/save/:uniqueDna',(req, res) => {
  var uniqueDna = req.params['uniqueDna'];
  if (isNewDnaUnique(uniqueDna)) {
    uploadMedia(uniqueDna, `./build/images/${uniqueDna}.png`);
    uploadMetadata(uniqueDna, `./build/json/${uniqueDna}.json`);
    addToExistingDnaList(uniqueDna);
    res.json({"message": `Saved! New DNA ${uniqueDna}`});
  } else {
    res.json({"message": `Failed! Existing DNA ${uniqueDna}`});
  }
});

module.exports = router;
