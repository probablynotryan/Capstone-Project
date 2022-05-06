const express = require('express');
const app = express();
const port = 3000;
const nunjucks = require('nunjucks');
const env = nunjucks.configure('', {
  autoescape: true,
  express: app,
  watch: true
})
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('static'));
env.express(app);

app.get('/', (req, res) => {
  res.render('index.html', {})
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
})