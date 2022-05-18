const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const config = require('./config/default');
const e = require('express');
const app = express();
const port = 3000;

const db = mysql.createConnection(config.db);

app.use(express.static('static'));
app.use(cookieParser());
const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  key: "look_at_all_them_chickens",
  secret: "the_cake_is_on_fire",
  // store: sessionStore,
  cookie: {maxAge: 84600000},
  resave: false,
  saveUninitialized: false
}))

db.query(`SELECT * FROM upc_db.upcs`, function (err, result, fields) {
  if (err) throw err;
  result.map(r => console.log(r.upc_value))
  });
;

app.get('/', (req, res) => {
  if (req.session.key){
    res.render('index.njk', {layout: 'layout.njk'})
  } else {
  res.render('login.njk');
  }
});

app.post('/login', (req, res) => {
  console.log(req.body.userName);
  req.session.key = req.body.login;
  res.render('index.njk', {layout: 'layout.njk'});
})

app.post('/scan-try', (req, res) => {
  let output = '';
  if (req.body.scan_value.length != 14) {
    res.render('index.njk', {layout: 'layout.njk', output: 'that aint no upc, try again'});
    return;
  }
  db.query(`SELECT * FROM upc_db.upcs WHERE upc_value = ${req.body.scan_value}`, function (err, result, fields) {
    if (err) throw err;
    if (result) {
      if (result.length > 0) {
      result.map(r => {
            output = output.concat(`${r.item_name} has been captured by ${r.og_scanner}`);
          })
        } else {
          output = 'Has yet to be scanned (YOUS AN OG);';
        }
      let data = {
        layout: "layout.njk",
        output: output
      }
      console.log(data);
    res.render('index.njk', data)
    } 
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})