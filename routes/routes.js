var express = require('express');
var mongodb = require('../db');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  mongodb.getDash(res);
});

router.get('/key', function (req, res) {
  mongodb.getValkey(res);
});
router.get('/block/:kind', function (req, res) {
  var kind = req.params.kind;
  mongodb.getBlock(kind, res);
});
router.get('/topkey/:value', function (req, res) {
  var value = req.params.value;
  mongodb.getTopKey(value, res);
});
router.get('/toplink/:value', function (req, res) {
  var value = req.params.value;
  mongodb.getTopLink(value, res);
});
router.get('/link', function (req, res) {
  mongodb.getVallink(res);
});
router.get('/linkbykey', function (req, res) {
  mongodb.getVallinkbykey(res);
});
router.get('/key-detail/:keysearch', function (req, res) {
  var key = req.params.keysearch;
  mongodb.getkeyDetail(key, res);
});
router.get('/top10key/:key', function (req, res) {
  var key = req.params.key;
  mongodb.getlinkbytop10key(key, res);
});
router.get('/linkbykey-detail/:link', function (req, res) {
  var key = req.params.link;
  mongodb.getlinkbykeyDetail(key, res);
});
router.get('/linkbylink-detail/:link', function (req, res) {
  var key = req.params.link;
  mongodb.getlinkbylinkDetail(key, res);
});
router.post('/values', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var val = req.body.value;
  var date = req.body.date;
  if (val === undefined || val === "") {
    res.send(JSON.stringify({ status: "error", value: "Value undefined" }));
    return
  }
  mongodb.sendVal(val, date, res);
});
router.post('/links', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var val = req.body.value;
  var link = req.body.link;
  var title = req.body.title;
  var date = req.body.date;
  if (val === undefined || val === "") {
    res.send(JSON.stringify({ status: "error", value: "Value undefined" }));
    return
  }
  mongodb.sendLink(val, link, title, date, res);
});
router.post('/toplinks', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var name = req.body.name;
  var date = req.body.date;
  var value = req.body.value;
  if (value === undefined || value === "") {
    res.send(JSON.stringify({ status: "error", value: "Value undefined" }));
    return
  }
  mongodb.sendtopLink(name, date, value, res);
});
router.post('/updatetoplink', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var top = req.body.top;
  var title = req.body.title;
  var link = req.body.link;
  var total = req.body.total;
  var index = req.body.index;
  var timename = req.body.timename;
  if (index === undefined || index === "") {
    res.send(JSON.stringify({ status: "error", value: "Value undefined" }));
    return
  }
  mongodb.updatetoplink(timename, index, top, title, link, total, res);
});
router.post('/updatetopkey', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var top = req.body.top;
  var key = req.body.key;
  var total = req.body.total;
  var index = req.body.index;
  var timename = req.body.timename;
  if (index === undefined || index === "") {
    res.send(JSON.stringify({ status: "error", value: "Value undefined" }));
    return
  }
  mongodb.updatetopkey(timename, index, top, key, total, res);
});

router.post('/delblock', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var kind = req.body.kind;
  var value = req.body.value;
  if (kind === undefined || kind === "") {
    res.send(JSON.stringify({ status: "error", value: "kink undefined" }));
    return
  }
  mongodb.delblock(kind, value, res);
});
router.post('/addblock', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var kind = req.body.kind;
  var value = req.body.value;
  if (kind === undefined || kind === "") {
    res.send(JSON.stringify({ status: "error", value: "kink undefined" }));
    return
  }
  mongodb.addblock(kind, value, res);
});
// router.get('/creatnewtop', function(req, res) {
//   // mongodb.creatnewtop("topkeyall");
//   // mongodb.creatnewtop("topkeyyear");
//   // mongodb.creatnewtop("topkeymonth");
//   // mongodb.creatnewtop("topkeyweek");
//   // mongodb.creatnewtop("toplinkall");
//   // mongodb.creatnewtop("toplinkyear");
//   mongodb.creatnewtop("toplinkmonth");
//   // mongodb.creatnewtop("toplinkweek");
// });
router.delete('/values/:id', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var uuid = req.params.id;
  if (uuid === undefined || uuid === "") {
    res.send(JSON.stringify({ status: "error", value: "UUID undefined" }));
    return
  }
  mongodb.delVal(uuid);
  res.send(JSON.stringify({ status: "ok", value: uuid }));
});

module.exports = router;
