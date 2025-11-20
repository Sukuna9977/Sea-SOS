const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/Users/userRoutes');
const urgenceRouter = require('./routes/urgence/urgence');
const authRouter = require('./routes/authentificationRoutes');
const resetPassword = require('./routes/resetPasswordRoute');
const patrolRouter = require('./routes/patrolRoutes');
const boatRouter = require('./routes/boatRoutes'); 

var app = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:54287',"http://localhost:55218","http://10.0.2.2"];

app.use(cors({}));
app.enable('trust proxy');

app.use(logger('dev'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// === ADD HEALTH CHECKS ===
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ 
    status: 'ready', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Sea-SOS Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/urgences', urgenceRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/resetpwd', resetPassword);
app.use('/api/patrols', patrolRouter);
app.use('/api/boats', boatRouter);
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB (with error handling)
mongoose.set('strictQuery', true);
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database! ');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    // Don't exit - allow app to run without DB
  });
}

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ error: err });
});

app.set('port', 3030);

// Only start server if this file is run directly
if (require.main === module) {
  const server = http.createServer(app);
  const { io } = require("./utils/socketjs");
  io.attach(server);
  
  server.listen(3030, () => {
    console.log('Server running on port 3030');
  });
}

module.exports = app;
