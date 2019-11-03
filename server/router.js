const express = require('express');
const router = express.Router();
const api = require('./api');

router.get('/getAllMedbyType', (req, res, next) => {
  api.getAllMedbyType(req, res, next);
});

router.post('/updateMedbyId', (req, res, next) => {
  api.updateMedbyId(req, res, next);
});

router.post('/insertMed', (req, res, next) => {
  api.insertMed(req, res, next);
});

router.delete('/deleteMedbyId', (req, res, next) => {
  api.deleteMedbyId(req, res, next);
});

router.get('/getAllOrd', (req, res, next) => {
  api.getAllOrd(req, res, next);
});

router.post('/insertOrd', (req, res, next) => {
  api.insertOrd(req, res, next);
});

router.get('/getAllPatient', (req, res, next) => {
  api.getAllPatient(req, res, next);
});

router.post('/insertPatientOrderPage', (req, res, next) => {
  api.insertOrd(req, res, next);
});

router.post('/insertPatientOrderPage', (req, res, next) => {
  api.insertOrd(req, res, next);
});

module.exports = router;