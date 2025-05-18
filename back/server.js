const express = require('express');
const multer = require('multer');
const cors = require('cors')
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors({ origin: "*" }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = 3000;
app.use(express.json());

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage, limits: {
        fieldSize: 5 * 1024 * 1024
    }
});

// Upload endpoint
app.post('/news', upload.single('image'), async (req, res) => {
    try {
        console.log('HELLO NEWS')
        const { title, content } = req.body;

        const imagePath = req.file ? req.file.path : null;
        console.log(title, content, imagePath)

        const result = await pool.query(
            'INSERT INTO posts(title, img, content) VALUES ($1, $2, $3) RETURNING *',
            [title, imagePath, content]
        );

        res.status(201).json({ post: result.rows[0] });
    } catch (err) {
        console.error('Insert failed:', err);
        res.status(500).json({ error: 'Failed to insert post' });
    }
});

app.put('/news/:id', upload.single('image'), async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const updateFields = ['title = $1', 'content = $2'];
        const values = [title, content];

        if (imagePath) {
            updateFields.push('img = $3');
            values.push(imagePath);
        }

        const query = `
      UPDATE posts
      SET ${updateFields.join(', ')}
      WHERE id = $${values.length + 1}
      RETURNING *;
    `;

        values.push(postId); // Add ID as last parameter

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post: result.rows[0] });
    } catch (err) {
        console.error('Update failed:', err);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

app.get('/news', async (req, res) => {
    console.log('NEWS')
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const result = await pool.query(
            'SELECT * FROM posts ORDER BY id DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json(
            result.rows.map(({ img, ...rest }) => ({
                ...rest,
                image: img,
            }))
        );
    } catch (err) {
        console.error('Fetch failed:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
app.get('/news/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id, req.originalUrl)

    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post: result.rows[0] });
    } catch (err) {
        console.error('Fetch by ID failed:', err);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

app.get('/hello', async (req, res) => {
    return res.send("Hello")
})


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
