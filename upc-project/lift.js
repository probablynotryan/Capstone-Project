const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const port = 3000;
const myUserName = 'testUser';
const myPassword = 'testPassword';


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

// env.express(app);

app.get('/', (req, res) => {
  if (req.session.key){
    res.render('index.njk', {layout: 'layout.njk'})
  } else {
  res.render('login.njk');
  }
});

// handleGetLogin : async (res, req) => {
//   if (res.session.view) {
//     routeName = 'loggedInPlayer'
//   } else {
//     routeName = "login"
//   }
//   normally koa body parse info would go here
//   change routeName info in route
//   method called in get/post request, send that to the render
// }


app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})