const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const config = require('./config/default');
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

// const options = {
//   databaseInformation/Login
// }

// const sessionStore = new MySQLStore(options);

app.use(session({
  // key: "look_at_all_them_chickens",
  secret: "the_cake_is_on_fire",
  // store: sessionStore,
  cookie: {maxAge: 84600000},
  resave: false,
  saveUninitialized: false
}))

const testNum = "012345678910";

db.query(`SELECT * FROM upc_db.upcs WHERE upc_value = ${testNum}`, function (err, result, fields) {
  if (err) throw err;
  result.map(r => console.log(r))
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
  req.session.key = 'logged-in';
  res.render('index.njk', {layout: 'layout.njk'});
})


app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})