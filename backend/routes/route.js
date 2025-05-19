const Blog = require('../models/Blog');
const File = require('../models/File');
const multer = require('multer')
const s3 = require('../aws/config')
const fs = require('fs')
const path = require('path')

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

    app.post('/upload', cors(corsOptions), upload.single('file'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.file;
        const fileStream = fs.createReadStream(file.path);
        const s3Key = `${Date.now()}_${file.originalname}`;


        const params = {
            Bucket: 'c99bucket',
            Key: s3Key,
            Body: fileStream,
            ContentType: file.mimetype,
            ServerSideEncryption: 'aws:kms', // KMS-based encryption
            // SSEKMSKeyId: 'your-kms-key-id', // Optional custom KMS key
        };

        const s3Response = await s3.upload(params).promise();
        const newFile = new File({
            originalName: file.originalname,
            s3Key: s3Key,
            mimeType: file.mimetype,
            size: file.size,
            kmsKeyId: '', // optional, if you used custom KMS key
            metadata: {
                userId: 'test-user', // placeholder
                description: 'Uploaded via API',
                s3Response:s3Response
            }
        });
        await newFile.save();
        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'File uploaded and saved', s3Response });
    })
};
