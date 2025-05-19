const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    s3Key: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    kmsKeyId: { type: String }, // Optional: if you're using custom KMS key
    metadata: {
        userId: { type: String }, // Optional fields for future use
        description: { type: String },
        s3Response: {type: Object}
    }
});

const file = mongoose.model('File', fileSchema);
module.exports = file;
