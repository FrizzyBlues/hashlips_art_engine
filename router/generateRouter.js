const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const sha1 = require(`${basePath}/node_modules/sha1`);
const { startCreating, buildSetup, getElements, getRandomLayers, createRandomArt, createDna, buildSetupV2, isNewDnaUnique, addToExistingDnaList } = require(`${basePath}/src/main.js`);

router.get('/', async function(req, res, next) { 
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

module.exports = router;
