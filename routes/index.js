var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Newbies Game Jam', latestJamDir: "2023-2" });
});

router.get('/2023-2/', function(req, res, next) {
  res.render('2023-2/index', { title: 'Newbies 4' });
});

router.get('/2023-2/results', function(req, res, next) {
  res.render('2023-2/results', { title: 'Vote Results 4', cssFileName: "votes.css" });
});

module.exports = router;
