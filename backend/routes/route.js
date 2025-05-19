const Blog = require('../models/Blog');
const multer = require('multer')

module.exports = (app, cors) => {
    app.get('/', async (req, res) => {
        try {
            const blog = new Blog({ title: 'test', author: 'test_author' });
            await blog.save();
            res.status(200).json({ message: 'App is running and blog saved' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save blog', details: error.message });
        }
    });
    let corsOptions = {
        origin: ['http://localhost:3000'],
    }

    const upload = multer({ dest: './public/data/uploads/' })

    app.post('/upload', cors(corsOptions), upload.single('file'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log(req.file)
        return res.status(200).json({ 'message': 'upload success' })
    })
};
