const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MySQLStore = require('express-mysql-session')(session);

// const options = {
//   databaseInformation/Login
// }

// const sessionStore = new MySQLStore(options);

// app.use(session({
//   key: "look_at_all_them_chickens",
//   secret: "the_cake_is_on_fire",
//   store: sessionStore,
//   resave: false,
//   saveUninitialized: false
// }))

const app = express();
const port = 3000;
app.use(express.static('static'));

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})
app.use(express.urlencoded({extended: true}));
app.use(express.json());

env.express(app);

app.get('/', (req, res) => {
  let data = {
    layout: 'layout.njk',
    siteName: 'UPC Stuff'
  }
  res.render('login.njk', data);
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