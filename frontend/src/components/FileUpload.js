import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {


    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    }

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file')
            return
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setMessage('Uploading File')
            const res = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-requested-with': 'react'
                }
            });

            
            console.log(res.data);  // ✅ use res.data instead of res.json()
            setMessage(res.data.s3Response.Location +' | '+ res.data.s3Response.SSEKMSKeyId);

        } catch (error) {
            console.log('Upload error:', error);
            setMessage('Upload failed');
        }
    }


    return (
        <div div style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                width: '500px',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}>
                <h3>Upload File</h3>
                <input type="file" onChange={handleFileChange} />
                <br /><br />
                <button onClick={handleUpload}>Upload</button>
                <p>{message}</p>
            </div>

        </div>
    );
};

export default FileUpload;
