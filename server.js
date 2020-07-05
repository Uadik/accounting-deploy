const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const path = require('path');

// api
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const positions = require('./routes/api/positions');
const docfiles = require('./routes/api/docfiles');
const employees = require('./routes/api/employees');
const companies = require('./routes/api/companies');

const server = express();

connectDB();

// Body parser setup
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

//enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});

server.use('/api/users', users);
server.use('/api/profile', profile);
server.use('/api/companies', companies);
server.use('/api/positions', positions);
server.use('/api/documents', docfiles);
server.use('/api/employees', employees);

// Serve static assets in prod
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  server.use(express.static('client/build'));

  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on ${port}`));
