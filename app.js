const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const employeeController = require('./controllers/employeeController');

// App initialization
const app = express();
app.set('view engine', 'ejs');
// app.use(express.static('./public'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'my_super_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

const privateRoute = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'Server is up & running' });
});

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/login');
});
app.use('/login', authController);
app.use('/admin', privateRoute, adminController);
app.use('/employee', privateRoute, employeeController);

// Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log('Server is running at ', PORT);
});
