const Blog = require('../models/Blog');

module.exports = (app) => {
    app.get('/', async (req, res) => {
        try {
            const blog = new Blog({ title: 'test', author: 'test_author' });
            await blog.save();
            res.status(200).json({ message: 'App is running and blog saved' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save blog', details: error.message });
        }
    });
};
