// This Code is Written By  -- ASIM HUSAIN

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Link = require('./models/Link');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://tinyurl-s8jg.onrender.com' // Paste Frontend Link Here...
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Home Route (for Render health check)
app.get('/', (req, res) => {
  res.send('🌐 URL Shortener Backend is Live');
});

// ✅ Shorten Route
app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    const shortId = nanoid(6);
    const newLink = await Link.create({ originalUrl, shortId });

    res.json({
      shortUrl: `https://tinyurl-s8jg.onrender.com/${shortId}`, // Paste Frontend Link Here...
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Unshorten Route
app.post('/unshorten', async (req, res) => {
  const { shortUrl } = req.body;

  if (!shortUrl) {
    return res.status(400).json({ error: 'Short URL is required' });
  }

  try {
    const url = new URL(shortUrl);
    const shortId = url.pathname.split('/').filter(Boolean).pop();

    if (!shortId) {
      return res.status(400).json({ error: 'Invalid short URL' });
    }

    const link = await Link.findOne({ shortId });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ originalUrl: link.originalUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Redirect Route
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const link = await Link.findOne({ shortId });

    if (link) {
      return res.redirect(link.originalUrl);
    }

    res.status(404).send('Short URL not found');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));