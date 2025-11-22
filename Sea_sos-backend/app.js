const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

// === ADD PROMETHEUS METRICS ===
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are default buckets.
});

// Create custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5], // buckets for response time from 1ms to 5s
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const databaseStatus = new client.Gauge({
  name: 'database_connection_status',
  help: 'Database connection status (1 = connected, 0 = disconnected)',
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

var app = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:54287',"http://localhost:55218","http://10.0.2.2"];

app.use(cors({}));
app.enable('trust proxy');

app.use(logger('dev'));

// === ADD METRICS MIDDLEWARE ===
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration / 1000); // Convert to seconds
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// === ADD METRICS ENDPOINT ===
app.get('/metrics', async (req, res) => {
  try {
    // Update database status metric
    databaseStatus.set(mongoose.connection.readyState === 1 ? 1 : 0);
    
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error);
  }
});

// === EXISTING HEALTH CHECKS ===
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
    databaseStatus.set(1); // Set metric to connected
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    databaseStatus.set(0); // Set metric to disconnected
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
    console.log('Metrics available at http://localhost:3030/metrics');
  });
}

module.exports = app;
