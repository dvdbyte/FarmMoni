const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db'); // Removed 'path' as it's not needed if we remove static serving

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// 1. CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",                 
  "https://farmmonie.onrender.com"     
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy Error'), false);
    }
    return callback(null, true);
  },
  credentials: true 
}));

// 2. Helmet Configuration (Updated)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

// 4. Basic Root Route (for testing if server is alive)
app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));