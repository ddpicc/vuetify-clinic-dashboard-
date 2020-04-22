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

router.delete('/deleteOrdbyId', (req, res, next) => {
  api.deleteOrdbyId(req, res, next);
});

router.get('/getAllPatient', (req, res, next) => {
  api.getAllPatient(req, res, next);
});

router.post('/insertPatientOrderPage', (req, res, next) => {
  api.insertPatientOrderPage(req, res, next);
});

router.post('/insertPatientDetailPage', (req, res, next) => {
  api.insertPatientDetailPage(req, res, next);
});

router.get('/findPatientByPinyin', (req, res, next) => {
  api.findPatientByPinyin(req, res, next);
});

router.get('/getPatientInfo', (req, res, next) => {
  api.getPatientInfo(req, res, next);
});

router.get('/getTokenFromLogin', (req, res, next) => {
  api.getTokenFromLogin(req, res, next);
});

router.get('/getUserInfo', (req, res, next) => {
  api.getUserInfo(req, res, next);
});

router.get('/getLast30Days', (req, res, next) => {
  api.getLast30Days(req, res, next);
});

router.post('/saveUserSetting', (req, res, next) => {
  api.saveUserSetting(req, res, next);
});

router.get('/getUserSetting', (req, res, next) => {
  api.getUserSetting(req, res, next);
});

module.exports = router;