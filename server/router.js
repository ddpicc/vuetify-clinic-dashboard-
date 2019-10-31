const express = require('express');
const router = express.Router();
const api = require('./api');

router.get('/getAllMedbyType', (req, res, next) => {
  api.getAllMedbyType(req, res, next);
});

router.get('/getAllOrd', (req, res, next) => {
  api.getAllOrd(req, res, next);
});

router.post('/updateMedbyId', (req, res, next) => {
  api.updateMedbyId(req, res, next);
});

router.post('/insertMed', (req, res, next) => {
  api.insertMed(req, res, next);
});

module.exports = router;