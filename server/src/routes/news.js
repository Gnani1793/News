const express = require('express');
const axios = require('axios');
const News = require('../models/News');

const router = express.Router();

// Fetch news from an external API
router.get('/fetch', async (req, res) => {
  try {
    const response = await axios.get('https://newstoday.com/api/v1/latest-news');
    const newsData = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
    }));
    await News.insertMany(newsData);
    res.json({ msg: 'News fetched and stored in the database' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// CRUD operations for news
router.get('/', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { title, description, url, publishedAt } = req.body;
  try {
    const newNews = new News({ title, description, url, publishedAt });
    await newNews.save();
    res.json(newNews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, url, publishedAt } = req.body;
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { title, description, url, publishedAt },
      { new: true }
    );
    res.json(updatedNews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await News.findByIdAndRemove(req.params.id);
    res.json({ msg: 'News removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
