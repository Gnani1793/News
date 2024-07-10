const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('./models/User');

const app = express();
const PORT = 5000;
const NEWS_API_KEY = 'a71e01382c804e47beb32aa59b1f03ed';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://gnani:gnani1744@cluster0.eflmm3u.mongodb.net/gnani?retryWrites=true&w=majority', {
  // Removed deprecated options
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  newUser.save()
    .then(() => res.json({ success: true }))
    .catch(err => res.json({ success: false, message: err.message }));
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ success: false, message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, 'secretkey');
  res.json({ success: true, token });
});

// Fetch News
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'in',
        apiKey: NEWS_API_KEY,
      },
    });
    res.json(response.data.articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
