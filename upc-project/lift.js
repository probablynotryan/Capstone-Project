const express = require('express');
const nunjucks = require('nunjucks');

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

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})