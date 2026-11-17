const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fishid';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
console.log(`Attempting to connect to MongoDB at ${MONGO_URI}...`);
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('SUCCESS: Connected to local MongoDB database successfully!');
  })
  .catch((err) => {
    console.error('ERROR: Database connection failed. Details:', err.message);
    console.error('Please make sure MongoDB service is active on port 27017.');
  });

// Schemas & Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ScanSchema = new mongoose.Schema({
  species: { type: String, required: true },
  confidence: { type: Number, required: true },
  disease: { type: String, default: 'Healthy' },
  freshness: { type: String, default: 'N/A' },
  quantity: { type: Number, default: 1 },
  location: {
    lat: { type: Number, default: 0 },
    lon: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now },
  userEmail: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);
const Scan = mongoose.model('Scan', ScanSchema);

// REST API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED' });
});

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered.' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    console.log(`[AUTH] Registered new user: ${email}`);
    
    res.status(201).json({ message: 'Registration successful!', user: { name, email } });
  } catch (err) {
    console.error('[AUTH] Registration error:', err.message);
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// User Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    console.log(`[AUTH] User logged in: ${email}`);
    res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

// Sync Scans Route (Bulk upload)
app.post('/api/scans/sync', async (req, res) => {
  const { scans, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'User email is required for synchronization.' });
  }

  if (!scans || !Array.isArray(scans)) {
    return res.status(400).json({ message: 'Invalid payload: "scans" must be an array.' });
  }

  try {
    const savedScans = [];
    for (const scanData of scans) {
      const newScan = new Scan({
        species: scanData.species,
        confidence: scanData.confidence,
        disease: scanData.disease || 'Healthy',
        freshness: scanData.freshness || 'N/A',
        quantity: scanData.quantity || 1,
        location: {
          lat: scanData.location?.lat || 0,
          lon: scanData.location?.lon || 0
        },
        timestamp: scanData.timestamp ? new Date(scanData.timestamp) : new Date(),
        userEmail: email
      });
      await newScan.save();
      savedScans.push(newScan);
    }

    console.log(`[SYNC] Synchronized ${savedScans.length} scans for user: ${email}`);
    res.status(200).json({ message: 'Sync complete!', count: savedScans.length, scans: savedScans });
  } catch (err) {
    console.error('[SYNC] Sync error:', err.message);
    res.status(500).json({ message: 'Server error during data sync.', error: err.message });
  }
});

// Get Scan History Route
app.get('/api/scans/history/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const history = await Scan.find({ userEmail: email }).sort({ timestamp: -1 });
    res.status(200).json({ count: history.length, history });
  } catch (err) {
    console.error('[HISTORY] Fetch history error:', err.message);
    res.status(500).json({ message: 'Server error retrieving history.', error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`FishID Backend API server is active on Port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`=================================================`);
});
