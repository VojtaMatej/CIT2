require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI);
.then(() => console.log('✅ Připojeno k MongoDB'))
.catch(err => console.error('❌ Chyba připojení k MongoDB:', err));

// Definice schématu a modelu
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// Endpointy
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Chyba serveru' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: 'Chyba při ukládání příspěvku' });
  }
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`🚀 Server běží na http://localhost:${PORT}`);
});
