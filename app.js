const express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  moment = require('moment');
moment().format();

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 8000;

app.get('/', function (req, res) {
  res.render('landing.ejs', {host: req.host})
});

app.get('/:timestamp', function (req, res) {
  const timestamp = req.params.timestamp;
  let unix, natural = null;

  if (+timestamp >= 0) {
    unix = +timestamp;
    natural = naturalToUnix(unix);
  }

  if (isNaN(+timestamp) && moment(timestamp, 'MMMM DD, YYYY').isValid()) {
    unix = naturalToUnix(timestamp);
    natural = unixToNatural(unix);
  }

  res.json({
    'unix': unix,
    'natural': natural
  });

  console.log(req.host)

});

function naturalToUnix(timestamp) {
  return moment(timestamp, 'MMMM DD, YYYY').format('X');
}

function unixToNatural(unix) {
  return moment.unix(unix).format('MMMM DD, YYYY');
}

app.listen(port, function () {
  console.log('Our app is running on http://localhost:' + port);
});

module.exports = app;