const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = 3000;

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('static'));
env.express(app);

app.get('/', (req, res) => {
  res.render('index.njk', {layout: 'layout.njk'});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})