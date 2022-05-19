const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const config = require('./config/default');
const app = express();
// const router = express.Router();
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
  req.session.key = req.body.userName;
  res.render('index.njk', {layout: 'layout.njk'});
})

app.post('/scan-try', (req, res) => {
  let output = '';
  if (req.body.scan_value.length != 12) {
    res.render('index.njk', {layout: 'layout.njk', output: 'that aint no upc, try again'});
    return;
  }
  db.query(`SELECT * FROM upc_db.upcs WHERE upc_value = ${req.body.scan_value}`, function (err, result, fields) {
    if (err) throw err;
    if (result) {
      if (result.length > 0) {
          let data = {
            layout: 'layout.njk',
            name_of_item: result[0].item_name,
            og_founder: result[0].og_scanner,
            id_num: result[0].upc_num
          }
          res.render('index.njk', data)
          console.log(result);
          return;
        } else {
          console.log(req.session.key);
          res.render('addupc.njk', {layout: 'layout.njk', upc_value: req.body.scan_value, user: req.session.key});
          return;
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

app.get('/item_details/:id', (req, res) => {
  db.query(`SELECT * FROM upc_db.upcs WHERE upc_num = ${req.params.id}`, function (err, result, fields) {
    if (err) throw err;
    if (result) {
      console.log(result[0].item_name)
      res.send(result[0].item_name + " from " + result[0].brand_name + " " + result[0].item_size)
    }
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})



/*

app.use('/api/', require('./routes/index'))
 // routes/index.js
const express = require('express')
const router  = express.Router()


router.use('/user', require('./userRoutes'))
router.use('/auth', require('./authRoutes'))

module.exports = router


//  authRoutes.jsconst express = require('express')
const router  = express.Router()
const passport = require('passport')
*/


/*
//  /api/auth/status

router.get("/status", (req, res) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

//  /api/auth/discord
router.get("/discord", passport.authenticate('discord'));

//  /api/auth/discord/redirect
router.get("/discord/redirect", passport.authenticate('discord'), (req, res) => {
  res.redirect('http://localhost:3000/editmemberform')
});


module.exports = router
*/

/*
//userRoutes.js

const express = require('express')
const router  = express.Router()
const { getUsers, createUser, editUser, deleteUser} = require('../controllers/userController')

router.route('/').get(getUsers).post(createUser)
router.route('/:id').put(editUser).delete(deleteUser)


module.exports = router
*/